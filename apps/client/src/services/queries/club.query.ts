import { LeagueType } from "@kickstock/shared/src/types/league.type";
import { cdnAxiosInstance } from "../api";

export const getLeague = async (leagueName: LeagueType) => {
  const { data } = await cdnAxiosInstance.get(`/leagues/${leagueName}.json`);
  return data;
};
