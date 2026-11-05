import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  LayoutList,
  KanbanSquare,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Users,
  ShieldAlert,
  ArrowRight,
  Filter,
  UserCheck,
  Send,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatusChip, OwnerBadge, SLATimer, SideStateBadge } from "@/components/ui/chips";
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-teal-deep">Coordinator Worklist</h1>
            <Badge variant="mint" className="text-xs font-semibold">
              {openCases.length} Active Cases
            </Badge>
          </div>
          <p className="text-xs text-muted mt-1">
            Actionable screening results requiring active navigation. Overdue SLAs, rejected referrals, and unassigned queues surface first.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => navigate("/case/CASE-001")}
            className="bg-teal-brand text-white hover:bg-teal-hover text-xs font-semibold shadow-xs"
          >
            Open Priority Case (CASE-001)
          </Button>
        </div>
      </div>

      {/* Quick Filter Stat Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setFilterSide(filterSide === "overdue" ? "all" : "overdue")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            filterSide === "overdue"
              ? "bg-coral/20 border-coral text-coral ring-2 ring-coral/20 shadow-xs"
              : "bg-coral/10 border-coral/30 text-coral hover:bg-coral/15"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Overdue SLAs</span>
            <Clock size={16} />
          </div>
          <p className="text-2xl font-extrabold mt-1">{counts.overdue}</p>
          <p className="text-[11px] opacity-80 mt-0.5">Needs immediate nudge</p>
        </button>

        <button
          onClick={() => setFilterSide(filterSide === "rejected" ? "all" : "rejected")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            filterSide === "rejected"
              ? "bg-coral/20 border-coral text-coral ring-2 ring-coral/20 shadow-xs"
              : "bg-coral/10 border-coral/30 text-coral hover:bg-coral/15"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Rejected Referrals</span>
            <AlertTriangle size={16} />
          </div>
          <p className="text-2xl font-extrabold mt-1">{counts.rejected}</p>
          <p className="text-[11px] opacity-80 mt-0.5">Needs alternative slot</p>
        </button>

        <button
          onClick={() => setFilterSide(filterSide === "unassigned" ? "all" : "unassigned")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            filterSide === "unassigned"
              ? "bg-amber/25 border-amber text-[#8C5D00] ring-2 ring-amber/20 shadow-xs"
              : "bg-amber/10 border-amber/30 text-[#8C5D00] hover:bg-amber/15"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Triage Queues</span>
            <Users size={16} />
          </div>
          <p className="text-2xl font-extrabold mt-1">{counts.unassigned}</p>
          <p className="text-[11px] opacity-80 mt-0.5">Awaiting assignment</p>
        </button>

        <button
          onClick={() => setFilterSide(filterSide === "escalated" ? "all" : "escalated")}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            filterSide === "escalated"
              ? "bg-coral/20 border-coral text-coral ring-2 ring-coral/20 shadow-xs"
              : "bg-coral/10 border-coral/30 text-coral hover:bg-coral/15"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Escalated</span>
            <ShieldAlert size={16} />
          </div>
          <p className="text-2xl font-extrabold mt-1">{counts.escalated}</p>
          <p className="text-[11px] opacity-80 mt-0.5">High clinical risk</p>
        </button>
      </div>

      {/* Filters & Search Controls */}
      <div className="p-4 bg-surface-card border border-surface-border rounded-xl space-y-3 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          {/* Search box */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient name, case ID (e.g. CASE-001), or screening test..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-surface-border bg-surface-white focus:outline-none focus:ring-1 focus:ring-teal-brand"
            />
          </div>

          {/* Urgency Filter */}
          <select
            value={filterUrgency}
            onChange={(e) => setFilterUrgency(e.target.value as any)}
            className="text-xs px-3 py-2 rounded-lg border border-surface-border bg-surface-white text-body focus:outline-none focus:ring-1 focus:ring-teal-brand"
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
            className="text-xs px-3 py-2 rounded-lg border border-surface-border bg-surface-white text-body focus:outline-none focus:ring-1 focus:ring-teal-brand max-w-[200px]"
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
              className="text-xs text-muted hover:text-teal-deep"
            >
              Reset Filters
            </Button>
          )}

          {/* Table vs Kanban Toggle */}
          <div className="flex items-center border border-surface-border rounded-lg p-0.5 bg-surface-white">
            <button
              onClick={() => setViewMode("list")}
              className={`px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === "list"
                  ? "bg-white text-teal-deep shadow-2xs"
                  : "text-muted hover:text-teal-deep"
              }`}
            >
              <LayoutList size={14} />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === "kanban"
                  ? "bg-white text-teal-deep shadow-2xs"
                  : "text-muted hover:text-teal-deep"
              }`}
            >
              <KanbanSquare size={14} />
              <span>Kanban</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main View Render: List vs Kanban */}
      {viewMode === "list" ? (
        <div className="border border-surface-border rounded-xl bg-surface-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-white/80 border-b border-surface-border text-muted font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Case & Facility</th>
                  <th className="py-3 px-4">Patient Profile</th>
                  <th className="py-3 px-4">Screening Finding</th>
                  <th className="py-3 px-4">Urgency & State</th>
                  <th className="py-3 px-4">Current Owner</th>
                  <th className="py-3 px-4">Next Action Due</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filteredCases.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-mint-wash/30 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/case/${c.id}`)}
                  >
                    {/* Case ID */}
                    <td className="py-3.5 px-4 font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-teal-deep group-hover:text-teal-brand">
                          {c.id}
                        </span>
                        {c.id === "CASE-001" && (
                          <Badge variant="mint" className="text-[9px] px-1 py-0">
                            Demo
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-muted truncate max-w-[150px]">{c.facility}</p>
                    </td>

                    {/* Patient */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-teal-deep">{c.patientName}</p>
                      <p className="text-[11px] text-muted">
                        {c.patientAge}y • {c.patientGender} • Lang: {c.patientLanguage.toUpperCase()}
                      </p>
                    </td>

                    {/* Screening Type */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-body">{c.screeningType}</p>
                      <p className="text-[11px] text-muted truncate max-w-[180px]">{c.resultValue}</p>
                    </td>

                    {/* Urgency & Side State */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <StatusChip urgency={c.urgency} />
                        {c.sideState && <div><SideStateBadge sideState={c.sideState} /></div>}
                      </div>
                    </td>

                    {/* Accountable Owner */}
                    <td className="py-3.5 px-4">
                      <OwnerBadge
                        owner={c.currentOwnerName}
                        role={c.currentOwnerRole}
                        isQueue={c.isQueueOwner}
                      />
                    </td>

                    {/* Next Action Due */}
                    <td className="py-3.5 px-4">
                      <p className="text-[11px] text-body font-medium truncate max-w-[180px]">
                        {c.nextAction}
                      </p>
                      <div className="mt-1">
                        <SLATimer dueAt={c.nextActionDue} />
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td
                      className="py-3.5 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setActiveActionModal({ type: "nudge", caseItem: c })
                          }
                          className="text-[11px] h-7 px-2 text-muted hover:text-teal-deep"
                        >
                          Nudge
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setActiveActionModal({ type: "reassign", caseItem: c })
                          }
                          className="text-[11px] h-7 px-2 text-teal-brand hover:bg-mint-wash"
                        >
                          Reassign
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => navigate(`/case/${c.id}`)}
                          className="text-[11px] h-7 px-2.5 bg-teal-brand text-white hover:bg-teal-hover shadow-2xs font-semibold"
                        >
                          Review <ArrowRight size={12} className="ml-1" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredCases.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted">
                      No cases match the selected search and filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
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
            <div
              key={column.title}
              className="p-3.5 rounded-xl bg-surface-card border border-surface-border flex flex-col min-h-[500px]"
            >
              <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                <div>
                  <h4 className="font-bold text-xs text-teal-deep">{column.title}</h4>
                  <p className="text-[10px] text-muted">{column.description}</p>
                </div>
                <Badge variant="mint" className="text-[11px] font-bold">
                  {column.cases.length}
                </Badge>
              </div>

              <div className="flex-1 space-y-2.5 pt-3 overflow-y-auto">
                {column.cases.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => navigate(`/case/${c.id}`)}
                    className="p-3 rounded-lg border border-surface-border bg-white hover:border-teal-brand hover:shadow-xs transition-all cursor-pointer space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-teal-deep">{c.id}</span>
                      <StatusChip urgency={c.urgency} />
                    </div>

                    <div>
                      <p className="font-bold text-body">{c.patientName}</p>
                      <p className="text-[11px] text-muted">{c.screeningType}</p>
                    </div>

                    {c.sideState && (
                      <div>
                        <SideStateBadge sideState={c.sideState} />
                      </div>
                    )}

                    <div className="pt-1.5 border-t border-surface-border/60 flex items-center justify-between text-[11px]">
                      <span className="text-muted truncate max-w-[120px]">
                        {c.currentOwnerName}
                      </span>
                      <SLATimer dueAt={c.nextActionDue} />
                    </div>
                  </div>
                ))}

                {column.cases.length === 0 && (
                  <div className="py-8 text-center text-xs text-muted/70">
                    No active cases in this stage
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Dialog Modal for Nudge / Reassign / Escalate */}
      {activeActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-deep/50 backdrop-blur-2xs">
          <div className="bg-surface-card border border-surface-border rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-teal-deep capitalize">
                {activeActionModal.type === "reassign"
                  ? "Reassign Case Accountability"
                  : activeActionModal.type === "nudge"
                  ? "Send Priority SLA Nudge"
                  : "Escalate Case to Senior Clinical Lead"}
              </h3>
              <Badge variant="mint" className="text-xs">
                {activeActionModal.caseItem.id}
              </Badge>
            </div>

            <p className="text-xs text-muted">
              Patient: <strong>{activeActionModal.caseItem.patientName}</strong> •{" "}
              {activeActionModal.caseItem.screeningType}
            </p>

            {activeActionModal.type === "reassign" && (
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-teal-deep">Select New Accountable Owner or Triage Queue</label>
                <select
                  value={selectedNewOwner}
                  onChange={(e) => setSelectedNewOwner(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-surface-border bg-white focus:outline-none focus:ring-1 focus:ring-teal-brand"
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
              <label className="font-bold text-teal-deep">Mandatory Audit Justification Reason</label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Document clinical or operational reason for this action..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-lg border border-surface-border bg-white focus:outline-none focus:ring-1 focus:ring-teal-brand"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setActiveActionModal(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleExecuteModalAction}
                disabled={!actionReason.trim()}
                className="bg-teal-brand text-white hover:bg-teal-hover text-xs font-bold"
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
