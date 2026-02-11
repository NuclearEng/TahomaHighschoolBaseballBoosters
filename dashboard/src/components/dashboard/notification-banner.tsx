"use client";

import { useState, useEffect } from "react";
import { X, AlertTriangle, Bell } from "lucide-react";
import Link from "next/link";
import type { Notification } from "@/lib/data/notifications";

export function NotificationBanner({
  notifications,
}: {
  notifications: Notification[];
}) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("dismissed_notifications");
      if (stored) {
        setDismissed(new Set(JSON.parse(stored)));
      }
    } catch {
      // ignore
    }
  }, []);

  function dismiss(id: string) {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(id);
      sessionStorage.setItem(
        "dismissed_notifications",
        JSON.stringify([...next])
      );
      return next;
    });
  }

  const visible = notifications.filter((n) => !dismissed.has(n.id));

  if (visible.length === 0) return null;

  return (
    <div className="space-y-0 no-print" role="region" aria-label="Notifications">
      {visible.map((n) => {
        const isUrgent = n.severity === "urgent";
        return (
          <div
            key={n.id}
            className={`flex items-center gap-3 px-4 sm:px-6 py-2 text-sm ${
              isUrgent
                ? "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200"
                : "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
            }`}
          >
            {isUrgent ? (
              <AlertTriangle className="h-4 w-4 shrink-0" />
            ) : (
              <Bell className="h-4 w-4 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <Link
                href={n.href}
                className="font-medium hover:underline"
              >
                {n.title}
              </Link>
              <span className="hidden sm:inline text-xs ml-2 opacity-75">
                {n.description}
              </span>
            </div>
            <button
              onClick={() => dismiss(n.id)}
              className="shrink-0 flex items-center justify-center rounded h-6 w-6 hover:bg-black/10 transition-colors"
              aria-label={`Dismiss: ${n.title}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
