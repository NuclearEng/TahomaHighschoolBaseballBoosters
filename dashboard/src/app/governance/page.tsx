import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComplianceBadge } from "@/components/dashboard/compliance-badge";
import {
  BookOpen,
  ClipboardList,
  Shield,
  ArrowRight,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";

const governanceLinks = [
  {
    title: "Bylaws",
    description:
      "View the organization's governing bylaws, last updated September 2025. Includes compliance checklist with current status of all regulatory requirements.",
    href: "/governance/bylaws",
    icon: BookOpen,
    badge: "Foundation",
  },
  {
    title: "Board Meetings",
    description:
      "Executive board meeting agendas and minutes for October 2025, December 2025, and January 2026.",
    href: "/governance/agendas",
    icon: ClipboardList,
    badge: "Agendas",
  },
];

const boardPositions = [
  { title: "President", holder: "Filled", filled: true },
  { title: "Vice President", holder: null, filled: false },
  { title: "Secretary", holder: "Filled", filled: true },
  { title: "Treasurer", holder: "Filled", filled: true },
  { title: "Member at Large", holder: null, filled: false },
  { title: "Fundraising Coordinator", holder: null, filled: false, isNew: true },
  { title: "Social Media / Marketing", holder: null, filled: false, isNew: true },
];

const complianceSnapshot = [
  { label: "IRS 990N Filing", status: "compliant" as const, note: "2024 on file" },
  { label: "WA SOS Annual Report", status: "compliant" as const, note: "Current" },
  { label: "Insurance Policy", status: "compliant" as const, note: "Renewed 2025" },
  { label: "Annual Financial Review", status: "pending" as const, note: "Due June 2026" },
  { label: "Officer Elections", status: "compliant" as const, note: "Held annually" },
  { label: "Dual Signature Policy (>$500)", status: "compliant" as const, note: "Active" },
];

export default function GovernancePage() {
  const compliantCount = complianceSnapshot.filter((c) => c.status === "compliant").length;
  const totalCount = complianceSnapshot.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#00357b]">Governance</h1>
          <p className="text-sm text-muted-foreground">
            Bylaws, board meeting documents, and compliance oversight
          </p>
        </div>
        <Link
          href="/compliance"
          className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
        >
          Full Compliance Dashboard <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {governanceLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href} className="group">
              <Card className="h-full transition-shadow hover:shadow-md group-hover:border-[#c9a000]/40">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-[#00357b]/5 p-2">
                        <Icon className="h-5 w-5 text-[#00357b]" />
                      </div>
                      <CardTitle className="text-base">{link.title}</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-[11px]">
                      {link.badge}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {link.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-gold-link group-hover:underline">
                    View details <ArrowRight className="h-3 w-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Board Positions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4" />
            Board of Directors
            <Badge
              variant="outline"
              className={
                boardPositions.filter((p) => !p.filled).length > 0
                  ? "ml-2 bg-rose-50 text-rose-700 border-rose-200"
                  : "ml-2 bg-emerald-50 text-emerald-700 border-emerald-200"
              }
            >
              {boardPositions.filter((p) => !p.filled).length} Open
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {boardPositions.map((pos) => (
              <div
                key={pos.title}
                className={`flex items-center justify-between rounded-lg border p-3 ${
                  !pos.filled ? "border-rose-200 bg-rose-50/30" : ""
                }`}
              >
                <div>
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    {pos.title}
                    {pos.isNew && (
                      <Badge className="bg-[#FFCB1E]/10 text-gold-link border-[#FFCB1E]/30 text-[11px] hover:bg-[#FFCB1E]/10">
                        New
                      </Badge>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {pos.filled ? pos.holder : "Needs to be filled"}
                  </p>
                </div>
                {pos.filled ? (
                  <UserCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                ) : (
                  <UserX className="h-4 w-4 text-rose-500 shrink-0" />
                )}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Elections held annually per bylaws. Contact tahomabaseballbooster@gmail.com to volunteer for open positions.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4" />
            Quick Compliance Summary
            <Badge
              variant="outline"
              className={
                compliantCount === totalCount
                  ? "ml-2 bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "ml-2 bg-amber-50 text-amber-700 border-amber-200"
              }
            >
              {compliantCount}/{totalCount} Compliant
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {complianceSnapshot.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.note}</p>
                </div>
                <ComplianceBadge status={item.status} size="sm" />
              </div>
            ))}
          </div>
          <Link
            href="/compliance"
            className="mt-4 inline-block text-xs font-medium text-gold-link hover:underline"
          >
            View full compliance dashboard with all documents on file →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
