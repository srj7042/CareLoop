import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  PhoneCall,
  UserCheck,
  FileCheck,
  Award,
  ChevronRight,
  X,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoopRing } from "@/components/ui/loopring";

export const MariaStoryModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  const {
    mariaStoryStep,
    setMariaStoryStep,
    runNextMariaStep,
    setRole,
    resetDemo,
    getCase,
  } = useStore();

  const mariaCase = getCase("CASE-001");
  const isClosed = mariaCase?.status === "closed";

  const steps = [
    {
      step: 1,
      title: "1. Missed Acknowledgement Detected",
      role: "coordinator" as const,
      roleName: "Care Coordinator (Riya Sharma)",
      viewPath: "/coordinator",
      problem: "In traditional care, Maria's BI-RADS 4 abnormal mammogram would have been lost after she didn't respond to SMS for 4 days.",
      solution: "CareLoop's 72-hour SLA breached; algorithm escalated to Coordinator Riya Sharma with high delay-risk score (88%).",
      actionText: "Step 2: Outreach & Acknowledge",
    },
    {
      step: 2,
      title: "2. Spanish Outreach & Confirmation",
      role: "patient" as const,
      roleName: "Patient (Maria Gonzalez)",
      viewPath: "/patient/CASE-001",
      problem: "Language barriers and fear frequently paralyze patient response without empathetic human guidance.",
      solution: "Coordinator initiated bilingual voice outreach. Maria opened her portal in Spanish, read 6th-grade reassurance, and acknowledged.",
      actionText: "Step 3: Order Diagnostic Biopsy",
    },
    {
      step: 3,
      title: "3. Confirmatory Diagnostic Ultrasound/Biopsy",
      role: "clinician" as const,
      roleName: "Primary Clinician (Dr. Arjun Mehta)",
      viewPath: "/case/CASE-001",
      problem: "Confirmatory workup often gets delayed for weeks while waiting for generic specialist slots.",
      solution: "Clinician ordered focused mammography spot compression & ultrasound-guided core biopsy.",
      actionText: "Step 4: Send Referral Packet",
    },
    {
      step: 4,
      title: "4. Structured Referral to Specialist",
      role: "specialist" as const,
      roleName: "Specialist (Dr. Fatima Al-Rashid)",
      viewPath: "/referral",
      problem: "Referrals lack clinical history, leading to specialist rejections and lost loop tracking.",
      solution: "Auto-assembled referral packet transmitted with complete history and diagnostic images to Dr. Fatima at Metro Oncology.",
      actionText: "Step 5: Accept & Book Visit",
    },
    {
      step: 5,
      title: "5. Specialist Accepts & Appointment Attended",
      role: "specialist" as const,
      roleName: "Specialist (Dr. Fatima Al-Rashid)",
      viewPath: "/case/CASE-001",
      problem: "Clinics have no record whether the referred appointment was actually attended.",
      solution: "Dr. Fatima accepted referral; Maria attended visit with Spanish family liaison. In-person biopsy reviewed.",
      actionText: "Step 6: Attach Evidence & Close Loop",
    },
    {
      step: 6,
      title: "6. Loop Closed with Verified Evidence ✓",
      role: "clinician" as const,
      roleName: "Attending Clinician (Dr. Fatima Al-Rashid)",
      viewPath: "/case/CASE-001",
      problem: "Without closed-loop evidence, programs assume care happened without proof.",
      solution: "Benign pathology documented + 6-month surveillance plan attached. Verified closure certificate generated!",
      actionText: "Demo Completed Successfully",
    },
  ];

  const currentStory = steps[Math.min(mariaStoryStep - 1, steps.length - 1)];

  if (!isOpen) return null;

  const handleExecuteNext = () => {
    if (mariaStoryStep >= 6) {
      setRole("coordinator");
      navigate("/case/CASE-001");
      onClose();
      return;
    }
    runNextMariaStep();
    const nextIdx = Math.min(mariaStoryStep, steps.length - 1);
    setRole(steps[nextIdx].role);
    navigate(steps[nextIdx].viewPath);
  };

  const handleJumpToStepView = (stepObj: typeof steps[0]) => {
    setRole(stepObj.role);
    navigate(stepObj.viewPath);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-deep/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-card border border-surface-border rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-deep to-teal-brand text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-mint-light/20 flex items-center justify-center text-mint-light font-bold">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">3-Minute Demo Story: Maria Gonzalez</h3>
              <p className="text-xs text-mint-wash/80">
                Closing the loop on an abnormal mammogram that would otherwise have been lost
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        {/* Stepper Progress bar */}
        <div className="px-6 py-3 bg-mint-wash/40 border-b border-surface-border overflow-x-auto">
          <div className="flex items-center justify-between min-w-[500px] gap-2">
            {steps.map((s) => {
              const isPast = mariaStoryStep > s.step;
              const isCurrent = mariaStoryStep === s.step;

              return (
                <div
                  key={s.step}
                  onClick={() => setMariaStoryStep(s.step)}
                  className="flex-1 flex flex-col items-center cursor-pointer group"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPast
                        ? "bg-teal-brand text-white"
                        : isCurrent
                        ? "bg-mint-wash border-2 border-teal-brand text-teal-brand ring-2 ring-teal-brand/30"
                        : "bg-surface-white border border-surface-border text-muted"
                    }`}
                  >
                    {isPast ? <CheckCircle2 size={14} /> : s.step}
                  </div>
                  <span className="text-[10px] font-semibold text-center mt-1 text-teal-deep truncate max-w-[75px]">
                    Step {s.step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Story Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="mint" className="text-xs font-bold">
              Current Stage: Step {mariaStoryStep} of 6
            </Badge>
            <span className="text-xs text-muted font-medium">
              Active Persona: <strong className="text-teal-brand">{currentStory.roleName}</strong>
            </span>
          </div>

          <h4 className="text-lg font-bold text-teal-deep">{currentStory.title}</h4>

          {/* Problem vs Solution Callout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-coral/10 border border-coral/30 rounded-xl space-y-1">
              <span className="font-bold text-coral flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                <AlertTriangle size={14} /> The Traditional Failure Mode
              </span>
              <p className="text-body leading-relaxed">{currentStory.problem}</p>
            </div>

            <div className="p-3.5 bg-mint-wash border border-mint-light rounded-xl space-y-1">
              <span className="font-bold text-teal-deep flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                <ShieldCheck size={14} className="text-teal-brand" /> The CareLoop Solution
              </span>
              <p className="text-body leading-relaxed">{currentStory.solution}</p>
            </div>
          </div>

          {/* Maria Live Case State Summary */}
          {mariaCase && (
            <div className="p-3.5 bg-surface-white rounded-xl border border-surface-border flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-teal-deep">Maria Gonzalez • 54y (Spanish)</p>
                <p className="text-muted text-[11px] mt-0.5">
                  Screening: {mariaCase.screeningType} ({mariaCase.resultValue})
                </p>
                <p className="text-teal-brand font-semibold text-[11px] mt-0.5">
                  Next Action: {mariaCase.nextAction}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <LoopRing closed={mariaCase.status === "closed"} size={42} strokeWidth={4} />
                <Badge variant={mariaCase.status === "closed" ? "mint" : "amber"}>
                  {mariaCase.status === "closed" ? "Loop Closed ✓" : "Loop Open"}
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-surface-white border-t border-surface-border flex flex-wrap items-center justify-between gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              resetDemo();
              setRole("coordinator");
              navigate("/coordinator");
            }}
            className="text-xs text-muted"
          >
            <RotateCcw size={13} className="mr-1.5" /> Reset Demo Data
          </Button>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleJumpToStepView(currentStory)}
              className="text-xs text-teal-brand border-teal-brand/30"
            >
              Open Active Screen <ArrowRight size={13} className="ml-1" />
            </Button>

            <Button
              size="sm"
              onClick={handleExecuteNext}
              className="bg-teal-brand text-white hover:bg-teal-hover text-xs font-bold shadow-xs"
            >
              <Play size={13} className="mr-1.5 fill-current" /> {currentStory.actionText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
