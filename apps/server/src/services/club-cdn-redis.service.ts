import axios from "axios";
import { isProd } from "@kickstock/shared/src/lib/env-util.js";
import { RedisClient } from "@kickstock/redis/src/redis-client.js";

const BASE_CDN_URL =
  "https://cdn.jsdelivr.net/gh/joseph0926/kick-stock/packages/data-cdn";

export async function fetchClubHistoryFromCDN(league: string) {
  try {
    const envPath = isProd ? "prod" : "dev";
    const url = `${BASE_CDN_URL}/${envPath}/club/${league}.json`;
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.error("[fetchClubHistoryFromCDN] error:", error);
    return null;
  }
}

export async function redisFetchClubHistory(league: string) {
  const redisClient = await RedisClient.getInstance();
  const { client } = redisClient.getRedisClient();

  const key = `club:history:${league}`;
  const raw = await client.get(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("[redisFetchClubHistory] JSON parse error:", err);
    return null;
  }
}

export async function redisSaveClubHistory(league: string, data: any) {
  const redisClient = await RedisClient.getInstance();
  const { client } = redisClient.getRedisClient();

  const key = `club:history:${league}`;
  await client.set(key, JSON.stringify(data), "EX", 86400);
}
