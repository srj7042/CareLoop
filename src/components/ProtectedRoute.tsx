import * as React from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, LogOut } from "lucide-react";
import { useStore } from "@/lib/store";
import { ROLE_PERMISSIONS, isPathAllowedForRole } from "@/lib/permissions";
import { Button } from "@/components/ui/button";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, currentRole, currentUser, logout } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  // If not logged in, redirect to login page
  if (!isAuthenticated || !currentUser || !currentRole) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const roleConfig = ROLE_PERMISSIONS[currentRole];

  // If authenticated user lands on generic dashboard root, redirect to role default
  if (location.pathname === "/" || location.pathname === "/landing") {
    return <Navigate to={roleConfig?.defaultPath || "/login"} replace />;
  }

  // Check if current route is allowed for the logged in role
  const isAllowed = isPathAllowedForRole(location.pathname, currentRole);

  if (!isAllowed) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-surface-card border border-surface-border rounded-3xl p-8 text-center shadow-lg space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-coral/10 text-coral flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert size={32} />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-coral px-2.5 py-0.5 rounded-full bg-coral/15 border border-coral/30">
              Role Access Restricted
            </span>
            <h2 className="text-2xl font-black text-teal-deep">Feature Not Accessible</h2>
            <p className="text-xs text-muted leading-relaxed">
              Your current profile role (
              <strong className="text-teal-deep font-bold capitalize">
                {roleConfig?.roleTitle || currentRole}
              </strong>
              ) does not have authorization to view this clinical module. Each role in CareLoop has access only
              to their dedicated healthcare workflows.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-white border border-surface-border text-left text-xs space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Signed in as</p>
            <p className="font-extrabold text-teal-deep">{currentUser.name}</p>
            <p className="text-muted">
              {currentUser.organizationName} &bull; {currentUser.department || "General"}
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Button
              onClick={() => navigate(roleConfig?.defaultPath || "/login")}
              className="w-full bg-teal-brand text-white hover:bg-teal-hover font-bold text-xs py-2.5 shadow-xs flex items-center justify-center gap-1.5"
            >
              <ArrowLeft size={14} /> Go to My {roleConfig?.roleTitle} View
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="w-full border-surface-border text-muted hover:text-coral hover:bg-coral/10 font-semibold text-xs py-2.5 flex items-center justify-center gap-1.5"
            >
              <LogOut size={14} /> Sign Out / Change Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
