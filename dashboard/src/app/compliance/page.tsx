import path from "path";
import { ComplianceBadge } from "@/components/dashboard/compliance-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  FileCheck,
  Building2,
  ShieldCheck,
  Landmark,
  Calendar,
  FileText,
  AlertTriangle,
  Clock,
} from "lucide-react";
import {
  getIRSDocuments,
  getWASOSDocuments,
  getInsuranceDocuments,
  getBankRecFiles,
} from "@/lib/data/file-resolver";
import Link from "next/link";
import type { ComplianceItem } from "@/lib/types/governance";

function formatFileName(filePath: string): string {
  return path.basename(filePath);
}

// Upcoming deadlines based on typical nonprofit fiscal calendar (July-June FY)
const upcomingDeadlines: {
  task: string;
  date: string;
  category: string;
  status: ComplianceItem["status"];
}[] = [
  {
    task: "Annual Financial Review/Audit",
    date: "June 2026",
    category: "Financial",
    status: "pending",
  },
  {
    task: "Officer Elections at Annual Meeting",
    date: "June 2026",
    category: "Governance",
    status: "pending",
  },
  {
    task: "Budget Approval by Membership",
    date: "July 2026",
    category: "Financial",
    status: "pending",
  },
  {
    task: "WA SOS Annual Report Filing",
    date: "September 2026",
    category: "State",
    status: "pending",
  },
  {
    task: "IRS 990N (e-Postcard) Filing",
    date: "November 2026",
    category: "IRS",
    status: "pending",
  },
  {
    task: "Insurance Policy Renewal",
    date: "January 2027",
    category: "Insurance",
    status: "pending",
  },
];

