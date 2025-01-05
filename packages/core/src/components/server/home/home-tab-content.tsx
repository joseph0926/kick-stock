import React, { JSX, Suspense } from "react";
import { LeagueList } from "./league-list";
import {
  HomeInnerTabType,
  HomeTabType,
} from "@kickstock/shared/src/types/common.type";
import { HomeClubTable } from "../../shared/table/home-club-table";
import { HomeClubWrapper } from "../../shared/table/home-club-wrapper";
import { LeagueType } from "@kickstock/shared/src/types/league.type";

export const HomeTabContent = ({
  outerTabValue,
  innerTabValue,
}: {
  outerTabValue: HomeTabType;
  innerTabValue: HomeInnerTabType | LeagueType;
}) => {
  let content: JSX.Element | null;

  const isHomeInnerTabType = (
    value: HomeInnerTabType | LeagueType | null | undefined,
  ): value is HomeInnerTabType => {
    const normalizedValue = value ?? "index";

    return ["index", "revenue", "profit"].includes(
      normalizedValue as HomeInnerTabType,
    );
  };
  const isLeagueType = (
    value: HomeInnerTabType | LeagueType,
  ): value is LeagueType => {
    const normalizedValue = value ?? "bundes";
    return ["bundes", "epl", "laliga", "ligue", "serie"].includes(
      normalizedValue as LeagueType,
    );
  };

  switch (outerTabValue) {
    case "all":
      if (!isHomeInnerTabType(innerTabValue)) {
        return null;
      }
      content = <LeagueList innerTabValue={innerTabValue ?? "all"} />;
      break;
    case "club":
      if (!isLeagueType(innerTabValue)) {
        return null;
      }
      content = (
        <Suspense>
          <HomeClubWrapper league={innerTabValue ?? "bundes"} />
        </Suspense>
      );
      break;
    case "player":
      content = null;
      break;
    default:
      content = null;
  }
  return content;
};
