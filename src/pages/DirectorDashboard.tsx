import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Users,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { SYSTEM_ORGANIZATIONS } from "@/lib/auth";

export const DirectorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, getCasesForCurrentUser } = useStore();

  const cases = getCasesForCurrentUser();
  const userOrg =
    SYSTEM_ORGANIZATIONS.find((o) => o.id === currentUser?.organizationId) ||
    SYSTEM_ORGANIZATIONS[0];

  const [selectedDept, setSelectedDept] = React.useState<string>("all");

  const departments = [
    "Oncology",
    "Cardiology",
    "Primary Care",
    "Women's Health",
  ];

  // Filter cases based on department selection
  const filteredCases = cases.filter((c) => {
    if (selectedDept !== "all" && c.department !== selectedDept) return false;
    return true;
  });

  const totalCases = filteredCases.length;
  const closedCases = filteredCases.filter((c) => c.status === "closed");
  const openCases = filteredCases.filter((c) => c.status === "open");
  const overdueCases = filteredCases.filter((c) => c.sideState === "overdue");
  const escalatedCases = filteredCases.filter((c) => c.sideState === "escalated" || c.urgency === "urgent");
  const loopClosureRate = totalCases ? Math.round((closedCases.length / totalCases) * 100) : 0;

  // Department comparative metrics
  const departmentStats = departments.map((dept) => {
    const deptCases = cases.filter((c) => c.department === dept);
    const deptClosed = deptCases.filter((c) => c.status === "closed");
    const deptOverdue = deptCases.filter((c) => c.sideState === "overdue");
    const deptEscalated = deptCases.filter((c) => c.sideState === "escalated");
    const rate = deptCases.length ? Math.round((deptClosed.length / deptCases.length) * 100) : 0;

    return {
      department: dept,
      total: deptCases.length,
      closed: deptClosed.length,
      overdue: deptOverdue.length,
      escalated: deptEscalated.length,
      closureRate: rate,
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="mint" className="text-[10px] font-semibold">
              <Building2 className="w-3 h-3 mr-1 inline" />
              Executive Medical Directorate
            </Badge>
            <span className="text-xs text-muted font-medium">
              {userOrg.name} &bull; System-Wide Oversight
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-teal-deep tracking-tight">
            Executive Screening &amp; Closed-Loop Performance
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Institutional overview of diagnostic continuum, departmental throughput, and SLA compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-surface-white border border-surface-border text-xs text-muted flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Target SLA: &lt; {userOrg.slaHoursThreshold}h Resolution</span>
          </div>
        </div>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              Loop Closure Rate
            </span>
            <span className="p-1.5 rounded-lg bg-mint-wash text-teal-brand">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-teal-deep">{loopClosureRate}%</span>
            <span className="text-xs font-semibold text-emerald-600">+4.2% this quarter</span>
          </div>
          <p className="text-[11px] text-muted mt-2">
            {closedCases.length} of {totalCases} abnormal findings verified closed
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              Mean Time to Action
            </span>
            <span className="p-1.5 rounded-lg bg-teal-brand/10 text-teal-brand">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-teal-deep">38.4h</span>
            <span className="text-xs font-semibold text-emerald-600">&lt; 72h benchmark</span>
          </div>
          <p className="text-[11px] text-muted mt-2">
            Initial patient notification &amp; acknowledgement speed
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              High-Risk Escalations
            </span>
            <span className="p-1.5 rounded-lg bg-coral/15 text-coral">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-coral">{escalatedCases.length}</span>
            <span className="text-xs font-semibold text-muted">require attention</span>
          </div>
          <p className="text-[11px] text-muted mt-2">
            Urgent findings or multi-attempt communication stalls
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              Active Caseload
            </span>
            <span className="p-1.5 rounded-lg bg-mint-wash text-teal-brand">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-teal-deep">{openCases.length}</span>
            <span className="text-xs font-semibold text-muted">across 4 departments</span>
          </div>
          <p className="text-[11px] text-muted mt-2">
            Active patient pathways currently navigating care
          </p>
        </div>
      </div>

      {/* Department Performance Matrix */}
      <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-border">
          <div>
            <h2 className="text-lg font-extrabold text-teal-deep">Departmental Performance Comparison</h2>
            <p className="text-xs text-muted">
              Benchmark loop closure rates, active volumes, and SLA breaches by clinical service line.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedDept("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedDept === "all"
                  ? "bg-teal-deep text-white shadow-2xs"
                  : "bg-surface-white text-muted hover:text-teal-deep border border-surface-border"
              }`}
            >
              All Departments
            </button>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedDept === dept
                    ? "bg-teal-deep text-white shadow-2xs"
                    : "bg-surface-white text-muted hover:text-teal-deep border border-surface-border"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-surface-border text-muted font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Department / Service Line</th>
                <th className="py-3 px-4">Active Cases</th>
                <th className="py-3 px-4">Verified Closed</th>
                <th className="py-3 px-4">Loop Closure %</th>
                <th className="py-3 px-4">Overdue Flag</th>
                <th className="py-3 px-4">Escalations</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {departmentStats.map((row) => (
                <tr key={row.department} className="hover:bg-mint-wash/30 transition-colors">
                  <td className="py-4 px-4 font-bold text-teal-deep text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-brand" />
                    {row.department}
                  </td>
                  <td className="py-4 px-4 font-semibold text-body">{row.total}</td>
                  <td className="py-4 px-4 font-semibold text-body">{row.closed}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-surface-border h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-teal-brand h-full rounded-full transition-all"
                          style={{ width: `${row.closureRate}%` }}
                        />
                      </div>
                      <span className="font-bold text-teal-deep">{row.closureRate}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {row.overdue > 0 ? (
                      <Badge variant="coral" className="text-[10px]">
                        {row.overdue} Overdue
                      </Badge>
                    ) : (
                      <span className="text-muted font-medium">0</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {row.escalated > 0 ? (
                      <Badge variant="amber" className="text-[10px]">
                        {row.escalated} Escalated
                      </Badge>
                    ) : (
                      <span className="text-muted font-medium">0</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate("/coordinator")}
                      className="text-xs h-8 px-3 text-teal-deep border-surface-border hover:bg-mint-wash"
                    >
                      Inspect Queue
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Critical Escalations Queue for Director Review */}
      <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-coral" />
            <h2 className="text-lg font-extrabold text-teal-deep">Executive Escalation Watchlist</h2>
          </div>
          <Badge variant="coral" className="text-[11px]">
            {escalatedCases.length} Critical Actions Pending
          </Badge>
        </div>

        <div className="space-y-3">
          {escalatedCases.slice(0, 5).map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-xl bg-surface-white border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-teal-brand/40 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-teal-deep">{c.patientName}</span>
                  <span className="text-xs text-muted">({c.id})</span>
                  <Badge variant={c.urgency === "urgent" ? "coral" : "amber"} className="text-[10px]">
                    {c.screeningType}
                  </Badge>
                  <span className="text-xs text-muted font-medium">&bull; {c.department}</span>
                </div>
                <p className="text-xs text-body font-medium">{c.resultValue}</p>
                <p className="text-[11px] text-coral font-semibold flex items-center gap-1">
                  <span>Current Bottleneck:</span>
                  <span>{c.nextAction}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  onClick={() => navigate(`/case/${c.id}`)}
                  className="bg-teal-deep hover:bg-teal-brand text-white text-xs h-8 px-3 font-semibold"
                >
                  Review Case
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
