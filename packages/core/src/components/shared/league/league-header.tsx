import { LeaguesType } from "@kickstock/shared/src/types/league.type";
import { Skeleton } from "@kickstock/ui/src/components/ui/skeleton";
import { cn } from "@kickstock/ui/src/lib/utils";
import { Loader2 } from "lucide-react";
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
        <div className="flex items-center gap-2">
          전월대비:
          {leagueData && leagueData.values.length > 0 ? (
            <span
              className={cn(
                "font-semibold",
                leagueData.values[leagueData.values.length - 1].changeRate < 0
                  ? "text-red-500"
                  : "text-green-500",
              )}
            >
              {leagueData.values[
                leagueData.values.length - 1
              ].changeRate.toFixed(2)}
              %
            </span>
          ) : (
            <Loader2 className="size-4 animate-spin" />
          )}
        </div>
      </div>
    </div>
  );
};
