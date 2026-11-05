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
  ChevronRight,
  Activity,
  FileCheck2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    <div className="min-h-screen bg-surface-white text-body flex font-sans antialiased overflow-x-hidden">
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-teal-deep/60 backdrop-blur-2xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Persistent Collapsible Sidebar - Dedicated Light Brown & Cream */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#7B4D24] text-[#FAF6F0] border-r border-[#663E1A] transition-all duration-300 ease-in-out flex flex-col justify-between shadow-lg ${
          // Mobile state
          sidebarOpen ? "translate-x-0 w-64 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        } ${
          // Desktop collapsed state
          isCollapsed ? "lg:w-20" : "lg:w-64"
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-16 px-4 border-b border-[#663E1A] flex items-center justify-between flex-shrink-0 bg-[#6E421D]">
          <Link
            to={roleConfig?.defaultPath || "/"}
            className="flex items-center gap-2.5 overflow-hidden"
            title="CareLoop AI Healthcare"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FAF6F0] flex items-center justify-center text-[#7B4D24] font-black flex-shrink-0 shadow-sm">
              <HeartPulse className="w-5 h-5 text-[#7B4D24]" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col truncate leading-tight">
                <span className="font-extrabold text-sm tracking-tight text-white">CareLoop</span>
                <span className="text-[10px] text-[#F3E2D2] font-medium truncate">
                  {currentUser?.organizationName || "Clinical OS"}
                </span>
              </div>
            )}
          </Link>

          {/* Mobile close drawer button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[#F3E2D2] hover:text-white p-1 rounded-lg ml-auto"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Profile Context Strip in Sidebar */}
        <div
          onClick={() => setProfileOpen(true)}
          className={`p-3 border-b border-[#663E1A] bg-[#663E1A]/60 hover:bg-[#5E3615] cursor-pointer transition-colors flex items-center gap-3 ${
            isCollapsed ? "justify-center" : ""
          }`}
          title="View profile details"
        >
          <div className="w-8 h-8 rounded-full bg-[#FAF6F0] text-[#7B4D24] font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
            {currentUser?.name?.charAt(0) || "U"}
          </div>

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
              <div className="flex items-center gap-1.5 text-[10px] text-[#F3E2D2] truncate">
                <span className="capitalize text-[#FFE3C8] font-bold">
                  {roleConfig?.roleTitle || currentUser?.role}
                </span>
                {currentUser?.department && (
                  <>
                    <span>&bull;</span>
                    <span className="truncate">{currentUser.department}</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {!isCollapsed && (
            <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#F3E2D2]/70">
              Navigation Workspace
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
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#FAF6F0] text-[#633917] font-extrabold shadow-md shadow-black/10"
                      : "text-[#F5EBE1] hover:text-white hover:bg-[#663E1A]/80"
                  } ${isCollapsed ? "justify-center px-0" : ""}`}
                >
                  <Icon size={18} className="flex-shrink-0" />

                  {!isCollapsed && (
                    <>
                      <span className="truncate flex-1">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isActive
                              ? "bg-[#7B4D24] text-[#FAF6F0]"
                              : "bg-[#663E1A] text-[#FFE8D6]"
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
                  <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-[#4A2C12] text-[#FAF6F0] text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap z-50 border border-[#663E1A]">
                    {item.label}
                    {item.badge && ` (${item.badge})`}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-3 border-t border-[#663E1A] space-y-1 bg-[#6E421D]">
          {/* Privacy & Governance Modal Button */}
          <div className="relative group">
            <button
              onClick={() => setPrivacyOpen(true)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#F3E2D2] hover:text-white hover:bg-[#5E3615] transition-colors ${
                isCollapsed ? "justify-center px-0" : ""
              }`}
              title="Clinical Privacy & Safety Governance"
            >
              <ShieldCheck size={16} className="text-[#FFE3C8] flex-shrink-0" />
              {!isCollapsed && <span>Clinical Governance</span>}
            </button>
            {isCollapsed && (
              <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-[#4A2C12] text-[#FAF6F0] text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap z-50 border border-[#663E1A]">
                Clinical Governance
              </div>
            )}
          </div>

          {/* Distinct Log Out Button */}
          <div className="relative group">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-[#FFCDC4] hover:text-white hover:bg-[#5E1F17] transition-colors ${
                isCollapsed ? "justify-center px-0" : ""
              }`}
              title="Log Out of CareLoop"
            >
              <LogOut size={16} className="flex-shrink-0" />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
            {isCollapsed && (
              <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-[#5E1F17] text-[#FFCDC4] text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap z-50 border border-[#852C22]">
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
        <header className="h-16 px-4 md:px-6 border-b border-surface-border bg-surface-card/90 backdrop-blur-md flex items-center justify-between flex-shrink-0 z-30 sticky top-0">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Hamburger Toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-teal-deep hover:bg-mint-wash p-2 rounded-lg transition-colors"
              aria-label="Open sidebar menu"
            >
              <Menu size={20} />
            </button>

            {/* Desktop Sidebar Collapse / Expand Quick Toggle */}
            <button
              onClick={toggleCollapse}
              className="hidden lg:flex items-center justify-center p-2 rounded-lg text-teal-deep hover:bg-mint-wash transition-colors"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>

            {/* Organization / Context Title */}
            <div className="flex flex-col">
              <span className="font-extrabold text-sm text-teal-deep flex items-center gap-2">
                {currentUser?.organizationName || "CareLoop Healthcare"}
                {currentUser?.department && (
                  <span className="text-xs text-muted font-normal">
                    &bull; {currentUser.department}
                  </span>
                )}
              </span>
              <span className="text-[11px] text-muted font-medium hidden sm:inline">
                {roleConfig?.roleTitle} Workspace
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* User Profile Chip */}
            <button
              onClick={() => setProfileOpen(true)}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-surface-white border border-surface-border hover:border-teal-brand/50 transition-all text-left"
              title="Click to view full user credentials and organization metadata"
            >
              <div className="w-6 h-6 rounded-full bg-teal-brand/10 text-teal-brand font-black text-xs flex items-center justify-center flex-shrink-0">
                {currentUser?.name?.charAt(0) || "U"}
              </div>
              <div className="hidden sm:block">
                <span className="text-xs font-bold text-teal-deep block leading-tight">
                  {currentUser?.name}
                </span>
                <span className="text-[10px] text-muted block capitalize leading-tight">
                  {roleConfig?.roleTitle || currentUser?.role}
                </span>
              </div>
            </button>

            {/* Top Bar Log Out */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-xs border-surface-border text-muted hover:text-coral hover:bg-coral/10 font-semibold h-8 px-2.5 hidden sm:flex items-center gap-1.5"
              title="Log Out of CareLoop"
            >
              <LogOut size={13} />
              <span>Log Out</span>
            </Button>
          </div>
        </header>

        {/* Dynamic Page Outlet */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Persistent Micro-Footer */}
        <footer className="h-9 px-4 md:px-6 bg-surface-card border-t border-surface-border/60 text-[11px] text-muted flex items-center justify-between flex-shrink-0 z-20">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-teal-deep">CareLoop AI</span>
            <span className="hidden sm:inline">&bull; Closing the Screening-to-Care Loop</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">Zero Autonomous Closure &bull; Human Clinician Sign-Off Enforced</span>
            <span>HIPAA Compliant</span>
          </div>
        </footer>
      </div>

      {/* Profile & Governance Modals */}
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
      <PrivacyGovernanceModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </div>
  );
};
