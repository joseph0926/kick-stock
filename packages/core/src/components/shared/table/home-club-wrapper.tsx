import React, { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LeagueType } from "@kickstock/shared/src/types/league.type";
import { QUERY_KEY } from "@kickstock/shared/src/lib/query-key";
import { HomeClubTable } from "./home-club-table";
import { formatCurrency } from "@kickstock/shared/src/lib/format-currency";
import { getClubsHistoryData } from "../../../services/club.service";

export const HomeClubWrapper = ({ league }: { league: LeagueType }) => {
  const { data: clubsResponse } = useSuspenseQuery({
    queryKey: QUERY_KEY.CLUB.STOCK(league),
    queryFn: () => getClubsHistoryData(league),
  });

  const tableData = useMemo(
    () =>
      clubsResponse.data?.map((club) => {
        const lastValue = club.values[club.values.length - 1];
        return {
          name: club.name,
          rawEUR: lastValue?.EUR ?? 0,
          rawKRW: lastValue?.KRW ?? 0,
          currentEUR: formatCurrency(lastValue?.EUR ?? 0, "EUR"),
          currentKRW: formatCurrency(lastValue?.KRW ?? 0, "KRW"),
          changeRate: lastValue?.changeRate ?? 0,
        };
      }) ?? [],
    [clubsResponse],
  );

  return <HomeClubTable clubsHistoryData={tableData} />;
};
