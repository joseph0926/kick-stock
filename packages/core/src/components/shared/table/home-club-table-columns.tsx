import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@kickstock/ui/src/components/ui/button";
import { TeamValue } from "@kickstock/shared/src/types/club.type";
import { cn } from "@kickstock/ui/src/lib/utils";

export const columns: ColumnDef<TeamValue>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          팀 이름
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "rate",
    accessorFn: (row) => row.changeRate,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          등락률
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const formatted = row.original.changeRate;
      return (
        <div
          className={cn(
            "font-medium",
            formatted < 0 ? "text-red-500" : "text-green-500",
          )}
        >
          {formatted}%
        </div>
      );
    },
  },
  {
    id: "KRW",
    accessorFn: (row) => row.rawKRW,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          시장가치 (KRW)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const formatted = row.original.currentKRW;
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    id: "EUR",
    accessorFn: (row) => row.rawEUR,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          시장가치 (EUR)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const formatted = row.original.currentEUR;
      return <div className="font-medium">{formatted}</div>;
    },
  },
];
