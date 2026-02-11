import { StatCard } from "@/components/dashboard/stat-card";
import { BudgetChart } from "@/components/dashboard/budget-chart";
import { FundBalance } from "@/components/dashboard/fund-balance";
import { ComplianceBadge } from "@/components/dashboard/compliance-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ExternalLink,
  Mail,
  Shield,
  BarChart3,
  Users,
} from "lucide-react";
import { getCurrentBudget, getMonthlyData, getCheckingSavingsBalances, getHistoricalBudgets } from "@/lib/parsers/budget";
import { getLastSyncTime, getBoardAgendaFiles } from "@/lib/data/file-resolver";
import { getRosters } from "@/lib/parsers/roster";
import { getVolunteerSummary } from "@/lib/parsers/volunteers";
import path from "path";
import Link from "next/link";

export default async function ExecutiveSummary() {
  const [budget, monthlyData, balances, historicalBudgets, agendaFiles, rosters, volunteers] = await Promise.all([
    getCurrentBudget(),
    getMonthlyData(),
    getCheckingSavingsBalances(),
    getHistoricalBudgets(),
    getBoardAgendaFiles(),
    getRosters(),
    getVolunteerSummary(),
  ]);

  const totalReserves = balances.checking + balances.savings;

  // Parse agenda file names into friendly labels, sorted most recent first
  // Only include agendas with a parseable date in the filename
  const agendas = agendaFiles
    .map((fp) => {
      const name = path.basename(fp, ".docx");
      const dateMatch = name.match(/(\d{1,2})-(\d{1,2})-(\d{4})/);
      if (!dateMatch) return null;
      const d = new Date(
        Number(dateMatch[3]),
        Number(dateMatch[1]) - 1,
        Number(dateMatch[2])
      );
      return {
        label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        sortDate: d.getTime(),
      };
    })
    .filter((a): a is NonNullable<typeof a> => a !== null)
    .sort((a, b) => b.sortDate - a.sortDate);

  const totalPlayers = rosters.varsity.length + rosters.jvBlue.length + rosters.jvGold.length;
  const teamCount = [rosters.varsity, rosters.jvBlue, rosters.jvGold].filter(t => t.length > 0).length;

  const lastSync = getLastSyncTime();
  const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#00357b]">Executive Summary</h1>
          <p className="text-sm text-muted-foreground">
            {budget.fiscalYear} &middot; Last synced {lastSync.toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="https://www.tahomabearsbaseball.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
          >
            Website <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href="mailto:tahomabaseballbooster@gmail.com"
            className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
          >
            <Mail className="h-3 w-3" /> Contact
          </a>
        </div>
      </div>

      {/* Stat cards: 3 across */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Cash Reserves"
          value={`$${totalReserves.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          subtitle="Checking + Savings"
          icon={PiggyBank}
          variant="default"
        />
        <StatCard
          title="YTD Revenue"
          value={`$${budget.totalIncome.actual.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          subtitle={`of $${budget.totalIncome.budgeted.toLocaleString()} budgeted`}
          icon={TrendingUp}
          variant="success"
          trend={budget.totalIncome.budgeted > 0 ? {
            value: (budget.totalIncome.actual / budget.totalIncome.budgeted * 100),
            label: "of budget collected"
          } : undefined}
        />
        <StatCard
          title="YTD Expenses"
          value={`$${budget.totalExpenses.actual.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          subtitle={`of $${budget.totalExpenses.budgeted.toLocaleString()} budgeted`}
          icon={TrendingDown}
          variant="warning"
          trend={budget.totalExpenses.budgeted > 0 ? {
            value: (budget.totalExpenses.actual / budget.totalExpenses.budgeted * 100),
            label: "of budget spent"
          } : undefined}
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <BudgetChart data={monthlyData} title="Monthly Income vs Expenses (FY 2025–2026)" />
        <FundBalance checking={balances.checking} savings={balances.savings} />
      </div>

      {/* Governance & Meetings + Operations Snapshot */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Governance & Meetings — merged card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" />
              Governance &amp; Meetings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Compact compliance badges */}
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {([
                { label: "IRS 990N", status: "compliant" as const },
                { label: "WA SOS", status: "compliant" as const },
                { label: "Insurance", status: "compliant" as const },
                { label: "Audit", status: "pending" as const },
                { label: "Dual Sig", status: "compliant" as const },
              ]).map((item) => (
                <div key={item.label} className="flex items-center gap-1.5 text-sm">
                  <ComplianceBadge status={item.status} />
                  <span className="text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Agenda date pills */}
            {agendas.length > 0 && (
              <div className="space-y-2 border-t pt-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Board Agendas</h4>
                <div className="flex flex-wrap gap-2">
                  {agendas.map((agenda) => (
                    <Link key={agenda.label} href="/governance/agendas">
                      <Badge
                        variant="outline"
                        className="cursor-pointer px-2.5 py-1 text-xs hover:bg-[#00357b]/5 hover:border-[#00357b]/30 transition-colors"
                      >
                        {agenda.label}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <Link
              href="/compliance"
              className="inline-block text-xs font-medium text-gold-link hover:underline"
            >
              View governance details →
            </Link>
          </CardContent>
        </Card>

        {/* Operations Snapshot */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              Operations Snapshot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold tabular-nums">{totalPlayers}</p>
                <p className="text-sm text-muted-foreground">
                  players &middot; {teamCount} team{teamCount !== 1 ? "s" : ""}
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums">
                  {volunteers.totalFilled}/{volunteers.totalNeeds}
                </p>
                <p className="text-sm text-muted-foreground">volunteer spots filled</p>
              </div>
            </div>
            <Link
              href="/operations"
              className="inline-block text-xs font-medium text-gold-link hover:underline"
            >
              View operations →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Multi-Year Financial Summary — compact table */}
      {historicalBudgets.length > 1 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4" />
              Multi-Year Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="pb-2 text-left font-medium">Fiscal Year</th>
                  <th className="pb-2 text-right font-medium">Revenue</th>
                  <th className="pb-2 text-right font-medium">Expenses</th>
                  <th className="pb-2 text-right font-medium">Net</th>
                </tr>
              </thead>
              <tbody>
                {[...historicalBudgets].reverse().map((hb) => (
                  <tr key={hb.fiscalYear} className="border-b last:border-0">
                    <td className="py-2 font-medium text-[#00357b]">{hb.fiscalYear}</td>
                    <td className="py-2 text-right tabular-nums font-mono">{fmt(hb.totalIncome)}</td>
                    <td className="py-2 text-right tabular-nums font-mono">{fmt(hb.totalExpenses)}</td>
                    <td className={`py-2 text-right tabular-nums font-mono font-semibold ${hb.netIncome >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {hb.netIncome >= 0 ? "+" : ""}{fmt(hb.netIncome)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 text-right">
              <Link
                href="/financials"
                className="text-xs font-medium text-gold-link hover:underline"
              >
                View full financial overview →
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
