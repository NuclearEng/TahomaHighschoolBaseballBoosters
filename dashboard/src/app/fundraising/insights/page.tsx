import {
  getCurrentBudget,
  getHistoricalRevenueBySource,
  getHistoricalBudgets,
} from "@/lib/parsers/budget";
import { getRosters } from "@/lib/parsers/roster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Lightbulb,
  BarChart3,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Trophy,
  Rocket,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import type {
  BudgetLineItem,
  FundraisingInsight,
  HistoricalRevenueBySource,
  HistoricalBudget,
} from "@/lib/types/financial";

const priorityConfig = {
  high: {
    className: "bg-rose-50 text-rose-700 border-rose-200",
    label: "High Priority",
  },
  medium: {
    className: "bg-amber-50 text-amber-700 border-amber-200",
    label: "Medium",
  },
  low: {
    className: "bg-slate-50 text-slate-600 border-slate-200",
    label: "Low",
  },
};

const FUNDRAISING_SOURCES = [
  "Concessions",
  "Hats",
  "Hour-A-Thon",
  "Summer Camp",
  "Donations",
  "Media Sponsors",
  "Misc",
];

function generateFundraisingInsights(
  currentItems: BudgetLineItem[],
  historicalRevenue: HistoricalRevenueBySource[],
  historicalBudgets: HistoricalBudget[],
  playerCount: number,
  currentFiscalYear: string
): FundraisingInsight[] {
  const insights: FundraisingInsight[] = [];

  // Filter to just fundraising sources
  const fundraisingItems = currentItems.filter((item) =>
    FUNDRAISING_SOURCES.some((src) =>
      item.subcategory.toLowerCase().includes(src.toLowerCase())
    )
  );

  // --- Multi-year helpers ---
  // Exclude current fiscal year — partial data skews insights
  const completedRevenue = historicalRevenue.filter(
    (fy) => fy.fiscalYear !== currentFiscalYear
  );

  // Build sourceHistory: source name → array of { fy, actual }
  const sourceHistory = new Map<string, { fy: string; actual: number }[]>();
  for (const fy of completedRevenue) {
    for (const src of fy.sources) {
      if (!sourceHistory.has(src.name)) {
        sourceHistory.set(src.name, []);
      }
      sourceHistory.get(src.name)!.push({ fy: fy.fiscalYear, actual: src.actual });
    }
  }

  // Sort each source's history by fiscal year
  for (const [, history] of sourceHistory) {
    history.sort((a, b) => a.fy.localeCompare(b.fy));
  }

  // getGrowthRate: % change from earliest to latest year. Returns null if <2 years.
  function getGrowthRate(sourceName: string): number | null {
    const history = sourceHistory.get(sourceName);
    if (!history || history.length < 2) return null;
    const earliest = history[0].actual;
    const latest = history[history.length - 1].actual;
    if (earliest === 0) return latest > 0 ? 100 : null;
    return ((latest - earliest) / earliest) * 100;
  }

  // Sort historical budgets by year, excluding current year
  const sortedBudgets = [...historicalBudgets]
    .filter((b) => b.fiscalYear !== currentFiscalYear)
    .sort((a, b) => a.fiscalYear.localeCompare(b.fiscalYear));

  // =====================
  // TOP PERFORMERS
  // =====================

  // Multi-Year Revenue Champion
  const cumulativeBySource = new Map<string, number>();
  let allTimeTotalRevenue = 0;
  for (const [name, history] of sourceHistory) {
    const cumulative = history.reduce((sum, h) => sum + h.actual, 0);
    cumulativeBySource.set(name, cumulative);
    allTimeTotalRevenue += cumulative;
  }
  const championEntry = [...cumulativeBySource.entries()].sort(
    (a, b) => b[1] - a[1]
  )[0];
  if (championEntry && allTimeTotalRevenue > 0) {
    const [champName, champTotal] = championEntry;
    const champPct = ((champTotal / allTimeTotalRevenue) * 100).toFixed(0);
    insights.push({
      type: "trend",
      category: "top-performers",
      title: "Multi-Year Revenue Champion",
      description: `${champName} has generated $${champTotal.toLocaleString()} across all tracked fiscal years, representing ${champPct}% of all-time fundraising revenue. This is the program's most reliable revenue engine.`,
      metric: champName,
      value: champTotal,
      priority: "high",
    });
  }

  // Fastest Growing Source
  const growthRates: { name: string; rate: number }[] = [];
  for (const [name] of sourceHistory) {
    const rate = getGrowthRate(name);
    if (rate !== null && rate > 0) {
      growthRates.push({ name, rate });
    }
  }
  growthRates.sort((a, b) => b.rate - a.rate);
  if (growthRates.length > 0) {
    const fastest = growthRates[0];
    const history = sourceHistory.get(fastest.name)!;
    const earliestFY = history[0].fy;
    const latestFY = history[history.length - 1].fy;
    insights.push({
      type: "trend",
      category: "top-performers",
      title: "Fastest Growing Source",
      description: `${fastest.name} has grown ${fastest.rate.toFixed(0)}% from ${earliestFY} to ${latestFY}. This momentum suggests strong community demand — consider scaling this initiative with more capacity or additional dates.`,
      metric: fastest.name,
      change: fastest.rate,
      priority: "high",
    });
  }

  // Historical Revenue Concentration
  if (allTimeTotalRevenue > 0 && championEntry) {
    const [topName, topTotal] = championEntry;
    const shareNum = Math.round((topTotal / allTimeTotalRevenue) * 100);

    insights.push({
      type: "recommendation",
      category: "top-performers",
      title: "Revenue Concentration",
      description: `Historically, ${topName} accounts for ${shareNum}% of all-time fundraising revenue ($${topTotal.toLocaleString()} of $${allTimeTotalRevenue.toLocaleString()}). ${shareNum > 50 ? "High concentration in a single source creates risk — diversifying would provide more stability." : "Revenue is reasonably diversified across multiple sources."}`,
      metric: "Revenue Share",
      value: shareNum,
      priority: shareNum > 60 ? "high" : "medium",
    });
  }

  // =====================
  // GROWTH OPPORTUNITIES
  // =====================

  // Untapped Opportunities
  const currentSourceNames = fundraisingItems.map((i) =>
    i.subcategory.toLowerCase()
  );
  const untappedIdeas: { name: string; detail: string }[] = [
    {
      name: "Corporate Sponsorships",
      detail: "Field, scoreboard, or dugout sponsorships ($500–$5,000/yr)",
    },
    {
      name: "Alumni Giving",
      detail: 'Launch a "Tahoma Baseball Legacy Fund" for former players and families',
    },
    {
      name: "Online Fundraising",
      detail: "Platforms like Snap Raise or GoFundMe for broader reach",
    },
    {
      name: "Merchandise Expansion",
      detail: "Beyond hats: hoodies, decals, blankets + online store for year-round sales",
    },
    {
      name: "Facility Naming Rights",
      detail: "Dugout, batting cage, or press box naming opportunities",
    },
    {
      name: "Booster Membership Tiers",
      detail: "Bronze $50 / Silver $100 / Gold $250 / Diamond $500 with escalating perks",
    },
  ];

  // Filter out ideas that overlap with existing sources
  const relevant = untappedIdeas.filter(
    (idea) =>
      !currentSourceNames.some(
        (src) =>
          idea.name.toLowerCase().includes(src) ||
          src.includes(idea.name.toLowerCase())
      )
  );

  if (relevant.length > 0) {
    const list = relevant.map((r) => `${r.name}: ${r.detail}`).join(". ");
    insights.push({
      type: "recommendation",
      category: "growth-opportunities",
      title: "Untapped Revenue Opportunities",
      description: `Revenue streams not yet in your mix that similar HS baseball programs use: ${list}.`,
      priority: "medium",
    });
  }

  // =====================
  // LONG-TERM STRATEGY
  // =====================

  // Recurring vs Event Revenue (from historical data)
  const recurringKeywords = ["donation", "sponsor", "media sponsor"];
  const eventKeywords = ["hour-a-thon", "camp", "concession", "hat", "misc"];
  let recurringTotal = 0;
  let eventTotal = 0;
  for (const [name, history] of sourceHistory) {
    const cumulative = history.reduce((sum, h) => sum + h.actual, 0);
    const lowerName = name.toLowerCase();
    if (recurringKeywords.some((kw) => lowerName.includes(kw))) {
      recurringTotal += cumulative;
    } else if (eventKeywords.some((kw) => lowerName.includes(kw))) {
      eventTotal += cumulative;
    }
  }
  const combinedTotal = recurringTotal + eventTotal;
  if (combinedTotal > 0) {
    const eventPct = ((eventTotal / combinedTotal) * 100).toFixed(0);
    const recurringPct = ((recurringTotal / combinedTotal) * 100).toFixed(0);
    const isEventHeavy = Number(eventPct) > 70;
    insights.push({
      type: "recommendation",
      category: "long-term-strategy",
      title: "Recurring vs Event Revenue",
      description: `Historically, ${recurringPct}% of revenue is recurring (donations, sponsors) and ${eventPct}% is event-based (Hour-A-Thon, camp, concessions). ${isEventHeavy ? "Over 70% of revenue has depended on one-time events — this is fragile. Building recurring programs (monthly giving, annual sponsorships, membership tiers) would create a more stable financial base." : "Healthy historical mix of recurring and event revenue. Continue strengthening recurring sources to reduce year-to-year volatility."}`,
      metric: "Event Dependency",
      value: Number(eventPct),
      priority: isEventHeavy ? "high" : "low",
    });
  }

  // 3-Year Revenue Trajectory
  if (sortedBudgets.length >= 2) {
    const recentBudgets = sortedBudgets.slice(-3);
    const first = recentBudgets[0];
    const last = recentBudgets[recentBudgets.length - 1];
    const overallChange =
      first.totalIncome > 0
        ? ((last.totalIncome - first.totalIncome) / first.totalIncome) * 100
        : 0;

    let direction: string;
    let advice: string;
    if (overallChange > 10) {
      direction = "growing";
      advice =
        "Lock in these gains by converting one-time donors to recurring, and negotiate multi-year sponsor agreements.";
    } else if (overallChange < -10) {
      direction = "declining";
      advice =
        "Aggressive diversification is needed — add new revenue streams and re-engage lapsed donors before the trend deepens.";
    } else {
      direction = "relatively flat";
      advice =
        "Flat revenue means falling behind with inflation. Target 10-15% growth through new initiatives to maintain purchasing power.";
    }

    const yearsSpanned = `${first.fiscalYear}–${last.fiscalYear}`;
    // Simple projection: apply average annual growth rate
    const yearCount = recentBudgets.length - 1;
    const avgAnnualRate = overallChange / Math.max(yearCount, 1);
    const projectedNext = last.totalIncome * (1 + avgAnnualRate / 100);

    insights.push({
      type: "forecast",
      category: "long-term-strategy",
      title: "Revenue Trajectory",
      description: `Total revenue across ${yearsSpanned} is ${direction} (${overallChange >= 0 ? "+" : ""}${overallChange.toFixed(0)}%). At this pace, next year projects to ~$${projectedNext.toLocaleString("en-US", { maximumFractionDigits: 0 })}. ${advice}`,
      metric: "Total Revenue Trend",
      change: overallChange,
      priority: overallChange < -10 ? "high" : "medium",
    });
  }

  // Sustainability Playbook
  {
    const isGrowing =
      sortedBudgets.length >= 2 &&
      sortedBudgets[sortedBudgets.length - 1].totalIncome >
        sortedBudgets[sortedBudgets.length - 2].totalIncome;

    const playbook = isGrowing
      ? "Revenue is trending up — now is the time to lock in gains: convert event-based donors to monthly givers, negotiate multi-year sponsor deals, and build a cash reserve equal to one season's operating expenses."
      : "Revenue is flat or declining — prioritize aggressive diversification: launch 2-3 new revenue streams from the untapped opportunities list, create a booster membership program for predictable annual income, and set a 6-month reserve target.";

    insights.push({
      type: "recommendation",
      category: "long-term-strategy",
      title: "Sustainability Playbook",
      description: `${playbook} Every program should maintain reserves for equipment replacement, facility maintenance, and unexpected costs regardless of revenue direction.`,
      priority: "high",
    });
  }

  // Sort by priority within each category
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return insights.sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );
}

