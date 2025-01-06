import { ApiResponse } from "@/types/api.type.js";
import { ClubType, LeaguesType } from "@/types/club.type.js";
import { FastifyReply, FastifyRequest, RouteHandler } from "fastify";

export const getAllClubs: RouteHandler<{
  Reply: ApiResponse<LeaguesType[]>;
}> = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    // const data = (await import("@/data/clubs.data.json"))
    //   .default as LeaguesType[];
    // return {
    //   data,
    //   success: true,
    //   message: "클럽 데이터를 전부 불러왔습니다.",
    // };
  } catch (error) {
    req.server.log.error("[getAllClubs methdo Error]:", error);
    return {
      data: null,
      success: false,
      message: "클럽 데이터를 불러오는데 실패하였습니다.",
    };
  }
};

// export const getClubsByLeague: RouteHandler<{Reply: ApiResponse<ClubType[]>}> = (req: FastifyRequest, res: FastifyReply) => {
//   try {
//     const data =
//   } catch (error) {

//   }
// }
