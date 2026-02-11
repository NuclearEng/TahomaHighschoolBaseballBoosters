"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FundBalanceProps {
  checking: number;
  savings: number;
}

const COLORS = ["#00357b", "#FFCB1E"];

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function FundBalance({ checking, savings }: FundBalanceProps) {
  const total = checking + savings;
  const data = [
    { name: "Checking", value: checking },
    { name: "Savings", value: savings },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Fund Balances</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="h-[160px] w-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatter.format(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-2xl font-bold tabular-nums">{formatter.format(total)}</p>
              <p className="text-xs text-muted-foreground">Total Cash Reserves</p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-3 w-3 rounded-full bg-[#00357b]" />
                <span className="text-muted-foreground">Checking:</span>
                <span className="font-medium tabular-nums">{formatter.format(checking)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-3 w-3 rounded-full bg-[#FFCB1E]" />
                <span className="text-muted-foreground">Savings:</span>
                <span className="font-medium tabular-nums">{formatter.format(savings)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
