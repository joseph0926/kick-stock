import { LeagueType } from "@kickstock/shared/src/types/league.type";
import React from "react";
import { useParams } from "react-router";

export const LeaguePage = () => {
  const params = useParams<{ leagueId: LeagueType }>();

  return <div className="p-4">League</div>;
};
