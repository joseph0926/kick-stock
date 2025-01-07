import { FastifyInstance } from "fastify";
import { PageCache } from "@kickstock/redis/src";
import { isProd } from "../lib/env-utils";

export const redisRoute = (fastify: FastifyInstance) => {
  fastify.post("/api/redis/invalidate", {
    handler: async (request, reply) => {
      const expectedSecret = process.env.CACHE_SECRET;
      const providedSecret = request.headers["x-cache-secret"];

      if (!expectedSecret || expectedSecret !== providedSecret) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      try {
        const result = isProd
          ? await (await PageCache.getInstance()).invalidatePattern("/")
          : false;
        return { success: result };
      } catch (error) {
        console.error("Cache invalidation error:", error);
        return reply.code(500).send({ error: "Cache invalidation failed" });
      }
    },
  });
};
