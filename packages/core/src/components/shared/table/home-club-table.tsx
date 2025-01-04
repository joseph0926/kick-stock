import React from "react";
import { Input } from "@kickstock/ui/src/components/ui/input";
import { DataTable } from "@kickstock/ui/src/components/ui/data-table";
import { columns } from "./home-club-table-columns";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "@kickstock/shared/src/lib/query-key";
import { LeagueType } from "@kickstock/shared/src/types/league.type";
import { getClubStocksData } from "../../../services/club.service";

export const HomeClubTable = ({ league }: { league: LeagueType }) => {
  const { data: clubStockData } = useQuery({
    queryKey: QUERY_KEY.CLUB.STOCK(league),
    queryFn: () => getClubStocksData(league),
    select: (data) =>
      data.data.map((team) => ({
        name: team.name,
        currentEUR: team.values[team.values.length - 1].EUR,
        currentUSD: team.values[team.values.length - 1].USD,
        currentKRW: team.values[team.values.length - 1].KRW,
      })),
  });

  return (
    <div className="w-full">
      <div className="rounded-md border">
        {clubStockData && <DataTable columns={columns} data={clubStockData} />}
      </div>
    </div>
  );
};
