import { getProgramInfo } from "@/lib/data/website";
import { COLLEGIATE_ALUMNI } from "@/lib/data/alumni";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlumniTable } from "./alumni-table";
import {
  Heart,
  GraduationCap,
  Users,
  Star,
  CheckCircle,
  ExternalLink,
  Mail,
  Award,
  Trophy,
} from "lucide-react";

export default function SponsorshipsPage() {
  const info = getProgramInfo();

  const totalAlumni = COLLEGIATE_ALUMNI.length;
  const draftedPlayers = COLLEGIATE_ALUMNI.filter((a) => a.drafted);
  const proballPlayers = COLLEGIATE_ALUMNI.filter((a) => a.proball);
  const uniquePrograms = new Set(
    COLLEGIATE_ALUMNI.flatMap((a) =>
      a.teams
        .split(" \u27A1\uFE0F ")
        .map((t) => t.replace(/\s*\(.*?\)\s*$/, "").trim())
    )
  ).size;

  const tiers = [
    {
      name: "Gold",
      color: "bg-[#FFCB1E]",
      textColor: "text-[#00357b]",
      benefits: [
        "Logo on website",
        "Social media features",
        "Banquet recognition",
        "Named award sponsor",
        "Camp sponsorship",
      ],
    },
    {
      name: "Silver",
      color: "bg-slate-300",
      textColor: "text-slate-800",
      benefits: [
        "Logo on website",
        "Social media features",
        "Event signage at booster events",
      ],
    },
    {
      name: "Bronze",
      color: "bg-amber-700",
      textColor: "text-white",
      benefits: [
        "Social media shout-out",
        "Website listing",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#00357b]">Sponsorships</h1>
          <p className="text-sm text-muted-foreground">
            Support Tahoma Bears Baseball &middot; 501(c)(3) Tax-Deductible
          </p>
        </div>
        <a
          href={`mailto:${info.email}?subject=Sponsorship Inquiry`}
          className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
        >
          <Mail className="h-3 w-3" /> Contact Us
        </a>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-[#00357b] p-3">
              <GraduationCap className="h-6 w-6 text-[#FFCB1E]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#00357b]">{totalAlumni}+</p>
              <p className="text-sm text-muted-foreground">Collegiate Athletes</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-[#00357b] p-3">
              <Trophy className="h-6 w-6 text-[#FFCB1E]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#00357b]">
                {draftedPlayers.length}
                {proballPlayers.length > 0 && (
                  <span className="text-base font-normal text-muted-foreground">
                    {" "}+ {proballPlayers.length} pro
                  </span>
                )}
              </p>
              <p className="text-sm text-muted-foreground">MLB Draft Picks</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-[#00357b] p-3">
              <Heart className="h-6 w-6 text-[#FFCB1E]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#00357b]">{info.sponsors.length}</p>
              <p className="text-sm text-muted-foreground">Current Sponsors</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Why Sponsor Us */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Star className="h-4 w-4 text-[#FFCB1E]" />
            Why Sponsor Tahoma Baseball?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-lg border p-4">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              <div>
                <p className="text-sm font-medium">501(c)(3) Tax-Deductible</p>
                <p className="text-xs text-muted-foreground">
                  All contributions are fully tax-deductible through our registered nonprofit
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border p-4">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              <div>
                <p className="text-sm font-medium">20+ Year Track Record</p>
                <p className="text-xs text-muted-foreground">
                  {totalAlumni}+ athletes placed at {uniquePrograms}+ collegiate programs since 2003
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border p-4">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              <div>
                <p className="text-sm font-medium">Active Social Media Presence</p>
                <p className="text-xs text-muted-foreground">
                  Engaged community across{" "}
                  <a href={info.socialMedia.x} target="_blank" rel="noopener noreferrer" className="text-gold-link hover:underline">X</a>,{" "}
                  <a href={info.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-gold-link hover:underline">Instagram</a>,{" "}
                  <a href={info.socialMedia.tiktok} target="_blank" rel="noopener noreferrer" className="text-gold-link hover:underline">TikTok</a>, and{" "}
                  <a href={info.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-gold-link hover:underline">Facebook</a>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border p-4">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              <div>
                <p className="text-sm font-medium">Community Visibility</p>
                <p className="text-xs text-muted-foreground">
                  Exposure through events, annual banquet, summer camps, and community programs
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sponsorship Tiers */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Award className="h-4 w-4" />
            Sponsorship Tiers
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Choose the level that fits your business
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {tiers.map((tier) => (
              <div key={tier.name} className="rounded-lg border overflow-hidden">
                <div className={`${tier.color} ${tier.textColor} px-4 py-2 text-center`}>
                  <h3 className="text-sm font-bold">{tier.name}</h3>
                </div>
                <ul className="space-y-2 p-4">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Interested?{" "}
            <a
              href={`mailto:${info.email}?subject=Sponsorship Inquiry`}
              className="text-gold-link hover:underline"
            >
              Contact us at {info.email}
            </a>
          </p>
        </CardContent>
      </Card>

      {/* Current Sponsors */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Heart className="h-4 w-4 text-rose-500" />
            Current Sponsors
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

      {/* Collegiate Alumni Legacy */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <GraduationCap className="h-4 w-4" />
            Collegiate Alumni Legacy
            <Badge variant="outline" className="ml-1 text-[11px]">
              {totalAlumni} athletes
            </Badge>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {totalAlumni}+ athletes placed at {uniquePrograms}+ programs since 2003 &middot;{" "}
            {draftedPlayers.length} MLB Draft Picks
          </p>
        </CardHeader>
        <CardContent>
          <AlumniTable data={COLLEGIATE_ALUMNI} />
        </CardContent>
      </Card>
    </div>
  );
}
