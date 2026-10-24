import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "ghost" | "link" | "mint";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default: "bg-teal-deep text-white hover:bg-teal-brand",
      destructive: "bg-coral text-white hover:bg-coral/90",
      outline: "border border-surface-border bg-surface-card hover:bg-mint-wash",
      ghost: "hover:bg-mint-wash",
      link: "text-teal-brand underline-offset-4 hover:underline",
      mint: "bg-mint-light text-teal-deep hover:bg-teal-brand hover:text-white",
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
          "inline-flex items-center justify-center rounded-card font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-brand disabled:pointer-events-none disabled:opacity-50",
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
