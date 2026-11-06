import * as React from "react";
import { cn } from "@/lib/utils";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string;
  subtext?: string;
  variant?: "frosted" | "lavender" | "mint" | "dark";
  size?: "sm" | "md" | "lg";
  active?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      icon,
      label,
      subtext,
      variant = "frosted",
      size = "md",
      active = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "w-9 h-9 text-xs",
      md: "w-12 h-12 text-sm",
      lg: "w-14 h-14 text-base",
    };

    const variantClasses = {
      frosted: active
        ? "bg-white text-slate-900 border-white shadow-md ring-2 ring-[#8B5CF6]/30"
        : "bg-white/80 text-[#1E2532] border-white hover:bg-white hover:shadow-md hover:text-[#1E2532] hover:border-white",
      lavender: active
        ? "bg-[#8B5CF6] text-white border-transparent shadow-md"
        : "bg-[#8B5CF6]/15 text-[#8B5CF6] border-[#8B5CF6]/20 hover:bg-[#8B5CF6] hover:text-white hover:border-[#8B5CF6] hover:shadow-md hover:shadow-[#8B5CF6]/20",
      mint: active
        ? "bg-[#10B981] text-white border-transparent shadow-md"
        : "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/20 hover:bg-[#10B981] hover:text-white hover:border-[#10B981] hover:shadow-md hover:shadow-[#10B981]/20",
      dark: active
        ? "bg-slate-900 text-white border-slate-800 shadow-md"
        : "bg-slate-900/60 backdrop-blur-md text-white border-white/20 hover:bg-slate-900 hover:border-white/40 hover:shadow-md hover:shadow-black/20",
    };

    const buttonElement = (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "rounded-full border backdrop-blur-md shadow-sm flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 hover:shadow-md active:translate-y-0 active:scale-95 group-hover:-translate-y-1 group-hover:shadow-md will-change-transform",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        aria-label={label || subtext || undefined}
        {...props}
      >
        {icon}
      </button>
    );

    if (label || subtext) {
      return (
        <div className="flex flex-col items-center gap-1.5 text-center group cursor-pointer transition-transform duration-200 hover:-translate-y-0.5">
          {buttonElement}
          {label && (
            <span className="text-xs font-semibold text-[#1E2532] group-hover:text-slate-900 transition-colors">
              {label}
            </span>
          )}
          {subtext && (
            <span className="text-[11px] text-[#798393] font-medium leading-none group-hover:text-[#1E2532] transition-colors">
              {subtext}
            </span>
          )}
        </div>
      );
    }

    return buttonElement;
  }
);

IconButton.displayName = "IconButton";
