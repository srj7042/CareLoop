import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Case,
  Role,
  User,
  Urgency,
  StepKey,
  ClosureEvidence,
  ReferralPacket,
  Channel,
} from "../types";
import {
  seedCases,
  transitionCase,
  findUserById,
  findOwnerDetails,
  allUsers,
  type TransitionInput,
} from "./cases";
import { getActiveSession, terminateSession, updateActiveSessionUser } from "./auth";
import { addDays, addHours } from "./utils";

const nowIso = () => new Date().toISOString();

export type AppState = {
  cases: Case[];
  currentUser: User | null;
  currentRole: Role | null;
  isAuthenticated: boolean;
  selectedCaseId: string | null;

  // authentication actions
  login: (user: User) => void;
  logout: () => void;
  setCurrentUser: (user: User) => void;
  updateCurrentUserProfile: (updates: Partial<User>) => void;
  selectCase: (id: string | null) => void;

  // queries with role & tenant isolation
  getCase: (id: string) => Case | undefined;
  getCasesForCurrentUser: () => Case[];
  getOpenCases: () => Case[];
  getClosedCases: () => Case[];

  // case lifecycle transitions
  transitionTo: (
    caseId: string,
    toStep: StepKey,
    reason: string,
    note?: string,
    evidence?: ClosureEvidence[]
  ) => boolean;

  reassign: (caseId: string, newOwnerId: string, reason: string) => boolean;
  nudge: (caseId: string, reason: string) => boolean;
  escalate: (caseId: string, reason: string) => boolean;
  closeWithEvidence: (
    caseId: string,
    evidence: ClosureEvidence[],
    reason: string
  ) => boolean;

  // patient engagement
  setPatientPulse: (caseId: string, understanding: number, confidence: number) => boolean;
  requestCallback: (caseId: string, note?: string) => boolean;
  patientAcknowledge: (caseId: string, responseType: "yes" | "questions" | "call") => boolean;

  // clinical consultations & referrals
  addConsult: (
    caseId: string,
    consult: {
      to: string;
      question: string;
      urgency: Urgency;
      attachedResults: string[];
    }
  ) => boolean;
  respondConsult: (
    caseId: string,
    consultId: string,
    response: string,
    outcomeNote: string
  ) => boolean;
  updateReferral: (caseId: string, referral: Partial<ReferralPacket>) => boolean;

  // channel notification tracking
  addNotification: (
    caseId: string,
    notif: { channel: Channel; to: string; message: string; status?: "sent" | "delivered" | "read" | "acknowledged" }
  ) => boolean;
};

