import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Layers,
  Users,
  AlertTriangle,
  CheckCircle2,
  SendHorizontal,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard, StatusPill, IconButton } from "@/components/design-system";
import { useStore } from "@/lib/store";
import { getUsersByOrganization } from "@/lib/auth";

export const HodDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, getCasesForCurrentUser, reassign } = useStore();

  const cases = getCasesForCurrentUser();
  const departmentName = currentUser?.department || "Oncology";

  // Filter department cases
  const deptCases = cases.filter((c) => c.department === departmentName);
  const totalCases = deptCases.length;
  const openCases = deptCases.filter((c) => c.status === "open");
  const closedCases = deptCases.filter((c) => c.status === "closed");
  const unassignedCases = deptCases.filter((c) => c.sideState === "unassigned" || c.isQueueOwner);
  const overdueCases = deptCases.filter((c) => c.sideState === "overdue");
  const pendingReferrals = deptCases.filter((c) => c.referral && c.referral.status === "pending");

  // Get department coordinators for capacity tracking
  const orgUsers = currentUser?.organizationId
    ? getUsersByOrganization(currentUser.organizationId)
    : [];
  const coordinators = orgUsers.filter((u) => u.role === "coordinator");

  // Coordinator caseload distribution
  const coordinatorWorkloads = coordinators.map((coord) => {
    const assigned = deptCases.filter(
      (c) => c.currentOwner === coord.id && c.status === "open"
    );
    const overdue = assigned.filter((c) => c.sideState === "overdue");
    return {
      coordinator: coord,
      activeCount: assigned.length,
      overdueCount: overdue.length,
      capacityPct: Math.min(100, Math.round((assigned.length / 15) * 100)),
    };
  });

  const handleAssignCoordinator = (caseId: string, coordinatorId: string) => {
    reassign(
      caseId,
      coordinatorId,
      `HOD ${currentUser?.name || "Department Head"} assigned coordinator for expedited clinical triage.`
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/80">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <StatusPill variant="lavender" label="Department Command Center" size="sm" />
            <span className="text-xs text-[#798393] font-medium">
              {departmentName} &bull; Caseload &amp; Triage Control
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E2532] tracking-tight">
            {departmentName} Clinical Operations
          </h1>
          <p className="text-xs sm:text-sm text-[#798393] mt-1">
            Coordinator capacity, triage queue allocations, and high-risk case escalations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <IconButton
            icon={<ArrowRight size={18} className="text-[#1E2532]" />}
            label="Worklist"
            subtext="Full Queue"
            onClick={() => navigate("/coordinator")}
            variant="frosted"
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5 rounded-[26px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#798393] uppercase tracking-wider">
              Department Caseload
            </span>
            <span className="w-8 h-8 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#1E2532]">{totalCases}</span>
            <span className="text-xs font-semibold text-[#798393]">total screenings</span>
          </div>
          <p className="text-[11px] text-[#798393] mt-2 font-medium">
            {openCases.length} open &bull; {closedCases.length} verified closed
          </p>
        </GlassCard>

        <GlassCard className="p-5 rounded-[26px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#798393] uppercase tracking-wider">
              Unassigned Queue
            </span>
            <span className="w-8 h-8 rounded-full bg-amber-500/15 text-[#F59E0B] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#F59E0B]">{unassignedCases.length}</span>
            <span className="text-xs font-semibold text-[#798393]">need assignment</span>
          </div>
          <p className="text-[11px] text-[#798393] mt-2 font-medium">
            Awaiting dedicated coordinator assignment
          </p>
        </GlassCard>

        <GlassCard className="p-5 rounded-[26px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#798393] uppercase tracking-wider">
              Pending Specialist In
            </span>
            <span className="w-8 h-8 rounded-full bg-[#8B5CF6]/15 text-[#8B5CF6] flex items-center justify-center">
              <SendHorizontal className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#1E2532]">{pendingReferrals.length}</span>
            <span className="text-xs font-semibold text-[#798393]">awaiting consult</span>
          </div>
          <p className="text-[11px] text-[#798393] mt-2 font-medium">
            Biopsy or specialty referral packets dispatched
          </p>
        </GlassCard>

        <GlassCard className="p-5 rounded-[26px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#798393] uppercase tracking-wider">
              Overdue Follow-Ups
            </span>
            <span className="w-8 h-8 rounded-full bg-rose-500/15 text-[#EF4444] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#EF4444]">{overdueCases.length}</span>
            <span className="text-xs font-semibold text-[#798393]">breached SLA</span>
          </div>
          <p className="text-[11px] text-[#798393] mt-2 font-medium">
            Patient response or appointment delayed &gt; 72h
          </p>
        </GlassCard>
      </div>

      {/* Coordinator Caseload Balancing */}
      <GlassCard className="p-6 rounded-[26px]">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/80">
          <div>
            <h2 className="text-lg font-extrabold text-[#1E2532]">Coordinator Caseload &amp; Capacity</h2>
            <p className="text-xs text-[#798393]">
              Active workload balancing across assigned department navigators.
            </p>
          </div>
          <StatusPill variant="mint" label={`${coordinators.length} Navigators Active`} size="sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coordinatorWorkloads.map(({ coordinator, activeCount, overdueCount, capacityPct }) => (
            <div
              key={coordinator.id}
              className="p-5 rounded-2xl bg-white/70 border border-white/80 flex flex-col justify-between shadow-2xs hover:bg-white/90 hover:shadow-md hover:-translate-y-1 hover:border-white transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#8B5CF6]/20 to-[#10B981]/20 text-[#1E2532] font-bold text-xs flex items-center justify-center shadow-xs">
                      {coordinator.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#1E2532]">{coordinator.name}</h3>
                      <p className="text-[11px] text-[#798393]">{coordinator.facility}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#1E2532] bg-white px-2.5 py-1 rounded-full border border-white/80 shadow-2xs">
                    {activeCount} Cases
                  </span>
                </div>

                <div className="space-y-1.5 mt-4">
                  <div className="flex items-center justify-between text-xs text-[#798393]">
                    <span>Capacity Load</span>
                    <span className="font-semibold text-[#1E2532]">{capacityPct}%</span>
                  </div>
                  <div className="w-full bg-slate-200/60 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        capacityPct > 80 ? "bg-[#EF4444]" : "bg-[#10B981]"
                      }`}
                      style={{ width: `${capacityPct}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/80 flex items-center justify-between text-xs">
                <span>
                  {overdueCount > 0 ? (
                    <StatusPill variant="coral" label={`${overdueCount} Overdue`} size="sm" />
                  ) : (
                    <span className="text-[#10B981] font-semibold text-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> All cases within SLA
                    </span>
                  )}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate("/coordinator")}
                  className="text-xs h-7 px-3 text-[#1E2532] bg-white border-white/90 hover:bg-white/90 rounded-lg shadow-2xs"
                >
                  View Cases
                </Button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Unassigned Triage Queue (Actionable) */}
      <GlassCard className="p-6 rounded-[26px]">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/80">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#10B981]" />
            <h2 className="text-lg font-extrabold text-[#1E2532]">
              Unassigned Triage Queue ({unassignedCases.length})
            </h2>
          </div>
          <span className="text-xs text-[#798393]">1-Click Assign to Available Navigator</span>
        </div>

        {unassignedCases.length === 0 ? (
          <div className="p-8 text-center bg-white/50 rounded-2xl border border-white/80 text-xs text-[#798393]">
            <CheckCircle2 className="w-8 h-8 text-[#10B981] mx-auto mb-2" />
            <p className="font-bold text-[#1E2532]">All department cases have been assigned!</p>
            <p className="mt-0.5">No abnormal results are currently sitting unassigned in triage queues.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {unassignedCases.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-white/70 border border-white/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/90 hover:shadow-md hover:-translate-y-1 hover:border-white transition-all duration-300 shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[#1E2532]">{c.patientName}</span>
                    <span className="text-xs text-[#798393]">({c.id})</span>
                    <StatusPill variant={c.urgency === "urgent" ? "coral" : "amber"} label={c.screeningType} size="sm" />
                  </div>
                  <p className="text-xs text-[#1E2532] font-medium">{c.resultValue}</p>
                  <p className="text-[11px] text-[#798393]">
                    Ingested from {c.facility} &bull; Delay Risk Score: <strong>{c.aiDelayRiskScore || 50}/100</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {coordinators.map((coord) => (
                    <Button
                      key={coord.id}
                      size="sm"
                      onClick={() => handleAssignCoordinator(c.id, coord.id)}
                      className="bg-white hover:bg-white/90 text-[#1E2532] border border-white/90 text-xs h-8 px-3 font-semibold rounded-xl shadow-xs"
                    >
                      Assign to {coord.name.split(" ")[0]}
                    </Button>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/case/${c.id}`)}
                    className="text-xs h-8 px-3 text-[#798393] hover:text-[#1E2532] bg-white/50 border-white/80 rounded-xl"
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};