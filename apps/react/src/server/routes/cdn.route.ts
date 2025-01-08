import axios from "axios";
import { FastifyInstance } from "fastify";

const cdnCachePurge = axios.create({
  baseURL:
    "https://purge.jsdelivr.net/gh/joseph0926/kick-stock/packages/data-cdn",
});

const LEAGUES = ["bundes", "epl", "laliga", "ligue", "serie"];
const VALUE_TYPES = ["index", "profit", "revenue"];
const YEARS = ["2024"];

export const cdnCacheRoute = (fastify: FastifyInstance) => {
  fastify.post("/api/cdn-cache/invalidate", {
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
            message: { type: "string" },
            purgedPaths: {
              type: "array",
              items: { type: "string" },
            },
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
        const paths: string[] = [];

        paths.push("/leagues/leagues.json");

        VALUE_TYPES.forEach((type) => {
          paths.push(`/leagues/${type}-value.json`);
        });

        LEAGUES.forEach((league) => {
          paths.push(`/leagues/club/${league}.json`);
        });

        YEARS.forEach((year) => {
          LEAGUES.forEach((league) => {
            paths.push(`/club/${year}/${league}.json`);
          });
        });

        const purgePromises = paths.map((path) => cdnCachePurge.get(path));
        const results = await Promise.allSettled(purgePromises);

        const failures = results.filter(
          (result) => result.status === "rejected",
        );
        if (failures.length > 0) {
          fastify.log.error("Some cache purge requests failed:", failures);
          return reply.code(500).send({
            error: "Some cache purge requests failed",
          });
        }

        return {
          success: true,
          message: "All caches purged successfully",
          purgedPaths: paths,
        };
      } catch (error) {
        fastify.log.error("Cache purge error:", error);
        return reply.code(500).send({
          error: error instanceof Error ? error.message : "Cache purge failed",
        });
      }
    },
  });
};
