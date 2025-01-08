import { Redis } from "ioredis";
import { isProd } from "@kickstock/shared/src/lib/env-util.js";
import { RedisClient } from "../redis-client.js";
import {
  ValuesType as LeagueValueType,
  League,
} from "@kickstock/shared/src/types/prisma.type.js";

export class LeagueCache {
  private static readonly PREFIX = "league:prod:";
  private static readonly TTL = 3600;

  private client: Redis | null;
  private isConnected: boolean;
  private static instance: LeagueCache | null = null;
  private initialized = false;

  private constructor(client: Redis | null, isConnected: boolean) {
    this.client = client;
    this.isConnected = isConnected;
  }

  static async getInstance(): Promise<LeagueCache> {
    if (!LeagueCache.instance || !LeagueCache.instance.initialized) {
      const redisClient = await RedisClient.getInstance();
      const { client, isConnected } = redisClient.getRedisClient();
      LeagueCache.instance = new LeagueCache(client, isConnected);
      LeagueCache.instance.initialized = true;
    }
    return LeagueCache.instance;
  }

  private validateInstance(): boolean {
    if (!this.initialized) {
      console.error("LeagueCache가 초기화되지 않았습니다.");
      return false;
    }
    if (!isProd) return false;
    if (!this.isConnected || !this.client) {
      console.log("Redis가 연결되어있지 않습니다.");
      return false;
    }
    return true;
  }

  private getKey(leagueId: string, year?: string): string {
    return `${LeagueCache.PREFIX}${leagueId}${year ? `:${year}` : ""}`;
  }

  async setLeague(league: League): Promise<boolean> {
    if (!this.validateInstance()) return false;

    try {
      const key = this.getKey(league.uniqueName);
      await this.client!.setex(key, LeagueCache.TTL, JSON.stringify(league));
      console.log(`리그 캐시 완료: ${league.name}`);
      return true;
    } catch (error) {
      console.error("Redis league setCache 에러:", error);
      return false;
    }
  }

  async getLeague(leagueId: string): Promise<League | null> {
    if (!this.validateInstance()) return null;

    try {
      const key = this.getKey(leagueId);
      const cached = await this.client!.get(key);
      console.log(`리그 캐시 ${cached ? "hit" : "miss"} for ${key}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error("Redis league getCache 에러:", error);
      return null;
    }
  }

  async setLeagueValue(
    leagueId: string,
    year: string,
    value: LeagueValueType
  ): Promise<boolean> {
    if (!this.validateInstance()) return false;

    try {
      const key = this.getKey(leagueId, year);
      await this.client!.setex(key, LeagueCache.TTL, JSON.stringify(value));
      console.log(`리그 가치 캐시 완료: ${leagueId} ${year}`);
      return true;
    } catch (error) {
      console.error("Redis league value setCache 에러:", error);
      return false;
    }
  }

  async getLeagueValue(
    leagueId: string,
    year: string
  ): Promise<LeagueValueType | null> {
    if (!this.validateInstance()) return null;

    try {
      const key = this.getKey(leagueId, year);
      const cached = await this.client!.get(key);
      console.log(`리그 가치 캐시 ${cached ? "hit" : "miss"} for ${key}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error("Redis league value getCache 에러:", error);
      return null;
    }
  }

  async invalidateLeague(leagueId: string): Promise<boolean> {
    if (!this.validateInstance()) return false;

    try {
      const keys = await this.client!.keys(`${LeagueCache.PREFIX}${leagueId}*`);
      if (keys.length > 0) {
        const result = await this.client!.del(...keys);
        console.log(
          `${result}개의 리그 관련 캐시를 무효화하였습니다.: ${leagueId}`
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Redis league invalidate 에러:", error);
      return false;
    }
  }
}
