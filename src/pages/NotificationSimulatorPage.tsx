import * as React from "react";
import {
  Bell,
  Mail,
  MessageSquare,
  Radio,
  Volume2,
  Send,
  HelpCircle,
  Phone,
  CheckCircle2,
  Clock,
  Sparkles,
  Smartphone,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Channel } from "@/types";
import { formatTime, formatDate } from "@/lib/utils";

export const NotificationSimulatorPage = () => {
  const { cases, addNotification } = useStore();

  const [selectedCaseId, setSelectedCaseId] = React.useState("CASE-001");
  const [selectedChannel, setSelectedChannel] = React.useState<Channel>("sms");
  const [customMsg, setCustomMsg] = React.useState("");

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  const templates: Record<Channel, string> = {
    sms: `CareLoop: Hola ${selectedCase.patientName}, your ${selectedCase.screeningType} result is ready in your portal. Please log in to confirm.`,
    whatsapp: `CareLoop Health: Hello ${selectedCase.patientName}, reminder from ${selectedCase.facility} regarding your ${selectedCase.screeningType} follow-up.`,
    email: `CareLoop Notification: Important confidential screening result and care plan update available for ${selectedCase.patientName}.`,
    push: `CareLoop Alert: New actionable result for ${selectedCase.screeningType} waiting for confirmation.`,
    voice: `Automated Voice Call: This is CareLoop calling for ${selectedCase.patientName} regarding an urgent health follow-up item.`,
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = customMsg.trim() || templates[selectedChannel];
    addNotification(selectedCase.id, {
      channel: selectedChannel,
      to: selectedCase.patientPhone,
      message: msg,
      status: "delivered",
    });
    setCustomMsg("");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-teal-deep">Multi-Channel Notification Simulator</h1>
            <Badge variant="mint" className="text-xs">
              Simulated Demo Engine
            </Badge>
          </div>
          <p className="text-xs text-muted mt-1">
            Simulate patient outreach across SMS, WhatsApp, Email, App Push, and Voice Fallback channels. No real telecom charges apply.
          </p>
        </div>
      </div>

      {/* Simulator Working Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Message Dispatch Form & Case Selector */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-4 shadow-xs">
            <h3 className="font-bold text-teal-deep text-sm">Configure Outreach Parameters</h3>

            {/* Select Target Case */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-teal-deep">Target Patient Case</label>
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-surface-border bg-surface-white focus:outline-none focus:ring-1 focus:ring-teal-brand"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} - {c.patientName} ({c.screeningType} • {c.urgency.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* Patient Context Card */}
            <div className="p-3.5 rounded-xl bg-mint-wash/60 border border-mint-light/60 grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-muted block text-[11px]">Patient Name</span>
                <span className="font-bold text-teal-deep">{selectedCase.patientName}</span>
              </div>
              <div>
                <span className="text-muted block text-[11px]">Preferred Language</span>
                <span className="font-bold text-teal-brand uppercase">{selectedCase.patientLanguage}</span>
              </div>
              <div>
                <span className="text-muted block text-[11px]">Target Phone</span>
                <span className="font-mono font-bold text-body">{selectedCase.patientPhone}</span>
              </div>
            </div>

            {/* Select Channel */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-teal-deep">Communication Channel</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: "sms" as const, label: "SMS", icon: Mail, color: "text-teal-brand" },
                  { id: "whatsapp" as const, label: "WhatsApp", icon: MessageSquare, color: "text-[#25D366]" },
                  { id: "email" as const, label: "Email", icon: Mail, color: "text-blue" },
                  { id: "push" as const, label: "App Push", icon: Radio, color: "text-amber" },
                  { id: "voice" as const, label: "Voice Fallback", icon: Volume2, color: "text-coral" },
                ].map((ch) => {
                  const Icon = ch.icon;
                  const isSelected = selectedChannel === ch.id;

                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => {
                        setSelectedChannel(ch.id);
                        setCustomMsg(templates[ch.id]);
                      }}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? "bg-white border-teal-brand ring-2 ring-teal-brand/30 shadow-xs"
                          : "border-surface-border bg-surface-white hover:bg-white text-muted"
                      }`}
                    >
                      <Icon size={18} className={`mx-auto mb-1 ${ch.color}`} />
                      <span className={`text-xs block font-bold ${isSelected ? "text-teal-deep" : "text-muted"}`}>
                        {ch.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message Body */}
            <form onSubmit={handleSend} className="space-y-3 pt-2">
              <div className="space-y-1 text-xs">
                <label className="font-bold text-teal-deep">Simulated Message Body</label>
                <textarea
                  value={customMsg || templates[selectedChannel]}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-3 rounded-xl border border-surface-border bg-white focus:outline-none focus:ring-1 focus:ring-teal-brand"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-teal-brand text-white hover:bg-teal-hover font-bold text-xs shadow-xs"
                >
                  <Send size={14} className="mr-1.5" /> Dispatch Simulated {selectedChannel.toUpperCase()}
                </Button>
              </div>
            </form>
          </div>

          {/* History of Messages for this Patient */}
          <div className="p-5 rounded-2xl bg-surface-card border border-surface-border space-y-3 shadow-xs">
            <h3 className="font-bold text-teal-deep text-sm">
              Outreach Log for {selectedCase.patientName} ({selectedCase.notifications.length})
            </h3>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {selectedCase.notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-3 bg-surface-white rounded-xl border border-surface-border text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-teal-deep uppercase">{n.channel} → {n.to}</span>
                    <span className="text-muted">{formatTime(n.sentAt)} ({formatDate(n.sentAt)})</span>
                  </div>
                  <p className="text-body text-xs bg-white p-2 rounded-lg border border-surface-border">
                    "{n.message}"
                  </p>
                  <div className="flex items-center justify-between text-[11px] pt-0.5">
                    <span className="font-bold text-teal-brand capitalize">
                      Status: {n.status} ✓
                    </span>
                    <span className="text-[10px] text-muted">Attempt #{n.attemptNumber || 1}</span>
                  </div>
                </div>
              ))}

              {selectedCase.notifications.length === 0 && (
                <p className="text-xs text-muted text-center py-6">No notifications sent to this case yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Mobile Device Live Preview Frame */}
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-xs font-bold text-teal-deep uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Smartphone size={14} className="text-teal-brand" /> Live Patient Device Preview
            </span>
          </div>

          {/* Realistic Mobile Device Frame */}
          <div className="mx-auto max-w-[280px] rounded-[36px] border-4 border-teal-deep bg-teal-deep p-3 shadow-xl text-body">
            {/* Notch */}
            <div className="w-24 h-4 bg-teal-deep mx-auto rounded-b-xl mb-2 flex items-center justify-center">
              <div className="w-8 h-1 bg-white/30 rounded-full" />
            </div>

            {/* Screen */}
            <div className="rounded-[24px] bg-surface-white p-3 min-h-[440px] flex flex-col justify-between text-xs space-y-3">
              {/* Notification Banner Push / SMS / WhatsApp */}
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-white shadow-sm border border-surface-border space-y-1 animate-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1 font-bold text-teal-brand">
                      {selectedChannel === "whatsapp" ? (
                        <MessageSquare size={11} className="text-[#25D366]" />
                      ) : (
                        <Mail size={11} />
                      )}
                      <span>CareLoop Health</span>
                    </div>
                    <span className="text-muted">now</span>
                  </div>
                  <p className="text-[11px] font-semibold text-teal-deep leading-tight">
                    Actionable Screening Result
                  </p>
                  <p className="text-[10px] text-body/90 leading-tight">
                    {customMsg || templates[selectedChannel]}
                  </p>
                </div>
              </div>

              {/* Bottom Nav / Lock Screen Mock */}
              <div className="text-center pt-8 space-y-2 mt-auto">
                <div className="w-10 h-10 rounded-full bg-teal-brand text-white mx-auto flex items-center justify-center shadow-md">
                  <CheckCircle2 size={20} />
                </div>
                <p className="text-[11px] font-bold text-teal-deep">CareLoop Patient Portal</p>
                <p className="text-[10px] text-muted">Tap notification to open plain language review</p>
              </div>
            </div>

            {/* Bottom Home Indicator */}
            <div className="w-24 h-1 bg-white/40 rounded-full mx-auto mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
};
