import { formatLeagueValue } from "@kickstock/shared/src/lib/format-league-value";
import { QUERY_KEY } from "@kickstock/shared/src/lib/query-key";
import {
  FormatedLeaguesValueType,
  LeagueType,
} from "@kickstock/shared/src/types/league.type";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  getLeaguesRevenueValue,
  getLeaguesProfitValue,
  getLeaguesIndexValue,
} from "../services/league.service";
import { HomeInnerTabType } from "@kickstock/shared/src/types/common.type";

export const useLeaguesData = (innerTabValue: HomeInnerTabType) => {
  const { data: leaguesRevenueValue } = useSuspenseQuery({
    queryKey: QUERY_KEY.LEAGUE.REVENUE_VALUE,
    queryFn: getLeaguesRevenueValue,
    staleTime: Infinity,
    select: (data) => formatLeagueValue(data),
  });
  const { data: leaguesProfitValue } = useSuspenseQuery({
    queryKey: QUERY_KEY.LEAGUE.PROFIT_VALUE,
    queryFn: getLeaguesProfitValue,
    staleTime: Infinity,
    select: (data) => formatLeagueValue(data),
  });
  const { data: leaguesIndexValue } = useSuspenseQuery({
    queryKey: QUERY_KEY.LEAGUE.INDEX_VALUE,
    queryFn: getLeaguesIndexValue,
    staleTime: Infinity,
    select: (data) => formatLeagueValue(data),
  });

  const getLeagueValue = useCallback(
    (league: LeagueType) => {
      const defaultValue: FormatedLeaguesValueType = {
        name: league,
        values: [{ rawValue: 0, year: "", value: "0" }],
      };

      switch (innerTabValue) {
        case "index":
          return (
            leaguesIndexValue.find(
              (leagueValue) => leagueValue.name === league,
            ) ?? defaultValue
          );
        case "revenue":
          return (
            leaguesRevenueValue.find(
              (leagueValue) => leagueValue.name === league,
            ) ?? defaultValue
          );
        case "profit":
          return (
            leaguesProfitValue.find(
              (leagueValue) => leagueValue.name === league,
            ) ?? defaultValue
          );
        default:
          return (
            leaguesIndexValue.find(
              (leagueValue) => leagueValue.name === league,
            ) ?? defaultValue
          );
      }
    },
    [innerTabValue],
  );

  return {
    getLeagueValue,
  };
};
