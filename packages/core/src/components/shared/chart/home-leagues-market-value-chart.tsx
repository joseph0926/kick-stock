import React from "react";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
} from "@kickstock/ui/src/components/ui/chart";
import { MarketValueType } from "@kickstock/shared/src/types/league.type";

const chartConfig = {
  KRW: {
    label: "KRW",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export function HomeLeaguesMarketValueChart({
  marketValue,
}: {
  marketValue: MarketValueType;
}) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <LineChart data={marketValue.values}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="KRW"
          stroke="var(--color-KRW)"
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
