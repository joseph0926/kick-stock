import { LeagueType } from "@kickstock/shared/src/types/league.type";
import { ApiResponse } from "@kickstock/shared/src/types/common.type";
import { ClubDataResponse } from "@kickstock/shared/src/types/club.type";
import { apiAxios } from "./api";

export async function getClubStocksData(
  league: LeagueType,
): Promise<ApiResponse<ClubDataResponse>> {
  const { data } = await apiAxios.get(`/club/${league}/history`);

  if (!data.success || !data.data) {
    throw new Error(data.message || "클럽 데이터 불러오기 실패");
  }

  return data;
}
