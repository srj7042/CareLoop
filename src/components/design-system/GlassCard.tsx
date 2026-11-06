import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "solid" | "subtle" | "dark";
  interactive?: boolean;
  noHover?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      variant = "default",
      interactive = false,
      noHover = false,
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default:
        "bg-white/80 backdrop-blur-md border border-white/80 shadow-[0_12px_32px_rgba(100,115,140,0.06)] text-[#1E2532]",
      solid:
        "bg-white/95 backdrop-blur-md border border-white/90 shadow-[0_12px_32px_rgba(100,115,140,0.08)] text-[#1E2532]",
      subtle:
        "bg-white/60 backdrop-blur-sm border border-white/60 shadow-[0_8px_24px_rgba(100,115,140,0.04)] text-[#1E2532]",
      dark:
        "bg-slate-900/60 backdrop-blur-md border border-white/10 text-white shadow-[0_12px_32px_rgba(0,0,0,0.15)]",
    };

    const hoverVariantStyles = {
      default:
        "hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(100,115,140,0.12)] hover:border-white hover:bg-white/90",
      solid:
        "hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(100,115,140,0.14)] hover:border-white hover:bg-white",
      subtle:
        "hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(100,115,140,0.08)] hover:border-white/80 hover:bg-white/75",
      dark:
        "hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.30)] hover:border-white/30 hover:bg-slate-900/75",
    };

    const hoverStyles = noHover
      ? ""
      : cn("transition-all duration-300 ease-out will-change-transform", hoverVariantStyles[variant]);

    const interactiveStyles = interactive ? "cursor-pointer" : "";

    return (
      <div
        ref={ref}
        data-card="glass"
        className={cn(
          "rounded-[26px] p-6 relative overflow-hidden",
          variantStyles[variant],
          hoverStyles,
          interactiveStyles,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";
