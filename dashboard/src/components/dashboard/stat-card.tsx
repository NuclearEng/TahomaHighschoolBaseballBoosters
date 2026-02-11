import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: { value: number; label: string };
  icon?: LucideIcon;
  variant?: "default" | "success" | "warning" | "danger";
}

const variantStyles = {
  default: "border-l-4 border-l-[#00357b]",
  success: "border-l-4 border-l-emerald",
  warning: "border-l-4 border-l-[#FFCB1E]",
  danger: "border-l-4 border-l-rose",
};

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  variant = "default",
}: StatCardProps) {
  return (
    <Card className={cn("relative overflow-hidden", variantStyles[variant])}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tabular-nums tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {Icon && (
            <div className="rounded-lg bg-muted p-2">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
        </div>
        {trend && (
          <div className="mt-3 flex items-center gap-1 text-xs">
            {trend.value > 0 ? (
              <ArrowUp className="h-3 w-3 text-emerald" />
            ) : trend.value < 0 ? (
              <ArrowDown className="h-3 w-3 text-rose" />
            ) : (
              <Minus className="h-3 w-3 text-muted-foreground" />
            )}
            <span
              className={cn(
                "font-medium",
                trend.value > 0
                  ? "text-emerald"
                  : trend.value < 0
                  ? "text-rose"
                  : "text-muted-foreground"
              )}
            >
              {Math.abs(trend.value).toFixed(1)}%
            </span>
            <span className="text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
