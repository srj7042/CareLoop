import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "mint" | "teal" | "coral" | "amber" | "gray" | "surface";
}

const variants = {
  default: "bg-teal-brand/10 text-teal-brand border border-teal-brand/20",
  mint: "bg-mint-wash text-teal-deep border border-mint-light/30",
  teal: "bg-teal-brand/10 text-teal-brand border border-teal-brand/20",
  coral: "bg-coral/10 text-coral border border-coral/20",
  amber: "bg-amber/10 text-amber/90 border border-amber/30",
  gray: "bg-muted/10 text-muted border border-muted/20",
  surface: "bg-surface-border text-body/60 border border-surface-border",
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({ className, variant = "default", ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-pill border px-2.5 py-0.5 text-xs font-medium leading-none transition-colors",
      variants[variant],
      className
    )}
    {...props}
  />
));
Badge.displayName = "Badge";

export { Badge };
