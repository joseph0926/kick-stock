import React, { useEffect, useState } from "react";
import { LeagueBasicType } from "@kickstock/shared/src/types/prisma/league.type";
import { useSocketValue } from "../../../hooks/use-socket-value";
import { formatCurrency } from "@kickstock/shared/src/lib/format-currency";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  Tooltip,
  // ResponsiveContainer,
} from "recharts";

/**
 * 차트에 표시할 데이터 구조
 * - time: 소켓 업데이트가 들어온 시점(타임스탬프) or 카운터
 * - rawValue: 해당 연도의 KRW 값
 */
type ChartData = {
  time: number; // Date.now() 등
  rawValue: number; // KRW
};

const recentYear = "2023";

export const LeagueChart = ({
  leagueData,
}: {
  leagueData: LeagueBasicType;
}) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const recentValue = leagueData.values.find((v) => v.year === recentYear);
    if (recentValue) {
      setChartData([
        {
          time: Date.now(),
          rawValue: recentValue.KRW,
        },
      ]);
    }
  }, [leagueData, recentYear]);

  const { value } = useSocketValue({
    type: "league",
    id: leagueData.id,
    year: recentYear,
  });

  useEffect(() => {
    if (!value) return;
    setChartData((prev) => [
      ...prev,
      {
        time: Date.now(),
        rawValue: value.KRW,
      },
    ]);
  }, [value]);

  useEffect(() => {
    if (chartData.length > 60) {
      setChartData((prev) => prev.slice(-60));
    }
  }, [chartData]);

  const formatYAxis = (val: number) => formatCurrency(val, "KRW");

  const formatXAxis = (ts: number) => {
    const date = new Date(ts);
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  };

  return (
    <div className="min-h-[200px] w-full">
      <LineChart width={600} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" tickFormatter={formatXAxis} />
        <YAxis tickFormatter={formatYAxis} />
        <Tooltip
          labelFormatter={(label) => `Time: ${formatXAxis(label as number)}`}
          formatter={(val: number) => formatCurrency(val, "KRW")}
        />
        <Line type="monotone" dataKey="rawValue" stroke="#2563eb" dot={false} />
      </LineChart>
    </div>
  );
};
