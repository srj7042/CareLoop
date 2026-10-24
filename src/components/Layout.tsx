import * as React from "react";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  ShieldCheck,
  BarChart3,
  SendHorizontal,
  Menu,
  X,
  Play,
  RotateCcw,
  ShieldAlert,
  Bell,
  HelpCircle,
  Home,
  User,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import type { Role } from "@/types";
import { MariaStoryModal } from "@/components/MariaStoryModal";
import { ProfileModal } from "@/components/ProfileModal";
import { PrivacyGovernanceModal } from "@/components/PrivacyGovernanceModal";

const roleDescriptions: Record<Role, { title: string; subtitle: string; icon: React.ElementType }> = {
  coordinator: {
    title: "Care Coordinator",
    subtitle: "Triage & Outreach Worklist",
    icon: Users,
  },
  clinician: {
    title: "Primary Clinician",
    subtitle: "Order & Consult Hub",
    icon: Stethoscope,
  },
  specialist: {
    title: "Specialist",
    subtitle: "Referrals & Diagnoses",
    icon: ShieldCheck,
  },
  patient: {
    title: "Patient View",
    subtitle: "Plain Language & Actions",
    icon: User,
  },
  admin: {
    title: "Program Manager",
    subtitle: "Population KPIs & SLAs",
    icon: BarChart3,
  },
};

