import { dehydrate } from "@tanstack/react-query";
import { QUERY_KEY } from "@kickstock/shared/src/lib/query-key";
import { getLeaguesData } from "@kickstock/core/src/services/league.service";
import { makeQueryClient } from "@kickstock/core/src/providers/query.provider";
import { getClubStocksData } from "@kickstock/core/src/services/club.service";
import { LeagueType } from "@kickstock/shared/src/types/league.type";

const leagues: LeagueType[] = ["bundes", "epl", "laliga", "ligue", "serie"];

export async function prefetchQuery() {
  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery({
    queryKey: QUERY_KEY.LEAGUE.DEFAULT,
    queryFn: getLeaguesData,
    staleTime: Infinity,
  });
  leagues.map(async (league) => {
    await queryClient.prefetchQuery({
      queryKey: QUERY_KEY.CLUB.STOCK(league),
      queryFn: () => getClubStocksData(league),
      staleTime: Infinity,
    });
  });

  return { prefetchQueries: dehydrate(queryClient) };
}
