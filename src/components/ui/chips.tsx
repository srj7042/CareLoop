import * as React from "react";
import { formatSLADiff } from "@/lib/utils";
import type { Urgency, CaseStep, SideState, Role } from "@/types";
import { Clock, AlertTriangle, Users, CheckCircle2, ShieldAlert } from "lucide-react";

export const StatusChip = ({ urgency }: { urgency: Urgency }) => {
  const configs: Record<Urgency, { label: string; dot: string; bg: string; text: string; border: string }> = {
    urgent: {
      label: "Urgent",
      dot: "bg-[#EF4444]",
      bg: "bg-rose-50/80",
      text: "text-rose-700",
      border: "border-rose-200/80",
    },
    high: {
      label: "High",
      dot: "bg-[#F59E0B]",
      bg: "bg-amber-50/80",
      text: "text-amber-800",
      border: "border-amber-200/80",
    },
    routine: {
      label: "Routine",
      dot: "bg-[#10B981]",
      bg: "bg-emerald-50/80",
      text: "text-emerald-800",
      border: "border-emerald-200/80",
    },
  };

  const item = configs[urgency] || configs.routine;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-tight border backdrop-blur-xs ${item.bg} ${item.text} ${item.border} shadow-2xs`}
    >
      <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
        {urgency === "urgent" && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${item.dot}`} />
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${item.dot}`} />
      </span>
      <span>{item.label}</span>
    </span>
  );
};

export const StepStatusChip = ({ status }: { status: CaseStep["status"] }) => {
  const configs: Record<string, { label: string; dot: string; bg: string }> = {
    "not-started": { label: "Not Started", dot: "bg-[#798393]", bg: "bg-white/70 text-[#798393] border-white/80" },
    "in-progress": { label: "In Progress", dot: "bg-[#8B5CF6]", bg: "bg-[#8B5CF6]/10 text-[#5B21B6] border-[#8B5CF6]/20" },
    completed: { label: "Done ✓", dot: "bg-[#10B981]", bg: "bg-[#10B981]/10 text-[#065F46] border-[#10B981]/20" },
    overdue: { label: "Overdue", dot: "bg-[#EF4444]", bg: "bg-rose-50/80 text-rose-700 border-rose-200" },
    skipped: { label: "Skipped", dot: "bg-[#798393]", bg: "bg-white/60 text-[#798393] border-white/60" },
  };

  const item = configs[status] || configs["not-started"];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-tight border backdrop-blur-xs shadow-2xs ${item.bg}`}
    >
      <span className={`inline-flex rounded-full h-1.5 w-1.5 ${item.dot}`} />
      <span>{item.label}</span>
    </span>
  );
};

export const SideStateBadge = ({ sideState }: { sideState: SideState }) => {
  if (!sideState) return null;

  const config: Record<
    string,
    { label: string; dot: string; bg: string; text: string; border: string; icon: React.ElementType }
  > = {
    overdue: { label: "Overdue SLA", dot: "bg-[#EF4444]", bg: "bg-rose-50/90", text: "text-rose-700", border: "border-rose-200", icon: Clock },
    rejected: { label: "Referral Rejected", dot: "bg-[#EF4444]", bg: "bg-rose-50/90", text: "text-rose-700", border: "border-rose-200", icon: AlertTriangle },
    unassigned: { label: "Awaiting Assignment", dot: "bg-[#F59E0B]", bg: "bg-amber-50/90", text: "text-amber-800", border: "border-amber-200", icon: Users },
    escalated: { label: "Escalated", dot: "bg-[#8B5CF6]", bg: "bg-[#8B5CF6]/10", text: "text-[#5B21B6]", border: "border-[#8B5CF6]/25", icon: ShieldAlert },
    "lost-to-follow-up": { label: "Lost to Follow-up", dot: "bg-[#F59E0B]", bg: "bg-amber-50/90", text: "text-amber-800", border: "border-amber-200", icon: AlertTriangle },
    "patient-declined": { label: "Patient Declined", dot: "bg-[#F59E0B]", bg: "bg-amber-50/90", text: "text-amber-800", border: "border-amber-200", icon: AlertTriangle },
  };

  const item = config[sideState] || { label: sideState, dot: "bg-[#F59E0B]", bg: "bg-amber-50/90", text: "text-amber-800", border: "border-amber-200", icon: AlertTriangle };
  const Icon = item.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border backdrop-blur-xs shadow-2xs ${item.bg} ${item.text} ${item.border}`}
    >
      <Icon size={12} strokeWidth={2} />
      <span>{item.label}</span>
    </span>
  );
};

export const OwnerBadge = ({
  owner,
  role,
  isQueue,
}: {
  owner: string;
  role?: Role | "triage-queue";
  isQueue?: boolean;
}) => {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/80 bg-white/85 text-xs text-[#1E2532] shadow-2xs backdrop-blur-xs">
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isQueue || role === "triage-queue" ? "bg-[#F59E0B]" : "bg-[#10B981]"
        }`}
      />
      <span className="font-semibold text-[#1E2532]">{owner}</span>
      {role && (
        <span className="text-[10px] text-[#798393] border-l border-slate-200/80 pl-1.5 font-medium">
          {role === "triage-queue" ? "Queue" : role}
        </span>
      )}
    </div>
  );
};

export const SLATimer = ({
  dueAt,
  className,
}: {
  dueAt?: string;
  className?: string;
}) => {
  if (!dueAt) return null;
  const { label, overdue } = formatSLADiff(dueAt);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-tight border backdrop-blur-xs shadow-2xs ${
        overdue
          ? "bg-rose-50/90 text-rose-700 border-rose-200/80"
          : "bg-amber-50/80 text-amber-800 border-amber-200/80"
      } ${className || ""}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${overdue ? "bg-[#EF4444]" : "bg-[#F59E0B]"}`} />
      <Clock size={11} strokeWidth={2} />
      <span>{label}</span>
    </span>
  );
};
