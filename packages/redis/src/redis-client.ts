import { Redis } from "ioredis";
import { isProd } from "@kickstock/shared/src/lib/env-util.js";
import dotenv from "dotenv";

dotenv.config();

export class RedisClient {
  private client: Redis | null = null;
  private isConnected: boolean = false;
  private static instance: RedisClient;
  private initialized: boolean = false;

  private constructor() {}

  static async getInstance() {
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
      if (!process.env.REDIS_URL || !process.env.REDIS_DEV_URL) {
        throw new Error("Redis URL 환경변수가 설정되지 않았습니다.");
      }
      return isProd ? process.env.REDIS_URL : process.env.REDIS_DEV_URL;
    }

    return isProd
      ? import.meta.env.VITE_REDIS_URL
      : import.meta.env.VITE_REDIS_DEV_URL;
  }

  private async initializeRedis() {
    try {
      if (this.client && this.isConnected) {
        return;
      }

      const redisUrl = RedisClient.getRedisUrl();
      if (!redisUrl) {
        throw new Error("Redis URL이 정의되지 않았습니다.");
      }

      this.client = new Redis(redisUrl, {
        retryStrategy(times) {
          return Math.min(times * 100, 3000);
        },
        reconnectOnError: (err) => {
          const targetError = "READONLY";
          if (err.message.includes(targetError)) {
            return true;
          }
          return false;
        },
      });

      await new Promise<void>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error("Redis 연결 타임아웃"));
        }, 5000);

        this.client!.on("connect", () => {
          this.isConnected = true;
          clearTimeout(timeoutId);
          console.log("Redis 연결 성공!");
          resolve();
        });

        this.client!.on("error", (err) => {
          clearTimeout(timeoutId);
          console.error("Redis 연결 에러:", err);
          this.isConnected = false;
          reject(err);
        });
      });

      this.client.on("close", () => {
        console.log("Redis 연결이 종료되었습니다.");
        this.isConnected = false;
      });

      this.client.on("reconnecting", () => {
        console.log("Redis 재연결 시도 중...");
      });
    } catch (error) {
      console.error("Redis 초기화 에러:", error);
      this.isConnected = false;
      throw error;
    }
  }

  getRedisClient() {
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
