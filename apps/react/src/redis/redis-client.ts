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
    this.initializeRedis();
  }

  private getKeyPrefix() {
    if (isProd) return "page:prod:";
    if (process.env.NODE_ENV === "staging") return "page:staging:";
    return "page:dev:";
  }

  private async initializeRedis() {
    try {
      this.client = new Redis(REDIS_URL as string);

      this.client.on("connect", () => {
        this.isConnected = true;
        console.log("Successfully connected to Redis");
      });

      this.client.on("error", (err) => {
        console.error("Redis connection error:", err);
        this.isConnected = false;
        this.closeConnection();
      });
    } catch (error) {
      console.error("Failed to initialize Redis:", error);
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
    if (!this.isConnected || !this.client) {
      console.log("Redis not connected, skipping cache set");
      return false;
    }

    try {
      const key = this.getKey(path);
      await this.client.setex(key, this.DAY_IN_SECONDS, html);
      console.log(`Cache set success for path: ${path}`);
      console.log(`Cache size: ${html.length} bytes`);

      const savedValue = await this.client.get(key);
      console.log(
        `Cache verification: ${savedValue ? "successful" : "failed"}`,
      );

      return true;
    } catch (error) {
      console.error("Redis set error:", error);
      return false;
    }
  }

  async getCache(path: string): Promise<string | null> {
    if (!this.isConnected || !this.client) return null;
    try {
      const key = this.getKey(path);
      const cached = await this.client.get(key);
      console.log(`Cache ${cached ? "hit" : "miss"} for ${key}`);
      return cached;
    } catch (error) {
      console.error("Redis get error:", error);
      return null;
    }
  }
}

export const redisClient = new RedisClient();
