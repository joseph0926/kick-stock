import React from "react";
import { QUERY_KEY } from "@kickstock/shared/src/lib/query-key";
import { useQuery } from "@tanstack/react-query";
import { getLeagueBasic } from "../../../services/league.service";
import {
  LeaguesDataType,
  LeagueType,
} from "@kickstock/shared/src/types/league.type";
import { LeagueHeader } from "./league-header";
import { LeagueChart } from "../chart/league-chart";
import { useLocation } from "react-router";

export const LeagueWrapper = ({ league }: { league: LeagueType }) => {
  const { state } = useLocation() as { state?: { league: LeaguesDataType } };

  const { data: leagueData } = useQuery({
    queryKey: QUERY_KEY.LEAGUE.BASIC(league),
    queryFn: () => getLeagueBasic(league),
    staleTime: Infinity,
    placeholderData: state?.league
      ? {
          data: {
            id: state.league.id,
            name: state.league.name,
            img: state.league.img,
            nameEng: state.league.nameEng,
            uniqueName: state.league.nameShort,
            values: [],
          },
          success: true,
          message: "",
        }
      : undefined,
    select: (data) => data.data,
  });

  return (
    <div className="flex flex-col gap-10">
      <LeagueHeader leagueData={leagueData} />
      {/* {leagueData ? <LeagueChart leagueData={leagueData} /> : <div />} */}
    </div>
  );
};
