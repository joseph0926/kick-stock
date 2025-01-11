import { LeagueValueData } from "@kickstock/shared/src/types/server/socket.type.js";
import { RedisClient } from "@kickstock/redis/src/redis-client.js";
import { prisma } from "@/lib/prisma.js";

export const leagueHandler = async () => {
  const redisInstance = await RedisClient.getInstance();
  const { client: redis } = redisInstance.getRedisClient();

  const CACHE_KEY_PREFIX = "league:value:realtime";
  const MAX_HISTORY_SIZE = 50;
  const BATCH_SIZE = 50;

  const updateBuffer = new Map<string, LeagueValueData[]>();

  const getRedisKey = (leagueId: string) => `${CACHE_KEY_PREFIX}:${leagueId}`;

  const getCachedValues = async (
    leagueId: string
  ): Promise<LeagueValueData[]> => {
    const key = getRedisKey(leagueId);
    const rawData = await redis.zrange(
      key,
      -MAX_HISTORY_SIZE,
      -1,
      "WITHSCORES"
    );

    if (rawData.length === 0) {
      const historicalData = await prisma.leagueRealTimeValue.findMany({
        where: { leagueId },
        orderBy: { timestamp: "desc" },
        take: MAX_HISTORY_SIZE,
      });

      if (historicalData.length > 0) {
        const pipeline = redis.pipeline();

        for (const record of historicalData) {
          const valueData: LeagueValueData = {
            leagueId,
            KRW: record.KRW,
            timestamp: record.timestamp,
            changeRate: record.changeRate,
          };
          pipeline.zadd(
            key,
            record.timestamp.getTime(),
            JSON.stringify(valueData)
          );
        }

        await pipeline.exec();
        await redis.expire(key, 86400);

        return historicalData
          .map((record) => ({
            leagueId,
            KRW: record.KRW,
            timestamp: record.timestamp,
            changeRate: record.changeRate,
          }))
          .reverse();
      }
    }

    const values: LeagueValueData[] = [];
    for (let i = 0; i < rawData.length; i += 2) {
      const data = JSON.parse(rawData[i]);
      values.push(data);
    }

    return values;
  };

  const addToBuffer = (leagueId: string, valueData: LeagueValueData) => {
    if (!updateBuffer.has(leagueId)) {
      updateBuffer.set(leagueId, []);
    }
    updateBuffer.get(leagueId)?.push(valueData);

    if (updateBuffer.get(leagueId)?.length === BATCH_SIZE) {
      flushBufferToDB(leagueId);
    }
  };

  const flushBufferToDB = async (leagueId: string) => {
    const buffer = updateBuffer.get(leagueId);
    if (!buffer || buffer.length === 0) return;

    try {
      await prisma.leagueRealTimeValue.createMany({
        data: buffer.map((value) => ({
          leagueId: value.leagueId,
          KRW: value.KRW,
          timestamp: value.timestamp,
          changeRate: value.changeRate,
        })),
      });

      updateBuffer.set(leagueId, []);
    } catch (error) {
      console.error("[flushBufferToDB Error] DB 배치 저장 실패:", error);
    }
  };

  const updateValue = async (
    leagueId: string,
    newValue: number,
    currentChangeRate?: number
  ): Promise<LeagueValueData | null> => {
    try {
      const timestamp = new Date();

      const valueData: LeagueValueData = {
        leagueId,
        KRW: newValue,
        timestamp,
        changeRate: currentChangeRate ?? 0,
      };

      const key = getRedisKey(leagueId);

      const pipeline = redis.pipeline();
      pipeline.zadd(key, timestamp.getTime(), JSON.stringify(valueData));
      pipeline.zremrangebyrank(key, 0, -MAX_HISTORY_SIZE - 1);
      await pipeline.exec();

      addToBuffer(leagueId, valueData);

      return valueData;
    } catch (error) {
      console.error("[updateValue Error] 값 업데이트 실패:", error);
      return null;
    }
  };

  const simulateValueChange = async (
    leagueId: string,
    currentValue: number
  ): Promise<LeagueValueData | null> => {
    if (!currentValue || isNaN(currentValue)) {
      console.error(
        `[simulateValueChange Error] Invalid current value for ${leagueId}`
      );
      return null;
    }

    const minChange = -0.25;
    const maxChange = 0.25;
    const changeRate = minChange + Math.random() * (maxChange - minChange);
    const newValue = Math.round(currentValue * (1 + changeRate / 100));

    if (newValue === currentValue || newValue <= 0) {
      return null;
    }

    return updateValue(leagueId, newValue, changeRate);
  };

  const flushAllBuffers = async () => {
    try {
      const flushPromises = Array.from(updateBuffer.keys()).map((leagueId) =>
        flushBufferToDB(leagueId)
      );
      await Promise.all(flushPromises);
    } catch (error) {
      console.error("[flushAllBuffers Error] 전체 버퍼 저장 실패:", error);
    }
  };

  const checkRedisConnection = () => {
    const { isConnected, message } = redisInstance.getRedisClient();
    return { isConnected, message };
  };

  return {
    getCachedValues,
    updateValue,
    simulateValueChange,
    flushAllBuffers,
    flushBufferToDB,
    checkRedisConnection,
  };
};
