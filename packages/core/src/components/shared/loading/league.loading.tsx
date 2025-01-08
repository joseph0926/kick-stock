import React from "react";
import { Skeleton } from "@kickstock/ui/src/components/ui/skeleton";

export const LeagueLoading = () => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-start gap-4">
        <div className="size-20 rounded-lg bg-border">
          <Skeleton className="size-full" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xl font-bold">데이터가 존재하지 않습니다.</span>
          <span>전일대비: </span>
        </div>
      </div>
    </div>
  );
};
