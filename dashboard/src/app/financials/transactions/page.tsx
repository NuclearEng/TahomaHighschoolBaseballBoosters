import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTransactions, getTransactionSummary } from "@/lib/parsers/transactions";
import { Receipt, CreditCard, DollarSign, Hash, Info } from "lucide-react";
import Link from "next/link";
import { TransactionsTable } from "./transactions-table";

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const fmtWhole = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
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

function formatMonthLabel(monthStr: string): string {
  if (!monthStr) return "—";
  try {
    const [year, month] = monthStr.split("-");
    const d = new Date(parseInt(year), parseInt(month) - 1);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  } catch {
    return monthStr;
  }
}

export default async function TransactionsPage() {
  const [transactions, summary] = await Promise.all([
    getTransactions(),
    getTransactionSummary(),
  ]);

  const feeRate =
    summary.totalRevenue > 0
      ? (summary.totalFees / summary.totalRevenue) * 100
      : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#00357b]">Transactions</h1>
          <p className="text-sm text-muted-foreground">
            Square point-of-sale transactions — {summary.transactionCount} total
          </p>
        </div>
        <Link
          href="/financials"
          className="text-xs font-medium text-gold-link hover:underline"
        >
          ← Back to Overview
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Gross Revenue</p>
                <p className="text-xl font-bold tabular-nums tracking-tight">
                  {fmtWhole.format(summary.totalRevenue)}
                </p>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-400">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Processing Fees</p>
                <p className="text-xl font-bold tabular-nums tracking-tight text-red-600">
                  -{fmtWhole.format(summary.totalFees)}
                </p>
                <p className="text-xs text-muted-foreground">{feeRate.toFixed(1)}% of gross</p>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#00357b]">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Net Revenue</p>
                <p className="text-xl font-bold tabular-nums tracking-tight">
                  {fmtWhole.format(summary.totalNet)}
                </p>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#c9a000]">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Transactions</p>
                <p className="text-xl font-bold tabular-nums tracking-tight">
                  {summary.transactionCount.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  Avg {fmt.format(summary.transactionCount > 0 ? summary.totalRevenue / summary.transactionCount : 0)}/txn
                </p>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Summary */}
      {summary.byMonth.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#00357b]">Monthly Revenue Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {summary.byMonth.map((m) => (
                <div
                  key={m.month}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{formatMonthLabel(m.month)}</p>
                    <p className="text-xs text-muted-foreground">{m.count} transactions</p>
                  </div>
                  <div className="text-right">
                    <p className="tabular-nums text-right font-mono text-sm font-semibold">
                      {fmt.format(m.revenue)}
                    </p>
                    <p className="tabular-nums text-right font-mono text-xs text-muted-foreground">
                      Net: {fmt.format(m.net)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Items by Revenue */}
      {summary.byCategory.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#00357b]">Revenue by Item</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">% of Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.byCategory.slice(0, 15).map((cat) => {
                  const pctOfTotal =
                    summary.totalRevenue > 0
                      ? (cat.total / summary.totalRevenue) * 100
                      : 0;
                  return (
                    <TableRow key={cat.category}>
                      <TableCell className="text-sm">{cat.category || "Other"}</TableCell>
                      <TableCell className="tabular-nums text-right font-mono">
                        {cat.count}
                      </TableCell>
                      <TableCell className="tabular-nums text-right font-mono font-medium">
                        {fmt.format(cat.total)}
                      </TableCell>
                      <TableCell className="tabular-nums text-right font-mono text-muted-foreground">
                        {pctOfTotal.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Data Source Info */}
      <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-200">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Transaction data is synced from Square exports in Google Drive.{" "}
          To update, export new data from Square and upload to the{" "}
          <span className="font-medium">Treasurer/Square Transactions</span> folder.
        </p>
      </div>

      {/* Transaction Detail Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[#00357b]">All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionsTable data={transactions} />
        </CardContent>
      </Card>
    </div>
  );
}
