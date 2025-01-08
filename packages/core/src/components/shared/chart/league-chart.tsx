import React from "react";
import { formatCurrency } from "@kickstock/shared/src/lib/format-currency";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@kickstock/ui/src/components/ui/chart";
import { LineChart } from "lucide-react";
import { CartesianGrid, XAxis, YAxis, Line } from "recharts";

const chartConfig = {
  value: {
    label: "year",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export const LeagueChart = () => {
  return (
    // <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
    //   <LineChart data={filteredMarketValue}>
    //     <CartesianGrid strokeDasharray="3 3" />
    //     <XAxis dataKey="year" tickFormatter={(value) => value.slice(2)} />
    //     <YAxis tickFormatter={formatYAxis} domain={["auto", "auto"]} />
    //     <ChartTooltip
    //       content={
    //         <ChartTooltipContent
    //           formatter={(data) => (
    //             <div className="flex items-center gap-2.5 space-y-2">
    //               <p className="text-sm font-medium text-primary">{year}: </p>
    //               <p className="pb-2 text-sm font-medium">
    //                 {formatCurrency(+data, "KRW")}
    //               </p>
    //             </div>
    //           )}
    //         />
    //       }
    //     />
    //     <Line
    //       type="monotone"
    //       dataKey="rawValue"
    //       stroke="var(--color-value)"
    //       dot={false}
    //     />
    //   </LineChart>
    // </ChartContainer>
    <div></div>
  );
};
