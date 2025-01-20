import { RouteHandler } from "fastify";
import { prisma } from "@/lib/prisma.js";
import {
  ClubsHistoryRouteGeneric,
  ClubRealTimeRouteGeneric,
} from "@/routes/club.route.js";
import {
  fetchClubsHistoryFromCDN,
  redisFetchClubHistory,
  redisSaveClubHistory,
} from "@/services/club-cdn-redis.service.js";

export const getClubsHistoryController: RouteHandler<
  ClubsHistoryRouteGeneric
> = async (req, res) => {
  const { league } = req.params;

  try {
    const cdnData = await fetchClubsHistoryFromCDN(league);
    if (cdnData) {
      return {
        data: cdnData,
        success: true,
        message: "CDN에서 클럽 과거 데이터를 불러왔습니다.",
      };
    }

    const redisData = await redisFetchClubHistory(league);
    if (redisData) {
      return {
        data: redisData,
        success: true,
        message: "Redis에서 클럽 과거 데이터를 불러왔습니다.",
      };
    }

    const dbClubs = await prisma.club.findMany({
      where: { League: { uniqueName: league } },
      select: {
        name: true,
        nameEng: true,
        shortName: true,
        img: true,
        league: true,
        values: {
          select: {
            year: true,
            EUR: true,
            KRW: true,
            changeRate: true,
          },
        },
      },
    });

    if (!dbClubs || dbClubs.length === 0) {
      return {
        data: null,
        success: false,
        message: "해당 리그에 클럽이 존재하지 않습니다.",
      };
    }

    await redisSaveClubHistory(league, dbClubs);

    return {
      data: dbClubs,
      success: true,
      message: "DB에서 클럽 과거 데이터를 불러왔습니다.",
    };
  } catch (error) {
    req.server.log.error("[getClubsHistoryController Error]: ", error);
    return {
      data: null,
      success: false,
      message: "클럽 과거 데이터를 불러오는데 실패하였습니다.",
    };
  }
};

export const getClubRealTimeController: RouteHandler<
  ClubRealTimeRouteGeneric
> = async (req, res) => {
  const { clubId } = req.params;

  try {
    const realTimeData = await prisma.clubRealTimeValue.findMany({
      where: { clubId },
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
      message: "클럽 실시간 데이터를 불러왔습니다.",
    };
  } catch (error) {
    req.server.log.error("[getClubRealTime Error]: ", error);
    return {
      data: null,
      success: false,
      message: "클럽 실시간 데이터를 불러오는데 실패하였습니다.",
    };
  }
};
