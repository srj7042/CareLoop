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
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard, StatusPill, IconButton } from "@/components/design-system";
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/80">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <StatusPill variant="lavender" label="Executive Medical Directorate" size="sm" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E2532] tracking-tight">
            Executive Screening &amp; Closed-Loop Performance
          </h1>
          <p className="text-xs sm:text-sm text-[#798393] mt-1">
            Institutional overview of diagnostic continuum, departmental throughput, and SLA compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <IconButton
            icon={<ChevronRight size={18} className="text-[#1E2532]" />}
            label="Worklist"
            subtext="Triage Caseload"
            onClick={() => navigate("/coordinator")}
            variant="frosted"
          />
        </div>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <GlassCard className="p-5 rounded-[26px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#798393] uppercase tracking-wider">
              Loop Closure Rate
            </span>
            <span className="w-8 h-8 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#1E2532]">{loopClosureRate}%</span>
            <span className="text-xs font-semibold text-[#10B981] flex items-center">
              <TrendingUp size={12} className="mr-0.5 inline" /> +4.2%
            </span>
          </div>
          <p className="text-[11px] text-[#798393] mt-2 font-medium">
            {closedCases.length} of {totalCases} abnormal findings verified closed
          </p>
        </GlassCard>

        {/* KPI 2 */}
        <GlassCard className="p-5 rounded-[26px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#798393] uppercase tracking-wider">
              Mean Time to Action
            </span>
            <span className="w-8 h-8 rounded-full bg-[#8B5CF6]/15 text-[#8B5CF6] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#1E2532]">38.4h</span>
            <span className="text-xs font-semibold text-[#10B981]">&lt; 72h benchmark</span>
          </div>
          <p className="text-[11px] text-[#798393] mt-2 font-medium">
            Initial patient notification &amp; acknowledgement speed
          </p>
        </GlassCard>

        {/* KPI 3 */}
        <GlassCard className="p-5 rounded-[26px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#798393] uppercase tracking-wider">
              High-Risk Escalations
            </span>
            <span className="w-8 h-8 rounded-full bg-rose-500/15 text-[#EF4444] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#EF4444]">{escalatedCases.length}</span>
            <span className="text-xs font-semibold text-[#798393]">require attention</span>
          </div>
          <p className="text-[11px] text-[#798393] mt-2 font-medium">
            Urgent findings or multi-attempt communication stalls
          </p>
        </GlassCard>

        {/* KPI 4 */}
        <GlassCard className="p-5 rounded-[26px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#798393] uppercase tracking-wider">
              Active Caseload
            </span>
            <span className="w-8 h-8 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#1E2532]">{openCases.length}</span>
            <span className="text-xs font-semibold text-[#798393]">across 4 departments</span>
          </div>
          <p className="text-[11px] text-[#798393] mt-2 font-medium">
            Active patient pathways currently navigating care
          </p>
        </GlassCard>
      </div>

      {/* Department Performance Matrix */}
      <GlassCard className="p-6 rounded-[26px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/80">
          <div>
            <h2 className="text-lg font-extrabold text-[#1E2532]">Departmental Performance Comparison</h2>
            <p className="text-xs text-[#798393]">
              Benchmark loop closure rates, active volumes, and SLA breaches by clinical service line.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedDept("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDept === "all"
                  ? "bg-white text-[#1E2532] shadow-xs border border-white"
                  : "bg-white/60 text-[#798393] hover:text-[#1E2532]"
              }`}
            >
              All Departments
            </button>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedDept === dept
                    ? "bg-white text-[#1E2532] shadow-xs border border-white"
                    : "bg-white/60 text-[#798393] hover:text-[#1E2532]"
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
              <tr className="border-b border-white/80 text-[#798393] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Department / Service Line</th>
                <th className="py-3.5 px-4">Active Cases</th>
                <th className="py-3.5 px-4">Verified Closed</th>
                <th className="py-3.5 px-4">Loop Closure %</th>
                <th className="py-3.5 px-4">Overdue Flag</th>
                <th className="py-3.5 px-4">Escalations</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60">
              {departmentStats.map((row) => (
                <tr key={row.department} className="hover:bg-white/60 transition-colors">
                  <td className="py-4 px-4 font-bold text-[#1E2532] text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                    {row.department}
                  </td>
                  <td className="py-4 px-4 font-semibold text-[#1E2532]">{row.total}</td>
                  <td className="py-4 px-4 font-semibold text-[#1E2532]">{row.closed}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-200/60 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#8B5CF6] to-[#10B981] h-full rounded-full transition-all"
                          style={{ width: `${row.closureRate}%` }}
                        />
                      </div>
                      <span className="font-bold text-[#1E2532]">{row.closureRate}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {row.overdue > 0 ? (
                      <StatusPill variant="coral" label={`${row.overdue} Overdue`} size="sm" />
                    ) : (
                      <span className="text-[#798393] font-medium">0</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {row.escalated > 0 ? (
                      <StatusPill variant="amber" label={`${row.escalated} Escalated`} size="sm" />
                    ) : (
                      <span className="text-[#798393] font-medium">0</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate("/coordinator")}
                      className="text-xs h-8 px-3 text-[#1E2532] bg-white/80 border-white/90 hover:bg-white rounded-xl shadow-2xs font-semibold"
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
      </GlassCard>

      {/* Critical Escalations Queue for Director Review */}
      <GlassCard className="p-6 rounded-[26px]">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/80">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
            <h2 className="text-lg font-extrabold text-[#1E2532]">Executive Escalation Watchlist</h2>
          </div>
          <StatusPill variant="coral" label={`${escalatedCases.length} Critical Pending`} size="sm" pulse />
        </div>

        <div className="space-y-3">
          {escalatedCases.slice(0, 5).map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-2xl bg-white/70 border border-white/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/90 transition-all shadow-2xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-[#1E2532]">{c.patientName}</span>
                  <span className="text-xs text-[#798393]">({c.id})</span>
                  <StatusPill variant={c.urgency === "urgent" ? "coral" : "amber"} label={c.screeningType} size="sm" />
                  <span className="text-xs text-[#798393] font-medium">&bull; {c.department}</span>
                </div>
                <p className="text-xs text-[#1E2532] font-medium">{c.resultValue}</p>
                <p className="text-[11px] text-[#EF4444] font-semibold flex items-center gap-1">
                  <span>Current Bottleneck:</span>
                  <span>{c.nextAction}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  onClick={() => navigate(`/case/${c.id}`)}
                  className="bg-white text-[#1E2532] hover:bg-white/90 border border-white/90 text-xs h-8 px-3 font-semibold rounded-xl shadow-xs"
                >
                  Review Case
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};