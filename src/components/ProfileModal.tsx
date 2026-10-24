import * as React from "react";
import { User, Shield, Building, Phone, Mail, Award, CheckCircle2, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { allUsers } from "@/lib/cases";
import type { Role } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const ProfileModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { currentUser, currentRole, setRole, setCurrentUser, cases } = useStore();

  if (!isOpen) return null;

  // Compute workload for current user
  const userCases = cases.filter((c) => c.currentOwner === currentUser.id);
  const openCount = userCases.filter((c) => c.status === "open").length;
  const closedCount = userCases.filter((c) => c.status === "closed").length;
  const overdueCount = userCases.filter((c) => c.sideState === "overdue").length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-deep/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-card border border-surface-border rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-deep to-teal-brand text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-2xl font-bold text-mint-light shadow-sm">
              {currentUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>

            <div className="space-y-0.5">
              <h3 className="text-xl font-bold text-white">{currentUser.name}</h3>
              <p className="text-xs text-mint-wash capitalize font-medium">
                {currentUser.role === "admin"
                  ? "Program Manager / Admin"
                  : currentUser.role === "coordinator"
                  ? "Care Coordinator / Navigator"
                  : currentUser.role === "clinician"
                  ? "Primary Care Clinician"
                  : currentUser.role === "specialist"
                  ? "Specialist / Receiving Clinician"
                  : "Patient User"}
              </p>
              <p className="text-[11px] text-white/70 flex items-center gap-1 mt-1">
                <Building size={12} /> {currentUser.facility}
              </p>
            </div>
          </div>
        </div>

        {/* Details & KPIs */}
        <div className="p-6 space-y-5">
          {/* Workload Snapshot */}
          <div>
            <p className="text-xs font-bold text-teal-deep uppercase tracking-wider mb-2">
              Active Assignment Workload
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-surface-white border border-surface-border text-center">
                <p className="text-xl font-bold text-teal-deep">{openCount}</p>
                <p className="text-[11px] text-muted">Open Cases</p>
              </div>
              <div className="p-3 rounded-xl bg-mint-wash border border-mint-light text-center">
                <p className="text-xl font-bold text-teal-brand">{closedCount}</p>
                <p className="text-[11px] text-teal-deep">Loops Closed</p>
              </div>
              <div className="p-3 rounded-xl bg-coral/10 border border-coral/30 text-center">
                <p className="text-xl font-bold text-coral">{overdueCount}</p>
                <p className="text-[11px] text-coral">Overdue SLAs</p>
              </div>
            </div>
          </div>

          {/* Department & Contact Details */}
          <div className="space-y-2 text-xs">
            <p className="text-xs font-bold text-teal-deep uppercase tracking-wider">
              Department & Access
            </p>
            <div className="p-3 rounded-xl bg-surface-white border border-surface-border space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted">Department:</span>
                <span className="font-semibold text-teal-deep">{currentUser.department || "Clinical Care"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Direct Email:</span>
                <span className="font-semibold text-teal-brand">{currentUser.email || "user@careloop.health"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Direct Phone:</span>
                <span className="font-semibold text-body">{currentUser.phone || "+1 (555) 234-5671"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Security Clearance:</span>
                <span className="font-semibold text-teal-deep">HIPAA / Level 3 RBAC</span>
              </div>
            </div>
          </div>

          {/* Switch Demo Persona */}
          <div>
            <p className="text-xs font-bold text-teal-deep uppercase tracking-wider mb-2">
              Switch Demo User Persona
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
              {allUsers.map((u) => {
                const isSelected = u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      setCurrentUser(u);
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-mint-wash border-teal-brand text-teal-deep font-bold"
                        : "border-surface-border bg-white hover:bg-surface-white text-body"
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{u.name}</p>
                      <p className="text-[10px] text-muted capitalize">{u.role} • {u.facility.split(" ")[0]}</p>
                    </div>
                    {isSelected && <CheckCircle2 size={16} className="text-teal-brand" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface-white border-t border-surface-border flex justify-end">
          <Button size="sm" onClick={onClose} className="bg-teal-brand text-white text-xs font-semibold">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};
