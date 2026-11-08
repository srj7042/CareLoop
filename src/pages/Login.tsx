import * as React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  HeartPulse,
  Mail,
  KeyRound,
  AlertCircle,
  Building2,
  Check,
  Eye,
  EyeOff,
  X,
  Sparkles,
  Info,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard, StatusPill } from "@/components/design-system";
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

  // Modals state
  const [isForgotModalOpen, setIsForgotModalOpen] = React.useState(false);
  const [forgotEmail, setForgotEmail] = React.useState("");
  const [forgotStatus, setForgotStatus] = React.useState<"idle" | "submitting" | "sent">("idle");

  const [isPilotModalOpen, setIsPilotModalOpen] = React.useState(false);
  const [pilotForm, setPilotForm] = React.useState({
    name: "",
    email: "",
    hospital: "",
    role: "Chief Medical Officer",
    notes: "",
  });
  const [pilotStatus, setPilotStatus] = React.useState<"idle" | "submitting" | "sent">("idle");

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

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotStatus("submitting");
    setTimeout(() => {
      setForgotStatus("sent");
    }, 700);
  };

  const handlePilotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPilotStatus("submitting");
    setTimeout(() => {
      setPilotStatus("sent");
    }, 900);
  };

  const handleGuestLogin = (guestRole: Role = "coordinator") => {
    const account = REGISTERED_ACCOUNTS.find((a) => a.role === guestRole) || REGISTERED_ACCOUNTS[3];
    login({
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      organizationId: account.organizationId,
      organizationName: account.organizationName,
      facility: account.facility,
      department: account.department,
      phone: account.phone,
      status: account.status,
      avatar: account.name.charAt(0),
    });
    const destination =
      isDeepItemLink && isPathAllowedForRole(fromPath, account.role)
        ? fromPath
        : getDefaultPathForRole(account.role);
    navigate(destination, { replace: true });
  };

  return (
    <div className="min-h-screen bg-transparent text-[#1E2532] flex flex-col justify-between font-sans">
      {/* Frosted Glass Header */}
      <header className="h-20 px-6 sm:px-10 border-b border-white/80 bg-white/70 backdrop-blur-md flex items-center justify-between shadow-xs sticky top-0 z-30">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-white border border-white/80 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <HeartPulse className="w-5 h-5 text-[#10B981]" strokeWidth={2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-[#1E2532]">CareLoop</span>
              <StatusPill variant="mint" label="AI HEALTH" size="sm" />
            </div>
            <p className="text-[11px] text-[#798393] font-medium">Screening-to-Care Orchestration</p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-xs text-[#798393] hover:text-[#1E2532] font-semibold transition-colors hidden sm:inline"
          >
            &larr; Back to Public Overview
          </Link>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-white/80 text-xs font-semibold text-[#1E2532] shadow-2xs backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>Secure Clinical Session</span>
          </div>
        </div>
      </header>

      {/* Main Login Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-14">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Login Card */}
          <GlassCard className="lg:col-span-6 p-8 sm:p-10 rounded-[28px] shadow-[0_16px_36px_rgba(100,115,140,0.08)]">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-black text-[#1E2532] tracking-tight mb-2">
                Sign In to CareLoop
              </h1>
              <p className="text-xs sm:text-sm text-[#798393] leading-relaxed">
                Enter your authorized clinical email and secure password to access your role-specific healthcare dashboard.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#1E2532] uppercase tracking-wider mb-2">
                  Clinical Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-[#8B5CF6] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="user@healthsystem.org"
                    className="w-full pl-11 pr-4 h-12 bg-white/90 border border-white/80 focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 rounded-2xl text-sm font-semibold text-[#1E2532] placeholder:text-[#798393] transition-all outline-none shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-[#1E2532] uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-xs text-[#8B5CF6] font-bold bg-[#8B5CF6]/10 px-2.5 py-0.5 rounded-full border border-[#8B5CF6]/20">
                    Default: careloop2026
                  </span>
                </div>
                <div className="relative">
                  <KeyRound className="w-5 h-5 text-[#8B5CF6] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-11 pr-11 h-12 bg-white/90 border border-white/80 focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 rounded-2xl text-sm font-semibold text-[#1E2532] placeholder:text-[#798393] transition-all outline-none shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#798393] hover:text-[#1E2532] p-1 transition-colors cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(emailInput);
                      setForgotStatus("idle");
                      setIsForgotModalOpen(true);
                    }}
                    className="text-xs font-semibold text-[#8B5CF6] hover:text-[#7C3AED] hover:underline cursor-pointer"
                  >
                    Forgot Password or SSO Token?
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#1E2532] hover:bg-slate-800 text-white font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
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

              {/* Guest / Evaluator Quick Access */}
              <div className="pt-1">
                <div className="relative flex items-center justify-center my-3.5">
                  <div className="border-t border-white/80 w-full" />
                  <span className="bg-white/90 px-3 py-0.5 text-[10px] font-extrabold text-[#798393] uppercase tracking-wider rounded-full border border-white/80 absolute shadow-2xs">
                    Or Evaluator / Reviewer Access
                  </span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleGuestLogin("coordinator")}
                  className="w-full h-12 bg-white/90 hover:bg-white border-2 border-[#10B981]/40 hover:border-[#10B981] text-[#065F46] font-extrabold text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all hover:shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-[#10B981]" />
                  Continue as Guest
                </Button>

                <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5">
                  <span className="text-[10px] font-semibold text-[#798393]">Switch Guest Role:</span>
                  {(
                    [
                      { role: "coordinator", label: "Coordinator" },
                      { role: "director", label: "Medical Director" },
                      { role: "clinician", label: "Primary Doctor" },
                      { role: "specialist", label: "Specialist" },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => handleGuestLogin(item.role)}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white/80 hover:bg-white text-[#1E2532] hover:text-[#10B981] border border-white/80 hover:border-[#10B981]/50 shadow-2xs transition-all cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-white/80">
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setPilotStatus("idle");
                    setIsPilotModalOpen(true);
                  }}
                  className="text-xs text-[#8B5CF6] hover:text-[#7C3AED] font-bold hover:underline cursor-pointer"
                >
                  Need access for your hospital system? Request an Enterprise Pilot &rarr;
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Right: Quick Verification Accounts Directory */}
          <GlassCard className="lg:col-span-6 p-6 sm:p-8 rounded-[28px] shadow-[0_16px_36px_rgba(100,115,140,0.08)]">
            <div className="flex items-center gap-2 mb-2 text-[#1E2532]">
              <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/15 text-[#8B5CF6] flex items-center justify-center">
                <Info className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-extrabold tracking-tight uppercase">
                Registered Authorized Accounts
              </h2>
            </div>
            <p className="text-xs text-[#798393] mb-5 leading-relaxed">
              Click any account below to pre-populate clinical credentials for instant verification.
            </p>

            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {REGISTERED_ACCOUNTS.map((account) => {
                const isSelected = emailInput.toLowerCase() === account.email.toLowerCase();
                return (
                  <div
                    key={account.id}
                    onClick={() => handlePreFill(account.email)}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                      isSelected
                        ? "bg-white border-2 border-[#8B5CF6] shadow-sm"
                        : "bg-white/70 border-white/80 hover:bg-white hover:border-[#8B5CF6]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-[#1E2532]">{account.name}</span>
                        <StatusPill
                          variant={isSelected ? "lavender" : "slate"}
                          label={ROLE_PERMISSIONS[account.role]?.roleTitle || account.role}
                          size="sm"
                        />
                      </div>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[11px] font-extrabold text-[#8B5CF6]">
                          <Check className="w-3.5 h-3.5" />
                          Selected
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#798393]">
                      <span className="font-mono text-[#1E2532] font-semibold">{account.email}</span>
                      <span>&bull;</span>
                      <span className="font-medium text-[#798393]">{account.organizationName}</span>
                    </div>

                    <div className="mt-1 text-[11px] text-[#798393]">
                      {ROLE_PERMISSIONS[account.role]?.roleSubtitle}
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-xl rounded-[28px] border border-white/80 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/80">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#8B5CF6]" />
                <h3 className="font-bold text-base text-[#1E2532]">Password Recovery &amp; SSO</h3>
              </div>
              <button
                onClick={() => setIsForgotModalOpen(false)}
                className="text-[#798393] hover:text-[#1E2532] p-1 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotStatus === "sent" ? (
              <div className="p-4 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/25 text-[#065F46] space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                  <span>Recovery Instructions Dispatched</span>
                </div>
                <p className="text-xs leading-relaxed">
                  If <strong>{forgotEmail}</strong> matches an active authorized clinical profile, password reset instructions and institutional SSO tokens have been sent to that inbox.
                </p>
                <Button
                  onClick={() => setIsForgotModalOpen(false)}
                  className="w-full bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold h-10 rounded-xl"
                >
                  Return to Sign In
                </Button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-xs text-[#798393] leading-relaxed">
                  Enter your registered institutional or hospital email address. You will receive a time-bound verification link to reset your password or reconnect your SAML 2.0 / Okta credentials.
                </p>
                <div>
                  <label className="block text-xs font-bold text-[#1E2532] uppercase tracking-wider mb-1.5">
                    Institutional Email
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="doctor@apexhealth.org"
                    className="w-full px-3.5 h-10 bg-white border border-white/80 focus:border-[#8B5CF6] rounded-xl text-xs font-semibold text-[#1E2532] outline-none shadow-2xs"
                  />
                </div>
                <div className="p-3.5 rounded-xl bg-white/70 border border-white/80 text-[11px] text-[#798393]">
                  <strong>Clinical Note:</strong> For high-urgency operational lockouts, contact your hospital IT department or CareLoop 24/7 pager at <strong>it-escalation@careloop.health</strong>.
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="text-xs h-9 px-4 rounded-xl text-[#798393]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={forgotStatus === "submitting"}
                    className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold h-9 px-5 rounded-xl shadow-xs"
                  >
                    {forgotStatus === "submitting" ? "Sending..." : "Send Reset Link"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Request Pilot Modal */}
      {isPilotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-xl rounded-[28px] border border-white/80 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/80">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#8B5CF6]" />
                <h3 className="font-bold text-base text-[#1E2532]">Request Enterprise Hospital Pilot</h3>
              </div>
              <button
                onClick={() => setIsPilotModalOpen(false)}
                className="text-[#798393] hover:text-[#1E2532] p-1 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {pilotStatus === "sent" ? (
              <div className="p-4 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/25 text-[#065F46] space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                  <span>Pilot Application Received</span>
                </div>
                <p className="text-xs leading-relaxed">
                  Thank you, <strong>{pilotForm.name}</strong>. Our Clinical Integration team will review your organization ({pilotForm.hospital}) and contact you within 1 business day to schedule a FHIR/EHR sandbox trial.
                </p>
                <Button
                  onClick={() => setIsPilotModalOpen(false)}
                  className="w-full bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold h-10 rounded-xl"
                >
                  Close
                </Button>
              </div>
            ) : (
              <form onSubmit={handlePilotSubmit} className="space-y-3.5">
                <p className="text-xs text-[#798393] leading-relaxed">
                  Deploy CareLoop across your cancer center or multi-hospital radiology network with HIPAA BAA compliance and Epic/Cerner bi-directional integration.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#1E2532] uppercase tracking-wider mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={pilotForm.name}
                      onChange={(e) => setPilotForm({ ...pilotForm, name: e.target.value })}
                      placeholder="Dr. Katherine Ellis"
                      className="w-full px-3 h-9 bg-white border border-white/80 rounded-xl text-xs font-semibold text-[#1E2532] outline-none shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#1E2532] uppercase tracking-wider mb-1">
                      Institutional Email
                    </label>
                    <input
                      type="email"
                      required
                      value={pilotForm.email}
                      onChange={(e) => setPilotForm({ ...pilotForm, email: e.target.value })}
                      placeholder="kellis@hospital.org"
                      className="w-full px-3 h-9 bg-white border border-white/80 rounded-xl text-xs font-semibold text-[#1E2532] outline-none shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#1E2532] uppercase tracking-wider mb-1">
                      Health System / Hospital
                    </label>
                    <input
                      type="text"
                      required
                      value={pilotForm.hospital}
                      onChange={(e) => setPilotForm({ ...pilotForm, hospital: e.target.value })}
                      placeholder="Memorial Health System"
                      className="w-full px-3 h-9 bg-white border border-white/80 rounded-xl text-xs font-semibold text-[#1E2532] outline-none shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#1E2532] uppercase tracking-wider mb-1">
                      Your Role
                    </label>
                    <select
                      value={pilotForm.role}
                      onChange={(e) => setPilotForm({ ...pilotForm, role: e.target.value })}
                      className="w-full px-2.5 h-9 bg-white border border-white/80 rounded-xl text-xs font-semibold text-[#1E2532] outline-none shadow-2xs"
                    >
                      <option>Chief Medical Officer</option>
                      <option>Director of Oncology</option>
                      <option>Lead Nurse Navigator</option>
                      <option>Hospital CIO / IT Lead</option>
                      <option>Department Administrator</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#1E2532] uppercase tracking-wider mb-1">
                    Screening Focus &amp; Volumes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={pilotForm.notes}
                    onChange={(e) => setPilotForm({ ...pilotForm, notes: e.target.value })}
                    placeholder="e.g. 15,000 annual mammography / lung CT screenings across 3 diagnostic centers."
                    className="w-full p-2.5 bg-white border border-white/80 rounded-xl text-xs font-normal text-[#1E2532] outline-none resize-none shadow-2xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-white/80">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsPilotModalOpen(false)}
                    className="text-xs h-9 px-4 rounded-xl text-[#798393]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={pilotStatus === "submitting"}
                    className="bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold h-9 px-5 rounded-xl shadow-xs"
                  >
                    {pilotStatus === "submitting" ? "Submitting..." : "Submit Pilot Request"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Frosted Micro Footer */}
      <footer className="h-16 px-6 sm:px-10 border-t border-white/80 bg-white/60 backdrop-blur-md text-xs text-[#798393] flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#1E2532]">&copy; 2026 CareLoop Health Systems</span>
          <span>&bull; Closing the Screening-to-Care Loop</span>
        </div>
        <div className="flex items-center gap-4 font-semibold text-[#798393]">
          <Link to="/privacy" className="hover:text-[#1E2532]">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-[#1E2532]">Terms</Link>
          <Link to="/help" className="hover:text-[#1E2532]">Help Center</Link>
          <Link to="/contact" className="hover:text-[#1E2532]">Contact</Link>
        </div>
      </footer>
    </div>
  );
};