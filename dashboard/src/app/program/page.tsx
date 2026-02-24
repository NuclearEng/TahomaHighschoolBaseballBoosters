import { getProgramInfo } from "@/lib/data/website";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeasonTable } from "./season-table";
import {
  Globe,
  Mail,
  MapPin,
  ExternalLink,
  Heart,
  Users,
  Trophy,
  Calendar,
  Award,
} from "lucide-react";
import Link from "next/link";

const SEASON_RESULTS = [
  { year: 2025, league: "11-3", leagueFinish: "2nd", overall: "14-9", playoff: "Districts: 3rd Round" },
  { year: 2024, league: "8-4", leagueFinish: "2nd", overall: "16-9", playoff: "State: 1st Round" },
  { year: 2023, league: "12-0", leagueFinish: "1st", overall: "25-3", playoff: "Final Four: 3rd Place", champion: true },
  { year: 2022, league: "8-4", leagueFinish: "2nd", overall: "16-7", playoff: "State: 1st Round" },
  { year: 2021, league: "11-1", leagueFinish: "1st", overall: "16-1", playoff: "No playoffs (Covid)", champion: true },
  { year: 2020, league: "-", leagueFinish: "-", overall: "-", playoff: "Season cancelled (Covid)" },
  { year: 2019, league: "11-3", leagueFinish: "1st", overall: "17-9", playoff: "State: 2nd Round", champion: true },
  { year: 2018, league: "14-0", leagueFinish: "1st", overall: "20-4", playoff: "State: 1st Round", champion: true },
  { year: 2017, league: "9-5", leagueFinish: "4th", overall: "16-8", playoff: "State: 1st Round" },
  { year: 2016, league: "8-4", leagueFinish: "3rd", overall: "18-8", playoff: "Districts: 3rd Round" },
  { year: 2015, league: "6-6", leagueFinish: "5th", overall: "15-10", playoff: "Districts: 3rd Round" },
  { year: 2014, league: "12-4", leagueFinish: "2nd", overall: "16-8", playoff: "Districts: 4th Round" },
  { year: 2013, league: "10-6", leagueFinish: "4th", overall: "13-8", playoff: "Districts: 1st Round" },
  { year: 2012, league: "12-4", leagueFinish: "2nd", overall: "17-7", playoff: "State: 2nd Round, District Champs" },
  { year: 2011, league: "15-1", leagueFinish: "1st", overall: "20-3", playoff: "State: 1st Round", champion: true },
  { year: 2010, league: "10-6", leagueFinish: "3rd", overall: "15-8", playoff: "Districts" },
  { year: 2009, league: "15-1", leagueFinish: "1st", overall: "22-3", playoff: "Final Four: 3rd Place", champion: true },
  { year: 2008, league: "11-3", leagueFinish: "2nd", overall: "16-7", playoff: "State: 1st Round" },
  { year: 2007, league: "13-1", leagueFinish: "1st", overall: "23-3", playoff: "Final Four: 3rd Place", champion: true },
  { year: 2006, league: "15-1", leagueFinish: "2nd", overall: "22-5", playoff: "Final Four: 4th Place, Regional & District Champs" },
  { year: 2005, league: "10-6", leagueFinish: "3rd", overall: "13-9", playoff: "Districts: 2nd Round" },
  { year: 2004, league: "9-7", leagueFinish: "6th", overall: "12-9", playoff: "-" },
  { year: 2003, league: "10-6", leagueFinish: "3rd", overall: "19-7", playoff: "Final Four: 3rd Place" },
  { year: 2002, league: "7-9", leagueFinish: "7th", overall: "8-10", playoff: "-" },
  { year: 2001, league: "6-10", leagueFinish: "7th", overall: "8-12", playoff: "-" },
  { year: 2000, league: "5-11", leagueFinish: "7th", overall: "5-20", playoff: "-" },
  { year: 1999, league: "3-11", leagueFinish: "8th", overall: "6-12", playoff: "-" },
  { year: 1998, league: "2-12", leagueFinish: "7th", overall: "4-15", playoff: "-" },
  { year: 1997, league: "12-6 (2A)", leagueFinish: "2nd", overall: "13-8", playoff: "-" },
  { year: 1996, league: "15-3 (2A)", leagueFinish: "2nd", overall: "16-4", playoff: "State" },
  { year: 1995, league: "16-2 (2A)", leagueFinish: "1st", overall: "19-4", playoff: "State", champion: true },
];

