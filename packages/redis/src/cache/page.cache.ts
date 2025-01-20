import { Redis } from "ioredis";
import { isProd } from "@kickstock/shared/src/lib/env-util.js";
import { RedisClient } from "../redis-client.js";

export class PageCache {
  private static readonly PREFIX = isProd ? "page:prod:" : "page:dev:";
  private static readonly TTL = 86400;

  private client: Redis | null = null;
  private isConnected = false;
  private static instance: PageCache | null = null;
  private initialized = false;

  private constructor(client: Redis | null, isConnected: boolean) {
    this.client = client;
    this.isConnected = isConnected;
  }

  static async getInstance(): Promise<PageCache> {
    if (!PageCache.instance) {
      const redisClient = await RedisClient.getInstance();
      const { client, isConnected } = redisClient.getRedisClient();
      PageCache.instance = new PageCache(client, isConnected);
      PageCache.instance.initialized = true;
    } else if (!PageCache.instance.initialized) {
      const redisClient = await RedisClient.getInstance();
      const { client, isConnected } = redisClient.getRedisClient();
      PageCache.instance.client = client;
      PageCache.instance.isConnected = isConnected;
      PageCache.instance.initialized = true;
    } else if (!PageCache.instance.isConnected) {
      const redisClient = await RedisClient.getInstance();
      const { client, isConnected } = redisClient.getRedisClient();
      PageCache.instance.client = client;
      PageCache.instance.isConnected = isConnected;
    }

    return PageCache.instance;
  }

  private async ensureConnection(): Promise<boolean> {
    if (!this.initialized) {
      console.error("[PageCache] 아직 초기화되지 않았습니다.");
      return false;
    }

    if (this.isConnected && this.client) {
      return true;
    }

    console.warn("[PageCache] Redis 연결이 유효하지 않아 재시도합니다.");
    const redisClient = await RedisClient.getInstance();
    const { client, isConnected } = redisClient.getRedisClient();
    this.client = client;
    this.isConnected = isConnected;

    if (!this.isConnected || !this.client) {
      console.error("[PageCache] Redis 재연결에 실패했습니다.");
      return false;
    }

    console.log("[PageCache] Redis 연결이 복원되었습니다.");
    return true;
  }

  private getKey(path: string): string {
    return `${PageCache.PREFIX}${path}`;
  }

  async set(path: string, html: string): Promise<boolean> {
    if (!(await this.ensureConnection())) {
      return false;
    }
    if (!this.client) return false;

    try {
      const key = this.getKey(path);
      await this.client.set(key, html, "EX", PageCache.TTL);

      console.log(`[PageCache] 페이지 캐시 완료: ${key}`);
      return true;
    } catch (error) {
      console.error("[PageCache] set() 에러:", error);
      return false;
    }
  }

  async get(path: string): Promise<string | null> {
    if (!(await this.ensureConnection())) {
      return null;
    }
    if (!this.client) return null;

    try {
      const key = this.getKey(path);
      const cached = await this.client.get(key);
      console.log(
        `[PageCache] 페이지 캐시 ${cached ? "hit" : "miss"} for ${key}`
      );
      return cached;
    } catch (error) {
      console.error("[PageCache] get() 에러:", error);
      return null;
    }
  }

  async invalidatePattern(pattern: string): Promise<boolean> {
    if (!(await this.ensureConnection())) {
      return false;
    }
    if (!this.client) return false;

    try {
      const prefix = PageCache.PREFIX + pattern;
      const keys = await this.client.keys(`${prefix}*`);
      if (keys.length > 0) {
        const result = await this.client.del(...keys);
        console.log(
          `[PageCache] ${result}개의 ${
            isProd ? "prod" : "dev"
          } 페이지 캐시를 무효화하였습니다.: pattern=${pattern}`
        );
        return true;
      }
      console.log(`[PageCache] 무효화 대상 키가 없습니다.: ${prefix}*`);
      return false;
    } catch (error) {
      console.error("[PageCache] invalidatePattern() 에러:", error);
      return false;
    }
  }
}
