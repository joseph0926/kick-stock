import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { Type } from "@sinclair/typebox";
import {
  getClubHistoryController,
  getClubRealTimeController,
} from "@/controllers/club.controller.js";
import {
  ClubHistorySchema,
  ClubRealTimeSchema,
  ClubHistoryType,
  ClubRealTimeType,
} from "@/schemas/club.schema.js";
import { ApiResponse } from "@kickstock/shared/src/types/common.type.js";

export type ClubHistoryRouteGeneric = {
  Params: { clubId: string };
  Reply: ApiResponse<ClubHistoryType>;
};

export type ClubRealTimeRouteGeneric = {
  Params: { clubId: string };
  Reply: ApiResponse<ClubRealTimeType>;
};

export const clubRoute = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.get<ClubHistoryRouteGeneric>("/:clubId/history", {
    schema: {
      params: Type.Object({
        clubId: Type.String(),
      }),
      response: {
        200: Type.Object({
          data: Type.Union([ClubHistorySchema, Type.Null()]),
          success: Type.Boolean(),
          message: Type.Optional(Type.String()),
        }),
      },
    },
    handler: getClubHistoryController,
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
