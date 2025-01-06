import { Redis } from "ioredis";
import { isProd } from "./lib/utils.js";
import dotenv from "dotenv";

dotenv.config();

export class RedisClient {
  private client: Redis | null = null;
  private isConnected: boolean = false;
  private static instance: RedisClient;

  private constructor() {
    if (isProd) {
      this.initializeRedis();
    } else {
      console.log("개발 환경에서는 Redis를 사용하지 않습니다.");
    }
  }

  static getInstance() {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }

  private async initializeRedis() {
    try {
      this.client = new Redis(process.env.REDIS_URL as string);

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

  getRedisClient() {
    if (!isProd) {
      return {
        client: null,
        isConnected: false,
        message: "개발 환경에서는 Redis가 비활성화되어 있습니다.",
      };
    }
    return { client: this.client, isConnected: this.isConnected };
  }
}
