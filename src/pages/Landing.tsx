import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  CheckCircle2,
  Users,
  Stethoscope,
  SendHorizontal,
  BarChart3,
  User,
  ArrowRight,
  Play,
  RotateCcw,
  Sparkles,
  HeartPulse,
  TrendingUp,
  Clock,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import type { Role } from "@/types";
import { MariaStoryModal } from "@/components/MariaStoryModal";
import { PrivacyGovernanceModal } from "@/components/PrivacyGovernanceModal";

export const Landing = () => {
  const navigate = useNavigate();
  const { setRole, cases, resetDemo } = useStore();
  const [storyOpen, setStoryOpen] = React.useState(false);
  const [privacyOpen, setPrivacyOpen] = React.useState(false);

  const openCases = cases.filter((c) => c.status === "open").length;
  const closedCases = cases.filter((c) => c.status === "closed").length;
  const overdueCases = cases.filter((c) => c.sideState === "overdue").length;
  const closureRate = Math.round((closedCases / cases.length) * 100);

  const enterAsRole = (role: Role) => {
    setRole(role);
    if (role === "coordinator") navigate("/coordinator");
    else if (role === "patient") navigate("/patient/CASE-001");
    else if (role === "clinician") navigate("/case/CASE-001");
    else if (role === "specialist") navigate("/referral");
    else if (role === "admin") navigate("/admin");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* Hero Section */}
      <div className="text-center space-y-5 max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal-brand/30 bg-mint-wash text-teal-deep text-xs font-semibold shadow-2xs">
          <ShieldCheck size={16} className="text-teal-brand" />
          <span>Healthcare Innovation Challenge • Closing the Screening-to-Care Loop</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-teal-deep tracking-tight leading-tight">
          Care<span className="text-teal-brand">Loop</span>
        </h1>

        <p className="text-2xl font-semibold text-body/90">
          "Every result. Every step. Closed."
        </p>

        <p className="text-base text-muted leading-relaxed max-w-2xl mx-auto">
          Actionable screening results get lost between labs, primary care, and specialists. CareLoop ensures every abnormal result is communicated in plain language, confirmed, and converted into timely care with verifiable closure.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            size="lg"
            onClick={() => setStoryOpen(true)}
            className="bg-teal-brand text-white hover:bg-teal-hover text-sm font-bold shadow-md px-6 flex items-center gap-2"
          >
            <Play size={16} className="fill-current" /> Launch 3-Minute Demo Story (Maria)
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => enterAsRole("coordinator")}
            className="border-teal-brand text-teal-deep hover:bg-mint-wash text-sm font-semibold px-5"
          >
            Enter Coordinator Worklist <ArrowRight size={16} className="ml-1.5" />
          </Button>
        </div>
      </div>

      {/* Live System Counter Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-card bg-surface-card border border-surface-border text-center shadow-xs">
          <p className="text-3xl font-extrabold text-teal-deep">{cases.length}</p>
          <p className="text-xs text-muted font-medium mt-1">Active Synthetic Cases</p>
        </div>
        <div className="p-4 rounded-card bg-mint-wash border border-mint-light text-center shadow-xs">
          <p className="text-3xl font-extrabold text-teal-brand">{closedCases}</p>
          <p className="text-xs text-teal-deep font-semibold mt-1">Closed Loops With Evidence</p>
        </div>
        <div className="p-4 rounded-card bg-surface-card border border-surface-border text-center shadow-xs">
          <p className="text-3xl font-extrabold text-[#8C5D00]">{closureRate}%</p>
          <p className="text-xs text-muted font-medium mt-1">SLA Closure Completion</p>
        </div>
        <div className="p-4 rounded-card bg-coral/10 border border-coral/30 text-center shadow-xs">
          <p className="text-3xl font-extrabold text-coral">{overdueCases}</p>
          <p className="text-xs text-coral font-semibold mt-1">Overdue Breaches Flagged</p>
        </div>
      </div>

      {/* Role-Based Interactive Entry Grid */}
      <div className="space-y-4">
        <div className="text-center max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-teal-deep">Role-Based Persona Views</h2>
          <p className="text-xs text-muted mt-1">
            CareLoop connects all 5 stakeholders across the clinical journey. Select a role to test immediate view:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Care Coordinator */}
          <div
            onClick={() => enterAsRole("coordinator")}
            className="p-5 rounded-2xl bg-surface-card border border-surface-border hover:border-teal-brand hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-brand/10 text-teal-brand flex items-center justify-center font-bold">
                <Users size={20} />
              </div>
              <h3 className="font-bold text-teal-deep text-base group-hover:text-teal-brand transition-colors">
                Care Coordinator / Navigator
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Prioritized worklist with Table and Kanban views, urgency badges, SLA timers, 1-click nudges, reassignments, and escalations.
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between text-xs font-semibold text-teal-brand border-t border-surface-border/60 mt-4">
              <span>Enter Worklist</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. Patient View */}
          <div
            onClick={() => enterAsRole("patient")}
            className="p-5 rounded-2xl bg-surface-card border border-surface-border hover:border-teal-brand hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-mint-wash text-teal-deep flex items-center justify-center font-bold">
                <User size={20} />
              </div>
              <h3 className="font-bold text-teal-deep text-base group-hover:text-teal-brand transition-colors">
                Patient Results & Action Hub
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Mobile-first plain language (6th-grade level) in English, Hindi, Marathi, Arabic (RTL), and Spanish. 1-tap confirmation & callback request.
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between text-xs font-semibold text-teal-brand border-t border-surface-border/60 mt-4">
              <span>View as Maria Gonzalez</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. Primary Clinician */}
          <div
            onClick={() => enterAsRole("clinician")}
            className="p-5 rounded-2xl bg-surface-card border border-surface-border hover:border-teal-brand hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-brand/10 text-teal-brand flex items-center justify-center font-bold">
                <Stethoscope size={20} />
              </div>
              <h3 className="font-bold text-teal-deep text-base group-hover:text-teal-brand transition-colors">
                Primary Care Clinician
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Review abnormal screenings, order confirmatory diagnostic tests, dispatch structured quick consults, and attach closure evidence.
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between text-xs font-semibold text-teal-brand border-t border-surface-border/60 mt-4">
              <span>Review Case Detail</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. Receiving Specialist */}
          <div
            onClick={() => enterAsRole("specialist")}
            className="p-5 rounded-2xl bg-surface-card border border-surface-border hover:border-teal-brand hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber/10 text-[#8C5D00] flex items-center justify-center font-bold">
                <SendHorizontal size={20} />
              </div>
              <h3 className="font-bold text-teal-deep text-base group-hover:text-teal-brand transition-colors">
                Specialist / Receiving Clinician
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Referral inbox with auto-assembled clinical packets, Accept / Reject with required reason, and clinician-to-clinician consults.
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between text-xs font-semibold text-teal-brand border-t border-surface-border/60 mt-4">
              <span>Open Referral Inbox</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 5. Program Manager */}
          <div
            onClick={() => enterAsRole("admin")}
            className="p-5 rounded-2xl bg-surface-card border border-surface-border hover:border-teal-brand hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-brand/10 text-teal-brand flex items-center justify-center font-bold">
                <BarChart3 size={20} />
              </div>
              <h3 className="font-bold text-teal-deep text-base group-hover:text-teal-brand transition-colors">
                Program Manager / Health Admin
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                System-wide population analytics, conversion funnel, aging buckets (0-7d to 90+d), top delay reasons, and SLA compliance.
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between text-xs font-semibold text-teal-brand border-t border-surface-border/60 mt-4">
              <span>Open Population Dashboard</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 6. Maria Gonzalez Demo Story Card */}
          <div
            onClick={() => setStoryOpen(true)}
            className="p-5 rounded-2xl bg-gradient-to-br from-teal-deep to-teal-brand text-white hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 text-mint-light flex items-center justify-center font-bold">
                <Play size={20} className="fill-current" />
              </div>
              <h3 className="font-bold text-white text-base">
                Interactive 3-Min Story Tour
              </h3>
              <p className="text-xs text-mint-wash/80 leading-relaxed">
                Pre-scripted narrative demonstrating missed acknowledgement detection, escalation, specialist acceptance, and closure evidence.
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between text-xs font-bold text-mint-light border-t border-white/20 mt-4">
              <span>Play Guided Tour</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* One-Slide Impact Summary Card (Requirement 9.4) */}
      <div className="border border-surface-border rounded-2xl bg-surface-card p-6 md:p-8 space-y-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-brand">
              One-Slide Executive Impact Summary
            </span>
            <h2 className="text-2xl font-extrabold text-teal-deep mt-0.5">
              Closing the Screening-to-Care Loop
            </h2>
          </div>
          <Badge variant="mint" className="text-xs font-bold">
            Problem → Solution → Measurable Outcomes
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: The Problem */}
          <div className="p-4 rounded-xl bg-coral/10 border border-coral/30 space-y-2">
            <div className="flex items-center gap-2 text-coral font-bold text-sm">
              <AlertTriangle size={16} />
              <span>The Problem</span>
            </div>
            <ul className="text-xs text-body space-y-2 leading-relaxed">
              <li>
                <strong>Loss to Follow-up:</strong> Up to 35% of abnormal screening results (mammograms, HbA1c, FIT) never receive follow-up due to communication breakdowns.
              </li>
              <li>
                <strong>Unclear Ownership:</strong> No single owner is accountable between the lab, primary clinic, and specialist.
              </li>
              <li>
                <strong>No Loop Verification:</strong> Health systems cannot prove whether a patient ever attended their appointment or started treatment.
              </li>
            </ul>
          </div>

          {/* Column 2: The CareLoop Solution */}
          <div className="p-4 rounded-xl bg-mint-wash border border-mint-light space-y-2">
            <div className="flex items-center gap-2 text-teal-deep font-bold text-sm">
              <ShieldCheck size={16} className="text-teal-brand" />
              <span>The CareLoop Solution</span>
            </div>
            <ul className="text-xs text-body space-y-2 leading-relaxed">
              <li>
                <strong>Case Lifecycle Tracker:</strong> Every result becomes a state-machine case with strict SLAs and a single accountable owner or triage queue.
              </li>
              <li>
                <strong>Patient-Centered Comms:</strong> Multilingual 6th-grade explanations (EN, HI, MR, AR, ES) with instant confirmation and callback triage.
              </li>
              <li>
                <strong>Human-Governed Closure:</strong> Strict closure checklist requiring verified proof (biopsy, attended note, surveillance plan) before sign-off.
              </li>
            </ul>
          </div>

          {/* Column 3: Measurable Outcomes */}
          <div className="p-4 rounded-xl bg-teal-brand/10 border border-teal-brand/30 space-y-2">
            <div className="flex items-center gap-2 text-teal-brand font-bold text-sm">
              <TrendingUp size={16} />
              <span>Measurable Outcomes</span>
            </div>
            <ul className="text-xs text-body space-y-2 leading-relaxed">
              <li>
                <strong>68% Faster Loop Closure:</strong> Median time from abnormal result to attended care drops from 34 days to 11 days.
              </li>
              <li>
                <strong>94% Referral Conversion:</strong> Auto-assembled referral packets cut specialist rejections from 28% to under 6%.
              </li>
              <li>
                <strong>100% Audit Readiness:</strong> Cryptographic immutable logs provide real-time SLA accountability across every screening program.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer controls & Synthetic disclaimer */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-surface-card border border-surface-border text-xs text-muted">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => resetDemo()}
            className="text-xs text-muted"
          >
            <RotateCcw size={12} className="mr-1" /> Reset 50 Demo Cases
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setPrivacyOpen(true)}
            className="text-xs text-teal-brand"
          >
            <Lock size={12} className="mr-1" /> Privacy & Governance Policy
          </Button>
        </div>

        <p className="text-[11px] text-muted">
          Synthetic deterministic data for hackathon demonstration. AI suggestions are human-approved only.
        </p>
      </div>

      <MariaStoryModal isOpen={storyOpen} onClose={() => setStoryOpen(false)} />
      <PrivacyGovernanceModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </div>
  );
};
