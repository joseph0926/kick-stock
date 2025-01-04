import { dehydrate } from "@tanstack/react-query";
import { QUERY_KEY } from "@kickstock/shared/src/lib/query-key";
import { getLeaguesData } from "@kickstock/core/src/services/league.service";
import { makeQueryClient } from "@kickstock/core/src/providers/query.provider";

export async function leagueDataPrefetch() {
  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery({
    queryKey: QUERY_KEY.LEAGUE.DEFAULT,
    queryFn: getLeaguesData,
    staleTime: Infinity,
  });

  return { leaguesQuery: dehydrate(queryClient) };
}
