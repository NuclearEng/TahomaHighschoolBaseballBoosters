import path from "path";
import { parseDocxToHtml } from "@/lib/parsers/word";
import { getBoardAgendaFiles } from "@/lib/data/file-resolver";
import Link from "next/link";
import { MeetingsClient } from "./meetings-client";

/**
 * Post-process mammoth HTML into structured sections.
 *
 * The raw output is a flat sequence of <p> and <ul>/<table> elements.
 * Section headers are <p><strong>…</strong></p>.  Everything before the
 * first bold-header is treated as meeting metadata (date, time, location,
 * attendance).  Each bold-header starts a new agenda section that runs
 * until the next bold-header.
 */
/** Replace Unicode fraction characters with plain-text equivalents.
 *  Word auto-converts sequences like "2/5" and "3/4" into ⅖ and ¾,
 *  which is wrong when the source text is a date range (e.g. "2/5" or "3/2-3/4"). */
function defractionate(html: string): string {
  const fractions: Record<string, string> = {
    "\u00BD": "1/2", // ½
    "\u2153": "1/3", // ⅓
    "\u2154": "2/3", // ⅔
    "\u00BC": "1/4", // ¼
    "\u00BE": "3/4", // ¾
    "\u2155": "1/5", // ⅕
    "\u2156": "2/5", // ⅖
    "\u2157": "3/5", // ⅗
    "\u2158": "4/5", // ⅘
    "\u2159": "1/6", // ⅙
    "\u215A": "5/6", // ⅚
    "\u215B": "1/8", // ⅛
    "\u215C": "3/8", // ⅜
    "\u215D": "5/8", // ⅝
    "\u215E": "7/8", // ⅞
  };
  let result = html;
  for (const [char, replacement] of Object.entries(fractions)) {
    result = result.replaceAll(char, replacement);
  }
  return result;
}

/** Bold leading dates in list items for consistency.
 *  Some list items in the Word docs have bold dates and some don't.
 *  This ensures any <li> starting with a date pattern gets it wrapped in <strong>. */
function boldLeadingDates(html: string): string {
  return html.replace(
    /<li>(?!<strong>)([\d][^<]*?)(\s*[-–]\s)/g,
    "<li><strong>$1</strong>$2"
  );
}

function structureMeetingHtml(raw: string): string {
  // Replace Unicode fractions with plain-text equivalents first
  raw = defractionate(raw);
  // Bold any leading dates in list items that aren't already bold
  raw = boldLeadingDates(raw);

  // Split the HTML into top-level elements.  Mammoth produces a flat
  // list so splitting on "< (p|ul|ol|table)" boundaries works reliably.
  const elements: string[] = [];
  const tagRe = /<(?:p|ul|ol|table)[\s>]/g;
  let match: RegExpExecArray | null;
  const starts: number[] = [];
  while ((match = tagRe.exec(raw)) !== null) {
    starts.push(match.index);
  }
  for (let i = 0; i < starts.length; i++) {
    const end = i + 1 < starts.length ? starts[i + 1] : raw.length;
    elements.push(raw.slice(starts[i], end));
  }

  if (elements.length === 0) return raw;

  // Detect whether an element is a section header: <p><strong>…</strong></p>
  // with meaningful text (not just whitespace / &nbsp;)
  const isSectionHeader = (el: string) => {
    if (!el.startsWith("<p")) return false;
    // Must contain <strong> wrapping essentially the entire paragraph content
    const strongMatch = el.match(
      /^<p[^>]*>\s*<strong>([\s\S]*?)<\/strong>\s*<\/p>/
    );
    if (!strongMatch) return false;
    const text = strongMatch[1].replace(/&[a-z]+;/gi, "").replace(/<[^>]*>/g, "").trim();
    return text.length > 0;
  };

  // Separate metadata (before first section header) from sections
  let firstHeaderIdx = elements.findIndex(isSectionHeader);
  if (firstHeaderIdx === -1) firstHeaderIdx = elements.length;

  const metaElements = elements.slice(0, firstHeaderIdx);
  const bodyElements = elements.slice(firstHeaderIdx);

  // Build structured HTML
  let out = "";

  // — Metadata block —
  if (metaElements.length > 0) {
    // Skip the first element if it's just the org name / "Board Meeting Agenda"
    // title since the card header already shows the date.
    let metaStart = 0;
    if (
      metaElements[0]
        ?.toLowerCase()
        .includes("board meeting agenda")
    ) {
      metaStart = 1;
    }

    const metaLines = metaElements.slice(metaStart);
    if (metaLines.length > 0) {
      out += `<div class="meeting-meta">${metaLines.join("")}</div>`;
    }
  }

  // — Body sections —
  // Group: each section = header element + subsequent non-header elements
  const sections: { header: string; content: string[] }[] = [];
  let current: { header: string; content: string[] } | null = null;

  for (const el of bodyElements) {
    if (isSectionHeader(el)) {
      if (current) sections.push(current);
      current = { header: el, content: [] };
    } else if (current) {
      current.content.push(el);
    }
  }
  if (current) sections.push(current);

  for (const section of sections) {
    out += `<div class="agenda-section">`;
    out += `<div class="agenda-section-header">${section.header}</div>`;
    if (section.content.length > 0) {
      out += `<div class="agenda-section-body">${section.content.join("")}</div>`;
    }
    out += `</div>`;
  }

  return out;
}

// Only these 3 meetings are displayed
const MEETING_DATES = [
  { month: 10, day: 28, year: 2025 },
  { month: 12, day: 10, year: 2025 },
  { month: 1, day: 14, year: 2026 },
];

function matchesMeetingDate(
  dateMatch: RegExpMatchArray,
  target: { month: number; day: number; year: number }
): boolean {
  return (
    Number(dateMatch[1]) === target.month &&
    Number(dateMatch[2]) === target.day &&
    Number(dateMatch[3]) === target.year
  );
}

export default async function BoardMeetingsPage() {
  const agendaFiles = await getBoardAgendaFiles();

  // Filter to only the 3 specific meeting dates and parse each
  const meetings: { label: string; sortKey: string; html: string }[] = [];

  for (const file of agendaFiles) {
    const name = path.basename(file, ".docx");
    const dateMatch = name.match(/(\d{1,2})-(\d{1,2})-(\d{4})/);
    if (!dateMatch) continue;

    const target = MEETING_DATES.find((m) => matchesMeetingDate(dateMatch, m));
    if (!target) continue;

    const d = new Date(target.year, target.month - 1, target.day);
    const label = d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const sortKey = d.toISOString();

    try {
      const rawHtml = await parseDocxToHtml(file);
      const html = structureMeetingHtml(rawHtml);
      meetings.push({ label, sortKey, html });
    } catch {
      // Skip unparseable files
    }
  }

  // Most recent first
  meetings.sort((a, b) => b.sortKey.localeCompare(a.sortKey));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#00357b]">Board Meetings</h1>
          <p className="text-sm text-muted-foreground">
            Executive board meeting agendas &amp; minutes
          </p>
        </div>
        <Link
          href="/governance"
          className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
        >
          Back to Governance
        </Link>
      </div>

      <MeetingsClient
        meetings={meetings.map(({ label, html }) => ({ label, html }))}
      />
    </div>
  );
}
