import { getAllClubs } from "@/controllers/clubs.controller.js";
import { getStockData } from "@/controllers/stock.controller.js";
import { FastifyInstance, FastifyPluginOptions } from "fastify";

export const stockRoute = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.get("/", {
    schema: {
      querystring: {
        type: "object",
        properties: {
          fn: { type: "string" },
          symbol: { type: "string" },
        },
        required: ["fn", "symbol"],
      },
      response: {
        200: {
          type: "object",
          properties: {
            data: { type: "object" },
            success: { type: "boolean" },
            message: { type: "string" },
          },
        },
      },
    },
    handler: getStockData,
  });
};
