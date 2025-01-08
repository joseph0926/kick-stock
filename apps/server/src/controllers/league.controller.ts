import { FastifyReply, FastifyRequest, RouteHandler } from "fastify";
import { prisma } from "@/lib/prisma.js";
import { LeagueType } from "@kickstock/shared/src/types/league.type.js";
import { RouteGeneric } from "@/routes/league.route.js";

const validLeagues: LeagueType[] = [
  "bundes",
  "epl",
  "laliga",
  "ligue",
  "serie",
];

export const getLeague: RouteHandler<RouteGeneric> = async (
  req: FastifyRequest<RouteGeneric>,
  res: FastifyReply
) => {
  const { league } = req.params;
  const { hasClub = false } = req.query;
  if (!validLeagues.includes(league)) {
    return {
      data: null,
      success: false,
      message: "유효하지 않은 리그입니다.",
    };
  }

  try {
    const leagueData = await prisma.league.findUnique({
      where: {
        uniqueName: league,
      },
      include: {
        clubs: hasClub === true,
      },
    });
    if (!leagueData) {
      return {
        data: null,
        success: false,
        message: "해당 리그 데이터가 존재하지 않습니다.",
      };
    }

    return {
      data: leagueData,
      success: true,
      message: "해당 리그 데이터를 정상적으로 불러왔습니다.",
    };
  } catch (error) {
    req.server.log.error("[getLeague Error]: ", error);
    return {
      data: null,
      success: false,
      message: "리그 데이터를 불러오는데 실패하였습니다.",
    };
  }
};
