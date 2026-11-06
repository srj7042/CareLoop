import * as React from "react";
import { ShieldCheck, Lock, Eye, FileText, UserCheck, Bot, Database, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const PrivacyGovernanceModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-deep/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-card border border-surface-border rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-deep to-teal-brand text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-mint-light">
              <ShieldCheck size={26} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Privacy, Ethics & Governance Framework</h3>
              <p className="text-xs text-mint-wash/80">
                Safe human-governed loops, multi-tier RBAC, and verified patient channel consent
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Synthetic Data Notice */}
          <div className="p-3.5 bg-mint-wash border border-mint-light rounded-xl flex items-start gap-3">
            <Database size={18} className="text-teal-brand flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-teal-deep text-sm">HIPAA Safe Harbor &amp; Data Governance</p>
              <p className="text-body leading-relaxed mt-0.5">
                Demonstration cohorts, clinical benchmark figures, and simulator profiles are strictly de-identified under the HIPAA Safe Harbor standard (45 CFR &sect; 164.514(b)(2)). In enterprise healthcare system deployments, all Protected Health Information (PHI) is processed under an executed Business Associate Agreement (BAA) with hardware-encrypted multi-tenant row isolation.
              </p>
            </div>
          </div>

          {/* Core Governance Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 bg-surface-white border border-surface-border rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-teal-deep font-bold">
                <Lock size={15} className="text-teal-brand" />
                <span>Role-Based Access Control (RBAC)</span>
              </div>
              <p className="text-muted leading-relaxed">
                Granular permissions ensure coordinators only see outreach queues, specialists see incoming referrals, and patients only view their own plain-language results.
              </p>
            </div>

            <div className="p-3.5 bg-surface-white border border-surface-border rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-teal-deep font-bold">
                <FileText size={15} className="text-teal-brand" />
                <span>Immutable Cryptographic Audit Trail</span>
              </div>
              <p className="text-muted leading-relaxed">
                Every state transition, consult message, re-assignment, and notification logs a permanent audit entry with actor identity, timestamp, and mandatory justification.
              </p>
            </div>

            <div className="p-3.5 bg-surface-white border border-surface-border rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-teal-deep font-bold">
                <Eye size={15} className="text-teal-brand" />
                <span>Minimum-Necessary Disclosure</span>
              </div>
              <p className="text-muted leading-relaxed">
                Referral hand-off packets only package relevant clinical screening results, pertinent history, and past interventions, minimizing unnecessary data exposure.
              </p>
            </div>

            <div className="p-3.5 bg-surface-white border border-surface-border rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-teal-deep font-bold">
                <UserCheck size={15} className="text-teal-brand" />
                <span>Patient Channel Consent</span>
              </div>
              <p className="text-muted leading-relaxed">
                Outreach via SMS, WhatsApp, voice calls, or portal is gated by patient opt-in preferences with automatic quiet-hours compliance and privacy-preserving notification previews.
              </p>
            </div>
          </div>

          {/* AI Ethics & Human-in-the-Loop Safeguards */}
          <div className="p-4 bg-teal-brand/5 border border-teal-brand/20 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-teal-deep flex items-center gap-2 text-sm">
                <Bot size={16} className="text-teal-brand" /> AI Ethics: Human-Governed Decision Making
              </span>
              <Badge variant="mint" className="text-[10px]">
                Suggested · Never Autonomous
              </Badge>
            </div>
            <p className="text-body leading-relaxed">
              CareLoop adheres to strict clinical safety guardrails:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted pl-1">
              <li>
                <strong>No Autonomous Closure:</strong> AI never closes a case, cancels an order, or overrides a human clinical decision.
              </li>
              <li>
                <strong>Qualified Human Sign-Off:</strong> Loop closure strictly requires human clinician sign-off with attached evidence (biopsy report, attended note, or surveillance plan).
              </li>
              <li>
                <strong>Transparent Labeling:</strong> All AI-generated plain-language summaries and delay-risk scores are explicitly labeled "Suggested by CareLoop AI" and are fully editable by coordinators and clinicians.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface-white border-t border-surface-border flex justify-end">
          <Button size="sm" onClick={onClose} className="bg-teal-brand text-white text-xs font-semibold">
            Close Governance Panel
          </Button>
        </div>
      </div>
    </div>
  );
};
