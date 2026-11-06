import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "ghost" | "link" | "mint";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default:
        "bg-[#1E2532] text-white hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 hover:border-transparent",
      destructive:
        "bg-coral text-white hover:bg-coral/90 hover:shadow-lg hover:shadow-coral/20",
      outline:
        "border border-white/80 bg-white/80 text-[#1E2532] hover:bg-white hover:border-white hover:shadow-md",
      ghost:
        "text-[#1E2532] hover:bg-white/80 hover:text-slate-900 hover:shadow-xs",
      link:
        "text-teal-brand underline-offset-4 hover:underline hover:text-teal-hover",
      mint:
        "bg-mint-light text-teal-deep hover:bg-teal-brand hover:text-white hover:shadow-md",
    };
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3 text-sm",
      lg: "h-12 px-8 text-lg",
    };
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-card font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-brand disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 hover:shadow-md active:translate-y-0 active:scale-[0.98] will-change-transform",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
