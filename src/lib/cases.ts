import type {
  Case,
  CaseStep,
  Role,
  Urgency,
  SideState,
  ClinicalPathwayType,
  User,
  StepKey,
  ClosureEvidence,
  Lang,
} from "../types";
import { addDays, addHours } from "./utils";
import { REGISTERED_ACCOUNTS } from "./auth";

// Fixed anchor time for reproducible deterministic data
export const DEMO_BASE_DATE = "2026-10-20T09:00:00Z";

// Legitimate registered system staff and accounts (No demo personas)
export const allUsers: User[] = REGISTERED_ACCOUNTS.map(
  ({ passwordHash: _, ...user }) => user
);

export const triageQueues = [
  { id: "queue-cancer", name: "Triage Queue - Cancer Screening", role: "triage-queue" as const },
  { id: "queue-metabolic", name: "Triage Queue - Diabetes & Hypertension", role: "triage-queue" as const },
  { id: "queue-mch", name: "Triage Queue - Maternal & Child Health", role: "triage-queue" as const },
  { id: "queue-cardio", name: "Triage Queue - Cardiovascular Risk", role: "triage-queue" as const },
];

export const findUserById = (id: string): User | undefined => {
  return allUsers.find((u) => u.id === id);
};

export const findOwnerDetails = (
  ownerId: string
): { name: string; role: Role | "triage-queue"; isQueue: boolean } => {
  const user = allUsers.find((u) => u.id === ownerId);
  if (user) {
    return { name: user.name, role: user.role, isQueue: false };
  }
  const queue = triageQueues.find((q) => q.id === ownerId);
  if (queue) {
    return { name: queue.name, role: queue.role, isQueue: true };
  }
  return { name: "Clinical Triage Desk", role: "coordinator", isQueue: false };
};

export const screeningConfigs: Record<
  string,
  {
    program: string;
    pathwayType: ClinicalPathwayType;
    specialty: string;
    department: string;
    needsConfirmation: boolean;
    needsReferral: boolean;
    defaultUrgency: Urgency;
    queueId: string;
    queueName: string;
  }
> = {
  Mammogram: {
    program: "Cancer Screening Program",
    pathwayType: "biopsy-referral",
    specialty: "Breast Oncology",
    department: "Oncology",
    needsConfirmation: true,
    needsReferral: true,
    defaultUrgency: "urgent",
    queueId: "queue-cancer",
    queueName: "Triage Queue - Cancer Screening",
  },
  "HbA1c (Diabetes)": {
    program: "Diabetes Management Program",
    pathwayType: "metabolic-management",
    specialty: "Endocrinology",
    department: "Primary Care",
    needsConfirmation: true,
    needsReferral: true,
    defaultUrgency: "high",
    queueId: "queue-metabolic",
    queueName: "Triage Queue - Diabetes & Hypertension",
  },
  "Blood Pressure": {
    program: "Hypertension Control Program",
    pathwayType: "lifestyle-medication",
    specialty: "Cardiology",
    department: "Cardiology",
    needsConfirmation: false,
    needsReferral: false,
    defaultUrgency: "high",
    queueId: "queue-cardio",
    queueName: "Triage Queue - Cardiovascular Risk",
  },
  "FIT / Colon Cancer": {
    program: "Cancer Screening Program",
    pathwayType: "endoscopy-referral",
    specialty: "Gastroenterology",
    department: "Oncology",
    needsConfirmation: false,
    needsReferral: true,
    defaultUrgency: "urgent",
    queueId: "queue-cancer",
    queueName: "Triage Queue - Cancer Screening",
  },
  "Pap Smear": {
    program: "Women's Health Program",
    pathwayType: "biopsy-referral",
    specialty: "Gynecology Oncology",
    department: "Women's Health",
    needsConfirmation: true,
    needsReferral: true,
    defaultUrgency: "high",
    queueId: "queue-cancer",
    queueName: "Triage Queue - Cancer Screening",
  },
  "Newborn Hearing Screen": {
    program: "Maternal & Child Health",
    pathwayType: "repeat-screen",
    specialty: "Pediatric Audiology",
    department: "Primary Care",
    needsConfirmation: true,
    needsReferral: true,
    defaultUrgency: "routine",
    queueId: "queue-mch",
    queueName: "Triage Queue - Maternal & Child Health",
  },
  "Lipid Panel": {
    program: "Cardiovascular Risk Prevention",
    pathwayType: "lifestyle-medication",
    specialty: "Preventive Cardiology",
    department: "Cardiology",
    needsConfirmation: false,
    needsReferral: false,
    defaultUrgency: "routine",
    queueId: "queue-cardio",
    queueName: "Triage Queue - Cardiovascular Risk",
  },
  "Lung Nodule CT": {
    program: "Cancer Screening Program",
    pathwayType: "biopsy-referral",
    specialty: "Pulmonology",
    department: "Oncology",
    needsConfirmation: true,
    needsReferral: true,
    defaultUrgency: "high",
    queueId: "queue-cancer",
    queueName: "Triage Queue - Cancer Screening",
  },
};

// Create standard steps tailored to clinical pathway
export const createPathwaySteps = (
  screeningType: string,
  issuedAt: string,
  issuedBy = "Sarah Thompson, BSN, RN"
): CaseStep[] => {
  const config = screeningConfigs[screeningType] || screeningConfigs["Mammogram"];
  const steps: CaseStep[] = [
    {
      key: "issued",
      label: "Result Issued",
      status: "completed",
      owner: issuedBy,
      ownerRole: "coordinator",
      timestamp: issuedAt,
    },
    {
      key: "notified",
      label: "Patient Notified",
      status: "not-started",
      slaHours: 24,
    },
    {
      key: "acknowledged",
      label: "Patient Acknowledged",
      status: "not-started",
      slaHours: 72,
    },
  ];

  if (config.needsConfirmation) {
    steps.push({
      key: "confirmation",
      label: "Diagnostic Confirmatory Order",
      status: "not-started",
      slaHours: 96,
    });
  }

  if (config.needsReferral) {
    steps.push(
      {
        key: "referral",
        label: "Specialist Referral Sent",
        status: "not-started",
        slaHours: 48,
      },
      {
        key: "accepted",
        label: "Specialist Accepted",
        status: "not-started",
        slaHours: 48,
      }
    );
  }

  steps.push(
    {
      key: "booked",
      label: "Appointment Booked",
      status: "not-started",
      slaHours: 120,
    },
    {
      key: "attended",
      label: "Clinical Visit Attended",
      status: "not-started",
    },
    {
      key: "treatment",
      label: "Treatment / Surveillance Plan",
      status: "not-started",
    },
    {
      key: "closed",
      label: "Loop Closed ✓",
      status: "not-started",
    }
  );

  return steps;
};

