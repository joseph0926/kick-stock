import { Redis } from "ioredis";
import { isProd } from "@kickstock/shared/src/lib/env-util.js";
import { RedisClient } from "../redis-client.js";

export class PageCache {
  private static readonly PREFIX = isProd ? "page:prod:" : "page:dev";
  private static readonly TTL = 86400;

  private client: Redis | null;
  private isConnected: boolean;
  private static instance: PageCache | null = null;
  private initialized = false;

  private constructor(client: Redis | null, isConnected: boolean) {
    this.client = client;
    this.isConnected = isConnected;
  }

  static async getInstance(): Promise<PageCache> {
    if (!PageCache.instance || !PageCache.instance.initialized) {
      const redisClient = await RedisClient.getInstance();
      const { client, isConnected } = redisClient.getRedisClient();
      PageCache.instance = new PageCache(client, isConnected);
      PageCache.instance.initialized = true;
    }
    return PageCache.instance;
  }

  private validateInstance(): boolean {
    if (!this.initialized) {
      console.error("PageCache가 초기화되지 않았습니다.");
      return false;
    }
    if (!this.isConnected || !this.client) {
      console.log("Redis가 연결되어있지 않습니다.");
      return false;
    }
    return true;
  }

  private getKey(path: string): string {
    return `${PageCache.PREFIX}${path}`;
  }

  async set(path: string, html: string): Promise<boolean> {
    if (!this.validateInstance()) return false;

    try {
      const key = this.getKey(path);
      await this.client!.setex(key, PageCache.TTL, html);
      console.log(`페이지 캐시 완료: ${path}`);
      return true;
    } catch (error) {
      console.error("Redis page setCache 에러:", error);
      return false;
    }
  }

  async get(path: string): Promise<string | null> {
    if (!this.validateInstance()) return null;

    try {
      const key = this.getKey(path);
      const cached = await this.client!.get(key);
      console.log(`페이지 캐시 ${cached ? "hit" : "miss"} for ${key}`);
      return cached;
    } catch (error) {
      console.error("Redis page getCache 에러:", error);
      return null;
    }
  }

  async invalidatePattern(pattern: string): Promise<boolean> {
    if (!this.validateInstance()) return false;

    try {
      const keys = await this.client!.keys(`${PageCache.PREFIX}${pattern}*`);
      if (keys.length > 0) {
        const result = await this.client!.del(...keys);
        console.log(
          `${result}개의 페이지 캐시를 무효화하였습니다.: ${pattern}`
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Redis page invalidatePattern 에러:", error);
      return false;
    }
  }
}
