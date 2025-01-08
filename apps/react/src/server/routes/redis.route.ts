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
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
          },
        },
        401: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
        500: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const expectedSecret = process.env.CACHE_SECRET;
      const providedSecret = request.headers["x-cache-secret"];

      if (!expectedSecret || expectedSecret !== providedSecret) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      try {
        const pageCache = await getPageCacheInstance();
        if (!pageCache) {
          return { success: false };
        }

        const result = await pageCache.invalidatePattern("/");
        return { success: result };
      } catch (error) {
        console.error("Cache invalidation error:", error);
        return reply.code(500).send({
          error:
            error instanceof Error
              ? error.message
              : "Cache invalidation failed",
        });
      }
    },
  });
};
