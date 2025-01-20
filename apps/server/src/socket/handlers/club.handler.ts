import { prisma } from "@/lib/prisma.js";
import { RedisClient } from "@kickstock/redis/src/redis-client.js";

import { ClubRealTimeValue } from "@prisma/client";

export function createClubHandler() {
  let redisClient: RedisClient | null = null;

  const CLUB_PREFIX = "club:value:";
  const MAX_CACHE_SIZE = 50;
  const BATCH_SIZE = 50;

  const updateBuffer = new Map<string, ClubRealTimeValue[]>();

  async function init() {
    redisClient = await RedisClient.getInstance();
  }

  const getKey = (clubId: string) => `${CLUB_PREFIX}${clubId}`;

  async function getCachedValues(clubId: string): Promise<ClubRealTimeValue[]> {
    if (!redisClient) throw new Error("clubHandler not initialized");
    const { client: redis } = redisClient.getRedisClient();

    const key = getKey(clubId);

    const raw = await redis.zrange(key, -MAX_CACHE_SIZE, -1);
    if (raw.length === 0) {
      const data = await prisma.clubRealTimeValue.findMany({
        where: { clubId },
        orderBy: { timestamp: "desc" },
        take: MAX_CACHE_SIZE,
      });
      if (!data.length) return [];

      const pipeline = redis.pipeline();
      for (const record of data) {
        pipeline.zadd(
          key,
          record.timestamp.getTime().toString(),
          JSON.stringify(record)
        );
      }
      pipeline.expire(key, 86400);
      await pipeline.exec();

      return data.reverse();
    }

    return raw.map((jsonString) => JSON.parse(jsonString) as ClubRealTimeValue);
  }

  function addToBuffer(clubId: string, val: ClubRealTimeValue) {
    if (!updateBuffer.has(clubId)) {
      updateBuffer.set(clubId, []);
    }
    updateBuffer.get(clubId)!.push(val);

    if (updateBuffer.get(clubId)!.length >= BATCH_SIZE) {
      flushBufferToDB(clubId).catch(console.error);
    }
  }

  async function flushBufferToDB(clubId: string) {
    const buf = updateBuffer.get(clubId);
    if (!buf || !buf.length) return;

    try {
      await prisma.clubRealTimeValue.createMany({
        data: buf.map((b) => ({
          clubId: b.clubId,
          KRW: b.KRW,
          EUR: b.EUR,
          timestamp: b.timestamp,
          changeRate: b.changeRate,
        })),
      });
      updateBuffer.set(clubId, []);
    } catch (err) {
      console.error("[clubHandler.flushBufferToDB] error:", err);
    }
  }

  async function flushAllBuffers() {
    const tasks = [...updateBuffer.keys()].map((clubId) =>
      flushBufferToDB(clubId)
    );
    await Promise.all(tasks);
  }

  async function updateValue(
    clubId: string,
    newValueKRW: number,
    changeRate: number
  ): Promise<ClubRealTimeValue> {
    if (!redisClient) throw new Error("clubHandler not initialized");
    const { client: redis } = redisClient.getRedisClient();

    const timestamp = new Date();

    const newValueEUR = 0;

    const data: ClubRealTimeValue = {
      id: "",
      createdAt: new Date(),
      clubId,
      KRW: newValueKRW,
      EUR: newValueEUR,
      timestamp,
      changeRate,
    };

    const key = getKey(clubId);
    await redis.zadd(key, timestamp.getTime().toString(), JSON.stringify(data));

    await redis.zremrangebyrank(key, 0, -MAX_CACHE_SIZE - 1);

    addToBuffer(clubId, data);

    return data;
  }

  async function simulateValueChange(
    clubId: string,
    currentValue: number
  ): Promise<ClubRealTimeValue | null> {
    if (!currentValue || currentValue <= 0) return null;

    const minChange = -0.3;
    const maxChange = 0.3;
    const changeRate = minChange + Math.random() * (maxChange - minChange);

    const newValue = Math.round(currentValue * (1 + changeRate / 100));
    if (newValue === currentValue || newValue <= 0) {
      return null;
    }

    return updateValue(clubId, newValue, changeRate);
  }

  return {
    init,
    getCachedValues,
    updateValue,
    simulateValueChange,
    flushAllBuffers,
    flushBufferToDB,
  };
}
