import { LeaguesType } from "@kickstock/shared/src/types/league.type";
import { Skeleton } from "@kickstock/ui/src/components/ui/skeleton";
import React from "react";

type LeagueHeaderProps = {
  leagueData: LeaguesType | null;
};

export const LeagueHeader = ({ leagueData }: LeagueHeaderProps) => {
  return (
    <div className="flex items-center justify-start gap-4">
      <div className="size-20 rounded-lg bg-border">
        {leagueData && leagueData.img ? (
          <img
            src={leagueData.img}
            alt={leagueData.name}
            className="size-full p-4"
          />
        ) : (
          <Skeleton className="size-full" />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xl font-bold">
          {leagueData?.name ?? "데이터가 존재하지 않습니다."}
        </span>
        <span>전일대비: </span>
      </div>
    </div>
  );
};
