import React from "react";
import {
  FormatedLeaguesValueType,
  LeaguesDataType,
} from "@kickstock/shared/src/types/league.type";
import { Card } from "@kickstock/ui/src/components/ui/card";
import { HomeLeaguesValueChart } from "../../shared/chart/home-leagues-value-chart";
import { HomeInnerTabType } from "@kickstock/shared/src/types/common.type";

type LeagueCardProps = {
  league: LeaguesDataType;
  leagueValue?: FormatedLeaguesValueType;
  innerTabValue: HomeInnerTabType;
};

export const LeagueCard = ({
  league,
  leagueValue,
  innerTabValue,
}: LeagueCardProps) => {
  return (
    <Card className="flex flex-col items-center gap-4 p-2">
      <div className="flex w-full items-center justify-between px-6">
        <span className="text-sm font-medium">{league.name}</span>
        <img
          src={league.img}
          alt={league.name}
          className="size-10 object-contain"
        />
      </div>
      {leagueValue && (
        <HomeLeaguesValueChart
          leagueValue={leagueValue}
          innerTabValue={innerTabValue}
        />
      )}
    </Card>
  );
};
