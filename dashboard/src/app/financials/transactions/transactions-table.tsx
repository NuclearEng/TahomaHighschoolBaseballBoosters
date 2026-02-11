"use client";

import { SearchableTable, type ColumnDef } from "@/components/dashboard/searchable-table";
import type { Transaction } from "@/lib/types/financial";

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatDate(dateStr: string): string {
  if (!dateStr) return "\u2014";
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

const columns: ColumnDef<Transaction>[] = [
  {
    id: "date",
    header: "Date",
    accessorFn: (row) => row.date,
    cell: (row) => (
      <span className="text-sm text-muted-foreground">
        {formatDate(row.date)}
      </span>
    ),
  },
  {
    id: "description",
    header: "Item",
    accessorFn: (row) => row.description || "",
    cell: (row) => (
      <span className="text-sm font-medium max-w-[200px] truncate block">
        {row.description || "\u2014"}
      </span>
    ),
  },
  {
    id: "payment",
    header: "Payment",
    accessorFn: (row) => row.paymentMethod || "",
    cell: (row) => (
      <span className="text-sm text-muted-foreground">
        {row.paymentMethod || "\u2014"}
      </span>
    ),
    searchable: false,
  },
  {
    id: "amount",
    header: "Amount",
    accessorFn: (row) => row.amount,
    cell: (row) => (
      <span className="tabular-nums text-right font-mono block">
        {fmt.format(row.amount)}
      </span>
    ),
    className: "text-right",
    headerClassName: "text-right",
  },
  {
    id: "fees",
    header: "Fees",
    accessorFn: (row) => row.fees,
    cell: (row) => (
      <span className="tabular-nums text-right font-mono text-red-500 block">
        {row.fees > 0 ? `-${fmt.format(row.fees)}` : "\u2014"}
      </span>
    ),
    className: "text-right",
    headerClassName: "text-right",
    searchable: false,
  },
  {
    id: "net",
    header: "Net",
    accessorFn: (row) => row.net,
    cell: (row) => (
      <span className="tabular-nums text-right font-mono font-medium block">
        {fmt.format(row.net)}
      </span>
    ),
    className: "text-right",
    headerClassName: "text-right",
    searchable: false,
  },
];

export function TransactionsTable({ data }: { data: Transaction[] }) {
  return (
    <SearchableTable
      data={data}
      columns={columns}
      searchPlaceholder="Search transactions by item or date..."
      rowKeyFn={(row, idx) => `${row.date}-${row.description}-${idx}`}
    />
  );
}
