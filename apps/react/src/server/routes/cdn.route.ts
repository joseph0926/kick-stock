import axios from "axios";
import { FastifyInstance } from "fastify";

const cdnCachePurge = axios.create({
  baseURL:
    "https://purge.jsdelivr.net/gh/joseph0926/kick-stock/packages/data-cdn",
});

const LEAGUES = ["bundes", "epl", "laliga", "ligue", "serie"];
const VALUE_TYPES = ["index", "profit", "revenue"];
const YEARS = ["2024"];

interface PurgeResult {
  path: string;
  status: "success" | "failed";
  statusCode?: number;
  error?: string;
}

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
            data: {
              type: "object",
              properties: {
                timestamp: { type: "string" },
                totalPaths: { type: "number" },
                successCount: { type: "number" },
                failureCount: { type: "number" },
                results: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      path: { type: "string" },
                      status: { type: "string" },
                      statusCode: { type: "number" },
                      error: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            error: { type: "string" },
            timestamp: { type: "string" },
            details: {
              type: "object",
              properties: {
                reason: { type: "string" },
              },
            },
          },
        },
        500: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            error: { type: "string" },
            timestamp: { type: "string" },
            details: {
              type: "object",
              properties: {
                reason: { type: "string" },
                failedPaths: {
                  type: "array",
                  items: { type: "string" },
                },
                errorMessages: {
                  type: "array",
                  items: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const timestamp = new Date().toISOString();
      const expectedSecret = process.env.CACHE_SECRET;
      const providedSecret = request.headers["x-cache-secret"];

      if (!expectedSecret || expectedSecret !== providedSecret) {
        return reply.code(401).send({
          success: false,
          error: "Unauthorized",
          timestamp,
          details: {
            reason: "Invalid or missing cache secret",
          },
        });
      }

      try {
        const paths: string[] = [];

        paths.push("/leagues/leagues.json");
        VALUE_TYPES.forEach((type) => {
          paths.push(`/leagues/${type}-value.json`);
        });
        LEAGUES.forEach((league) => {
          paths.push(`/leagues/2024/${league}.json`);
        });
        YEARS.forEach((year) => {
          LEAGUES.forEach((league) => {
            paths.push(`/club/${year}/${league}.json`);
          });
        });

        const results: PurgeResult[] = [];

        for (const path of paths) {
          try {
            const response = await cdnCachePurge.get(path);
            results.push({
              path,
              status: "success",
              statusCode: response.status,
            });
          } catch (error) {
            results.push({
              path,
              status: "failed",
              statusCode: axios.isAxiosError(error)
                ? error.response?.status
                : undefined,
              error: axios.isAxiosError(error)
                ? error.message
                : error instanceof Error
                  ? error.message
                  : "Unknown error",
            });
          }
        }

        const successResults = results.filter((r) => r.status === "success");
        const failureResults = results.filter((r) => r.status === "failed");

        if (failureResults.length > 0) {
          fastify.log.error(
            "Some cache purge requests failed:",
            failureResults,
          );
          return reply.code(500).send({
            success: false,
            error: "Some cache purge requests failed",
            timestamp,
            details: {
              reason: "Partial failure in cache purge operation",
              failedPaths: failureResults.map((r) => r.path),
              errorMessages: failureResults.map((r) => r.error).filter(Boolean),
              successCount: successResults.length,
              failureCount: failureResults.length,
              totalPaths: paths.length,
            },
          });
        }

        return {
          success: true,
          message: "Cache purge completed successfully",
          data: {
            timestamp,
            totalPaths: paths.length,
            successCount: successResults.length,
            failureCount: 0,
            results: results.map(({ path, status, statusCode }) => ({
              path,
              status,
              statusCode,
            })),
          },
        };
      } catch (error) {
        fastify.log.error("Cache purge error:", error);
        return reply.code(500).send({
          success: false,
          error: "Cache purge operation failed",
          timestamp,
          details: {
            reason: error instanceof Error ? error.message : "Unknown error",
            errorType:
              error instanceof Error ? error.constructor.name : "Unknown",
            stack: error instanceof Error ? error.stack : undefined,
          },
        });
      }
    },
  });
};
