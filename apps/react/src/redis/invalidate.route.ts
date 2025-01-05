import { FastifyInstance } from "fastify";
import { redisClient } from "./redis-client";

export const invalidateRoute = (fastify: FastifyInstance) => {
  fastify.post("/api/redis/invalidate", {
    handler: async (request, reply) => {
      const expectedSecret = process.env.CACHE_SECRET;
      const providedSecret = request.headers["x-cache-secret"];

      console.log("Expected secret exists:", !!expectedSecret);
      console.log("Provided secret exists:", !!providedSecret);

      if (!expectedSecret || expectedSecret !== providedSecret) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      try {
        const result = await redisClient.flushAll();
        return { success: result };
      } catch (error) {
        console.error("Cache invalidation error:", error);
        return reply.code(500).send({ error: "Cache invalidation failed" });
      }
    },
  });
};
