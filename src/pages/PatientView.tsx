import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Mail,
  Phone,
  MessageCircle,
  CheckCircle2,
  Clock,
  Globe,
  HeartPulse,
  PhoneCall,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Star,
  Check,
  Calendar,
  AlertCircle,
  Smartphone,
  Monitor,
  User,
  Stethoscope,
  SendHorizontal,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { t, getScreeningExplanation, type Lang } from "@/data/translations";
import { formatTime, formatDate } from "@/lib/utils";

const SUPPORTED_LANGUAGES: { code: Lang; label: string; nativeName: string }[] = [
  { code: "en", label: "English", nativeName: "English" },
  { code: "ta", label: "Tamil", nativeName: "தமிழ்" },
  { code: "te", label: "Telugu", nativeName: "తెలుగు" },
  { code: "hi", label: "Hindi", nativeName: "हिन्दी" },
  { code: "mr", label: "Marathi", nativeName: "मराठी" },
];

export const PatientView: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { getCase, getCasesForCurrentUser, patientAcknowledge, setPatientPulse, requestCallback } =
    useStore();

  // Find case: if route has param, find that; else find first case accessible to current user
  const userCases = getCasesForCurrentUser();
  const c = React.useMemo(() => {
    if (caseId) return getCase(caseId);
    return userCases[0] || getCase("CASE-001");
  }, [caseId, getCase, userCases]);

  const [viewMode, setViewMode] = React.useState<"web" | "mobile">("web");
  const defaultLang = (c?.patientLanguage as Lang) || "en";
  const [lang, setLang] = React.useState<Lang>(defaultLang);
  const [questionText, setQuestionText] = React.useState("");
  const [showQuestionInput, setShowQuestionInput] = React.useState(false);
  const [callbackRequested, setCallbackRequested] = React.useState(c?.patientCallbackRequested || false);
  const [surveySubmitted, setSurveySubmitted] = React.useState(!!c?.understandingScore);
  const [q1Score, setQ1Score] = React.useState(c?.understandingScore || 5);
  const [q2Score, setQ2Score] = React.useState(c?.confidenceScore || 5);

  React.useEffect(() => {
    if (c?.patientLanguage) {
      setLang(c.patientLanguage as Lang);
    }
  }, [c?.patientLanguage]);

  if (!c) {
    return (
      <div className="py-20 text-center space-y-3">
        <p className="text-base font-bold text-teal-deep">Patient Record Not Found</p>
        <p className="text-xs text-muted">You do not have authorization to view this medical record.</p>
        <Button size="sm" onClick={() => navigate("/")} className="bg-teal-brand text-white">
          Back to Home
        </Button>
      </div>
    );
  }

  const explanation = getScreeningExplanation(c.screeningType, lang);
  const ackStep = c.steps.find((s) => s.key === "acknowledged");
  const isAcknowledged = ackStep?.status === "completed";
  const isClosed = c.status === "closed";

  const handleAcknowledge = (type: "yes" | "questions" | "call") => {
    patientAcknowledge(c.id, type);
    if (type === "questions") {
      setShowQuestionInput(true);
    } else if (type === "call") {
      setCallbackRequested(true);
      requestCallback(c.id, "Patient tapped 'Call Me' in patient portal");
    }
  };

  const handleCallbackSubmit = () => {
    setCallbackRequested(true);
    requestCallback(c.id, questionText || "Patient requested callback via patient portal button");
    setShowQuestionInput(false);
  };

  const handlePulseSubmit = () => {
    setPatientPulse(c.id, q1Score, q2Score);
    setSurveySubmitted(true);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top View Mode & Language Selector Bar */}
      <div className="bg-surface-card border border-surface-border rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* View Mode Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-muted uppercase tracking-wider">
            {t("viewMode", lang)}:
          </span>
          <div className="flex items-center bg-surface-white border border-surface-border rounded-xl p-1">
            <button
              onClick={() => setViewMode("web")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "web"
                  ? "bg-teal-deep text-white shadow-2xs"
                  : "text-muted hover:text-teal-deep"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>{t("viewModeWeb", lang)}</span>
            </button>
            <button
              onClick={() => setViewMode("mobile")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "mobile"
                  ? "bg-teal-deep text-white shadow-2xs"
                  : "text-muted hover:text-teal-deep"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{t("viewModeMobile", lang)}</span>
            </button>
          </div>
        </div>

        {/* 5-Language Selector */}
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-teal-brand" />
          <span className="text-xs font-bold text-muted uppercase tracking-wider">
            {t("language", lang)}:
          </span>
          <div className="flex flex-wrap gap-1 bg-surface-white border border-surface-border p-1 rounded-xl">
            {SUPPORTED_LANGUAGES.map((item) => (
              <button
                key={item.code}
                onClick={() => setLang(item.code)}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-all ${
                  lang === item.code
                    ? "bg-teal-brand text-white shadow-2xs"
                    : "text-body hover:text-teal-deep hover:bg-mint-wash"
                }`}
              >
                {item.nativeName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. WEB DESKTOP VIEW                                                       */}
      {/* ========================================================================= */}
      {viewMode === "web" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Patient Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-deep via-[#0d4a46] to-teal-deep text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="mint" className="text-[10px] uppercase font-bold tracking-wider">
                  {c.urgency === "urgent"
                    ? t("urgentBadge", lang)
                    : c.urgency === "high"
                    ? t("highBadge", lang)
                    : t("routineBadge", lang)}
                </Badge>
                <span className="text-xs text-mint-wash opacity-90">&bull; {c.program}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{explanation.title}</h1>
              <p className="text-xs text-mint-light">
                {t("patientName", lang)}: <strong>{c.patientName}</strong> &bull; {c.patientAge} years old &bull; {c.facility}
              </p>
            </div>

            <div className="text-left md:text-right text-xs text-mint-wash space-y-1">
              <div>
                {t("resultDate", lang)}: <strong>{formatDate(c.createdAt)}</strong>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white font-medium">
                {isAcknowledged ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{t("statusAcknowledged", lang)}</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    <span>{t("statusPending", lang)}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: Results & Actions */}
            <div className="lg:col-span-7 space-y-6">
              {/* Plain Language Explanation */}
              <div className="p-6 rounded-2xl bg-surface-card border border-surface-border space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 text-teal-deep">
                  <div className="w-8 h-8 rounded-xl bg-teal-brand/10 text-teal-brand flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-extrabold">{t("whatThisMeans", lang)}</h2>
                </div>

                <p className="text-base text-body leading-relaxed">{explanation.whatThisMeans}</p>

                <div className="p-3.5 rounded-xl bg-surface-white border border-surface-border text-xs">
                  <span className="text-muted block text-[11px] font-semibold uppercase tracking-wider mb-1">
                    Clinical Finding
                  </span>
                  <span className="font-mono font-bold text-teal-deep text-sm">{c.resultValue}</span>
                </div>
              </div>

              {/* What Happens Next */}
              <div className="p-6 rounded-2xl bg-surface-card border border-surface-border space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 text-teal-deep">
                  <div className="w-8 h-8 rounded-xl bg-mint-wash text-teal-brand flex items-center justify-center font-bold">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-extrabold">{t("whatHappensNext", lang)}</h2>
                </div>

                <div className="space-y-3">
                  {explanation.whatHappensNext.map((stepText, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-body">
                      <span className="w-6 h-6 rounded-full bg-teal-brand/10 text-teal-brand font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{stepText}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reassurance Alert */}
              <div className="p-4 rounded-xl bg-mint-wash border border-mint-light/60 flex items-start gap-3 text-xs text-teal-deep">
                <HeartPulse className="w-5 h-5 text-teal-brand flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">{explanation.reassurance}</p>
              </div>

              {/* Patient 1-Tap Actions */}
              <div className="p-6 rounded-2xl bg-surface-card border border-surface-border space-y-4 shadow-2xs">
                <h3 className="text-base font-extrabold text-teal-deep">{t("whatINeedToDo", lang)}</h3>

                {isAcknowledged ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div>
                      <strong className="font-bold block text-sm">{t("statusAcknowledged", lang)}</strong>
                      <span>Your confirmation is logged in your electronic care record.</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-muted">{t("doYouUnderstand", lang)}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <Button
                        onClick={() => handleAcknowledge("yes")}
                        className="bg-teal-deep hover:bg-teal-brand text-white font-bold text-xs h-11 rounded-xl shadow-xs"
                      >
                        <Check className="w-4 h-4 mr-1.5" />
                        {t("yes", lang)}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleAcknowledge("questions")}
                        className="border-surface-border text-teal-deep hover:bg-mint-wash font-semibold text-xs h-11 rounded-xl"
                      >
                        <HelpCircle className="w-4 h-4 mr-1.5" />
                        {t("questions", lang)}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleAcknowledge("call")}
                        className="border-surface-border text-teal-deep hover:bg-mint-wash font-semibold text-xs h-11 rounded-xl"
                      >
                        <PhoneCall className="w-4 h-4 mr-1.5" />
                        {t("callMe", lang)}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Free Callback Request Card */}
                {callbackRequested ? (
                  <div className="p-3.5 rounded-xl bg-mint-wash border border-mint-light text-xs text-teal-deep font-semibold flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-teal-brand" />
                    <span>{t("callbackSuccess", lang)}</span>
                  </div>
                ) : (
                  showQuestionInput && (
                    <div className="p-4 rounded-xl bg-surface-white border border-surface-border space-y-2">
                      <label className="block text-xs font-bold text-teal-deep">
                        What would you like to ask your coordinator?
                      </label>
                      <input
                        type="text"
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        placeholder="e.g. Will this test hurt? Can I bring someone with me?"
                        className="w-full text-xs p-2.5 rounded-lg border border-surface-border bg-white"
                      />
                      <Button
                        size="sm"
                        onClick={handleCallbackSubmit}
                        className="bg-teal-brand text-white font-bold text-xs"
                      >
                        {t("requestCallback", lang)}
                      </Button>
                    </div>
                  )
                )}

                {/* 2-Question Pulse Check */}
                {!surveySubmitted && isAcknowledged && (
                  <div className="p-4 rounded-xl bg-surface-white border border-surface-border space-y-3 mt-4">
                    <span className="font-extrabold text-xs text-teal-deep block">
                      {t("pulseSurveyTitle", lang)}
                    </span>
                    <div className="space-y-2 text-xs">
                      <div>
                        <p className="text-muted mb-1">{t("pulseQ1", lang)}</p>
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button
                              key={val}
                              onClick={() => setQ1Score(val)}
                              className={`w-7 h-7 rounded-lg text-xs font-bold ${
                                q1Score === val ? "bg-teal-brand text-white" : "bg-surface-border text-muted"
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2">
                        <p className="text-muted mb-1">{t("pulseQ2", lang)}</p>
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button
                              key={val}
                              onClick={() => setQ2Score(val)}
                              className={`w-7 h-7 rounded-lg text-xs font-bold ${
                                q2Score === val ? "bg-teal-brand text-white" : "bg-surface-border text-muted"
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={handlePulseSubmit}
                        className="bg-teal-deep text-white text-xs mt-2"
                      >
                        {t("pulseSubmit", lang)}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right 5 Cols: Care Team & Care Journey Timeline */}
            <div className="lg:col-span-5 space-y-6">
              {/* Assigned Care Team */}
              <div className="p-6 rounded-2xl bg-surface-card border border-surface-border space-y-4 shadow-2xs">
                <h3 className="text-base font-extrabold text-teal-deep">{t("careTeam", lang)}</h3>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-surface-white border border-surface-border flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-brand/10 text-teal-brand font-bold text-xs flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                        {t("coordinatorLabel", lang)}
                      </span>
                      <strong className="text-xs font-extrabold text-teal-deep">
                        {c.currentOwnerRole === "coordinator" && c.currentOwnerName
                          ? c.currentOwnerName
                          : c.organizationId === "org-metro"
                          ? "Jessica Taylor, RN"
                          : "Sarah Thompson, BSN, RN"}
                      </strong>
                      <p className="text-[11px] text-muted">Dedicated Patient Navigator</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-white border border-surface-border flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-mint-wash text-teal-deep font-bold text-xs flex items-center justify-center">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                        {t("physicianLabel", lang)}
                      </span>
                      <strong className="text-xs font-extrabold text-teal-deep">
                        Dr. Kenneth Reynolds, MD
                      </strong>
                      <p className="text-[11px] text-muted">Primary Care Physician</p>
                    </div>
                  </div>

                  {c.referral && (
                    <div className="p-3 rounded-xl bg-surface-white border border-surface-border flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber/15 text-[#8C5D00] font-bold text-xs flex items-center justify-center">
                        <SendHorizontal className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                          {t("specialistLabel", lang)}
                        </span>
                        <strong className="text-xs font-extrabold text-teal-deep">
                          Dr. Maya Lin, MD, FACS
                        </strong>
                        <p className="text-[11px] text-muted">
                          {c.referral.specialtyRequired || "Consulting Specialist"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Care Journey Timeline */}
              <div className="p-6 rounded-2xl bg-surface-card border border-surface-border space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-teal-deep">{t("careTimeline", lang)}</h3>
                  <Badge variant="mint" className="text-[10px]">
                    {c.steps.filter((s) => s.status === "completed").length} of {c.steps.length} Completed
                  </Badge>
                </div>

                <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-border">
                  {c.steps
                    .filter((s) => s.status !== "skipped")
                    .map((step, idx) => {
                      const isComplete = step.status === "completed";
                      const isInProgress = step.status === "in-progress";

                      return (
                        <div key={idx} className="relative flex items-start gap-3 pl-1">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 z-10 ${
                              isComplete
                                ? "bg-teal-brand text-white"
                                : isInProgress
                                ? "bg-amber-400 text-slate-900 animate-pulse"
                                : "bg-surface-border text-muted"
                            }`}
                          >
                            {isComplete ? "✓" : idx + 1}
                          </div>

                          <div className="space-y-0.5 text-xs">
                            <span
                              className={`font-bold block ${
                                isComplete ? "text-teal-deep" : isInProgress ? "text-[#8C5D00]" : "text-muted"
                              }`}
                            >
                              {step.label}
                            </span>
                            {step.timestamp && (
                              <span className="text-[10px] text-muted block">
                                {formatDate(step.timestamp)} &bull; {formatTime(step.timestamp)}
                              </span>
                            )}
                            {step.note && <p className="text-[11px] text-muted leading-tight">{step.note}</p>}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MOBILE SMARTPHONE VIEW                                                 */}
      {/* ========================================================================= */}
      {viewMode === "mobile" && (
        <div className="flex justify-center py-4 animate-in fade-in duration-150">
          <div className="w-[390px] min-h-[780px] bg-[#060D12] text-slate-100 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700 relative overflow-hidden flex flex-col justify-between">
            {/* Phone Notch & Status Bar */}
            <div className="w-full flex items-center justify-between px-6 pt-2 pb-1 text-[11px] text-slate-400">
              <span className="font-bold">9:41</span>
              <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto" />
              <div className="flex items-center gap-1">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Mobile App Header */}
            <div className="bg-[#241710] px-4 py-3 border-b border-[#443024] flex items-center justify-between rounded-t-3xl">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-[#D49B6A]" />
                <span className="font-extrabold text-sm text-white">CareLoop</span>
              </div>
              <Badge variant="mint" className="text-[9px]">
                {c.patientLanguage.toUpperCase()}
              </Badge>
            </div>

            {/* Mobile Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {/* Patient Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#2D1D15] to-[#20140E] border border-[#443024] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{c.patientName}</span>
                  <Badge variant={c.urgency === "urgent" ? "coral" : "mint"} className="text-[9px]">
                    {c.screeningType}
                  </Badge>
                </div>
                <h3 className="text-base font-extrabold text-[#D49B6A] leading-snug">
                  {explanation.title}
                </h3>
                <p className="text-[11px] text-[#A8988B]">
                  {formatDate(c.createdAt)} &bull; {c.facility}
                </p>
              </div>

              {/* What This Means */}
              <div className="p-4 rounded-2xl bg-[#2D1D15] border border-[#443024] space-y-2">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#D49B6A]" />
                  {t("whatThisMeans", lang)}
                </h4>
                <p className="text-[#E6DDD5] text-xs leading-relaxed">{explanation.whatThisMeans}</p>
                <div className="p-2 rounded-lg bg-[#19100B] text-[11px] font-mono text-[#D49B6A]">
                  {c.resultValue}
                </div>
              </div>

              {/* Next Steps List */}
              <div className="p-4 rounded-2xl bg-[#2D1D15] border border-[#443024] space-y-2">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#D49B6A]" />
                  {t("whatHappensNext", lang)}
                </h4>
                <div className="space-y-2">
                  {explanation.whatHappensNext.map((stepText, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[#E6DDD5] text-xs">
                      <span className="w-4 h-4 rounded-full bg-[#965F2B]/30 text-[#D49B6A] font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{stepText}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reassurance */}
              <div className="p-3 rounded-xl bg-[#965F2B]/15 border border-[#965F2B]/30 text-xs text-[#E8B88A] leading-snug">
                {explanation.reassurance}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                {isAcknowledged ? (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 font-bold text-center text-xs flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {t("statusAcknowledged", lang)}
                  </div>
                ) : (
                  <>
                    <Button
                      onClick={() => handleAcknowledge("yes")}
                      className="w-full bg-[#965F2B] hover:bg-[#7E4D1E] text-white font-bold text-xs h-10 rounded-xl"
                    >
                      {t("yes", lang)}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleAcknowledge("call")}
                      className="w-full border-[#543C2E] text-[#E6DDD5] hover:bg-[#38251B] font-semibold text-xs h-10 rounded-xl"
                    >
                      {t("callMe", lang)}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Phone Home Bar */}
            <div className="w-32 h-1 bg-slate-700 rounded-full mx-auto my-1" />
          </div>
        </div>
      )}
    </div>
  );
};
