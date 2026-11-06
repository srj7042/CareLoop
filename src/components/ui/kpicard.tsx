import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";

type KPICardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: { label: string; up: boolean };
  variant?: "default" | "mint" | "teal" | "amber" | "coral" | "lavender";
  className?: string;
  onClick?: () => void;
};

const variantStyles: Record<
  string,
  { bg: string; border: string; text: string; iconBg: string; iconColor: string }
> = {
  default: {
    bg: "bg-white/80 backdrop-blur-md",
    border: "border-white/80",
    text: "text-[#1E2532]",
    iconBg: "bg-slate-100",
    iconColor: "text-[#1E2532]",
  },
  mint: {
    bg: "bg-white/80 backdrop-blur-md",
    border: "border-white/80",
    text: "text-[#1E2532]",
    iconBg: "bg-[#10B981]/15",
    iconColor: "text-[#10B981]",
  },
  teal: {
    bg: "bg-white/80 backdrop-blur-md",
    border: "border-white/80",
    text: "text-[#1E2532]",
    iconBg: "bg-[#10B981]/15",
    iconColor: "text-[#10B981]",
  },
  lavender: {
    bg: "bg-white/80 backdrop-blur-md",
    border: "border-white/80",
    text: "text-[#1E2532]",
    iconBg: "bg-[#8B5CF6]/15",
    iconColor: "text-[#8B5CF6]",
  },
  amber: {
    bg: "bg-white/80 backdrop-blur-md",
    border: "border-white/80",
    text: "text-[#1E2532]",
    iconBg: "bg-amber-500/15",
    iconColor: "text-[#F59E0B]",
  },
  coral: {
    bg: "bg-white/80 backdrop-blur-md",
    border: "border-white/80",
    text: "text-[#1E2532]",
    iconBg: "bg-rose-500/15",
    iconColor: "text-[#EF4444]",
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
      data-card="kpi"
      className={`p-5 rounded-[26px] border ${style.bg} ${style.border} shadow-[0_12px_32px_rgba(100,115,140,0.06)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(100,115,140,0.12)] hover:border-white hover:bg-white/90 will-change-transform cursor-pointer ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-[#798393] uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold tracking-tight ${style.text}`}>{value}</span>
            {subtitle && <span className="text-xs text-[#798393] font-medium">{subtitle}</span>}
          </div>
          {trend && (
            <p className="text-[11px] font-semibold flex items-center gap-1 pt-1">
              {trend.up ? (
                <TrendingUp size={13} className="text-[#10B981]" />
              ) : (
                <TrendingDown size={13} className="text-[#EF4444]" />
              )}
              <span className={trend.up ? "text-[#10B981]" : "text-[#EF4444]"}>{trend.label}</span>
            </p>
          )}
        </div>

        {Icon && (
          <div className={`w-10 h-10 rounded-2xl ${style.iconBg} ${style.iconColor} flex items-center justify-center flex-shrink-0 shadow-2xs transition-transform duration-200 group-hover:scale-105`}>
            <Icon size={18} strokeWidth={2} />
          </div>
        )}
      </div>
    </div>
  );
};