export const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentRole, currentUser, setRole, resetDemo, cases } = useStore();

  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [storyOpen, setStoryOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [privacyOpen, setPrivacyOpen] = React.useState(false);

  const pendingCount = cases.filter((c) => c.status === "open").length;
  const overdueCount = cases.filter((c) => c.sideState === "overdue").length;

  const navRoutes = [
    { path: "/landing", label: "Overview & Landing", icon: Home },
    {
      path: "/coordinator",
      label: "Coordinator Worklist",
      icon: Users,
      badge: overdueCount > 0 ? `${overdueCount} due` : undefined,
      badgeVariant: "coral" as const,
    },
    { path: "/case/CASE-001", label: "Case Detail Tracker", icon: LayoutDashboard },
    { path: "/patient/CASE-001", label: "Patient View (Mobile)", icon: User },
    {
      path: "/referral",
      label: "Specialist Referral Inbox",
      icon: SendHorizontal,
      badge: cases.filter((c) => c.referral?.status === "pending").length.toString(),
      badgeVariant: "amber" as const,
    },
    { path: "/admin", label: "Program Population Dashboard", icon: BarChart3 },
    { path: "/notifications", label: "Notification Simulator", icon: Bell },
  ];

  const handleRoleChange = (role: Role) => {
    setRole(role);
    if (role === "patient") {
      navigate("/patient/CASE-001");
    } else if (role === "specialist") {
      navigate("/referral");
    } else if (role === "admin") {
      navigate("/admin");
    } else if (role === "coordinator") {
      navigate("/coordinator");
    } else {
      navigate("/case/CASE-001");
    }
  };

  return (
    <div className="flex h-screen bg-surface-white overflow-hidden text-body">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-teal-deep/30 z-30 md:hidden backdrop-blur-2xs"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-72 bg-surface-card border-r border-surface-border flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-18 px-5 border-b border-surface-border flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-mint-light to-teal-brand flex items-center justify-center text-teal-deep font-bold shadow-xs transition-transform group-hover:scale-105">
              CL
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-teal-deep text-lg tracking-tight">CareLoop</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-mint-wash text-teal-brand border border-mint-light">
                  Demo
                </span>
              </div>
              <p className="text-[11px] text-muted -mt-0.5 font-medium">Every result. Closed.</p>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-muted hover:text-teal-deep p-1.5"
          >
            <X size={18} />
          </button>
        </div>

        {/* 3-Minute Story Quick Launch Hero Card */}
        <div className="p-3.5 mx-3 mt-3.5 rounded-xl bg-gradient-to-br from-teal-deep to-teal-brand text-white shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-mint-light flex items-center gap-1">
              <Play size={10} className="fill-current" /> Demo Story
            </span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-medium">
              3 min
            </span>
          </div>
          <div>
            <p className="font-bold text-xs text-white">Maria's Mammogram Story</p>
            <p className="text-[11px] text-mint-wash/80 line-clamp-2 leading-tight mt-0.5">
              Missed acknowledgement → Escalation → Referral → Loop Closed ✓
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setStoryOpen(true)}
            className="w-full bg-mint-light text-teal-deep hover:bg-white text-xs font-bold py-1.5 h-auto shadow-2xs"
          >
            Launch Guided Demo
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
            Platform Views
          </p>

          {navRoutes.map((route) => {
            const Icon = route.icon;
            const isActive =
              location.pathname === route.path ||
              (route.path.startsWith("/case") && location.pathname.startsWith("/case")) ||
              (route.path.startsWith("/patient") && location.pathname.startsWith("/patient"));

            return (
              <button
                key={route.path}
                onClick={() => {
                  navigate(route.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-teal-brand text-white shadow-xs"
                    : "text-body hover:bg-mint-wash/70 hover:text-teal-deep"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    size={16}
                    strokeWidth={2}
                    className={isActive ? "text-white" : "text-teal-brand"}
                  />
                  <span>{route.label}</span>
                </div>

                {route.badge && (
                  <Badge
                    variant={isActive ? "mint" : route.badgeVariant}
                    className="text-[10px] px-1.5 py-0.2"
                  >
                    {route.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>

        {/* Demo Role Switcher Section */}
        <div className="p-3 border-t border-surface-border bg-surface-white/60 space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
              Role Switcher
            </span>
            <span className="text-[10px] text-teal-brand font-semibold capitalize">
              Active: {currentRole}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {(Object.keys(roleDescriptions) as Role[]).map((r) => {
              const meta = roleDescriptions[r];
              const Icon = meta.icon;
              const isSelected = currentRole === r;

              return (
                <button
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  className={`p-2 rounded-lg border text-left text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-white border-teal-brand text-teal-deep ring-1 ring-teal-brand/30 shadow-2xs font-bold"
                      : "border-surface-border bg-surface-card hover:bg-white text-muted"
                  }`}
                >
                  <Icon
                    size={13}
                    className={isSelected ? "text-teal-brand" : "text-muted"}
                  />
                  <span className="truncate">{meta.title.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>

          {/* User Profile Card */}
          <div
            onClick={() => setProfileOpen(true)}
            className="p-2.5 rounded-xl border border-surface-border bg-white hover:border-teal-brand/40 transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-mint-wash text-teal-brand flex items-center justify-center font-bold text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-teal-deep truncate max-w-[130px]">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-muted truncate max-w-[130px]">
                  {currentUser.facility.split(" ")[0]}
                </p>
              </div>
            </div>
            <ChevronRight size={14} className="text-muted group-hover:text-teal-brand" />
          </div>

          {/* Quick Footer Links */}
          <div className="flex items-center justify-between text-[11px] pt-1 px-1">
            <button
              onClick={() => resetDemo()}
              className="text-muted hover:text-teal-deep flex items-center gap-1 font-medium transition-colors"
            >
              <RotateCcw size={11} /> Reset Data
            </button>
            <button
              onClick={() => setPrivacyOpen(true)}
              className="text-teal-brand hover:text-teal-hover flex items-center gap-1 font-semibold transition-colors"
            >
              <ShieldCheck size={12} /> Governance
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 px-6 border-b border-surface-border bg-surface-card/80 backdrop-blur-xs flex items-center justify-between flex-shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-muted hover:text-teal-deep p-1.5"
            >
              <Menu size={20} />
            </button>

            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-teal-deep">CareLoop Healthcare</span>
                <span className="text-muted text-xs">•</span>
                <span className="text-xs text-muted font-medium">Closing the Screening-to-Care Loop</span>
              </div>
            </div>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-2.5">
            {/* 3-Minute Story Quick Button */}
            <Button
              size="sm"
              onClick={() => setStoryOpen(true)}
              className="bg-mint-wash text-teal-deep border border-mint-light hover:bg-teal-brand hover:text-white text-xs font-semibold px-3 hidden sm:flex items-center gap-1.5"
            >
              <Play size={12} className="fill-current text-teal-brand hover:text-white" />
              <span>3-Min Demo Story</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/notifications")}
              className="text-xs border-surface-border text-muted hover:text-teal-deep px-2.5"
            >
              <Bell size={14} className="mr-1 text-teal-brand" /> Simulator
            </Button>

            {/* Role indicator chip */}
            <div
              onClick={() => setProfileOpen(true)}
              className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-full border border-surface-border bg-surface-white hover:bg-mint-wash/40 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-teal-brand animate-pulse" />
              <span className="text-xs font-bold text-teal-deep capitalize">{currentRole}</span>
              <span className="text-[11px] text-muted hidden md:inline">({currentUser.name.split(" ")[0]})</span>
            </div>
          </div>
        </header>

        {/* Page Main Content */}
        <main className="flex-1 overflow-y-auto bg-surface-white p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>

        {/* Global Footer */}
        <footer className="h-8 px-6 bg-surface-card border-t border-surface-border/60 text-[11px] text-muted flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span>CareLoop • Digital Health Innovation Challenge</span>
            <span>•</span>
            <span className="font-semibold text-teal-deep">100% Synthetic Demo Dataset</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setPrivacyOpen(true)} className="hover:text-teal-brand">
              Privacy & Safeguards
            </button>
            <span>•</span>
            <span className="text-teal-brand font-medium">AI-Assisted · Human-Approved</span>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <MariaStoryModal isOpen={storyOpen} onClose={() => setStoryOpen(false)} />
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
      <PrivacyGovernanceModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </div>
  );
};
