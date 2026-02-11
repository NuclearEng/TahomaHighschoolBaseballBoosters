"use client";

import { SearchableTable, type ColumnDef } from "@/components/dashboard/searchable-table";
import { Trophy } from "lucide-react";

interface SeasonResult {
  year: number;
  league: string;
  leagueFinish: string;
  overall: string;
  playoff: string;
  champion?: boolean;
}

const columns: ColumnDef<SeasonResult>[] = [
  {
    id: "year",
    header: "Year",
    accessorFn: (row) => row.year,
    cell: (row) => (
      <span className="flex items-center gap-1 font-medium">
        {row.year}
        {row.champion && <Trophy className="h-3 w-3 text-[#FFCB1E]" />}
      </span>
    ),
  },
  {
    id: "league",
    header: "League",
    accessorFn: (row) => row.league,
    cell: (row) => (
      <span className="tabular-nums font-mono text-sm">{row.league}</span>
    ),
  },
  {
    id: "finish",
    header: "Finish",
    accessorFn: (row) => row.leagueFinish,
    cell: (row) => (
      <span
        className={
          row.leagueFinish === "1st"
            ? "font-semibold text-[#FFCB1E]"
            : row.leagueFinish === "2nd"
            ? "font-medium text-slate-500"
            : "text-muted-foreground"
        }
      >
        {row.leagueFinish}
      </span>
    ),
  },
  {
    id: "overall",
    header: "Overall",
    accessorFn: (row) => row.overall,
    cell: (row) => (
      <span className="tabular-nums font-mono text-sm">{row.overall}</span>
    ),
  },
  {
    id: "playoff",
    header: "Postseason",
    accessorFn: (row) => row.playoff,
    cell: (row) => (
      <span className="text-sm text-muted-foreground">{row.playoff}</span>
    ),
  },
];

export function SeasonTable({ data }: { data: SeasonResult[] }) {
  return (
    <SearchableTable
      data={data}
      columns={columns}
      searchPlaceholder="Search by year or postseason result..."
      rowKeyFn={(row) => String(row.year)}
      rowClassName={(row) => (row.champion ? "bg-[#FFCB1E]/5" : "")}
    />
  );
}
