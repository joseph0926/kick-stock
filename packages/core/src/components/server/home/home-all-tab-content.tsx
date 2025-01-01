import React from "react";
import { LeagueList } from "./league-list";
import { useRouteLoaderData } from "react-router";
import { LeaguesDataType } from "@kickstock/shared/src/types/league.type";

export const HomeAllTabContent = () => {
  const leaguesData = useRouteLoaderData<LeaguesDataType[]>("root");

  return <LeagueList leaguesData={leaguesData} />;
};
