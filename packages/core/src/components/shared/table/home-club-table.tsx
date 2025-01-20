import React from "react";
import { DataTable } from "@kickstock/ui/src/components/ui/data-table";
import { columns } from "./home-club-table-columns";
import { ClubTableType } from "@kickstock/shared/src/types/club.type";

export const HomeClubTable = ({
  clubsHistoryData,
}: {
  clubsHistoryData: ClubTableType[];
}) => {
  return (
    <div className="my-12 w-full">
      <div className="min-h-[34.5vh] rounded-md border">
        {clubsHistoryData && (
          <DataTable columns={columns} data={clubsHistoryData} />
        )}
      </div>
    </div>
  );
};
