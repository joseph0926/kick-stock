import {
  getLeagueBasicController,
  getLeagueClubsController,
} from "@/controllers/league.controller.js";
import {
  LeagueBasicSchema,
  LeagueClubsSchema,
  LeagueBasicType,
  LeagueClubsType,
} from "@/schemas/league.schema.js";
import { ApiResponse } from "@kickstock/shared/src/types/common.type.js";
import { LeagueType } from "@kickstock/shared/src/types/league.type.js";
import { LeagueUniqueName } from "@prisma/client";
import { Type } from "@sinclair/typebox";
import { FastifyInstance, FastifyPluginOptions } from "fastify";

export type LeagueBasicRouteGeneric = {
  Params: { league: LeagueType };
  Reply: ApiResponse<LeagueBasicType>;
};

export type LeagueClubsRouteGeneric = {
  Params: { league: LeagueType };
  Reply: ApiResponse<LeagueClubsType>;
};

export const leagueRoute = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.get<LeagueBasicRouteGeneric>("/:league/basic", {
    schema: {
      params: Type.Object({
        league: Type.Enum(LeagueUniqueName),
      }),
      response: {
        200: Type.Object({
          data: Type.Union([LeagueBasicSchema, Type.Null()]),
          success: Type.Boolean(),
          message: Type.Optional(Type.String()),
        }),
      },
    },
    handler: getLeagueBasicController,
  });

  fastify.get<LeagueClubsRouteGeneric>("/:league/clubs", {
    schema: {
      params: Type.Object({
        league: Type.Enum(LeagueUniqueName),
      }),
      response: {
        200: Type.Object({
          data: Type.Union([LeagueClubsSchema, Type.Null()]),
          success: Type.Boolean(),
          message: Type.Optional(Type.String()),
        }),
      },
    },
    handler: getLeagueClubsController,
  });
};
