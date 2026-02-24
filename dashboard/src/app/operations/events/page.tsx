import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  PartyPopper,
  Heart,
  ShoppingBag,
  Timer,
  Trophy,
  GraduationCap,
  Megaphone,
  Utensils,
  Swords,
  Shirt,
  Users,
} from "lucide-react";
import type { Event } from "@/lib/types/operational";

const EVENTS: (Event & { icon: React.ElementType; exactDate?: string })[] = [
  {
    name: "Tryouts",
    date: "March 2-3, 2026",
    exactDate: "2026-03-02",
    category: "other",
    status: "planned",
    description:
      "Cage rentals and bullpen sessions at Rock Creek. White t-shirts with numbers for identification.",
    icon: Swords,
  },
  {
    name: "Uniform Distribution",
    date: "March 6, 2026",
    exactDate: "2026-03-06",
    category: "other",
    status: "planned",
    description:
      "Staggered distribution: Seniors 3:30pm, Juniors 4:00pm, Sophomores 4:30pm, Freshmen 5:00pm.",
    icon: Shirt,
  },
  {
    name: "Blue vs. Gold Games",
    date: "March 7, 2026",
    exactDate: "2026-03-07",
    category: "celebration",
    status: "planned",
    description:
      "Intra-squad scrimmage. Boosters to provide food for players and families.",
    icon: Trophy,
  },
  {
    name: "Parent Meeting & Media Day",
    date: "March 10, 2026",
    exactDate: "2026-03-10",
    category: "meeting",
    status: "planned",
    description:
      "Season kickoff parent meeting and team media day. Concessions volunteer signup at parent meeting.",
    icon: Users,
  },
  {
    name: "First Day of Games",
    date: "March 11, 2026",
    exactDate: "2026-03-11",
    category: "other",
    status: "planned",
    description: "Season opener for all teams. Official start of the 2026 spring season.",
    icon: Trophy,
  },
  {
    name: "Call/Text-A-Thon",
    date: "March 16, 2026",
    exactDate: "2026-03-16",
    category: "fundraiser",
    status: "planned",
    description:
      "4:30-6:30pm at Tahoma Commons. QR code donation format. Major fundraising event for the program.",
    icon: Megaphone,
  },
  {
    name: "Hour-A-Thon",
    date: "February/March 2026",
    category: "fundraiser",
    status: "planned",
    description:
      "Player-driven fundraiser where athletes collect pledges for hours of baseball activity. Major revenue source.",
    icon: Timer,
  },
  {
    name: "Hat Sales",
    date: "Ongoing (Season)",
    category: "fundraiser",
    status: "in-progress",
    description:
      "Ongoing sale of Tahoma Bears branded hats and merchandise. Available at home games and online.",
    icon: ShoppingBag,
  },
  {
    name: "Concessions",
    date: "Ongoing (Home Games)",
    category: "fundraiser",
    status: "in-progress",
    description:
      "Boosters-run concessions at varsity home games. Key revenue source — volunteer sign-up at parent meeting.",
    icon: Utensils,
  },
  {
    name: "UW Team Night",
    date: "May 2, 2026",
    exactDate: "2026-05-02",
    category: "celebration",
    status: "planned",
    description:
      "Team outing to a University of Washington baseball game.",
    icon: Trophy,
  },
  {
    name: "Senior Night",
    date: "May 5, 2026",
    exactDate: "2026-05-05",
    category: "celebration",
    status: "planned",
    description:
      "Ceremony honoring graduating seniors. Includes photo collages, balloon arch, bouquets for moms, signed baseballs for dads, candy leis, and senior program. Moms throw out the first pitch.",
    icon: PartyPopper,
  },
  {
    name: "End of Season Banquet",
    date: "June 1, 2026",
    exactDate: "2026-06-01",
    category: "celebration",
    status: "planned",
    description:
      "Awards banquet for all teams. Includes team dinners, player awards, senior speeches, and team photos.",
    icon: PartyPopper,
  },
  {
    name: "Scholarships & Community Awards Night",
    date: "June 4, 2026",
    exactDate: "2026-06-04",
    category: "celebration",
    status: "planned",
    description:
      "Two $500 college scholarships awarded. Applications due March 20, 2026 via GoingMerry.com.",
    icon: GraduationCap,
  },
  {
    name: "Summer Baseball Camp",
    date: "June 30 - July 1, 2026",
    exactDate: "2026-06-30",
    category: "camp",
    status: "planned",
    description:
      "Two-day youth baseball camp from 10:00am-2:00pm on both fields. Key fundraiser and community outreach.",
    icon: Trophy,
  },
  {
    name: "Hope at Bat",
    date: "TBD (Spring 2026)",
    category: "fundraiser",
    status: "planned",
    description:
      "Charity baseball event supporting community organizations. Combines competitive play with fundraising.",
    icon: Heart,
  },
];

