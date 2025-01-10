import { FastifyInstance } from "fastify";
import { PageCache } from "@kickstock/redis/src";

let pageCachePromise: Promise<PageCache> | null = null;

const getPageCacheInstance = async (
  timeout = 100,
): Promise<PageCache | null> => {
  if (!pageCachePromise) {
    pageCachePromise = PageCache.getInstance();
  }

  try {
    return await Promise.race([
      pageCachePromise,
      new Promise<null>((resolve) => setTimeout(() => resolve(null), timeout)),
    ]);
  } catch (error) {
    console.error("PageCache initialization error:", error);
    return null;
  }
};

export const redisRoute = (fastify: FastifyInstance) => {
  fastify.post("/api/redis/invalidate", {
    schema: {
      headers: {
        type: "object",
        required: ["x-cache-secret"],
        properties: {
          "x-cache-secret": { type: "string" },
          "x-cache-env": { type: "string", enum: ["dev", "prod"] },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: {
              type: "object",
              properties: {
                environment: { type: "string" },
                timestamp: { type: "string" },
                invalidationResult: { type: "boolean" },
                pattern: { type: "string" },
              },
            },
          },
        },
        401: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            error: { type: "string" },
            details: { type: "object" },
            timestamp: { type: "string" },
          },
        },
        500: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            error: { type: "string" },
            details: { type: "object" },
            timestamp: { type: "string" },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const expectedSecret = process.env.CACHE_SECRET;
      const providedSecret = request.headers["x-cache-secret"];
      const cacheEnv = (request.headers["x-cache-env"] as string) || "prod";
      const timestamp = new Date().toISOString();

      if (!expectedSecret || expectedSecret !== providedSecret) {
        return reply.code(401).send({
          success: false,
          error: "Unauthorized",
          details: {
            reason: "Invalid or missing cache secret",
            environment: cacheEnv,
          },
          timestamp,
        });
      }

      const currentEnv = process.env.NODE_ENV === "production" ? "prod" : "dev";
      if (currentEnv !== cacheEnv) {
        return reply.code(200).send({
          success: true,
          message: "Cache invalidation skipped",
          data: {
            environment: {
              current: currentEnv,
              requested: cacheEnv,
            },
            reason: "Environment mismatch",
            timestamp,
          },
        });
      }

      try {
        const pageCache = await getPageCacheInstance();

        if (!pageCache) {
          return reply.code(500).send({
            success: false,
            error: "Cache initialization failed",
            details: {
              reason: "Failed to initialize PageCache instance",
              environment: currentEnv,
              timeout: "100ms",
            },
            timestamp,
          });
        }

        const invalidationPattern = "";
        const result = await pageCache.invalidatePattern(invalidationPattern);

        return reply.code(200).send({
          success: true,
          message: result
            ? "Cache invalidation completed successfully"
            : "Cache invalidation completed with warnings",
          data: {
            environment: currentEnv,
            timestamp,
            invalidationResult: result,
            pattern: invalidationPattern,
            details: {
              patternUsed: invalidationPattern || "all",
              cacheInstance: "PageCache",
              operationType: "invalidation",
            },
          },
        });
      } catch (error) {
        console.error("Cache invalidation error:", error);

        return reply.code(500).send({
          success: false,
          error: "Cache invalidation failed",
          details: {
            reason: error instanceof Error ? error.message : "Unknown error",
            errorType:
              error instanceof Error ? error.constructor.name : "Unknown",
            environment: currentEnv,
            stack: error instanceof Error ? error.stack : undefined,
          },
          timestamp,
        });
      }
    },
  });
};
