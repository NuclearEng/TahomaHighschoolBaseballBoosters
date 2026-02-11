import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { PasswordGate } from "@/components/dashboard/password-gate";
import { GlobalSearch } from "@/components/dashboard/global-search";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { PrintButton } from "@/components/dashboard/print-button";
import { NotificationBanner } from "@/components/dashboard/notification-banner";
import { buildSearchIndex } from "@/lib/data/search-index";
import { getNotifications } from "@/lib/data/notifications";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tahoma Bears Baseball Boosters — Dashboard",
  description: "Consolidated board dashboard for Tahoma HS Baseball Boosters operations, financials, and governance.",
  icons: {
    icon: "/TahomaHighschoolBaseballBoosters/favicon.jpg",
    apple: "/TahomaHighschoolBaseballBoosters/favicon.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchItems = buildSearchIndex();
  const notifications = getNotifications();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PasswordGate>
          <TooltipProvider>
            <SidebarProvider>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-[#00357b] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg"
              >
                Skip to main content
              </a>
              <AppSidebar notificationCount={notifications.length} />
              <SidebarInset>
                <header className="flex h-14 items-center gap-2 border-b bg-white dark:bg-[#111827] dark:border-[#1e293b] px-4 sm:px-6 no-print">
                  <SidebarTrigger className="-ml-2" />
                  <Separator orientation="vertical" className="h-6" />
                  <div className="flex items-center gap-2 text-sm min-w-0 flex-1">
                    <span className="font-semibold text-[#00357b] dark:text-blue-400 truncate">Tahoma Bears Baseball Boosters</span>
                    <span className="text-muted-foreground hidden sm:inline">|</span>
                    <span className="text-muted-foreground hidden sm:inline">Board Dashboard</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GlobalSearch items={searchItems} />
                    <PrintButton />
                    <ThemeToggle />
                  </div>
                </header>
                <NotificationBanner notifications={notifications} />
                <main id="main-content" className="flex-1 overflow-auto p-4 sm:p-6">
                  {children}
                </main>
              </SidebarInset>
            </SidebarProvider>
          </TooltipProvider>
        </PasswordGate>
      </body>
    </html>
  );
}
