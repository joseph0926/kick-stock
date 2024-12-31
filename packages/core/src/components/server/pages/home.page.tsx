import React from "react";
import { LeaguesDataType } from "@kickstock/shared/src/types/league.type";
import { useRouteLoaderData } from "react-router";
import { LeagueList } from "../home/league-list";
import { HomeTab } from "../home/home-tab";

export function HomePage() {
  const leaguesData = useRouteLoaderData<LeaguesDataType[]>("root");

  return (
    <div className="flex w-full flex-col gap-6 px-4 sm:px-6 md:px-10">
      <HomeTab />
      <LeagueList leaguesData={leaguesData} />
    </div>
  );
}
