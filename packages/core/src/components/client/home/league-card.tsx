import React from "react";
import {
  LeaguesDataType,
  MarketValueType,
} from "@kickstock/shared/src/types/league.type";
import { Card } from "@kickstock/ui/src/components/ui/card";
import { HomeLeaguesMarketValueChart } from "../../shared/chart/home-leagues-market-value-chart";

type LeagueCardProps = {
  league: LeaguesDataType;
  markeyValue?: MarketValueType;
};

export const LeagueCard = ({ league, markeyValue }: LeagueCardProps) => {
  return (
    <Card className="flex flex-col items-center gap-4 p-2 px-8">
      <div className="flex w-full items-center justify-between">
        <span className="text-sm font-medium">{league.name}</span>
        <img
          src={league.img}
          alt={league.name}
          className="size-10 object-contain"
        />
      </div>
      {markeyValue && <HomeLeaguesMarketValueChart marketValue={markeyValue} />}
    </Card>
  );
};
