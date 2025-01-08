import { getLeagueController } from "@/controllers/league.controller.js";
import { LeaguesSchema, LeaguesType } from "@/schemas/league.schema.js";
import { ApiResponse } from "@kickstock/shared/src/types/common.type.js";
import { LeagueType } from "@kickstock/shared/src/types/league.type.js";
import { LeagueUniqueName } from "@prisma/client";
import { Type } from "@sinclair/typebox";
import { FastifyInstance, FastifyPluginOptions } from "fastify";

export type RouteGeneric = {
  Params: { league: LeagueType };
  Querystring: { hasClub?: boolean };
  Reply: ApiResponse<LeaguesType>;
};

export const leagueRoute = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.get<RouteGeneric>("/:league", {
    schema: {
      querystring: Type.Object({
        hasClub: Type.Optional(Type.Boolean()),
      }),
      params: Type.Object({ league: Type.Enum(LeagueUniqueName) }),
      response: {
        200: Type.Object({
          data: Type.Union([LeaguesSchema, Type.Null()]),
          success: Type.Boolean(),
          message: Type.Optional(Type.String()),
        }),
      },
    },
    handler: getLeagueController,
  });
};
