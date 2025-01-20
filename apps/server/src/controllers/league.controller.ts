import { RouteHandler } from "fastify";
import { prisma } from "@/lib/prisma.js";
import { LeagueType } from "@kickstock/shared/src/types/league.type.js";
import {
  LeagueBasicRouteGeneric,
  LeagueClubsRouteGeneric,
  LeagueHistoryRouteGeneric,
  LeagueRealTimeRouteGeneric,
} from "@/routes/league.route.js";
import {
  fetchLeagueHistoryFromCDN,
  redisFetchLeagueHistory,
  redisSaveLeagueHistory,
} from "@/services/league-cdn-redis.service.js";

const validLeagues: LeagueType[] = [
  "bundes",
  "epl",
  "laliga",
  "ligue",
  "serie",
];

export const getLeagueBasicController: RouteHandler<
  LeagueBasicRouteGeneric
> = async (req, res) => {
  const { league } = req.params;
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
        values: true,
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
      message: "리그 기본 정보를 정상적으로 불러왔습니다.",
    };
  } catch (error) {
    req.server.log.error("[getLeagueBasic Error]: ", error);
    return {
      data: null,
      success: false,
      message: "리그 기본 정보를 불러오는데 실패하였습니다.",
    };
  }
};

export const getLeagueClubsController: RouteHandler<
  LeagueClubsRouteGeneric
> = async (req, res) => {
  const { league } = req.params;
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
      select: {
        id: true,
        uniqueName: true,
        clubs: {
          select: {
            id: true,
            name: true,
            nameEng: true,
            league: true,
            img: true,
            shortName: true,
          },
        },
      },
    });

    if (!leagueData) {
      return {
        data: null,
        success: false,
        message: "해당 리그의 클럽 데이터가 존재하지 않습니다.",
      };
    }

    return {
      data: leagueData,
      success: true,
      message: "리그의 클럽 정보를 정상적으로 불러왔습니다.",
    };
  } catch (error) {
    req.server.log.error("[getLeagueClubs Error]: ", error);
    return {
      data: null,
      success: false,
      message: "리그의 클럽 정보를 불러오는데 실패하였습니다.",
    };
  }
};

export const getLeagueHistoryController: RouteHandler<
  LeagueHistoryRouteGeneric
> = async (req, res) => {
  const { league } = req.params;
  if (!validLeagues.includes(league)) {
    return {
      data: null,
      success: false,
      message: "유효하지 않은 리그입니다.",
    };
  }

  try {
    const cdnData = await fetchLeagueHistoryFromCDN(league);
    if (cdnData) {
      return {
        data: cdnData,
        success: true,
        message: "CDN에서 리그 역사 데이터를 불러왔습니다.",
      };
    }

    const redisData = await redisFetchLeagueHistory(league);
    if (redisData) {
      return {
        data: redisData,
        success: true,
        message: "Redis 캐시에서 리그 역사 데이터를 불러왔습니다.",
      };
    }

    const leagueData = await prisma.league.findUnique({
      where: { uniqueName: league },
      include: {
        values: true,
      },
    });

    if (!leagueData) {
      return {
        data: null,
        success: false,
        message: "해당 리그 데이터가 존재하지 않습니다.",
      };
    }

    await redisSaveLeagueHistory(league, leagueData);

    return {
      data: leagueData,
      success: true,
      message: "DB에서 리그 역사 데이터를 불러왔습니다.",
    };
  } catch (error) {
    req.server.log.error("[getLeagueHistory Error]: ", error);
    return {
      data: null,
      success: false,
      message: "리그 역사 데이터를 불러오는데 실패하였습니다.",
    };
  }
};

export const getLeagueRealTimeController: RouteHandler<
  LeagueRealTimeRouteGeneric
> = async (req, res) => {
  const { league } = req.params;
  if (!validLeagues.includes(league)) {
    return {
      data: null,
      success: false,
      message: "유효하지 않은 리그입니다.",
    };
  }

  try {
    const realTimeData = await prisma.leagueRealTimeValue.findMany({
      where: { league: { uniqueName: league } },
      orderBy: { timestamp: "desc" },
      take: 50,
    });
    const mappedData = realTimeData.map((item) => ({
      ...item,
      timestamp: item.timestamp.toISOString(),
    }));

    return {
      data: mappedData.reverse(),
      success: true,
      message: "리그 실시간 데이터를 DB에서 불러왔습니다.",
    };
  } catch (error) {
    req.server.log.error("[getLeagueRealTime Error]: ", error);
    return {
      data: null,
      success: false,
      message: "리그 실시간 데이터를 불러오는데 실패하였습니다.",
    };
  }
};
