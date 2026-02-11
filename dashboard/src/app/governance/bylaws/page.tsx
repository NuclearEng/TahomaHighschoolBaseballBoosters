import { parseDocxToHtml } from "@/lib/parsers/word";
import { resolveLogical } from "@/lib/data/file-resolver";
import { DocumentViewer } from "@/components/dashboard/document-viewer";
import { ComplianceBadge } from "@/components/dashboard/compliance-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Shield, CheckSquare } from "lucide-react";
import Link from "next/link";

interface ComplianceCheckItem {
  id: string;
  name: string;
  description: string;
  status: "compliant" | "pending" | "overdue" | "not-applicable";
  lastCompleted: string;
  nextDue: string;
}

const complianceChecklist: ComplianceCheckItem[] = [
  {
    id: "annual-budget",
    name: "Annual budget approved by membership",
    description: "Budget must be presented and approved at annual membership meeting",
    status: "compliant",
    lastCompleted: "July 2025",
    nextDue: "July 2026",
  },
  {
    id: "990n-filed",
    name: "990N filed with IRS",
    description: "Form 990-N (e-Postcard) filed annually for tax-exempt organizations under $50k",
    status: "compliant",
    lastCompleted: "November 2024",
    nextDue: "November 2026",
  },
  {
    id: "wa-sos",
    name: "WA SOS Annual Report filed",
    description: "Washington Secretary of State annual report for nonprofit corporation",
    status: "compliant",
    lastCompleted: "September 2024",
    nextDue: "September 2026",
  },
  {
    id: "insurance",
    name: "Insurance policy renewed",
    description: "General liability and D&O insurance coverage maintained",
    status: "compliant",
    lastCompleted: "January 2025",
    nextDue: "January 2027",
  },
  {
    id: "financial-review",
    name: "Annual financial review/audit completed",
    description: "Independent review of financial records per bylaws requirements",
    status: "pending",
    lastCompleted: "June 2024",
    nextDue: "June 2026",
  },
  {
    id: "dual-signatures",
    name: "Checks >$500 have dual signatures",
    description: "All disbursements over $500 require two authorized signatures",
    status: "compliant",
    lastCompleted: "Ongoing",
    nextDue: "Ongoing",
  },
  {
    id: "bank-reconciliation",
    name: "Monthly bank reconciliation performed",
    description: "Treasurer reconciles bank statements monthly and reports to board",
    status: "compliant",
    lastCompleted: "January 2026",
    nextDue: "February 2026",
  },
  {
    id: "officer-elections",
    name: "Officer elections held (annual)",
    description: "Board officer elections conducted at annual membership meeting per bylaws",
    status: "compliant",
    lastCompleted: "June 2025",
    nextDue: "June 2026",
  },
  {
    id: "record-retention",
    name: "Record retention policy followed",
    description: "Financial records retained for 7 years, meeting minutes permanently",
    status: "compliant",
    lastCompleted: "Ongoing",
    nextDue: "Ongoing",
  },
];

export default async function BylawsPage() {
  const bylawsPath = resolveLogical("bylaws");
  let htmlContent = "";

  try {
    htmlContent = await parseDocxToHtml(bylawsPath);
  } catch {
    htmlContent =
      "<p class='text-muted-foreground'>Unable to load bylaws document. Please ensure the file exists in the BOD Information folder.</p>";
  }

  const compliantCount = complianceChecklist.filter(
    (item) => item.status === "compliant"
  ).length;
  const totalCount = complianceChecklist.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#00357b]">Bylaws</h1>
          <p className="text-sm text-muted-foreground">
            Tahoma Baseball Boosters governing document &middot; Last updated
            September 2025
          </p>
        </div>
        <Link
          href="/governance"
          className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
        >
          Back to Governance
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <CheckSquare className="h-4 w-4" />
            Compliance Checklist
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
          <p className="text-xs text-muted-foreground">
            Key governance and regulatory requirements tracked per bylaws
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {complianceChecklist.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 ${
                      item.status === "compliant"
                        ? "border-emerald-500 bg-emerald-500"
                        : item.status === "pending"
                          ? "border-amber-400 bg-amber-50"
                          : item.status === "overdue"
                            ? "border-rose-500 bg-rose-50"
                            : "border-slate-300 bg-slate-50"
                    }`}
                  >
                    {item.status === "compliant" && (
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      Last: {item.lastCompleted}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Next: {item.nextDue}
                    </p>
                  </div>
                  <ComplianceBadge status={item.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-4 w-4 text-[#00357b]" />
          <h2 className="text-lg font-semibold text-[#00357b]">
            Full Bylaws Document
          </h2>
        </div>
        <DocumentViewer
          htmlContent={htmlContent}
          title="Bylaws 09/2025 - Tahoma Baseball Boosters"
        />
      </div>
    </div>
  );
}
