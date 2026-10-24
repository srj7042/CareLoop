import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Mail,
  Phone,
  MessageCircle,
  CheckCircle2,
  Clock,
  Radio,
  Volume2,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { t, getScreeningExplanation, type Lang } from "@/data/translations";
import { formatTime, formatDate } from "@/lib/utils";

export const PatientView = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { getCase, patientAcknowledge, setPatientPulse, requestCallback } = useStore();

  const c = React.useMemo(() => getCase(caseId || "CASE-001"), [getCase, caseId]);

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
        <Button size="sm" onClick={() => navigate("/coordinator")} className="bg-teal-brand text-white">
          Back to Worklist
        </Button>
      </div>
    );
  }

  const isRtl = lang === "ar";
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
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="max-w-md mx-auto min-h-screen bg-surface-white pb-12 font-sans"
    >
      {/* Mobile Top App Bar */}
      <div className="sticky top-0 z-30 bg-teal-deep text-white px-4 py-3.5 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/10 p-1.5 h-auto -ml-2"
          >
            <ChevronLeft size={20} className={isRtl ? "rotate-180" : ""} />
          </Button>
          <div>
            <span className="font-extrabold text-base tracking-tight">CareLoop</span>
            <p className="text-[10px] text-mint-wash opacity-80 -mt-0.5">
              {t(lang, "patientPortalTitle")}
            </p>
          </div>
        </div>

        {/* Language Selector Dropdown / Pills */}
        <div className="flex items-center gap-1">
          <Globe size={14} className="text-mint-light" />
          <div className="flex gap-1 bg-white/10 p-0.5 rounded-full">
            {(["en", "es", "hi", "mr", "ar"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${
                  lang === l
                    ? "bg-white text-teal-deep shadow-xs"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Welcome Greeting & Patient Header */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-mint-wash to-white border border-mint-light/60 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-deep">
              {c.patientName} • {c.patientAge}y
            </span>
            <Badge
              variant={
                c.urgency === "urgent"
                  ? "coral"
                  : c.urgency === "high"
                  ? "amber"
                  : "mint"
              }
              className="text-[10px] font-semibold capitalize"
            >
              {c.urgency === "urgent"
                ? t(lang, "urgentBadge")
                : c.urgency === "high"
                ? t(lang, "highBadge")
                : t(lang, "routineBadge")}
            </Badge>
          </div>

          <h2 className="text-xl font-extrabold text-teal-deep tracking-tight">
            {explanation.title}
          </h2>

          <div className="flex items-center justify-between text-[11px] text-muted pt-1 border-t border-mint-light/40">
            <span>
              {t(lang, "resultDate")}: {formatDate(c.createdAt)}
            </span>
            <span className="font-semibold text-teal-brand">{c.facility}</span>
          </div>
        </div>

        {/* Channel Delivery Status Simulation Ribbon */}
        <div className="p-3 bg-surface-card rounded-xl border border-surface-border text-xs space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-teal-deep text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Mail size={13} className="text-teal-brand" /> Communication Delivery Status
            </span>
            <span className="text-[10px] font-bold text-muted bg-surface-white px-2 py-0.5 rounded">
              SIMULATED
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1 text-center pt-1">
            <div className="p-1 rounded bg-mint-wash text-teal-deep font-bold text-[10px]">
              ✓ Sent
            </div>
            <div className="p-1 rounded bg-mint-wash text-teal-deep font-bold text-[10px]">
              ✓ Delivered
            </div>
            <div
              className={`p-1 rounded font-bold text-[10px] ${
                isAcknowledged
                  ? "bg-mint-wash text-teal-deep"
                  : "bg-surface-white border border-surface-border text-muted"
              }`}
            >
              ✓ Read
            </div>
            <div
              className={`p-1 rounded font-bold text-[10px] ${
                isAcknowledged
                  ? "bg-teal-brand text-white"
                  : "bg-surface-white border border-surface-border text-muted"
              }`}
            >
              {isAcknowledged ? "✓ Confirmed" : "Pending"}
            </div>
          </div>
        </div>

        {/* 1. What This Means Card (6th Grade Reading Level) */}
        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-teal-deep">
            <div className="w-7 h-7 rounded-lg bg-teal-brand/10 text-teal-brand flex items-center justify-center font-bold">
              <Clock size={16} />
            </div>
            <h3 className="font-bold text-base">{t(lang, "whatThisMeans")}</h3>
          </div>

          <p className="text-base text-body leading-relaxed font-normal">
            {explanation.whatThisMeans}
          </p>

          <div className="p-3 rounded-xl bg-surface-white border border-surface-border/70 text-xs">
            <span className="text-muted block text-[11px] font-semibold uppercase tracking-wider mb-0.5">
              Reported Test Finding
            </span>
            <span className="font-mono font-bold text-teal-deep text-sm">{c.resultValue}</span>
          </div>
        </div>

        {/* 2. What Happens Next Card */}
        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-teal-deep">
            <div className="w-7 h-7 rounded-lg bg-mint-wash text-teal-brand flex items-center justify-center font-bold">
              <ArrowRight size={16} className={isRtl ? "rotate-180" : ""} />
            </div>
            <h3 className="font-bold text-base">{t(lang, "whatHappensNext")}</h3>
          </div>

          <div className="space-y-2.5">
            {explanation.whatHappensNext.map((stepText, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-sm text-body">
                <span className="w-5 h-5 rounded-full bg-teal-brand/10 text-teal-brand font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{stepText}</span>
              </div>
            ))}
          </div>

          {/* Reassurance Message Banner */}
          <div className="p-3.5 bg-mint-wash border border-mint-light rounded-xl flex items-start gap-2.5 text-xs text-teal-deep leading-relaxed">
            <HeartPulse size={18} className="text-teal-brand flex-shrink-0 mt-0.5" />
            <p className="font-medium">{explanation.reassurance}</p>
          </div>
        </div>

        {/* 3. What You Need To Do Today Card */}
        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-teal-deep">
            <div className="w-7 h-7 rounded-lg bg-teal-brand/10 text-teal-brand flex items-center justify-center font-bold">
              <Check size={16} />
            </div>
            <h3 className="font-bold text-base">{t(lang, "whatINeedToDo")}</h3>
          </div>

          {/* Acknowledge Check Widget */}
          {!isAcknowledged ? (
            <div className="space-y-3 p-4 rounded-xl bg-mint-wash/50 border border-mint-light">
              <p className="font-bold text-teal-deep text-sm">
                {t(lang, "doYouUnderstand")}
              </p>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => handleAcknowledge("yes")}
                  className="w-full bg-teal-brand text-white hover:bg-teal-hover font-bold text-sm py-2.5 h-auto shadow-xs"
                >
                  <CheckCircle2 size={16} className="mr-2" />
                  {t(lang, "yes")}
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleAcknowledge("questions")}
                    className="border-surface-border bg-white text-body hover:bg-surface-white text-xs font-semibold"
                  >
                    <HelpCircle size={14} className="mr-1.5 text-amber" />
                    {t(lang, "questions")}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleAcknowledge("call")}
                    className="border-surface-border bg-white text-body hover:bg-surface-white text-xs font-semibold"
                  >
                    <PhoneCall size={14} className="mr-1.5 text-teal-brand" />
                    {t(lang, "callMe")}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-mint-wash border border-mint-light rounded-xl flex items-center gap-2 text-teal-deep text-sm font-bold">
              <CheckCircle2 size={18} className="text-teal-brand" />
              <span>{t(lang, "statusAcknowledged")}</span>
            </div>
          )}

          {/* Question / Callback Box */}
          {showQuestionInput && (
            <div className="space-y-2 p-3 bg-surface-white rounded-xl border border-surface-border text-xs">
              <p className="font-bold text-teal-deep">What questions can we answer for you?</p>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Type your question or concern here..."
                rows={2}
                className="w-full text-xs p-2 rounded-md border border-surface-border bg-white focus:outline-none focus:ring-1 focus:ring-teal-brand"
              />
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={() => setShowQuestionInput(false)} className="text-xs">
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleCallbackSubmit}
                  className="bg-teal-brand text-white text-xs font-semibold"
                >
                  Send to Coordinator
                </Button>
              </div>
            </div>
          )}

          {callbackRequested && (
            <div className="p-3 bg-mint-wash border border-mint-light rounded-xl text-xs text-teal-deep flex items-start gap-2">
              <PhoneCall size={16} className="text-teal-brand flex-shrink-0 mt-0.5" />
              <span>{t(lang, "callbackSuccess")}</span>
            </div>
          )}

          {/* Talk to Coordinator Direct Button */}
          {!callbackRequested && (
            <Button
              variant="outline"
              onClick={() => {
                setCallbackRequested(true);
                requestCallback(c.id, "Patient requested direct callback via patient portal button");
              }}
              className="w-full border-teal-brand/40 text-teal-deep hover:bg-mint-wash text-xs font-semibold py-2.5 h-auto flex items-center justify-center gap-2"
            >
              <PhoneCall size={15} className="text-teal-brand" />
              <span>{t(lang, "talkToSomeone")}</span>
            </Button>
          )}
        </div>

        {/* 4. 2-Question Pulse Survey Card */}
        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-teal-deep">
            <div className="w-7 h-7 rounded-lg bg-amber/15 text-[#8C5D00] flex items-center justify-center font-bold">
              <Star size={16} />
            </div>
            <h3 className="font-bold text-base">{t(lang, "pulseSurveyTitle")}</h3>
          </div>

          {!surveySubmitted ? (
            <div className="space-y-4 text-xs">
              {/* Question 1: Understanding */}
              <div className="space-y-2">
                <p className="font-semibold text-teal-deep">{t(lang, "pulseQ1")}</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      onClick={() => setQ1Score(score)}
                      className={`flex-1 py-2 rounded-lg border text-center font-bold text-xs transition-all ${
                        q1Score === score
                          ? "bg-teal-brand text-white border-teal-brand shadow-xs"
                          : "border-surface-border bg-surface-white text-muted hover:bg-white"
                      }`}
                    >
                      {score}★
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Confidence */}
              <div className="space-y-2">
                <p className="font-semibold text-teal-deep">{t(lang, "pulseQ2")}</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      onClick={() => setQ2Score(score)}
                      className={`flex-1 py-2 rounded-lg border text-center font-bold text-xs transition-all ${
                        q2Score === score
                          ? "bg-teal-brand text-white border-teal-brand shadow-xs"
                          : "border-surface-border bg-surface-white text-muted hover:bg-white"
                      }`}
                    >
                      {score}★
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handlePulseSubmit}
                className="w-full bg-teal-brand text-white hover:bg-teal-hover font-bold text-xs py-2 h-auto"
              >
                {t(lang, "pulseSubmit")}
              </Button>
            </div>
          ) : (
            <div className="p-3 bg-mint-wash border border-mint-light rounded-xl text-xs text-teal-deep flex items-center gap-2">
              <CheckCircle2 size={16} className="text-teal-brand" />
              <span>{t(lang, "pulseThankYou")}</span>
            </div>
          )}
        </div>

        {/* Footer Disclaimer */}
        <p className="text-[11px] text-muted text-center leading-relaxed px-4 pt-2">
          {t(lang, "simulatedDisclaimer")}
        </p>
      </div>
    </div>
  );
};
