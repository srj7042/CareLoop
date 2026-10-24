import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  SendHorizontal,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Filter,
  FileText,
  User,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusChip, SLATimer } from "@/components/ui/chips";
import { KPICard } from "@/components/ui/kpicard";
import { useStore } from "@/lib/store";
import type { ReferralPacket as ReferralPacketType } from "@/types";

export const ReferralInbox = () => {
  const navigate = useNavigate();
  const { cases, currentUser, updateReferral } = useStore();

  const [search, setSearch] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<"all" | "pending" | "accepted" | "rejected" | "more-info">("all");
  const [activeActionModal, setActiveActionModal] = React.useState<{
    caseId: string;
    type: "reject" | "more-info";
    patientName: string;
  } | null>(null);
  const [modalInputReason, setModalInputReason] = React.useState("");

  // Cases with an existing referral packet
  const referralCases = cases.filter((c) => c.referral);

  const pendingCount = referralCases.filter((c) => c.referral?.status === "pending").length;
  const acceptedCount = referralCases.filter((c) => c.referral?.status === "accepted").length;
  const rejectedCount = referralCases.filter((c) => c.referral?.status === "rejected").length;

  const filtered = referralCases
    .filter((c) => {
      const r = c.referral!;
      if (filterStatus !== "all" && r.status !== filterStatus) return false;
      if (search) {
        const q = search.toLowerCase();
        const matchesName = c.patientName.toLowerCase().includes(q);
        const matchesId = c.id.toLowerCase().includes(q);
        const matchesSpec = r.specialtyRequired?.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesSpec) return false;
      }
      return true;
    })
    .sort((a, b) => {
      // Pending first
      const aPending = a.referral?.status === "pending" ? 0 : 1;
      const bPending = b.referral?.status === "pending" ? 0 : 1;
      if (aPending !== bPending) return aPending - bPending;
      return new Date(a.nextActionDue).getTime() - new Date(b.nextActionDue).getTime();
    });

  const handleConfirmModalAction = () => {
    if (!activeActionModal || !modalInputReason.trim()) return;
    const { caseId, type } = activeActionModal;
    const c = cases.find((x) => x.id === caseId);
    if (!c || !c.referral) return;

    if (type === "reject") {
      updateReferral(caseId, {
        status: "rejected",
        rejectReason: modalInputReason,
      });
    } else {
      updateReferral(caseId, {
        status: "more-info",
        moreInfoReason: modalInputReason,
      });
    }

    setActiveActionModal(null);
    setModalInputReason("");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-teal-deep">Specialist Referral Inbox</h1>
            <Badge variant="mint" className="text-xs font-semibold">
              {pendingCount} Pending Review
            </Badge>
          </div>
          <p className="text-xs text-muted mt-1">
            Receiving clinician referral triage. Auto-assembled clinical hand-off summaries ensure closed-loop conversion.
          </p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          title="Pending Referrals"
          value={pendingCount}
          subtitle="Awaiting specialist review"
          icon={Clock}
          variant="amber"
          onClick={() => setFilterStatus("pending")}
        />
        <KPICard
          title="Accepted (Converted)"
          value={acceptedCount}
          subtitle="Booked into specialist care"
          icon={CheckCircle2}
          variant="mint"
          onClick={() => setFilterStatus("accepted")}
        />
        <KPICard
          title="Rejected with Reason"
          value={rejectedCount}
          subtitle="Re-routed with documented cause"
          icon={XCircle}
          variant="coral"
          onClick={() => setFilterStatus("rejected")}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-surface-card border border-surface-border rounded-xl space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient name, case ID, or specialty..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-surface-border bg-surface-white focus:outline-none focus:ring-1 focus:ring-teal-brand"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="text-xs px-3 py-2 rounded-lg border border-surface-border bg-surface-white text-body focus:outline-none focus:ring-1 focus:ring-teal-brand"
          >
            <option value="all">All Referral Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="more-info">More Info Requested</option>
          </select>

          {(filterStatus !== "all" || search) && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setSearch("");
                setFilterStatus("all");
              }}
              className="text-xs text-muted hover:text-teal-deep"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border border-surface-border rounded-xl bg-surface-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-white/80 border-b border-surface-border text-muted font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Case & Facility</th>
                <th className="py-3 px-4">Patient Profile</th>
                <th className="py-3 px-4">Screening & Specialty</th>
                <th className="py-3 px-4">Urgency</th>
                <th className="py-3 px-4">Referral Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Triage Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filtered.map((c) => {
                const r = c.referral!;
                const isPending = r.status === "pending";

                return (
                  <tr
                    key={c.id}
                    className="hover:bg-mint-wash/30 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/case/${c.id}`)}
                  >
                    <td className="py-3.5 px-4 font-medium">
                      <span className="font-bold text-teal-deep group-hover:text-teal-brand">
                        {c.id}
                      </span>
                      <p className="text-[11px] text-muted truncate max-w-[130px]">{c.facility}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-teal-deep">{c.patientName}</p>
                      <p className="text-[11px] text-muted">
                        {c.patientAge}y • {c.patientLanguage.toUpperCase()}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-body">{c.screeningType}</p>
                      <Badge variant="mint" className="text-[10px] mt-0.5 font-medium">
                        {r.specialtyRequired}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusChip urgency={r.urgency || c.urgency} />
                    </td>

                    <td className="py-3.5 px-4 max-w-[200px]">
                      <p className="text-body text-[11px] line-clamp-2 leading-relaxed">
                        {r.reasonForReferral}
                      </p>
                      {r.rejectReason && (
                        <p className="text-[10px] text-coral font-medium mt-0.5 truncate">
                          Reason: {r.rejectReason}
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          r.status === "accepted"
                            ? "mint"
                            : r.status === "rejected"
                            ? "coral"
                            : "amber"
                        }
                        className="text-[11px] capitalize"
                      >
                        {r.status === "more-info" ? "More Info" : r.status}
                      </Badge>
                    </td>

                    <td
                      className="py-3.5 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        {isPending ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() =>
                                updateReferral(c.id, {
                                  status: "accepted",
                                  acceptedBy: currentUser.id,
                                  acceptedByName: currentUser.name,
                                  acceptedAt: new Date().toISOString(),
                                })
                              }
                              className="bg-teal-brand text-white hover:bg-teal-hover text-[11px] h-7 px-2.5 font-bold shadow-2xs"
                            >
                              <CheckCircle2 size={12} className="mr-1" /> Accept
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setActiveActionModal({
                                  caseId: c.id,
                                  type: "more-info",
                                  patientName: c.patientName,
                                })
                              }
                              className="text-[11px] h-7 px-2 border-amber/50 text-[#8C5D00] hover:bg-amber/10"
                            >
                              More Info
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setActiveActionModal({
                                  caseId: c.id,
                                  type: "reject",
                                  patientName: c.patientName,
                                })
                              }
                              className="text-[11px] h-7 px-2 border-coral/50 text-coral hover:bg-coral/10"
                            >
                              Reject
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/case/${c.id}`)}
                            className="text-xs text-teal-brand font-semibold"
                          >
                            View Case <ArrowRight size={12} className="ml-1" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted">
                    No specialist referrals found matching the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject / More Info Modal Dialog */}
      {activeActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-deep/50 backdrop-blur-2xs">
          <div className="bg-surface-card border border-surface-border rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-teal-deep">
              {activeActionModal.type === "reject"
                ? "Document Referral Rejection Reason"
                : "Request Additional Clinical Information"}
            </h3>

            <p className="text-xs text-muted">
              Patient: <strong>{activeActionModal.patientName}</strong> • {activeActionModal.caseId}
            </p>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-teal-deep">
                {activeActionModal.type === "reject"
                  ? "Mandatory Rejection Justification (e.g., Pre-authorization required, Clinic capacity)"
                  : "Specify What Documentation / Lab is Needed"}
              </label>
              <textarea
                value={modalInputReason}
                onChange={(e) => setModalInputReason(e.target.value)}
                placeholder={
                  activeActionModal.type === "reject"
                    ? "Enter required rejection reason..."
                    : "e.g. Please supply latest renal panel and ultrasound scan..."
                }
                rows={3}
                className="w-full text-xs p-2.5 rounded-lg border border-surface-border bg-white focus:outline-none focus:ring-1 focus:ring-teal-brand"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setActiveActionModal(null);
                  setModalInputReason("");
                }}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmModalAction}
                disabled={!modalInputReason.trim()}
                className={`text-xs font-bold text-white ${
                  activeActionModal.type === "reject"
                    ? "bg-coral hover:bg-coral/90"
                    : "bg-teal-brand hover:bg-teal-hover"
                }`}
              >
                Confirm {activeActionModal.type === "reject" ? "Rejection" : "Request"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
