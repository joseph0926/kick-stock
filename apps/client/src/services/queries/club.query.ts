import { LeagueType } from "@/types/league.type";
import { cdnAxiosInstance } from "../api";

export const getLeague = async (leagueName: LeagueType) => {
  const { data } = await cdnAxiosInstance.get(
    `/cdn/leagues/${leagueName}.json`,
  );
  return data;
};