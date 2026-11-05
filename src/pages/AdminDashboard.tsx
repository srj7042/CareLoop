import * as React from "react";
import { useSearchParams } from "react-router-dom";
import {
  ShieldCheck,
  Building2,
  Users,
  KeyRound,
  FileText,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Search,
  Filter,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { SYSTEM_ORGANIZATIONS, REGISTERED_ACCOUNTS } from "@/lib/auth";
import { ROLE_PERMISSIONS } from "@/lib/permissions";
import type { Role } from "@/types";

export const AdminDashboard: React.FC = () => {
  const { cases, currentUser } = useStore();
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="mint" className="text-[10px] font-semibold">
              <ShieldCheck className="w-3 h-3 mr-1 inline" />
              Master System Administration
            </Badge>
            <span className="text-xs text-muted font-medium">Enterprise Governance &amp; Security</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-teal-deep tracking-tight">
            System Administration &amp; Multi-Tenant RBAC
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Manage healthcare tenant organizations, clinical user accounts, and immutable audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-surface-white border border-surface-border text-xs text-muted">
            Signed in as <strong>{currentUser?.name || "System Admin"}</strong> (Master Admin)
          </div>
        </div>
      </div>

      {/* Admin KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              Tenant Organizations
            </span>
            <span className="p-1.5 rounded-lg bg-mint-wash text-teal-brand">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-teal-deep">{organizations.length}</span>
            <span className="text-xs font-semibold text-emerald-600">Isolated</span>
          </div>
          <p className="text-[11px] text-muted mt-2">
            Apex Health System &bull; Metro Health Network
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              Active User Accounts
            </span>
            <span className="p-1.5 rounded-lg bg-teal-brand/10 text-teal-brand">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-teal-deep">{users.length}</span>
            <span className="text-xs font-semibold text-muted">across 7 roles</span>
          </div>
          <p className="text-[11px] text-muted mt-2">
            100% individual RBAC credentialed accounts
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              System Closed Loop %
            </span>
            <span className="p-1.5 rounded-lg bg-mint-wash text-teal-brand">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-teal-deep">{closureRate}%</span>
            <span className="text-xs font-semibold text-emerald-600">Global</span>
          </div>
          <p className="text-[11px] text-muted mt-2">
            {closedCases} of {totalCases} cases closed with verified evidence
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              Security Audit Logs
            </span>
            <span className="p-1.5 rounded-lg bg-teal-deep/10 text-teal-deep">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-teal-deep">{totalAudits}</span>
            <span className="text-xs font-semibold text-muted">Immutable events</span>
          </div>
          <p className="text-[11px] text-muted mt-2">
            Full provenance tracking on all transitions
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-surface-border pb-2">
        <button
          onClick={() => handleTabChange("organizations")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "organizations"
              ? "bg-teal-deep text-white shadow-2xs"
              : "bg-surface-white text-muted hover:text-teal-deep border border-surface-border"
          }`}
        >
          <Building2 className="w-3.5 h-3.5 mr-1.5 inline" />
          Health Organizations ({organizations.length})
        </button>

        <button
          onClick={() => handleTabChange("users")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "users"
              ? "bg-teal-deep text-white shadow-2xs"
              : "bg-surface-white text-muted hover:text-teal-deep border border-surface-border"
          }`}
        >
          <Users className="w-3.5 h-3.5 mr-1.5 inline" />
          User Directory &amp; RBAC ({users.length})
        </button>

        <button
          onClick={() => handleTabChange("security")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "security"
              ? "bg-teal-deep text-white shadow-2xs"
              : "bg-surface-white text-muted hover:text-teal-deep border border-surface-border"
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
              <div
                key={org.id}
                className="p-6 rounded-2xl bg-surface-card border border-surface-border shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-teal-brand/10 text-teal-brand font-bold text-sm flex items-center justify-center">
                        {org.code}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-teal-deep">{org.name}</h3>
                        <p className="text-xs text-muted capitalize">
                          {org.type.replace("_", " ")} &bull; ID: {org.id}
                        </p>
                      </div>
                    </div>
                    <Badge variant="mint" className="text-[10px]">
                      Active Tenant
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 my-4 p-3 rounded-xl bg-surface-white border border-surface-border text-center">
                    <div>
                      <span className="text-base font-black text-teal-deep">{orgUsers.length}</span>
                      <p className="text-[10px] text-muted uppercase font-bold">Staff</p>
                    </div>
                    <div>
                      <span className="text-base font-black text-teal-deep">{orgCases.length}</span>
                      <p className="text-[10px] text-muted uppercase font-bold">Cases</p>
                    </div>
                    <div>
                      <span className="text-base font-black text-emerald-600">
                        {orgCases.length ? Math.round((orgClosed.length / orgCases.length) * 100) : 0}%
                      </span>
                      <p className="text-[10px] text-muted uppercase font-bold">Closed Loop</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-teal-deep">Clinical Departments:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {org.departments.map((dept) => (
                          <span
                            key={dept}
                            className="px-2 py-0.5 rounded-md bg-mint-wash text-teal-deep text-[11px] font-medium border border-mint-light/40"
                          >
                            {dept}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className="font-bold text-teal-deep">Active Screening Programs:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {org.activeScreeningPrograms.map((prog) => (
                          <span
                            key={prog}
                            className="px-2 py-0.5 rounded-md bg-surface-white text-muted text-[11px] border border-surface-border"
                          >
                            {prog}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-surface-border flex items-center justify-between text-xs text-muted">
                  <span>Contact: {org.contactEmail}</span>
                  <span className="font-semibold text-teal-deep">SLA: {org.slaHoursThreshold} hours</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Users Directory */}
      {activeTab === "users" && (
        <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-2xs space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-teal-deep">Registered User Directory</h2>
              <p className="text-xs text-muted">
                Inspect assigned roles, organization boundaries, and authorization scopes.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search staff, role, email..."
                className="pl-9 h-9 text-xs bg-surface-white border-surface-border"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-surface-border text-muted font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Organization</th>
                  <th className="py-3 px-4">Department / Facility</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filteredUsers.map((u) => {
                  const roleMeta = ROLE_PERMISSIONS[u.role];
                  return (
                    <tr key={u.id} className="hover:bg-mint-wash/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-teal-deep flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-teal-brand/10 text-teal-brand font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div>{u.name}</div>
                          <div className="text-[10px] text-muted font-mono">{u.id}</div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant="mint" className="text-[10px]">
                          {roleMeta?.roleTitle || u.role}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-body">{u.organizationName}</td>
                      <td className="py-3.5 px-4 text-muted">
                        <div>{u.department || "General"}</div>
                        <div className="text-[10px] text-muted">{u.facility}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-body">{u.email}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Security & Audit Trail */}
      {activeTab === "security" && (
        <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-2xs space-y-4 animate-in fade-in duration-150">
          <div>
            <h2 className="text-lg font-extrabold text-teal-deep">System-Wide Security &amp; Audit Log</h2>
            <p className="text-xs text-muted">
              Immutable provenance trail of all clinical transitions, role actions, and notifications.
            </p>
          </div>

          <div className="space-y-3">
            {allAudits.map((a) => (
              <div
                key={a.id}
                className="p-3.5 rounded-xl bg-surface-white border border-surface-border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-teal-deep">{a.action}</span>
                    <Badge variant="mint" className="text-[9px]">
                      {a.caseType}
                    </Badge>
                    <span className="text-[11px] text-muted font-mono">{a.caseId}</span>
                    <span className="text-[11px] text-muted font-medium">({a.casePatient})</span>
                  </div>
                  <p className="text-muted text-[11px]">
                    Authorized by <strong>{a.owner}</strong> ({a.ownerRole}) &bull; {a.reason}
                  </p>
                </div>

                <div className="text-[11px] text-muted sm:text-right flex-shrink-0 font-mono">
                  {new Date(a.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
