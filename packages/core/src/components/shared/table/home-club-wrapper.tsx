import React, { memo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LeagueType } from "@kickstock/shared/src/types/league.type";
import { QUERY_KEY } from "@kickstock/shared/src/lib/query-key";
import { getClubStocksData } from "../../../services/club.service";
import { HomeClubTable } from "./home-club-table";
import { formatCurrency } from "@kickstock/shared/src/lib/format-currency";

export const HomeClubWrapper = memo(({ league }: { league: LeagueType }) => {
  const { data: clubStockResponse } = useSuspenseQuery({
    queryKey: QUERY_KEY.CLUB.STOCK(league),
    queryFn: () => getClubStocksData(league),
  });
  // clubStockResponse: ApiResponse<ClubDataResponse>

  // 구조: clubStockResponse.data => ClubDataResponse
  // {
  //   id: string;
  //   name: string;
  //   values: [
  //     { id, year, clubId, EUR, KRW, changeRate }, ...
  //   ]
  // }

  const clubData = clubStockResponse.data.map((team) => {
    const lastVal = team.values[team.values.length - 1] || {};
    return {
      name: team.name,
      rawEUR: lastVal.EUR ?? 0,
      rawKRW: lastVal.KRW ?? 0,
      currentEUR: formatCurrency(lastVal.EUR ?? 0, "EUR"),
      currentKRW: formatCurrency(lastVal.KRW ?? 0, "KRW"),
      changeRate: lastVal.changeRate ?? 0,
    };
  });

  // 근데 구조가 "1클럽 -> values[]" 라면, .map((val) => ...) 하면 "N개의 로우"가 생김
  // UI상 "N개의 로우"를 보여주고 싶으면 OK
  // 만약 "마지막 값만" 보여주고 싶다면
  // const lastVal = clubStockResponse.data.values.slice(-1)[0];
  // ... 1개의 객체

  return <HomeClubTable clubStockData={clubData} />;
});

HomeClubWrapper.displayName = "HomeClubWrapper";
