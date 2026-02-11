"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MonthlyBudgetData } from "@/lib/types/financial";

interface ChartCategoryItem {
  name: string;
  type: "Revenue" | "Expense";
  budgeted: number;
  actual: number;
}

interface BudgetOverviewChartProps {
  data: ChartCategoryItem[];
  monthlyData: MonthlyBudgetData[];
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function BudgetOverviewChart({ data, monthlyData }: BudgetOverviewChartProps) {
  // Truncate long category names for the chart
  const chartData = data.map((item) => ({
    ...item,
    shortName: item.name.length > 18 ? item.name.substring(0, 16) + "..." : item.name,
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[#00357b]">
            Budget vs Actual by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 10, left: 10, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="shortName"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={80}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number) => formatter.format(value)}
                  labelFormatter={(label) => {
                    const item = chartData.find((d) => d.shortName === label);
                    return item ? item.name : label;
                  }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Legend />
                <Bar dataKey="budgeted" name="Budgeted" fill="#00357b" radius={[2, 2, 0, 0]} />
                <Bar dataKey="actual" name="Actual" fill="#FFCB1E" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[#00357b]">
            Monthly Income vs Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => v.substring(0, 3)}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number) => formatter.format(value)}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Legend />
                <Bar
                  dataKey="actualIncome"
                  name="Income"
                  fill="#059669"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="actualExpenses"
                  name="Expenses"
                  fill="#e11d48"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
