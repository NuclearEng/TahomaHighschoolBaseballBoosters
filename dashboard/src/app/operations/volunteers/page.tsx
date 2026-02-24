import { getVolunteerSummary } from "@/lib/parsers/volunteers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  HandHelping,
  CheckCircle2,
  Circle,
  Users,
  AlertTriangle,
  Info,
} from "lucide-react";
import type { VolunteerNeed } from "@/lib/types/operational";

function VolunteerRoleTable({
  needs,
  team,
}: {
  needs: VolunteerNeed[];
  team: string;
}) {
  if (needs.length === 0) {
    return (
      <div className="py-6 text-center text-sm text-muted-foreground">
        No volunteer needs recorded for {team}.
      </div>
    );
  }

  // Group by role
  const roleGroups = needs.reduce(
    (acc, need) => {
      if (!acc[need.role]) {
        acc[need.role] = [];
      }
      acc[need.role].push(need);
      return acc;
    },
    {} as Record<string, VolunteerNeed[]>
  );

  const filledCount = needs.filter((n) => n.filled).length;
  const totalCount = needs.length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base text-[#00357b]">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {team}
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={
                filledCount === totalCount
                  ? "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                  : "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100"
              }
            >
              {filledCount}/{totalCount} filled
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#00357b]/5">
              <TableHead className="font-semibold text-[#00357b]">
                Role
              </TableHead>
              <TableHead className="font-semibold text-[#00357b]">
                Volunteer
              </TableHead>
              <TableHead className="font-semibold text-[#00357b] text-right">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(roleGroups).map(([role, slots]) =>
              slots.map((slot, idx) => (
                <TableRow key={`${role}-${idx}`}>
                  {idx === 0 ? (
                    <TableCell
                      rowSpan={slots.length}
                      className="align-top font-medium"
                    >
                      {role}
                    </TableCell>
                  ) : null}
                  <TableCell>
                    {slot.volunteerName || (
                      <span className="italic text-muted-foreground">
                        Open position
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {slot.filled ? (
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Filled
                      </Badge>
                    ) : (
                      <Badge className="bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100">
                        <Circle className="mr-1 h-3 w-3" />
                        Unfilled
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default async function VolunteersPage() {
  const volunteers = await getVolunteerSummary();

  const unfilled = volunteers.totalNeeds - volunteers.totalFilled;
  const fillRate =
    volunteers.totalNeeds > 0
      ? Math.round((volunteers.totalFilled / volunteers.totalNeeds) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#00357b]">Volunteers</h1>
        <p className="text-sm text-muted-foreground">
          Volunteer needs and assignments across all teams
        </p>
      </div>

      {/* Context Banner */}
      <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <p className="font-medium">Volunteer Assignments Need Updating</p>
          <p className="mt-0.5">
            The volunteer spreadsheets in Google Drive don&apos;t have names filled in yet.
            To assign volunteers, update the spreadsheets in the{" "}
            <span className="font-medium">Volunteers</span> folder on Google Drive,
            then re-sync to see changes here.
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-[#00357b]">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Needs
                </p>
                <p className="text-2xl font-bold tabular-nums tracking-tight">
                  {volunteers.totalNeeds}
                </p>
                <p className="text-xs text-muted-foreground">
                  Volunteer positions across all teams
                </p>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <HandHelping className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Filled
                </p>
                <p className="text-2xl font-bold tabular-nums tracking-tight text-emerald-600">
                  {volunteers.totalFilled}
                </p>
                <p className="text-xs text-muted-foreground">
                  {fillRate}% fill rate
                </p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Unfilled
                </p>
                <p className="text-2xl font-bold tabular-nums tracking-tight text-rose-600">
                  {unfilled}
                </p>
                <p className="text-xs text-muted-foreground">
                  Positions still need volunteers
                </p>
              </div>
              <div className="rounded-lg bg-rose-50 p-2">
                <AlertTriangle className="h-5 w-5 text-rose-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Sections */}
      <div className="space-y-4">
        <VolunteerRoleTable needs={volunteers.varsityGold} team="Varsity Gold" />
        <VolunteerRoleTable needs={volunteers.jvBlue} team="JV Blue" />
        <VolunteerRoleTable needs={volunteers.jvGold} team="JV Gold" />
        <VolunteerRoleTable needs={volunteers.cTeam} team="C Team" />
      </div>
    </div>
  );
}
