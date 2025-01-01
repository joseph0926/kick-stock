import React from "react";
import { LeaguesDataType } from "@kickstock/shared/src/types/league.type";
import { Card } from "@kickstock/ui/src/components/ui/card";

export const LeagueCard = ({ league }: { league: LeaguesDataType }) => {
  return (
    <Card className="flex items-center gap-4 p-2 px-8">
      <div className="flex w-full items-center justify-between">
        <span className="text-sm font-medium">{league.name}</span>
        <img
          src={league.img}
          alt={league.name}
          className="size-10 object-contain"
        />
      </div>
    </Card>
  );
};
