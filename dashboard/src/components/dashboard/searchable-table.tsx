"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, X, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

export interface ColumnDef<T> {
  id: string;
  header: string;
  accessorFn: (row: T) => string | number;
  cell?: (row: T) => React.ReactNode;
  searchable?: boolean;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
}

type SortDirection = "asc" | "desc" | null;

interface SortState {
  columnId: string | null;
  direction: SortDirection;
}

interface SearchableTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchPlaceholder?: string;
  rowKeyFn: (row: T, index: number) => string;
  rowClassName?: (row: T) => string;
}

export function SearchableTable<T>({
  data,
  columns,
  searchPlaceholder = "Search...",
  rowKeyFn,
  rowClassName,
}: SearchableTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortState>({
    columnId: null,
    direction: null,
  });

  const searchableColumns = columns.filter((c) => c.searchable !== false);

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const term = search.toLowerCase();
    return data.filter((row) =>
      searchableColumns.some((col) =>
        String(col.accessorFn(row)).toLowerCase().includes(term)
      )
    );
  }, [data, search, searchableColumns]);

  const sortedData = useMemo(() => {
    if (!sort.columnId || !sort.direction) return filteredData;
    const col = columns.find((c) => c.id === sort.columnId);
    if (!col) return filteredData;
    const dir = sort.direction === "asc" ? 1 : -1;
    return [...filteredData].sort((a, b) => {
      const aVal = col.accessorFn(a);
      const bVal = col.accessorFn(b);
      if (typeof aVal === "number" && typeof bVal === "number") {
        return (aVal - bVal) * dir;
      }
      return String(aVal).localeCompare(String(bVal)) * dir;
    });
  }, [filteredData, sort, columns]);

  function cycleSort(columnId: string) {
    setSort((prev) => {
      if (prev.columnId !== columnId) return { columnId, direction: "asc" };
      if (prev.direction === "asc") return { columnId, direction: "desc" };
      return { columnId: null, direction: null };
    });
  }

  function SortIcon({ columnId }: { columnId: string }) {
    if (sort.columnId !== columnId)
      return <ArrowUpDown className="ml-1 inline h-3 w-3 opacity-40" />;
    if (sort.direction === "asc")
      return <ArrowUp className="ml-1 inline h-3 w-3" />;
    return <ArrowDown className="ml-1 inline h-3 w-3" />;
  }

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <label htmlFor="table-search" className="sr-only">
            {searchPlaceholder}
          </label>
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            id="table-search"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap" aria-live="polite" role="status">
          {sortedData.length} of {data.length} rows
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.id} className={col.headerClassName}>
                  {col.sortable !== false ? (
                    <button
                      onClick={() => cycleSort(col.id)}
                      className="inline-flex items-center gap-0.5 hover:text-foreground transition-colors -ml-1 px-1 py-0.5 rounded"
                    >
                      {col.header}
                      <SortIcon columnId={col.id} />
                    </button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {search
                    ? `No results for "${search}"`
                    : "No data available"}
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, idx) => (
                <TableRow
                  key={rowKeyFn(row, idx)}
                  className={rowClassName?.(row)}
                >
                  {columns.map((col) => (
                    <TableCell key={col.id} className={col.className}>
                      {col.cell ? col.cell(row) : String(col.accessorFn(row))}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