const insightTypeIcons: Record<string, typeof TrendingUp> = {
  trend: TrendingUp,
  recommendation: Lightbulb,
  anomaly: Target,
  forecast: Calendar,
};

const categoryConfig = {
  "top-performers": {
    title: "Best Revenue Generators",
    subtitle: "Highest-ROI fundraisers across multiple seasons",
    Icon: Trophy,
    borderClass: "border-emerald-300/50",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  "growth-opportunities": {
    title: "Untapped Potential",
    subtitle: "New revenue streams and underperforming areas to address",
    Icon: Rocket,
    borderClass: "border-amber-300/50",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  "long-term-strategy": {
    title: "Long-Term Sustainability",
    subtitle: "Building recurring revenue and financial resilience",
    Icon: ShieldCheck,
    borderClass: "border-blue-300/50",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
} as const;

export default async function InsightsPage() {
  const [budget, rosters, historicalRevenue, historicalBudgets] =
    await Promise.all([
      getCurrentBudget(),
      getRosters(),
      getHistoricalRevenueBySource(),
      getHistoricalBudgets(),
    ]);

  const revenueItems = budget.income.flatMap((cat) => cat.items);

  const totalPlayerCount =
    rosters.varsity.length + rosters.jvBlue.length + rosters.jvGold.length;
  const estimatedPlayerCount = totalPlayerCount > 0 ? totalPlayerCount : 45;

  const insights = generateFundraisingInsights(
    revenueItems,
    historicalRevenue,
    historicalBudgets,
    estimatedPlayerCount,
    budget.fiscalYear
  );

  // Group insights by category
  const insightsByCategory = {
    "top-performers": insights.filter((i) => i.category === "top-performers"),
    "growth-opportunities": insights.filter(
      (i) => i.category === "growth-opportunities"
    ),
    "long-term-strategy": insights.filter(
      (i) => i.category === "long-term-strategy"
    ),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#00357b]">
            AI-Powered Strategic Insights
          </h1>
          <p className="text-sm text-muted-foreground">
            {budget.fiscalYear} &middot; Data-driven fundraising recommendations
          </p>
        </div>
        <Link
          href="/fundraising"
          className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Fundraising
        </Link>
      </div>

      {/* Categorized Insight Cards */}
      {(
        ["top-performers", "growth-opportunities", "long-term-strategy"] as const
      ).map((cat) => {
        const config = categoryConfig[cat];
        const catInsights = insightsByCategory[cat];
        if (catInsights.length === 0) return null;

        return (
          <Card key={cat} className={config.borderClass}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <config.Icon className="h-4 w-4 text-muted-foreground" />
                {config.title}
                <Badge variant="outline" className={`ml-2 ${config.badgeClass}`}>
                  {catInsights.length} insight{catInsights.length !== 1 ? "s" : ""}
                </Badge>
              </CardTitle>
              <p className="text-xs text-muted-foreground">{config.subtitle}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {catInsights.map((insight, index) => {
                  const pConfig = priorityConfig[insight.priority];
                  const IconComponent =
                    insightTypeIcons[insight.type] || Lightbulb;

                  return (
                    <div
                      key={index}
                      className="rounded-lg border p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-muted p-2 shrink-0 mt-0.5">
                          <IconComponent className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-semibold">
                              {insight.title}
                            </h4>
                            <Badge
                              variant="outline"
                              className={pConfig.className}
                            >
                              {pConfig.label}
                            </Badge>
                            <Badge variant="outline" className="text-[11px]">
                              {insight.type}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                            {insight.description}
                          </p>
                          {(insight.value !== undefined ||
                            insight.change !== undefined) && (
                            <div className="mt-2 flex items-center gap-3 flex-wrap">
                              {insight.value !== undefined && (
                                <span className="inline-flex items-center gap-1 text-xs font-medium">
                                  <BarChart3 className="h-3 w-3" />
                                  {insight.metric}:{" "}
                                  {typeof insight.value === "number" &&
                                  insight.value > 100
                                    ? `$${insight.value.toLocaleString()}`
                                    : `${insight.value}%`}
                                </span>
                              )}
                              {insight.change !== undefined && (
                                <span
                                  className={`inline-flex items-center gap-1 text-xs font-medium ${
                                    insight.change >= 0
                                      ? "text-emerald-600"
                                      : "text-rose-600"
                                  }`}
                                >
                                  {insight.change >= 0 ? (
                                    <ArrowUpRight className="h-3 w-3" />
                                  ) : (
                                    <ArrowDownRight className="h-3 w-3" />
                                  )}
                                  {insight.change >= 0 ? "+" : ""}
                                  {insight.change.toFixed(0)}%
                                </span>
                              )}
                              {insight.confidence !== undefined && (
                                <span className="text-[11px] text-muted-foreground">
                                  Confidence: {insight.confidence.toFixed(0)}%
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
