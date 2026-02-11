"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  DollarSign,
  FileText,
  Users,
  Shield,
  ClipboardList,
  Shirt,
  HandHelping,
  Calendar,
  BookOpen,
  ScrollText,
  FileCheck,
  Globe,
  Heart,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const navigation = [
  {
    label: "Overview",
    items: [
      { name: "Executive Summary", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    label: "Financial",
    items: [
      {
        name: "Financials",
        href: "/financials",
        icon: DollarSign,
        children: [
          { name: "Budget Detail", href: "/financials/budget" },
          { name: "Transactions", href: "/financials/transactions" },
          { name: "Coach's Fund", href: "/financials/coaches-fund" },
        ],
      },
      {
        name: "Fundraising",
        href: "/fundraising",
        icon: TrendingUp,
        children: [
          { name: "AI Insights", href: "/fundraising/insights" },
        ],
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        name: "Operations",
        href: "/operations",
        icon: ClipboardList,
        children: [
          { name: "Rosters", href: "/operations/rosters" },
          { name: "Uniforms", href: "/operations/uniforms" },
          { name: "Volunteers", href: "/operations/volunteers" },
          { name: "Events", href: "/operations/events" },
        ],
      },
    ],
  },
  {
    label: "Governance",
    items: [
      {
        name: "Governance",
        href: "/governance",
        icon: Shield,
        children: [
          { name: "Bylaws", href: "/governance/bylaws" },
          { name: "Board Meetings", href: "/governance/agendas" },
        ],
      },
      { name: "Compliance", href: "/compliance", icon: FileCheck },
      { name: "Program", href: "/program", icon: Globe },
      { name: "Sponsorships", href: "/sponsorships", icon: Heart },
    ],
  },
];

export function AppSidebar({ notificationCount = 0 }: { notificationCount?: number }) {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-4 pb-2">
        <Link href="/" className="flex items-center gap-3 min-w-0">
          <img
            src="/TahomaHighschoolBaseballBoosters/favicon.jpg"
            alt="Tahoma Bears"
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold text-sidebar-foreground">
              Tahoma Bears
            </span>
            <span className="truncate text-xs text-sidebar-foreground/60">
              Baseball Boosters
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {navigation.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-sidebar-foreground/60 uppercase text-[11px] tracking-wider">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  const hasChildren = "children" in item && item.children;
                  const isChildActive = hasChildren
                    ? item.children.some((c) => pathname === c.href)
                    : false;

                  if (hasChildren) {
                    return (
                      <Collapsible
                        key={item.name}
                        defaultOpen={isActive || isChildActive}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              isActive={isActive}
                              className="w-full"
                            >
                              <Icon className="h-4 w-4" />
                              <span>{item.name}</span>
                              <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.children.map((child) => (
                                <SidebarMenuSubItem key={child.href}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={pathname === child.href}
                                  >
                                    <Link href={child.href}>{child.name}</Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }

                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.href}>
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                          {item.name === "Compliance" && notificationCount > 0 && (
                            <Badge className="ml-auto bg-amber-500 text-[10px] px-1.5 py-0 min-w-[1.25rem] text-center">
                              {notificationCount}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 pt-2">
        <div className="text-[11px] text-sidebar-foreground/60">
          <div>Tahoma High School</div>
          <div>Maple Valley, WA 98038</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