// Check for existing active session on boot
const existingSession = getActiveSession();

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      cases: [...seedCases],
      currentUser: existingSession ? existingSession.user : null,
      currentRole: existingSession ? existingSession.user.role : null,
      isAuthenticated: !!existingSession,
      selectedCaseId: "CASE-001",

      login: (user: User) => {
        set({
          isAuthenticated: true,
          currentUser: user,
          currentRole: user.role,
        });
      },

      logout: () => {
        terminateSession();
        set({
          isAuthenticated: false,
          currentUser: null,
          currentRole: null,
          selectedCaseId: null,
        });
      },

      setCurrentUser: (user: User) => {
        set({ currentUser: user, currentRole: user.role, isAuthenticated: true });
      },

      updateCurrentUserProfile: (updates: Partial<User>) => {
        const { currentUser, cases } = get();
        if (!currentUser) return;

        const updatedUser: User = {
          ...currentUser,
          ...updates,
        };

        // Update active session in sessionStorage so it persists across reloads
        updateActiveSessionUser(updatedUser);

        // If user's name changed, update currentOwnerName on cases owned by this user
        const updatedCases =
          updates.name && updates.name !== currentUser.name
            ? cases.map((c) =>
                c.currentOwner === currentUser.id
                  ? { ...c, currentOwnerName: updates.name! }
                  : c
              )
            : cases;

        set({
          currentUser: updatedUser,
          cases: updatedCases,
        });
      },

      selectCase: (id: string | null) => set({ selectedCaseId: id }),

      getCase: (id: string) => {
        const allowedCases = get().getCasesForCurrentUser();
        return allowedCases.find((c) => c.id === id);
      },

      getCasesForCurrentUser: () => {
        const { cases, currentUser, isAuthenticated } = get();
        if (!isAuthenticated || !currentUser) {
          return [];
        }

        // Master Administrator can oversee all multi-tenant organizations
        if (currentUser.role === "master_admin") {
          return cases;
        }

        // Patient accounts can ONLY see their own personal clinical record(s)
        if (currentUser.role === "patient") {
          return cases.filter(
            (c) =>
              c.patientId === currentUser.id ||
              c.patientName.toLowerCase() === currentUser.name.toLowerCase()
          );
        }

        // Organization-level isolation: Staff only access their organization's records
        const orgCases = cases.filter(
          (c) => c.organizationId === currentUser.organizationId
        );

        // HOD filter can focus on department while having organization access
        if (currentUser.role === "hod" && currentUser.department) {
          return orgCases.filter(
            (c) => c.department === currentUser.department
          );
        }

        return orgCases;
      },

      getOpenCases: () => {
        return get().getCasesForCurrentUser().filter((c) => c.status === "open");
      },

      getClosedCases: () => {
        return get().getCasesForCurrentUser().filter((c) => c.status === "closed");
      },

      transitionTo: (caseId, toStep, reason, note, evidence) => {
        const { cases, currentUser } = get();
        if (!currentUser) return false;
        const c = cases.find((x) => x.id === caseId);
        if (!c) return false;

        const updated = transitionCase(
          c,
          {
            caseId,
            toStep,
            ownerId: currentUser.id,
            ownerName: currentUser.name,
            ownerRole: currentUser.role,
            reason,
            note,
            evidence,
          },
          nowIso()
        );

        set({
          cases: cases.map((x) => (x.id === caseId ? updated : x)),
        });
        return true;
      },

      reassign: (caseId, newOwnerId, reason) => {
        const { cases, currentUser } = get();
        if (!currentUser) return false;
        const c = cases.find((x) => x.id === caseId);
        if (!c) return false;

        const ownerDetails = findOwnerDetails(newOwnerId);
        const updated: Case = {
          ...c,
          currentOwner: newOwnerId,
          currentOwnerName: ownerDetails.name,
          currentOwnerRole: ownerDetails.role,
          isQueueOwner: ownerDetails.isQueue,
          sideState: c.sideState === "unassigned" ? null : c.sideState,
          nextAction: `Reassigned to ${ownerDetails.name}. Priority review underway.`,
          nextActionDue: addDays(nowIso(), 1),
          audit: [
            ...c.audit,
            {
              id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              caseId,
              action: `Ownership Reassigned to ${ownerDetails.name}`,
              owner: currentUser.name,
              ownerRole: currentUser.role,
              reason,
              timestamp: nowIso(),
            },
          ],
        };

        set({ cases: cases.map((x) => (x.id === caseId ? updated : x)) });
        return true;
      },

      nudge: (caseId, reason) => {
        const { cases, currentUser } = get();
        if (!currentUser) return false;
        const c = cases.find((x) => x.id === caseId);
        if (!c) return false;

        const updated: Case = {
          ...c,
          audit: [
            ...c.audit,
            {
              id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              caseId,
              action: `SLA Nudge Dispatched to ${c.currentOwnerName}`,
              owner: currentUser.name,
              ownerRole: currentUser.role,
              reason,
              timestamp: nowIso(),
            },
          ],
        };

        set({ cases: cases.map((x) => (x.id === caseId ? updated : x)) });
        return true;
      },

      escalate: (caseId, reason) => {
        const { cases, currentUser } = get();
        if (!currentUser) return false;
        const c = cases.find((x) => x.id === caseId);
        if (!c) return false;

        const coordinator = allUsers.find(
          (u) => u.role === "coordinator" && u.organizationId === c.organizationId
        ) || currentUser;

        const updated: Case = {
          ...c,
          sideState: "escalated",
          currentOwner: coordinator.id,
          currentOwnerName: coordinator.name,
          currentOwnerRole: coordinator.role,
          isQueueOwner: false,
          nextAction: "Escalated for immediate clinical coordination & outreach",
          nextActionDue: addHours(nowIso(), 4),
          audit: [
            ...c.audit,
            {
              id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              caseId,
              action: `Escalated to ${coordinator.name}`,
              owner: currentUser.name,
              ownerRole: currentUser.role,
              reason,
              timestamp: nowIso(),
            },
          ],
        };

        set({ cases: cases.map((x) => (x.id === caseId ? updated : x)) });
        return true;
      },

      closeWithEvidence: (caseId, evidence, reason) => {
        const { cases, currentUser } = get();
        if (!currentUser) return false;
        const c = cases.find((x) => x.id === caseId);
        if (!c) return false;

        const updated = transitionCase(
          c,
          {
            caseId,
            toStep: "closed",
            ownerId: currentUser.id,
            ownerName: currentUser.name,
            ownerRole: currentUser.role,
            reason,
            note: "Verified loop closure evidence attached with human clinician authorization.",
            evidence,
          },
          nowIso()
        );

        set({ cases: cases.map((x) => (x.id === caseId ? updated : x)) });
        return true;
      },

      setPatientPulse: (caseId, understanding, confidence) => {
        const { cases, currentUser } = get();
        const c = cases.find((x) => x.id === caseId);
        if (!c) return false;

        const updated: Case = {
          ...c,
          understandingScore: understanding,
          confidenceScore: confidence,
          audit: [
            ...c.audit,
            {
              id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              caseId,
              action: `Patient Pulse Survey Recorded (Understanding: ${understanding}/5, Confidence: ${confidence}/5)`,
              owner: currentUser?.name || c.patientName,
              ownerRole: "patient",
              reason: "Patient digital feedback completed via secure portal.",
              timestamp: nowIso(),
            },
          ],
        };

        set({ cases: cases.map((x) => (x.id === caseId ? updated : x)) });
        return true;
      },

      requestCallback: (caseId, note) => {
        const { cases, currentUser } = get();
        const c = cases.find((x) => x.id === caseId);
        if (!c) return false;

        const updated: Case = {
          ...c,
          patientCallbackRequested: true,
          patientCallbackTime: nowIso(),
          patientQuestionNote: note,
          sideState: c.sideState === "unassigned" ? "unassigned" : "escalated",
          nextAction: `Patient requested callback: ${note || "Assistance needed with understanding next steps"}`,
          nextActionDue: addHours(nowIso(), 2),
          audit: [
            ...c.audit,
            {
              id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              caseId,
              action: "Patient Requested Care Coordinator Callback",
              owner: currentUser?.name || c.patientName,
              ownerRole: "patient",
              reason: note || "Immediate 2-hour callback request submitted via patient portal.",
              timestamp: nowIso(),
            },
          ],
        };

        set({ cases: cases.map((x) => (x.id === caseId ? updated : x)) });
        return true;
      },

      patientAcknowledge: (caseId, responseType) => {
        const { cases, currentUser, transitionTo, requestCallback } = get();
        const c = cases.find((x) => x.id === caseId);
        if (!c) return false;

        const ackStep = c.steps.find((s) => s.key === "acknowledged");
        if (!ackStep) return false;

        let note = "Patient accessed secure portal and confirmed understanding of result.";
        if (responseType === "questions") {
          note = "Patient confirmed review of result but flagged questions for care coordinator.";
        } else if (responseType === "call") {
          note = "Patient confirmed review and requested prompt telephone outreach.";
          requestCallback(caseId, "Patient requested phone discussion during result acknowledgement.");
        }

        const success = transitionTo(
          caseId,
          "acknowledged",
          "Patient 1-tap confirmation submitted via portal",
          note
        );

        if (success) {
          const freshCase = get().cases.find((x) => x.id === caseId);
          if (freshCase) {
            const updatedNotif = freshCase.notifications.map((n) =>
              n.status !== "acknowledged" ? { ...n, status: "acknowledged" as const, acknowledgedAt: nowIso() } : n
            );
            set({
              cases: get().cases.map((x) => (x.id === caseId ? { ...freshCase, notifications: updatedNotif } : x)),
            });
          }
        }

        return success;
      },

      addConsult: (caseId, consult) => {
        const { cases, currentUser } = get();
        if (!currentUser) return false;
        const c = cases.find((x) => x.id === caseId);
        if (!c) return false;

        const targetUser = findUserById(consult.to);
        const newConsult = {
          id: `cns-${Date.now()}`,
          caseId,
          from: currentUser.id,
          fromName: currentUser.name,
          fromRole: currentUser.role,
          to: consult.to,
          toName: targetUser?.name || "Consultant Specialist",
          toRole: targetUser?.role || "specialist",
          question: consult.question,
          urgency: consult.urgency,
          attachedResults: consult.attachedResults,
          createdAt: nowIso(),
        };

        const updated: Case = {
          ...c,
          consults: [...c.consults, newConsult],
          audit: [
            ...c.audit,
            {
              id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              caseId,
              action: `Clinical Consult Requested to ${targetUser?.name || "Specialist"}`,
              owner: currentUser.name,
              ownerRole: currentUser.role,
              reason: consult.question,
              timestamp: nowIso(),
            },
          ],
        };

        set({ cases: cases.map((x) => (x.id === caseId ? updated : x)) });
        return true;
      },

      respondConsult: (caseId, consultId, response, outcomeNote) => {
        const { cases, currentUser } = get();
        if (!currentUser) return false;
        const c = cases.find((x) => x.id === caseId);
        if (!c) return false;

        const updatedConsults = c.consults.map((cns) => {
          if (cns.id === consultId) {
            return {
              ...cns,
              response,
              outcomeNote,
              respondedAt: nowIso(),
            };
          }
          return cns;
        });

        const updated: Case = {
          ...c,
          consults: updatedConsults,
          audit: [
            ...c.audit,
            {
              id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              caseId,
              action: `Specialist Consult Response Recorded by ${currentUser.name}`,
              owner: currentUser.name,
              ownerRole: currentUser.role,
              reason: outcomeNote || response,
              timestamp: nowIso(),
            },
          ],
        };

        set({ cases: cases.map((x) => (x.id === caseId ? updated : x)) });
        return true;
      },

      updateReferral: (caseId, refUpdate) => {
        const { cases, currentUser } = get();
        if (!currentUser) return false;
        const c = cases.find((x) => x.id === caseId);
        if (!c) return false;

        const existingRef = c.referral || {
          caseId,
          patientId: c.patientId,
          patientName: c.patientName,
          resultSummary: c.resultValue,
          history: `${c.patientAge}yo ${c.patientGender}`,
          doneSoFar: "Screening completed",
          reasonForReferral: `Specialty referral for ${c.screeningType}`,
          urgency: c.urgency,
          specialtyRequired: "Specialty Clinic",
          status: "pending" as const,
        };

        const merged: ReferralPacket = {
          ...existingRef,
          ...refUpdate,
        };

        const updated: Case = {
          ...c,
          referral: merged,
        };

        if (refUpdate.status === "accepted") {
          updated.sideState = null;
          const targetStep = updated.steps.find((s) => s.key === "accepted");
          if (targetStep) {
            targetStep.status = "completed";
            targetStep.owner = currentUser.name;
            targetStep.ownerRole = currentUser.role;
            targetStep.timestamp = nowIso();
          }
          const bookedStep = updated.steps.find((s) => s.key === "booked");
          if (bookedStep && bookedStep.status === "not-started") {
            bookedStep.status = "in-progress";
            bookedStep.dueAt = addDays(nowIso(), 7);
            updated.nextAction = "Schedule specialist clinic appointment within 7 days";
            updated.nextActionDue = bookedStep.dueAt;
          }
        } else if (refUpdate.status === "rejected") {
          updated.sideState = "rejected";
          updated.nextAction = `Referral rejected: ${refUpdate.rejectReason || "Alternative provider required"}`;
        }

        updated.audit.push({
          id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          caseId,
          action: `Referral status updated to: ${merged.status}`,
          owner: currentUser.name,
          ownerRole: currentUser.role,
          reason: merged.status === "rejected" ? (merged.rejectReason || "Rejected") : "Specialist referral workflow update",
          timestamp: nowIso(),
        });

        set({ cases: cases.map((x) => (x.id === caseId ? updated : x)) });
        return true;
      },

      addNotification: (caseId, notif) => {
        const { cases } = get();
        const c = cases.find((x) => x.id === caseId);
        if (!c) return false;

        const timestamp = nowIso();
        const newNotif = {
          id: `notif-${Date.now()}`,
          channel: notif.channel,
          to: notif.to,
          message: notif.message,
          status: notif.status || "delivered",
          sentAt: timestamp,
          deliveredAt: timestamp,
        };

        const updated: Case = {
          ...c,
          notifications: [newNotif, ...c.notifications],
          audit: [
            ...c.audit,
            {
              id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              caseId,
              action: `Notification (${notif.channel.toUpperCase()}) Sent`,
              owner: "CareLoop Communication Service",
              ownerRole: "system",
              reason: notif.message,
              timestamp,
            },
          ],
        };

        set({ cases: cases.map((x) => (x.id === caseId ? updated : x)) });
        return true;
      },
    }),
    {
      name: "careloop_production_v4_secure_store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cases: state.cases,
        selectedCaseId: state.selectedCaseId,
      }),
      onRehydrateStorage: () => (state) => {
        const session = getActiveSession();
        if (state) {
          state.currentUser = session ? session.user : null;
          state.currentRole = session ? session.user.role : null;
          state.isAuthenticated = !!session;
        }
      },
    }
  )
);
