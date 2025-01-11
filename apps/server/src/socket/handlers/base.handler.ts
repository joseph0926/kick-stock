import { Server, Socket } from "socket.io";
import { FastifyInstance } from "fastify";
import { leagueHandler } from "./league.handler.js";
import { prisma } from "@/lib/prisma.js";

export const baseSocketHandler = async (
  io: Server,
  fastify: FastifyInstance
) => {
  const valueService = await leagueHandler();
  const simulationIntervals = new Map<string, NodeJS.Timeout>();
  const activeSubscriptions = new Map<string, Set<string>>();

  const { isConnected, message } = valueService.checkRedisConnection();
  fastify.log.info(`[Redis Status] ${message}`);

  if (!isConnected) {
    throw new Error("Redis 연결이 필요합니다.");
  }

  const startSimulation = (leagueId: string) => {
    if (simulationIntervals.has(leagueId)) {
      clearInterval(simulationIntervals.get(leagueId));
    }

    fastify.log.info(
      `[Simulation Setup] Starting simulation for League ID: ${leagueId}`
    );

    const initializeLeagueValue = async () => {
      try {
        const initialValue = await prisma.leagueValue.findFirst({
          where: { leagueId },
          orderBy: { createdAt: "desc" },
        });

        if (!initialValue) {
          fastify.log.error(
            `[Simulation Error] No initial value found in DB for ${leagueId}`
          );
          return;
        }

        await valueService.updateValue(leagueId, initialValue.KRW);
        fastify.log.info(
          `[Simulation Init] Set initial value for ${leagueId}: ${initialValue.KRW}`
        );
      } catch (error) {
        fastify.log.error(
          `[Simulation Init Error] Failed to set initial value for ${leagueId}:`,
          error
        );
      }
    };

    initializeLeagueValue().then(() => {
      const interval = setInterval(async () => {
        fastify.log.info(
          `[Simulation Tick] Running simulation for League ID: ${leagueId}`
        );

        try {
          const values = await valueService.getCachedValues(leagueId);
          fastify.log.info(
            `[Simulation Data] Retrieved values for ${leagueId}:`,
            values
          );

          const currentValue = values[values.length - 1]?.KRW;
          fastify.log.info(
            `[Simulation Current] Current value for ${leagueId}: ${currentValue}`
          );

          if (!currentValue) {
            fastify.log.warn(
              `[Simulation Warning] No current value found for ${leagueId}`
            );
            return;
          }

          const updatedValue = await valueService.simulateValueChange(
            leagueId,
            currentValue
          );

          fastify.log.info(
            `[Simulation Update] New value for ${leagueId}:`,
            updatedValue
          );

          if (updatedValue) {
            const subscribers = activeSubscriptions.get(leagueId);
            if (subscribers?.size) {
              subscribers.forEach((socketId) => {
                io.to(socketId).emit("leagueValueUpdated", {
                  leagueId,
                  value: updatedValue,
                });
              });
              fastify.log.info(
                `[Simulation Broadcast] Value updated broadcasted to ${subscribers.size} subscribers`
              );
            }
          }
        } catch (error) {
          fastify.log.error(`[Simulation Error] League ID ${leagueId}:`, error);
          stopSimulation(leagueId);
        }
      }, 10000);

      simulationIntervals.set(leagueId, interval);
      fastify.log.info(`[Simulation Started] League ID: ${leagueId}`);
    });
  };

  const stopSimulation = (leagueId: string) => {
    const interval = simulationIntervals.get(leagueId);
    if (interval) {
      clearInterval(interval);
      simulationIntervals.delete(leagueId);
      fastify.log.info(`[Simulation Stopped] League ID: ${leagueId}`);
    }
  };

  const addSubscription = (leagueId: string, socketId: string) => {
    if (!activeSubscriptions.has(leagueId)) {
      activeSubscriptions.set(leagueId, new Set());
    }
    activeSubscriptions.get(leagueId)?.add(socketId);
  };

  const removeSubscription = (leagueId: string, socketId: string) => {
    const subscribers = activeSubscriptions.get(leagueId);
    if (subscribers) {
      subscribers.delete(socketId);
      if (subscribers.size === 0) {
        activeSubscriptions.delete(leagueId);
        stopSimulation(leagueId);
      }
    }
  };

  const handleConnection = (socket: Socket) => {
    fastify.log.info(`[Connection] Client connected: ${socket.id}`);

    socket.on("subscribeLeagueValue", async (leagueId: string) => {
      try {
        const values = await valueService.getCachedValues(leagueId);
        socket.emit("leagueValueHistory", { leagueId, values });

        addSubscription(leagueId, socket.id);

        if (activeSubscriptions.get(leagueId)?.size === 1) {
          startSimulation(leagueId);
        }
      } catch (error) {
        fastify.log.error("[Subscription Error]:", error);
        socket.emit("error", "리그 구독 처리 중 오류가 발생했습니다.");
      }
    });

    socket.on("unsubscribeLeagueValue", (leagueId: string) => {
      removeSubscription(leagueId, socket.id);
    });

    socket.on("disconnect", () => {
      activeSubscriptions.forEach((subscribers, leagueId) => {
        removeSubscription(leagueId, socket.id);
      });
      fastify.log.info(`[Disconnection] Client disconnected: ${socket.id}`);
    });
  };

  const cleanup = async () => {
    simulationIntervals.forEach((interval) => clearInterval(interval));
    simulationIntervals.clear();
    activeSubscriptions.clear();
    await valueService.flushAllBuffers();
  };

  return {
    handleConnection,
    cleanup,
  };
};
