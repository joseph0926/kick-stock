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

  const calculateChangeRate = (
    previousValue: number,
    currentValue: number
  ): number => {
    return Number(
      (((currentValue - previousValue) / previousValue) * 100).toFixed(2)
    );
  };

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
    previousValue?: number
  ): Promise<LeagueValueData | null> => {
    try {
      const timestamp = new Date();
      const values = await getCachedValues(leagueId);
      const lastValue = values[values.length - 1]?.KRW ?? previousValue;

      const changeRate = lastValue
        ? calculateChangeRate(lastValue, newValue)
        : 0;

      const valueData: LeagueValueData = {
        leagueId,
        KRW: newValue,
        timestamp,
        changeRate,
      };

      const key = getRedisKey(leagueId);

      await redis.zadd(key, timestamp.getTime(), JSON.stringify(valueData));
      await redis.zremrangebyrank(key, 0, -MAX_HISTORY_SIZE - 1);

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
    const minChange = -0.5;
    const maxChange = 0.5;
    const changeRate = minChange + Math.random() * (maxChange - minChange);
    const newValue = Math.round(currentValue * (1 + changeRate / 100));

    if (newValue === currentValue) return null;

    return updateValue(leagueId, newValue, currentValue);
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
    checkRedisConnection,
  };
};
