import { QUERY_KEY } from "@kickstock/shared/src/lib/query-key";
import { LeagueType } from "@kickstock/shared/src/types/league.type";
import { useSuspenseQuery } from "@tanstack/react-query";
import { memo } from "react";
import { getClubStocksData } from "../../../services/club.service";
import { HomeClubTable } from "./home-club-table";

export const HomeClubWrapper = memo(({ league }: { league: LeagueType }) => {
  const { data: clubStockData } = useSuspenseQuery({
    queryKey: QUERY_KEY.CLUB.STOCK(league),
    queryFn: () => getClubStocksData(league),
    select: (data) =>
      data.data.map((team) => ({
        name: team.name,
        currentEUR: team.values[team.values.length - 1].EUR,
        currentUSD: team.values[team.values.length - 1].USD,
        currentKRW: team.values[team.values.length - 1].KRW,
      })),
  });

  return <HomeClubTable clubStockData={clubStockData} />;
});

HomeClubWrapper.displayName = "HomeClubWrapper";
