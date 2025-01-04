import { LeagueType } from "@kickstock/shared/src/types/league.type";
import { ssrCdnAxios } from "./api";
import { ClubStockType } from "@kickstock/shared/src/types/club.type";

export const getClubStocksData = async (
  league: LeagueType,
): Promise<ClubStockType> => {
  const { data } = await ssrCdnAxios.get(`/club/${league}.json`);
  return data;
};
