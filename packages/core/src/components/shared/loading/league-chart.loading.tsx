import React from "react";
import { Skeleton } from "@kickstock/ui/src/components/ui/skeleton";
import { useChartDimensions } from "../../../hooks/use-chart-dimensions";

export const LeagueChartSkeleton = () => {
  const { containerRef, width, height } = useChartDimensions();

  return (
    <div ref={containerRef} className="w-screen">
      <Skeleton className="w-full" style={{ height: height || 400 }} />
    </div>
  );
};