function categoryLabel(category: Event["category"]) {
  switch (category) {
    case "camp":
      return "Camp";
    case "fundraiser":
      return "Fundraiser";
    case "celebration":
      return "Celebration";
    case "meeting":
      return "Meeting";
    default:
      return "Season";
  }
}

function CategoryBadge({ category }: { category: Event["category"] }) {
  const styles: Record<Event["category"], string> = {
    camp: "bg-blue-100 text-blue-700 border-blue-200",
    fundraiser: "bg-[#FFCB1E]/10 text-[#FFCB1E] border-[#FFCB1E]/20",
    celebration: "bg-purple-100 text-purple-700 border-purple-200",
    meeting: "bg-slate-100 text-slate-700 border-slate-200",
    other: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <Badge className={`${styles[category]} hover:${styles[category]}`}>
      {categoryLabel(category)}
    </Badge>
  );
}

function StatusBadge({ status }: { status: Event["status"] }) {
  switch (status) {
    case "planned":
      return (
        <Badge variant="outline" className="text-[#00357b] border-[#00357b]/20">
          Planned
        </Badge>
      );
    case "in-progress":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
          In Progress
        </Badge>
      );
    case "completed":
      return (
        <Badge className="bg-[#00357b]/10 text-[#00357b] border-[#00357b]/20 hover:bg-[#00357b]/10">
          Completed
        </Badge>
      );
    case "cancelled":
      return (
        <Badge className="bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100">
          Cancelled
        </Badge>
      );
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
}

