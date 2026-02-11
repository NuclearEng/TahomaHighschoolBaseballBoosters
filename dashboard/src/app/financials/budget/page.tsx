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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getCurrentBudget } from "@/lib/parsers/budget";
import type { BudgetLineItem } from "@/lib/types/financial";
import Link from "next/link";

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function varianceColor(percentUsed: number): string {
  if (percentUsed < 80) return "text-emerald-600";
  if (percentUsed <= 100) return "text-amber-600";
  return "text-red-600";
}

function varianceBadgeBg(percentUsed: number): string {
  if (percentUsed < 80) return "bg-emerald-100 text-emerald-700";
  if (percentUsed <= 100) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function LineItemRow({ item }: { item: BudgetLineItem }) {
  const pctUsed = item.budgeted > 0 ? (item.actual / item.budgeted) * 100 : item.actual > 0 ? 100 : 0;

  return (
    <TableRow>
      <TableCell className="pl-8 text-sm">{item.subcategory}</TableCell>
      <TableCell className="tabular-nums text-right font-mono">
        {fmt.format(item.budgeted)}
      </TableCell>
      <TableCell className="tabular-nums text-right font-mono">
        {fmt.format(item.actual)}
      </TableCell>
      <TableCell className="tabular-nums text-right font-mono">
        {fmt.format(item.remaining)}
      </TableCell>
      <TableCell className="text-right">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium tabular-nums font-mono ${varianceBadgeBg(pctUsed)}`}
        >
          {formatPercent(pctUsed)}
        </span>
      </TableCell>
    </TableRow>
  );
}

export default async function BudgetDetailPage() {
  const budget = await getCurrentBudget();

  const incomeCategory = budget.income[0];
  const expenseCategory = budget.expenses[0];

  const totalBudgeted = incomeCategory.totalBudgeted + expenseCategory.totalBudgeted;
  const totalActual = incomeCategory.totalActual + expenseCategory.totalActual;

  // Overall utilization for expenses (how much of expense budget has been spent)
  const expenseUtilization =
    expenseCategory.totalBudgeted > 0
      ? (expenseCategory.totalActual / expenseCategory.totalBudgeted) * 100
      : 0;

  const incomeUtilization =
    incomeCategory.totalBudgeted > 0
      ? (incomeCategory.totalActual / incomeCategory.totalBudgeted) * 100
      : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#00357b]">Budget Detail</h1>
          <p className="text-sm text-muted-foreground">{budget.fiscalYear} — Line-item breakdown</p>
        </div>
        <Link
          href="/financials"
          className="text-xs font-medium text-[#FFCB1E] hover:underline"
        >
          ← Back to Overview
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
            <p className="text-xl font-bold tabular-nums tracking-tight">
              {fmt.format(incomeCategory.totalActual)}
            </p>
            <p className="text-xs text-muted-foreground">
              of {fmt.format(incomeCategory.totalBudgeted)} budgeted ({incomeUtilization.toFixed(1)}%)
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#FFCB1E]">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
            <p className="text-xl font-bold tabular-nums tracking-tight">
              {fmt.format(expenseCategory.totalActual)}
            </p>
            <p className="text-xs text-muted-foreground">
              of {fmt.format(expenseCategory.totalBudgeted)} budgeted ({expenseUtilization.toFixed(1)}%)
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#00357b]">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-muted-foreground">Net Income</p>
            <p className={`text-xl font-bold tabular-nums tracking-tight ${budget.netIncome.actual >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {fmt.format(budget.netIncome.actual)}
            </p>
            <p className="text-xs text-muted-foreground">
              Budgeted: {fmt.format(budget.netIncome.budgeted)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Expandable Line-Item Accordion Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[#00357b]">Line-Item Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={["revenue", "expenses"]} className="w-full">
            {/* Revenue Section */}
            <AccordionItem value="revenue">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex w-full items-center justify-between pr-2">
                  <span className="text-sm font-semibold text-[#00357b]">Revenue</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="tabular-nums font-mono text-muted-foreground">
                      {fmt.format(incomeCategory.totalActual)} / {fmt.format(incomeCategory.totalBudgeted)}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium tabular-nums font-mono ${varianceBadgeBg(incomeUtilization)}`}
                    >
                      {formatPercent(incomeUtilization)}
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-8">Category</TableHead>
                      <TableHead className="text-right">Budgeted</TableHead>
                      <TableHead className="text-right">Actual</TableHead>
                      <TableHead className="text-right">Remaining</TableHead>
                      <TableHead className="text-right">% Used</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incomeCategory.items.map((item) => (
                      <LineItemRow key={item.subcategory} item={item} />
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell className="pl-8 font-semibold">Total Revenue</TableCell>
                      <TableCell className="tabular-nums text-right font-mono font-semibold">
                        {fmt.format(incomeCategory.totalBudgeted)}
                      </TableCell>
                      <TableCell className="tabular-nums text-right font-mono font-semibold">
                        {fmt.format(incomeCategory.totalActual)}
                      </TableCell>
                      <TableCell className="tabular-nums text-right font-mono font-semibold">
                        {fmt.format(incomeCategory.totalRemaining)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums font-mono ${varianceBadgeBg(incomeUtilization)}`}
                        >
                          {formatPercent(incomeUtilization)}
                        </span>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </AccordionContent>
            </AccordionItem>

            {/* Expenses Section */}
            <AccordionItem value="expenses">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex w-full items-center justify-between pr-2">
                  <span className="text-sm font-semibold text-[#00357b]">Expenses</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="tabular-nums font-mono text-muted-foreground">
                      {fmt.format(expenseCategory.totalActual)} / {fmt.format(expenseCategory.totalBudgeted)}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium tabular-nums font-mono ${varianceBadgeBg(expenseUtilization)}`}
                    >
                      {formatPercent(expenseUtilization)}
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-8">Category</TableHead>
                      <TableHead className="text-right">Budgeted</TableHead>
                      <TableHead className="text-right">Actual</TableHead>
                      <TableHead className="text-right">Remaining</TableHead>
                      <TableHead className="text-right">% Used</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenseCategory.items.map((item) => (
                      <LineItemRow key={item.subcategory} item={item} />
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell className="pl-8 font-semibold">Total Expenses</TableCell>
                      <TableCell className="tabular-nums text-right font-mono font-semibold">
                        {fmt.format(expenseCategory.totalBudgeted)}
                      </TableCell>
                      <TableCell className="tabular-nums text-right font-mono font-semibold">
                        {fmt.format(expenseCategory.totalActual)}
                      </TableCell>
                      <TableCell className="tabular-nums text-right font-mono font-semibold">
                        {fmt.format(expenseCategory.totalRemaining)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums font-mono ${varianceBadgeBg(expenseUtilization)}`}
                        >
                          {formatPercent(expenseUtilization)}
                        </span>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Net Income Summary */}
          <div className="mt-4 rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#00357b]">Net Income (Revenue - Expenses)</span>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs text-muted-foreground">Budgeted: </span>
                  <span className="tabular-nums font-mono text-sm font-medium">
                    {fmt.format(budget.netIncome.budgeted)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground">Actual: </span>
                  <span
                    className={`tabular-nums font-mono text-sm font-semibold ${
                      budget.netIncome.actual >= 0 ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {fmt.format(budget.netIncome.actual)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-emerald-100 border border-emerald-300" />
          <span>Under 80% — On track</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-amber-100 border border-amber-300" />
          <span>80-100% — Near budget</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-100 border border-red-300" />
          <span>Over 100% — Over budget</span>
        </div>
      </div>
    </div>
  );
}
