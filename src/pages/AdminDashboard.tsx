import * as React from "react";
import { useSearchParams } from "react-router-dom";
import {
  ShieldCheck,
  Building2,
  Users,
  FileText,
  Activity,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GlassCard, StatusPill } from "@/components/design-system";
import { useStore } from "@/lib/store";
import { SYSTEM_ORGANIZATIONS, REGISTERED_ACCOUNTS } from "@/lib/auth";
import { ROLE_PERMISSIONS } from "@/lib/permissions";

export const AdminDashboard: React.FC = () => {
  const { cases } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get("tab");
  const activeTab: "organizations" | "users" | "security" =
    tabParam === "users" || tabParam === "security" ? tabParam : "organizations";

  const handleTabChange = (tab: "organizations" | "users" | "security") => {
    setSearchParams({ tab });
  };

  const [userSearch, setUserSearch] = React.useState("");

  const organizations = SYSTEM_ORGANIZATIONS;
  const users = REGISTERED_ACCOUNTS;

  // Filter users by search
  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      u.organizationName.toLowerCase().includes(q)
    );
  });

  // System-wide metrics
  const totalCases = cases.length;
  const closedCases = cases.filter((c) => c.status === "closed").length;
  const closureRate = totalCases ? Math.round((closedCases / totalCases) * 100) : 0;
  const totalAudits = cases.reduce((acc, c) => acc + c.audit.length, 0);

  // Collect recent audit actions across all cases
  const allAudits = cases
    .flatMap((c) =>
      c.audit.map((a) => ({
        ...a,
        casePatient: c.patientName,
        caseType: c.screeningType,
        orgId: c.organizationId,
      }))
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 15);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/80">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <StatusPill variant="lavender" label="Master System Administration" size="sm" />
            <span className="text-xs text-[#798393] font-medium">Enterprise Governance &amp; Security</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E2532] tracking-tight">
            System Administration &amp; Multi-Tenant RBAC
          </h1>
          <p className="text-xs sm:text-sm text-[#798393] mt-1">
            Manage healthcare tenant organizations, clinical user accounts, and immutable audit logs.
          </p>
        </div>
      </div>

      {/* Admin KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5 rounded-[26px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#798393] uppercase tracking-wider">
              Tenant Organizations
            </span>
            <span className="w-8 h-8 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#1E2532]">{organizations.length}</span>
            <span className="text-xs font-semibold text-[#10B981]">Isolated</span>
          </div>
          <p className="text-[11px] text-[#798393] mt-2 font-medium">
            Apex Health System &bull; Metro Health Network
          </p>
        </GlassCard>

        <GlassCard className="p-5 rounded-[26px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#798393] uppercase tracking-wider">
              Active User Accounts
            </span>
            <span className="w-8 h-8 rounded-full bg-[#8B5CF6]/15 text-[#8B5CF6] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#1E2532]">{users.length}</span>
            <span className="text-xs font-semibold text-[#798393]">across 7 roles</span>
          </div>
          <p className="text-[11px] text-[#798393] mt-2 font-medium">
            100% individual RBAC credentialed accounts
          </p>
        </GlassCard>

        <GlassCard className="p-5 rounded-[26px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#798393] uppercase tracking-wider">
              System Closed Loop %
            </span>
            <span className="w-8 h-8 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#1E2532]">{closureRate}%</span>
            <span className="text-xs font-semibold text-[#10B981]">Global</span>
          </div>
          <p className="text-[11px] text-[#798393] mt-2 font-medium">
            {closedCases} of {totalCases} cases closed with verified evidence
          </p>
        </GlassCard>

        <GlassCard className="p-5 rounded-[26px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#798393] uppercase tracking-wider">
              Security Audit Logs
            </span>
            <span className="w-8 h-8 rounded-full bg-slate-900/10 text-[#1E2532] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#1E2532]">{totalAudits}</span>
            <span className="text-xs font-semibold text-[#798393]">Immutable events</span>
          </div>
          <p className="text-[11px] text-[#798393] mt-2 font-medium">
            Full provenance tracking on all transitions
          </p>
        </GlassCard>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-white/80 pb-2">
        <button
          onClick={() => handleTabChange("organizations")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "organizations"
              ? "bg-white text-[#1E2532] shadow-sm border border-white"
              : "bg-white/60 text-[#798393] hover:text-[#1E2532]"
          }`}
        >
          <Building2 className="w-3.5 h-3.5 mr-1.5 inline" />
          Health Organizations ({organizations.length})
        </button>

        <button
          onClick={() => handleTabChange("users")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "users"
              ? "bg-white text-[#1E2532] shadow-sm border border-white"
              : "bg-white/60 text-[#798393] hover:text-[#1E2532]"
          }`}
        >
          <Users className="w-3.5 h-3.5 mr-1.5 inline" />
          User Directory &amp; RBAC ({users.length})
        </button>

        <button
          onClick={() => handleTabChange("security")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "security"
              ? "bg-white text-[#1E2532] shadow-sm border border-white"
              : "bg-white/60 text-[#798393] hover:text-[#1E2532]"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 mr-1.5 inline" />
          Security &amp; Audit Trail ({allAudits.length})
        </button>
      </div>

      {/* Tab 1: Organizations */}
      {activeTab === "organizations" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-150">
          {organizations.map((org) => {
            const orgCases = cases.filter((c) => c.organizationId === org.id);
            const orgClosed = orgCases.filter((c) => c.status === "closed");
            const orgUsers = users.filter((u) => u.organizationId === org.id);

            return (
              <GlassCard
                key={org.id}
                className="p-6 rounded-[26px] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8B5CF6]/20 to-[#10B981]/20 text-[#1E2532] font-black text-sm flex items-center justify-center shadow-xs">
                        {org.code}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-[#1E2532]">{org.name}</h3>
                        <p className="text-xs text-[#798393] capitalize">
                          {org.type.replace("_", " ")} &bull; ID: {org.id}
                        </p>
                      </div>
                    </div>
                    <StatusPill variant="mint" label="Active Tenant" size="sm" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 my-4 p-3.5 rounded-2xl bg-white/70 border border-white/80 text-center shadow-2xs">
                    <div>
                      <span className="text-base font-black text-[#1E2532]">{orgUsers.length}</span>
                      <p className="text-[10px] text-[#798393] uppercase font-bold">Staff</p>
                    </div>
                    <div>
                      <span className="text-base font-black text-[#1E2532]">{orgCases.length}</span>
                      <p className="text-[10px] text-[#798393] uppercase font-bold">Cases</p>
                    </div>
                    <div>
                      <span className="text-base font-black text-[#10B981]">
                        {orgCases.length ? Math.round((orgClosed.length / orgCases.length) * 100) : 0}%
                      </span>
                      <p className="text-[10px] text-[#798393] uppercase font-bold">Closed Loop</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <span className="font-bold text-[#1E2532]">Clinical Departments:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {org.departments.map((dept) => (
                          <span
                            key={dept}
                            className="px-2.5 py-0.5 rounded-full bg-white/80 text-[#1E2532] text-[11px] font-medium border border-white/80 shadow-2xs"
                          >
                            {dept}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className="font-bold text-[#1E2532]">Active Screening Programs:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {org.activeScreeningPrograms.map((prog) => (
                          <span
                            key={prog}
                            className="px-2.5 py-0.5 rounded-full bg-white/80 text-[#798393] text-[11px] border border-white/80 shadow-2xs"
                          >
                            {prog}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/80 flex items-center justify-between text-xs text-[#798393]">
                  <span>Contact: {org.contactEmail}</span>
                  <span className="font-semibold text-[#1E2532]">SLA: {org.slaHoursThreshold} hours</span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Tab 2: Users Directory */}
      {activeTab === "users" && (
        <GlassCard className="p-6 rounded-[26px] space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-[#1E2532]">Registered User Directory</h2>
              <p className="text-xs text-[#798393]">
                Inspect assigned roles, organization boundaries, and authorization scopes.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#798393] absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search staff, role, email..."
                className="pl-9 h-9 text-xs bg-white/80 border-white/80 rounded-xl"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/80 text-[#798393] font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">User Name</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Organization</th>
                  <th className="py-3.5 px-4">Department / Facility</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/60">
                {filteredUsers.map((u) => {
                  const roleMeta = ROLE_PERMISSIONS[u.role];
                  return (
                    <tr key={u.id} className="hover:bg-white/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#1E2532] flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8B5CF6]/20 to-[#10B981]/20 text-[#1E2532] font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div>{u.name}</div>
                          <div className="text-[10px] text-[#798393] font-mono">{u.id}</div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusPill variant="lavender" label={roleMeta?.roleTitle || u.role} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#1E2532]">{u.organizationName}</td>
                      <td className="py-3.5 px-4 text-[#798393]">
                        <div>{u.department || "General"}</div>
                        <div className="text-[10px] text-[#798393]">{u.facility}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#1E2532]">{u.email}</td>
                      <td className="py-3.5 px-4">
                        <StatusPill variant="mint" label="Active" size="sm" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Tab 3: Security & Audit Trail */}
      {activeTab === "security" && (
        <GlassCard className="p-6 rounded-[26px] space-y-4 animate-in fade-in duration-150">
          <div>
            <h2 className="text-lg font-extrabold text-[#1E2532]">System-Wide Security &amp; Audit Log</h2>
            <p className="text-xs text-[#798393]">
              Immutable provenance trail of all clinical transitions, role actions, and notifications.
            </p>
          </div>

          <div className="space-y-3">
            {allAudits.map((a) => (
              <div
                key={a.id}
                className="p-4 rounded-2xl bg-white/70 border border-white/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs hover:bg-white/90 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[#1E2532]">{a.action}</span>
                    <StatusPill variant="lavender" label={a.caseType} size="sm" />
                    <span className="text-[11px] text-[#798393] font-mono">{a.caseId}</span>
                    <span className="text-[11px] text-[#798393] font-medium">({a.casePatient})</span>
                  </div>
                  <p className="text-[#798393] text-[11px]">
                    Authorized by <strong className="text-[#1E2532]">{a.owner}</strong> ({a.ownerRole}) &bull; {a.reason}
                  </p>
                </div>

                <div className="text-[11px] text-[#798393] sm:text-right flex-shrink-0 font-mono">
                  {new Date(a.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
};