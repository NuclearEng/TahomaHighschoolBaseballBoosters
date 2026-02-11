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
  Line,
  ComposedChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HistoricalChartData {
  fiscalYear: string;
  shortLabel: string;
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
}

interface HistoricalChartProps {
  data: HistoricalChartData[];
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function HistoricalChart({ data }: HistoricalChartProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-[#00357b]">
          Multi-Year Financial Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="shortLabel"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  formatter.format(value),
                  name === "totalIncome"
                    ? "Revenue"
                    : name === "totalExpenses"
                    ? "Expenses"
                    : "Net Income",
                ]}
                labelFormatter={(label) => {
                  const item = data.find((d) => d.shortLabel === label);
                  return item ? item.fiscalYear : label;
                }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Legend
                formatter={(value) =>
                  value === "totalIncome"
                    ? "Revenue"
                    : value === "totalExpenses"
                    ? "Expenses"
                    : "Net Income"
                }
              />
              <Bar
                dataKey="totalIncome"
                name="totalIncome"
                fill="#059669"
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="totalExpenses"
                name="totalExpenses"
                fill="#00357b"
                radius={[2, 2, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="netIncome"
                name="netIncome"
                stroke="#FFCB1E"
                strokeWidth={2}
                dot={{ fill: "#FFCB1E", r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
