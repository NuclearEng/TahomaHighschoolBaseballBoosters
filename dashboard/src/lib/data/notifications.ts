export interface Notification {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: "warning" | "urgent";
  href: string;
}

interface Deadline {
  task: string;
  date: string; // e.g., "June 2026"
  category: string;
}

const upcomingDeadlines: Deadline[] = [
  { task: "Annual Financial Review/Audit", date: "June 2026", category: "Financial" },
  { task: "Officer Elections at Annual Meeting", date: "June 2026", category: "Governance" },
  { task: "Budget Approval by Membership", date: "July 2026", category: "Financial" },
  { task: "WA SOS Annual Report Filing", date: "September 2026", category: "State" },
  { task: "IRS 990N (e-Postcard) Filing", date: "November 2026", category: "IRS" },
  { task: "Insurance Policy Renewal", date: "January 2027", category: "Insurance" },
];

function parseDeadlineDate(dateStr: string): Date {
  // Handles "June 2026", "January 2027", etc.
  const parts = dateStr.split(" ");
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const monthIdx = monthNames.indexOf(parts[0]);
  const year = parseInt(parts[1], 10);
  // Use the last day of the month as the deadline
  if (monthIdx >= 0 && !isNaN(year)) {
    return new Date(year, monthIdx + 1, 0);
  }
  return new Date(year, 0, 1);
}

export function getNotifications(): Notification[] {
  const now = new Date();
  const notifications: Notification[] = [];

  for (const deadline of upcomingDeadlines) {
    const dueDate = parseDeadlineDate(deadline.date);
    const daysUntil = Math.ceil(
      (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntil < 0) {
      notifications.push({
        id: `overdue-${deadline.task}`,
        title: `OVERDUE: ${deadline.task}`,
        description: `Was due ${deadline.date} — ${Math.abs(daysUntil)} days overdue`,
        category: deadline.category,
        severity: "urgent",
        href: "/compliance",
      });
    } else if (daysUntil <= 30) {
      notifications.push({
        id: `urgent-${deadline.task}`,
        title: deadline.task,
        description: `Due ${deadline.date} — ${daysUntil} days remaining`,
        category: deadline.category,
        severity: "urgent",
        href: "/compliance",
      });
    } else if (daysUntil <= 60) {
      notifications.push({
        id: `warning-${deadline.task}`,
        title: deadline.task,
        description: `Due ${deadline.date} — ${daysUntil} days remaining`,
        category: deadline.category,
        severity: "warning",
        href: "/compliance",
      });
    }
  }

  return notifications;
}
