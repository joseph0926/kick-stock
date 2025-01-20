import { prisma } from "@/lib/prisma.js";
import { RedisClient } from "@kickstock/redis/src/redis-client.js";
import { LeagueRealTimeValue } from "@prisma/client";

export function createLeagueHandler() {
  let redisClient: RedisClient | null = null;
  const LEAGUE_PREFIX = "league:value:";
  const MAX_CACHE_SIZE = 50;

  async function init() {
    redisClient = await RedisClient.getInstance();
  }

  const getKey = (leagueId: string) => `${LEAGUE_PREFIX}${leagueId}`;

  async function aggregateClubsAndUpdateLeague(
    leagueId: string
  ): Promise<LeagueRealTimeValue | null> {
    const clubs = await prisma.club.findMany({
      where: { leagueId },
      select: { id: true },
    });
    if (!clubs.length) return null;

    let sum = 0;
    for (const c of clubs) {
      const latest = await prisma.clubRealTimeValue.findFirst({
        where: { clubId: c.id },
        orderBy: { timestamp: "desc" },
      });
      if (latest) {
        sum += latest.KRW;
      }
    }

    return updateLeagueValue(leagueId, sum, 0);
  }

  async function updateLeagueValue(
    leagueId: string,
    newValue: number,
    changeRate: number
  ): Promise<LeagueRealTimeValue> {
    if (!redisClient) throw new Error("leagueHandler not initialized");
    const { client: redis } = redisClient.getRedisClient();

    const key = getKey(leagueId);

    const newValueEUR = 0;
    const timestamp = new Date();

    const data: LeagueRealTimeValue = {
      id: "",
      createdAt: new Date(),
      leagueId,
      KRW: newValue,
      EUR: newValueEUR,
      timestamp,
      changeRate,
    };

    await redis.zadd(key, timestamp.getTime().toString(), JSON.stringify(data));
    await redis.zremrangebyrank(key, 0, -MAX_CACHE_SIZE - 1);

    await prisma.leagueRealTimeValue.create({
      data: {
        leagueId,
        KRW: newValue,
        EUR: newValueEUR,
        timestamp,
        changeRate,
      },
    });

    return data;
  }

  return {
    init,
    aggregateClubsAndUpdateLeague,
    updateLeagueValue,
  };
}
