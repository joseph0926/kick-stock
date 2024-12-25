import { getAllClubs } from "@/controllers/clubs.controller.js";
import { LeaguesSchema } from "@/schemas/club.schema.js";
import { Type } from "@sinclair/typebox";
import { FastifyInstance, FastifyPluginOptions } from "fastify";

export const clubRoute = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.get("/", {
    schema: {
      response: {
        200: Type.Object({
          data: Type.Union([Type.Array(LeaguesSchema), Type.Null()]),
          success: Type.Boolean(),
          message: Type.Optional(Type.String()),
        }),
      },
    },
    handler: getAllClubs,
  });
};
