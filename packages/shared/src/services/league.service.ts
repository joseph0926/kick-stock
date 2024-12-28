import { LeagueType } from "../types/league.type";
import { ssrCdnAxios } from "./api";

export const getLeague = async (league: LeagueType) => {
  const { data } = await ssrCdnAxios(`/leagues/${league}.json`);
  return data;
};
