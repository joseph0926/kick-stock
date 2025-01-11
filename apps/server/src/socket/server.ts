import { Server } from "socket.io";
import { FastifyInstance } from "fastify";
import { isProd } from "@kickstock/shared/src/lib/env-util.js";
import { baseSocketHandler } from "./handlers/base.handler.js";

const CORS_ORIGIN = isProd
  ? ["https://kick-stock.onrender.com"]
  : ["http://localhost:4001", "http://127.0.0.1:4001"];

export const initializeSocketServer = async (fastify: FastifyInstance) => {
  try {
    const io = new Server(fastify.server, {
      cors: {
        origin: CORS_ORIGIN,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    const socketHandler = await baseSocketHandler(io, fastify);

    io.on("connection", socketHandler.handleConnection);

    const cleanup = async () => {
      try {
        await socketHandler.cleanup();
        fastify.log.info("[Socket Server] Cleanup completed");
      } catch (error) {
        fastify.log.error("[Socket Server] Cleanup failed:", error);
      }
    };

    process.on("SIGTERM", async () => {
      fastify.log.info("[Socket Server] SIGTERM received");
      await cleanup();
      process.exit(0);
    });

    process.on("SIGINT", async () => {
      fastify.log.info("[Socket Server] SIGINT received");
      await cleanup();
      process.exit(0);
    });

    return {
      io,
      cleanup,
    };
  } catch (error) {
    fastify.log.error("[Socket Server] Initialization failed:", error);
    throw error;
  }
};
