import {
  LeaguesDataType,
  LeagueType,
} from "@kickstock/shared/src/types/league.type";
import { ssrCdnAxios } from "./api";

export const getLeaguesData = async (): Promise<LeaguesDataType[]> => {
  const { data } = await ssrCdnAxios.get("/leagues/leagues.json");
  return data;
};

export const getLeague = async (league: LeagueType) => {
  const { data } = await ssrCdnAxios(`/leagues/${league}.json`);
  return data;
};
