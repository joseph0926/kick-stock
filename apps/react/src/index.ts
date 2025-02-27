import Fastify from "fastify";
import path from "path";
import fastifyStatic from "@fastify/static";
import fastifyCompress from "@fastify/compress";
import fastifyHelmet from "@fastify/helmet";
import fastifyCors from "@fastify/cors";
import fastifyRateLimit from "@fastify/rate-limit";
import { rootSteam } from "./server/steam";
import dotenv from "dotenv";
import { redisRoute } from "./server/routes/redis.route";
import { cdnCacheRoute } from "./server/routes/cdn.route";
import { isProd } from "@kickstock/shared/src/lib/env-util";

dotenv.config();

const PORT = parseInt(process.env.PORT || "4001") || 4001;
const TRUST_PROXY = ["127.0.0.1", "::1"];

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
          defaultSrc: ["'self'", "https://api-kick-stock.onrender.com"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            "https://api-kick-stock.onrender.com",
          ],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: [
            "'self'",
            "https://api-kick-stock.onrender.com",
            "wss://api-kick-stock.onrender.com",
            "https://api.steampowered.com",
            "https://cdn.jsdelivr.net",
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
          connectSrc: [
            "'self'",
            "ws://localhost:*",
            "http://localhost:*",
            "https://api.steampowered.com",
            "https://cdn.jsdelivr.net",
          ],
          workerSrc: ["'self'", "blob:"],
        },
      },
});

fastify.register(fastifyCors, {
  origin: (_origin, cb) => {
    cb(null, true);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "x-cache-secret",
    "x-cache-env",
  ],
  exposedHeaders: ["Content-Length", "Content-Range"],
  credentials: true,
  maxAge: 86400,
  preflight: true,
  strictPreflight: false,
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

fastify.register(fastifyCompress, {
  global: true,
  encodings: ["gzip"],
  threshold: 0,
  zlibOptions: {
    level: 9,
  },
});

if (isProd) {
  fastify.register(fastifyStatic, {
    root: path.resolve(process.cwd(), "dist/client"),
    prefix: "/client/",
    decorateReply: false,
    serve: true,
    preCompressed: true,
    extensions: ["gz"],
  });

  fastify.register(fastifyStatic, {
    root: path.join(process.cwd(), "public"),
    prefix: "/public/",
    decorateReply: false,
    serve: true,
  });
}

fastify.register(rootSteam);
fastify.register(redisRoute);
fastify.register(cdnCacheRoute);

const start = async () => {
  try {
    const address = await fastify.listen({
      port: PORT,
      host: process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1",
    });
    fastify.log.info(`서버가 실행되었습니다: ${address}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

const shutdown = async () => {
  try {
    fastify.log.info("서버를 종료합니다...");
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
