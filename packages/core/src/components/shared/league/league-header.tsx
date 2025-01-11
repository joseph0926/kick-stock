import React, { useMemo } from "react";
import { Skeleton } from "@kickstock/ui/src/components/ui/skeleton";
import { cn } from "@kickstock/ui/src/lib/utils";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@kickstock/shared/src/lib/format-currency";
import { LeagueBasicType } from "@kickstock/shared/src/types/prisma/league.type";
import { useLeagueValues } from "../../../hooks/use-league-value";

type LeagueHeaderProps = {
  leagueData?: LeagueBasicType | null;
};

export const LeagueHeader = ({ leagueData }: LeagueHeaderProps) => {
  const { latestValue } = useLeagueValues(leagueData?.id ?? "");

  const changeRate = useMemo(() => {
    if (latestValue && latestValue.changeRate) return latestValue.changeRate;
  }, [latestValue]);
  const valueKRW = useMemo(() => {
    if (latestValue && latestValue.KRW) {
      return formatCurrency(latestValue.KRW, "KRW");
    }
  }, [latestValue]);

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
        <div className="flex items-center gap-2.5">
          <span className="text-xl font-bold">
            {leagueData?.name ?? "데이터가 존재하지 않습니다."}
          </span>
          <span>{valueKRW ?? ""}</span>
        </div>
        <div className="flex items-center gap-2">
          직전 대비(실제: 1분, 테스트: 6초):
          {changeRate ? (
            <span
              className={cn(
                "font-semibold",
                changeRate < 0 ? "text-red-500" : "text-green-500",
              )}
            >
              {changeRate.toFixed(2)}%
            </span>
          ) : (
            <Loader2 className="size-4 animate-spin" />
          )}
        </div>
      </div>
    </div>
  );
};
