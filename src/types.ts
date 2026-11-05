export type Role =
  | "master_admin"
  | "director"
  | "hod"
  | "coordinator"
  | "clinician"
  | "specialist"
  | "patient";

export type UserCustomField = {
  id: string;
  label: string;
  value: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  organizationId: string;
  organizationName: string;
  facility: string;
  department?: string;
  phone?: string;
  secondaryPhone?: string;
  title?: string;
  bio?: string;
  customFields?: UserCustomField[];
  avatar?: string;
  status: "active" | "inactive";
  lastLogin?: string;
};

export type Organization = {
  id: string;
  name: string;
  code: string;
  type: "health_system" | "hospital" | "academic_center" | "clinic_network";
  departments: string[];
  activeScreeningPrograms: string[];
  slaHoursThreshold: number;
  contactEmail: string;
  createdAt: string;
};

export type Lang = "en" | "ta" | "te" | "hi" | "mr";

export type CaseStatus = "open" | "closed";

export type StepKey =
  | "issued"
  | "notified"
  | "acknowledged"
  | "confirmation"
  | "referral"
  | "accepted"
  | "booked"
  | "attended"
  | "treatment"
  | "closed";

export type CaseStep = {
  key: StepKey;
  label: string;
  status: "not-started" | "in-progress" | "completed" | "overdue" | "skipped";
  owner?: string;
  ownerRole?: Role | "triage-queue";
  timestamp?: string; // ISO
  dueAt?: string; // ISO
  note?: string;
  evidence?: string[]; // attachment ids / note refs
  slaHours?: number;
};

export type SideState =
  | "overdue"
  | "rejected"
  | "unassigned"
  | "escalated"
  | "lost-to-follow-up"
  | "patient-declined"
  | null;

export type Urgency = "routine" | "high" | "urgent";

export type Channel = "sms" | "whatsapp" | "email" | "push" | "voice";

export type NotificationLog = {
  id: string;
  channel: Channel;
  to: string;
  message: string;
  status: "sent" | "delivered" | "read" | "acknowledged" | "failed";
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
  acknowledgedAt?: string;
  attemptNumber?: number;
};

export type AuditEntry = {
  id: string;
  caseId: string;
  action: string;
  fromStep?: StepKey;
  toStep?: StepKey;
  owner: string;
  ownerRole: Role | "triage-queue" | "system";
  reason: string;
  timestamp: string;
  metadata?: Record<string, string>;
};

export type ConsultMessage = {
  id: string;
  caseId: string;
  from: string;
  fromName: string;
  fromRole: Role;
  to: string;
  toName: string;
  toRole: Role;
  question: string;
  urgency: Urgency;
  attachedResults: string[];
  response?: string;
  respondedAt?: string;
  outcomeNote?: string;
  createdAt: string;
};

export type ReferralPacket = {
  caseId: string;
  patientId: string;
  patientName: string;
  resultSummary: string;
  history: string;
  doneSoFar: string;
  reasonForReferral: string;
  urgency: Urgency;
  specialtyRequired: string;
  status: "pending" | "accepted" | "rejected" | "more-info";
  rejectReason?: string;
  moreInfoReason?: string;
  acceptedBy?: string;
  acceptedByName?: string;
  acceptedAt?: string;
};

export type ClosureEvidence = {
  type: "appointment-attended" | "treatment-started" | "surveillance-plan" | "clinician-reasoned";
  description: string;
  attachedBy: string;
  attachedByName?: string;
  attachedAt: string;
  note?: string;
  documentRef?: string;
};

export type ClinicalPathwayType = 
  | "biopsy-referral"      // Mammogram, Pap Smear, Lung Nodule CT (requires confirmation or specialist)
  | "lifestyle-medication" // Blood Pressure, Lipid Panel (direct treatment & surveillance)
  | "endoscopy-referral"   // Positive FIT (confirmatory diagnostic colonoscopy)
  | "repeat-screen"        // Newborn Hearing Screen (repeat screen, then audiology)
  | "metabolic-management";// HbA1c (confirmation lab, then nutrition/endo)

export type Case = {
  id: string;
  organizationId: string;
  department: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: "Female" | "Male" | "Other";
  patientPhone: string;
  patientLanguage: Lang;
  program: string;
  facility: string;
  screeningType: string;
  pathwayType: ClinicalPathwayType;
  resultValue: string;
  resultInterpretation: string; // plain language
  urgency: Urgency;
  status: CaseStatus;
  currentOwner: string; // user id OR queue id
  currentOwnerName: string;
  currentOwnerRole: Role | "triage-queue";
  isQueueOwner: boolean;
  nextAction: string;
  nextActionDue: string; // ISO
  steps: CaseStep[];
  sideState: SideState;
  notifications: NotificationLog[];
  audit: AuditEntry[];
  consults: ConsultMessage[];
  referral?: ReferralPacket;
  closureEvidence?: ClosureEvidence[];
  closedBy?: string;
  closedByName?: string;
  closedAt?: string;
  closureReason?: string;
  understandingScore?: number; // 1-5 pulse
  confidenceScore?: number; // 1-5 pulse
  patientCallbackRequested?: boolean;
  patientCallbackTime?: string;
  patientQuestionNote?: string;
  createdAt: string;
  aiSuggestedNextStep?: string;
  aiDelayRiskScore?: number; // 0-100
  delayReasonPrimary?: string;
};

export type KPIFilters = {
  program?: string;
  facility?: string;
  provider?: string;
  language?: string;
  ageGroup?: string;
  urgency?: Urgency;
};
