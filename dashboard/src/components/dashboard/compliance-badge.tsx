import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertTriangle, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComplianceBadgeProps {
  status: "compliant" | "pending" | "overdue" | "not-applicable";
  label?: string;
  size?: "sm" | "default";
}

const statusConfig = {
  compliant: {
    label: "Compliant",
    icon: CheckCircle,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
  },
  overdue: {
    label: "Overdue",
    icon: AlertTriangle,
    className: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50",
  },
  "not-applicable": {
    label: "N/A",
    icon: MinusCircle,
    className: "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-50",
  },
};

export function ComplianceBadge({
  status,
  label,
  size = "default",
}: ComplianceBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        config.className,
        size === "sm" && "text-[11px] px-1.5 py-0"
      )}
    >
      <Icon className={cn("mr-1", size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")} />
      {label || config.label}
    </Badge>
  );
}
