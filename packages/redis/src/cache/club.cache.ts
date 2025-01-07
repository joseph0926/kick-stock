import { Redis } from "ioredis";
import { isProd } from "../lib/utils.js";
import { RedisClient } from "../redis-client.js";
import { Club, ClubValue } from "@kickstock/shared/src/types/prisma.type.js";

export class ClubCache {
  private static readonly PREFIX = "club:prod:";
  private static readonly TTL = 3600;

  private client: Redis | null;
  private isConnected: boolean;
  private static instance: ClubCache | null = null;
  private initialized = false;

  private constructor(client: Redis | null, isConnected: boolean) {
    this.client = client;
    this.isConnected = isConnected;
  }

  static async getInstance(): Promise<ClubCache> {
    if (!ClubCache.instance || !ClubCache.instance.initialized) {
      const redisClient = await RedisClient.getInstance();
      const { client, isConnected } = redisClient.getRedisClient();
      ClubCache.instance = new ClubCache(client, isConnected);
      ClubCache.instance.initialized = true;
    }
    return ClubCache.instance;
  }

  private validateInstance(): boolean {
    if (!this.initialized) {
      console.error("ClubCache가 초기화되지 않았습니다.");
      return false;
    }
    if (!isProd) return false;
    if (!this.isConnected || !this.client) {
      console.log("Redis가 연결되어있지 않습니다.");
      return false;
    }
    return true;
  }

  private getKey(clubId: string, year?: string): string {
    return `${ClubCache.PREFIX}${clubId}${year ? `:${year}` : ""}`;
  }

  async setClub(club: Club): Promise<boolean> {
    if (!this.validateInstance()) return false;

    try {
      const key = this.getKey(club.id);
      await this.client!.setex(key, ClubCache.TTL, JSON.stringify(club));
      console.log(`클럽 캐시 완료: ${club.name}`);
      return true;
    } catch (error) {
      console.error("Redis club setCache 에러:", error);
      return false;
    }
  }

  async getClub(clubId: string): Promise<Club | null> {
    if (!this.validateInstance()) return null;

    try {
      const key = this.getKey(clubId);
      const cached = await this.client!.get(key);
      console.log(`클럽 캐시 ${cached ? "hit" : "miss"} for ${key}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error("Redis club getCache 에러:", error);
      return null;
    }
  }

  async setClubValue(
    clubId: string,
    year: string,
    value: ClubValue
  ): Promise<boolean> {
    if (!this.validateInstance()) return false;

    try {
      const key = this.getKey(clubId, year);
      await this.client!.setex(key, ClubCache.TTL, JSON.stringify(value));
      console.log(`클럽 가치 캐시 완료: ${clubId} ${year}`);
      return true;
    } catch (error) {
      console.error("Redis club value setCache 에러:", error);
      return false;
    }
  }

  async getClubValue(clubId: string, year: string): Promise<ClubValue | null> {
    if (!this.validateInstance()) return null;

    try {
      const key = this.getKey(clubId, year);
      const cached = await this.client!.get(key);
      console.log(`클럽 가치 캐시 ${cached ? "hit" : "miss"} for ${key}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error("Redis club value getCache 에러:", error);
      return null;
    }
  }

  async invalidateClub(clubId: string): Promise<boolean> {
    if (!this.validateInstance()) return false;

    try {
      const keys = await this.client!.keys(`${ClubCache.PREFIX}${clubId}*`);
      if (keys.length > 0) {
        const result = await this.client!.del(...keys);
        console.log(
          `${result}개의 클럽 관련 캐시를 무효화하였습니다.: ${clubId}`
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Redis club invalidate 에러:", error);
      return false;
    }
  }
}