export default function ProgramPage() {
  const info = getProgramInfo();

  const socialLinks = [
    {
      name: "X",
      url: info.socialMedia.x,
      handle: "@TahomaBaseball",
    },
    {
      name: "Instagram",
      url: info.socialMedia.instagram,
      handle: "@tahoma_baseball",
    },
    {
      name: "TikTok",
      url: info.socialMedia.tiktok,
      handle: "@tahoma_baseball",
    },
    {
      name: "Facebook",
      url: info.socialMedia.facebook,
      handle: "TahomaBaseball",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#00357b]">Program</h1>
          <p className="text-sm text-muted-foreground">
            {info.schoolName} {info.mascot} Baseball &middot; Boosters
            organization info
          </p>
        </div>
        <a
          href={info.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
        >
          tahomabearsbaseball.com <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Team Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-4 w-4" />
            Team Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="rounded-lg bg-[#00357b] p-2">
                  <Trophy className="h-5 w-5 text-gold-link" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#00357b]">
                    {info.schoolName}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {info.mascot} Baseball
                  </p>
                </div>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Varsity &middot; JV Blue &middot; JV Gold</p>
                <p>NPSL Conference</p>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Location</h3>
              </div>
              <p className="text-sm text-muted-foreground">{info.address}</p>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Contact</h3>
              </div>
              <a
                href={`mailto:${info.email}`}
                className="text-sm text-gold-link hover:underline"
              >
                {info.email}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule & Season Results Quick Links */}
      <div className="grid gap-4 lg:grid-cols-2">
        <a
          href="https://www.tahomabearsbaseball.com/calendar"
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <Card className="h-full transition-shadow hover:shadow-md hover:border-[#FFCB1E]/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-[#00357b] p-3 shrink-0">
                <Calendar className="h-6 w-6 text-[#FFCB1E]" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-[#00357b]">
                  2026 Game Schedule
                </h3>
                <p className="text-sm text-muted-foreground">
                  Full varsity season schedule with dates, times, and locations
                </p>
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-gold-link group-hover:underline">
                  View on tahomabearsbaseball.com <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </CardContent>
          </Card>
        </a>

        <a
          href="https://www.tahomabearsbaseball.com/season-results"
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <Card className="h-full transition-shadow hover:shadow-md hover:border-[#FFCB1E]/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-[#00357b] p-3 shrink-0">
                <Award className="h-6 w-6 text-[#FFCB1E]" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-[#00357b]">
                  Season Results (1995-Present)
                </h3>
                <p className="text-sm text-muted-foreground">
                  8 League Titles &middot; 2 District Titles &middot; 15 State Appearances &middot; 5 Final Fours
                </p>
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-gold-link group-hover:underline">
                  Full history on tahomabearsbaseball.com <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </CardContent>
          </Card>
        </a>
      </div>

      {/* Season-by-Season Results */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-4 w-4" />
            Season-by-Season Results
            <Badge variant="outline" className="ml-1 text-[11px]">
              {SEASON_RESULTS.length} seasons
            </Badge>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Varsity results from 1995 to present
          </p>
        </CardHeader>
        <CardContent>
          <SeasonTable data={SEASON_RESULTS} />
        </CardContent>
      </Card>

      {/* Sponsor Showcase */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Heart className="h-4 w-4 text-rose-500" />
            Sponsor Showcase
            <Badge variant="outline" className="ml-1 text-[11px]">
              {info.sponsors.length} sponsors
            </Badge>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Thank you to our generous sponsors who make the program possible
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {info.sponsors.map((sponsor) => {
              const content = (
                <div className="flex flex-col items-center justify-center rounded-lg border bg-white p-4 text-center hover:shadow-md hover:border-[#FFCB1E]/50 transition-all h-full group">
                  {sponsor.logo ? (
                    <div className="mb-2 flex h-16 w-full items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className="max-h-16 max-w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#00357b]/10">
                      <span className="text-sm font-bold text-[#00357b]">
                        {sponsor.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .substring(0, 2)
                          .toUpperCase()}
                      </span>
                    </div>
                  )}
                  <p className="text-xs font-medium leading-tight">
                    {sponsor.name}
                  </p>
                  {sponsor.url && (
                    <span className="mt-1 inline-flex items-center gap-0.5 text-[11px] text-gold-link opacity-0 group-hover:opacity-100 transition-opacity">
                      Visit <ExternalLink className="h-2.5 w-2.5" />
                    </span>
                  )}
                </div>
              );

              return sponsor.url ? (
                <a
                  key={sponsor.name}
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content}
                </a>
              ) : (
                <div key={sponsor.name}>{content}</div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Social Media & Links */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4" />
              Social Media
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-[#00357b]/5 p-2">
                      <Globe className="h-4 w-4 text-[#00357b]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{social.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {social.handle}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-gold-link transition-colors" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              Contact &amp; Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Booster Organization
              </h4>
              <div className="rounded-lg border p-3 space-y-1.5">
                <p className="text-sm font-medium">
                  Tahoma Bears Baseball Boosters
                </p>
                <p className="text-sm text-muted-foreground">
                  501(c)(3) Nonprofit Organization
                </p>
                <a
                  href={`mailto:${info.email}`}
                  className="text-sm text-gold-link hover:underline block"
                >
                  {info.email}
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Quick Links
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Website", href: info.website, external: true },
                  { label: "Schedule", href: "https://www.tahomabearsbaseball.com/calendar", external: true },
                  { label: "Season Results", href: "https://www.tahomabearsbaseball.com/season-results", external: true },
                  { label: "Budget", href: "/financials/budget", external: false },
                  { label: "Bylaws", href: "/governance/bylaws", external: false },
                  { label: "Compliance", href: "/compliance", external: false },
                  { label: "Fundraising", href: "/fundraising", external: false },
                ].map((link) =>
                  link.external ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-muted"
                      >
                        {link.label}
                        <ExternalLink className="ml-1 h-2.5 w-2.5" />
                      </Badge>
                    </a>
                  ) : (
                    <Link key={link.label} href={link.href}>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-muted"
                      >
                        {link.label}
                      </Badge>
                    </Link>
                  )
                )}
              </div>
            </div>

            <div className="border-t pt-3">
              <p className="text-xs text-muted-foreground">
                {info.address}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Season: February - May (Spring) &middot; Summer Programs: June
                - July
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
