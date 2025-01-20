import React from "react";
import { DataTable } from "@kickstock/ui/src/components/ui/data-table";
import { columns } from "./home-club-table-columns";

export const HomeClubTable = ({
  clubStockData,
}: {
  clubStockData: {
    name: string;
    rawEUR: number;
    rawUSD: number;
    rawKRW: number;
    currentEUR: string;
    currentUSD: string;
    currentKRW: string;
    changeRate: number;
  }[];
}) => {
  return (
    <div className="my-12 w-full">
      <div className="min-h-[34.5vh] rounded-md border">
        {clubStockData && <DataTable columns={columns} data={clubStockData} />}
      </div>
    </div>
  );
};
