import * as React from "react";
import {
  MessageSquare,
  Mail,
  Phone,
  Radio,
  Send,
  CheckCheck,
  Check,
  AlertCircle,
  HelpCircle,
  Volume2,
} from "lucide-react";
import type { NotificationLog, Channel } from "@/types";
import { formatTime, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const channelMeta: Record<
  Channel,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  sms: { label: "SMS", icon: Mail, color: "text-teal-brand", bg: "bg-teal-brand/10" },
  whatsapp: { label: "WhatsApp", icon: MessageSquare, color: "text-[#25D366]", bg: "bg-[#25D366]/10" },
  email: { label: "Email", icon: Mail, color: "text-blue", bg: "bg-blue/10" },
  push: { label: "App Push", icon: Radio, color: "text-amber", bg: "bg-amber/10" },
  voice: { label: "Voice Call (Fallback)", icon: Volume2, color: "text-coral", bg: "bg-coral/10" },
};

export const NotificationSimulator = ({
  caseId,
  notifications,
  onSend,
  defaultRecipient = "+1 (555) 019-4821",
}: {
  caseId: string;
  notifications: NotificationLog[];
  onSend: (channel: Channel, to: string, message: string) => void;
  defaultRecipient?: string;
}) => {
  const [selectedChannel, setSelectedChannel] = React.useState<Channel>("sms");
  const [recipient, setRecipient] = React.useState(defaultRecipient);
  const [customMessage, setCustomMessage] = React.useState("");

  const templates: Record<Channel, string> = {
    sms: "CareLoop: Your screening result is ready to review in your secure patient portal. Please log in to confirm.",
    whatsapp: "CareLoop Health: Reminder from your care coordinator. We need to confirm you received your mammogram result.",
    email: "CareLoop Notification: Important confidential screening result and care plan update available.",
    push: "CareLoop Alert: New actionable lab result waiting for your confirmation.",
    voice: "Automated Voice Outreach: This is CareLoop with an urgent follow-up notification regarding your recent health test.",
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = customMessage.trim() || templates[selectedChannel];
    onSend(selectedChannel, recipient, msg);
    setCustomMessage("");
  };

  return (
    <div className="space-y-4">
      {/* Simulation Warning Banner */}
      <div className="p-3 bg-amber/10 border border-amber/30 rounded-xl text-xs flex items-start gap-2 text-[#8C5D00]">
        <HelpCircle size={16} className="flex-shrink-0 mt-0.5 text-amber" />
        <div>
          <span className="font-bold">Simulated Notification Engine</span>
          <p className="text-[11px] text-[#8C5D00]/90 mt-0.5">
            Channel delivery is simulated for hackathon evaluation. No external SMS, WhatsApp, or carrier fees are incurred.
          </p>
        </div>
      </div>

      {/* Dispatch Form */}
      <form onSubmit={handleSend} className="space-y-3 p-4 bg-surface-white rounded-xl border border-surface-border">
        <p className="text-xs font-bold text-teal-deep">Dispatch Simulated Notification</p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
          {(Object.keys(channelMeta) as Channel[]).map((ch) => {
            const meta = channelMeta[ch];
            const Icon = meta.icon;
            const isSelected = selectedChannel === ch;
            return (
              <button
                type="button"
                key={ch}
                onClick={() => {
                  setSelectedChannel(ch);
                  if (!customMessage) setCustomMessage(templates[ch]);
                }}
                className={`p-2 rounded-lg border text-center transition-all ${
                  isSelected
                    ? "bg-white border-teal-brand ring-2 ring-teal-brand/20 shadow-xs"
                    : "border-surface-border bg-surface-card hover:bg-white text-muted"
                }`}
              >
                <Icon size={16} className={`mx-auto mb-1 ${meta.color}`} />
                <span className={`text-[11px] block font-semibold ${isSelected ? "text-teal-deep" : "text-muted"}`}>
                  {meta.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Recipient number or email"
            className="text-xs px-3 py-2 rounded-md border border-surface-border bg-white focus:outline-none focus:ring-1 focus:ring-teal-brand"
          />
          <input
            type="text"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder={templates[selectedChannel]}
            className="text-xs px-3 py-2 rounded-md border border-surface-border bg-white focus:outline-none focus:ring-1 focus:ring-teal-brand sm:col-span-2"
          />
        </div>

        <div className="flex justify-end">
          <Button size="sm" type="submit" className="bg-teal-brand text-white hover:bg-teal-hover text-xs font-semibold">
            <Send size={13} className="mr-1.5" /> Dispatch Simulated Message
          </Button>
        </div>
      </form>

      {/* Timeline of Logs */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-teal-deep uppercase tracking-wider">Communication Logs ({notifications.length})</p>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {notifications.map((n) => {
            const meta = channelMeta[n.channel] || channelMeta.sms;
            const Icon = meta.icon;
            const isDelivered = n.status === "delivered" || n.status === "read" || n.status === "acknowledged";
            const isRead = n.status === "read" || n.status === "acknowledged";
            const isAck = n.status === "acknowledged";
            const isFailed = n.status === "failed";

            return (
              <div
                key={n.id}
                className="p-3 bg-surface-card border border-surface-border rounded-xl flex items-start gap-3 text-xs"
              >
                <div className={`w-8 h-8 rounded-full ${meta.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Icon size={16} className={meta.color} />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-teal-deep">{meta.label} → {n.to}</span>
                    <span className="text-[11px] text-muted">{formatTime(n.sentAt)}</span>
                  </div>

                  <p className="text-body text-xs bg-surface-white/80 p-2 rounded-md border border-surface-border/50">
                    "{n.message}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-muted pt-1">
                    <div className="flex items-center gap-1.5">
                      {isFailed ? (
                        <span className="text-coral font-bold flex items-center gap-1">
                          <AlertCircle size={12} /> Delivery Failed (Voice unanswered)
                        </span>
                      ) : isAck ? (
                        <span className="text-teal-brand font-bold flex items-center gap-1">
                          <CheckCheck size={13} /> Acknowledged by Patient
                        </span>
                      ) : isRead ? (
                        <span className="text-teal-deep font-semibold flex items-center gap-1">
                          <CheckCheck size={13} /> Read by Patient
                        </span>
                      ) : isDelivered ? (
                        <span className="text-muted font-medium flex items-center gap-1">
                          <Check size={12} /> Delivered
                        </span>
                      ) : (
                        <span className="text-muted italic">Sent</span>
                      )}
                    </div>

                    <span className="text-[10px] uppercase font-bold text-muted/80">
                      Simulated
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {notifications.length === 0 && (
            <p className="text-xs text-muted text-center py-4">No notification logs recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
