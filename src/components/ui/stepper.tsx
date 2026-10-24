import * as React from "react";
import {
  CheckCircle2,
  Clock,
  User,
  AlertTriangle,
  FileText,
  Send,
  Calendar,
  Check,
  Stethoscope,
  Sparkles,
} from "lucide-react";
import type { CaseStep, Role } from "@/types";
import { formatDate } from "@/lib/utils";

const stepIcons: Record<string, React.ElementType> = {
  issued: FileText,
  notified: Send,
  acknowledged: Check,
  confirmation: Stethoscope,
  referral: Send,
  accepted: CheckCircle2,
  booked: Calendar,
  attended: User,
  treatment: Sparkles,
  closed: CheckCircle2,
};

export const CaseStepper = ({
  steps,
  currentStepIndex,
  onStepClick,
}: {
  steps: CaseStep[];
  currentStepIndex?: number;
  onStepClick?: (step: CaseStep, index: number) => void;
}) => {
  return (
    <div className="w-full overflow-x-auto py-2">
      <div className="flex items-start min-w-[760px] justify-between relative px-4">
        {/* Continuous Connecting Line Background */}
        <div className="absolute top-5 left-10 right-10 h-1 bg-surface-border -z-0" />

        {steps.map((step, index) => {
          const isCompleted = step.status === "completed";
          const isOverdue = step.status === "overdue";
          const isSkipped = step.status === "skipped";
          const isActive =
            step.status === "in-progress" ||
            (index === currentStepIndex && !isCompleted && !isSkipped);
          const Icon = stepIcons[step.key] || Clock;
          const isLast = index === steps.length - 1;

          return (
            <div
              key={step.key}
              onClick={() => onStepClick && onStepClick(step, index)}
              className={`flex-1 flex flex-col items-center group relative z-10 cursor-pointer ${
                isSkipped ? "opacity-45" : ""
              }`}
            >
              {/* Connector filled segment for completed steps */}
              {!isLast && isCompleted && (
                <div className="absolute top-5 left-1/2 w-full h-1 bg-teal-brand -z-10" />
              )}

              {/* Step Circle Node */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-xs ${
                  isCompleted
                    ? "bg-teal-brand border-teal-brand text-white"
                    : isOverdue
                    ? "bg-coral text-white border-coral animate-bounce"
                    : isActive
                    ? "bg-mint-wash border-teal-brand text-teal-brand ring-4 ring-teal-brand/20"
                    : isSkipped
                    ? "bg-surface-white border-dashed border-muted/50 text-muted"
                    : "bg-surface-card border-surface-border text-muted"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 size={18} strokeWidth={2.5} />
                ) : (
                  <Icon size={16} strokeWidth={2} />
                )}
              </div>

              {/* Label & Meta */}
              <div className="mt-2.5 text-center px-1">
                <p
                  className={`text-xs font-semibold leading-tight line-clamp-2 ${
                    isCompleted
                      ? "text-teal-deep"
                      : isActive
                      ? "text-teal-brand font-bold"
                      : isOverdue
                      ? "text-coral font-bold"
                      : "text-muted"
                  }`}
                >
                  {step.label}
                </p>

                {step.timestamp && (
                  <p className="text-[10px] text-muted font-medium mt-0.5">
                    {formatDate(step.timestamp)}
                  </p>
                )}

                {isOverdue && (
                  <span className="inline-block px-1.5 py-0.2 text-[9px] bg-coral/10 text-coral font-bold rounded mt-0.5">
                    Overdue
                  </span>
                )}

                {isSkipped && (
                  <span className="inline-block text-[10px] text-muted italic mt-0.5">
                    Skipped
                  </span>
                )}

                {step.owner && (
                  <p className="text-[10px] text-body/70 truncate max-w-[90px] mt-0.5">
                    {step.owner}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
