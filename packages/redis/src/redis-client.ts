import { Redis } from "ioredis";
import { isProd } from "./lib/utils.js";
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
      if (isProd) {
        await RedisClient.instance.initializeRedis();
      } else {
        console.log("개발 환경에서는 Redis를 사용하지 않습니다.");
      }
      RedisClient.instance.initialized = true;
    }
    return RedisClient.instance;
  }

  private async initializeRedis() {
    try {
      this.client = new Redis(process.env.REDIS_URL as string);

      await new Promise<void>((resolve, reject) => {
        this.client!.on("connect", () => {
          this.isConnected = true;
          console.log("Redis 연결 성공!");
          resolve();
        });

        this.client!.on("error", (err) => {
          console.error("Redis 연결 에러:", err);
          this.isConnected = false;
          this.closeConnection();
          reject(err);
        });

        setTimeout(() => {
          reject(new Error("Redis 연결 타임아웃"));
        }, 5000);
      });
    } catch (error) {
      console.error("Redis 초기화 에러:", error);
      this.isConnected = false;
      throw error;
    }
  }

  private closeConnection() {
    if (this.client) {
      this.client.disconnect();
      this.client = null;
      this.isConnected = false;
    }
  }

  getRedisClient() {
    if (!this.initialized) {
      console.error(
        "RedisClient가 초기화되지 않았습니다. getInstance()를 먼저 호출해주세요."
      );
      return {
        client: null,
        isConnected: false,
        message: "RedisClient가 초기화되지 않았습니다.",
      };
    }

    if (!isProd) {
      return {
        client: null,
        isConnected: false,
        message: "개발 환경에서는 Redis가 비활성화되어 있습니다.",
      };
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
