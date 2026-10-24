import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  className?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, children, ...props }, ref) => (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="text-sm font-medium text-body/80 mb-1 block">{label}</label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-card border border-surface-border bg-surface-card px-3 py-2 pr-10 text-body shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-brand disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -mt-1.5 text-muted pointer-events-none" />
      </div>
    </div>
  )
);
Select.displayName = "Select";

export { Select };
