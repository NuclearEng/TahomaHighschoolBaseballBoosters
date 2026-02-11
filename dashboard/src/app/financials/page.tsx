import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BudgetOverviewChart } from "./budget-overview-chart";
import { HistoricalChart } from "./historical-chart";
import { getCurrentBudget, getMonthlyData, getCheckingSavingsBalances, getHistoricalBudgets } from "@/lib/parsers/budget";
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import Link from "next/link";

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function varianceColor(percent: number): string {
  if (percent < 80) return "text-emerald-600";
  if (percent <= 100) return "text-amber-600";
  return "text-red-600";
}

function varianceBg(percent: number): string {
  if (percent < 80) return "bg-emerald-500";
  if (percent <= 100) return "bg-amber-500";
  return "bg-red-500";
}

export default async function FinancialsOverviewPage() {
  const [budget, monthlyData, balances, historicalBudgets] = await Promise.all([
    getCurrentBudget(),
    getMonthlyData(),
    getCheckingSavingsBalances(),
    getHistoricalBudgets(),
  ]);

  const totalReserves = balances.checking + balances.savings;

  const incomeCategory = budget.income[0];
  const expenseCategory = budget.expenses[0];

  const incomeUtilization =
    budget.totalIncome.budgeted > 0
      ? (budget.totalIncome.actual / budget.totalIncome.budgeted) * 100
      : 0;

  const expenseUtilization =
    budget.totalExpenses.budgeted > 0
      ? (budget.totalExpenses.actual / budget.totalExpenses.budgeted) * 100
      : 0;

  // Build chart data: combine income and expense line items for budget vs actual comparison
  const chartCategories = [
    ...incomeCategory.items.map((item) => ({
      name: item.subcategory,
      type: "Revenue" as const,
      budgeted: item.budgeted,
      actual: item.actual,
    })),
    ...expenseCategory.items.map((item) => ({
      name: item.subcategory,
      type: "Expense" as const,
      budgeted: item.budgeted,
      actual: item.actual,
    })),
  ].filter((item) => item.budgeted > 0 || item.actual > 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#00357b]">Financial Overview</h1>
        <p className="text-sm text-muted-foreground">{budget.fiscalYear}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">YTD Revenue</p>
                <p className="text-2xl font-bold tabular-nums tracking-tight">
                  {fmt.format(budget.totalIncome.actual)}
                </p>
                <p className="text-xs text-muted-foreground">
                  of {fmt.format(budget.totalIncome.budgeted)} budgeted
                </p>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#c9a000]">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">YTD Expenses</p>
                <p className="text-2xl font-bold tabular-nums tracking-tight">
                  {fmt.format(budget.totalExpenses.actual)}
                </p>
                <p className="text-xs text-muted-foreground">
                  of {fmt.format(budget.totalExpenses.budgeted)} budgeted
                </p>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <TrendingDown className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#00357b]">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Net Income</p>
                <p className="text-2xl font-bold tabular-nums tracking-tight">
                  {fmt.format(budget.netIncome.actual)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Budgeted: {fmt.format(budget.netIncome.budgeted)}
                </p>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#00357b]">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Cash Reserves</p>
                <p className="text-2xl font-bold tabular-nums tracking-tight">
                  {fmt.format(totalReserves)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Checking: {fmt.format(balances.checking)} | Savings: {fmt.format(balances.savings)}
                </p>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <Wallet className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget vs Actual Bar Chart */}
      <BudgetOverviewChart data={chartCategories} monthlyData={monthlyData} />

      {/* Revenue by Source & Expense by Category */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Revenue by Source */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#00357b]">Revenue by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {incomeCategory.items
                .filter((item) => item.budgeted > 0 || item.actual > 0)
                .sort((a, b) => b.actual - a.actual)
                .map((item) => {
                  const pct = item.budgeted > 0 ? (item.actual / item.budgeted) * 100 : 0;
                  const barWidth = incomeCategory.totalActual > 0
                    ? (item.actual / incomeCategory.totalActual) * 100
                    : 0;
                  return (
                    <div key={item.subcategory} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="truncate pr-2">{item.subcategory}</span>
                        <span className="tabular-nums text-right font-mono font-medium">
                          {fmt.format(item.actual)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-emerald-500 transition-all"
                            style={{ width: `${Math.min(barWidth, 100)}%` }}
                          />
                        </div>
                        <span className={`text-xs tabular-nums font-mono ${varianceColor(pct)}`}>
                          {pct.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              <div className="flex items-center justify-between border-t pt-2 text-sm font-semibold">
                <span>Total Revenue</span>
                <span className="tabular-nums text-right font-mono">
                  {fmt.format(incomeCategory.totalActual)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expenses by Category */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#00357b]">Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenseCategory.items
                .filter((item) => item.budgeted > 0 || item.actual > 0)
                .sort((a, b) => b.actual - a.actual)
                .map((item) => {
                  const pct = item.budgeted > 0 ? (item.actual / item.budgeted) * 100 : 0;
                  const barWidth = expenseCategory.totalActual > 0
                    ? (item.actual / expenseCategory.totalActual) * 100
                    : 0;
                  return (
                    <div key={item.subcategory} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="truncate pr-2">{item.subcategory}</span>
                        <span className="tabular-nums text-right font-mono font-medium">
                          {fmt.format(item.actual)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${varianceBg(pct)}`}
                            style={{ width: `${Math.min(barWidth, 100)}%` }}
                          />
                        </div>
                        <span className={`text-xs tabular-nums font-mono ${varianceColor(pct)}`}>
                          {pct.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              <div className="flex items-center justify-between border-t pt-2 text-sm font-semibold">
                <span>Total Expenses</span>
                <span className="tabular-nums text-right font-mono">
                  {fmt.format(expenseCategory.totalActual)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Utilization */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[#00357b]">Budget Utilization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Revenue Collection</span>
              <span className={`tabular-nums font-mono font-medium ${varianceColor(100 - incomeUtilization + 80)}`}>
                {fmt.format(budget.totalIncome.actual)} of {fmt.format(budget.totalIncome.budgeted)}
                <span className="ml-2 text-xs">({incomeUtilization.toFixed(1)}%)</span>
              </span>
            </div>
            <div className="relative">
              <Progress value={Math.min(incomeUtilization, 100)} className="h-3" />
              {incomeUtilization > 100 && (
                <div className="absolute right-0 top-0 h-3 w-1 bg-red-500 rounded-r-full" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {incomeUtilization < 100
                ? `${fmt.format(budget.totalIncome.budgeted - budget.totalIncome.actual)} remaining to collect`
                : `Exceeded budget by ${fmt.format(budget.totalIncome.actual - budget.totalIncome.budgeted)}`}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Expense Spending</span>
              <span className={`tabular-nums font-mono font-medium ${varianceColor(expenseUtilization)}`}>
                {fmt.format(budget.totalExpenses.actual)} of {fmt.format(budget.totalExpenses.budgeted)}
                <span className="ml-2 text-xs">({expenseUtilization.toFixed(1)}%)</span>
              </span>
            </div>
            <div className="relative">
              <Progress value={Math.min(expenseUtilization, 100)} className="h-3" />
              {expenseUtilization > 100 && (
                <div className="absolute right-0 top-0 h-3 w-1 bg-red-500 rounded-r-full" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {expenseUtilization < 100
                ? `${fmt.format(budget.totalExpenses.budgeted - budget.totalExpenses.actual)} remaining in budget`
                : `Over budget by ${fmt.format(budget.totalExpenses.actual - budget.totalExpenses.budgeted)}`}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 5-Year Historical Trend */}
      {historicalBudgets.length > 0 && (
        <>
          <HistoricalChart
            data={historicalBudgets.map((hb) => ({
              fiscalYear: hb.fiscalYear,
              shortLabel: hb.fiscalYear.replace('FY ', ''),
              totalIncome: hb.totalIncome,
              totalExpenses: hb.totalExpenses,
              netIncome: hb.netIncome,
            }))}
          />

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-[#00357b]">
                Historical Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fiscal Year</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Expenses</TableHead>
                    <TableHead className="text-right">Net Income</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...historicalBudgets].reverse().map((hb) => (
                    <TableRow key={hb.fiscalYear}>
                      <TableCell className="text-sm font-medium">{hb.fiscalYear}</TableCell>
                      <TableCell className="tabular-nums text-right font-mono">
                        {fmt.format(hb.totalIncome)}
                      </TableCell>
                      <TableCell className="tabular-nums text-right font-mono">
                        {fmt.format(hb.totalExpenses)}
                      </TableCell>
                      <TableCell
                        className={`tabular-nums text-right font-mono font-medium ${
                          hb.netIncome >= 0 ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {fmt.format(hb.netIncome)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {/* Quick Navigation */}
      <div className="flex gap-3 text-sm">
        <Link
          href="/financials/budget"
          className="inline-flex items-center gap-1 text-gold-link font-medium hover:underline"
        >
          Budget Detail →
        </Link>
        <Link
          href="/financials/transactions"
          className="inline-flex items-center gap-1 text-gold-link font-medium hover:underline"
        >
          Transactions →
        </Link>
        <Link
          href="/financials/coaches-fund"
          className="inline-flex items-center gap-1 text-gold-link font-medium hover:underline"
        >
          Coach&#39;s Fund →
        </Link>
      </div>
    </div>
  );
}
