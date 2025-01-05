import React from "react";
import { DataTable } from "@kickstock/ui/src/components/ui/data-table";
import { columns } from "./home-club-table-columns";
import { TeamValue } from "@kickstock/shared/src/types/club.type";

export const HomeClubTable = ({
  clubStockData,
}: {
  clubStockData: TeamValue[];
}) => {
  return (
    <div className="my-12 w-full">
      <div className="min-h-[34.5vh] rounded-md border">
        {clubStockData && <DataTable columns={columns} data={clubStockData} />}
      </div>
    </div>
  );
};