// 50 DETERMINISTIC REAL HEALTHCARE SEED CASES
export const seedCases: Case[] = (() => {
  const cases: Case[] = [];

  // 1. ANANYA SHARMA (Apex Health System - Primary Patient Portal Account)
  // Story: Abnormal Mammogram -> Multichannel notification -> Overdue acknowledgement -> Escalated to coordinator Sarah Thompson
  const ananyaIssued = addDays(DEMO_BASE_DATE, -4);
  const ananyaSteps = createPathwaySteps("Mammogram", ananyaIssued, "Sarah Thompson, BSN, RN");
  ananyaSteps[1] = {
    ...ananyaSteps[1],
    status: "completed",
    owner: "Sarah Thompson, BSN, RN",
    ownerRole: "coordinator",
    timestamp: addHours(ananyaIssued, 2),
    note: "Digital notification delivered via SMS & secure patient portal alert.",
  };
  ananyaSteps[2] = {
    ...ananyaSteps[2],
    status: "overdue",
    dueAt: addHours(ananyaIssued, 72),
    note: "Patient has not yet acknowledged result on portal. Outreach escalation required.",
  };

  cases.push({
    id: "CASE-001",
    organizationId: "org-apex",
    department: "Oncology",
    patientId: "usr_patient_ananya",
    patientName: "Ananya Sharma",
    patientAge: 52,
    patientGender: "Female",
    patientPhone: "+1 (555) 100-2007",
    patientLanguage: "en",
    program: "Cancer Screening Program",
    facility: "Apex Cancer Institute",
    screeningType: "Mammogram",
    pathwayType: "biopsy-referral",
    resultValue: "BI-RADS 4 - Suspicious microcalcifications in upper outer quadrant",
    resultInterpretation:
      "The mammogram shows an area that needs a closer look. In most women, this turns out not to be cancer, but a diagnostic ultrasound or biopsy is necessary to be certain.",
    urgency: "urgent",
    status: "open",
    currentOwner: "usr_coord_sarah",
    currentOwnerName: "Sarah Thompson, BSN, RN",
    currentOwnerRole: "coordinator",
    isQueueOwner: false,
    nextAction: "Overdue acknowledgement: Contact patient via phone outreach & coordinate diagnostic imaging slot",
    nextActionDue: addHours(DEMO_BASE_DATE, -6),
    steps: ananyaSteps,
    sideState: "escalated",
    notifications: [
      {
        id: "notif-001-1",
        channel: "sms",
        to: "+1 (555) 100-2007",
        message: "CareLoop: Hello Ananya, your screening mammogram report is ready on your secure patient portal. Please log in to review and confirm.",
        status: "delivered",
        sentAt: addHours(ananyaIssued, 2),
        deliveredAt: addHours(ananyaIssued, 2.1),
        attemptNumber: 1,
      },
      {
        id: "notif-001-2",
        channel: "whatsapp",
        to: "+1 (555) 100-2007",
        message: "CareLoop: Important health check update from Apex Cancer Institute. Your care coordinator Sarah Thompson is coordinating your next step.",
        status: "delivered",
        sentAt: addDays(ananyaIssued, 2),
        deliveredAt: addDays(ananyaIssued, 2.1),
        attemptNumber: 2,
      },
    ],
    audit: [
      {
        id: "aud-001-1",
        caseId: "CASE-001",
        action: "Screening result issued",
        fromStep: undefined,
        toStep: "issued",
        owner: "Radiology Department - Apex Cancer Institute",
        ownerRole: "coordinator",
        reason: "Digital screening mammography flagged BI-RADS 4 suspicious finding.",
        timestamp: ananyaIssued,
      },
      {
        id: "aud-001-2",
        caseId: "CASE-001",
        action: "Patient notified via SMS & Portal",
        fromStep: "issued",
        toStep: "notified",
        owner: "Sarah Thompson, BSN, RN",
        ownerRole: "coordinator",
        reason: "Automated multichannel notification dispatched with plain-language summary.",
        timestamp: addHours(ananyaIssued, 2),
      },
      {
        id: "aud-001-3",
        caseId: "CASE-001",
        action: "Escalated to Care Coordinator",
        fromStep: "notified",
        toStep: "notified",
        owner: "CareLoop SLA Engine",
        ownerRole: "system",
        reason: "72-hour patient acknowledgement SLA breached. Escalated as urgent clinical risk.",
        timestamp: addDays(ananyaIssued, 3),
      },
    ],
    consults: [
      {
        id: "cns-001",
        caseId: "CASE-001",
        from: "usr_clin_kenneth",
        fromName: "Dr. Kenneth Reynolds, MD",
        fromRole: "clinician",
        to: "usr_spec_maya",
        toName: "Dr. Maya Lin, MD, FACS",
        toRole: "specialist",
        question: "Patient Ananya Sharma has BI-RADS 4 calcifications. Do you recommend ultrasound-guided core needle biopsy or diagnostic spot compression first?",
        urgency: "urgent",
        attachedResults: ["Mammogram BI-RADS 4", "Prior Mammogram 2024 (Normal)"],
        createdAt: addDays(DEMO_BASE_DATE, -1),
        response: "Recommend same-day diagnostic mammogram with spot compression + immediate ultrasound-guided core needle biopsy if finding persists.",
        respondedAt: addHours(DEMO_BASE_DATE, -10),
        outcomeNote: "Expedited biopsy protocol authorized by Dr. Maya Lin, MD.",
      },
    ],
    referral: {
      caseId: "CASE-001",
      patientId: "usr_patient_ananya",
      patientName: "Ananya Sharma",
      resultSummary: "BI-RADS 4 microcalcifications in left upper outer quadrant",
      history: "52yo female, G2P2, menopause at 50, no prior personal history of breast cancer.",
      doneSoFar: "Screening mammogram complete; primary clinician consult completed with Dr. Maya Lin.",
      reasonForReferral: "Diagnostic breast ultrasound and possible biopsy for BI-RADS 4 finding.",
      urgency: "urgent",
      specialtyRequired: "Breast Oncology",
      status: "pending",
    },
    aiSuggestedNextStep: "Escalate to direct nurse phone outreach; coordinate fast-track ultrasound biopsy slot with Dr. Maya Lin.",
    aiDelayRiskScore: 84,
    delayReasonPrimary: "No contact / unreachable",
    createdAt: ananyaIssued,
  });

  // 2. KAVITA REDDY - High HbA1c (Apex Health - Primary Care)
  const kavitaIssued = addDays(DEMO_BASE_DATE, -7);
  const kavitaSteps = createPathwaySteps("HbA1c (Diabetes)", kavitaIssued, "Dr. Kenneth Reynolds, MD");
  kavitaSteps[1] = { ...kavitaSteps[1], status: "completed", owner: "Dr. Kenneth Reynolds, MD", timestamp: addHours(kavitaIssued, 4) };
  kavitaSteps[2] = { ...kavitaSteps[2], status: "completed", owner: "Kavita Reddy", timestamp: addDays(kavitaIssued, 1) };
  kavitaSteps[3] = { ...kavitaSteps[3], status: "completed", owner: "Apex Central Lab", timestamp: addDays(kavitaIssued, 3), note: "Repeat fasting glucose 218 mg/dL confirms uncontrolled DM2." };
  kavitaSteps[4] = { ...kavitaSteps[4], status: "completed", owner: "Dr. Kenneth Reynolds, MD", timestamp: addDays(kavitaIssued, 4) };
  kavitaSteps[5] = { ...kavitaSteps[5], status: "in-progress", dueAt: addDays(kavitaIssued, 6) };

  cases.push({
    id: "CASE-002",
    organizationId: "org-apex",
    department: "Primary Care",
    patientId: "P-1002",
    patientName: "Kavita Reddy",
    patientAge: 59,
    patientGender: "Female",
    patientPhone: "+1 (555) 301-4455",
    patientLanguage: "te",
    program: "Diabetes Management Program",
    facility: "Apex Health Family Medicine Center",
    screeningType: "HbA1c (Diabetes)",
    pathwayType: "metabolic-management",
    resultValue: "HbA1c 9.4% (Target < 7.0%)",
    resultInterpretation: "గత 3 నెలల మీ సగటు రక్తంలో చక్కెర స్థాయి సాధారణ పరిమితి కంటే ఎక్కువగా ఉంది. మందులు మరియు ఆహారంలో మార్పులు అవసరం.",
    urgency: "high",
    status: "open",
    currentOwner: "usr_clin_kenneth",
    currentOwnerName: "Dr. Kenneth Reynolds, MD",
    currentOwnerRole: "clinician",
    isQueueOwner: false,
    nextAction: "Awaiting specialist endocrinology review for injectable GLP-1 therapy titration",
    nextActionDue: addDays(DEMO_BASE_DATE, 1),
    steps: kavitaSteps,
    sideState: null,
    notifications: [
      {
        id: "notif-002-1",
        channel: "whatsapp",
        to: "+1 (555) 301-4455",
        message: "CareLoop: నమస్కారం కవిత గారు, మీ HbA1c రక్త పరీక్ష ఫలితం సిద్ధంగా ఉంది.",
        status: "acknowledged",
        sentAt: addHours(kavitaIssued, 4),
        deliveredAt: addHours(kavitaIssued, 4.2),
        acknowledgedAt: addDays(kavitaIssued, 1),
        attemptNumber: 1,
      },
    ],
    audit: [
      {
        id: "aud-002-1",
        caseId: "CASE-002",
        action: "Lab result issued",
        fromStep: undefined,
        toStep: "issued",
        owner: "Apex Health Family Medicine Lab",
        ownerRole: "clinician",
        reason: "Quarterly HbA1c test flagged significant hyperglycemia.",
        timestamp: kavitaIssued,
      },
    ],
    consults: [],
    referral: {
      caseId: "CASE-002",
      patientId: "P-1002",
      patientName: "Kavita Reddy",
      resultSummary: "HbA1c 9.4%, Fasting Glucose 218 mg/dL",
      history: "59yo female with 7-year history of Type 2 DM, BMI 30, currently on Metformin 1000mg BID.",
      doneSoFar: "Confirmation lab complete; patient educated on glycemic targets.",
      reasonForReferral: "Advanced diabetes care & injectable medication titration.",
      urgency: "high",
      specialtyRequired: "Endocrinology",
      status: "pending",
    },
    aiSuggestedNextStep: "Send reminder to Endocrinology triage desk to review pending referral within 24 hours.",
    aiDelayRiskScore: 32,
    createdAt: kavitaIssued,
  });

  // 3. MEERA SUNDARAM - Elevated BP (FULLY CLOSED WITH VERIFIED EVIDENCE)
  const meeraIssued = addDays(DEMO_BASE_DATE, -12);
  const meeraSteps = createPathwaySteps("Blood Pressure", meeraIssued, "Dr. Kenneth Reynolds, MD");
  meeraSteps[1] = { ...meeraSteps[1], status: "completed", timestamp: addHours(meeraIssued, 2) };
  meeraSteps[2] = { ...meeraSteps[2], status: "completed", timestamp: addHours(meeraIssued, 6) };
  meeraSteps[6] = { ...meeraSteps[6], status: "completed", timestamp: addDays(meeraIssued, 2), note: "In-clinic BP recheck booked" };
  meeraSteps[7] = { ...meeraSteps[7], status: "completed", timestamp: addDays(meeraIssued, 7), note: "Repeat BP 168/98 mmHg confirmed." };
  meeraSteps[8] = { ...meeraSteps[8], status: "completed", timestamp: addDays(meeraIssued, 8), note: "Started Amlodipine 5mg daily + DASH diet plan." };
  meeraSteps[9] = {
    ...meeraSteps[9],
    status: "completed",
    owner: "Dr. Kenneth Reynolds, MD",
    ownerRole: "clinician",
    timestamp: addDays(meeraIssued, 10),
    note: "Loop closed. Follow-up BP stabilized at 124/80 mmHg documented.",
  };

  cases.push({
    id: "CASE-003",
    organizationId: "org-apex",
    department: "Cardiology",
    patientId: "P-1003",
    patientName: "Meera Sundaram",
    patientAge: 56,
    patientGender: "Female",
    patientPhone: "+1 (555) 402-5566",
    patientLanguage: "ta",
    program: "Hypertension Control Program",
    facility: "Apex Heart & Vascular Center",
    screeningType: "Blood Pressure",
    pathwayType: "lifestyle-medication",
    resultValue: "Stage 2 HTN: 172/102 mmHg",
    resultInterpretation: "உங்கள் இரத்த அழுத்தம் இயல்பான அளவை விட அதிகமாக உள்ளது. உரிய மருத்துவ கவனிப்பு மூலம் கட்டுக்குள் கொண்டு வரலாம்.",
    urgency: "urgent",
    status: "closed",
    currentOwner: "usr_clin_kenneth",
    currentOwnerName: "Dr. Kenneth Reynolds, MD",
    currentOwnerRole: "clinician",
    isQueueOwner: false,
    nextAction: "Loop Closed ✓ — Patient on maintenance surveillance (Next routine check in 3 months)",
    nextActionDue: addDays(DEMO_BASE_DATE, 60),
    steps: meeraSteps,
    sideState: null,
    notifications: [
      {
        id: "notif-003-1",
        channel: "sms",
        to: "+1 (555) 402-5566",
        message: "CareLoop: வணக்கம் மீரா, உங்கள் இரத்த அழுத்த முடிவு உறுதி செய்யப்பட்டது. உங்கள் மருத்துவக் குழுவிற்கு நன்றி.",
        status: "acknowledged",
        sentAt: addHours(meeraIssued, 2),
        acknowledgedAt: addHours(meeraIssued, 6),
      },
    ],
    audit: [
      {
        id: "aud-003-1",
        caseId: "CASE-003",
        action: "High BP recorded at health screening",
        fromStep: undefined,
        toStep: "issued",
        owner: "Apex Community Health Outreach",
        ownerRole: "coordinator",
        reason: "Initial reading 172/102 confirmed twice 5 minutes apart.",
        timestamp: meeraIssued,
      },
      {
        id: "aud-003-2",
        caseId: "CASE-003",
        action: "Loop closed with verified clinical evidence",
        fromStep: "treatment",
        toStep: "closed",
        owner: "Dr. Kenneth Reynolds, MD",
        ownerRole: "clinician",
        reason: "Patient responded to Amlodipine 5mg; 2-week follow-up BP 124/80 mmHg documented.",
        timestamp: addDays(meeraIssued, 10),
      },
    ],
    consults: [],
    closureEvidence: [
      {
        type: "treatment-started",
        description: "Initiated Amlodipine 5mg daily. Verified pharmacy dispensing and adherence.",
        attachedBy: "usr_clin_kenneth",
        attachedByName: "Dr. Kenneth Reynolds, MD",
        attachedAt: addDays(meeraIssued, 8),
      },
      {
        type: "appointment-attended",
        description: "Clinic follow-up attended on Oct 18. Vital signs stabilized at 124/80 mmHg.",
        attachedBy: "usr_clin_kenneth",
        attachedByName: "Dr. Kenneth Reynolds, MD",
        attachedAt: addDays(meeraIssued, 10),
      },
      {
        type: "surveillance-plan",
        description: "Enrolled in Apex Home BP monitoring program. Quarterly nurse check-in scheduled.",
        attachedBy: "usr_clin_kenneth",
        attachedByName: "Dr. Kenneth Reynolds, MD",
        attachedAt: addDays(meeraIssued, 10),
      },
    ],
    closedBy: "usr_clin_kenneth",
    closedByName: "Dr. Kenneth Reynolds, MD",
    closedAt: addDays(meeraIssued, 10),
    closureReason: "Clinical goal achieved: Blood pressure stabilized under 130/85 with verified medication and follow-up.",
    understandingScore: 5,
    confidenceScore: 5,
    createdAt: meeraIssued,
  });

  // 4. RAJESH PATEL - Positive FIT (Rejected Referral Case requiring prior-auth)
  const rajeshIssued = addDays(DEMO_BASE_DATE, -8);
  const rajeshSteps = createPathwaySteps("FIT / Colon Cancer", rajeshIssued, "Sarah Thompson, BSN, RN");
  rajeshSteps[1] = { ...rajeshSteps[1], status: "completed", timestamp: addHours(rajeshIssued, 2) };
  rajeshSteps[2] = { ...rajeshSteps[2], status: "completed", timestamp: addDays(rajeshIssued, 1) };
  rajeshSteps[4] = { ...rajeshSteps[4], status: "completed", timestamp: addDays(rajeshIssued, 3) };
  rajeshSteps[5] = {
    ...rajeshSteps[5],
    status: "overdue",
    dueAt: addDays(rajeshIssued, 5),
    note: "Referral rejected by Endoscopy Suite: Requires insurance pre-authorization documentation.",
  };

  cases.push({
    id: "CASE-004",
    organizationId: "org-apex",
    department: "Oncology",
    patientId: "P-1004",
    patientName: "Rajesh Patel",
    patientAge: 61,
    patientGender: "Male",
    patientPhone: "+1 (555) 503-6677",
    patientLanguage: "hi",
    program: "Cancer Screening Program",
    facility: "Apex Cancer Institute",
    screeningType: "FIT / Colon Cancer",
    pathwayType: "endoscopy-referral",
    resultValue: "Positive Occult Blood (FIT 180 ug Hb/g feces)",
    resultInterpretation: "मैल जांच में सूक्ष्म खून के अंश मिले हैं। पूरी सुरक्षा के लिए कोलोनोस्कोपी जांच आवश्यक है।",
    urgency: "urgent",
    status: "open",
    currentOwner: "usr_coord_sarah",
    currentOwnerName: "Sarah Thompson, BSN, RN",
    currentOwnerRole: "coordinator",
    isQueueOwner: false,
    nextAction: "Referral rejected: Complete insurance pre-authorization form and route to secondary endoscopy slot",
    nextActionDue: addDays(DEMO_BASE_DATE, -1),
    steps: rajeshSteps,
    sideState: "rejected",
    notifications: [
      {
        id: "notif-004-1",
        channel: "sms",
        to: "+1 (555) 503-6677",
        message: "CareLoop: राजेश जी, आपकी FIT जांच रिपोर्ट उपलब्ध है। हमारी टीम कोलोनोस्कोपी की तैयारी कर रही है।",
        status: "read",
        sentAt: addHours(rajeshIssued, 2),
      },
    ],
    audit: [
      {
        id: "aud-004-1",
        caseId: "CASE-004",
        action: "Referral rejected by receiving specialist",
        fromStep: "referral",
        toStep: "referral",
        owner: "Endoscopy Scheduling Desk",
        ownerRole: "specialist",
        reason: "Procedure rejected: Missing HMO prior-authorization approval code.",
        timestamp: addDays(rajeshIssued, 5),
      },
    ],
    consults: [],
    referral: {
      caseId: "CASE-004",
      patientId: "P-1004",
      patientName: "Rajesh Patel",
      resultSummary: "Positive FIT (180 ug/g)",
      history: "61yo male, family history of benign polyps, no prior colonoscopy.",
      doneSoFar: "FIT completed; patient advised on prep.",
      reasonForReferral: "Diagnostic colonoscopy for positive fecal immunochemical screening.",
      urgency: "urgent",
      specialtyRequired: "Gastroenterology",
      status: "rejected",
      rejectReason: "Missing insurance pre-authorization documentation.",
    },
    aiSuggestedNextStep: "Trigger instant re-referral packet to Apex Endoscopy with attached expedited pre-authorization form.",
    aiDelayRiskScore: 89,
    delayReasonPrimary: "Referral rejected",
    createdAt: rajeshIssued,
  });

  // 5. SUNITA DESHMUKH - Abnormal Pap Smear (UNASSIGNED Case in Triage Queue)
  const sunitaIssued = addDays(DEMO_BASE_DATE, -2);
  const sunitaSteps = createPathwaySteps("Pap Smear", sunitaIssued, "Central Cytology Lab");

  cases.push({
    id: "CASE-005",
    organizationId: "org-apex",
    department: "Women's Health",
    patientId: "P-1005",
    patientName: "Sunita Deshmukh",
    patientAge: 38,
    patientGender: "Female",
    patientPhone: "+1 (555) 604-7788",
    patientLanguage: "mr",
    program: "Women's Health Program",
    facility: "Apex Ambulatory Pavilion",
    screeningType: "Pap Smear",
    pathwayType: "biopsy-referral",
    resultValue: "ASC-US with high-risk HPV positive",
    resultInterpretation: "तपासणीत पेशींमध्ये सौम्य बदल आढळले आहेत. प्रतिबंधात्मक खबरदारी म्हणून कोलपोस्कोपी तपासणी करणे योग्य ठरेल.",
    urgency: "high",
    status: "open",
    currentOwner: "queue-cancer",
    currentOwnerName: "Triage Queue - Cancer Screening",
    currentOwnerRole: "triage-queue",
    isQueueOwner: true,
    nextAction: "Unassigned case: Department coordinator must be assigned to start patient navigation within SLA",
    nextActionDue: addDays(DEMO_BASE_DATE, 0),
    steps: sunitaSteps,
    sideState: "unassigned",
    notifications: [],
    audit: [
      {
        id: "aud-005-1",
        caseId: "CASE-005",
        action: "Abnormal result entered triage queue",
        fromStep: undefined,
        toStep: "issued",
        owner: "Apex Cytology Lab",
        ownerRole: "system",
        reason: "Electronic lab HL7 feed ingested abnormal cervical cytology result.",
        timestamp: sunitaIssued,
      },
    ],
    consults: [],
    aiSuggestedNextStep: "Assign case to Care Coordinator Sarah Thompson based on department capacity.",
    aiDelayRiskScore: 65,
    createdAt: sunitaIssued,
  });

  // 6. BABY AARAV NAIR - Newborn Hearing Screen (Repeat Screen Pathway - FULLY CLOSED)
  const babyIssued = addDays(DEMO_BASE_DATE, -20);
  const babySteps = createPathwaySteps("Newborn Hearing Screen", babyIssued, "Apex Maternity Audiology");
  babySteps[1] = { ...babySteps[1], status: "completed", timestamp: addHours(babyIssued, 3) };
  babySteps[2] = { ...babySteps[2], status: "completed", timestamp: addHours(babyIssued, 8) };
  babySteps[3] = { ...babySteps[3], status: "completed", timestamp: addDays(babyIssued, 10), note: "Repeat ABR test passed bilaterally at 30 dB nHL." };
  babySteps[4] = { ...babySteps[4], status: "skipped", note: "No audiology referral needed as repeat screen passed." };
  babySteps[5] = { ...babySteps[5], status: "skipped" };
  babySteps[6] = { ...babySteps[6], status: "skipped" };
  babySteps[7] = { ...babySteps[7], status: "completed", timestamp: addDays(babyIssued, 10) };
  babySteps[8] = { ...babySteps[8], status: "completed", timestamp: addDays(babyIssued, 12), note: "Developmental milestone surveillance plan established." };
  babySteps[9] = { ...babySteps[9], status: "completed", owner: "Sarah Thompson, BSN, RN", ownerRole: "coordinator", timestamp: addDays(babyIssued, 14) };

  cases.push({
    id: "CASE-006",
    organizationId: "org-apex",
    department: "Primary Care",
    patientId: "P-1006",
    patientName: "Baby Aarav Nair",
    patientAge: 0,
    patientGender: "Male",
    patientPhone: "+1 (555) 705-8899",
    patientLanguage: "en",
    program: "Maternal & Child Health",
    facility: "Apex Maternal & Child Health",
    screeningType: "Newborn Hearing Screen",
    pathwayType: "repeat-screen",
    resultValue: "Refer (Unilateral - Right Ear)",
    resultInterpretation: "The newborn screen did not record a clear signal in the right ear initially due to fluid. Repeat test confirmed 100% normal hearing.",
    urgency: "routine",
    status: "closed",
    currentOwner: "usr_coord_sarah",
    currentOwnerName: "Sarah Thompson, BSN, RN",
    currentOwnerRole: "coordinator",
    isQueueOwner: false,
    nextAction: "Loop Closed ✓ — Surveillance plan documented for 6-month developmental milestone check",
    nextActionDue: addDays(DEMO_BASE_DATE, 90),
    steps: babySteps,
    sideState: null,
    notifications: [
      {
        id: "notif-006-1",
        channel: "sms",
        to: "+1 (555) 705-8899",
        message: "CareLoop: Hearing check loop successfully completed for Baby Aarav Nair. Both ears confirmed normal.",
        status: "acknowledged",
        sentAt: addDays(babyIssued, 14),
      },
    ],
    audit: [
      {
        id: "aud-006-1",
        caseId: "CASE-006",
        action: "Repeat screen passed & loop closed",
        fromStep: "treatment",
        toStep: "closed",
        owner: "Sarah Thompson, BSN, RN",
        ownerRole: "coordinator",
        reason: "Repeat outpatient audiology screening passed in both ears with 100% normal waveforms.",
        timestamp: addDays(babyIssued, 14),
      },
    ],
    consults: [],
    closureEvidence: [
      {
        type: "surveillance-plan",
        description: "Repeat ABR test passed in both ears. Pediatric developmental monitoring at 6-month well-child visit.",
        attachedBy: "usr_coord_sarah",
        attachedByName: "Sarah Thompson, BSN, RN",
        attachedAt: addDays(babyIssued, 14),
      },
    ],
    closedBy: "usr_coord_sarah",
    closedByName: "Sarah Thompson, BSN, RN",
    closedAt: addDays(babyIssued, 14),
    closureReason: "Repeat screening resolved anomaly; infant hearing confirmed normal.",
    understandingScore: 5,
    confidenceScore: 5,
    createdAt: babyIssued,
  });

  // 7. VIKRAM SENGUPTA - Elevated Lipid Panel (Overdue Case)
  const vikramIssued = addDays(DEMO_BASE_DATE, -6);
  const vikramSteps = createPathwaySteps("Lipid Panel", vikramIssued, "Dr. Kenneth Reynolds, MD");
  vikramSteps[1] = { ...vikramSteps[1], status: "completed", timestamp: addHours(vikramIssued, 3) };
  vikramSteps[2] = { ...vikramSteps[2], status: "overdue", dueAt: addHours(vikramIssued, 75) };

  cases.push({
    id: "CASE-007",
    organizationId: "org-apex",
    department: "Cardiology",
    patientId: "P-1007",
    patientName: "Vikram Sengupta",
    patientAge: 50,
    patientGender: "Male",
    patientPhone: "+1 (555) 806-9900",
    patientLanguage: "en",
    program: "Cardiovascular Risk Prevention",
    facility: "Apex Heart & Vascular Center",
    screeningType: "Lipid Panel",
    pathwayType: "lifestyle-medication",
    resultValue: "LDL-C 194 mg/dL, Triglycerides 280 mg/dL",
    resultInterpretation: "Your bad cholesterol (LDL) is very high, putting extra strain on your blood vessels. Medication and dietary adjustments are recommended.",
    urgency: "high",
    status: "open",
    currentOwner: "usr_clin_kenneth",
    currentOwnerName: "Dr. Kenneth Reynolds, MD",
    currentOwnerRole: "clinician",
    isQueueOwner: false,
    nextAction: "Overdue acknowledgement: Nudge patient via WhatsApp / phone outreach to discuss statin therapy",
    nextActionDue: addDays(DEMO_BASE_DATE, -2),
    steps: vikramSteps,
    sideState: "overdue",
    notifications: [
      {
        id: "notif-007-1",
        channel: "sms",
        to: "+1 (555) 806-9900",
        message: "CareLoop: Your lipid panel results are ready. Please review in your patient portal.",
        status: "delivered",
        sentAt: addHours(vikramIssued, 3),
      },
    ],
    audit: [
      {
        id: "aud-007-1",
        caseId: "CASE-007",
        action: "Flagged overdue for acknowledgement",
        fromStep: "notified",
        toStep: "notified",
        owner: "CareLoop SLA Engine",
        ownerRole: "system",
        reason: "Patient has not accessed portal or acknowledged result within 72h SLA.",
        timestamp: addDays(vikramIssued, 3),
      },
    ],
    consults: [],
    aiSuggestedNextStep: "Send automated WhatsApp nudge and queue outreach callback.",
    aiDelayRiskScore: 76,
    delayReasonPrimary: "Fear / anxiety",
    createdAt: vikramIssued,
  });

  // 8. FARIDA KHAN - Lung Nodule CT (Accepted Referral, Appointment Attended)
  const faridaIssued = addDays(DEMO_BASE_DATE, -11);
  const faridaSteps = createPathwaySteps("Lung Nodule CT", faridaIssued, "Dr. Maya Lin, MD, FACS");
  faridaSteps[1] = { ...faridaSteps[1], status: "completed", timestamp: addHours(faridaIssued, 3) };
  faridaSteps[2] = { ...faridaSteps[2], status: "completed", timestamp: addDays(faridaIssued, 1) };
  faridaSteps[3] = { ...faridaSteps[3], status: "completed", timestamp: addDays(faridaIssued, 3), note: "High-resolution thin slice CT confirmed 8mm solid nodule in right middle lobe." };
  faridaSteps[4] = { ...faridaSteps[4], status: "completed", timestamp: addDays(faridaIssued, 4) };
  faridaSteps[5] = { ...faridaSteps[5], status: "completed", owner: "Dr. Maya Lin, MD, FACS", timestamp: addDays(faridaIssued, 5) };
  faridaSteps[6] = { ...faridaSteps[6], status: "completed", timestamp: addDays(faridaIssued, 6) };
  faridaSteps[7] = { ...faridaSteps[7], status: "completed", owner: "Dr. Maya Lin, MD, FACS", timestamp: addDays(faridaIssued, 9), note: "Pulmonology consult attended. Low clinical probability of malignancy." };
  faridaSteps[8] = { ...faridaSteps[8], status: "in-progress", dueAt: addDays(faridaIssued, 14) };

  cases.push({
    id: "CASE-008",
    organizationId: "org-apex",
    department: "Oncology",
    patientId: "P-1008",
    patientName: "Farida Khan",
    patientAge: 63,
    patientGender: "Female",
    patientPhone: "+1 (555) 907-0011",
    patientLanguage: "hi",
    program: "Cancer Screening Program",
    facility: "Apex Cancer Institute",
    screeningType: "Lung Nodule CT",
    pathwayType: "biopsy-referral",
    resultValue: "8mm non-calcified solid nodule, right middle lobe",
    resultInterpretation: "फेफड़े के स्कैन में एक छोटा निशान दिखा है। 3 से 6 महीने में दोबारा हल्के स्कैन से इसकी स्थिरता जांची जाएगी।",
    urgency: "high",
    status: "open",
    currentOwner: "usr_spec_maya",
    currentOwnerName: "Dr. Maya Lin, MD, FACS",
    currentOwnerRole: "specialist",
    isQueueOwner: false,
    nextAction: "Document 3-month follow-up CT surveillance order and complete case closure proof",
    nextActionDue: addDays(DEMO_BASE_DATE, 3),
    steps: faridaSteps,
    sideState: null,
    notifications: [
      {
        id: "notif-008-1",
        channel: "sms",
        to: "+1 (555) 907-0011",
        message: "CareLoop: आपके फेफड़े के स्कैन की समीक्षा डॉ. माया लिन द्वारा पूरी कर ली गई है।",
        status: "acknowledged",
        sentAt: addDays(faridaIssued, 6),
      },
    ],
    audit: [
      {
        id: "aud-008-1",
        caseId: "CASE-008",
        action: "Referral accepted by Specialist",
        fromStep: "referral",
        toStep: "accepted",
        owner: "Dr. Maya Lin, MD, FACS",
        ownerRole: "specialist",
        reason: "Accepted for Fleischer society guideline surveillance protocol.",
        timestamp: addDays(faridaIssued, 5),
      },
    ],
    consults: [],
    referral: {
      caseId: "CASE-008",
      patientId: "P-1008",
      patientName: "Farida Khan",
      resultSummary: "8mm solid non-calcified nodule on low-dose chest CT",
      history: "63yo female, former light smoker (10 pack-years, quit 15 years ago).",
      doneSoFar: "Diagnostic chest CT complete; clinical consult completed.",
      reasonForReferral: "Pulmonology evaluation and 3-month follow-up interval imaging protocol.",
      urgency: "high",
      specialtyRequired: "Pulmonology",
      status: "accepted",
      acceptedBy: "usr_spec_maya",
      acceptedByName: "Dr. Maya Lin, MD, FACS",
      acceptedAt: addDays(faridaIssued, 5),
    },
    aiSuggestedNextStep: "Attach Fleischer surveillance protocol note and complete case closure.",
    aiDelayRiskScore: 22,
    createdAt: faridaIssued,
  });

  // CASES 9 TO 50 (Deterministic, diverse patients and multi-tenant distribution)
  const patientProfiles: { name: string; age: number; gender: "Female" | "Male" | "Other"; lang: Lang; phone: string }[] = [
    { name: "Kavita Rao", age: 48, gender: "Female", lang: "hi", phone: "+1 (555) 901-1122" },
    { name: "Suresh Nair", age: 53, gender: "Male", lang: "ta", phone: "+1 (555) 902-2233" },
    { name: "Deepak Joshi", age: 46, gender: "Male", lang: "mr", phone: "+1 (555) 903-3344" },
    { name: "Lakshmi Raman", age: 58, gender: "Female", lang: "ta", phone: "+1 (555) 904-4455" },
    { name: "Sarah Jenkins", age: 41, gender: "Female", lang: "en", phone: "+1 (555) 905-5566" },
    { name: "Gautam Verma", age: 62, gender: "Male", lang: "hi", phone: "+1 (555) 906-6677" },
    { name: "Swati Kulkarni", age: 39, gender: "Female", lang: "mr", phone: "+1 (555) 907-7788" },
    { name: "Arun Varma", age: 67, gender: "Male", lang: "te", phone: "+1 (555) 908-8899" },
    { name: "Nandini Iyer", age: 44, gender: "Female", lang: "ta", phone: "+1 (555) 909-9900" },
    { name: "Manoj Patil", age: 51, gender: "Male", lang: "mr", phone: "+1 (555) 910-0011" },
    { name: "Pooja Hegde", age: 34, gender: "Female", lang: "te", phone: "+1 (555) 911-1122" },
    { name: "Arthur Pendelton", age: 72, gender: "Male", lang: "en", phone: "+1 (555) 912-2233" },
    { name: "Sunil Kadam", age: 64, gender: "Male", lang: "mr", phone: "+1 (555) 913-3344" },
    { name: "Kiran Murthy", age: 49, gender: "Male", lang: "te", phone: "+1 (555) 914-4455" },
  ];

  const screeningCycle = [
    "Mammogram",
    "HbA1c (Diabetes)",
    "Blood Pressure",
    "FIT / Colon Cancer",
    "Pap Smear",
    "Newborn Hearing Screen",
    "Lipid Panel",
    "Lung Nodule CT",
  ];

  const facilities = [
    "Apex Cancer Institute",
    "Apex Health Family Medicine Center",
    "Apex Heart & Vascular Center",
    "Apex Ambulatory Pavilion",
    "Apex Maternal & Child Health",
  ];

  const delayReasons = [
    "No contact / unreachable",
    "Transport / distance barrier",
    "Referral rejected",
    "Language navigation required",
    "Fear / anxiety",
    "Patient declined procedure",
    "Pre-authorization pending",
  ];

  // Assigned real clinical staff pool
  const staffPool: { id: string; name: string; role: Role; orgId: string }[] = [
    { id: "usr_coord_sarah", name: "Sarah Thompson, BSN, RN", role: "coordinator", orgId: "org-apex" },
    { id: "usr_clin_kenneth", name: "Dr. Kenneth Reynolds, MD", role: "clinician", orgId: "org-apex" },
    { id: "usr_spec_maya", name: "Dr. Maya Lin, MD, FACS", role: "specialist", orgId: "org-apex" },
    { id: "usr_hod_oncology", name: "Dr. Robert Vance, MD", role: "hod", orgId: "org-apex" },
    // A few cases assigned to Metro Health to demonstrate multi-tenant isolation
    { id: "usr_coord_jessica", name: "Jessica Taylor, RN", role: "coordinator", orgId: "org-metro" },
  ];

  for (let i = 8; i < 50; i++) {
    const caseNum = i + 1;
    const caseId = `CASE-${String(caseNum).padStart(3, "0")}`;
    const patientProfile = patientProfiles[(i - 8) % patientProfiles.length];
    const screeningType = screeningCycle[(i - 8) % screeningCycle.length];
    const config = screeningConfigs[screeningType];
    const facility = facilities[i % facilities.length];

    // Assign to Metro Health every 6th case for multi-tenancy verification, else Apex Health
    const isMetro = i % 6 === 0;
    const organizationId = isMetro ? "org-metro" : "org-apex";
    const assignedStaff = isMetro
      ? staffPool[4] // Jessica Taylor
      : staffPool[i % (staffPool.length - 1)];

    let status: "open" | "closed" = "open";
    let sideState: SideState = null;
    let urgency: Urgency = (i % 5 === 0) ? "urgent" : (i % 3 === 0) ? "high" : "routine";
    let closedBy: string | undefined;
    let closedByName: string | undefined;
    let closedAt: string | undefined;
    let closureEvidence: ClosureEvidence[] | undefined;
    let referral: Case["referral"];
    let ownerId = assignedStaff.id;
    let ownerName = assignedStaff.name;
    let ownerRole: Role | "triage-queue" = assignedStaff.role;
    let isQueue = false;
    let daysAgo = 2 + (i % 18);
    const issuedAt = addDays(DEMO_BASE_DATE, -daysAgo);
    let nextAction = "Review screening findings and confirm patient outreach";
    let nextActionDue = addDays(DEMO_BASE_DATE, (i % 4) - 1);
    let delayReason: string | undefined = delayReasons[i % delayReasons.length];

    if (i % 7 === 0) {
      // Fully closed
      status = "closed";
      sideState = null;
      closedBy = ownerId;
      closedByName = ownerName;
      closedAt = addDays(DEMO_BASE_DATE, -1);
      nextAction = "Loop Closed ✓ — Patient enrolled in maintenance surveillance";
      closureEvidence = [
        {
          type: "appointment-attended",
          description: "Clinical consultation attended with documented care management plan.",
          attachedBy: ownerId,
          attachedByName: closedByName,
          attachedAt: closedAt,
        },
      ];
      delayReason = undefined;
    } else if (i % 11 === 0) {
      // Unassigned in Triage Queue
      sideState = "unassigned";
      ownerId = config.queueId;
      ownerName = config.queueName;
      ownerRole = "triage-queue";
      isQueue = true;
      nextAction = `Awaiting coordinator assignment from ${config.queueName}`;
    } else if (i % 9 === 0) {
      // Overdue
      sideState = "overdue";
      nextActionDue = addDays(DEMO_BASE_DATE, -2);
      nextAction = "SLA breached: Action item overdue for clinical follow-up";
    } else if (i % 13 === 0) {
      // Rejected referral
      sideState = "rejected";
      nextAction = "Referral returned by specialist; alternative booking required";
      referral = {
        caseId,
        patientId: `P-${1000 + caseNum}`,
        patientName: patientProfile.name,
        resultSummary: `Actionable ${screeningType} finding`,
        history: `${patientProfile.age}yo, ${patientProfile.gender}, screening protocol.`,
        doneSoFar: "Diagnostic review completed.",
        reasonForReferral: `Specialty review for ${screeningType}`,
        urgency,
        specialtyRequired: config.specialty,
        status: "rejected",
        rejectReason: "Provider panel closed for routine bookings; re-route to secondary network.",
      };
    } else if (i % 17 === 0) {
      sideState = "escalated";
      urgency = "urgent";
      nextAction = "High-risk flag: Multi-attempt communication failure escalated to care coordinator";
    }

    const steps = createPathwaySteps(screeningType, issuedAt, ownerName);

    if (status === "closed") {
      steps.forEach((s) => {
        if (s.status !== "skipped") {
          s.status = "completed";
          s.timestamp = addDays(issuedAt, 2);
        }
      });
    } else {
      steps[1].status = "completed";
      steps[1].timestamp = addHours(issuedAt, 4);
      if (sideState !== "overdue" && sideState !== "unassigned") {
        steps[2].status = "completed";
        steps[2].timestamp = addDays(issuedAt, 1);
      }
    }

    cases.push({
      id: caseId,
      organizationId,
      department: config.department,
      patientId: `P-${1000 + caseNum}`,
      patientName: patientProfile.name,
      patientAge: patientProfile.age,
      patientGender: patientProfile.gender,
      patientPhone: patientProfile.phone,
      patientLanguage: patientProfile.lang,
      program: config.program,
      facility,
      screeningType,
      pathwayType: config.pathwayType,
      resultValue: `Actionable ${screeningType} finding`,
      resultInterpretation: `Screening report flagged an out-of-range value requiring clinical follow-up under ${config.program}.`,
      urgency,
      status,
      currentOwner: ownerId,
      currentOwnerName: ownerName,
      currentOwnerRole: ownerRole,
      isQueueOwner: isQueue,
      nextAction,
      nextActionDue,
      steps,
      sideState,
      notifications: [
        {
          id: `notif-${caseNum}-1`,
          channel: "sms",
          to: patientProfile.phone,
          message: `CareLoop: Important update regarding your ${screeningType} test from ${facility}.`,
          status: "delivered",
          sentAt: addHours(issuedAt, 4),
        },
      ],
      audit: [
        {
          id: `aud-${caseNum}-1`,
          caseId,
          action: "Screening report ingested",
          fromStep: undefined,
          toStep: "issued",
          owner: facility,
          ownerRole: "coordinator",
          reason: `Routine screening completed and delivered to ${ownerName}.`,
          timestamp: issuedAt,
        },
      ],
      consults: [],
      referral,
      closureEvidence,
      closedBy,
      closedByName,
      closedAt,
      closureReason: status === "closed" ? "Clinical closure verified by attending staff." : undefined,
      understandingScore: status === "closed" ? ((caseNum % 3) + 3) : undefined,
      confidenceScore: status === "closed" ? ((caseNum % 2) + 4) : undefined,
      createdAt: issuedAt,
      aiSuggestedNextStep: `Review active step and verify SLA timeline for ${screeningType}.`,
      aiDelayRiskScore: sideState ? 70 + (caseNum % 25) : 15 + (caseNum % 30),
      delayReasonPrimary: sideState ? delayReason : undefined,
    });
  }

  return cases;
})();

