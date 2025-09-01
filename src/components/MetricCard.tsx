import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Info } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  className?: string;
  icon?: React.ReactNode;
}

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  className,
  icon 
}: MetricCardProps) {
  return (
    <Card className={cn("bg-card border-border", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            {title}
            {icon && <Info className="h-4 w-4" />}
          </h3>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        
        <div className="space-y-2">
          <p className="text-2xl font-bold text-foreground">{value}</p>
          
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          
          {trend && (
            <div className="flex items-center gap-1">
              {trend.isPositive !== false ? (
                <TrendingUp className="h-3 w-3 text-success" />
              ) : (
                <TrendingDown className="h-3 w-3 text-destructive" />
              )}
              <span className={cn(
                "text-xs font-medium",
                trend.isPositive !== false ? "text-success" : "text-destructive"
              )}>
                {trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">
                {trend.label}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}