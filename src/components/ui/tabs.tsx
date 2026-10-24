import * as React from "react";
import { cn } from "@/lib/utils";

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface TabsTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(({ children, ...props }, ref) => (
  <div ref={ref} {...props} />
));
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("inline-flex h-10 items-center justify-center rounded-card border border-surface-border bg-surface-card p-1 text-muted", className)}
    {...props}
  />
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(({ className, value, ...props }, ref) => {
  const [selected, setSelected] = React.useState(false);
  React.useEffect(() => {
    setSelected(true);
  }, []);
  if (!selected) return null;
  return (
    <button
      ref={ref}
      className={cn(
        "rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-teal-brand focus:ring-offset-2",
        className
      )}
      aria-selected={false}
      {...props}
    />
  );
});
TabsTrigger.displayName = "TabsTrigger";

export { Tabs, TabsList, TabsTrigger };
