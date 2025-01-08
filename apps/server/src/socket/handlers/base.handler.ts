import { Server as SocketIoServer, Socket } from "socket.io";
import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { ClubCache, LeagueCache } from "@kickstock/redis/src";

export abstract class BaseSocketHandler {
  protected io: SocketIoServer;
  protected fastify: FastifyInstance;
  protected prisma: PrismaClient;
  protected clubCache: ClubCache | null = null;
  protected leagueCache: LeagueCache | null = null;

  constructor(
    io: SocketIoServer,
    fastify: FastifyInstance,
    prisma: PrismaClient
  ) {
    this.io = io;
    this.fastify = fastify;
    this.prisma = prisma;
  }

  setCache(clubCache: ClubCache | null, leagueCache: LeagueCache | null) {
    this.clubCache = clubCache;
    this.leagueCache = leagueCache;
  }

  abstract registerHandlers(socket: Socket): void;
}
