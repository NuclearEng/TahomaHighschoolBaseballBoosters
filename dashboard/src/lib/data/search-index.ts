import { COLLEGIATE_ALUMNI } from "./alumni";
import { getProgramInfo } from "./website";

export interface SearchItem {
  title: string;
  category: "page" | "alumni" | "sponsor" | "compliance";
  href: string;
  subtitle?: string;
}

// Build-time search index from pages, alumni, sponsors, compliance
export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  // Dashboard pages
  const pages: { title: string; href: string; subtitle?: string }[] = [
    { title: "Executive Summary", href: "/", subtitle: "Overview" },
    { title: "Financials", href: "/financials", subtitle: "Budget overview" },
    { title: "Budget Detail", href: "/financials/budget", subtitle: "Line-by-line budget" },
    { title: "Transactions", href: "/financials/transactions", subtitle: "Square transactions" },
    { title: "Coach's Fund", href: "/financials/coaches-fund", subtitle: "Coach fund tracking" },
    { title: "Fundraising", href: "/fundraising", subtitle: "Revenue events" },
    { title: "AI Insights", href: "/fundraising/insights", subtitle: "Fundraising analysis" },
    { title: "Operations", href: "/operations", subtitle: "Ops overview" },
    { title: "Rosters", href: "/operations/rosters", subtitle: "Team rosters" },
    { title: "Uniforms", href: "/operations/uniforms", subtitle: "Uniform inventory" },
    { title: "Volunteers", href: "/operations/volunteers", subtitle: "Volunteer needs" },
    { title: "Events", href: "/operations/events", subtitle: "Calendar" },
    { title: "Governance", href: "/governance", subtitle: "Board info" },
    { title: "Bylaws", href: "/governance/bylaws", subtitle: "Organization bylaws" },
    { title: "Board Meetings", href: "/governance/agendas", subtitle: "Agendas & minutes" },
    { title: "Compliance", href: "/compliance", subtitle: "Regulatory filings" },
    { title: "Program", href: "/program", subtitle: "School & team info" },
    { title: "Sponsorships", href: "/sponsorships", subtitle: "Sponsors & alumni" },
  ];

  for (const page of pages) {
    items.push({
      title: page.title,
      category: "page",
      href: page.href,
      subtitle: page.subtitle,
    });
  }

  // Alumni
  for (const alum of COLLEGIATE_ALUMNI) {
    items.push({
      title: alum.name,
      category: "alumni",
      href: "/sponsorships",
      subtitle: `Class of ${alum.gradYear} — ${alum.teams}`,
    });
  }

  // Sponsors
  const info = getProgramInfo();
  for (const sponsor of info.sponsors) {
    items.push({
      title: sponsor.name,
      category: "sponsor",
      href: "/sponsorships",
      subtitle: "Sponsor",
    });
  }

  // Compliance items
  const complianceItems = [
    { title: "IRS 990N Filing", subtitle: "Tax-exempt status" },
    { title: "WA SOS Annual Report", subtitle: "State registration" },
    { title: "Insurance Policy", subtitle: "Liability & D&O" },
    { title: "Financial Review/Audit", subtitle: "Annual audit" },
    { title: "Officer Elections", subtitle: "Annual meeting" },
  ];
  for (const item of complianceItems) {
    items.push({
      title: item.title,
      category: "compliance",
      href: "/compliance",
      subtitle: item.subtitle,
    });
  }

  return items;
}
