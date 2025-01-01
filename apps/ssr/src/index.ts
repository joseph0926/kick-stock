import Fastify from "fastify";
import { rootSteam } from "./steam/index.js";
import path from "path";
import { fileURLToPath } from "url";
import fastifyStatic from "@fastify/static";
import fastifyCompress from "@fastify/compress";

const PORT = 4001;
const TRUST_PROXY = ["127.0.0.1", "::1"];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientDistPath = path.join(__dirname, "../../web/dist");
const ssrDistPath = path.join(__dirname, "../dist-ssr");

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

await fastify.register(fastifyCompress, {
  global: true,
  encodings: ["gzip"],
  threshold: 0,
  zlibOptions: {
    level: 9,
  },
});

fastify.register(fastifyStatic, {
  root: clientDistPath,
  prefix: "/dist/",
  serve: true,
  preCompressed: true,
  extensions: ["gz"],
});

fastify.register(fastifyStatic, {
  root: ssrDistPath,
  prefix: "/dist-ssr/",
  serve: true,
  decorateReply: false,
  preCompressed: true,
  extensions: ["gz"],
});

fastify.register(rootSteam);

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
