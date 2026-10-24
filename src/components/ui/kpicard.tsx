import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";

type KPICardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: { label: string; up: boolean };
  variant?: "default" | "mint" | "teal" | "amber" | "coral";
  className?: string;
  onClick?: () => void;
};

const variantStyles: Record<
  string,
  { bg: string; border: string; text: string; iconBg: string; iconColor: string }
> = {
  default: {
    bg: "bg-surface-card",
    border: "border-surface-border",
    text: "text-teal-deep",
    iconBg: "bg-teal-brand/10",
    iconColor: "text-teal-brand",
  },
  mint: {
    bg: "bg-mint-wash/70",
    border: "border-mint-light/60",
    text: "text-teal-deep",
    iconBg: "bg-white",
    iconColor: "text-teal-brand",
  },
  teal: {
    bg: "bg-teal-brand/5",
    border: "border-teal-brand/30",
    text: "text-teal-deep",
    iconBg: "bg-teal-brand/10",
    iconColor: "text-teal-brand",
  },
  amber: {
    bg: "bg-amber/10",
    border: "border-amber/30",
    text: "text-[#8C5D00]",
    iconBg: "bg-white",
    iconColor: "text-amber",
  },
  coral: {
    bg: "bg-coral/10",
    border: "border-coral/30",
    text: "text-coral",
    iconBg: "bg-white",
    iconColor: "text-coral",
  },
};

export const KPICard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className = "",
  onClick,
}: KPICardProps) => {
  const style = variantStyles[variant] || variantStyles.default;

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-card border ${style.bg} ${style.border} transition-all duration-200 hover:shadow-xs ${
        onClick ? "cursor-pointer hover:border-teal-brand/50" : ""
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl font-bold tracking-tight ${style.text}`}>{value}</span>
            {subtitle && <span className="text-xs text-muted font-medium">{subtitle}</span>}
          </div>
          {trend && (
            <p className="text-[11px] font-semibold flex items-center gap-1 pt-0.5">
              {trend.up ? (
                <TrendingUp size={13} className="text-teal-brand" />
              ) : (
                <TrendingDown size={13} className="text-coral" />
              )}
              <span className={trend.up ? "text-teal-brand" : "text-coral"}>{trend.label}</span>
            </p>
          )}
        </div>

        {Icon && (
          <div className={`w-9 h-9 rounded-xl ${style.iconBg} ${style.iconColor} flex items-center justify-center flex-shrink-0 shadow-2xs`}>
            <Icon size={18} strokeWidth={2.5} />
          </div>
        )}
      </div>
    </div>
  );
};
