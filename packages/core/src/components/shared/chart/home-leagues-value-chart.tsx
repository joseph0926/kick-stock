import React, { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@kickstock/ui/src/components/ui/chart";
import { LeagueType } from "@kickstock/shared/src/types/league.type";
import { formatCurrency } from "@kickstock/shared/src/lib/format-currency";
import { HomeInnerTabType } from "@kickstock/shared/src/types/common.type";
import { useLeaguesData } from "../../../hooks/use-leagues-data";

const formatYAxis = (value: number) => {
  return formatCurrency(value, "KRW");
};

export function HomeLeaguesValueChart({
  leagueName,
  innerTabValue,
}: {
  leagueName: LeagueType;
  innerTabValue: HomeInnerTabType;
}) {
  const { getLeagueValue } = useLeaguesData(innerTabValue);
  const leagueValue = getLeagueValue(leagueName);

  const filteredMarketValue = useMemo(
    () => leagueValue.values.slice().reverse(),
    [leagueValue],
  );

  const getLabel = () => {
    switch (innerTabValue) {
      case "index":
        return "브랜드가치";
      case "revenue":
        return "총수익";
      case "profit":
        return "영업이익";
      default:
        return "";
    }
  };

  const chartConfig = {
    value: {
      label: getLabel(),
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <LineChart data={filteredMarketValue}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" tickFormatter={(value) => value.slice(2)} />
        <YAxis tickFormatter={formatYAxis} domain={["auto", "auto"]} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(data) => (
                <div className="flex items-center gap-2.5 space-y-2">
                  <p className="text-sm font-medium text-primary">
                    {getLabel()}:{" "}
                  </p>
                  <p className="pb-2 text-sm font-medium">
                    {formatCurrency(+data, "KRW")}
                  </p>
                </div>
              )}
            />
          }
        />
        <Line
          type="monotone"
          dataKey="rawValue"
          stroke="var(--color-value)"
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
