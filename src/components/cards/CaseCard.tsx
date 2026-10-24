import { Link } from "react-router-dom";
import { AlertCircle, Clock, User, Mail, CheckCircle2 } from "lucide-react";
import { StatusChip, SLATimer, OwnerBadge } from "@/components/ui/chips";
import type { Case } from "@/types";
import { isOverdue } from "@/lib/utils";

const iconByType: Record<string, React.ElementType> = {
  "Mammogram": Mail,
  "HbA1c (Diabetes)": AlertCircle,
  "Blood Pressure": Clock,
  "FIT / Colon Cancer": AlertCircle,
  "Pap Smear": User,
  "Newborn Hearing Screen": User,
  "Lipid Panel": Clock,
  "Lung Nodule CT": AlertCircle,
};

export const CaseCard = ({ c }: { c: Case }) => {
  const overdue = isOverdue(c.nextActionDue);
  const Icon = iconByType[c.screeningType] || Mail;
  const completedSteps = c.steps.filter((s) => s.status === "completed").length;
  const totalSteps = c.steps.length;
  const progress = totalSteps ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const sideVariant: Record<string, string> = {
    overdue: "coral",
    rejected: "coral",
    unassigned: "amber",
    escalated: "coral",
    "lost-to-follow-up": "amber",
    "patient-declined": "amber",
  };

  return (
    <Link to={`/case/${c.id}`} className="group block">
      <div className="border border-surface-border rounded-card bg-surface-card p-5 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Icon size={16} strokeWidth={2} className="text-muted" />
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">{c.screeningType}</span>
              {c.sideState && (
                <span className={`ml-auto text-xs font-bold border px-2 py-0.5 rounded ${sideVariant[c.sideState]}`}>
                  {c.sideState.replace("-", " ")}
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-teal-deep leading-tight">{c.patientName}</h3>
            <p className="text-sm text-muted truncate">{c.resultInterpretation}</p>
            <div className="mt-3 flex items-center gap-3 text-sm">
              <span className="font-medium text-body">{c.resultValue}</span>
              <StatusChip urgency={c.urgency} />
            </div>
          </div>
          <div className="mt-3 md:mt-0 flex flex-col items-end gap-2">
            <div className="text-right">
              <div className="text-xs font-bold text-teal-deep">{progress}%</div>
              <div className="w-full h-1.5 bg-surface-border rounded-full overflow-hidden">
                <div className="h-full bg-teal-brand" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-medium text-muted">{c.currentOwner}</div>
              <SLATimer dueAt={c.nextActionDue} />
            </div>
          </div>
        </div>
        {c.sideState && (
          <div className="mt-4 flex items-center gap-2 text-xs">
            <AlertCircle size={14} strokeWidth={2} className="text-coral" />
            <span className="text-coral/90 font-medium">{c.nextAction}</span>
          </div>
        )}
      </div>
    </Link>
  );
};
