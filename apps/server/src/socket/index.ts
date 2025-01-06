import { isProd } from "@/lib/utils.js";
import { FastifyInstance } from "fastify";
import { Server as SocketIoServer } from "socket.io";

const createSocketIoServer = (fastify: FastifyInstance) => {
  try {
    const io = new SocketIoServer(fastify.server, {
      cors: {
        origin: isProd ? ["https://kick-stock.onrender.com"] : true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
        credentials: true,
        maxAge: 86400,
      },
    });

    io.on("connect", (socket) => {
      fastify.log.info(`client 연결: ${socket.id}`);

      socket.on("disconnect", () => {
        fastify.log.info(`client 연결 종료: ${socket.id}`);
      });
    });
    io.on("connect_error", (err) => {
      console.error("[server]: Socket.IO 연결에 실패하였습니다:", err);
    });

    return io;
  } catch (error) {
    console.error("[server]: Socket.IO 서버 생성에 실패하였습니다:", error);
    throw error;
  }
};

export { createSocketIoServer };
