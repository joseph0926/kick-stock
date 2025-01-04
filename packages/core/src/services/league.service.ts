import {
  LeaguesDataType,
  LeaguesValueType,
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

export const getLeaguesRevenueValue = async (): Promise<LeaguesValueType> => {
  const { data } = await ssrCdnAxios.get("/leagues/revenue-value.json");
  return data;
};

export const getLeaguesProfitValue = async (): Promise<LeaguesValueType> => {
  const { data } = await ssrCdnAxios.get("/leagues/profit-value.json");
  return data;
};

export const getLeaguesIndexValue = async (): Promise<LeaguesValueType> => {
  const { data } = await ssrCdnAxios.get("/leagues/index2-value.json");
  return data;
};
