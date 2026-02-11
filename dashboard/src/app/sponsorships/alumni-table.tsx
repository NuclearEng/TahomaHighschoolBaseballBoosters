"use client";

import { SearchableTable, type ColumnDef } from "@/components/dashboard/searchable-table";
import { Badge } from "@/components/ui/badge";
import type { CollegiateAlumni } from "@/lib/data/alumni";

const columns: ColumnDef<CollegiateAlumni>[] = [
  {
    id: "year",
    header: "Year",
    accessorFn: (row) => row.gradYear,
    cell: (row) => (
      <span className="font-medium tabular-nums text-xs sm:text-sm">
        {row.gradYear}
      </span>
    ),
    className: "w-16 sm:w-20",
  },
  {
    id: "name",
    header: "Player",
    accessorFn: (row) => row.name,
    cell: (row) => (
      <span className="flex flex-wrap items-center gap-1.5 whitespace-normal">
        {row.name}
        {row.drafted && (
          <Badge className="bg-[#00357b] text-[11px] px-1.5 py-0">
            MLB Draft
          </Badge>
        )}
        {row.proball && (
          <Badge
            variant="outline"
            className="text-[11px] px-1.5 py-0 border-blue-400 text-blue-600"
          >
            Pro Ball
          </Badge>
        )}
      </span>
    ),
  },
  {
    id: "teams",
    header: "College / Teams",
    accessorFn: (row) => row.teams,
    cell: (row) => (
      <span className="text-xs sm:text-sm text-muted-foreground whitespace-normal">
        {row.teams}
      </span>
    ),
    className: "whitespace-normal",
  },
];

export function AlumniTable({ data }: { data: CollegiateAlumni[] }) {
  return (
    <SearchableTable
      data={data}
      columns={columns}
      searchPlaceholder="Search alumni by name, year, or school..."
      rowKeyFn={(row, idx) => `${row.gradYear}-${row.name}-${idx}`}
      rowClassName={(row) =>
        row.drafted
          ? "bg-[#FFCB1E]/5"
          : row.proball
          ? "bg-blue-50"
          : ""
      }
    />
  );
}
