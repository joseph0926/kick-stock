import React from "react";
import { QUERY_KEY } from "@kickstock/shared/src/lib/query-key";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getLeague } from "../../../services/league.service";
import { LeagueType } from "@kickstock/shared/src/types/league.type";
import { LeagueHeader } from "./league-header";

export const LeagueWrapper = ({ league }: { league: LeagueType }) => {
  const { data: leagueData } = useSuspenseQuery({
    queryKey: QUERY_KEY.LEAGUE.DETAIL(league, false),
    queryFn: () => getLeague(league, false),
    staleTime: Infinity,
    select: (data) => data.data,
  });

  return (
    <div className="">
      <LeagueHeader leagueData={leagueData} />
    </div>
  );
};
