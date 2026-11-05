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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="teal" className="text-[10px] font-semibold">
              <Layers className="w-3 h-3 mr-1 inline" />
              Department Command Center
            </Badge>
            <span className="text-xs text-muted font-medium">
              {departmentName} Department &bull; Caseload &amp; Triage Control
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-teal-deep tracking-tight">
            {departmentName} Clinical Operations
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Coordinator capacity, triage queue allocations, and high-risk case escalations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={() => navigate("/coordinator")}
            className="bg-teal-brand hover:bg-teal-hover text-white font-bold text-xs h-9 px-4 rounded-xl shadow-2xs"
          >
            Open Full Worklist
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              Department Caseload
            </span>
            <span className="p-1.5 rounded-lg bg-mint-wash text-teal-brand">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-teal-deep">{totalCases}</span>
            <span className="text-xs font-semibold text-muted">total screenings</span>
          </div>
          <p className="text-[11px] text-muted mt-2">
            {openCases.length} open pathways &bull; {closedCases.length} verified closed
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              Unassigned Queue
            </span>
            <span className="p-1.5 rounded-lg bg-amber/15 text-[#8C5D00]">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#8C5D00]">{unassignedCases.length}</span>
            <span className="text-xs font-semibold text-muted">need assignment</span>
          </div>
          <p className="text-[11px] text-muted mt-2">
            Awaiting dedicated coordinator assignment
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              Pending Specialist In
            </span>
            <span className="p-1.5 rounded-lg bg-teal-brand/10 text-teal-brand">
              <SendHorizontal className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-teal-deep">{pendingReferrals.length}</span>
            <span className="text-xs font-semibold text-muted">awaiting consult</span>
          </div>
          <p className="text-[11px] text-muted mt-2">
            Biopsy or specialty referral packets dispatched
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              Overdue Follow-Ups
            </span>
            <span className="p-1.5 rounded-lg bg-coral/15 text-coral">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-coral">{overdueCases.length}</span>
            <span className="text-xs font-semibold text-muted">breached SLA</span>
          </div>
          <p className="text-[11px] text-muted mt-2">
            Patient response or appointment delayed &gt; 72h
          </p>
        </div>
      </div>

      {/* Coordinator Caseload Balancing */}
      <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-border">
          <div>
            <h2 className="text-lg font-extrabold text-teal-deep">Coordinator Caseload &amp; Capacity</h2>
            <p className="text-xs text-muted">
              Active workload balancing across assigned department navigators.
            </p>
          </div>
          <Badge variant="mint" className="text-xs font-semibold">
            {coordinators.length} Navigators Active
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coordinatorWorkloads.map(({ coordinator, activeCount, overdueCount, capacityPct }) => (
            <div
              key={coordinator.id}
              className="p-5 rounded-xl bg-surface-white border border-surface-border flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-teal-brand/10 text-teal-brand font-bold text-xs flex items-center justify-center">
                      {coordinator.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-teal-deep">{coordinator.name}</h3>
                      <p className="text-[11px] text-muted">{coordinator.facility}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-teal-deep">{activeCount} Cases</span>
                </div>

                <div className="space-y-1.5 mt-4">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>Capacity Load</span>
                    <span className="font-semibold">{capacityPct}%</span>
                  </div>
                  <div className="w-full bg-surface-border h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        capacityPct > 80 ? "bg-coral" : "bg-teal-brand"
                      }`}
                      style={{ width: `${capacityPct}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between text-xs">
                <span className="text-muted">
                  {overdueCount > 0 ? (
                    <strong className="text-coral font-bold">{overdueCount} Overdue</strong>
                  ) : (
                    <span className="text-emerald-600 font-medium">All cases within SLA</span>
                  )}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate("/coordinator")}
                  className="text-xs h-7 px-2.5 text-teal-deep border-surface-border"
                >
                  View Cases
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unassigned Triage Queue (Actionable) */}
      <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-teal-brand" />
            <h2 className="text-lg font-extrabold text-teal-deep">
              Unassigned Triage Queue ({unassignedCases.length})
            </h2>
          </div>
          <span className="text-xs text-muted">1-Click Assign to Available Navigator</span>
        </div>

        {unassignedCases.length === 0 ? (
          <div className="p-8 text-center bg-surface-white rounded-xl border border-surface-border text-xs text-muted">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="font-bold text-teal-deep">All department cases have been assigned!</p>
            <p>No abnormal results are currently sitting unassigned in triage queues.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {unassignedCases.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl bg-surface-white border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-teal-deep">{c.patientName}</span>
                    <span className="text-xs text-muted">({c.id})</span>
                    <Badge variant={c.urgency === "urgent" ? "coral" : "amber"} className="text-[10px]">
                      {c.screeningType}
                    </Badge>
                  </div>
                  <p className="text-xs text-body font-medium">{c.resultValue}</p>
                  <p className="text-[11px] text-muted">
                    Ingested from {c.facility} &bull; Delay Risk Score: <strong>{c.aiDelayRiskScore || 50}/100</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {coordinators.map((coord) => (
                    <Button
                      key={coord.id}
                      size="sm"
                      onClick={() => handleAssignCoordinator(c.id, coord.id)}
                      className="bg-teal-deep hover:bg-teal-brand text-white text-xs h-8 px-3 font-semibold"
                    >
                      Assign to {coord.name.split(" ")[0]}
                    </Button>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/case/${c.id}`)}
                    className="text-xs h-8 px-2.5 text-muted border-surface-border"
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
