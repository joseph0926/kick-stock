import React, { Suspense } from "react";
import { LeagueList } from "./league-list";
import { HomeTabContentLoading } from "../../shared/loading/home-tab-content.loading";
import { HomeInnerTabType } from "@kickstock/shared/src/types/common.type";

export const HomeTabContent = ({
  innerTabValue,
}: {
  innerTabValue: HomeInnerTabType;
}) => {
  return (
    <Suspense fallback={<HomeTabContentLoading />}>
      <LeagueList innerTabValue={innerTabValue} />
    </Suspense>
  );
};
