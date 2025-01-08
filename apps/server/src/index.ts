import Fastify from "fastify";
import fastifyHelmet from "@fastify/helmet";
import fastifyCors from "@fastify/cors";
import fastifyRateLimit from "@fastify/rate-limit";
import { healthRoute, leagueRoute } from "./routes/index.js";
import { isProd } from "@kickstock/shared/src/lib/env-util.js";
import { StockSocketServer } from "./socket/server.js";

const PORT = parseInt(process.env.PORT || "4000") || 4000;
const TRUST_PROXY = ["127.0.0.1", "::1"];
const API_PREFIX = "/api/v1";
const CORS_ORIGINS = isProd
  ? [
      "https://kick-stock.onrender.com",
      "http://localhost:4001",
      "http://127.0.0.1:4001",
    ]
  : ["http://localhost:4001", "http://127.0.0.1:4001"];

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

fastify.addHook("preHandler", (request, reply, done) => {
  const origin = request.headers.origin;

  if (origin && CORS_ORIGINS.includes(origin)) {
    reply.header("Access-Control-Allow-Origin", origin);
    reply.header("Access-Control-Allow-Credentials", "true");

    if (request.method === "OPTIONS") {
      reply.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
      );
      reply.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Requested-With, Origin, Accept"
      );
    }
  }
  done();
});

fastify.addHook("onRequest", async (request, reply) => {
  const origin = request.headers.origin;
  if (origin && CORS_ORIGINS.includes(origin)) {
    reply.header("Access-Control-Allow-Origin", origin);
    reply.header("Access-Control-Allow-Credentials", "true");
  }
});

fastify.addHook("onSend", async (request, reply) => {
  const origin = request.headers.origin;
  if (origin && CORS_ORIGINS.includes(origin)) {
    reply.header("Access-Control-Allow-Origin", origin);
    reply.header("Access-Control-Allow-Credentials", "true");
  }
});

fastify.register(fastifyCors, {
  origin: (origin, cb) => {
    if (!origin || CORS_ORIGINS.includes(origin)) {
      cb(null, true);
      return;
    }
    fastify.log.warn(`Blocked request from unauthorized origin: ${origin}`);
    cb(new Error("Not allowed by CORS"), false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Origin",
    "Accept",
  ],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  credentials: true,
  maxAge: 86400,
  preflight: true,
  strictPreflight: false,
});
await fastify.register(fastifyHelmet, {
  global: true,
  crossOriginResourcePolicy: false,
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", ...CORS_ORIGINS],
      connectSrc: [
        "'self'",
        ...CORS_ORIGINS,
        "ws://localhost:*",
        "wss://kick-stock.onrender.com",
        "https://api.steampowered.com",
        "https://cdn.jsdelivr.net",
      ],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      workerSrc: ["'self'", "blob:"],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
    },
  },
  xssFilter: false,
  noSniff: false,
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

const start = async () => {
  try {
    const address = await fastify.listen({
      port: PORT,
      host: process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1",
    });
    fastify.log.info(`서버가 실행되었습니다: ${address}`);
    const socket = new StockSocketServer(fastify);
    fastify.io = socket.getIO();
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
