import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { urgencyColor, statusStepColor, formatSLADiff } from "@/lib/utils";
import type { Urgency, CaseStep, SideState, Role } from "@/types";
import { Clock, AlertTriangle, Users, CheckCircle2, ShieldAlert } from "lucide-react";

export const StatusChip = ({ urgency }: { urgency: Urgency }) => {
  const color = urgencyColor(urgency);
  const label = urgency.charAt(0).toUpperCase() + urgency.slice(1);
  return (
    <Badge variant={color as any} className="font-semibold text-xs capitalize">
      {urgency === "urgent" && <AlertTriangle size={12} className="inline mr-1" />}
      {label}
    </Badge>
  );
};

export const StepStatusChip = ({ status }: { status: CaseStep["status"] }) => {
  const color = statusStepColor(status);
  const labels: Record<string, string> = {
    "not-started": "Not Started",
    "in-progress": "In Progress",
    completed: "Done ✓",
    overdue: "Overdue",
    skipped: "Skipped",
  };
  return <Badge variant={color as any}>{labels[status] || status}</Badge>;
};

export const SideStateBadge = ({ sideState }: { sideState: SideState }) => {
  if (!sideState) return null;

  const config: Record<
    string,
    { label: string; variant: "coral" | "amber" | "mint" | "surface"; icon: React.ElementType }
  > = {
    overdue: { label: "Overdue SLA", variant: "coral", icon: Clock },
    rejected: { label: "Referral Rejected", variant: "coral", icon: AlertTriangle },
    unassigned: { label: "Awaiting Assignment", variant: "amber", icon: Users },
    escalated: { label: "Escalated", variant: "coral", icon: ShieldAlert },
    "lost-to-follow-up": { label: "Lost to Follow-up", variant: "amber", icon: AlertTriangle },
    "patient-declined": { label: "Patient Declined", variant: "amber", icon: AlertTriangle },
  };

  const item = config[sideState] || { label: sideState, variant: "amber", icon: AlertTriangle };
  const Icon = item.icon;

  return (
    <Badge variant={item.variant} className="flex items-center gap-1.5 font-medium text-xs">
      <Icon size={12} strokeWidth={2.5} />
      <span>{item.label}</span>
    </Badge>
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
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-surface-border bg-white text-xs text-body shadow-xs">
      <span
        className={`w-2 h-2 rounded-full ${
          isQueue || role === "triage-queue" ? "bg-amber" : "bg-teal-brand"
        }`}
      />
      <span className="font-semibold text-teal-deep">{owner}</span>
      {role && (
        <span className="text-[11px] text-muted border-l border-surface-border pl-1.5">
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
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-tight border ${
        overdue
          ? "bg-coral/10 text-coral border-coral/30"
          : "bg-amber/15 text-[#9C6B00] border-amber/40"
      } ${className || ""}`}
    >
      <Clock size={11} strokeWidth={2.5} />
      <span>{label}</span>
    </span>
  );
};
