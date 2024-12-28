import { LeagueType } from "@kickstock/shared/src/types/league.type";
import { ssrCdnAxios } from "./api";

export const getLeague = async (league: LeagueType) => {
  const { data } = await ssrCdnAxios(`/leagues/${league}.json`);
  return data;
};
