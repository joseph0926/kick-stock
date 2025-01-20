import { Redis } from "ioredis";
import { isProd } from "@kickstock/shared/src/lib/env-util.js";
import dotenv from "dotenv";
dotenv.config();

export class RedisClient {
  private client: Redis | null = null;
  private static instance: RedisClient;
  private initialized: boolean = false;

  private isConnected: boolean = false;

  private constructor() {}

  public static async getInstance(): Promise<RedisClient> {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
      await RedisClient.instance.initializeRedis();
      RedisClient.instance.initialized = true;
    } else if (!RedisClient.instance.isConnected) {
      await RedisClient.instance.initializeRedis();
    }
    return RedisClient.instance;
  }

  private static getRedisUrl(): string {
    if (typeof window === "undefined") {
      return isProd
        ? process.env.REDIS_URL || import.meta.env.VITE_REDIS_URL
        : process.env.REDIS_DEV_URL || import.meta.env.VITE_REDIS_DEV_URL;
    } else {
      const envUrl = import.meta.env.VITE_REDIS_URL;
      const envUrlDev = import.meta.env.VITE_REDIS_DEV_URL;
      return isProd ? envUrl : envUrlDev;
    }
  }

  private async initializeRedis() {
    if (this.client && this.isConnected) {
      return;
    }

    const redisUrl = RedisClient.getRedisUrl();
    if (!redisUrl) {
      throw new Error("Redis URL이 정의되지 않았습니다.");
    }

    if (this.client) {
      try {
        await this.client.quit();
      } catch {}
      this.client = null;
      this.isConnected = false;
    }

    this.client = new Redis(redisUrl, {
      connectTimeout: 5000,
      retryStrategy: (times) => Math.min(times * 100, 3000),
      reconnectOnError: (err) => {
        const targetError = "READONLY";
        return err.message.includes(targetError);
      },
    });

    this.client.on("connect", () => {
      this.isConnected = true;
      console.log("Redis 연결 성공!");
    });

    this.client.on("error", (err) => {
      this.isConnected = false;
      console.error("Redis 연결 에러:", err);
    });

    this.client.on("close", () => {
      console.log("Redis 연결이 종료되었습니다.");
      this.isConnected = false;
    });

    this.client.on("reconnecting", () => {
      console.log("Redis 재연결 시도 중...");
    });

    try {
      await this.client.ping();
      this.isConnected = true;
    } catch (error) {
      console.error("Redis 초기화 에러:", error);
      this.isConnected = false;

      if (this.client) {
        this.client.disconnect();
      }
      throw error;
    }
  }

  public getRedisClient() {
    if (!this.initialized || !this.client) {
      throw new Error(
        "RedisClient가 초기화되지 않았습니다. getInstance()를 먼저 호출해주세요."
      );
    }

    return {
      client: this.client,
      isConnected: this.isConnected,
      message: this.isConnected
        ? "Redis가 연결되었습니다."
        : "Redis가 연결되지 않았습니다.",
    };
  }
}
