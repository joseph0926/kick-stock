import React from "react";
import { LeagueList } from "./league-list";
import { HomeInnerTabType } from "@kickstock/shared/src/types/common.type";

export const HomeTabContent = ({
  innerTabValue,
}: {
  innerTabValue: HomeInnerTabType;
}) => {
  return <LeagueList innerTabValue={innerTabValue} />;
};
