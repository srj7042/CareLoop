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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CaseStepper } from "@/components/ui/stepper";
import { AuditTrail } from "@/components/ui/audittrail";
import { ConsultThread } from "@/components/ui/consultthread";
import { ReferralPacket } from "@/components/ui/referralpacket";
import { ClosureChecklist } from "@/components/ui/closurechecklist";
import { NotificationSimulator } from "@/components/ui/notificationsimulator";
import { StatusChip, OwnerBadge, SLATimer, SideStateBadge } from "@/components/ui/chips";
import { LoopRing } from "@/components/ui/loopring";
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
  const [consultTo, setConsultTo] = React.useState(allUsers.find((u) => u.role === "specialist")?.id || "u3");

  // Reassign modal inline
  const [reassignModalOpen, setReassignModalOpen] = React.useState(false);
  const [selectedNewOwner, setSelectedNewOwner] = React.useState(allUsers[0].id);
  const [reassignReason, setReassignReason] = React.useState("");

  if (!c) {
    return (
      <div className="py-20 text-center space-y-3">
        <p className="text-base font-bold text-teal-deep">Case '{caseId}' Not Found</p>
        <p className="text-xs text-muted">Please return to the coordinator worklist.</p>
        <Button size="sm" onClick={() => navigate("/coordinator")} className="bg-teal-brand text-white">
          Back to Worklist
        </Button>
      </div>
    );
  }

  const isClosed = c.status === "closed";
  const currentStepIdx = c.steps.findIndex(
    (s) => s.status !== "completed" && s.status !== "skipped"
  );

  const handleStepClick = (step: any, index: number) => {
    // Authorized clinicians and coordinators can trigger transition to an upcoming step
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-border pb-5">
        <div className="space-y-1.5">
          <button
            onClick={() => navigate("/coordinator")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-brand hover:text-teal-hover mb-1"
          >
            <ChevronLeft size={16} /> Back to Coordinator Worklist
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold text-teal-deep">{c.patientName}</h1>
            <Badge variant="mint" className="text-xs font-mono font-bold">
              {c.id}
            </Badge>
            <StatusChip urgency={c.urgency} />
            {c.sideState && <SideStateBadge sideState={c.sideState} />}
            {isClosed && (
              <Badge variant="mint" className="text-xs font-bold flex items-center gap-1">
                <CheckCircle2 size={13} /> Loop Closed ✓
              </Badge>
            )}
          </div>

          <p className="text-xs text-muted">
            {c.screeningType} • {c.facility} • {c.patientAge}y • {c.patientGender} • Language:{" "}
            <span className="font-bold text-teal-deep uppercase">{c.patientLanguage}</span> • Phone:{" "}
            {c.patientPhone}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/patient/${c.id}`)}
            className="text-xs border-teal-brand/30 text-teal-brand hover:bg-mint-wash"
          >
            <User size={13} className="mr-1.5" /> Open Patient View
          </Button>

          {!isClosed && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setReassignModalOpen(true)}
                className="text-xs border-surface-border text-muted hover:text-teal-deep"
              >
                Reassign Owner
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => nudge(c.id, "Coordinator manual nudge")}
                className="text-xs border-amber/50 text-[#8C5D00] hover:bg-amber/10"
              >
                Nudge Owner
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => escalate(c.id, "Coordinator triggered urgent clinical escalation")}
                className="text-xs border-coral/50 text-coral hover:bg-coral/10"
              >
                Escalate
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 3 Top KPI / Owner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Accountable Current Owner & SLA */}
        <div className="p-4 rounded-card bg-surface-card border border-surface-border space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Accountable Owner</span>
            <SLATimer dueAt={c.nextActionDue} />
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-mint-wash text-teal-brand font-bold flex items-center justify-center text-sm shadow-2xs">
              {c.currentOwnerName.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-teal-deep text-sm">{c.currentOwnerName}</p>
              <p className="text-[11px] text-muted capitalize">
                {c.isQueueOwner ? "Triage Queue" : c.currentOwnerRole}
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-surface-white border border-surface-border/80 text-xs">
            <span className="font-semibold text-teal-deep">Next Action:</span>
            <p className="text-body mt-0.5 leading-tight">{c.nextAction}</p>
          </div>
        </div>

        {/* Card 2: AI-Assisted Recommendation (Clearly labeled, Editable) */}
        <div className="p-4 rounded-card bg-surface-card border border-surface-border space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
              <Bot size={14} className="text-teal-brand" /> Suggested by AI
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-brand/10 text-teal-brand border border-teal-brand/20">
              Human-Approved
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-teal-brand/5 border border-teal-brand/20 text-xs space-y-1.5">
            {!editingAi ? (
              <>
                <p className="text-body font-medium leading-relaxed">
                  "{customAiText || c.aiSuggestedNextStep}"
                </p>
                <button
                  onClick={() => {
                    setCustomAiText(customAiText || c.aiSuggestedNextStep || "");
                    setEditingAi(true);
                  }}
                  className="text-[10px] font-semibold text-teal-brand hover:underline flex items-center gap-1"
                >
                  <Edit2 size={10} /> Edit Suggestion
                </button>
              </>
            ) : (
              <div className="space-y-1.5">
                <textarea
                  value={customAiText}
                  onChange={(e) => setCustomAiText(e.target.value)}
                  rows={2}
                  className="w-full text-xs p-1.5 rounded border border-surface-border bg-white focus:outline-none focus:ring-1 focus:ring-teal-brand"
                />
                <div className="flex gap-1.5 justify-end">
                  <Button size="sm" variant="ghost" onClick={() => setEditingAi(false)} className="text-[10px] h-6 px-2">
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => setEditingAi(false)} className="text-[10px] h-6 px-2 bg-teal-brand text-white">
                    Save
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-semibold text-muted">Delay Risk Score:</span>
              <span className="font-bold text-coral">{c.aiDelayRiskScore || 35}%</span>
            </div>
            <div className="w-full h-1.5 bg-surface-border rounded-full overflow-hidden">
              <div
                className="h-full bg-coral transition-all"
                style={{ width: `${c.aiDelayRiskScore || 35}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Loop Status & Closure Ring */}
        <div className="p-4 rounded-card bg-surface-card border border-surface-border flex items-center justify-between shadow-xs">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Loop Closure Status</span>
            <p className="text-xl font-extrabold text-teal-deep">
              {isClosed ? "Loop Closed ✓" : "Loop Open"}
            </p>
            <p className="text-xs text-muted max-w-[160px] leading-tight">
              {isClosed
                ? `Closed on ${formatDate(c.closedAt || c.createdAt)}`
                : "Tracking progress to verified treatment or surveillance"}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <LoopRing closed={isClosed} size={64} strokeWidth={6} />
            <span className="text-[10px] font-bold text-teal-brand mt-1 uppercase">
              {isClosed ? "Verified" : "In Progress"}
            </span>
          </div>
        </div>
      </div>

      {/* Case Lifecycle Tracker Horizontal Stepper */}
      <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-border pb-3">
          <div>
            <h3 className="font-bold text-teal-deep text-base">Case Lifecycle State Machine</h3>
            <p className="text-xs text-muted">
              Click any pending step to advance with documented audit justification. Conditional pathways skip inapplicable steps.
            </p>
          </div>
          <Badge variant="mint" className="text-xs font-semibold">
            Clinical Pathway: {c.pathwayType}
          </Badge>
        </div>

        <CaseStepper
          steps={c.steps}
          currentStepIndex={currentStepIdx}
          onStepClick={handleStepClick}
        />

        {/* Step Transition Modal confirmation */}
        {transitionTarget && (
          <div className="p-4 rounded-xl bg-mint-wash/70 border border-teal-brand/40 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-teal-deep">
                Advance Lifecycle Step to: <span className="text-teal-brand uppercase font-mono">{transitionTarget}</span>
              </p>
              <Badge variant="mint" className="text-xs capitalize">
                Actor: {currentUser.name} ({currentUser.role})
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <input
                type="text"
                value={transitionReason}
                onChange={(e) => setTransitionReason(e.target.value)}
                placeholder="Reason for advancing step (mandatory)..."
                className="w-full text-xs p-2 rounded-md border border-surface-border bg-white focus:outline-none focus:ring-1 focus:ring-teal-brand"
              />
              <input
                type="text"
                value={transitionNote}
                onChange={(e) => setTransitionNote(e.target.value)}
                placeholder="Optional clinical note / observation..."
                className="w-full text-xs p-2 rounded-md border border-surface-border bg-white focus:outline-none focus:ring-1 focus:ring-teal-brand"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="ghost" onClick={() => setTransitionTarget(null)} className="text-xs">
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmTransition}
                disabled={!transitionReason.trim()}
                className="bg-teal-brand text-white hover:bg-teal-hover text-xs font-semibold"
              >
                Confirm State Transition
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Main Two-Column Working Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Consults & Referral Packet */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Consult Thread */}
          <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-teal-brand" />
                <h3 className="font-bold text-teal-deep text-sm">Rapid Clinician-to-Clinician Consult</h3>
              </div>
              <Badge variant="mint" className="text-xs">
                {c.consults.length} Consults
              </Badge>
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
              <div className="pt-3 border-t border-surface-border space-y-2.5">
                <p className="text-xs font-bold text-teal-deep">Initiate New Specialist Consult</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <select
                    value={consultTo}
                    onChange={(e) => setConsultTo(e.target.value)}
                    className="p-2 rounded-md border border-surface-border bg-surface-white text-body focus:outline-none focus:ring-1 focus:ring-teal-brand sm:col-span-1"
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
                    className="p-2 rounded-md border border-surface-border bg-surface-white text-body focus:outline-none focus:ring-1 focus:ring-teal-brand sm:col-span-1"
                  >
                    <option value="routine">Routine Consult (48h)</option>
                    <option value="high">High Priority (24h)</option>
                    <option value="urgent">Urgent Clinical (4h)</option>
                  </select>

                  <Button
                    size="sm"
                    onClick={handleSendConsult}
                    disabled={!consultQuestion.trim()}
                    className="bg-teal-brand text-white hover:bg-teal-hover text-xs font-semibold sm:col-span-1"
                  >
                    Send Quick Consult
                  </Button>
                </div>

                <textarea
                  value={consultQuestion}
                  onChange={(e) => setConsultQuestion(e.target.value)}
                  placeholder="Pose specific clinical question regarding this screening finding and attached results..."
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-md border border-surface-border bg-surface-white focus:outline-none focus:ring-1 focus:ring-teal-brand"
                />
              </div>
            )}
          </div>

          {/* Referral Hand-off Packet */}
          <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <SendHorizontal size={18} className="text-teal-brand" />
                <h3 className="font-bold text-teal-deep text-sm">Referral Hand-Off Packet</h3>
              </div>
              {c.referral && (
                <span className="text-xs text-muted font-medium">
                  Specialty: <strong className="text-teal-deep">{c.referral.specialtyRequired}</strong>
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
              <div className="p-8 text-center border border-dashed border-surface-border rounded-xl bg-surface-white space-y-2">
                <SendHorizontal size={24} className="mx-auto text-muted/60" />
                <p className="text-xs font-semibold text-teal-deep">No Specialist Referral Transmitted Yet</p>
                <p className="text-[11px] text-muted max-w-sm mx-auto">
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
                    className="text-xs text-teal-brand border-teal-brand/30 mt-2"
                  >
                    <Plus size={13} className="mr-1" /> Assemble Referral Packet Now
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Closure Evidence & Certificate Section */}
          <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-teal-brand" />
                <h3 className="font-bold text-teal-deep text-sm">
                  {isClosed ? "Loop Closed Certificate ✓" : "Closure Evidence & Authorization"}
                </h3>
              </div>
              {isClosed && (
                <Badge variant="mint" className="text-xs font-bold">
                  Verified Loop Closed ✓
                </Badge>
              )}
            </div>

            {isClosed ? (
              /* Closed Loop Certificate Display */
              <div className="p-6 rounded-2xl bg-gradient-to-br from-mint-wash via-white to-mint-wash/60 border-2 border-mint-light space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-mint-light/60 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-teal-brand text-white flex items-center justify-center shadow-md">
                      <Award size={30} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className="text-lg font-extrabold text-teal-deep tracking-tight">
                        Screening-to-Care Loop Officially Closed
                      </h4>
                      <p className="text-xs text-muted">
                        Verified by <strong className="text-teal-deep">{c.closedByName || c.closedBy}</strong> on{" "}
                        {formatDateTime(c.closedAt || c.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-teal-brand tracking-wider">
                      Audit Stamp
                    </span>
                    <p className="font-mono text-xs font-bold text-teal-deep">CL-VERIFIED-{c.id}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-teal-deep uppercase tracking-wider">
                    Official Closure Decision:
                  </span>
                  <p className="text-xs text-body font-medium bg-white p-3 rounded-xl border border-mint-light">
                    "{c.closureReason || "Verified attended consultation with documented surveillance plan."}"
                  </p>
                </div>

                {/* Evidence on File */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-teal-deep uppercase tracking-wider">
                    Attached Evidence on File ({c.closureEvidence?.length || 0}):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {c.closureEvidence?.map((ev, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-white border border-surface-border space-y-1"
                      >
                        <span className="font-bold text-teal-brand capitalize text-[11px] block">
                          ✓ {ev.type.replace("-", " ")}
                        </span>
                        <p className="text-body text-xs font-medium">{ev.description}</p>
                        <p className="text-[10px] text-muted">
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
          </div>
        </div>

        {/* Right Column (1 span): Immutable Audit Trail & Notification Simulator */}
        <div className="space-y-6">
          {/* Audit Trail */}
          <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-teal-brand" />
                <h3 className="font-bold text-teal-deep text-sm">Immutable Audit Trail</h3>
              </div>
              <Badge variant="mint" className="text-xs">
                {c.audit.length} Logs
              </Badge>
            </div>

            <AuditTrail entries={c.audit} />
          </div>

          {/* Notification Simulator Drawer/Widget */}
          <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-teal-brand" />
                <h3 className="font-bold text-teal-deep text-sm">Notification Simulator</h3>
              </div>
              <span className="text-[10px] font-bold text-muted uppercase">Simulated</span>
            </div>

            <NotificationSimulator
              caseId={c.id}
              notifications={c.notifications}
              onSend={handleSendNotification}
              defaultRecipient={c.patientPhone}
            />
          </div>
        </div>
      </div>

      {/* Reassign Modal */}
      {reassignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-deep/50 backdrop-blur-2xs">
          <div className="bg-surface-card border border-surface-border rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-teal-deep">Reassign Case Accountability</h3>
            <p className="text-xs text-muted">
              Every open case must have one accountable staff member or triage queue.
            </p>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-teal-deep">Select New Accountable Owner</label>
              <select
                value={selectedNewOwner}
                onChange={(e) => setSelectedNewOwner(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-surface-border bg-white focus:outline-none focus:ring-1 focus:ring-teal-brand"
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
              <label className="font-bold text-teal-deep">Mandatory Reason for Transfer</label>
              <textarea
                value={reassignReason}
                onChange={(e) => setReassignReason(e.target.value)}
                placeholder="Reason for reassignment..."
                rows={2}
                className="w-full text-xs p-2 rounded-lg border border-surface-border bg-white focus:outline-none focus:ring-1 focus:ring-teal-brand"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button size="sm" variant="ghost" onClick={() => setReassignModalOpen(false)} className="text-xs">
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
                className="bg-teal-brand text-white hover:bg-teal-hover text-xs font-bold"
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
