import {
  LeaguesDataType,
  LeaguesValueType,
  LeagueType,
} from "@kickstock/shared/src/types/league.type";
import {
  LeagueBasicType,
  LeagueClubsType,
} from "@kickstock/shared/src/types/prisma/league.type";
import { apiAxios, ssrCdnAxios } from "./api";
import { ApiResponse } from "@kickstock/shared/src/types/common.type";

// CDN api

export const getLeaguesData = async (): Promise<LeaguesDataType[]> => {
  const { data } = await ssrCdnAxios.get("/leagues/leagues.json");
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

// Server api

export const getLeagueBasic = async (
  league: LeagueType,
): Promise<ApiResponse<LeagueBasicType>> => {
  const { data } = await apiAxios(`/league/${league}/basic`);
  return data;
};

export const getLeagueClubs = async (
  league: LeagueType,
): Promise<ApiResponse<LeagueClubsType>> => {
  const { data } = await apiAxios(`/league/${league}/clubs`);
  return data;
};
