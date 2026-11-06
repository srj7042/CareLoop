import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  LayoutList,
  KanbanSquare,
  Clock,
  AlertTriangle,
  Users,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  RefreshCw,
  BellRing,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusChip, OwnerBadge, SLATimer, SideStateBadge } from "@/components/ui/chips";
import { GlassCard, IconButton, StatusPill } from "@/components/design-system";
import { useStore } from "@/lib/store";
import { allUsers, triageQueues } from "@/lib/cases";
import type { Urgency, SideState, Case } from "@/types";

const urgencyRank: Record<Urgency, number> = { urgent: 0, high: 1, routine: 2 };

export const CoordinatorWorklist = () => {
  const navigate = useNavigate();
  const { getCasesForCurrentUser, escalate, nudge, reassign, currentUser } = useStore();
  const cases = getCasesForCurrentUser();

  const [search, setSearch] = React.useState("");
  const [filterUrgency, setFilterUrgency] = React.useState<Urgency | "all">("all");
  const [filterSide, setFilterSide] = React.useState<SideState | "all">("all");
  const [filterProgram, setFilterProgram] = React.useState<string>("all");
  const [viewMode, setViewMode] = React.useState<"list" | "kanban">("list");

  // Modal states for action dialogs
  const [activeActionModal, setActiveActionModal] = React.useState<{
    type: "reassign" | "nudge" | "escalate";
    caseItem: Case;
  } | null>(null);
  const [actionReason, setActionReason] = React.useState("");
  const [selectedNewOwner, setSelectedNewOwner] = React.useState(allUsers[0]?.id || "usr_coord_sarah");

  // Filter open cases
  const openCases = cases.filter((c) => c.status === "open");

  // Quick stat counts
  const counts = {
    overdue: openCases.filter((c) => c.sideState === "overdue").length,
    rejected: openCases.filter((c) => c.sideState === "rejected").length,
    unassigned: openCases.filter((c) => c.sideState === "unassigned").length,
    escalated: openCases.filter((c) => c.sideState === "escalated").length,
  };

  const programs = Array.from(new Set(cases.map((c) => c.program)));

  const filteredCases = openCases
    .filter((c) => {
      if (search) {
        const q = search.toLowerCase();
        const matchesName = c.patientName.toLowerCase().includes(q);
        const matchesId = c.id.toLowerCase().includes(q);
        const matchesScreening = c.screeningType.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesScreening) return false;
      }
      if (filterUrgency !== "all" && c.urgency !== filterUrgency) return false;
      if (filterSide !== "all" && c.sideState !== filterSide) return false;
      if (filterProgram !== "all" && c.program !== filterProgram) return false;
      return true;
    })
    .sort((a, b) => {
      // Prioritize side states first (escalated, overdue, rejected, unassigned)
      const aPriority = a.sideState ? 0 : 1;
      const bPriority = b.sideState ? 0 : 1;
      if (aPriority !== bPriority) return aPriority - bPriority;

      // Next sort by urgency
      const diffUrgency = urgencyRank[a.urgency] - urgencyRank[b.urgency];
      if (diffUrgency !== 0) return diffUrgency;

      // Next sort by next action due date
      return new Date(a.nextActionDue).getTime() - new Date(b.nextActionDue).getTime();
    });

  const handleExecuteModalAction = () => {
    if (!activeActionModal) return;
    const { type, caseItem } = activeActionModal;
    const reason = actionReason.trim() || `Coordinator ${type} action executed`;

    if (type === "reassign") {
      reassign(caseItem.id, selectedNewOwner, reason);
    } else if (type === "nudge") {
      nudge(caseItem.id, reason);
    } else if (type === "escalate") {
      escalate(caseItem.id, reason);
    }

    setActiveActionModal(null);
    setActionReason("");
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Circular Action Items */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-[#1E2532]">Coordinator Worklist</h1>
            <StatusPill variant="mint" label={`${openCases.length} Active`} pulse size="sm" />
          </div>
          <p className="text-xs text-[#798393] mt-1 max-w-xl">
            Actionable screening results requiring active navigation. Overdue SLAs, rejected referrals, and unassigned queues surface first.
          </p>
        </div>

        {/* Action Items: Circular Frosted Action Buttons */}
        <div className="flex items-center gap-4 self-start md:self-auto">
          <IconButton
            icon={<Sparkles size={18} className="text-[#8B5CF6]" />}
            label="Priority"
            subtext="CASE-001"
            onClick={() => navigate("/case/CASE-001")}
            variant="lavender"
          />

          <IconButton
            icon={<BellRing size={18} className="text-[#EF4444]" />}
            label="Overdue"
            subtext={`${counts.overdue} SLA`}
            active={filterSide === "overdue"}
            onClick={() => setFilterSide(filterSide === "overdue" ? "all" : "overdue")}
            variant="frosted"
          />

          <IconButton
            icon={<Users size={18} className="text-[#F59E0B]" />}
            label="Queues"
            subtext={`${counts.unassigned} open`}
            active={filterSide === "unassigned"}
            onClick={() => setFilterSide(filterSide === "unassigned" ? "all" : "unassigned")}
            variant="frosted"
          />

          <IconButton
            icon={viewMode === "list" ? <KanbanSquare size={18} className="text-[#1E2532]" /> : <LayoutList size={18} className="text-[#1E2532]" />}
            label="Layout"
            subtext={viewMode === "list" ? "Kanban" : "Table"}
            onClick={() => setViewMode(viewMode === "list" ? "kanban" : "list")}
            variant="frosted"
          />
        </div>
      </div>

      {/* Quick Filter Stat Cards with Neumorphic Ambient Elevation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Overdue */}
        <GlassCard
          interactive
          onClick={() => setFilterSide(filterSide === "overdue" ? "all" : "overdue")}
          className={`p-4 transition-all ${
            filterSide === "overdue" ? "ring-2 ring-rose-400 bg-white" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#798393]">Overdue SLAs</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-pulse" />
          </div>
          <p className="text-3xl font-extrabold text-[#1E2532] mt-2 tracking-tight">{counts.overdue}</p>
          <p className="text-[11px] text-[#798393] mt-1 font-medium">Needs immediate nudge</p>
        </GlassCard>

        {/* Rejected Referrals */}
        <GlassCard
          interactive
          onClick={() => setFilterSide(filterSide === "rejected" ? "all" : "rejected")}
          className={`p-4 transition-all ${
            filterSide === "rejected" ? "ring-2 ring-rose-400 bg-white" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#798393]">Rejected Referrals</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
          </div>
          <p className="text-3xl font-extrabold text-[#1E2532] mt-2 tracking-tight">{counts.rejected}</p>
          <p className="text-[11px] text-[#798393] mt-1 font-medium">Needs alternative slot</p>
        </GlassCard>

        {/* Triage Queues */}
        <GlassCard
          interactive
          onClick={() => setFilterSide(filterSide === "unassigned" ? "all" : "unassigned")}
          className={`p-4 transition-all ${
            filterSide === "unassigned" ? "ring-2 ring-amber-400 bg-white" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#798393]">Triage Queues</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
          </div>
          <p className="text-3xl font-extrabold text-[#1E2532] mt-2 tracking-tight">{counts.unassigned}</p>
          <p className="text-[11px] text-[#798393] mt-1 font-medium">Awaiting assignment</p>
        </GlassCard>

        {/* Escalated */}
        <GlassCard
          interactive
          onClick={() => setFilterSide(filterSide === "escalated" ? "all" : "escalated")}
          className={`p-4 transition-all ${
            filterSide === "escalated" ? "ring-2 ring-purple-400 bg-white" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#798393]">Escalated</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
          </div>
          <p className="text-3xl font-extrabold text-[#1E2532] mt-2 tracking-tight">{counts.escalated}</p>
          <p className="text-[11px] text-[#798393] mt-1 font-medium">High clinical risk</p>
        </GlassCard>
      </div>

      {/* Filters & Search Controls Surface */}
      <GlassCard variant="default" className="p-4 rounded-[24px]">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          {/* Search box */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#798393]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient name, case ID (e.g. CASE-001), or screening test..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-white/80 bg-white/70 text-[#1E2532] placeholder-[#798393] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 shadow-2xs"
            />
          </div>

          {/* Urgency Filter */}
          <select
            value={filterUrgency}
            onChange={(e) => setFilterUrgency(e.target.value as any)}
            className="text-xs px-3.5 py-2 rounded-xl border border-white/80 bg-white/70 text-[#1E2532] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 shadow-2xs"
          >
            <option value="all">All Urgencies</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="routine">Routine</option>
          </select>

          {/* Program Filter */}
          <select
            value={filterProgram}
            onChange={(e) => setFilterProgram(e.target.value)}
            className="text-xs px-3.5 py-2 rounded-xl border border-white/80 bg-white/70 text-[#1E2532] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 shadow-2xs max-w-[200px]"
          >
            <option value="all">All Programs</option>
            {programs.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {/* Reset Filter Button */}
          {(filterUrgency !== "all" || filterSide !== "all" || filterProgram !== "all" || search) && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setSearch("");
                setFilterUrgency("all");
                setFilterSide("all");
                setFilterProgram("all");
              }}
              className="text-xs text-[#798393] hover:text-[#1E2532] rounded-xl"
            >
              Reset Filters
            </Button>
          )}

          {/* Table vs Kanban Toggle */}
          <div className="flex items-center border border-white/80 rounded-xl p-0.5 bg-white/60 shadow-2xs">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === "list"
                  ? "bg-white text-[#1E2532] shadow-xs"
                  : "text-[#798393] hover:text-[#1E2532]"
              }`}
            >
              <LayoutList size={14} />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === "kanban"
                  ? "bg-white text-[#1E2532] shadow-xs"
                  : "text-[#798393] hover:text-[#1E2532]"
              }`}
            >
              <KanbanSquare size={14} />
              <span>Kanban</span>
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Main View Render: Clean Border-Free List vs Kanban */}
      {viewMode === "list" ? (
        <GlassCard className="p-0 rounded-[26px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-white/40 border-b border-white/80 text-[#798393] font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-5">Case & Facility</th>
                  <th className="py-3.5 px-5">Patient Profile</th>
                  <th className="py-3.5 px-5">Screening Finding</th>
                  <th className="py-3.5 px-5">Urgency & State</th>
                  <th className="py-3.5 px-5">Current Owner</th>
                  <th className="py-3.5 px-5">Next Action Due</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/60">
                {filteredCases.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-white/60 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/case/${c.id}`)}
                  >
                    {/* Case ID */}
                    <td className="py-4 px-5 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1E2532] group-hover:text-[#8B5CF6] transition-colors">
                          {c.id}
                        </span>
                        {c.id === "CASE-001" && (
                          <StatusPill variant="lavender" label="Demo" size="sm" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#798393] truncate max-w-[150px] mt-0.5">{c.facility}</p>
                    </td>

                    {/* Patient */}
                    <td className="py-4 px-5">
                      <p className="font-bold text-[#1E2532]">{c.patientName}</p>
                      <p className="text-[11px] text-[#798393] mt-0.5">
                        {c.patientAge}y • {c.patientGender} • {c.patientLanguage.toUpperCase()}
                      </p>
                    </td>

                    {/* Screening Type */}
                    <td className="py-4 px-5">
                      <p className="font-semibold text-[#1E2532]">{c.screeningType}</p>
                      <p className="text-[11px] text-[#798393] truncate max-w-[180px] mt-0.5">{c.resultValue}</p>
                    </td>

                    {/* Urgency & Side State */}
                    <td className="py-4 px-5">
                      <div className="space-y-1">
                        <StatusChip urgency={c.urgency} />
                        {c.sideState && <div><SideStateBadge sideState={c.sideState} /></div>}
                      </div>
                    </td>

                    {/* Accountable Owner */}
                    <td className="py-4 px-5">
                      <OwnerBadge
                        owner={c.currentOwnerName}
                        role={c.currentOwnerRole}
                        isQueue={c.isQueueOwner}
                      />
                    </td>

                    {/* Next Action Due */}
                    <td className="py-4 px-5">
                      <p className="text-[11px] text-[#1E2532] font-medium truncate max-w-[180px]">
                        {c.nextAction}
                      </p>
                      <div className="mt-1">
                        <SLATimer dueAt={c.nextActionDue} />
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td
                      className="py-4 px-5 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setActiveActionModal({ type: "nudge", caseItem: c })
                          }
                          className="text-[11px] h-7 px-2.5 text-[#798393] hover:text-[#1E2532] hover:bg-white/80 rounded-lg"
                        >
                          Nudge
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setActiveActionModal({ type: "reassign", caseItem: c })
                          }
                          className="text-[11px] h-7 px-2.5 text-[#8B5CF6] hover:bg-[#8B5CF6]/10 rounded-lg font-semibold"
                        >
                          Reassign
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => navigate(`/case/${c.id}`)}
                          className="text-[11px] h-7 px-3 bg-white text-[#1E2532] hover:bg-white/90 border border-white/90 shadow-2xs font-semibold rounded-lg"
                        >
                          Review <ArrowRight size={12} className="ml-1" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredCases.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#798393]">
                      No cases match the selected search and filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      ) : (
        /* Kanban View by Lifecycle Progress */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              title: "1. Outreach & Acknowledging",
              statusKey: "notified",
              description: "Result issued; awaiting patient confirmation",
              cases: filteredCases.filter((c) => {
                const s = c.steps.find((x) => x.key === "acknowledged");
                return s && s.status !== "completed";
              }),
            },
            {
              title: "2. Confirmatory Workup",
              statusKey: "confirmation",
              description: "Biopsy, repeat screen, or confirmation labs",
              cases: filteredCases.filter((c) => {
                const ack = c.steps.find((x) => x.key === "acknowledged");
                const conf = c.steps.find((x) => x.key === "confirmation");
                const ref = c.steps.find((x) => x.key === "referral");
                return (
                  ack?.status === "completed" &&
                  conf &&
                  conf.status !== "completed" &&
                  conf.status !== "skipped"
                );
              }),
            },
            {
              title: "3. Referral & Booking",
              statusKey: "referral",
              description: "Specialist consultation & clinic appointments",
              cases: filteredCases.filter((c) => {
                const ref = c.steps.find((x) => x.key === "referral");
                const att = c.steps.find((x) => x.key === "attended");
                return (
                  (ref?.status === "completed" || ref?.status === "in-progress") &&
                  att?.status !== "completed"
                );
              }),
            },
            {
              title: "4. Attended & Loop Closure",
              statusKey: "treatment",
              description: "Attended appointment; pending closure evidence",
              cases: filteredCases.filter((c) => {
                const att = c.steps.find((x) => x.key === "attended");
                const closed = c.steps.find((x) => x.key === "closed");
                return att?.status === "completed" && closed?.status !== "completed";
              }),
            },
          ].map((column) => (
            <GlassCard
              key={column.title}
              variant="subtle"
              className="p-4 rounded-[26px] flex flex-col min-h-[500px]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/60">
                <div>
                  <h4 className="font-bold text-xs text-[#1E2532]">{column.title}</h4>
                  <p className="text-[10px] text-[#798393]">{column.description}</p>
                </div>
                <StatusPill variant="lavender" label={String(column.cases.length)} size="sm" />
              </div>

              <div className="flex-1 space-y-2.5 pt-3 overflow-y-auto">
                {column.cases.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => navigate(`/case/${c.id}`)}
                    className="p-3.5 rounded-[18px] border border-white/90 bg-white/90 backdrop-blur-md shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1E2532]">{c.id}</span>
                      <StatusChip urgency={c.urgency} />
                    </div>

                    <div>
                      <p className="font-bold text-[#1E2532]">{c.patientName}</p>
                      <p className="text-[11px] text-[#798393]">{c.screeningType}</p>
                    </div>

                    {c.sideState && (
                      <div>
                        <SideStateBadge sideState={c.sideState} />
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-[#798393] truncate max-w-[120px]">
                        {c.currentOwnerName}
                      </span>
                      <SLATimer dueAt={c.nextActionDue} />
                    </div>
                  </div>
                ))}

                {column.cases.length === 0 && (
                  <div className="py-8 text-center text-xs text-[#798393]/70">
                    No active cases in this stage
                  </div>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Action Dialog Modal for Nudge / Reassign / Escalate */}
      {activeActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-xl border border-white/80 rounded-[28px] shadow-[0_24px_48px_rgba(100,115,140,0.15)] w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1E2532] capitalize">
                {activeActionModal.type === "reassign"
                  ? "Reassign Case Accountability"
                  : activeActionModal.type === "nudge"
                  ? "Send Priority SLA Nudge"
                  : "Escalate Case to Senior Clinical Lead"}
              </h3>
              <StatusPill variant="lavender" label={activeActionModal.caseItem.id} size="sm" />
            </div>

            <p className="text-xs text-[#798393]">
              Patient: <strong className="text-[#1E2532]">{activeActionModal.caseItem.patientName}</strong> •{" "}
              {activeActionModal.caseItem.screeningType}
            </p>

            {activeActionModal.type === "reassign" && (
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-[#1E2532]">Select New Accountable Owner or Triage Queue</label>
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
            )}

            <div className="space-y-1 text-xs">
              <label className="font-bold text-[#1E2532]">Mandatory Audit Justification Reason</label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Document clinical or operational reason for this action..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-white/80 bg-white/80 text-[#1E2532] placeholder-[#798393] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 shadow-2xs"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setActiveActionModal(null)}
                className="text-xs rounded-xl text-[#798393]"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleExecuteModalAction}
                disabled={!actionReason.trim()}
                className="bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Confirm {activeActionModal.type}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};