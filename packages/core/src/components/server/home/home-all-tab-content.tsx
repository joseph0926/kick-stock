import React, { Suspense } from "react";
import { LeagueList } from "./league-list";
import { HomeAllTabContentLoading } from "../../shared/loading/home-all-tab-content.loading";

export const HomeAllTabContent = () => {
  return (
    <Suspense fallback={<HomeAllTabContentLoading />}>
      <LeagueList />
    </Suspense>
  );
};
