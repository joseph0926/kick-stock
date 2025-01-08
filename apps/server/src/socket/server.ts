import { Server as SocketIoServer } from "socket.io";
import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { isProd } from "@kickstock/shared/src/lib/env-util.js";
import { ClubCache, LeagueCache } from "@kickstock/redis/src";
import { ClubSocketHandler } from "./handlers/club.handler.js";
import { LeagueSocketHandler } from "./handlers/league.handler.js";

const CORS_ORIGINS = isProd
  ? [
      "https://kick-stock.onrender.com",
      "http://localhost:4001",
      "http://127.0.0.1:4001",
    ]
  : ["http://localhost:4001", "http://127.0.0.1:4001"];

const prisma = new PrismaClient();

export class StockSocketServer {
  private io: SocketIoServer;
  private fastify: FastifyInstance;
  private clubCache: ClubCache | null = null;
  private leagueCache: LeagueCache | null = null;
  private clubHandler: ClubSocketHandler;
  private leagueHandler: LeagueSocketHandler;
  private activeClients: Set<string> = new Set();

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
    this.io = new SocketIoServer(fastify.server, {
      cors: {
        origin: CORS_ORIGINS,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
        maxAge: 86400,
      },
    });

    this.clubHandler = new ClubSocketHandler(this.io, this.fastify, prisma);
    this.leagueHandler = new LeagueSocketHandler(this.io, this.fastify, prisma);

    this.initializeCache().then(() => {
      this.clubHandler.setCache(this.clubCache, this.leagueCache);
      this.leagueHandler.setCache(this.clubCache, this.leagueCache);
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
        this.leagueCache = await Promise.race([
          LeagueCache.getInstance(),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 100)),
        ]);
      } catch (error) {
        this.fastify.log.error("[server]: Cache 초기화 실패:", error);
      }
    }
  }

  private setupSocketHandlers() {
    this.io.on("connection", (socket) => {
      this.fastify.log.info(`[server]: client 연결 성공: ${socket.id}`);

      this.activeClients.add(socket.id);

      if (this.activeClients.size === 1) {
        this.leagueHandler.startAllSimulations();
      }

      this.clubHandler.registerHandlers(socket);
      this.leagueHandler.registerHandlers(socket);

      socket.on("disconnect", () => {
        this.activeClients.delete(socket.id);
        this.fastify.log.info(`[server]: client 연결 종료: ${socket.id}`);

        if (this.activeClients.size === 0) {
          this.leagueHandler.stopAllSimulations();
        }
      });
    });
  }

  getIO() {
    return this.io;
  }
}
