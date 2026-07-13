import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
  icon: LucideIcon;
  accent?: "primary" | "success" | "warning" | "info" | "destructive";
}

const accentMap: Record<NonNullable<StatCardProps["accent"]>, string> = {
  primary: "bg-primary-soft text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning-foreground",
  info: "bg-info/10 text-info",
  destructive: "bg-destructive/10 text-destructive",
};

export function StatCard({ label, value, delta, hint, icon: Icon, accent = "primary" }: StatCardProps) {
  const up = delta !== undefined && delta >= 0;
  return (
    <div className="surface-card group relative overflow-hidden rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">{value}</p>
          {(delta !== undefined || hint) && (
            <div className="mt-2 flex items-center gap-2 text-xs">
              {delta !== undefined && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium",
                    up ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
                  )}
                >
                  {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {up ? "+" : ""}{delta}%
                </span>
              )}
              {hint && <span className="text-muted-foreground">{hint}</span>}
            </div>
          )}
        </div>
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", accentMap[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
