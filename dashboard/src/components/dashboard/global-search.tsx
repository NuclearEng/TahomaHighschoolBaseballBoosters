"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  Search,
  FileText,
  GraduationCap,
  Heart,
  Shield,
} from "lucide-react";
import type { SearchItem } from "@/lib/data/search-index";

const categoryIcons = {
  page: FileText,
  alumni: GraduationCap,
  sponsor: Heart,
  compliance: Shield,
} as const;

const categoryLabels = {
  page: "Pages",
  alumni: "Alumni",
  sponsor: "Sponsors",
  compliance: "Compliance",
} as const;

export function GlobalSearch({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const grouped = useMemo(() => {
    const map: Record<string, SearchItem[]> = {};
    for (const item of items) {
      if (!map[item.category]) map[item.category] = [];
      map[item.category].push(item);
    }
    return map;
  }, [items]);

  function handleSelect(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="h-8 gap-2 text-xs text-muted-foreground px-2.5"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-[11px]">&#8984;</span>K
        </kbd>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search Dashboard"
        description="Search pages, alumni, sponsors, and compliance items"
      >
        <CommandInput placeholder="Type to search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {(["page", "compliance", "sponsor", "alumni"] as const).map(
            (category) => {
              const categoryItems = grouped[category];
              if (!categoryItems?.length) return null;
              const Icon = categoryIcons[category];
              return (
                <CommandGroup
                  key={category}
                  heading={categoryLabels[category]}
                >
                  {categoryItems.map((item, idx) => (
                    <CommandItem
                      key={`${item.category}-${item.title}-${idx}`}
                      onSelect={() => handleSelect(item.href)}
                    >
                      <Icon className="mr-2 h-4 w-4 shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="truncate">{item.title}</span>
                        {item.subtitle && (
                          <span className="text-xs text-muted-foreground truncate">
                            {item.subtitle}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            }
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
