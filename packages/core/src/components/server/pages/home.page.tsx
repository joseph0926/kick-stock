import { LeaguesDataType } from "@kickstock/shared/src/types/league.type";
import React from "react";
import { useRouteLoaderData } from "react-router";
import { LeagueList } from "../home/league-list";

export function HomePage() {
  const leaguesData = useRouteLoaderData<LeaguesDataType[]>("root");

  return (
    <div className="flex w-full flex-col items-center gap-6 px-4 sm:px-6 md:px-10">
      <LeagueList leaguesData={leaguesData} />
    </div>
  );
}
