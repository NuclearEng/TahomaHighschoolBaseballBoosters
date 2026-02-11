import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCoachsFund } from "@/lib/parsers/coaches-fund";
import { Wallet, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import Link from "next/link";

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
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

export default async function CoachesFundPage() {
  const fund = await getCoachsFund();

  // Calculate total deposits and total withdrawals (excluding starting balance entry)
  const entriesWithoutStart = fund.entries.filter(
    (e) =>
      !e.description.toLowerCase().includes("beginning") &&
      !e.description.toLowerCase().includes("starting")
  );
  const totalDeposits = entriesWithoutStart
    .filter((e) => e.amount > 0)
    .reduce((sum, e) => sum + e.amount, 0);
  const totalWithdrawals = entriesWithoutStart
    .filter((e) => e.amount < 0)
    .reduce((sum, e) => sum + e.amount, 0);

  const utilizationPercent =
    fund.startingBalance > 0
      ? ((fund.startingBalance - fund.currentBalance) / fund.startingBalance) * 100
      : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#00357b]">Coach&#39;s Discretionary Fund</h1>
          <p className="text-sm text-muted-foreground">
            2025-2026 season fund activity
          </p>
        </div>
        <Link
          href="/financials"
          className="text-xs font-medium text-[#FFCB1E] hover:underline"
        >
          ← Back to Overview
        </Link>
      </div>

      {/* Balance Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-[#00357b]">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Starting Balance</p>
                <p className="text-xl font-bold tabular-nums tracking-tight">
                  {fmt.format(fund.startingBalance)}
                </p>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Deposits</p>
                <p className="text-xl font-bold tabular-nums tracking-tight text-emerald-600">
                  {totalDeposits > 0 ? `+${fmt.format(totalDeposits)}` : fmt.format(0)}
                </p>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <ArrowDownCircle className="h-4 w-4 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-400">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                <p className="text-xl font-bold tabular-nums tracking-tight text-red-600">
                  {fmt.format(totalWithdrawals)}
                </p>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <ArrowUpCircle className="h-4 w-4 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#FFCB1E]">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
                <p className={`text-xl font-bold tabular-nums tracking-tight ${fund.currentBalance >= 0 ? "text-[#00357b]" : "text-red-600"}`}>
                  {fmt.format(fund.currentBalance)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {utilizationPercent.toFixed(0)}% utilized
                </p>
              </div>
              <div className="rounded-lg bg-[#FFCB1E]/10 p-2">
                <Wallet className="h-4 w-4 text-[#FFCB1E]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fund Utilization Bar */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[#00357b]">Fund Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Spent vs Available</span>
              <span className="tabular-nums font-mono text-muted-foreground">
                {fmt.format(Math.abs(totalWithdrawals))} of {fmt.format(fund.startingBalance + totalDeposits)} used
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  utilizationPercent < 80
                    ? "bg-emerald-500"
                    : utilizationPercent <= 100
                    ? "bg-amber-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${Math.min(Math.max(utilizationPercent, 0), 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {fmt.format(fund.currentBalance)} remaining
              </span>
              <span>{utilizationPercent.toFixed(1)}% used</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ledger Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[#00357b]">Fund Ledger</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Running Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fund.entries.map((entry, i) => {
                const isStarting =
                  entry.description.toLowerCase().includes("beginning") ||
                  entry.description.toLowerCase().includes("starting");
                const isDeposit = entry.amount > 0 && !isStarting;
                const isExpense = entry.amount < 0;

                return (
                  <TableRow key={`${entry.date}-${entry.description}-${i}`}>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(entry.date)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {isStarting && (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 mr-2">
                          Opening
                        </span>
                      )}
                      {entry.description}
                    </TableCell>
                    <TableCell
                      className={`tabular-nums text-right font-mono font-medium ${
                        isExpense
                          ? "text-red-600"
                          : isDeposit
                          ? "text-emerald-600"
                          : ""
                      }`}
                    >
                      {isDeposit && "+"}
                      {fmt.format(entry.amount)}
                    </TableCell>
                    <TableCell className="tabular-nums text-right font-mono font-medium">
                      {fmt.format(entry.balance)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2} className="font-semibold">
                  Current Balance
                </TableCell>
                <TableCell />
                <TableCell
                  className={`tabular-nums text-right font-mono font-bold text-base ${
                    fund.currentBalance >= 0 ? "text-[#00357b]" : "text-red-600"
                  }`}
                >
                  {fmt.format(fund.currentBalance)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
