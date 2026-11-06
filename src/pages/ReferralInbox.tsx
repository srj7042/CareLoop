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
import { GlassCard, StatusPill, IconButton } from "@/components/design-system";
import { useStore } from "@/lib/store";
import type { ReferralPacket as ReferralPacketType } from "@/types";

export const ReferralInbox = () => {
  const navigate = useNavigate();
  const { getCasesForCurrentUser, currentUser, updateReferral } = useStore();
  const cases = getCasesForCurrentUser();

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
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-[#1E2532]">Specialist Referral Inbox</h1>
            <StatusPill variant="lavender" label={`${pendingCount} Pending Review`} size="sm" pulse />
          </div>
          <p className="text-xs text-[#798393] mt-1">
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
      <GlassCard className="p-4 rounded-[24px]">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#798393]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient name, case ID, or specialty..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-white/80 bg-white/70 text-[#1E2532] placeholder-[#798393] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 shadow-2xs"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="text-xs px-3.5 py-2 rounded-xl border border-white/80 bg-white/70 text-[#1E2532] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 shadow-2xs"
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
              className="text-xs text-[#798393] hover:text-[#1E2532] rounded-xl"
            >
              Reset
            </Button>
          )}
        </div>
      </GlassCard>

      {/* Table */}
      <GlassCard className="p-0 rounded-[26px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white/40 border-b border-white/80 text-[#798393] font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-5">Case &amp; Facility</th>
                <th className="py-3.5 px-5">Patient Profile</th>
                <th className="py-3.5 px-5">Screening &amp; Specialty</th>
                <th className="py-3.5 px-5">Urgency</th>
                <th className="py-3.5 px-5">Referral Reason</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Triage Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60">
              {filtered.map((c) => {
                const r = c.referral!;
                const isPending = r.status === "pending";

                return (
                  <tr
                    key={c.id}
                    className="hover:bg-white/60 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/case/${c.id}`)}
                  >
                    <td className="py-4 px-5 font-medium">
                      <span className="font-bold text-[#1E2532] group-hover:text-[#8B5CF6] transition-colors">
                        {c.id}
                      </span>
                      <p className="text-[11px] text-[#798393] truncate max-w-[130px] mt-0.5">{c.facility}</p>
                    </td>

                    <td className="py-4 px-5">
                      <p className="font-bold text-[#1E2532]">{c.patientName}</p>
                      <p className="text-[11px] text-[#798393] mt-0.5">
                        {c.patientAge}y • {c.patientLanguage.toUpperCase()}
                      </p>
                    </td>

                    <td className="py-4 px-5">
                      <p className="font-semibold text-[#1E2532]">{c.screeningType}</p>
                      <span className="inline-block text-[10px] mt-1 font-semibold text-[#8B5CF6] bg-[#8B5CF6]/10 px-2 py-0.5 rounded-full border border-[#8B5CF6]/20">
                        {r.specialtyRequired}
                      </span>
                    </td>

                    <td className="py-4 px-5">
                      <StatusChip urgency={r.urgency || c.urgency} />
                    </td>

                    <td className="py-4 px-5 max-w-[200px]">
                      <p className="text-[#1E2532] text-[11px] line-clamp-2 leading-relaxed">
                        {r.reasonForReferral}
                      </p>
                      {r.rejectReason && (
                        <p className="text-[10px] text-[#EF4444] font-medium mt-0.5 truncate">
                          Reason: {r.rejectReason}
                        </p>
                      )}
                    </td>

                    <td className="py-4 px-5">
                      <StatusPill
                        variant={
                          r.status === "accepted"
                            ? "mint"
                            : r.status === "rejected"
                            ? "coral"
                            : "amber"
                        }
                        label={r.status === "more-info" ? "More Info" : r.status}
                        size="sm"
                      />
                    </td>

                    <td
                      className="py-4 px-5 text-right"
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
                                  acceptedBy: currentUser?.id || "usr_spec_maya",
                                  acceptedByName: currentUser?.name || "Dr. Maya Lin, MD, FACS",
                                  acceptedAt: new Date().toISOString(),
                                })
                              }
                              className="bg-[#10B981] hover:bg-[#059669] text-white text-[11px] h-7 px-3 font-bold rounded-lg shadow-xs"
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
                              className="text-[11px] h-7 px-2.5 bg-white/80 border-white/90 text-amber-800 hover:bg-white rounded-lg"
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
                              className="text-[11px] h-7 px-2.5 bg-white/80 border-white/90 text-rose-700 hover:bg-white rounded-lg"
                            >
                              Reject
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/case/${c.id}`)}
                            className="text-xs text-[#8B5CF6] hover:bg-[#8B5CF6]/10 font-semibold rounded-lg"
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
                  <td colSpan={7} className="py-12 text-center text-[#798393]">
                    No specialist referrals found matching the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Reject / More Info Modal Dialog */}
      {activeActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-xl border border-white/80 rounded-[28px] shadow-[0_24px_48px_rgba(100,115,140,0.15)] w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-[#1E2532]">
              {activeActionModal.type === "reject"
                ? "Document Referral Rejection Reason"
                : "Request Additional Clinical Information"}
            </h3>

            <p className="text-xs text-[#798393]">
              Patient: <strong className="text-[#1E2532]">{activeActionModal.patientName}</strong> • {activeActionModal.caseId}
            </p>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-[#1E2532]">
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
                className="w-full text-xs p-3 rounded-xl border border-white/80 bg-white text-[#1E2532] placeholder-[#798393] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 shadow-2xs"
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
                className="text-xs rounded-xl text-[#798393]"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmModalAction}
                disabled={!modalInputReason.trim()}
                className={`text-xs font-bold text-white rounded-xl shadow-xs ${
                  activeActionModal.type === "reject"
                    ? "bg-[#EF4444] hover:bg-rose-600"
                    : "bg-[#10B981] hover:bg-[#059669]"
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