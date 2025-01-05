import React, { JSX } from "react";
import { LeagueList } from "./league-list";
import {
  HomeInnerTabType,
  HomeTabType,
} from "@kickstock/shared/src/types/common.type";
import { HomeClubTable } from "../../shared/table/home-club-table";

export const HomeTabContent = ({
  outerTabValue,
  innerTabValue,
}: {
  outerTabValue: HomeTabType;
  innerTabValue: HomeInnerTabType;
}) => {
  let content: JSX.Element | null;

  switch (outerTabValue) {
    case "all":
      content = <LeagueList innerTabValue={innerTabValue} />;
      break;
    case "club":
      content = <HomeClubTable league="epl" />;
      break;
    case "player":
      content = null;
      break;
    default:
      content = null;
  }
  return content;
};
