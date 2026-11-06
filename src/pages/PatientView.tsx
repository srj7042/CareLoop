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
import { GlassCard, StatusPill, IconButton } from "@/components/design-system";
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
        <p className="text-base font-bold text-[#1E2532]">Patient Record Not Found</p>
        <p className="text-xs text-[#798393]">You do not have authorization to view this medical record.</p>
        <Button size="sm" onClick={() => navigate("/")} className="bg-[#10B981] text-white rounded-xl">
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
      <GlassCard className="p-4 rounded-[24px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* View Mode Switcher */}
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-[#798393] uppercase tracking-wider">
              {t("viewMode", lang)}:
            </span>
            <div className="flex items-center bg-white/70 border border-white/80 rounded-xl p-1 shadow-2xs">
              <button
                onClick={() => setViewMode("web")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "web"
                    ? "bg-white text-[#1E2532] shadow-xs"
                    : "text-[#798393] hover:text-[#1E2532]"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>{t("viewModeWeb", lang)}</span>
              </button>
              <button
                onClick={() => setViewMode("mobile")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "mobile"
                    ? "bg-white text-[#1E2532] shadow-xs"
                    : "text-[#798393] hover:text-[#1E2532]"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{t("viewModeMobile", lang)}</span>
              </button>
            </div>
          </div>

          {/* 5-Language Selector */}
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#8B5CF6]" />
            <span className="text-xs font-bold text-[#798393] uppercase tracking-wider">
              {t("language", lang)}:
            </span>
            <div className="flex flex-wrap gap-1 bg-white/70 border border-white/80 p-1 rounded-xl shadow-2xs">
              {SUPPORTED_LANGUAGES.map((item) => (
                <button
                  key={item.code}
                  onClick={() => setLang(item.code)}
                  className={`text-xs font-bold px-3 py-1 rounded-lg transition-all ${
                    lang === item.code
                      ? "bg-white text-[#1E2532] shadow-xs border border-white/90"
                      : "text-[#798393] hover:text-[#1E2532] hover:bg-white/50"
                  }`}
                >
                  {item.nativeName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* ========================================================================= */}
      {/* 1. WEB DESKTOP VIEW                                                       */}
      {/* ========================================================================= */}
      {viewMode === "web" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Patient Banner */}
          <GlassCard className="p-6 rounded-[26px]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <StatusPill
                    variant={c.urgency === "urgent" ? "coral" : c.urgency === "high" ? "amber" : "mint"}
                    label={
                      c.urgency === "urgent"
                        ? t("urgentBadge", lang)
                        : c.urgency === "high"
                        ? t("highBadge", lang)
                        : t("routineBadge", lang)
                    }
                    size="sm"
                  />
                  <span className="text-xs text-[#798393]">&bull; {c.program}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#1E2532] tracking-tight">
                  {explanation.title}
                </h1>
                <p className="text-xs text-[#798393]">
                  {t("patientName", lang)}: <strong className="text-[#1E2532]">{c.patientName}</strong> &bull; {c.patientAge} years old &bull; {c.facility}
                </p>
              </div>

              <div className="text-left md:text-right text-xs text-[#798393] space-y-2">
                <div>
                  {t("resultDate", lang)}: <strong className="text-[#1E2532]">{formatDate(c.createdAt)}</strong>
                </div>
                <div>
                  {isAcknowledged ? (
                    <StatusPill variant="mint" label={t("statusAcknowledged", lang)} pulse />
                  ) : (
                    <StatusPill variant="amber" label={t("statusPending", lang)} pulse />
                  )}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: Results & Actions */}
            <div className="lg:col-span-7 space-y-6">
              {/* Plain Language Explanation */}
              <GlassCard className="p-6 rounded-[26px] space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/15 text-[#8B5CF6] flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-extrabold text-[#1E2532]">{t("whatThisMeans", lang)}</h2>
                </div>

                <p className="text-base text-[#1E2532] leading-relaxed">{explanation.whatThisMeans}</p>

                <div className="p-4 rounded-2xl bg-white/70 border border-white/80 text-xs shadow-2xs">
                  <span className="text-[#798393] block text-[11px] font-semibold uppercase tracking-wider mb-1">
                    Clinical Finding
                  </span>
                  <span className="font-mono font-bold text-[#1E2532] text-sm">{c.resultValue}</span>
                </div>
              </GlassCard>

              {/* What Happens Next */}
              <GlassCard className="p-6 rounded-[26px] space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center font-bold">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-extrabold text-[#1E2532]">{t("whatHappensNext", lang)}</h2>
                </div>

                <div className="space-y-3">
                  {explanation.whatHappensNext.map((stepText, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-[#1E2532]">
                      <span className="w-6 h-6 rounded-full bg-[#10B981]/15 text-[#10B981] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{stepText}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Reassurance Alert */}
              <GlassCard variant="subtle" className="p-5 rounded-[22px] flex items-start gap-3 text-xs text-[#1E2532]">
                <HeartPulse className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">{explanation.reassurance}</p>
              </GlassCard>

              {/* Patient 1-Tap Actions */}
              <GlassCard className="p-6 rounded-[26px] space-y-4">
                <h3 className="text-base font-extrabold text-[#1E2532]">{t("whatINeedToDo", lang)}</h3>

                {isAcknowledged ? (
                  <div className="p-4 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 text-[#065F46] text-xs flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0" />
                    <div>
                      <strong className="font-bold block text-sm">{t("statusAcknowledged", lang)}</strong>
                      <span>Your confirmation is logged in your electronic care record.</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-[#798393]">{t("doYouUnderstand", lang)}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Button
                        onClick={() => handleAcknowledge("yes")}
                        className="bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs h-11 rounded-2xl shadow-xs"
                      >
                        <Check className="w-4 h-4 mr-1.5" />
                        {t("yes", lang)}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleAcknowledge("questions")}
                        className="border-white/80 bg-white/70 text-[#1E2532] hover:bg-white font-semibold text-xs h-11 rounded-2xl shadow-2xs"
                      >
                        <HelpCircle className="w-4 h-4 mr-1.5 text-[#8B5CF6]" />
                        {t("questions", lang)}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleAcknowledge("call")}
                        className="border-white/80 bg-white/70 text-[#1E2532] hover:bg-white font-semibold text-xs h-11 rounded-2xl shadow-2xs"
                      >
                        <PhoneCall className="w-4 h-4 mr-1.5 text-[#10B981]" />
                        {t("callMe", lang)}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Free Callback Request Card */}
                {callbackRequested ? (
                  <div className="p-4 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 text-xs text-[#065F46] font-semibold flex items-center gap-2.5">
                    <PhoneCall className="w-4 h-4 text-[#10B981]" />
                    <span>{t("callbackSuccess", lang)}</span>
                  </div>
                ) : (
                  showQuestionInput && (
                    <div className="p-4 rounded-2xl bg-white/80 border border-white/80 space-y-2.5 shadow-2xs">
                      <label className="block text-xs font-bold text-[#1E2532]">
                        What would you like to ask your coordinator?
                      </label>
                      <input
                        type="text"
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        placeholder="e.g. Will this test hurt? Can I bring someone with me?"
                        className="w-full text-xs p-3 rounded-xl border border-white/80 bg-white text-[#1E2532] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 shadow-2xs"
                      />
                      <Button
                        size="sm"
                        onClick={handleCallbackSubmit}
                        className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-xs rounded-xl shadow-xs"
                      >
                        {t("requestCallback", lang)}
                      </Button>
                    </div>
                  )
                )}

                {/* 2-Question Pulse Check */}
                {!surveySubmitted && isAcknowledged && (
                  <div className="p-4 rounded-2xl bg-white/70 border border-white/80 space-y-3 mt-4 shadow-2xs">
                    <span className="font-extrabold text-xs text-[#1E2532] block">
                      {t("pulseSurveyTitle", lang)}
                    </span>
                    <div className="space-y-3 text-xs">
                      <div>
                        <p className="text-[#798393] mb-1.5">{t("pulseQ1", lang)}</p>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button
                              key={val}
                              onClick={() => setQ1Score(val)}
                              className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                                q1Score === val ? "bg-[#10B981] text-white shadow-xs" : "bg-white border border-white/80 text-[#798393]"
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2">
                        <p className="text-[#798393] mb-1.5">{t("pulseQ2", lang)}</p>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button
                              key={val}
                              onClick={() => setQ2Score(val)}
                              className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                                q2Score === val ? "bg-[#10B981] text-white shadow-xs" : "bg-white border border-white/80 text-[#798393]"
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
                        className="bg-[#1E2532] text-white text-xs mt-2 rounded-xl"
                      >
                        {t("pulseSubmit", lang)}
                      </Button>
                    </div>
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Right 5 Cols: Care Team & Care Journey Timeline */}
            <div className="lg:col-span-5 space-y-6">
              {/* Assigned Care Team */}
              <GlassCard className="p-6 rounded-[26px] space-y-4">
                <h3 className="text-base font-extrabold text-[#1E2532]">{t("careTeam", lang)}</h3>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-white/70 border border-white/80 flex items-center gap-3.5 shadow-2xs hover:bg-white/90 hover:shadow-md hover:-translate-y-0.5 hover:border-white transition-all duration-200 cursor-default">
                    <div className="w-10 h-10 rounded-2xl bg-[#8B5CF6]/15 text-[#8B5CF6] font-bold text-xs flex items-center justify-center shadow-xs">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#798393] block">
                        {t("coordinatorLabel", lang)}
                      </span>
                      <strong className="text-xs font-extrabold text-[#1E2532]">
                        {c.currentOwnerRole === "coordinator" && c.currentOwnerName
                          ? c.currentOwnerName
                          : c.organizationId === "org-metro"
                          ? "Jessica Taylor, RN"
                          : "Sarah Thompson, BSN, RN"}
                      </strong>
                      <p className="text-[11px] text-[#798393]">Dedicated Patient Navigator</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/70 border border-white/80 flex items-center gap-3.5 shadow-2xs hover:bg-white/90 hover:shadow-md hover:-translate-y-0.5 hover:border-white transition-all duration-200 cursor-default">
                    <div className="w-10 h-10 rounded-2xl bg-[#10B981]/15 text-[#10B981] font-bold text-xs flex items-center justify-center shadow-xs">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#798393] block">
                        {t("physicianLabel", lang)}
                      </span>
                      <strong className="text-xs font-extrabold text-[#1E2532]">
                        Dr. Kenneth Reynolds, MD
                      </strong>
                      <p className="text-[11px] text-[#798393]">Primary Care Physician</p>
                    </div>
                  </div>

                  {c.referral && (
                    <div className="p-3.5 rounded-2xl bg-white/70 border border-white/80 flex items-center gap-3.5 shadow-2xs hover:bg-white/90 hover:shadow-md hover:-translate-y-0.5 hover:border-white transition-all duration-200 cursor-default">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-[#F59E0B] font-bold text-xs flex items-center justify-center shadow-xs">
                        <SendHorizontal className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#798393] block">
                          {t("specialistLabel", lang)}
                        </span>
                        <strong className="text-xs font-extrabold text-[#1E2532]">
                          Dr. Maya Lin, MD, FACS
                        </strong>
                        <p className="text-[11px] text-[#798393]">
                          {c.referral.specialtyRequired || "Consulting Specialist"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>

              {/* Care Journey Timeline */}
              <GlassCard className="p-6 rounded-[26px] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-[#1E2532]">{t("careTimeline", lang)}</h3>
                  <StatusPill
                    variant="mint"
                    label={`${c.steps.filter((s) => s.status === "completed").length} of ${c.steps.length} Completed`}
                    size="sm"
                  />
                </div>

                <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/80">
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
                                ? "bg-[#10B981] text-white shadow-2xs"
                                : isInProgress
                                ? "bg-amber-400 text-slate-900 animate-pulse"
                                : "bg-white border border-white/80 text-[#798393]"
                            }`}
                          >
                            {isComplete ? "✓" : idx + 1}
                          </div>

                          <div className="space-y-0.5 text-xs">
                            <span
                              className={`font-bold block ${
                                isComplete ? "text-[#1E2532]" : isInProgress ? "text-amber-800" : "text-[#798393]"
                              }`}
                            >
                              {step.label}
                            </span>
                            {step.timestamp && (
                              <span className="text-[10px] text-[#798393] block">
                                {formatDate(step.timestamp)} &bull; {formatTime(step.timestamp)}
                              </span>
                            )}
                            {step.note && <p className="text-[11px] text-[#798393] leading-tight">{step.note}</p>}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MOBILE SMARTPHONE VIEW                                                 */}
      {/* ========================================================================= */}
      {viewMode === "mobile" && (
        <div className="flex justify-center py-4 animate-in fade-in duration-150">
          <div className="w-[390px] min-h-[780px] bg-slate-900/90 backdrop-blur-xl text-slate-100 rounded-[44px] p-3 shadow-2xl border-4 border-white/20 relative overflow-hidden flex flex-col justify-between">
            {/* Phone Notch & Status Bar */}
            <div className="w-full flex items-center justify-between px-6 pt-2 pb-1 text-[11px] text-slate-400">
              <span className="font-bold">9:41</span>
              <div className="w-20 h-4 bg-slate-800/80 rounded-full mx-auto" />
              <div className="flex items-center gap-1">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Mobile App Header */}
            <div className="bg-slate-800/60 backdrop-blur-md px-4 py-3 border-b border-white/10 flex items-center justify-between rounded-t-3xl">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-[#10B981]" />
                <span className="font-extrabold text-sm text-white">CareLoop</span>
              </div>
              <StatusPill variant="dark" label={c.patientLanguage.toUpperCase()} size="sm" />
            </div>

            {/* Mobile Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {/* Patient Banner */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{c.patientName}</span>
                  <StatusPill variant={c.urgency === "urgent" ? "coral" : "mint"} label={c.screeningType} size="sm" />
                </div>
                <h3 className="text-base font-extrabold text-white leading-snug">
                  {explanation.title}
                </h3>
                <p className="text-[11px] text-slate-300">
                  {formatDate(c.createdAt)} &bull; {c.facility}
                </p>
              </div>

              {/* What This Means */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#10B981]" />
                  {t("whatThisMeans", lang)}
                </h4>
                <p className="text-slate-200 text-xs leading-relaxed">{explanation.whatThisMeans}</p>
                <div className="p-2 rounded-xl bg-slate-950/60 text-[11px] font-mono text-[#10B981] border border-white/10">
                  {c.resultValue}
                </div>
              </div>

              {/* Next Steps List */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  {t("whatHappensNext", lang)}
                </h4>
                <div className="space-y-2">
                  {explanation.whatHappensNext.map((stepText, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-200 text-xs">
                      <span className="w-4 h-4 rounded-full bg-[#8B5CF6]/30 text-[#A78BFA] font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{stepText}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reassurance */}
              <div className="p-3.5 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs text-emerald-200 leading-snug">
                {explanation.reassurance}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                {isAcknowledged ? (
                  <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-center text-xs flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    {t("statusAcknowledged", lang)}
                  </div>
                ) : (
                  <>
                    <Button
                      onClick={() => handleAcknowledge("yes")}
                      className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs h-10 rounded-2xl shadow-xs"
                    >
                      {t("yes", lang)}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleAcknowledge("call")}
                      className="w-full border-white/20 text-white hover:bg-white/10 font-semibold text-xs h-10 rounded-2xl"
                    >
                      {t("callMe", lang)}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Phone Home Bar */}
            <div className="w-32 h-1 bg-white/30 rounded-full mx-auto my-1" />
          </div>
        </div>
      )}
    </div>
  );
};