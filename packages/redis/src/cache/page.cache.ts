import { Redis } from "ioredis";
import { isProd } from "../lib/utils.js";
import { RedisClient } from "../redis-client.js";

export class PageCache {
  private static readonly PREFIX = "page:prod:";
  private static readonly TTL = 86400;

  private client: Redis | null;
  private isConnected: boolean;

  constructor() {
    const { client, isConnected } = RedisClient.getInstance().getRedisClient();
    this.client = client;
    this.isConnected = isConnected;
  }

  private getKey(path: string): string {
    return `${PageCache.PREFIX}${path}`;
  }

  async set(path: string, html: string): Promise<boolean> {
    if (!isProd) return false;
    if (!this.isConnected || !this.client) {
      console.log("Redis가 연결되어있지 않아 캐싱에 실패하였습니다.");
      return false;
    }

    try {
      const key = this.getKey(path);
      await this.client.setex(key, PageCache.TTL, html);
      console.log(`페이지 캐시 완료: ${path}`);
      return true;
    } catch (error) {
      console.error("Redis page setCache 에러:", error);
      return false;
    }
  }

  async get(path: string): Promise<string | null> {
    if (!isProd) return null;
    if (!this.isConnected || !this.client) return null;

    try {
      const key = this.getKey(path);
      const cached = await this.client.get(key);
      console.log(`페이지 캐시 ${cached ? "hit" : "miss"} for ${key}`);
      return cached;
    } catch (error) {
      console.error("Redis page getCache 에러:", error);
      return null;
    }
  }

  async invalidatePattern(pattern: string): Promise<boolean> {
    if (!isProd || !this.isConnected || !this.client) return false;

    try {
      const keys = await this.client.keys(`${PageCache.PREFIX}${pattern}*`);
      if (keys.length > 0) {
        const result = await this.client.del(...keys);
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
