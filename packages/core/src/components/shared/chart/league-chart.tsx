import React, { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@kickstock/ui/src/components/ui/chart";
import { formatCurrency } from "@kickstock/shared/src/lib/format-currency";
import { useLeagueValues } from "../../../hooks/use-league-value";
import { LeagueBasicType } from "@kickstock/shared/src/types/prisma/league.type";
import { useMediaQuery } from "../../../hooks/use-media-query";

type LeagueChartProps = {
  leagueData: LeagueBasicType;
};

const chartConfig = {
  KRW: {
    label: "리그 가치",
    color: "hsl(var(--chart-1))",
    formatter: (value: number) => formatCurrency(value, "KRW"),
  },
  changeRate: {
    label: "변화율",
    color: "hsl(var(--chart-2))",
    formatter: (value: number) => `${value.toFixed(2)}%`,
  },
};

const CustomTooltipContent = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <p className="mb-1 text-sm">{label}</p>
      {payload.map((entry: any) => (
        <div
          key={entry.dataKey}
          className="flex items-center justify-between gap-2 px-2"
        >
          <div
            className="size-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-muted-foreground">
            {chartConfig[entry.dataKey as keyof typeof chartConfig].label}:
          </span>
          <span className="font-medium">
            {chartConfig[entry.dataKey as keyof typeof chartConfig].formatter(
              entry.value,
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

export const LeagueChart = ({ leagueData }: LeagueChartProps) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  const MAX_DATA_POINTS = useMemo(() => {
    if (isMobile) return 15;
    if (isTablet) return 25;
    return 40;
  }, [isMobile, isTablet]);

  const { values } = useLeagueValues(leagueData.id);

  const chartData = useMemo(() => {
    const recentValues = values.slice(-MAX_DATA_POINTS);

    return recentValues.map((value) => ({
      timestamp: new Date(value.timestamp).toLocaleTimeString(),
      KRW: value.KRW,
      changeRate: value.changeRate,
    }));
  }, [values]);

  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[400px] !w-screen overflow-x-hidden"
    >
      <LineChart
        data={chartData}
        accessibilityLayer
        margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="timestamp"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          interval="preserveStartEnd"
        />
        <YAxis
          yAxisId="krw"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tickFormatter={(value) => formatCurrency(value, "KRW")}
          domain={["auto", "auto"]}
        />
        <YAxis
          yAxisId="rate"
          orientation="right"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tickFormatter={(value) => `${value}%`}
          domain={["auto", "auto"]}
        />
        <ChartTooltip content={<CustomTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          yAxisId="krw"
          type="monotone"
          dataKey="KRW"
          stroke="var(--color-KRW)"
          dot={false}
          strokeWidth={2}
          isAnimationActive={true}
          animationDuration={300}
          animationEasing="ease-in-out"
        />
        <Line
          yAxisId="rate"
          type="monotone"
          dataKey="changeRate"
          stroke="var(--color-changeRate)"
          dot={false}
          strokeWidth={2}
          isAnimationActive={true}
          animationDuration={300}
          animationEasing="ease-in-out"
        />
      </LineChart>
    </ChartContainer>
  );
};
