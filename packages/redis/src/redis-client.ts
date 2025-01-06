import Redis from "ioredis";
import { isProd } from "./lib/utils";

export class RedisClient {
  private client: Redis | null = null;
  private isConnected: boolean = false;
  private static instance: RedisClient;

  private constructor() {
    if (isProd) {
      this.initializeRedis();
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
    return { client: this.client, isConnected: this.isConnected };
  }
}
