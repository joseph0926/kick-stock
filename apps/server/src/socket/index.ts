import { Server as SocketIoServer, Socket } from "socket.io";
import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { isProd } from "@kickstock/shared/src/lib/env-util.js";
import { ClubCache } from "@kickstock/redis/src";

const prisma = new PrismaClient();
let clubCachePromise: Promise<ClubCache> | null = null;

if (isProd) {
  clubCachePromise = ClubCache.getInstance();
}

interface UpdateClubValueData {
  clubId: string;
  year: string;
  KRW: number;
}

export class StockSocketServer {
  private io: SocketIoServer;
  private fastify: FastifyInstance;
  private clubCache: ClubCache | null = null;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
    this.io = new SocketIoServer(fastify.server, {
      cors: {
        origin: isProd ? ["https://kick-stock.onrender.com"] : true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
        maxAge: 86400,
      },
    });

    this.initializeCache().then(() => {
      this.setupSocketHandlers();
    });
  }

  private async initializeCache() {
    if (isProd) {
      try {
        this.clubCache = await Promise.race([
          ClubCache.getInstance(),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 100)),
        ]);
      } catch (error) {
        this.fastify.log.error("[server]: Cache 초기화 실패:", error);
      }
    }
  }

  private async getClubValue(clubId: string, year: string) {
    if (this.clubCache) {
      const cachedValue = await this.clubCache.getClubValue(clubId, year);
      if (cachedValue) return cachedValue;
    }

    const dbValue = await prisma.clubValue.findFirst({
      where: {
        AND: [{ clubId }, { year }],
      },
    });

    if (dbValue && this.clubCache) {
      await this.clubCache.setClubValue(clubId, year, dbValue);
    }

    return dbValue;
  }

  private setupSocketHandlers() {
    this.io.on("connection", (socket: Socket) => {
      this.fastify.log.info(`[server]: client 연결 성공: ${socket.id}`);

      socket.on(
        "requestClubValue",
        async (data: { clubId: string; year: string }) => {
          try {
            const clubValue = await this.getClubValue(data.clubId, data.year);
            socket.emit("clubValueResponse", clubValue);
          } catch (error) {
            this.fastify.log.error("[server]: club value 조회 실패:", error);
            socket.emit("error", "club value 조회 실패");
          }
        }
      );

      socket.on("updateClubValue", async (data: UpdateClubValueData) => {
        try {
          const updatedValue = await this.updateClubValue(data);
          this.io.emit("clubValueUpdated", {
            clubId: data.clubId,
            updatedValue,
          });
        } catch (error) {
          this.fastify.log.error("[server]: club value 업데이트 실패:", error);
          socket.emit("error", "club value 업데이트 실패");
        }
      });

      // TODO: 테스트용 - 제거 예정
      const intervalId = setInterval(() => {
        const randomValue = Math.floor(Math.random() * 1000);
        socket.emit("realTimeUpdate", {
          timestamp: new Date().toISOString(),
          value: randomValue,
          message: `실시간 업데이트: ${randomValue}`,
        });
      }, 5000);

      socket.on("clientMessage", (message: string) => {
        this.fastify.log.info(`[server]: 클라이언트 메시지 수신: ${message}`);
        socket.emit("serverResponse", `서버 응답: ${message} 받았습니다.`);
        this.io.emit("broadcastMessage", `브로드캐스트: ${message}`);
      });

      socket.on("disconnect", () => {
        clearInterval(intervalId);
        this.fastify.log.info(`[server]: client 연결 종료: ${socket.id}`);
      });
    });
  }

  private async updateClubValue(data: UpdateClubValueData) {
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
      .then(() =>
        prisma.clubValue.findFirst({
          where: {
            AND: [{ clubId: data.clubId }, { year: data.year }],
          },
          include: {
            club: true,
          },
        })
      );

    if (!updatedValue) {
      throw new Error("Club value not found after update");
    }

    if (this.clubCache) {
      await this.clubCache.setClubValue(data.clubId, data.year, updatedValue);
    }

    return updatedValue;
  }

  getIO() {
    return this.io;
  }
}
