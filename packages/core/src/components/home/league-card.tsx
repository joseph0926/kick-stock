import React, { Suspense } from "react";
import { LeaguesDataType } from "@kickstock/shared/src/types/league.type";
import { Card } from "@kickstock/ui/src/components/ui/card";
import { HomeLeaguesValueChart } from "../shared/chart/home-leagues-value-chart";
import { HomeInnerTabType } from "@kickstock/shared/src/types/common.type";
import { HomeChartLoading } from "../shared/loading/home-chart.loading";

type LeagueCardProps = {
  league: LeaguesDataType;
  innerTabValue: HomeInnerTabType;
};

export const LeagueCard = ({ league, innerTabValue }: LeagueCardProps) => {
  return (
    <Card className="flex flex-col items-center gap-4 bg-primary/10 p-2">
      <div className="flex w-full items-center justify-between px-6">
        <span className="text-sm font-medium">{league.name}</span>
        <img
          src={league.img}
          alt={league.name}
          className="size-10 object-contain brightness-75"
        />
      </div>
      <Suspense fallback={<HomeChartLoading />}>
        <HomeLeaguesValueChart
          leagueName={league.nameShort}
          innerTabValue={innerTabValue}
        />
      </Suspense>
    </Card>
  );
};
