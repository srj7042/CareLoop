import type { CaseStep, Urgency } from "@/types";

export const cn = (...inputs: Array<string | undefined | null | false>): string => {
  return inputs.filter(Boolean).join(" ");
};

export const addDays = (iso: string, d: number): string => {
  const date = new Date(iso);
  date.setUTCDate(date.getUTCDate() + d);
  return date.toISOString();
};

export const addHours = (iso: string, h: number): string => {
  const date = new Date(iso);
  date.setTime(date.getTime() + h * 3600 * 1000);
  return date.toISOString();
};

export const formatRelative = (iso: string): string => {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export const formatTime = (iso: string): string => {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDate = (iso: string): string => {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDateTime = (iso: string): string => {
  return `${formatDate(iso)} at ${formatTime(iso)}`;
};

export const isOverdue = (dueAt: string): boolean => {
  return new Date(dueAt).getTime() < new Date().getTime();
};

export const formatSLADiff = (dueAt: string): { label: string; overdue: boolean; hours: number; days: number } => {
  const diff = new Date(dueAt).getTime() - new Date().getTime();
  const overdue = diff < 0;
  const absDiff = Math.abs(diff);
  const totalHours = Math.floor(absDiff / 3600000);
  const days = Math.floor(totalHours / 24);
  const remainingHours = totalHours % 24;

  let timeString = "";
  if (days > 0) {
    timeString = `${days}d ${remainingHours}h`;
  } else {
    const mins = Math.floor((absDiff % 3600000) / 60000);
    timeString = `${totalHours}h ${mins}m`;
  }

  const label = overdue ? `Overdue by ${timeString}` : `Due in ${timeString}`;
  return { label, overdue, hours: totalHours, days };
};

export const urgencyColor = (u: Urgency): string => {
  switch (u) {
    case "urgent": return "coral";
    case "high": return "amber";
    default: return "teal";
  }
};

export const statusStepColor = (s: CaseStep["status"]): string => {
  switch (s) {
    case "completed": return "mint";
    case "in-progress": return "teal";
    case "overdue": return "coral";
    case "skipped": return "muted";
    default: return "surface";
  }
};
