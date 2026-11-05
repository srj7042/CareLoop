import * as React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  ShieldCheck,
  Users,
  Stethoscope,
  SendHorizontal,
  BarChart3,
  User as UserIcon,
  ArrowRight,
  Lock,
  HeartPulse,
  Mail,
  KeyRound,
  AlertCircle,
  Building2,
  Check,
  ChevronRight,
  Info,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { authenticateUser, REGISTERED_ACCOUNTS } from "@/lib/auth";
import { ROLE_PERMISSIONS, isPathAllowedForRole, getDefaultPathForRole } from "@/lib/permissions";
import type { Role } from "@/types";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, currentRole } = useStore();

  const [emailInput, setEmailInput] = React.useState("coordinator@apexhealth.org");
  const [passwordInput, setPasswordInput] = React.useState("careloop2026");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const fromPath = (location.state as any)?.from?.pathname;

  // Standard role homepaths should not override a user's own role dashboard upon login
  const standardHomePaths = ["/", "/landing", "/login", "/coordinator", "/director", "/hod", "/admin", "/patient", "/case", "/referral"];
  const isDeepItemLink = fromPath && !standardHomePaths.includes(fromPath);

  // Auto-redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && currentRole) {
      const destination =
        isDeepItemLink && isPathAllowedForRole(fromPath, currentRole)
          ? fromPath
          : getDefaultPathForRole(currentRole);
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, currentRole, fromPath, isDeepItemLink, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await authenticateUser(emailInput, passwordInput);
      if (result.success && result.session) {
        login(result.session.user);
        const userRole = result.session.user.role;
        const destination =
          isDeepItemLink && isPathAllowedForRole(fromPath, userRole)
            ? fromPath
            : getDefaultPathForRole(userRole);
        navigate(destination, { replace: true });
      } else {
        setErrorMessage(result.error || "Authentication failed. Please check credentials.");
      }
    } catch {
      setErrorMessage("System authentication service error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreFill = (email: string) => {
    setEmailInput(email);
    setPasswordInput("careloop2026");
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#36271E] flex flex-col justify-between font-sans selection:bg-[#965F2B]/20 selection:text-[#965F2B]">
      {/* Light Brown & Cream Header */}
      <header className="h-20 px-6 sm:px-10 border-b border-[#EADFCF] bg-[#FFFDF9]/95 backdrop-blur-md flex items-center justify-between shadow-xs sticky top-0 z-30">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#965F2B] to-[#5C3817] flex items-center justify-center shadow-md shadow-[#965F2B]/20">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-[#332219]">CareLoop</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#F4ECE1] text-[#965F2B] border border-[#DFCBB5] tracking-wider">
                AI HEALTH
              </span>
            </div>
            <p className="text-[11px] text-[#7B685B] font-medium">Screening-to-Care Orchestration</p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-xs text-[#7B685B] hover:text-[#332219] font-semibold transition-colors hidden sm:inline"
          >
            &larr; Back to Public Overview
          </Link>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F4ECE1] border border-[#DFCBB5] text-xs font-semibold text-[#332219] shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#965F2B]" />
            <span>Secure Clinical Session</span>
          </div>
        </div>
      </header>

      {/* Main Login Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-14">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Login Card */}
          <div className="lg:col-span-6 bg-white border border-[#EADFCF] rounded-3xl p-8 sm:p-10 shadow-xl shadow-[#332219]/5">
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#965F2B] uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F4ECE1] border border-[#DFCBB5] mb-3">
                <Lock className="w-3.5 h-3.5" />
                Authorized Clinical Access
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#332219] tracking-tight mb-2">
                Sign In to CareLoop
              </h1>
              <p className="text-xs sm:text-sm text-[#7B685B] leading-relaxed">
                Enter your authorized clinical email and secure password to access your role-specific healthcare dashboard.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#332219] uppercase tracking-wider mb-2">
                  Clinical Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-[#965F2B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="user@healthsystem.org"
                    className="w-full pl-11 pr-4 h-12 bg-white border-2 border-[#EADFCF] focus:border-[#965F2B] focus:ring-3 focus:ring-[#965F2B]/15 rounded-xl text-sm font-semibold text-[#332219] placeholder:text-[#A8988B] transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-[#332219] uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-xs text-[#965F2B] font-bold bg-[#F4ECE1] px-2 py-0.5 rounded-full border border-[#DFCBB5]">
                    Default: careloop2026
                  </span>
                </div>
                <div className="relative">
                  <KeyRound className="w-5 h-5 text-[#965F2B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-11 pr-11 h-12 bg-white border-2 border-[#EADFCF] focus:border-[#965F2B] focus:ring-3 focus:ring-[#965F2B]/15 rounded-xl text-sm font-semibold text-[#332219] placeholder:text-[#A8988B] transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7B685B] hover:text-[#332219] p-1 transition-colors"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#332219] hover:bg-[#5C3F2E] text-white font-extrabold text-sm rounded-xl shadow-md shadow-[#332219]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Authenticating Session...
                  </span>
                ) : (
                  <>
                    Sign In to Portal
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#EADFCF] text-[11px] text-[#7B685B] flex items-center justify-between font-medium">
              <span>Authorized personnel only</span>
              <span>8-hour session token</span>
            </div>
          </div>

          {/* Right: Quick Verification Accounts Directory */}
          <div className="lg:col-span-6 bg-white border border-[#EADFCF] rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#332219]/5">
            <div className="flex items-center gap-2 mb-2 text-[#332219]">
              <div className="w-7 h-7 rounded-lg bg-[#F4ECE1] text-[#965F2B] flex items-center justify-center">
                <Info className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-extrabold tracking-tight uppercase">
                Registered Authorized Accounts
              </h2>
            </div>
            <p className="text-xs text-[#7B685B] mb-5 leading-relaxed">
              Click any account below to pre-populate clinical credentials for instant verification. Each account accesses only its authorized role and organization data.
            </p>

            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {REGISTERED_ACCOUNTS.map((account) => {
                const isSelected = emailInput.toLowerCase() === account.email.toLowerCase();
                return (
                  <div
                    key={account.id}
                    onClick={() => handlePreFill(account.email)}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#F4ECE1] border-2 border-[#965F2B] shadow-xs"
                        : "bg-[#FAF6F0] border-[#EADFCF] hover:border-[#965F2B]/50 hover:bg-[#F5ECE1]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-[#332219]">{account.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-[#332219] font-bold border border-[#EADFCF] shadow-2xs">
                          {ROLE_PERMISSIONS[account.role]?.roleTitle || account.role}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[11px] font-extrabold text-[#965F2B]">
                          <Check className="w-3.5 h-3.5" />
                          Selected
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#7B685B]">
                      <span className="font-mono text-[#332219] font-semibold">{account.email}</span>
                      <span>&bull;</span>
                      <span className="font-medium text-[#7B685B]">{account.organizationName}</span>
                    </div>

                    <div className="mt-1 text-[11px] text-[#7B685B]">
                      {ROLE_PERMISSIONS[account.role]?.roleSubtitle}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-16 px-6 sm:px-10 border-t border-[#EADFCF] bg-[#FFFDF9] text-xs text-[#7B685B] flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#332219]">&copy; {new Date().getFullYear()} CareLoop Health Systems</span>
          <span>&bull; Closing the Screening-to-Care Loop</span>
        </div>
        <div className="flex items-center gap-4 font-semibold text-[#332219]">
          <span>Strict Role-Based Access Control</span>
          <span>HIPAA Compliant</span>
        </div>
      </footer>
    </div>
  );
};
