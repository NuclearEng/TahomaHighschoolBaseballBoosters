import {
  getCurrentBudget,
  getHistoricalRevenueBySource,
} from "@/lib/parsers/budget";
import { getRosters } from "@/lib/parsers/roster";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  TrendingUp,
  DollarSign,
  Users,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { FundraisingChartClient } from "./fundraising-chart";
import { YoYRevenueChart } from "./yoy-chart";

// Fundraising source names from the budget
const FUNDRAISING_SOURCES = [
  "Concessions",
  "Hats",
  "Hour-A-Thon",
  "Summer Camp",
  "Donations",
  "Media Sponsors",
  "Misc",
];

export default async function FundraisingPage() {
  const [budget, rosters, historicalRevenue] = await Promise.all([
    getCurrentBudget(),
    getRosters(),
    getHistoricalRevenueBySource(),
  ]);

  const revenueItems = budget.income.flatMap((cat) => cat.items);

  // Identify fundraising sources
  const fundraisingItems = revenueItems.filter((item) =>
    FUNDRAISING_SOURCES.some((src) =>
      item.subcategory.toLowerCase().includes(src.toLowerCase())
    )
  );

  const totalYTDRevenue = budget.totalIncome.actual;
  const totalBudgetedRevenue = budget.totalIncome.budgeted;

  // Find top revenue source
  const sortedSources = [...fundraisingItems]
    .filter((i) => i.actual > 0)
    .sort((a, b) => b.actual - a.actual);
  const topSource = sortedSources.length > 0 ? sortedSources[0] : null;

  // Revenue per player from actual roster data
  const totalPlayerCount =
    rosters.varsity.length + rosters.jvBlue.length + rosters.jvGold.length;
  const estimatedPlayerCount = totalPlayerCount > 0 ? totalPlayerCount : 45;
  const revenuePerPlayer = totalYTDRevenue / estimatedPlayerCount;

  // Chart data for all fundraising items
  const chartData = fundraisingItems
    .filter((item) => item.budgeted > 0 || item.actual > 0)
    .map((item) => ({
      name: item.subcategory,
      budgeted: item.budgeted,
      actual: item.actual,
    }));

  // Year-over-year revenue data
  const allSourceNames = [
    ...new Set(
      historicalRevenue.flatMap((fy) => fy.sources.map((s) => s.name))
    ),
  ].filter((name) => {
    return historicalRevenue.some((fy) =>
      fy.sources.some((s) => s.name === name && s.actual > 0)
    );
  });

  const yoyFiscalYears = historicalRevenue.map((fy) => fy.fiscalYear);
  const yoyData = allSourceNames.map((source) => {
    const row: Record<string, string | number> = { source };
    for (const fy of historicalRevenue) {
      const item = fy.sources.find((s) => s.name === source);
      row[fy.fiscalYear] = item?.actual || 0;
    }
    return row;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#00357b]">
            Fundraising Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            {budget.fiscalYear} &middot; Revenue analysis and performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/fundraising/insights"
            className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
          >
            <Sparkles className="h-3 w-3" />
            AI Insights
          </Link>
          <Link
            href="/financials/budget"
            className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
          >
            Full Budget Detail
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total YTD Revenue"
          value={`$${totalYTDRevenue.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          subtitle={`of $${totalBudgetedRevenue.toLocaleString()} budgeted`}
          icon={DollarSign}
          variant="default"
          trend={
            totalBudgetedRevenue > 0
              ? {
                  value: (totalYTDRevenue / totalBudgetedRevenue) * 100,
                  label: "of budget collected",
                }
              : undefined
          }
        />
        <StatCard
          title="Top Revenue Source"
          value={topSource ? topSource.subcategory : "N/A"}
          subtitle={
            topSource
              ? `$${topSource.actual.toLocaleString()} (${topSource.budgeted > 0 ? topSource.percentUsed.toFixed(0) : 0}% of budget)`
              : "No revenue recorded yet"
          }
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          title="Revenue per Player"
          value={`$${revenuePerPlayer.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          subtitle={`${estimatedPlayerCount} players across 3 teams`}
          icon={Users}
          variant="default"
        />
      </div>

      {/* Revenue by Source Chart */}
      <FundraisingChartClient data={chartData} />

      {/* Year-over-Year Revenue by Source */}
      {yoyData.length > 0 && (
        <YoYRevenueChart data={yoyData} fiscalYears={yoyFiscalYears} />
      )}
    </div>
  );
}