// CENTRALIZED TRANSITION ENGINE
export type TransitionInput = {
  caseId: string;
  toStep: StepKey;
  ownerId: string;
  ownerName: string;
  ownerRole: Role | "triage-queue";
  reason: string;
  note?: string;
  evidence?: ClosureEvidence[];
};

export const transitionCase = (
  c: Case,
  input: TransitionInput,
  timestamp = new Date().toISOString()
): Case => {
  const updated = { ...c, steps: [...c.steps], audit: [...c.audit] };
  const targetIdx = updated.steps.findIndex((s) => s.key === input.toStep);

  if (targetIdx === -1) {
    throw new Error(`Step '${input.toStep}' does not exist for case ${c.id}`);
  }

  const prevStep = updated.steps.find((s) => s.status === "in-progress") || updated.steps[targetIdx - 1];

  for (let i = 0; i <= targetIdx; i++) {
    if (updated.steps[i].status !== "skipped") {
      if (i === targetIdx) {
        updated.steps[i] = {
          ...updated.steps[i],
          status: "completed",
          owner: input.ownerName,
          ownerRole: input.ownerRole,
          timestamp,
          note: input.note || updated.steps[i].note,
        };
      } else if (updated.steps[i].status !== "completed") {
        updated.steps[i] = {
          ...updated.steps[i],
          status: "completed",
          timestamp,
        };
      }
    }
  }

  let nextStepIdx = targetIdx + 1;
  while (nextStepIdx < updated.steps.length && updated.steps[nextStepIdx].status === "skipped") {
    nextStepIdx++;
  }

  if (nextStepIdx < updated.steps.length) {
    updated.steps[nextStepIdx] = {
      ...updated.steps[nextStepIdx],
      status: "in-progress",
      dueAt: addHours(timestamp, updated.steps[nextStepIdx].slaHours || 48),
    };
    updated.nextActionDue = updated.steps[nextStepIdx].dueAt || addDays(timestamp, 2);
    updated.nextAction = `Pending: ${updated.steps[nextStepIdx].label}`;
  }

  if (input.ownerRole !== "patient") {
    updated.currentOwner = input.ownerId;
    updated.currentOwnerName = input.ownerName;
    updated.currentOwnerRole = input.ownerRole;
    updated.isQueueOwner = input.ownerRole === "triage-queue";
  }

  if (c.sideState === "escalated" || c.sideState === "overdue" || c.sideState === "unassigned") {
    updated.sideState = null;
  }

  if (input.toStep === "closed") {
    updated.status = "closed";
    updated.sideState = null;
    updated.closedBy = input.ownerId;
    updated.closedByName = input.ownerName;
    updated.closedAt = timestamp;
    updated.closureReason = input.reason;
    updated.nextAction = "Loop Closed ✓";
    if (input.evidence && input.evidence.length > 0) {
      updated.closureEvidence = [...(updated.closureEvidence || []), ...input.evidence];
    }
  }

  updated.audit.push({
    id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    caseId: updated.id,
    action: `Advanced to: ${updated.steps[targetIdx].label}`,
    fromStep: prevStep?.key,
    toStep: input.toStep,
    owner: input.ownerName,
    ownerRole: input.ownerRole,
    reason: input.reason,
    timestamp,
    metadata: input.note ? { note: input.note } : undefined,
  });

  return updated;
};
