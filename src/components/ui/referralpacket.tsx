import * as React from "react";
import { FileText, CheckCircle2, XCircle, HelpCircle, ArrowRight, ShieldCheck, User } from "lucide-react";
import type { ReferralPacket as ReferralPacketType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const ReferralPacket = ({
  referral,
  onAccept,
  onReject,
  onMoreInfo,
  canDecide = true,
}: {
  referral: ReferralPacketType;
  onAccept: () => void;
  onReject: (reason: string) => void;
  onMoreInfo: (reason: string) => void;
  canDecide?: boolean;
}) => {
  const [rejectMode, setRejectMode] = React.useState(false);
  const [rejectReason, setRejectReason] = React.useState("");
  const [moreInfoMode, setMoreInfoMode] = React.useState(false);
  const [moreInfoReason, setMoreInfoReason] = React.useState("");

  const statusVariant: Record<string, "amber" | "mint" | "coral" | "surface"> = {
    pending: "amber",
    accepted: "mint",
    rejected: "coral",
    "more-info": "amber",
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) return;
    onReject(rejectReason);
    setRejectMode(false);
    setRejectReason("");
  };

  const handleConfirmMoreInfo = () => {
    if (!moreInfoReason.trim()) return;
    onMoreInfo(moreInfoReason);
    setMoreInfoMode(false);
    setMoreInfoReason("");
  };

  return (
    <div className="border border-surface-border rounded-card bg-surface-card overflow-hidden">
      {/* Top Banner */}
      <div className="bg-mint-wash/60 px-5 py-3.5 border-b border-surface-border flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-teal-brand/10 text-teal-brand flex items-center justify-center">
            <FileText size={16} strokeWidth={2.5} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-teal-deep">Referral Hand-Off Packet</h4>
            <p className="text-xs text-muted">Auto-assembled clinical summary for receiving specialist</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted">Status:</span>
          <Badge variant={statusVariant[referral.status] || "amber"} className="capitalize font-semibold text-xs">
            {referral.status === "more-info" ? "More Info Requested" : referral.status}
          </Badge>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Patient & Specialty Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-surface-white rounded-xl border border-surface-border/70 text-xs">
          <div>
            <span className="text-muted font-medium">Patient:</span>
            <p className="font-bold text-teal-deep text-sm">{referral.patientName}</p>
          </div>
          <div>
            <span className="text-muted font-medium">Specialty Requested:</span>
            <p className="font-bold text-teal-brand text-sm">{referral.specialtyRequired}</p>
          </div>
          <div>
            <span className="text-muted font-medium">Urgency:</span>
            <p className="font-bold text-coral capitalize text-sm">{referral.urgency}</p>
          </div>
        </div>

        {/* Structured Packet Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <p className="font-bold text-teal-deep uppercase tracking-wider text-[11px]">Screening Result Summary</p>
            <div className="p-2.5 rounded-lg bg-surface-card border border-surface-border text-body leading-relaxed">
              {referral.resultSummary}
            </div>
          </div>

          <div className="space-y-1">
            <p className="font-bold text-teal-deep uppercase tracking-wider text-[11px]">Reason for Referral</p>
            <div className="p-2.5 rounded-lg bg-surface-card border border-surface-border text-body leading-relaxed">
              {referral.reasonForReferral}
            </div>
          </div>

          <div className="space-y-1">
            <p className="font-bold text-teal-deep uppercase tracking-wider text-[11px]">Clinical History</p>
            <div className="p-2.5 rounded-lg bg-surface-card border border-surface-border text-body leading-relaxed">
              {referral.history}
            </div>
          </div>

          <div className="space-y-1">
            <p className="font-bold text-teal-deep uppercase tracking-wider text-[11px]">What Has Been Done So Far</p>
            <div className="p-2.5 rounded-lg bg-surface-card border border-surface-border text-body leading-relaxed">
              {referral.doneSoFar}
            </div>
          </div>
        </div>

        {/* Decision Feedback Banners */}
        {referral.rejectReason && (
          <div className="p-3 bg-coral/10 border border-coral/30 rounded-xl text-xs space-y-1">
            <p className="font-bold text-coral flex items-center gap-1.5">
              <XCircle size={14} /> Rejection Reason Documented:
            </p>
            <p className="text-body">{referral.rejectReason}</p>
          </div>
        )}

        {referral.moreInfoReason && (
          <div className="p-3 bg-amber/10 border border-amber/30 rounded-xl text-xs space-y-1">
            <p className="font-bold text-[#8C5D00] flex items-center gap-1.5">
              <HelpCircle size={14} /> Additional Information Requested:
            </p>
            <p className="text-body">{referral.moreInfoReason}</p>
          </div>
        )}

        {referral.acceptedBy && (
          <div className="p-3 bg-mint-wash border border-mint-light rounded-xl text-xs flex items-center gap-2 text-teal-deep">
            <CheckCircle2 size={16} className="text-teal-brand" />
            <span>
              Accepted by <strong>{referral.acceptedByName || referral.acceptedBy}</strong> on{" "}
              {referral.acceptedAt ? new Date(referral.acceptedAt).toLocaleDateString() : "recent"}.
            </span>
          </div>
        )}

        {/* Action Controls for Specialist / Receiving Clinician */}
        {canDecide && referral.status === "pending" && !rejectMode && !moreInfoMode && (
          <div className="pt-3 border-t border-surface-border flex flex-wrap gap-2.5">
            <Button
              size="sm"
              onClick={onAccept}
              className="bg-teal-brand text-white hover:bg-teal-hover text-xs font-semibold shadow-xs"
            >
              <CheckCircle2 size={14} className="mr-1.5" /> Accept Referral
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setMoreInfoMode(true)}
              className="border-amber/60 text-[#8C5D00] hover:bg-amber/10 text-xs font-semibold"
            >
              <HelpCircle size={14} className="mr-1.5" /> Request More Info
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setRejectMode(true)}
              className="border-coral/50 text-coral hover:bg-coral/10 text-xs font-semibold"
            >
              <XCircle size={14} className="mr-1.5" /> Reject with Reason
            </Button>
          </div>
        )}

        {/* Reject Dialog inline */}
        {rejectMode && (
          <div className="p-3.5 border border-coral/40 bg-coral/5 rounded-xl space-y-2">
            <p className="text-xs font-bold text-coral">Specify Required Reason for Referral Rejection</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Schedule at capacity; requires specialized pre-authorization; outside clinical scope..."
              rows={2}
              className="w-full text-xs p-2 rounded-md border border-surface-border bg-white focus:outline-none focus:ring-1 focus:ring-coral"
            />
            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="ghost" onClick={() => setRejectMode(false)} className="text-xs">
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmReject}
                disabled={!rejectReason.trim()}
                className="bg-coral text-white hover:bg-coral/90 text-xs font-semibold"
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        )}

        {/* More Info Dialog inline */}
        {moreInfoMode && (
          <div className="p-3.5 border border-amber/40 bg-amber/5 rounded-xl space-y-2">
            <p className="text-xs font-bold text-[#8C5D00]">What additional data or test is required?</p>
            <textarea
              value={moreInfoReason}
              onChange={(e) => setMoreInfoReason(e.target.value)}
              placeholder="e.g. Please provide renal panel labs and ultrasound reports..."
              rows={2}
              className="w-full text-xs p-2 rounded-md border border-surface-border bg-white focus:outline-none focus:ring-1 focus:ring-amber"
            />
            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="ghost" onClick={() => setMoreInfoMode(false)} className="text-xs">
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmMoreInfo}
                disabled={!moreInfoReason.trim()}
                className="bg-amber text-teal-deep hover:bg-amber/90 text-xs font-semibold"
              >
                Submit Info Request
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
