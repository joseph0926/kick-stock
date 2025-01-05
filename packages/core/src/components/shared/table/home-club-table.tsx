import React from "react";
import { Input } from "@kickstock/ui/src/components/ui/input";
import { DataTable } from "@kickstock/ui/src/components/ui/data-table";
import { columns } from "./home-club-table-columns";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "@kickstock/shared/src/lib/query-key";
import { LeagueType } from "@kickstock/shared/src/types/league.type";
import { getClubStocksData } from "../../../services/club.service";
import { TeamValue } from "@kickstock/shared/src/types/club.type";

export const HomeClubTable = ({
  clubStockData,
}: {
  clubStockData: TeamValue[];
}) => {
  return (
    <div className="w-full">
      <div className="rounded-md border">
        {clubStockData && <DataTable columns={columns} data={clubStockData} />}
      </div>
    </div>
  );
};
