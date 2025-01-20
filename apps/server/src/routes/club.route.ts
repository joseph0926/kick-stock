import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { Type } from "@sinclair/typebox";
import {
  getClubsHistoryController,
  getClubRealTimeController,
} from "@/controllers/club.controller.js";
import {
  ClubRealTimeSchema,
  ClubRealTimeType,
  ClubsHistorySchema,
  ClubsHistoryType,
} from "@/schemas/club.schema.js";
import { ApiResponse } from "@kickstock/shared/src/types/common.type.js";
import { LeagueUniqueName } from "@prisma/client";

export type ClubsHistoryRouteGeneric = {
  Params: { league: LeagueUniqueName };
  Reply: ApiResponse<ClubsHistoryType>;
};

export type ClubRealTimeRouteGeneric = {
  Params: { clubId: string };
  Reply: ApiResponse<ClubRealTimeType>;
};

export const clubRoute = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.get<ClubsHistoryRouteGeneric>("/:league/history", {
    schema: {
      params: Type.Object({
        league: Type.Enum(LeagueUniqueName),
      }),
      response: {
        200: Type.Object({
          data: Type.Union([ClubsHistorySchema, Type.Null()]),
          success: Type.Boolean(),
          message: Type.Optional(Type.String()),
        }),
      },
    },
    handler: getClubsHistoryController,
  });

  fastify.get<ClubRealTimeRouteGeneric>("/:clubId/realtime", {
    schema: {
      params: Type.Object({
        clubId: Type.String(),
      }),
      response: {
        200: Type.Object({
          data: Type.Union([ClubRealTimeSchema, Type.Null()]),
          success: Type.Boolean(),
          message: Type.Optional(Type.String()),
        }),
      },
    },
    handler: getClubRealTimeController,
  });
};
