import React, { useMemo } from "react";
import { LeaguesType } from "@kickstock/shared/src/types/league.type";
import { Skeleton } from "@kickstock/ui/src/components/ui/skeleton";
import { cn } from "@kickstock/ui/src/lib/utils";
import { Loader2 } from "lucide-react";
import { useSocketValue } from "../../../hooks/use-socket-value";
import { formatCurrency } from "@kickstock/shared/src/lib/format-currency";

type LeagueHeaderProps = {
  leagueData: LeaguesType | null;
};

export const LeagueHeader = ({ leagueData }: LeagueHeaderProps) => {
  const { value } = leagueData
    ? useSocketValue({
        type: "league",
        id: leagueData.id,
        year: leagueData.values[leagueData.values.length - 1].year,
      })
    : { value: null };

  const changeRate = useMemo(() => {
    if (leagueData && leagueData.values.length > 0)
      return leagueData?.values[leagueData.values.length - 1].changeRate;
  }, [leagueData]);
  const valueKRW = useMemo(() => {
    if (value && value.KRW) {
      return formatCurrency(value.KRW, "KRW");
    }
  }, [value]);

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
          전월대비:
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
