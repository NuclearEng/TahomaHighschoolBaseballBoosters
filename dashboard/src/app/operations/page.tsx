import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Shirt,
  HandHelping,
  Calendar,
  ClipboardList,
  ArrowRight,
} from "lucide-react";
import { getRosters } from "@/lib/parsers/roster";
import { getUniformInventory } from "@/lib/parsers/uniforms";
import { getVolunteerSummary } from "@/lib/parsers/volunteers";

export default async function OperationsPage() {
  const [rosters, uniforms, volunteers] = await Promise.all([
    getRosters(),
    getUniformInventory(),
    getVolunteerSummary(),
  ]);

  const totalPlayers =
    rosters.varsity.length + rosters.jvBlue.length + rosters.jvGold.length;

  const subPages = [
    {
      title: "Rosters",
      description: "View player rosters for Varsity, JV Blue, and JV Gold",
      href: "/operations/rosters",
      icon: ClipboardList,
      stat: `${totalPlayers} players`,
    },
    {
      title: "Uniforms",
      description: "Track uniform inventory, checkouts, and returns",
      href: "/operations/uniforms",
      icon: Shirt,
      stat: `${uniforms.totalItems} items`,
    },
    {
      title: "Volunteers",
      description: "Manage volunteer needs and assignments by team",
      href: "/operations/volunteers",
      icon: HandHelping,
      stat: `${volunteers.totalFilled}/${volunteers.totalNeeds} filled`,
    },
    {
      title: "Events",
      description: "Fundraising events, celebrations, and program activities",
      href: "/operations/events",
      icon: Calendar,
      stat: "15 events",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#00357b]">Operations</h1>
        <p className="text-sm text-muted-foreground">
          Rosters, uniforms, volunteers, and event management
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-[#00357b]">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Players
                </p>
                <p className="text-2xl font-bold tabular-nums tracking-tight">
                  {totalPlayers}
                </p>
                <p className="text-xs text-muted-foreground">
                  V: {rosters.varsity.length} / JV Blue: {rosters.jvBlue.length} / JV Gold: {rosters.jvGold.length}
                </p>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#FFCB1E]">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Uniform Items
                </p>
                <p className="text-2xl font-bold tabular-nums tracking-tight">
                  {uniforms.totalItems}
                </p>
                <div className="flex gap-2 text-xs">
                  <span className="text-emerald-600">
                    {uniforms.returned} returned
                  </span>
                  <span className="text-muted-foreground">&middot;</span>
                  <span className="text-rose-600">
                    {uniforms.missing} missing
                  </span>
                </div>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <Shirt className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Volunteer Positions Filled
                </p>
                <p className="text-2xl font-bold tabular-nums tracking-tight">
                  {volunteers.totalFilled}
                  <span className="text-base font-normal text-muted-foreground">
                    {" "}
                    / {volunteers.totalNeeds}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {volunteers.totalNeeds - volunteers.totalFilled} positions
                  still open
                </p>
              </div>
              <div className="rounded-lg bg-muted p-2">
                <HandHelping className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sub-page Links */}
      <div className="grid gap-4 md:grid-cols-2">
        {subPages.map((page) => {
          const Icon = page.icon;
          return (
            <Link key={page.href} href={page.href} className="group">
              <Card className="transition-colors hover:border-[#FFCB1E]/50 hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Icon className="h-4 w-4 text-[#FFCB1E]" />
                    {page.title}
                    <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {page.description}
                  </p>
                  <Badge
                    variant="secondary"
                    className="mt-3 bg-[#00357b]/5 text-[#00357b]"
                  >
                    {page.stat}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
