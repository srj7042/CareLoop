import * as React from "react";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import {
  Building2,
  Users,
  Stethoscope,
  ShieldCheck,
  SendHorizontal,
  Layers,
  HeartPulse,
  Menu,
  X,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { ROLE_PERMISSIONS } from "@/lib/permissions";
import { ProfileModal } from "@/components/ProfileModal";
import { PrivacyGovernanceModal } from "@/components/PrivacyGovernanceModal";
import type { Role } from "@/types";

type NavItem = {
  path: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
};

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentRole, currentUser, cases, logout } = useStore();

  const [sidebarOpen, setSidebarOpen] = React.useState(false); // Mobile drawer state
  const [isCollapsed, setIsCollapsed] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem("careloop_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  const [profileOpen, setProfileOpen] = React.useState(false);
  const [privacyOpen, setPrivacyOpen] = React.useState(false);

  // Toggle desktop collapsed mode
  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("careloop_sidebar_collapsed", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // Close mobile drawer on route change
  React.useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Compute live badge counts for the user's role
  const openCases = cases.filter((c) => c.status === "open");
  const overdueCases = cases.filter((c) => c.sideState === "overdue");
  const pendingReferrals = cases.filter((c) => c.referral?.status === "pending");

  // Dynamically generate role-specific navigation items
  const getNavItemsForRole = (role: Role | null): NavItem[] => {
    if (!role) return [];

    switch (role) {
      case "master_admin":
        return [
          { path: "/admin?tab=organizations", label: "Tenant Organizations", icon: Building2 },
          { path: "/admin?tab=users", label: "User Directory & RBAC", icon: Users },
          { path: "/admin?tab=security", label: "Security & Audit Logs", icon: ShieldCheck },
        ];

      case "director":
        return [
          { path: "/director", label: "Executive Oversight", icon: Building2 },
          {
            path: "/coordinator",
            label: "Screening Caseload",
            icon: Users,
            badge: overdueCases.length > 0 ? `${overdueCases.length}` : undefined,
          },
          { path: "/case", label: "Clinical Pathways", icon: Stethoscope },
          {
            path: "/referral",
            label: "Specialist Referrals",
            icon: SendHorizontal,
            badge: pendingReferrals.length > 0 ? `${pendingReferrals.length}` : undefined,
          },
        ];

      case "hod":
        return [
          { path: "/hod", label: "Department Command", icon: Layers },
          {
            path: "/coordinator",
            label: "Coordinator Caseload",
            icon: Users,
            badge: overdueCases.length > 0 ? `${overdueCases.length}` : undefined,
          },
          { path: "/case", label: "Diagnostic Pathways", icon: Stethoscope },
          {
            path: "/referral",
            label: "Specialist Queue",
            icon: SendHorizontal,
            badge: pendingReferrals.length > 0 ? `${pendingReferrals.length}` : undefined,
          },
        ];

      case "coordinator":
        return [
          {
            path: "/coordinator",
            label: "Triage Worklist",
            icon: Users,
            badge: overdueCases.length > 0 ? `${overdueCases.length} overdue` : undefined,
          },
          { path: "/case", label: "Active Case Tracker", icon: Stethoscope },
          { path: "/patient", label: "Patient Portal View", icon: User },
        ];

      case "clinician":
        return [
          {
            path: "/case",
            label: "Clinical Review & Orders",
            icon: Stethoscope,
            badge: openCases.length > 0 ? `${openCases.length}` : undefined,
          },
          { path: "/coordinator", label: "Triage Caseload", icon: Users },
        ];

      case "specialist":
        return [
          {
            path: "/referral",
            label: "Referral Inbox",
            icon: SendHorizontal,
            badge: pendingReferrals.length > 0 ? `${pendingReferrals.length}` : undefined,
          },
          { path: "/case", label: "Specialty Case Review", icon: Stethoscope },
        ];

      case "patient":
        return [
          { path: "/patient", label: "My Health Results", icon: HeartPulse },
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItemsForRole(currentRole);
  const roleConfig = currentRole ? ROLE_PERMISSIONS[currentRole] : null;

  return (
    <div className="min-h-screen bg-transparent text-[#1E2532] flex font-sans antialiased overflow-x-hidden">
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Persistent Collapsible Sidebar - Frosted Glassmorphism */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white/75 backdrop-blur-xl border-r border-white/80 transition-all duration-300 ease-in-out flex flex-col justify-between shadow-[0_12px_32px_rgba(100,115,140,0.06)] ${
          // Mobile state
          sidebarOpen ? "translate-x-0 w-64 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        } ${
          // Desktop collapsed state
          isCollapsed ? "lg:w-20" : "lg:w-64"
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-16 px-4 border-b border-white/80 flex items-center justify-between flex-shrink-0 bg-white/40 backdrop-blur-md">
          <Link
            to={roleConfig?.defaultPath || "/"}
            className="flex items-center gap-2.5 overflow-hidden group"
            title="CareLoop AI Healthcare"
          >
            <div className="w-9 h-9 rounded-2xl bg-white border border-white/80 flex items-center justify-center text-[#1E2532] font-black flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <HeartPulse className="w-5 h-5 text-[#10B981]" strokeWidth={2} />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col truncate leading-tight">
                <span className="font-extrabold text-sm tracking-tight text-[#1E2532]">CareLoop</span>
                <span className="text-[10px] text-[#798393] font-medium truncate">
                  {currentUser?.organizationName || "Clinical OS"}
                </span>
              </div>
            )}
          </Link>

          {/* Mobile close drawer button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[#798393] hover:text-[#1E2532] p-1.5 rounded-xl hover:bg-white/60 transition-colors ml-auto"
            aria-label="Close sidebar"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        {/* Navigation Links Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {!isCollapsed && (
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#798393]/80">
              Workspace
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            let isActive = false;
            if (item.path.includes("?")) {
              const [basePath, query] = item.path.split("?");
              const expectedTab = new URLSearchParams(query).get("tab");
              const currentTab = new URLSearchParams(location.search).get("tab") || "organizations";
              isActive = location.pathname === basePath && expectedTab === currentTab;
            } else {
              isActive =
                location.pathname === item.path ||
                (item.path !== "/" && location.pathname.startsWith(`${item.path}/`));
            }

            return (
              <div key={item.label} className="relative group">
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-white text-slate-800 shadow-sm border border-white/90 font-bold"
                      : "text-[#798393] hover:text-[#1E2532] hover:bg-white/60"
                  } ${isCollapsed ? "justify-center px-0" : ""}`}
                >
                  <Icon
                    size={18}
                    strokeWidth={1.75}
                    className={`flex-shrink-0 ${isActive ? "text-[#10B981]" : "text-[#798393]"}`}
                  />

                  {!isCollapsed && (
                    <>
                      <span className="truncate flex-1">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isActive
                              ? "bg-[#10B981]/15 text-[#065F46]"
                              : "bg-white/80 text-[#798393] border border-white/80"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>

                {/* Collapsed Mode Tooltip */}
                {isCollapsed && (
                  <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap z-50 border border-white/10">
                    {item.label}
                    {item.badge && ` (${item.badge})`}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer: User Profile & Governance Controls */}
        <div className="p-3 border-t border-white/80 space-y-1.5 bg-white/40 backdrop-blur-md">
          {/* User Profile Context Button in Lower Left Sidebar */}
          <div className="relative group">
            <button
              onClick={() => setProfileOpen(true)}
              className={`w-full p-2 rounded-2xl bg-white/60 hover:bg-white/90 border border-white/80 shadow-xs cursor-pointer transition-all flex items-center gap-3 text-left ${
                isCollapsed ? "justify-center px-0" : ""
              }`}
              title="View & Edit Personal Profile"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#10B981] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                {currentUser?.name?.charAt(0) || "U"}
              </div>

              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#1E2532] truncate">{currentUser?.name}</p>
                  <p className="text-[10px] text-[#798393] capitalize truncate font-medium">
                    {roleConfig?.roleTitle || currentUser?.role}
                  </p>
                </div>
              )}
            </button>

            {isCollapsed && (
              <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap z-50 border border-white/10">
                {currentUser?.name} &bull; {roleConfig?.roleTitle || currentUser?.role}
              </div>
            )}
          </div>

          {/* Privacy & Governance Modal Button */}
          <div className="relative group">
            <button
              onClick={() => setPrivacyOpen(true)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#798393] hover:text-[#1E2532] hover:bg-white/60 transition-colors ${
                isCollapsed ? "justify-center px-0" : ""
              }`}
              title="Clinical Privacy & Safety Governance"
            >
              <ShieldCheck size={16} strokeWidth={1.75} className="text-[#10B981] flex-shrink-0" />
              {!isCollapsed && <span>Clinical Governance</span>}
            </button>
            {isCollapsed && (
              <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap z-50 border border-white/10">
                Clinical Governance
              </div>
            )}
          </div>

          {/* Distinct Log Out Button */}
          <div className="relative group">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 transition-colors ${
                isCollapsed ? "justify-center px-0" : ""
              }`}
              title="Log Out of CareLoop"
            >
              <LogOut size={16} strokeWidth={1.75} className="flex-shrink-0 text-rose-500" />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
            {isCollapsed && (
              <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap z-50">
                Sign Out
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        {/* Top Navbar */}
        <header className="h-16 px-4 md:px-6 border-b border-white/80 bg-white/70 backdrop-blur-md flex items-center justify-between flex-shrink-0 z-30 sticky top-0 shadow-[0_4px_20px_rgba(100,115,140,0.03)]">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Hamburger Toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-[#1E2532] hover:bg-white/80 p-2 rounded-xl transition-colors border border-transparent hover:border-white/80"
              aria-label="Open sidebar menu"
            >
              <Menu size={20} strokeWidth={1.75} />
            </button>

            {/* Desktop Sidebar Collapse / Expand Quick Toggle */}
            <button
              onClick={toggleCollapse}
              className="hidden lg:flex items-center justify-center p-2 rounded-xl text-[#798393] hover:text-[#1E2532] hover:bg-white/80 border border-transparent hover:border-white/80 transition-colors cursor-pointer"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <PanelLeftOpen size={18} strokeWidth={1.75} /> : <PanelLeftClose size={18} strokeWidth={1.75} />}
            </button>

            {/* Organization / Context Title */}
            <div className="flex flex-col">
              <span className="font-extrabold text-sm text-[#1E2532]">
                {currentUser?.organizationName || "CareLoop Healthcare"}
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Top Bar Log Out */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-xs bg-white/70 border-white/80 text-[#798393] hover:text-rose-600 hover:bg-rose-50/80 font-semibold h-8 px-3 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Log Out of CareLoop"
            >
              <LogOut size={13} strokeWidth={1.75} />
              <span>Log Out</span>
            </Button>
          </div>
        </header>

        {/* Dynamic Page Outlet */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Persistent Micro-Footer */}
        <footer className="h-9 px-4 md:px-6 bg-white/50 backdrop-blur-xs border-t border-white/70 text-[11px] text-[#798393] flex items-center justify-between flex-shrink-0 z-20">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#1E2532]">CareLoop AI</span>
            <span className="hidden sm:inline">&bull; Closing the Screening-to-Care Loop</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">Zero Autonomous Closure &bull; Human Clinician Sign-Off Enforced</span>
            <span className="font-medium text-[#10B981]">HIPAA Compliant</span>
          </div>
        </footer>
      </div>

      {/* Profile & Governance Modals */}
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
      <PrivacyGovernanceModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </div>
  );
};
