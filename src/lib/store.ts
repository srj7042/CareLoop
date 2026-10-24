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
import { addDays, addHours } from "./utils";

const nowIso = () => new Date().toISOString();

export type AppState = {
  cases: Case[];
  currentUser: User;
  currentRole: Role;
  selectedCaseId: string | null;
  mariaStoryStep: number; // 0 to 6
  isMariaTourActive: boolean;

  // actions
  setRole: (role: Role) => void;
  setCurrentUser: (user: User) => void;
  selectCase: (id: string | null) => void;
  getCase: (id: string) => Case | undefined;
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

  // channel notification simulation
  addNotification: (
    caseId: string,
    notif: { channel: Channel; to: string; message: string; status?: "sent" | "delivered" | "read" | "acknowledged" }
  ) => boolean;

  // Maria Demo Story Walkthrough
  setMariaStoryStep: (step: number) => void;
  setMariaTourActive: (active: boolean) => void;
  runNextMariaStep: () => void;

  // Reset Demo
  resetDemo: () => void;
};

const defaultUser = allUsers[0]; // Riya Sharma (Care Coordinator)

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      cases: [...seedCases],
      currentUser: defaultUser,
      currentRole: "coordinator",
      selectedCaseId: "CASE-001",
      mariaStoryStep: 1, // Step 1: Overdue acknowledgement flagged
      isMariaTourActive: false,

      setRole: (role: Role) => {
        const found = allUsers.find((u) => u.role === role) || defaultUser;
        set({ currentRole: role, currentUser: found });
      },

      setCurrentUser: (user: User) => {
        set({ currentUser: user, currentRole: user.role });
      },

      selectCase: (id: string | null) => set({ selectedCaseId: id }),

      getCase: (id: string) => get().cases.find((c) => c.id === id),
      getOpenCases: () => get().cases.filter((c) => c.status === "open"),
      getClosedCases: () => get().cases.filter((c) => c.status === "closed"),

      transitionTo: (caseId, toStep, reason, note, evidence) => {
        const { cases, currentUser } = get();
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
        const c = cases.find((x) => x.id === caseId);
        if (!c) return false;

        const coordinator = allUsers.find((u) => u.role === "coordinator") || currentUser;
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
        const c = cases.find((x) => x.id === caseId);
        if (!c) return false;

        const timestamp = nowIso();
        const updated: Case = {
          ...c,
          status: "closed",
          sideState: null,
          closedBy: currentUser.id,
          closedByName: currentUser.name,
          closedAt: timestamp,
          closureReason: reason,
          nextAction: "Loop Closed ✓",
          closureEvidence: [...(c.closureEvidence || []), ...evidence],
          steps: c.steps.map((s) => (s.key === "closed" ? { ...s, status: "completed", timestamp } : s)),
          audit: [
            ...c.audit,
            {
              id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              caseId,
              action: "Care Loop Officially Closed ✓",
              toStep: "closed",
              owner: currentUser.name,
              ownerRole: currentUser.role,
              reason,
              timestamp,
            },
          ],
        };

        set({ cases: cases.map((x) => (x.id === caseId ? updated : x)) });
        return true;
      },

      setPatientPulse: (caseId, understanding, confidence) => {
        const { cases } = get();
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
              action: "Patient Pulse Survey Recorded",
              owner: c.patientName,
              ownerRole: "patient",
              reason: `Understanding: ${understanding}/5, Confidence: ${confidence}/5`,
              timestamp: nowIso(),
            },
          ],
        };

        set({ cases: cases.map((x) => (x.id === caseId ? updated : x)) });
        return true;
      },

      requestCallback: (caseId, note) => {
        const { cases } = get();
        const c = cases.find((x) => x.id === caseId);
        if (!c) return false;

        const timestamp = nowIso();
        const updated: Case = {
          ...c,
          patientCallbackRequested: true,
          patientCallbackTime: timestamp,
          patientQuestionNote: note,
          audit: [
            ...c.audit,
            {
              id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              caseId,
              action: "Patient Requested Callback",
              owner: c.patientName,
              ownerRole: "patient",
              reason: note || "Patient requested to speak with a care coordinator regarding their screening result.",
              timestamp,
            },
          ],
        };

        set({ cases: cases.map((x) => (x.id === caseId ? updated : x)) });
        return true;
      },

      patientAcknowledge: (caseId, responseType) => {
        const { cases } = get();
        const c = cases.find((x) => x.id === caseId);
        if (!c) return false;

        const timestamp = nowIso();
        const updated = transitionCase(
          c,
          {
            caseId,
            toStep: "acknowledged",
            ownerId: c.patientId,
            ownerName: c.patientName,
            ownerRole: "patient",
            reason:
              responseType === "yes"
                ? "Patient confirmed understanding via digital portal."
                : responseType === "questions"
                ? "Patient acknowledged result with questions."
                : "Patient acknowledged result and requested direct callback.",
            note: responseType === "call" ? "Callback requested by patient" : undefined,
          },
          timestamp
        );

        if (responseType === "call") {
          updated.patientCallbackRequested = true;
          updated.patientCallbackTime = timestamp;
        }

        // Add acknowledged notification log
        updated.notifications.push({
          id: `notif-${Date.now()}`,
          channel: "sms",
          to: c.patientPhone,
          message: "Confirmation recorded. CareLoop coordinator notified.",
          status: "acknowledged",
          sentAt: timestamp,
          acknowledgedAt: timestamp,
        });

        set({ cases: cases.map((x) => (x.id === caseId ? updated : x)) });
        return true;
      },

      addConsult: (caseId, consult) => {
        const { cases, currentUser } = get();
        const c = cases.find((x) => x.id === caseId);
        if (!c) return false;

        const toUser = findUserById(consult.to) || { id: consult.to, name: "Consulting Specialist", role: "specialist" as Role, facility: "" };
        const msg = {
          id: `cns-${Date.now()}`,
          caseId,
          from: currentUser.id,
          fromName: currentUser.name,
          fromRole: currentUser.role,
          to: toUser.id,
          toName: toUser.name,
          toRole: toUser.role,
          question: consult.question,
          urgency: consult.urgency,
          attachedResults: consult.attachedResults,
          createdAt: nowIso(),
        };

        const updated: Case = {
          ...c,
          consults: [...c.consults, msg],
          audit: [
            ...c.audit,
            {
              id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              caseId,
              action: `Quick Consult Sent to ${toUser.name}`,
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
        const c = cases.find((x) => x.id === caseId);
        if (!c) return false;

        const updatedConsults = c.consults.map((m) =>
          m.id === consultId
            ? { ...m, response, outcomeNote, respondedAt: nowIso() }
            : m
        );

        const updated: Case = {
          ...c,
          consults: updatedConsults,
          audit: [
            ...c.audit,
            {
              id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              caseId,
              action: `Quick Consult Answered by ${currentUser.name}`,
              owner: currentUser.name,
              ownerRole: currentUser.role,
              reason: outcomeNote || "Specialist clinical opinion rendered.",
              timestamp: nowIso(),
            },
          ],
        };

        set({ cases: cases.map((x) => (x.id === caseId ? updated : x)) });
        return true;
      },

      updateReferral: (caseId, refUpdate) => {
        const { cases, currentUser } = get();
        const c = cases.find((x) => x.id === caseId);
        if (!c) return false;

        const currentRef = c.referral || {
          caseId,
          patientId: c.patientId,
          patientName: c.patientName,
          resultSummary: c.resultValue,
          history: `${c.patientAge}yo ${c.patientGender}`,
          doneSoFar: "Initial screening completed",
          reasonForReferral: `Follow-up evaluation for ${c.screeningType}`,
          urgency: c.urgency,
          specialtyRequired: "Specialist",
          status: "pending" as const,
        };

        const merged: ReferralPacket = {
          ...currentRef,
          ...refUpdate,
        };

        const updated: Case = {
          ...c,
          referral: merged,
        };

        // If accepted, also advance the referral accepted step
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
              action: `Simulated Notification (${notif.channel.toUpperCase()}) Sent`,
              owner: "CareLoop Simulator",
              ownerRole: "system",
              reason: notif.message,
              timestamp,
            },
          ],
        };

        set({ cases: cases.map((x) => (x.id === caseId ? updated : x)) });
        return true;
      },

      setMariaStoryStep: (step: number) => set({ mariaStoryStep: step }),
      setMariaTourActive: (active: boolean) => set({ isMariaTourActive: active }),

      runNextMariaStep: () => {
        const { mariaStoryStep, cases, transitionTo, updateReferral, closeWithEvidence } = get();
        const maria = cases.find((c) => c.id === "CASE-001");
        if (!maria) return;

        if (mariaStoryStep === 1) {
          // Advance to Step 2: Patient Acknowledged via Voice outreach / portal
          transitionTo(
            "CASE-001",
            "acknowledged",
            "Care coordinator contacted Maria via Spanish phone consultation. Maria acknowledged result.",
            "Patient reassured; agreed to diagnostic imaging appointment."
          );
          set({ mariaStoryStep: 2 });
        } else if (mariaStoryStep === 2) {
          // Advance to Step 3: Confirmatory diagnostic ultrasound/mammogram ordered & done
          transitionTo(
            "CASE-001",
            "confirmation",
            "Diagnostic breast ultrasound and spot compression mammogram completed at Metro Oncology.",
            "Sonographic-guided core needle biopsy performed. Specimen sent to pathology."
          );
          set({ mariaStoryStep: 3 });
        } else if (mariaStoryStep === 3) {
          // Advance to Step 4: Referral sent and accepted by Specialist Dr. Fatima
          transitionTo(
            "CASE-001",
            "referral",
            "Referral submitted to Dr. Fatima Al-Rashid for surgical oncology follow-up."
          );
          updateReferral("CASE-001", {
            status: "accepted",
            acceptedBy: "u3",
            acceptedByName: "Dr. Fatima Al-Rashid",
            acceptedAt: nowIso(),
          });
          set({ mariaStoryStep: 4 });
        } else if (mariaStoryStep === 4) {
          // Advance to Step 5: Appointment booked and attended
          transitionTo(
            "CASE-001",
            "booked",
            "In-person consultation booked with Dr. Fatima Al-Rashid for Oct 23."
          );
          transitionTo(
            "CASE-001",
            "attended",
            "Maria attended in-person oncology visit with daughter present for Spanish translation support."
          );
          set({ mariaStoryStep: 5 });
        } else if (mariaStoryStep === 5) {
          // Advance to Step 6: Loop Closed with verified evidence & certificate
          closeWithEvidence(
            "CASE-001",
            [
              {
                type: "appointment-attended",
                description: "Oncology consultation attended with Dr. Fatima Al-Rashid on Oct 23.",
                attachedBy: "u3",
                attachedByName: "Dr. Fatima Al-Rashid",
                attachedAt: nowIso(),
              },
              {
                type: "surveillance-plan",
                description: "Pathology confirms benign fibroadenoma with focal hyperplasia (No malignancy). Follow-up bilateral surveillance mammogram scheduled in 6 months.",
                attachedBy: "u3",
                attachedByName: "Dr. Fatima Al-Rashid",
                attachedAt: nowIso(),
              },
            ],
            "Care loop closed: Benign pathology confirmed with documented 6-month surveillance plan."
          );
          set({ mariaStoryStep: 6 });
        }
      },

      resetDemo: () => {
        set({
          cases: [...seedCases],
          currentUser: defaultUser,
          currentRole: "coordinator",
          selectedCaseId: "CASE-001",
          mariaStoryStep: 1,
          isMariaTourActive: false,
        });
      },
    }),
    {
      name: "careloop_production_v2_storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
