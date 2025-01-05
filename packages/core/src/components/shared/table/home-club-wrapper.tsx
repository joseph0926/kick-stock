import React from "react";
import { QUERY_KEY } from "@kickstock/shared/src/lib/query-key";
import { LeagueType } from "@kickstock/shared/src/types/league.type";
import { useSuspenseQuery } from "@tanstack/react-query";
import { memo } from "react";
import { getClubStocksData } from "../../../services/club.service";
import { HomeClubTable } from "./home-club-table";
import { formatCurrency } from "@kickstock/shared/src/lib/format-currency";

export const HomeClubWrapper = memo(({ league }: { league: LeagueType }) => {
  const { data: clubStockData } = useSuspenseQuery({
    queryKey: QUERY_KEY.CLUB.STOCK(league),
    queryFn: () => getClubStocksData(league),
    select: (data) =>
      data.data.map((team) => ({
        name: team.name,
        rawEUR: team.values[team.values.length - 1].EUR,
        rawUSD: team.values[team.values.length - 1].USD,
        rawKRW: team.values[team.values.length - 1].KRW,
        currentEUR: formatCurrency(
          team.values[team.values.length - 1].EUR,
          "EUR",
        ),
        currentUSD: formatCurrency(
          team.values[team.values.length - 1].USD,
          "USD",
        ),
        currentKRW: formatCurrency(
          team.values[team.values.length - 1].KRW,
          "KRW",
        ),
        changeRate: team.values[team.values.length - 1].changeRate,
      })),
  });

  return <HomeClubTable clubStockData={clubStockData} />;
});

HomeClubWrapper.displayName = "HomeClubWrapper";
