import * as React from "react";
import { cn } from "@/lib/utils";

export type StatusVariant =
  | "mint"
  | "lavender"
  | "amber"
  | "coral"
  | "slate"
  | "dark";

export interface StatusPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: StatusVariant;
  label: React.ReactNode;
  pulse?: boolean;
  size?: "sm" | "md";
}

export const StatusPill: React.FC<StatusPillProps> = ({
  className,
  variant = "mint",
  label,
  pulse = false,
  size = "md",
  ...props
}) => {
  const dotColors: Record<StatusVariant, string> = {
    mint: "bg-[#10B981]",
    lavender: "bg-[#8B5CF6]",
    amber: "bg-[#F59E0B]",
    coral: "bg-[#EF4444]",
    slate: "bg-[#798393]",
    dark: "bg-white",
  };

  const pillVariants: Record<StatusVariant, string> = {
    mint: "bg-[#10B981]/10 text-[#065F46] border border-[#10B981]/20",
    lavender: "bg-[#8B5CF6]/10 text-[#5B21B6] border border-[#8B5CF6]/20",
    amber: "bg-[#F59E0B]/12 text-[#92400E] border border-[#F59E0B]/25",
    coral: "bg-[#EF4444]/10 text-[#991B1B] border border-[#EF4444]/20",
    slate: "bg-white/70 text-[#1E2532] border border-white/80 shadow-2xs",
    dark: "bg-slate-900/60 backdrop-blur-md text-white border border-white/10",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1.5",
    md: "px-2.5 py-1 text-xs gap-2",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold transition-all",
        sizeClasses[size],
        pillVariants[variant],
        className
      )}
      {...props}
    >
      <span className="relative flex h-2 w-2 flex-shrink-0">
        {pulse && (
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              dotColors[variant]
            )}
          />
        )}
        <span
          className={cn("relative inline-flex rounded-full h-2 w-2", dotColors[variant])}
        />
      </span>
      <span>{label}</span>
    </span>
  );
};

