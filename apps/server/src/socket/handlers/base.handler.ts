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

    const runSimulation = async () => {
      const { isConnected } = valueService.checkRedisConnection();
      if (!isConnected) {
        fastify.log.error(
          `[Simulation Error] Redis connection lost for ${leagueId}`
        );
        stopSimulation(leagueId);
        return;
      }

      try {
        const values = await valueService.getCachedValues(leagueId);
        const currentValue = values[values.length - 1]?.KRW;

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

        if (updatedValue) {
          const subscribers = activeSubscriptions.get(leagueId);
          if (subscribers?.size) {
            subscribers.forEach((socketId) => {
              io.to(socketId).emit("leagueValueUpdated", {
                leagueId,
                value: updatedValue,
              });
            });
          }
        }
      } catch (error) {
        fastify.log.error(`[Simulation Error] League ID ${leagueId}:`, error);
        stopSimulation(leagueId);
      }
    };

    runSimulation().then(() => {
      setTimeout(() => {
        const interval = setInterval(runSimulation, 10000);
        simulationIntervals.set(leagueId, interval);
        fastify.log.info(`[Simulation Started] League ID: ${leagueId}`);
      }, 10000);
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
        valueService.flushBufferToDB(leagueId).catch((error) => {
          fastify.log.error(`[Buffer Flush Error] ${leagueId}:`, error);
        });
      }
    }
  };

  const handleConnection = (socket: Socket) => {
    fastify.log.info(`[Connection] Client connected: ${socket.id}`);

    socket.on("subscribeLeagueValue", async (leagueId: string) => {
      if (!leagueId || typeof leagueId !== "string") {
        socket.emit("error", "유효하지 않은 리그 ID입니다.");
        return;
      }

      try {
        const values = await valueService.getCachedValues(leagueId);

        if (values.length === 0) {
          const initialValue = await prisma.leagueValue.findFirst({
            where: { leagueId },
            orderBy: { createdAt: "desc" },
          });

          if (initialValue) {
            await valueService.updateValue(leagueId, initialValue.KRW, 0);
          }
        }

        const currentValues = await valueService.getCachedValues(leagueId);
        socket.emit("leagueValueHistory", { leagueId, values: currentValues });

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
