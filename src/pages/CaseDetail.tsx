import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Clock,
  User,
  ShieldCheck,
  SendHorizontal,
  FileText,
  CheckCircle2,
  Bot,
  Plus,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  PhoneCall,
  Edit2,
  Check,
  Award,
  Bell,
  MessageSquare,
  Send,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CaseStepper } from "@/components/ui/stepper";
import { AuditTrail } from "@/components/ui/audittrail";
import { ConsultThread } from "@/components/ui/consultthread";
import { ReferralPacket } from "@/components/ui/referralpacket";
import { ClosureChecklist } from "@/components/ui/closurechecklist";
import { StatusChip, OwnerBadge, SLATimer, SideStateBadge } from "@/components/ui/chips";
import { LoopRing } from "@/components/ui/loopring";
import { GlassCard, IconButton, StatusPill } from "@/components/design-system";
import { useStore } from "@/lib/store";
import { allUsers, triageQueues } from "@/lib/cases";
import type { Case, Role, StepKey, ClosureEvidence } from "@/types";
import { formatDate, formatDateTime } from "@/lib/utils";

export const CaseDetail = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const {
    getCase,
    transitionTo,
    reassign,
    nudge,
    escalate,
    closeWithEvidence,
    addConsult,
    respondConsult,
    updateReferral,
    addNotification,
    currentUser,
    currentRole,
  } = useStore();

  const c = React.useMemo(() => getCase(caseId || "CASE-001"), [getCase, caseId]);

  // Transition confirmation dialog
  const [transitionTarget, setTransitionTarget] = React.useState<StepKey | null>(null);
  const [transitionReason, setTransitionReason] = React.useState("");
  const [transitionNote, setTransitionNote] = React.useState("");

  // Edit AI suggestion dialog
  const [editingAi, setEditingAi] = React.useState(false);
  const [customAiText, setCustomAiText] = React.useState("");

  // Consult composer state
  const [consultQuestion, setConsultQuestion] = React.useState("");
  const [consultUrgency, setConsultUrgency] = React.useState<"routine" | "high" | "urgent">("routine");
  const [consultTo, setConsultTo] = React.useState(allUsers.find((u) => u.role === "specialist")?.id || "usr_spec_maya");

  // Reassign modal inline
  const [reassignModalOpen, setReassignModalOpen] = React.useState(false);
  const [selectedNewOwner, setSelectedNewOwner] = React.useState(allUsers[0]?.id || "usr_coord_sarah");
  const [reassignReason, setReassignReason] = React.useState("");

  if (!c || !currentUser || !currentRole) {
    return (
      <div className="py-20 text-center space-y-3">
        <p className="text-base font-bold text-[#1E2532]">Case '{caseId}' Not Found</p>
        <p className="text-xs text-[#798393]">Please return to the coordinator worklist.</p>
        <Button size="sm" onClick={() => navigate("/coordinator")} className="bg-[#10B981] hover:bg-[#059669] text-white rounded-xl shadow-xs">
          Back to Worklist
        </Button>
      </div>
    );
  }

  const isClosed = c.status === "closed";
  const currentStepIdx = c.steps.findIndex(
    (s) => s.status !== "completed" && s.status !== "skipped"
  );

  const handleStepClick = (step: any) => {
    if (currentRole === "patient") return;
    if (step.status === "completed" || step.status === "skipped") return;
    setTransitionTarget(step.key);
    setTransitionReason(`Advanced to ${step.label} following clinical protocol`);
  };

  const handleConfirmTransition = () => {
    if (!transitionTarget) return;
    transitionTo(c.id, transitionTarget, transitionReason, transitionNote);
    setTransitionTarget(null);
    setTransitionReason("");
    setTransitionNote("");
  };

  const handleAddEvidence = (ev: ClosureEvidence) => {
    closeWithEvidence(c.id, [ev], "Verified closure evidence attached");
  };

  const handleOfficialClosure = (reason: string) => {
    closeWithEvidence(c.id, c.closureEvidence || [], reason);
  };

  const handleSendConsult = () => {
    if (!consultQuestion.trim()) return;
    addConsult(c.id, {
      to: consultTo,
      question: consultQuestion,
      urgency: consultUrgency,
      attachedResults: [c.screeningType, c.resultValue],
    });
    setConsultQuestion("");
  };

  const handleSendNotification = (channel: any, to: string, message: string) => {
    addNotification(c.id, { channel, to, message, status: "delivered" });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Breadcrumb & Patient Header */}
      <GlassCard className="p-6 rounded-[26px]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <button
              onClick={() => navigate("/coordinator")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8B5CF6] hover:text-[#7C3AED] transition-colors"
            >
              <ChevronLeft size={16} /> Back to Coordinator Worklist
            </button>

            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-[#1E2532]">{c.patientName}</h1>
              <span className="bg-slate-900/60 backdrop-blur-md text-white rounded-xl px-2.5 py-0.5 text-xs font-mono font-bold shadow-xs">
                {c.id}
              </span>
              <StatusChip urgency={c.urgency} />
              {c.sideState && <SideStateBadge sideState={c.sideState} />}
              {isClosed && (
                <StatusPill variant="mint" label="Loop Closed ✓" pulse />
              )}
            </div>

            <p className="text-xs text-[#798393]">
              {c.screeningType} • {c.facility} • {c.patientAge}y • {c.patientGender} • Language:{" "}
              <span className="font-bold text-[#1E2532] uppercase">{c.patientLanguage}</span> • Phone:{" "}
              {c.patientPhone}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3">
            <IconButton
              icon={<User size={18} className="text-[#8B5CF6]" />}
              label="Portal"
              subtext="Patient View"
              onClick={() => navigate(`/patient/${c.id}`)}
              variant="frosted"
            />

            {!isClosed && (
              <>
                <IconButton
                  icon={<UserCheck size={18} className="text-[#1E2532]" />}
                  label="Reassign"
                  subtext="Owner"
                  onClick={() => setReassignModalOpen(true)}
                  variant="frosted"
                />

                <IconButton
                  icon={<Clock size={18} className="text-[#F59E0B]" />}
                  label="Nudge"
                  subtext="Send SLA"
                  onClick={() => nudge(c.id, "Coordinator manual nudge")}
                  variant="frosted"
                />

                <IconButton
                  icon={<AlertTriangle size={18} className="text-[#EF4444]" />}
                  label="Escalate"
                  subtext="Urgent Lead"
                  onClick={() => escalate(c.id, "Coordinator triggered urgent clinical escalation")}
                  variant="frosted"
                />
              </>
            )}
          </div>
        </div>
      </GlassCard>

      {/* 3 Top KPI / Owner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Accountable Current Owner & SLA */}
        <GlassCard className="p-5 rounded-[26px] space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#798393] uppercase tracking-wider">Accountable Owner</span>
            <SLATimer dueAt={c.nextActionDue} />
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#8B5CF6]/20 to-[#10B981]/20 border border-white/80 text-[#1E2532] font-bold flex items-center justify-center text-sm shadow-xs">
              {c.currentOwnerName.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-[#1E2532] text-sm">{c.currentOwnerName}</p>
              <p className="text-[11px] text-[#798393] capitalize">
                {c.isQueueOwner ? "Triage Queue" : c.currentOwnerRole}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/70 border border-white/80 text-xs shadow-2xs">
            <span className="font-semibold text-[#1E2532]">Next Action:</span>
            <p className="text-[#798393] mt-0.5 leading-relaxed">{c.nextAction}</p>
          </div>
        </GlassCard>

        {/* Card 2: AI-Assisted Recommendation (Clearly labeled, Editable) */}
        <GlassCard className="p-5 rounded-[26px] space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#798393] uppercase tracking-wider flex items-center gap-1.5">
              <Bot size={15} className="text-[#8B5CF6]" /> AI Copilot Suggestion
            </span>
            <span className="bg-slate-900/60 backdrop-blur-md text-white rounded-xl text-[10px] font-bold px-2 py-0.5">
              Human-Approved
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#8B5CF6]/5 border border-[#8B5CF6]/15 text-xs space-y-2">
            {!editingAi ? (
              <>
                <p className="text-[#1E2532] font-medium leading-relaxed">
                  "{customAiText || c.aiSuggestedNextStep}"
                </p>
                <button
                  onClick={() => {
                    setCustomAiText(customAiText || c.aiSuggestedNextStep || "");
                    setEditingAi(true);
                  }}
                  className="text-[11px] font-semibold text-[#8B5CF6] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 size={11} /> Edit Suggestion
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={customAiText}
                  onChange={(e) => setCustomAiText(e.target.value)}
                  rows={2}
                  className="w-full text-xs p-2 rounded-xl border border-white/80 bg-white/90 text-[#1E2532] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30"
                />
                <div className="flex gap-1.5 justify-end">
                  <Button size="sm" variant="ghost" onClick={() => setEditingAi(false)} className="text-[11px] h-6 px-2.5 rounded-lg text-[#798393]">
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => setEditingAi(false)} className="text-[11px] h-6 px-2.5 bg-[#8B5CF6] text-white hover:bg-[#7C3AED] rounded-lg">
                    Save
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-semibold text-[#798393]">Delay Risk Score:</span>
              <span className="font-bold text-[#EF4444]">{c.aiDelayRiskScore || 35}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-[#EF4444] transition-all"
                style={{ width: `${c.aiDelayRiskScore || 35}%` }}
              />
            </div>
          </div>
        </GlassCard>

        {/* Card 3: Loop Status & Closure Ring */}
        <GlassCard className="p-5 rounded-[26px] flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#798393] uppercase tracking-wider">Loop Closure Status</span>
            <p className="text-2xl font-extrabold text-[#1E2532] tracking-tight">
              {isClosed ? "Loop Closed ✓" : "Loop Open"}
            </p>
            <p className="text-xs text-[#798393] max-w-[160px] leading-relaxed">
              {isClosed
                ? `Closed on ${formatDate(c.closedAt || c.createdAt)}`
                : "Tracking progress to verified treatment or surveillance"}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <LoopRing closed={isClosed} size={64} strokeWidth={6} />
            <span className="text-[10px] font-bold text-[#10B981] mt-2 uppercase tracking-wide">
              {isClosed ? "Verified" : "In Progress"}
            </span>
          </div>
        </GlassCard>
      </div>

      {/* Case Lifecycle Tracker Horizontal Stepper */}
      <GlassCard className="p-6 rounded-[26px] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/80 pb-3">
          <div>
            <h3 className="font-bold text-[#1E2532] text-base">Case Lifecycle State Machine</h3>
            <p className="text-xs text-[#798393]">
              Click any pending step to advance with documented audit justification. Conditional pathways skip inapplicable steps.
            </p>
          </div>
          <StatusPill variant="lavender" label={`Pathway: ${c.pathwayType}`} size="sm" />
        </div>

        <CaseStepper
          steps={c.steps}
          currentStepIndex={currentStepIdx}
          onStepClick={handleStepClick}
        />

        {/* Step Transition Modal confirmation */}
        {transitionTarget && (
          <div className="p-4 rounded-2xl bg-white/80 border border-white/90 space-y-3 animate-in fade-in shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-[#1E2532]">
                Advance Lifecycle Step to: <span className="text-[#8B5CF6] uppercase font-mono">{transitionTarget}</span>
              </p>
              <StatusPill variant="slate" label={`${currentUser.name} (${currentUser.role})`} size="sm" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <input
                type="text"
                value={transitionReason}
                onChange={(e) => setTransitionReason(e.target.value)}
                placeholder="Reason for advancing step (mandatory)..."
                className="w-full text-xs p-2.5 rounded-xl border border-white/80 bg-white text-[#1E2532] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 shadow-2xs"
              />
              <input
                type="text"
                value={transitionNote}
                onChange={(e) => setTransitionNote(e.target.value)}
                placeholder="Optional clinical note / observation..."
                className="w-full text-xs p-2.5 rounded-xl border border-white/80 bg-white text-[#1E2532] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 shadow-2xs"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="ghost" onClick={() => setTransitionTarget(null)} className="text-xs rounded-xl text-[#798393]">
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmTransition}
                disabled={!transitionReason.trim()}
                className="bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                Confirm State Transition
              </Button>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Main Two-Column Working Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Consults & Referral Packet */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Consult Thread */}
          <GlassCard className="p-6 rounded-[26px] space-y-4">
            <div className="flex items-center justify-between border-b border-white/80 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-[#8B5CF6]" />
                <h3 className="font-bold text-[#1E2532] text-sm">Rapid Clinician-to-Clinician Consult</h3>
              </div>
              <StatusPill variant="lavender" label={`${c.consults.length} Consults`} size="sm" />
            </div>

            <ConsultThread
              consults={c.consults}
              currentUserId={currentUser.id}
              currentUserRole={currentRole}
              onRespond={(consultId, response, outcomeNote) =>
                respondConsult(c.id, consultId, response, outcomeNote)
              }
            />

            {/* Compose New Consult Form (Clinicians & Coordinators) */}
            {currentRole !== "patient" && (
              <div className="pt-3 border-t border-white/80 space-y-2.5">
                <p className="text-xs font-bold text-[#1E2532]">Initiate New Specialist Consult</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <select
                    value={consultTo}
                    onChange={(e) => setConsultTo(e.target.value)}
                    className="p-2.5 rounded-xl border border-white/80 bg-white/80 text-[#1E2532] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 shadow-2xs sm:col-span-1"
                  >
                    {allUsers
                      .filter((u) => u.role === "specialist" || u.role === "clinician")
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.role}) • {u.department || u.facility.split(" ")[0]}
                        </option>
                      ))}
                  </select>

                  <select
                    value={consultUrgency}
                    onChange={(e) => setConsultUrgency(e.target.value as any)}
                    className="p-2.5 rounded-xl border border-white/80 bg-white/80 text-[#1E2532] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 shadow-2xs sm:col-span-1"
                  >
                    <option value="routine">Routine Consult (48h)</option>
                    <option value="high">High Priority (24h)</option>
                    <option value="urgent">Urgent Clinical (4h)</option>
                  </select>

                  <Button
                    size="sm"
                    onClick={handleSendConsult}
                    disabled={!consultQuestion.trim()}
                    className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold rounded-xl shadow-xs sm:col-span-1"
                  >
                    Send Quick Consult
                  </Button>
                </div>

                <textarea
                  value={consultQuestion}
                  onChange={(e) => setConsultQuestion(e.target.value)}
                  placeholder="Pose specific clinical question regarding this screening finding and attached results..."
                  rows={2}
                  className="w-full text-xs p-3 rounded-xl border border-white/80 bg-white/80 text-[#1E2532] placeholder-[#798393] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 shadow-2xs"
                />
              </div>
            )}
          </GlassCard>

          {/* Referral Hand-off Packet */}
          <GlassCard className="p-6 rounded-[26px] space-y-4">
            <div className="flex items-center justify-between border-b border-white/80 pb-3">
              <div className="flex items-center gap-2">
                <SendHorizontal size={18} className="text-[#10B981]" />
                <h3 className="font-bold text-[#1E2532] text-sm">Referral Hand-Off Packet</h3>
              </div>
              {c.referral && (
                <span className="text-xs text-[#798393] font-medium">
                  Specialty: <strong className="text-[#1E2532]">{c.referral.specialtyRequired}</strong>
                </span>
              )}
            </div>

            {c.referral ? (
              <ReferralPacket
                referral={c.referral}
                onAccept={() =>
                  updateReferral(c.id, {
                    status: "accepted",
                    acceptedBy: currentUser.id,
                    acceptedByName: currentUser.name,
                    acceptedAt: new Date().toISOString(),
                  })
                }
                onReject={(reason) =>
                  updateReferral(c.id, {
                    status: "rejected",
                    rejectReason: reason,
                  })
                }
                onMoreInfo={(reason) =>
                  updateReferral(c.id, {
                    status: "more-info",
                    moreInfoReason: reason,
                  })
                }
                canDecide={currentRole === "specialist" || currentRole === "coordinator"}
              />
            ) : (
              <div className="p-8 text-center border border-dashed border-white/80 rounded-2xl bg-white/40 space-y-2">
                <SendHorizontal size={24} className="mx-auto text-[#798393]/60" />
                <p className="text-xs font-semibold text-[#1E2532]">No Specialist Referral Transmitted Yet</p>
                <p className="text-[11px] text-[#798393] max-w-sm mx-auto">
                  Primary care clinicians can assemble a standard referral packet once confirmation diagnostics are ordered.
                </p>
                {currentRole !== "patient" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateReferral(c.id, {
                        caseId: c.id,
                        patientId: c.patientId,
                        patientName: c.patientName,
                        resultSummary: `${c.screeningType}: ${c.resultValue}`,
                        history: `${c.patientAge}yo ${c.patientGender}, enrolled in ${c.program}.`,
                        doneSoFar: "Initial screening completed; primary care clinical review.",
                        reasonForReferral: `Specialty diagnostic assessment for ${c.screeningType}`,
                        urgency: c.urgency,
                        specialtyRequired: "Specialty Clinic",
                        status: "pending",
                      })
                    }
                    className="text-xs text-[#8B5CF6] border-[#8B5CF6]/30 bg-white/70 hover:bg-white rounded-xl mt-2"
                  >
                    <Plus size={13} className="mr-1" /> Assemble Referral Packet Now
                  </Button>
                )}
              </div>
            )}
          </GlassCard>

          {/* Closure Evidence & Certificate Section */}
          <GlassCard className="p-6 rounded-[26px] space-y-4">
            <div className="flex items-center justify-between border-b border-white/80 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#10B981]" />
                <h3 className="font-bold text-[#1E2532] text-sm">
                  {isClosed ? "Loop Closed Certificate ✓" : "Closure Evidence & Authorization"}
                </h3>
              </div>
              {isClosed && (
                <StatusPill variant="mint" label="Verified Loop Closed ✓" />
              )}
            </div>

            {isClosed ? (
              /* Closed Loop Certificate Display */
              <div className="p-6 rounded-[22px] bg-gradient-to-br from-[#10B981]/10 via-white/80 to-[#8B5CF6]/10 border border-white/80 space-y-4 shadow-sm backdrop-blur-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#10B981] to-[#059669] text-white flex items-center justify-center shadow-md">
                      <Award size={30} strokeWidth={2} />
                    </div>
                    <div>
                      <h4 className="text-lg font-extrabold text-[#1E2532] tracking-tight">
                        Screening-to-Care Loop Officially Closed
                      </h4>
                      <p className="text-xs text-[#798393]">
                        Verified by <strong className="text-[#1E2532]">{c.closedByName || c.closedBy}</strong> on{" "}
                        {formatDateTime(c.closedAt || c.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 backdrop-blur-md text-white rounded-xl p-2.5 text-right shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-[#10B981] tracking-wider block">
                      Audit Stamp
                    </span>
                    <p className="font-mono text-xs font-bold text-white">CL-VERIFIED-{c.id}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#1E2532] uppercase tracking-wider">
                    Official Closure Decision:
                  </span>
                  <p className="text-xs text-[#1E2532] font-medium bg-white/90 p-3 rounded-xl border border-white/80">
                    "{c.closureReason || "Verified attended consultation with documented surveillance plan."}"
                  </p>
                </div>

                {/* Evidence on File */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#1E2532] uppercase tracking-wider">
                    Attached Evidence on File ({c.closureEvidence?.length || 0}):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {c.closureEvidence?.map((ev, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-white/85 border border-white/80 space-y-1 shadow-2xs"
                      >
                        <span className="font-bold text-[#10B981] capitalize text-[11px] block">
                          ✓ {ev.type.replace("-", " ")}
                        </span>
                        <p className="text-[#1E2532] text-xs font-medium">{ev.description}</p>
                        <p className="text-[10px] text-[#798393]">
                          {ev.attachedByName} • {formatDate(ev.attachedAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Closure Checklist Input */
              <ClosureChecklist
                evidence={c.closureEvidence || []}
                onAddEvidence={handleAddEvidence}
                onCloseCase={handleOfficialClosure}
                currentUser={currentUser}
                isClosed={isClosed}
              />
            )}
          </GlassCard>
        </div>

        {/* Right Column (1 span): Immutable Audit Trail & Notification Simulator */}
        <div className="space-y-6">
          {/* Audit Trail */}
          <GlassCard className="p-6 rounded-[26px] space-y-4">
            <div className="flex items-center justify-between border-b border-white/80 pb-3">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-[#8B5CF6]" />
                <h3 className="font-bold text-[#1E2532] text-sm">Immutable Audit Trail</h3>
              </div>
              <StatusPill variant="slate" label={`${c.audit.length} Logs`} size="sm" />
            </div>

            <AuditTrail entries={c.audit} />
          </GlassCard>

          {/* Patient Communications Log & Outreach Widget */}
          <GlassCard className="p-6 rounded-[26px] space-y-4">
            <div className="flex items-center justify-between border-b border-white/80 pb-3">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-[#10B981]" />
                <h3 className="font-bold text-[#1E2532] text-sm">Patient Communications Log</h3>
              </div>
              <span className="text-[10px] font-bold text-[#798393] uppercase">Verified Outreach</span>
            </div>

            <div className="space-y-3">
              {c.notifications && c.notifications.length > 0 ? (
                c.notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3 rounded-2xl bg-white/70 border border-white/80 text-xs space-y-1 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1E2532] uppercase tracking-wider text-[10px]">
                        {notif.channel} &bull; {notif.to}
                      </span>
                      <StatusPill variant="mint" label={notif.status} size="sm" />
                    </div>
                    <p className="text-[#1E2532] text-[11px]">{notif.message}</p>
                    <span className="text-[10px] text-[#798393] block font-mono">
                      {new Date(notif.sentAt).toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#798393] text-center py-2">No communication logged yet.</p>
              )}

              <div className="pt-2 border-t border-white/80 flex gap-2">
                <Button
                  size="sm"
                  onClick={() =>
                    handleSendNotification(
                      "sms",
                      c.patientPhone,
                      `CareLoop: Follow-up message regarding your ${c.screeningType} care plan from your coordinator.`
                    )
                  }
                  className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs h-9 rounded-xl shadow-xs"
                >
                  Dispatch SMS Outreach
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Reassign Modal */}
      {reassignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-xl border border-white/80 rounded-[28px] shadow-[0_24px_48px_rgba(100,115,140,0.15)] w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-[#1E2532]">Reassign Case Accountability</h3>
            <p className="text-xs text-[#798393]">
              Every open case must have one accountable staff member or triage queue.
            </p>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-[#1E2532]">Select New Accountable Owner</label>
              <select
                value={selectedNewOwner}
                onChange={(e) => setSelectedNewOwner(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-white/80 bg-white/80 text-[#1E2532] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 shadow-2xs"
              >
                <optgroup label="Named Staff">
                  {allUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role}) • {u.facility.split(" ")[0]}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Triage Queues">
                  {triageQueues.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-[#1E2532]">Mandatory Reason for Transfer</label>
              <textarea
                value={reassignReason}
                onChange={(e) => setReassignReason(e.target.value)}
                placeholder="Reason for reassignment..."
                rows={2}
                className="w-full text-xs p-3 rounded-xl border border-white/80 bg-white/80 text-[#1E2532] placeholder-[#798393] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 shadow-2xs"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button size="sm" variant="ghost" onClick={() => setReassignModalOpen(false)} className="text-xs rounded-xl text-[#798393]">
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  reassign(c.id, selectedNewOwner, reassignReason || "Administrative re-assignment");
                  setReassignModalOpen(false);
                  setReassignReason("");
                }}
                disabled={!reassignReason.trim()}
                className="bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Confirm Reassignment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};