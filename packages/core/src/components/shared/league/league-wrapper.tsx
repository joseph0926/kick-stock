import React from "react";
import { QUERY_KEY } from "@kickstock/shared/src/lib/query-key";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getLeague } from "../../../services/league.service";
import { LeagueType } from "@kickstock/shared/src/types/league.type";
import { LeagueHeader } from "./league-header";
import { LeagueChart } from "../chart/league-chart";

export const LeagueWrapper = ({ league }: { league: LeagueType }) => {
  const { data: leagueData } = useSuspenseQuery({
    queryKey: QUERY_KEY.LEAGUE.DETAIL(league, false),
    queryFn: () => getLeague(league, false),
    staleTime: Infinity,
    select: (data) => data.data,
  });

  return (
    <div className="flex flex-col gap-10">
      <LeagueHeader leagueData={leagueData} />
      <LeagueChart />
    </div>
  );
};
