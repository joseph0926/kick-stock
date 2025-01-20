import Fastify from "fastify";
import fastifyHelmet from "@fastify/helmet";
import fastifyCors from "@fastify/cors";
import fastifyRateLimit from "@fastify/rate-limit";
import { healthRoute, leagueRoute } from "./routes/index.js";
import { isProd } from "@kickstock/shared/src/lib/env-util.js";
import { initializeSocketServer } from "./socket/server.js";
import { clubRoute } from "./routes/club.route.js";

const PORT = parseInt(process.env.PORT || "4000") || 4000;
const TRUST_PROXY = ["127.0.0.1", "::1"];
const API_PREFIX = "/api/v1";

const fastify = Fastify({
  trustProxy: process.env.NODE_ENV === "production" ? false : TRUST_PROXY,
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  connectionTimeout: 30000,
  keepAliveTimeout: 10000,
  maxRequestsPerSocket: 1000,
});

fastify.register(fastifyHelmet, {
  global: true,
  contentSecurityPolicy: isProd
    ? {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: [
            "'self'",
            "https://kick-stock.onrender.com",
            "wss://kick-stock.onrender.com",
          ],
          workerSrc: ["'self'", "blob:"],
          fontSrc: ["'self'", "data:", "https:"],
          mediaSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameSrc: ["'none'"],
        },
      }
    : {
        directives: {
          defaultSrc: ["'self'", "'unsafe-inline'", "http://localhost:*"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            "http://localhost:*",
          ],
          styleSrc: ["'self'", "'unsafe-inline'", "http://localhost:*"],
          imgSrc: ["'self'", "data:", "https:", "http://localhost:*"],
          connectSrc: ["'self'", "ws://localhost:*", "http://localhost:*"],
          workerSrc: ["'self'", "blob:"],
        },
      },
});

fastify.register(fastifyCors, {
  origin: isProd ? ["https://kick-stock.onrender.com"] : true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 86400,
  preflight: true,
  strictPreflight: true,
});

fastify.register(fastifyRateLimit, {
  max: 100,
  timeWindow: "1 minute",
  allowList: ["127.0.0.1"],
  skipOnError: false,
  errorResponseBuilder: function (_request, context) {
    return {
      code: 429,
      error: "Too Many Requests",
      message: `Rate limit exceeded, retry in ${context.after}`,
      date: Date.now(),
      expiresIn: context.after,
    };
  },
});

fastify.decorate("io");

fastify.register(healthRoute, { prefix: "/health" });
fastify.register(leagueRoute, { prefix: `${API_PREFIX}/league` });
fastify.register(clubRoute, { prefix: `${API_PREFIX}/club` });

const start = async () => {
  try {
    const { io, cleanup } = await initializeSocketServer(fastify);
    fastify.addHook("onClose", async () => {
      await cleanup();
    });
    const address = await fastify.listen({
      port: PORT,
      host: process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1",
    });
    fastify.log.info(`서버가 실행되었습니다: ${address}`);
    fastify.io = io;
    if (fastify.io) {
      fastify.log.info(`[server]: Socket.IO 서버가 실행되었습니다`);
    }
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

const shutdown = async () => {
  try {
    fastify.log.info("서버를 종료합니다...");
    if (fastify.io) {
      await new Promise<void>((resolve) => {
        fastify.io.close(() => {
          fastify.log.info("[server]: Socket.IO 서버가 종료되었습니다");
          resolve();
        });
      });
    }
    await fastify.close();
    process.exit(0);
  } catch (err) {
    fastify.log.error("서버 종료 중 오류 발생:", err);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

start();
