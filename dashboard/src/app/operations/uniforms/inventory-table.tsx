"use client";

import { SearchableTable, type ColumnDef } from "@/components/dashboard/searchable-table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Package, XCircle } from "lucide-react";
import type { UniformItem } from "@/lib/types/operational";

function StatusBadge({ status }: { status: UniformItem["status"] }) {
  switch (status) {
    case "returned":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Returned
        </Badge>
      );
    case "checked-out":
      return (
        <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">
          <Package className="mr-1 h-3 w-3" />
          Checked Out
        </Badge>
      );
    case "missing":
      return (
        <Badge className="bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100">
          <XCircle className="mr-1 h-3 w-3" />
          Missing
        </Badge>
      );
    case "available":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          Available
        </Badge>
      );
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
}

const columns: ColumnDef<UniformItem>[] = [
  {
    id: "jersey",
    header: "Jersey #",
    accessorFn: (row) => row.jerseyNumber || "--",
    cell: (row) => (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#00357b] text-xs font-bold text-white">
        {row.jerseyNumber || "--"}
      </span>
    ),
  },
  {
    id: "player",
    header: "Player",
    accessorFn: (row) => row.playerName || "Unassigned",
    cell: (row) => (
      <span className="font-medium">
        {row.playerName || (
          <span className="text-muted-foreground">Unassigned</span>
        )}
      </span>
    ),
  },
  {
    id: "item",
    header: "Item",
    accessorFn: (row) => row.item,
  },
  {
    id: "size",
    header: "Size",
    accessorFn: (row) => row.size || "--",
    cell: (row) => (
      <span>
        {row.size || <span className="text-muted-foreground">--</span>}
      </span>
    ),
    searchable: false,
  },
  {
    id: "status",
    header: "Status",
    accessorFn: (row) => row.status,
    cell: (row) => <StatusBadge status={row.status} />,
  },
];

export function InventoryTable({ data }: { data: UniformItem[] }) {
  return (
    <SearchableTable
      data={data}
      columns={columns}
      searchPlaceholder="Search by player, jersey #, or item..."
      rowKeyFn={(row, idx) => `${row.jerseyNumber}-${row.item}-${idx}`}
    />
  );
}
