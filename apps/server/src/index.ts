import Fastify from "fastify";
import { healthRoute, clubRoute } from "./routes/index.js";
import { stockRoute } from "./routes/stock.route.js";

const PORT = 4000;
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

fastify.register(healthRoute, { prefix: "/health" });
fastify.register(clubRoute, { prefix: `${API_PREFIX}/clubs` });
fastify.register(stockRoute, { prefix: `${API_PREFIX}/stock` });

const start = async () => {
  try {
    const address = await fastify.listen({ port: PORT });
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