export default async function CompliancePage() {
  const [irsDocuments, wasosDocuments, insuranceDocuments, bankRecFiles] =
    await Promise.all([
      getIRSDocuments(),
      getWASOSDocuments(),
      getInsuranceDocuments(),
      getBankRecFiles(),
    ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#00357b]">
            Compliance Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Regulatory filings, insurance, and financial controls oversight
          </p>
        </div>
        <Link
          href="/governance"
          className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
        >
          Back to Governance
        </Link>
      </div>

      {/* Summary Badges */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-lg border px-4 py-2">
          <span className="text-sm font-medium">IRS Status</span>
          <ComplianceBadge status="compliant" />
        </div>
        <div className="flex items-center gap-2 rounded-lg border px-4 py-2">
          <span className="text-sm font-medium">WA SOS</span>
          <ComplianceBadge status="compliant" />
        </div>
        <div className="flex items-center gap-2 rounded-lg border px-4 py-2">
          <span className="text-sm font-medium">Insurance</span>
          <ComplianceBadge status="compliant" />
        </div>
        <div className="flex items-center gap-2 rounded-lg border px-4 py-2">
          <span className="text-sm font-medium">Financial Controls</span>
          <ComplianceBadge status="pending" label="Review Pending" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* IRS Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Landmark className="h-4 w-4" />
              IRS Status
              <ComplianceBadge status="compliant" size="sm" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                990N Filing History
              </h4>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between rounded border p-2">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-sm">Tax Year 2024 (FY 2024-2025)</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px]"
                  >
                    Filed
                  </Badge>
                </div>
                <div className="flex items-center justify-between rounded border p-2">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-sm">Tax Year 2023 (FY 2023-2024)</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px]"
                  >
                    Filed
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                EIN &amp; Tax-Exempt Status
              </h4>
              <div className="rounded border p-2">
                <p className="text-sm">
                  501(c)(3) tax-exempt organization
                </p>
                <p className="text-xs text-muted-foreground">
                  Filing threshold: Under $50,000 (Form 990-N eligible)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Documents on File ({irsDocuments.length})
              </h4>
              {irsDocuments.length > 0 ? (
                <div className="space-y-1">
                  {irsDocuments.map((doc) => (
                    <div
                      key={doc}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <FileText className="h-3 w-3 shrink-0" />
                      <span className="truncate">{formatFileName(doc)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  No IRS documents found in Treasurer/IRS Documents folder
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* WA Secretary of State */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4" />
              WA Secretary of State
              <ComplianceBadge status="compliant" size="sm" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Annual Report Status
              </h4>
              <div className="flex items-center justify-between rounded border p-2">
                <span className="text-sm">
                  2024 Annual Report
                </span>
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px]"
                >
                  Filed
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Corporate Registration
              </h4>
              <div className="rounded border p-2 space-y-1">
                <p className="text-sm">
                  Washington Nonprofit Corporation
                </p>
                <p className="text-xs text-muted-foreground">
                  Articles of Incorporation on file with WA SOS
                </p>
                <p className="text-xs text-muted-foreground">
                  Status: Active / Good Standing
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Documents on File ({wasosDocuments.length})
              </h4>
              {wasosDocuments.length > 0 ? (
                <div className="space-y-1">
                  {wasosDocuments.map((doc) => (
                    <div
                      key={doc}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <FileText className="h-3 w-3 shrink-0" />
                      <span className="truncate">{formatFileName(doc)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  No SOS documents found in Treasurer/WA Secretary of State
                  folder
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Insurance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-4 w-4" />
              Insurance
              <ComplianceBadge status="compliant" size="sm" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Policy Status
              </h4>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between rounded border p-2">
                  <div>
                    <p className="text-sm font-medium">
                      General Liability Insurance
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Covers events, activities, and operations
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px]"
                  >
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between rounded border p-2">
                  <div>
                    <p className="text-sm font-medium">
                      Directors &amp; Officers (D&amp;O)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Protects board members from personal liability
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px]"
                  >
                    Active
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Renewal Dates
              </h4>
              <div className="rounded border p-2">
                <p className="text-sm">
                  Next Renewal: <span className="font-medium">January 2027</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Last Renewed: January 2025
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Documents on File ({insuranceDocuments.length})
              </h4>
              {insuranceDocuments.length > 0 ? (
                <div className="space-y-1">
                  {insuranceDocuments.map((doc) => (
                    <div
                      key={doc}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <FileText className="h-3 w-3 shrink-0" />
                      <span className="truncate">{formatFileName(doc)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  No insurance documents found in Treasurer/Insurance Policy
                  folder
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Financial Controls */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" />
              Financial Controls
              <ComplianceBadge status="pending" size="sm" label="Review Pending" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Audit / Financial Review
              </h4>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between rounded border p-2">
                  <div>
                    <p className="text-sm">Annual Financial Review</p>
                    <p className="text-xs text-muted-foreground">
                      Independent review per bylaws
                    </p>
                  </div>
                  <ComplianceBadge status="pending" size="sm" />
                </div>
                <div className="flex items-center justify-between rounded border p-2">
                  <div>
                    <p className="text-sm">Dual Signature Policy (&gt;$500)</p>
                    <p className="text-xs text-muted-foreground">
                      Two authorized signers required
                    </p>
                  </div>
                  <ComplianceBadge status="compliant" size="sm" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Bank Reconciliation Tracking
              </h4>
              <div className="rounded border p-2">
                <p className="text-sm">
                  Monthly reconciliation by Treasurer
                </p>
                <p className="text-xs text-muted-foreground">
                  Last completed: January 2026
                </p>
              </div>
              {bankRecFiles.length > 0 ? (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">
                    Reconciliation files on record ({bankRecFiles.length}):
                  </p>
                  {bankRecFiles.slice(0, 6).map((doc) => (
                    <div
                      key={doc}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <FileText className="h-3 w-3 shrink-0" />
                      <span className="truncate">{formatFileName(doc)}</span>
                    </div>
                  ))}
                  {bankRecFiles.length > 6 && (
                    <p className="text-[11px] text-muted-foreground">
                      ...and {bankRecFiles.length - 6} more files
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  No bank rec files found in Treasurer/Bank Recs folder
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4" />
            Upcoming Compliance Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {upcomingDeadlines.map((deadline) => (
              <div
                key={deadline.task}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{deadline.task}</p>
                    <p className="text-xs text-muted-foreground">
                      {deadline.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[#00357b]">
                    {deadline.date}
                  </span>
                  <ComplianceBadge status={deadline.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
