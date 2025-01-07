import { ApiResponse } from "@/types/api.type.js";
import { FastifyReply, FastifyRequest, RouteHandler } from "fastify";
import { prisma } from "@/lib/prisma.js";
import { LeagueType } from "@kickstock/shared/src/types/league.type.js";

const validLeagues: LeagueType[] = [
  "bundes",
  "epl",
  "laliga",
  "ligue",
  "serie",
];

export const getLeague: RouteHandler<{ Reply: ApiResponse }> = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { league } = req.params as { league: LeagueType };
  if (!validLeagues.includes(league)) {
    return {
      data: null,
      success: false,
      message: "유효하지 않은 리그입니다.",
    };
  }

  try {
    const data = await prisma.league.findUnique({
      where: {
        nameEng: league,
      },
    });
  } catch (error) {
    req.server.log.error("[getLeague Error]: ", error);
    return {
      data: null,
      success: false,
      message: "리그 데이터를 불러오는데 실패하였습니다.",
    };
  }
};

// export const getAllClubs: RouteHandler<{
//   Reply: ApiResponse<LeaguesType[]>;
// }> = async (req: FastifyRequest, res: FastifyReply) => {
//   try {
//     const data = (await import("@/data/clubs.data.json"))
//       .default as LeaguesType[];
//     return {
//       data,
//       success: true,
//       message: "클럽 데이터를 전부 불러왔습니다.",
//     };
//   } catch (error) {
//     req.server.log.error("[getAllClubs methdo Error]:", error);
//     return {
//       data: null,
//       success: false,
//       message: "클럽 데이터를 불러오는데 실패하였습니다.",
//     };
//   }
// };
