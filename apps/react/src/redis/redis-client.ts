import { isProd } from "@/server/lib/env-utils";
import Redis from "ioredis";
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV as string, process.cwd(), "");
const REDIS_URL = env.VITE_REDIS_URL;

class RedisClient {
  private client: Redis | null = null;
  private isConnected: boolean = false;
  private readonly DAY_IN_SECONDS = 86400;

  constructor() {
    if (isProd) {
      this.initializeRedis();
    }
  }

  private getKeyPrefix() {
    return "page:prod:";
  }

  private async initializeRedis() {
    try {
      this.client = new Redis(REDIS_URL as string);

      this.client.on("connect", () => {
        this.isConnected = true;
        console.log("Redis 연결 성공!");
      });

      this.client.on("error", (err) => {
        console.error("Redis 연결 에러:", err);
        this.isConnected = false;
        this.closeConnection();
      });
    } catch (error) {
      console.error("Redis 초기화 에러:", error);
      this.isConnected = false;
    }
  }

  private closeConnection() {
    if (this.client) {
      this.client.disconnect();
      this.client = null;
    }
  }

  private getKey(path: string): string {
    return `${this.getKeyPrefix()}${path}`;
  }

  async setCache(path: string, html: string): Promise<boolean> {
    if (!isProd) return false;
    if (!this.isConnected || !this.client) {
      console.log("Redis가 연결되어있지 않아 캐싱에 실패하였습니다.");
      return false;
    }

    try {
      const key = this.getKey(path);
      await this.client.setex(key, this.DAY_IN_SECONDS, html);
      console.log(`캐시 완료: ${path}`);
      console.log(`Cache size: ${html.length} bytes`);

      const savedValue = await this.client.get(key);
      console.log(
        `Cache verification: ${savedValue ? "successful" : "failed"}`,
      );

      return true;
    } catch (error) {
      console.error("Redis setCache 에러:", error);
      return false;
    }
  }

  async getCache(path: string): Promise<string | null> {
    if (!isProd) return null;
    if (!this.isConnected || !this.client) return null;
    try {
      const key = this.getKey(path);
      const cached = await this.client.get(key);
      console.log(`Cache ${cached ? "hit" : "miss"} for ${key}`);
      return cached;
    } catch (error) {
      console.error("Redis getCache 에러:", error);
      return null;
    }
  }
}

export const redisClient = new RedisClient();
