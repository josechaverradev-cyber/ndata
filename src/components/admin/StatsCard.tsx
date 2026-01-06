import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: "primary" | "accent" | "info" | "warning";
}

const iconColorClasses = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  info: "bg-info/10 text-info",
  warning: "bg-warning/10 text-warning",
};

export function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon: Icon,
  iconColor = "primary" 
}: StatsCardProps) {
  return (
    <div className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {change && (
            <p className={cn(
              "text-sm font-medium",
              changeType === "positive" && "text-success",
              changeType === "negative" && "text-destructive",
              changeType === "neutral" && "text-muted-foreground"
            )}>
              {changeType === "positive" && "↑ "}
              {changeType === "negative" && "↓ "}
              {change}
            </p>
          )}
        </div>
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
          iconColorClasses[iconColor]
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
