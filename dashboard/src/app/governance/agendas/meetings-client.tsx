"use client";

import { useState } from "react";

interface Meeting {
  label: string;
  html: string;
}

interface MeetingsClientProps {
  meetings: Meeting[];
}

export function MeetingsClient({ meetings }: MeetingsClientProps) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div>
      {/* Date pills */}
      <div className="flex flex-wrap gap-3">
        {meetings.map((meeting, i) => {
          const isActive = active === i;
          return (
            <button
              key={meeting.label}
              onClick={() => setActive(isActive ? null : i)}
              className={`
                rounded-full px-5 py-2 text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-[#00357b] text-white shadow-md"
                    : "border border-border bg-card text-foreground hover:border-[#00357b]/40 hover:bg-[#00357b]/5"
                }
              `}
            >
              {meeting.label}
            </button>
          );
        })}
      </div>

      {/* Expanded agenda content */}
      {active !== null && meetings[active] && (
        <div className="mt-8 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
            {/* Header bar */}
            <div className="border-b bg-[#00357b] px-8 py-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-widest text-white/60">
                  Board Meeting Agenda
                </p>
                <h2 className="text-lg font-semibold text-white tracking-tight mt-0.5">
                  {meetings[active].label}
                </h2>
              </div>
              <button
                onClick={() => setActive(null)}
                className="text-xs text-white/60 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>

            {/* Agenda body */}
            <div
              className="
                agenda-document
                px-10 py-8
                max-w-none
                text-[0.9rem] leading-relaxed text-foreground/80
                font-['Inter',ui-sans-serif,system-ui,sans-serif]

                [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-[#00357b] [&_h1]:tracking-tight [&_h1]:border-b [&_h1]:border-border/40 [&_h1]:pb-3 [&_h1]:mb-4
                [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-[#00357b] [&_h2]:tracking-tight [&_h2]:mt-6 [&_h2]:mb-2
                [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-[#00357b] [&_h3]:mt-4 [&_h3]:mb-1

                [&_p]:my-1.5 [&_p]:leading-[1.7]
                [&_strong]:text-[#00357b] [&_strong]:font-semibold
                [&_a]:text-[#00357b] [&_a]:underline [&_a]:underline-offset-2

                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ul]:space-y-1
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_ol]:space-y-1
                [&_li]:pl-1 [&_li]:leading-[1.7]
                [&_ul_ul]:list-[circle] [&_ul_ul]:mt-1 [&_ul_ul]:mb-0
                [&_ul_ul_ul]:list-[square] [&_ul_ul_ul]:mt-1 [&_ul_ul_ul]:mb-0

                [&_table]:w-full [&_table]:text-[0.82rem] [&_table]:border-collapse [&_table]:rounded-md [&_table]:overflow-hidden [&_table]:my-4
                [&_table]:border [&_table]:border-border/50
                [&_th]:px-3.5 [&_th]:py-2.5 [&_th]:text-left [&_th]:border [&_th]:border-border/40
                [&_td]:px-3.5 [&_td]:py-2.5 [&_td]:border [&_td]:border-border/40
                [&_thead_tr:first-child]:bg-[#00357b]/[0.07]
                [&_thead_tr:first-child_th]:text-[#00357b] [&_thead_tr:first-child_th]:font-semibold [&_thead_tr:first-child_th]:text-[0.8rem] [&_thead_tr:first-child_th]:uppercase [&_thead_tr:first-child_th]:tracking-wide
                [&_tr:not(:first-child)_th]:font-normal [&_tr:not(:first-child)_th]:text-foreground/80
                [&_tr:not(:first-child)_th_strong]:font-normal [&_tr:not(:first-child)_th_strong]:text-foreground/80 [&_tr:not(:first-child)_th_strong]:text-foreground/80
                [&_tbody_tr:nth-child(even)]:bg-muted/15
                [&_table_p]:my-0

                [&_hr]:border-border/40 [&_hr]:my-8

                [&_.meeting-meta]:bg-muted/30
                [&_.meeting-meta]:rounded-lg
                [&_.meeting-meta]:px-6
                [&_.meeting-meta]:py-5
                [&_.meeting-meta]:mb-8
                [&_.meeting-meta]:border
                [&_.meeting-meta]:border-border/40
                [&_.meeting-meta_p]:my-0.5
                [&_.meeting-meta_p]:text-[0.85rem]
                [&_.meeting-meta_p]:leading-[1.8]
                [&_.meeting-meta_p]:text-foreground/65

                [&_.agenda-section]:mt-0
                [&_.agenda-section]:border-t
                [&_.agenda-section]:border-border/30
                [&_.agenda-section:first-of-type]:border-t-0
                [&_.agenda-section]:pt-0

                [&_.agenda-section-header]:bg-muted/30
                [&_.agenda-section-header]:mx-[-2.5rem]
                [&_.agenda-section-header]:px-10
                [&_.agenda-section-header]:py-3.5
                [&_.agenda-section-header]:border-y
                [&_.agenda-section-header]:border-border/30
                [&_.agenda-section-header_p]:my-0
                [&_.agenda-section-header_p]:text-[0.8rem]
                [&_.agenda-section-header_p]:font-bold
                [&_.agenda-section-header_p]:uppercase
                [&_.agenda-section-header_p]:tracking-[0.08em]
                [&_.agenda-section-header_p]:text-[#00357b]
                [&_.agenda-section-header_strong]:text-[#00357b]

                [&_.agenda-section-body]:py-5
                [&_.agenda-section-body]:pb-6
                [&_.agenda-section-body_>ul:first-child]:mt-0
                [&_.agenda-section-body_>ol:first-child]:mt-0
                [&_.agenda-section-body_>p:first-child]:mt-0
              "
              dangerouslySetInnerHTML={{ __html: meetings[active].html }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
