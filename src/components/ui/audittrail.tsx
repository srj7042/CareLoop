import * as React from "react";
import { CheckCircle2, UserCheck, Shield, Clock, FileText, ArrowRight } from "lucide-react";
import type { AuditEntry } from "@/types";
import { formatRelative, formatTime, formatDate } from "@/lib/utils";

export const AuditTrail = ({ entries }: { entries: AuditEntry[] }) => {
  const sorted = [...entries].reverse();

  return (
    <div className="space-y-3">
      {sorted.map((e, index) => {
        const isLatest = index === 0;

        return (
          <div key={e.id} className="relative pl-6 pb-3 last:pb-0">
            {/* Timeline Vertical Bar */}
            {index < sorted.length - 1 && (
              <div className="absolute left-2.5 top-3 bottom-0 w-0.5 bg-surface-border" />
            )}

            {/* Timeline Dot Icon */}
            <div
              className={`absolute left-0.5 top-1.5 w-4 h-4 rounded-full flex items-center justify-center border-2 ${
                isLatest
                  ? "bg-teal-brand border-mint-wash text-white"
                  : "bg-surface-card border-surface-border text-muted"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  isLatest ? "bg-white" : "bg-teal-brand"
                }`}
              />
            </div>

            {/* Entry Content Card */}
            <div className="bg-surface-white/60 p-3 rounded-xl border border-surface-border/60 hover:bg-surface-white transition-colors text-xs space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="font-bold text-teal-deep text-sm">{e.action}</span>
                <span className="text-[11px] text-muted">
                  {formatRelative(e.timestamp)} ({formatTime(e.timestamp)})
                </span>
              </div>

              {e.fromStep && e.toStep && (
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-teal-brand">
                  <span className="capitalize">{e.fromStep}</span>
                  <ArrowRight size={12} />
                  <span className="capitalize">{e.toStep}</span>
                </div>
              )}

              <p className="text-body text-xs leading-relaxed">{e.reason}</p>

              <div className="flex items-center gap-2 pt-1 text-[11px] text-muted font-medium border-t border-surface-border/40">
                <span className="flex items-center gap-1 text-teal-deep font-semibold">
                  <UserCheck size={12} className="text-teal-brand" /> {e.owner}
                </span>
                <span>•</span>
                <span className="capitalize">{e.ownerRole}</span>
                <span>•</span>
                <span className="text-[10px] text-muted">{formatDate(e.timestamp)}</span>
              </div>
            </div>
          </div>
        );
      })}

      {entries.length === 0 && (
        <div className="p-6 text-center text-xs text-muted border border-dashed border-surface-border rounded-xl">
          No audit entries logged yet.
        </div>
      )}
    </div>
  );
};
