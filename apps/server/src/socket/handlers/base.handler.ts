import { Server, Socket } from "socket.io";
import { FastifyInstance } from "fastify";
import { createClubHandler } from "./club.handler.js";
import { createLeagueHandler } from "./league.handler.js";
import { prisma } from "@/lib/prisma.js";

export const baseSocketHandler = async (
  io: Server,
  fastify: FastifyInstance
) => {
  const clubHandler = createClubHandler();
  const leagueHandler = createLeagueHandler();
  await clubHandler.init();
  await leagueHandler.init();

  const clubSimulationIntervals = new Map<string, NodeJS.Timeout>();

  const leagueSubscriptions = new Map<string, Set<string>>();

  function startClubSimulation(clubId: string) {
    if (clubSimulationIntervals.has(clubId)) return;

    const interval = setInterval(async () => {
      try {
        const clubValues = await clubHandler.getCachedValues(clubId);
        const currentValue = clubValues[clubValues.length - 1]?.KRW ?? 0;
        if (currentValue <= 0) return;

        const updated = await clubHandler.simulateValueChange(
          clubId,
          currentValue
        );
        if (updated) {
          const club = await prisma.club.findUnique({
            where: { id: clubId },
            select: { leagueId: true },
          });
          if (club?.leagueId) {
            const leagueValue =
              await leagueHandler.aggregateClubsAndUpdateLeague(club.leagueId);
            if (leagueValue) {
              const subs = leagueSubscriptions.get(club.leagueId);
              if (subs) {
                subs.forEach((socketId) => {
                  io.to(socketId).emit("leagueValueUpdated", {
                    ...leagueValue,
                  });
                });
              }
            }
          }
        }
      } catch (err) {
        fastify.log.error("[Club Simulation Error]", err);
      }
    }, 10000);

    clubSimulationIntervals.set(clubId, interval);
    fastify.log.info(`[Club Simulation Started] clubId=${clubId}`);
  }

  function stopClubSimulation(clubId: string) {
    const interval = clubSimulationIntervals.get(clubId);
    if (interval) {
      clearInterval(interval);
      clubSimulationIntervals.delete(clubId);
      fastify.log.info(`[Club Simulation Stopped] clubId=${clubId}`);
    }
  }

  async function subscribeLeagueValue(socketId: string, leagueId: string) {
    if (!leagueSubscriptions.has(leagueId)) {
      leagueSubscriptions.set(leagueId, new Set());
    }
    leagueSubscriptions.get(leagueId)?.add(socketId);

    const clubs = await prisma.club.findMany({
      where: { leagueId },
      select: { id: true },
    });
    clubs.forEach((c) => startClubSimulation(c.id));

    const recent = await prisma.leagueRealTimeValue.findMany({
      where: { leagueId },
      orderBy: { timestamp: "desc" },
      take: 50,
    });
    io.to(socketId).emit("leagueValueHistory", {
      leagueId,
      values: recent.reverse(),
    });
  }

  function unsubscribeLeagueValue(socketId: string, leagueId: string) {
    const subs = leagueSubscriptions.get(leagueId);
    if (subs) {
      subs.delete(socketId);
      if (subs.size === 0) {
        leagueSubscriptions.delete(leagueId);
        prisma.club
          .findMany({ where: { leagueId }, select: { id: true } })
          .then((clubs) => {
            clubs.forEach((c) => stopClubSimulation(c.id));
          });
      }
    }
  }

  const handleConnection = (socket: Socket) => {
    fastify.log.info(`[Connection] ${socket.id}`);

    socket.on("subscribeLeagueValue", async (leagueId: string) => {
      await subscribeLeagueValue(socket.id, leagueId);
    });

    socket.on("unsubscribeLeagueValue", (leagueId: string) => {
      unsubscribeLeagueValue(socket.id, leagueId);
    });

    socket.on("disconnect", () => {
      leagueSubscriptions.forEach((subs, lId) => {
        if (subs.has(socket.id)) {
          unsubscribeLeagueValue(socket.id, lId);
        }
      });
      fastify.log.info(`[Disconnection] ${socket.id}`);
    });
  };

  const cleanup = async () => {
    clubSimulationIntervals.forEach((interval) => clearInterval(interval));
    clubSimulationIntervals.clear();
    leagueSubscriptions.clear();

    await clubHandler.flushAllBuffers();
  };

  return {
    handleConnection,
    cleanup,
  };
};
