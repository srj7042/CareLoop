import * as React from "react";
import { CheckCircle2, FileText, Plus, ShieldCheck, AlertCircle } from "lucide-react";
import type { ClosureEvidence, User } from "@/types";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";

export const ClosureChecklist = ({
  evidence,
  onAddEvidence,
  onCloseCase,
  currentUser,
  isClosed,
}: {
  evidence: ClosureEvidence[];
  onAddEvidence: (e: ClosureEvidence) => void;
  onCloseCase: (reason: string) => void;
  currentUser: User;
  isClosed: boolean;
}) => {
  const [evidenceType, setEvidenceType] = React.useState<ClosureEvidence["type"]>("appointment-attended");
  const [description, setDescription] = React.useState("");
  const [note, setNote] = React.useState("");
  const [closureReason, setClosureReason] = React.useState("");
  const [showAddForm, setShowAddForm] = React.useState(false);

  const evidenceTypes: { type: ClosureEvidence["type"]; label: string; placeholder: string }[] = [
    {
      type: "appointment-attended",
      label: "Appointment Attended Note",
      placeholder: "e.g. Attended in-person consultation with Dr. Fatima; diagnosis reviewed.",
    },
    {
      type: "treatment-started",
      label: "Treatment Started Record",
      placeholder: "e.g. Initiated Amlodipine 5mg daily; pharmacy adherence verified.",
    },
    {
      type: "surveillance-plan",
      label: "Surveillance / Monitoring Plan",
      placeholder: "e.g. 6-month interval repeat bilateral mammogram scheduled for April 2027.",
    },
    {
      type: "clinician-reasoned",
      label: "Clinician-Reasoned Decision",
      placeholder: "e.g. Patient declined invasive biopsy after detailed risk/benefit counseling.",
    },
  ];

  const handleAdd = () => {
    if (!description.trim()) return;
    onAddEvidence({
      type: evidenceType,
      description,
      note: note || undefined,
      attachedBy: currentUser.id,
      attachedByName: currentUser.name,
      attachedAt: new Date().toISOString(),
    });
    setDescription("");
    setNote("");
    setShowAddForm(false);
  };

  const handleAuthorizeClosure = () => {
    if (!closureReason.trim()) return;
    onCloseCase(closureReason);
  };

  return (
    <div className="space-y-4">
      {/* Evidence List */}
      <div className="space-y-2.5">
        {evidence.map((item, idx) => (
          <div
            key={idx}
            className="p-3 bg-mint-wash/60 border border-mint-light/50 rounded-xl flex items-start gap-3 text-xs"
          >
            <div className="w-7 h-7 rounded-full bg-teal-brand/10 text-teal-brand flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileText size={15} />
            </div>
            <div className="flex-1 space-y-0.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-teal-deep capitalize">
                  {item.type.replace("-", " ")}
                </span>
                <span className="text-[11px] text-muted">
                  {formatDateTime(item.attachedAt)}
                </span>
              </div>
              <p className="text-body text-sm font-medium">{item.description}</p>
              {item.note && (
                <p className="text-muted text-xs italic">Note: {item.note}</p>
              )}
              <p className="text-[11px] text-teal-brand font-semibold pt-0.5">
                Verified by {item.attachedByName || item.attachedBy}
              </p>
            </div>
          </div>
        ))}

        {evidence.length === 0 && (
          <div className="p-6 text-center border border-dashed border-surface-border rounded-xl bg-surface-white">
            <AlertCircle size={22} className="mx-auto text-muted/60 mb-1.5" />
            <p className="text-xs font-semibold text-teal-deep">No Closure Evidence Attached Yet</p>
            <p className="text-[11px] text-muted max-w-sm mx-auto mt-0.5">
              Closing a case requires documented proof (attended appointment note, treatment record, surveillance plan, or clinician-reasoned decision).
            </p>
          </div>
        )}
      </div>

      {/* Add Evidence Form */}
      {!isClosed && !showAddForm && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowAddForm(true)}
          className="text-xs border-teal-brand/40 text-teal-brand hover:bg-teal-brand/5"
        >
          <Plus size={14} className="mr-1" /> Add Required Closure Evidence
        </Button>
      )}

      {showAddForm && !isClosed && (
        <div className="p-4 border border-teal-brand/30 bg-mint-wash/30 rounded-xl space-y-3">
          <p className="text-xs font-bold text-teal-deep">Document Closure Evidence</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {evidenceTypes.map((t) => (
              <label
                key={t.type}
                className={`p-2.5 rounded-lg border cursor-pointer flex items-center gap-2 ${
                  evidenceType === t.type
                    ? "bg-white border-teal-brand text-teal-deep font-bold shadow-xs"
                    : "border-surface-border bg-surface-white/60 text-muted"
                }`}
              >
                <input
                  type="radio"
                  name="evidenceType"
                  value={t.type}
                  checked={evidenceType === t.type}
                  onChange={() => setEvidenceType(t.type)}
                  className="text-teal-brand focus:ring-teal-brand"
                />
                <span>{t.label}</span>
              </label>
            ))}
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={evidenceTypes.find((t) => t.type === evidenceType)?.placeholder}
            rows={2}
            className="w-full text-xs p-2.5 rounded-md border border-surface-border bg-white focus:outline-none focus:ring-1 focus:ring-teal-brand"
          />

          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional internal clinician note / document reference ID..."
            className="w-full text-xs p-2 rounded-md border border-surface-border bg-white focus:outline-none focus:ring-1 focus:ring-teal-brand"
          />

          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="ghost" onClick={() => setShowAddForm(false)} className="text-xs">
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={!description.trim()}
              className="bg-teal-brand text-white hover:bg-teal-hover text-xs font-semibold"
            >
              Attach Evidence
            </Button>
          </div>
        </div>
      )}

      {/* Authorized Human Sign-Off to Close Loop */}
      {!isClosed && (
        <div className="pt-4 border-t border-surface-border space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-teal-brand" />
            <span className="text-xs font-bold text-teal-deep">Human-Governed Closure Authorization</span>
          </div>
          <p className="text-[11px] text-muted">
            Clinical authority sign-off: Confirm that the screening finding has been fully addressed and verified.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={closureReason}
              onChange={(e) => setClosureReason(e.target.value)}
              placeholder="Mandatory closure reason (e.g., Benign biopsy with 6-month surveillance plan)..."
              className="flex-1 text-xs px-3 py-2 rounded-md border border-surface-border bg-white focus:outline-none focus:ring-1 focus:ring-teal-brand"
            />
            <Button
              size="sm"
              onClick={handleAuthorizeClosure}
              disabled={!closureReason.trim() || evidence.length === 0}
              className="bg-teal-deep text-white hover:bg-teal-brand text-xs font-bold whitespace-nowrap"
            >
              <CheckCircle2 size={14} className="mr-1.5" /> Close Loop Officially
            </Button>
          </div>
          {evidence.length === 0 && (
            <p className="text-[11px] text-coral font-medium">
              * Must attach at least one piece of verified closure evidence before closing.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