export default function EventsPage() {
  const fundraiserCount = EVENTS.filter(
    (e) => e.category === "fundraiser"
  ).length;
  const celebrationCount = EVENTS.filter(
    (e) => e.category === "celebration"
  ).length;
  const inProgressCount = EVENTS.filter(
    (e) => e.status === "in-progress"
  ).length;

  // Sort events by date (those with exactDate come first, in order)
  const sortedEvents = [...EVENTS].sort((a, b) => {
    if (a.exactDate && b.exactDate) return a.exactDate.localeCompare(b.exactDate);
    if (a.exactDate) return -1;
    if (b.exactDate) return 1;
    return 0;
  });

  // Key season dates + 2026 varsity game schedule
  const keyDates: { date: string; label: string; game?: boolean }[] = [
    { date: "Feb 2", label: "Player Meeting (2:30pm PAC)" },
    { date: "Feb 10", label: "School Levy Vote" },
    { date: "Mar 2-3", label: "Tryouts at Rock Creek" },
    { date: "Mar 6", label: "Uniform Distribution" },
    { date: "Mar 7", label: "Blue vs. Gold Games" },
    { date: "Mar 10", label: "Parent Meeting & Media Day" },
    { date: "Mar 11", label: "@ O'Dea, 6:00pm (Opener)", game: true },
    { date: "Mar 14", label: "@ Union (DH), 11am & 2pm", game: true },
    { date: "Mar 16", label: "Call/Text-A-Thon" },
    { date: "Mar 18", label: "vs. Skyline, 6:00pm", game: true },
    { date: "Mar 20", label: "Scholarship Applications Due" },
    { date: "Mar 24", label: "vs. Auburn Riverside, 6:00pm", game: true },
    { date: "Mar 25", label: "@ Auburn Riverside, 4:00pm", game: true },
    { date: "Mar 31", label: "vs. Kennedy Catholic, 6:00pm", game: true },
    { date: "Apr 1", label: "@ Kennedy Catholic, 4:00pm", game: true },
    { date: "Apr 3", label: "@ Kentlake, 4:00pm", game: true },
    { date: "Apr 7", label: "@ Mount Rainier, 4:00pm", game: true },
    { date: "Apr 8", label: "vs. Mount Rainier, 4:00pm", game: true },
    { date: "Apr 14", label: "@ Kentwood, 4:00pm", game: true },
    { date: "Apr 15", label: "vs. Kentwood, 7:00pm", game: true },
    { date: "Apr 17", label: "vs. Mercer Island, 6:00pm", game: true },
    { date: "Apr 21", label: "@ Kentridge, 6:00pm", game: true },
    { date: "Apr 22", label: "vs. Kentridge, 7:00pm", game: true },
    { date: "Apr 28", label: "vs. Stadium, 7:00pm", game: true },
    { date: "Apr 29", label: "@ Stadium, 4:00pm", game: true },
    { date: "May 2", label: "UW Team Night" },
    { date: "May 4", label: "@ Auburn, 7:00pm", game: true },
    { date: "May 5", label: "vs. Auburn, 7:00pm (Senior Night)", game: true },
    { date: "Jun 1", label: "End of Season Banquet" },
    { date: "Jun 4", label: "Scholarships & Awards Night" },
    { date: "Jun 30", label: "Summer Camp (Day 1)" },
    { date: "Jul 1", label: "Summer Camp (Day 2)" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#00357b]">Events & Key Dates</h1>
        <p className="text-sm text-muted-foreground">
          2026 season events, fundraisers, and milestones from board meeting minutes
        </p>
      </div>

      {/* Quick Stats */}
      <div className="flex flex-wrap gap-2">
        <Badge className="bg-[#00357b] text-white hover:bg-[#00357b]">
          {EVENTS.length} Total Events
        </Badge>
        <Badge className="bg-[#FFCB1E]/10 text-[#FFCB1E] border-[#FFCB1E]/20 hover:bg-[#FFCB1E]/10">
          {fundraiserCount} Fundraisers
        </Badge>
        <Badge className="bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100">
          {celebrationCount} Celebrations
        </Badge>
        {inProgressCount > 0 && (
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
            {inProgressCount} In Progress
          </Badge>
        )}
      </div>

      {/* Key Dates Timeline */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base text-[#00357b]">
            <Calendar className="h-4 w-4" />
            2026 Season Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {keyDates.map((kd) => (
              <div
                key={kd.date + kd.label}
                className={`flex items-center gap-3 rounded-lg border p-2.5 ${kd.game ? "border-[#FFCB1E]/40 bg-[#FFCB1E]/5" : ""}`}
              >
                <span className={`shrink-0 rounded px-2 py-1 text-xs font-semibold tabular-nums bg-[#00357b]/5 text-[#00357b]`}>
                  {kd.date}
                </span>
                <span className="text-sm">{kd.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Event Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedEvents.map((event) => {
          const Icon = event.icon;
          return (
            <Card
              key={event.name}
              className="transition-colors hover:border-[#FFCB1E]/30"
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-start justify-between text-base">
                  <div className="flex items-center gap-2 text-[#00357b]">
                    <Icon className="h-4 w-4 shrink-0 text-[#FFCB1E]" />
                    {event.name}
                  </div>
                  <StatusBadge status={event.status} />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
                <div className="flex items-center justify-between border-t pt-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {event.date || "TBD"}
                  </div>
                  <CategoryBadge category={event.category} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Source Note */}
      <p className="text-xs text-muted-foreground">
        Dates sourced from board meeting minutes (1/14/2026, 12/10/2025, 10/28/2025) and
        tahomabearsbaseball.com/calendar. Game dates highlighted in gold. Dates marked TBD are subject to confirmation.
      </p>
    </div>
  );
}
