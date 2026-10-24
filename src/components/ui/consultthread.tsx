import * as React from "react";
import { MessageSquare, Clock, Send, ShieldCheck, CheckCircle2 } from "lucide-react";
import type { ConsultMessage, Role } from "@/types";
import { formatRelative, formatTime, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const ConsultThread = ({
  consults,
  currentUserId,
  currentUserRole,
  onRespond,
}: {
  consults: ConsultMessage[];
  currentUserId: string;
  currentUserRole: Role;
  onRespond?: (consultId: string, response: string, outcomeNote: string) => void;
}) => {
  const [activeReplyId, setActiveReplyId] = React.useState<string | null>(null);
  const [replyText, setReplyText] = React.useState("");
  const [outcomeText, setOutcomeText] = React.useState("");

  const handleSendReply = (consultId: string) => {
    if (!replyText.trim() || !onRespond) return;
    onRespond(consultId, replyText, outcomeText || "Specialist clinical guidance rendered.");
    setActiveReplyId(null);
    setReplyText("");
    setOutcomeText("");
  };

  return (
    <div className="space-y-4">
      {consults.map((c) => {
        const isTarget = c.to === currentUserId || currentUserRole === "specialist";
        const isAnswered = !!c.respondedAt;

        return (
          <div
            key={c.id}
            className="border border-surface-border rounded-card bg-surface-card p-4 transition-all hover:shadow-xs space-y-3"
          >
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-border pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-teal-brand/10 text-teal-brand flex items-center justify-center font-bold text-xs">
                  {c.fromName.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-teal-deep">
                    {c.fromName}{" "}
                    <span className="font-normal text-muted">({c.fromRole})</span>
                    {" → "}
                    <span className="font-semibold text-teal-brand">{c.toName}</span>
                  </p>
                  <p className="text-[11px] text-muted">{formatRelative(c.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    c.urgency === "urgent"
                      ? "coral"
                      : c.urgency === "high"
                      ? "amber"
                      : "mint"
                  }
                  className="text-[11px] capitalize"
                >
                  {c.urgency} Consult
                </Badge>
                {isAnswered ? (
                  <Badge variant="mint" className="text-[11px]">
                    Answered ✓
                  </Badge>
                ) : (
                  <Badge variant="amber" className="text-[11px]">
                    Pending Response
                  </Badge>
                )}
              </div>
            </div>

            {/* Question */}
            <div>
              <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-1">
                Clinical Question
              </p>
              <p className="text-sm text-body leading-relaxed">{c.question}</p>
            </div>

            {/* Attached results */}
            {c.attachedResults && c.attachedResults.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {c.attachedResults.map((res, i) => (
                  <span
                    key={i}
                    className="inline-block px-2 py-0.5 rounded text-[11px] bg-surface-border/50 text-teal-deep border border-surface-border font-medium"
                  >
                    📎 {res}
                  </span>
                ))}
              </div>
            )}

            {/* Response Section */}
            {c.response ? (
              <div className="mt-3 p-3 bg-mint-wash/70 border border-mint-light/40 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-teal-deep">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-teal-brand" />
                    Specialist Response
                  </span>
                  <span className="text-[11px] text-muted">
                    {c.respondedAt && formatRelative(c.respondedAt)}
                  </span>
                </div>
                <p className="text-sm text-body">{c.response}</p>
                {c.outcomeNote && (
                  <p className="text-xs text-muted font-medium pt-1 border-t border-mint-light/30">
                    <strong className="text-teal-deep">Outcome:</strong> {c.outcomeNote}
                  </p>
                )}
              </div>
            ) : isTarget && activeReplyId !== c.id ? (
              <div className="pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveReplyId(c.id)}
                  className="text-xs text-teal-brand"
                >
                  <MessageSquare size={13} className="mr-1.5" /> Respond to Consult
                </Button>
              </div>
            ) : null}

            {/* Reply Form */}
            {activeReplyId === c.id && (
              <div className="mt-3 p-3 border border-teal-brand/30 bg-mint-wash/30 rounded-lg space-y-2">
                <p className="text-xs font-bold text-teal-deep">Draft Specialist Response</p>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Enter clinical opinion and recommended next step..."
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-md border border-surface-border bg-white focus:outline-none focus:ring-1 focus:ring-teal-brand"
                />
                <input
                  type="text"
                  value={outcomeText}
                  onChange={(e) => setOutcomeText(e.target.value)}
                  placeholder="Outcome note (e.g., Expedited ultrasound biopsy authorized)"
                  className="w-full text-xs p-2 rounded-md border border-surface-border bg-white focus:outline-none focus:ring-1 focus:ring-teal-brand"
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setActiveReplyId(null)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleSendReply(c.id)}
                    disabled={!replyText.trim()}
                    className="text-xs bg-teal-brand text-white hover:bg-teal-hover"
                  >
                    <Send size={12} className="mr-1" /> Send Opinion
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {consults.length === 0 && (
        <div className="p-8 text-center border border-dashed border-surface-border rounded-card bg-surface-white">
          <MessageSquare size={28} className="mx-auto text-muted/50 mb-2" />
          <p className="text-sm font-semibold text-teal-deep">No Consultations Yet</p>
          <p className="text-xs text-muted mt-1">
            Primary care clinicians can request rapid specialist consultations with attached screening results.
          </p>
        </div>
      )}
    </div>
  );
};
