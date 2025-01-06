import { Server as SocketIoServer, Socket } from "socket.io";
import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { isProd } from "@/lib/utils.js";
import { clubCache } from "@kickstock/redis/src";

const prisma = new PrismaClient();

interface UpdateClubValueData {
  clubId: string;
  year: string;
  KRW: number;
}

export class StockSocketServer {
  private io: SocketIoServer;
  private fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
    this.io = new SocketIoServer(fastify.server, {
      cors: {
        origin: isProd ? ["https://kick-stock.onrender.com"] : true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
        credentials: true,
        maxAge: 86400,
      },
    });

    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.on("connection", (socket: Socket) => {
      this.fastify.log.info(`Client connected: ${socket.id}`);

      socket.on(
        "requestClubValue",
        async (data: { clubId: string; year: string }) => {
          try {
            let clubValue = await clubCache.getClubValue(
              data.clubId,
              data.year
            );

            if (!clubValue) {
              clubValue = await prisma.clubValue.findFirst({
                where: {
                  AND: [{ clubId: data.clubId }, { year: data.year }],
                },
              });

              if (clubValue) {
                await clubCache.setClubValue(data.clubId, data.year, clubValue);
              }
            }

            socket.emit("clubValueResponse", clubValue);
          } catch (error) {
            this.fastify.log.error(
              "club value를 가져오는데 실패하였습니다:",
              error
            );
            socket.emit("error", "club value를 가져오는데 실패하였습니다");
          }
        }
      );

      socket.on("updateClubValue", async (data: UpdateClubValueData) => {
        try {
          const updatedValue = await prisma.clubValue
            .updateMany({
              where: {
                AND: [{ clubId: data.clubId }, { year: data.year }],
              },
              data: {
                KRW: data.KRW,
                EUR: data.KRW / 1400,
                USD: data.KRW / 1300,
                changeRate: 0,
              },
            })
            .then(async () => {
              return prisma.clubValue.findFirst({
                where: {
                  AND: [{ clubId: data.clubId }, { year: data.year }],
                },
                include: {
                  club: true,
                },
              });
            });

          if (!updatedValue) {
            this.fastify.log.error(
              `Club value not found after update for clubId: ${data.clubId}, year: ${data.year}`
            );
            socket.emit(
              "error",
              "club value를 업데이트하는데 실패하였습니다 - value not found"
            );
            return;
          }

          await clubCache.setClubValue(data.clubId, data.year, updatedValue);

          this.io.emit("clubValueUpdated", {
            clubId: data.clubId,
            updatedValue,
          });

          this.fastify.log.info(
            `Club value가 업데이트 되었습니다: ${updatedValue.club.name}`
          );
        } catch (error) {
          this.fastify.log.error(
            "club value를 업데이트하는데 실패하였습니다:",
            error
          );
          socket.emit("error", "club value를 업데이트하는데 실패하였습니다.");
        }
      });

      socket.on("disconnect", () => {
        this.fastify.log.info(`client 연결 종료: ${socket.id}`);
      });
    });

    this.io.on("connect_error", (err) => {
      this.fastify.log.error("[server]: Socket.IO 연결 에러:", err);
    });
  }

  getIO() {
    return this.io;
  }
}
