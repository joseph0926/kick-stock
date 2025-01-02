import React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@kickstock/ui/src/components/ui/chart";
import { FormatedLeaguesMarketValueType } from "@kickstock/shared/src/types/league.type";
import { formatCurrency } from "@kickstock/shared/src/lib/format-currency";

const chartConfig = {
  value: {
    label: "시가총액",
    color: "#2563eb",
  },
} satisfies ChartConfig;

const formatYAxis = (value: number) => {
  return formatCurrency(value, "KRW");
};

export function HomeLeaguesMarketValueChart({
  marketValue,
}: {
  marketValue: FormatedLeaguesMarketValueType;
}) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <LineChart data={marketValue.values.reverse()}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" tickFormatter={(value) => value.slice(2)} />
        <YAxis tickFormatter={formatYAxis} domain={["auto", "auto"]} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(data) => (
                <div className="flex items-center gap-2.5 space-y-2">
                  <p className="text-sm font-medium text-primary">시가총액: </p>
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
