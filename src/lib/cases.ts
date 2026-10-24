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
} from "../types";
import { addDays, addHours } from "./utils";

// Fixed demo anchor time for reproducible deterministic data
export const DEMO_BASE_DATE = "2026-10-20T09:00:00Z";

export const allUsers: User[] = [
  {
    id: "u1",
    name: "Riya Sharma",
    role: "coordinator",
    facility: "City General Hospital",
    department: "Care Navigation & Community Outreach",
    email: "riya.sharma@careloop.health",
    phone: "+1 (555) 234-5671",
  },
  {
    id: "u2",
    name: "Dr. Arjun Mehta",
    role: "clinician",
    facility: "Northside Primary Care",
    department: "Family Medicine & Community Health",
    email: "dr.arjun.mehta@northside.health",
    phone: "+1 (555) 345-6782",
  },
  {
    id: "u3",
    name: "Dr. Fatima Al-Rashid",
    role: "specialist",
    facility: "Metro Oncology Center",
    department: "Breast & Surgical Oncology",
    email: "dr.fatima.alrashid@metroonco.org",
    phone: "+1 (555) 456-7893",
  },
  {
    id: "u4",
    name: "Dr. Omar Khalid",
    role: "specialist",
    facility: "Heart & Vascular Institute",
    department: "Cardiology & Vascular Medicine",
    email: "dr.omar.khalid@heartvasc.org",
    phone: "+1 (555) 567-8904",
  },
  {
    id: "u5",
    name: "Linda Chen",
    role: "admin",
    facility: "Regional Population Health Program",
    department: "Quality Assurance & Closed Loop Analytics",
    email: "linda.chen@healthauthority.gov",
    phone: "+1 (555) 678-9015",
  },
  {
    id: "u6",
    name: "Dr. Sneha Patil",
    role: "clinician",
    facility: "East Valley Primary Care",
    department: "Internal Medicine",
    email: "dr.sneha.patil@eastvalley.health",
    phone: "+1 (555) 789-0126",
  },
  {
    id: "u7",
    name: "Carlos Mendez",
    role: "coordinator",
    facility: "South County Community Health",
    department: "Patient Navigation",
    email: "carlos.mendez@southcounty.health",
    phone: "+1 (555) 890-1237",
  },
  {
    id: "u8",
    name: "Dr. David Okoro",
    role: "specialist",
    facility: "Pulmonary Specialists Group",
    department: "Pulmonology & Thoracic Care",
    email: "dr.david.okoro@pulmonaryspec.org",
    phone: "+1 (555) 901-2348",
  },
];

export const triageQueues = [
  { id: "queue-cancer", name: "Triage Queue - Cancer Screening", role: "triage-queue" as const },
  { id: "queue-metabolic", name: "Triage Queue - Diabetes & Hypertension", role: "triage-queue" as const },
  { id: "queue-mch", name: "Triage Queue - Maternal & Child Health", role: "triage-queue" as const },
  { id: "queue-cardio", name: "Triage Queue - Cardiovascular Risk", role: "triage-queue" as const },
];

export const findUserById = (id: string): User | undefined => {
  return allUsers.find((u) => u.id === id);
};

export const findOwnerDetails = (ownerId: string): { name: string; role: Role | "triage-queue"; isQueue: boolean } => {
  const user = allUsers.find((u) => u.id === ownerId);
  if (user) {
    return { name: user.name, role: user.role, isQueue: false };
  }
  const queue = triageQueues.find((q) => q.id === ownerId);
  if (queue) {
    return { name: queue.name, role: queue.role, isQueue: true };
  }
  return { name: ownerId, role: "coordinator", isQueue: false };
};

export const screeningConfigs: Record<
  string,
  {
    program: string;
    pathwayType: ClinicalPathwayType;
    specialty: string;
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
    needsConfirmation: false,
    needsReferral: false,
    defaultUrgency: "high",
    queueId: "queue-metabolic",
    queueName: "Triage Queue - Diabetes & Hypertension",
  },
  "FIT / Colon Cancer": {
    program: "Cancer Screening Program",
    pathwayType: "endoscopy-referral",
    specialty: "Gastroenterology",
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
  issuedBy = "Riya Sharma"
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
      label: config.pathwayType === "repeat-screen" ? "Repeat Screen Done" : "Confirmatory Test",
      status: "not-started",
      slaHours: 120, // 5 days
    });
  } else {
    steps.push({
      key: "confirmation",
      label: "Confirmatory Test (N/A)",
      status: "skipped",
      note: "Pathway skips separate confirmatory lab; direct primary clinician management.",
    });
  }

  if (config.needsReferral) {
    steps.push(
      {
        key: "referral",
        label: "Referral Sent",
        status: "not-started",
        slaHours: 48,
      },
      {
        key: "accepted",
        label: "Referral Accepted",
        status: "not-started",
        slaHours: 48,
      },
      {
        key: "booked",
        label: "Appointment Booked",
        status: "not-started",
        slaHours: 336, // 14 days
      },
      {
        key: "attended",
        label: "Appointment Attended",
        status: "not-started",
      }
    );
  } else {
    // For direct lifestyle/medication pathways (e.g. Hypertension, Lipids)
    steps.push(
      {
        key: "referral",
        label: "Referral Sent (Skipped)",
        status: "skipped",
        note: "Primary clinician directly manages treatment/surveillance without external referral.",
      },
      {
        key: "accepted",
        label: "Referral Accepted (Skipped)",
        status: "skipped",
      },
      {
        key: "booked",
        label: "Follow-up Booked",
        status: "not-started",
        slaHours: 336,
      },
      {
        key: "attended",
        label: "Follow-up Attended",
        status: "not-started",
      }
    );
  }

  steps.push(
    {
      key: "treatment",
      label: "Treatment / Surveillance",
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

// 50 DETERMINISTIC SEED CASES
export const seedCases: Case[] = (() => {
  const cases: Case[] = [];

  // 1. MARIA GONZALEZ (The 3-minute Demo Story Case)
  // Story: Abnormal Mammogram -> SMS sent -> Acknowledged missed (>72h) -> Escalated to coordinator Riya Sharma
  // Demo will resolve acknowledgement -> order confirmation -> referral to Dr. Fatima -> accept -> attend -> evidence -> close loop!
  const mariaIssued = addDays(DEMO_BASE_DATE, -4);
  const mariaSteps = createPathwaySteps("Mammogram", mariaIssued, "Riya Sharma");
  mariaSteps[1] = {
    ...mariaSteps[1],
    status: "completed",
    owner: "Riya Sharma",
    ownerRole: "coordinator",
    timestamp: addHours(mariaIssued, 2),
    note: "Digital notification delivered via SMS & bilingual patient portal release.",
  };
  mariaSteps[2] = {
    ...mariaSteps[2],
    status: "overdue",
    dueAt: addHours(mariaIssued, 74), // Overdue by ~22 hours
    note: "Patient has not responded or acknowledged. Multiple delivery attempts logged.",
  };

  cases.push({
    id: "CASE-001",
    patientId: "P-1001",
    patientName: "Maria Gonzalez",
    patientAge: 54,
    patientGender: "Female",
    patientPhone: "+1 (555) 019-4821",
    patientLanguage: "es",
    program: "Cancer Screening Program",
    facility: "Metro Oncology Center",
    screeningType: "Mammogram",
    pathwayType: "biopsy-referral",
    resultValue: "BI-RADS 4 - Suspicious microcalcifications in upper outer quadrant",
    resultInterpretation:
      "The mammogram shows an area that needs a closer look. In most women, this turns out not to be cancer, but a diagnostic ultrasound or biopsy is necessary to be certain.",
    urgency: "urgent",
    status: "open",
    currentOwner: "u1", // Riya Sharma owns the escalation
    currentOwnerName: "Riya Sharma",
    currentOwnerRole: "coordinator",
    isQueueOwner: false,
    nextAction: "Overdue acknowledgement: Contact patient via voice call fallback & coordinate diagnostic imaging",
    nextActionDue: addHours(DEMO_BASE_DATE, -6),
    steps: mariaSteps,
    sideState: "escalated",
    notifications: [
      {
        id: "notif-001-1",
        channel: "sms",
        to: "+1 (555) 019-4821",
        message: "CareLoop: Hola Maria, su resultado de mamografía está listo en su portal seguro. Por favor ingrese para confirmar.",
        status: "delivered",
        sentAt: addHours(mariaIssued, 2),
        deliveredAt: addHours(mariaIssued, 2.1),
        attemptNumber: 1,
      },
      {
        id: "notif-001-2",
        channel: "whatsapp",
        to: "+1 (555) 019-4821",
        message: "CareLoop: Recordatorio importante sobre su mamografía de Metro Oncology. Su equipo de cuidados necesita confirmar su lectura.",
        status: "delivered",
        sentAt: addDays(mariaIssued, 2),
        deliveredAt: addDays(mariaIssued, 2.1),
        attemptNumber: 2,
      },
      {
        id: "notif-001-3",
        channel: "voice",
        to: "+1 (555) 019-4821",
        message: "Automated CareLoop Voice Fallback: Important notification regarding your health screening.",
        status: "failed",
        sentAt: addDays(mariaIssued, 3),
        attemptNumber: 3,
      },
    ],
    audit: [
      {
        id: "aud-001-1",
        caseId: "CASE-001",
        action: "Screening result issued",
        fromStep: undefined,
        toStep: "issued",
        owner: "Radiology Department - Metro Oncology",
        ownerRole: "coordinator",
        reason: "Digital mammography flagged BI-RADS 4 suspicious finding.",
        timestamp: mariaIssued,
      },
      {
        id: "aud-001-2",
        caseId: "CASE-001",
        action: "Patient notified via SMS & Portal",
        fromStep: "issued",
        toStep: "notified",
        owner: "Riya Sharma",
        ownerRole: "coordinator",
        reason: "Patient communication triggered in Spanish language preference.",
        timestamp: addHours(mariaIssued, 2),
      },
      {
        id: "aud-001-3",
        caseId: "CASE-001",
        action: "Escalated to Care Coordinator",
        fromStep: "notified",
        toStep: "notified",
        owner: "CareLoop SLA Engine",
        ownerRole: "system",
        reason: "72-hour patient acknowledgement SLA breached. Flagged as urgent clinical risk.",
        timestamp: addDays(mariaIssued, 3),
      },
    ],
    consults: [
      {
        id: "cns-001",
        caseId: "CASE-001",
        from: "u2",
        fromName: "Dr. Arjun Mehta",
        fromRole: "clinician",
        to: "u3",
        toName: "Dr. Fatima Al-Rashid",
        toRole: "specialist",
        question: "Patient Maria Gonzalez has BI-RADS 4 calcifications. Do you advise direct ultrasound-guided core needle biopsy or diagnostic mammographic spot compression first?",
        urgency: "urgent",
        attachedResults: ["Mammogram BI-RADS 4", "Prior Mammogram 2024 (Normal)"],
        createdAt: addDays(DEMO_BASE_DATE, -1),
        response: "Recommend same-day diagnostic mammogram with spot compression + immediate ultrasound-guided core biopsy if finding persists.",
        respondedAt: addHours(DEMO_BASE_DATE, -10),
        outcomeNote: "Expedited biopsy protocol authorized by Dr. Fatima Al-Rashid.",
      },
    ],
    referral: {
      caseId: "CASE-001",
      patientId: "P-1001",
      patientName: "Maria Gonzalez",
      resultSummary: "BI-RADS 4 microcalcifications in left upper outer quadrant",
      history: "54yo female, G2P2, menopause at 51, no prior family history of breast cancer.",
      doneSoFar: "Screening mammogram complete; primary clinician consult completed with Dr. Fatima.",
      reasonForReferral: "Diagnostic breast ultrasound and possible biopsy for BI-RADS 4 finding.",
      urgency: "urgent",
      specialtyRequired: "Breast Oncology",
      status: "pending",
    },
    aiSuggestedNextStep: "Escalate to phone outreach; coordinate fast-track ultrasound biopsy slot with Dr. Fatima Al-Rashid.",
    aiDelayRiskScore: 88,
    delayReasonPrimary: "No contact / unreachable",
    createdAt: mariaIssued,
  });

  // 2. AHMED HASSAN - High HbA1c (Active in Progress, Referral Sent)
  const ahmedIssued = addDays(DEMO_BASE_DATE, -7);
  const ahmedSteps = createPathwaySteps("HbA1c (Diabetes)", ahmedIssued, "Dr. Arjun Mehta");
  ahmedSteps[1] = { ...ahmedSteps[1], status: "completed", owner: "Dr. Arjun Mehta", timestamp: addHours(ahmedIssued, 4) };
  ahmedSteps[2] = { ...ahmedSteps[2], status: "completed", owner: "Ahmed Hassan", timestamp: addDays(ahmedIssued, 1) };
  ahmedSteps[3] = { ...ahmedSteps[3], status: "completed", owner: "Northside Lab", timestamp: addDays(ahmedIssued, 3), note: "Repeat fasting glucose 218 mg/dL confirms uncontrolled DM2." };
  ahmedSteps[4] = { ...ahmedSteps[4], status: "completed", owner: "Dr. Arjun Mehta", timestamp: addDays(ahmedIssued, 4) };
  ahmedSteps[5] = { ...ahmedSteps[5], status: "in-progress", dueAt: addDays(ahmedIssued, 6) };

  cases.push({
    id: "CASE-002",
    patientId: "P-1002",
    patientName: "Ahmed Hassan",
    patientAge: 62,
    patientGender: "Male",
    patientPhone: "+1 (555) 912-3456",
    patientLanguage: "ar",
    program: "Diabetes Management Program",
    facility: "Northside Primary Care",
    screeningType: "HbA1c (Diabetes)",
    pathwayType: "metabolic-management",
    resultValue: "HbA1c 9.4% (Target < 7.0%)",
    resultInterpretation: "Your average blood sugar over the last 3 months is higher than the safe target. We need to optimize your medication and nutrition plan.",
    urgency: "high",
    status: "open",
    currentOwner: "u2",
    currentOwnerName: "Dr. Arjun Mehta",
    currentOwnerRole: "clinician",
    isQueueOwner: false,
    nextAction: "Awaiting specialist acceptance for comprehensive endocrinology care plan",
    nextActionDue: addDays(DEMO_BASE_DATE, 1),
    steps: ahmedSteps,
    sideState: null,
    notifications: [
      {
        id: "notif-002-1",
        channel: "whatsapp",
        to: "+1 (555) 912-3456",
        message: "كيرلوب: مرحبًا أحمد، نتيجة فحص السكر التراكمي متاحة الآن على بوابتك الطبية.",
        status: "acknowledged",
        sentAt: addHours(ahmedIssued, 4),
        deliveredAt: addHours(ahmedIssued, 4.2),
        acknowledgedAt: addDays(ahmedIssued, 1),
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
        owner: "Northside Primary Care Lab",
        ownerRole: "clinician",
        reason: "Routine quarterly HbA1c screening showed poor glycemic control.",
        timestamp: ahmedIssued,
      },
      {
        id: "aud-002-2",
        caseId: "CASE-002",
        action: "Referral submitted to Endocrinology",
        fromStep: "confirmation",
        toStep: "referral",
        owner: "Dr. Arjun Mehta",
        ownerRole: "clinician",
        reason: "Patient needs GLP-1/SGLT2 dual escalation.",
        timestamp: addDays(ahmedIssued, 4),
      },
    ],
    consults: [],
    referral: {
      caseId: "CASE-002",
      patientId: "P-1002",
      patientName: "Ahmed Hassan",
      resultSummary: "HbA1c 9.4%, Fasting Glucose 218 mg/dL",
      history: "62yo male with 8-year history of Type 2 DM, BMI 31, currently on Metformin 1000mg BID.",
      doneSoFar: "Confirmation lab complete; patient educated on signs of hypoglycemia.",
      reasonForReferral: "Advanced diabetes care & injectable medication titration.",
      urgency: "high",
      specialtyRequired: "Endocrinology",
      status: "pending",
    },
    aiSuggestedNextStep: "Send reminder to Endocrinology triage desk to review pending referral within 24 hours.",
    aiDelayRiskScore: 35,
    createdAt: ahmedIssued,
  });

  // 3. SITA DESAI - Elevated BP (Direct Lifestyle/Medication Pathway - FULLY CLOSED WITH EVIDENCE)
  const sitaIssued = addDays(DEMO_BASE_DATE, -12);
  const sitaSteps = createPathwaySteps("Blood Pressure", sitaIssued, "Dr. Sneha Patil");
  sitaSteps[1] = { ...sitaSteps[1], status: "completed", timestamp: addHours(sitaIssued, 2) };
  sitaSteps[2] = { ...sitaSteps[2], status: "completed", timestamp: addHours(sitaIssued, 6) };
  // steps 3, 4, 5 skipped per direct pathway
  sitaSteps[6] = { ...sitaSteps[6], status: "completed", timestamp: addDays(sitaIssued, 2), note: "In-clinic BP recheck booked" };
  sitaSteps[7] = { ...sitaSteps[7], status: "completed", timestamp: addDays(sitaIssued, 7), note: "Repeat BP 168/98 mmHg confirmed." };
  sitaSteps[8] = { ...sitaSteps[8], status: "completed", timestamp: addDays(sitaIssued, 8), note: "Started Amlodipine 5mg daily + DASH diet education." };
  sitaSteps[9] = {
    ...sitaSteps[9],
    status: "completed",
    owner: "Dr. Sneha Patil",
    ownerRole: "clinician",
    timestamp: addDays(sitaIssued, 10),
    note: "Loop closed. Follow-up BP 128/82 mmHg documented.",
  };

  cases.push({
    id: "CASE-003",
    patientId: "P-1003",
    patientName: "Sita Desai",
    patientAge: 58,
    patientGender: "Female",
    patientPhone: "+1 (555) 781-9922",
    patientLanguage: "hi",
    program: "Hypertension Control Program",
    facility: "East Valley Primary Care",
    screeningType: "Blood Pressure",
    pathwayType: "lifestyle-medication",
    resultValue: "Stage 2 HTN: 172/102 mmHg",
    resultInterpretation: "आपका ब्लड प्रेशर सामान्य से काफी अधिक है। समय पर दवा और देखभाल से दिल और गुर्दों को सुरक्षित रखा जा सकता है।",
    urgency: "urgent",
    status: "closed",
    currentOwner: "u6",
    currentOwnerName: "Dr. Sneha Patil",
    currentOwnerRole: "clinician",
    isQueueOwner: false,
    nextAction: "Loop Closed ✓ — Patient on maintenance surveillance (Next routine check in 3 months)",
    nextActionDue: addDays(DEMO_BASE_DATE, 60),
    steps: sitaSteps,
    sideState: null,
    notifications: [
      {
        id: "notif-003-1",
        channel: "sms",
        to: "+1 (555) 781-9922",
        message: "CareLoop: नमस्ते सीता जी, आपका बीपी परिणाम आ चुका है। कृपया अपने क्लिनिक से संपर्क करें।",
        status: "acknowledged",
        sentAt: addHours(sitaIssued, 2),
        acknowledgedAt: addHours(sitaIssued, 6),
      },
    ],
    audit: [
      {
        id: "aud-003-1",
        caseId: "CASE-003",
        action: "High BP recorded at community screening",
        fromStep: undefined,
        toStep: "issued",
        owner: "East Valley Mobile Van",
        ownerRole: "coordinator",
        reason: "Initial reading 172/102 confirmed twice 5 minutes apart.",
        timestamp: sitaIssued,
      },
      {
        id: "aud-003-2",
        caseId: "CASE-003",
        action: "Loop closed with verified evidence",
        fromStep: "treatment",
        toStep: "closed",
        owner: "Dr. Sneha Patil",
        ownerRole: "clinician",
        reason: "Patient responded to Amlodipine 5mg; 2-week follow-up BP 128/82 mmHg.",
        timestamp: addDays(sitaIssued, 10),
      },
    ],
    consults: [],
    closureEvidence: [
      {
        type: "treatment-started",
        description: "Initiated Amlodipine 5mg daily. Verified pharmacy dispensing and adherence.",
        attachedBy: "u6",
        attachedByName: "Dr. Sneha Patil",
        attachedAt: addDays(sitaIssued, 8),
      },
      {
        type: "appointment-attended",
        description: "Clinic follow-up attended on Oct 18. Vital signs stabilized at 128/82 mmHg.",
        attachedBy: "u6",
        attachedByName: "Dr. Sneha Patil",
        attachedAt: addDays(sitaIssued, 10),
      },
      {
        type: "surveillance-plan",
        description: "Enrolled in East Valley Home BP monitoring cohort. Quarterly nurse check-in scheduled.",
        attachedBy: "u6",
        attachedByName: "Dr. Sneha Patil",
        attachedAt: addDays(sitaIssued, 10),
      },
    ],
    closedBy: "u6",
    closedByName: "Dr. Sneha Patil",
    closedAt: addDays(sitaIssued, 10),
    closureReason: "Clinical goal achieved: Blood pressure brought under target with documented medication compliance and follow-up.",
    understandingScore: 5,
    confidenceScore: 5,
    createdAt: sitaIssued,
  });

  // 4. JAMES OKONKWO - Positive FIT (Rejected Referral Case)
  const jamesIssued = addDays(DEMO_BASE_DATE, -8);
  const jamesSteps = createPathwaySteps("FIT / Colon Cancer", jamesIssued, "Carlos Mendez");
  jamesSteps[1] = { ...jamesSteps[1], status: "completed", timestamp: addHours(jamesIssued, 2) };
  jamesSteps[2] = { ...jamesSteps[2], status: "completed", timestamp: addDays(jamesIssued, 1) };
  jamesSteps[4] = { ...jamesSteps[4], status: "completed", timestamp: addDays(jamesIssued, 3) }; // referral sent
  jamesSteps[5] = {
    ...jamesSteps[5],
    status: "overdue",
    dueAt: addDays(jamesIssued, 5),
    note: "Referral rejected by Metro Endoscopy Suite: Requires pre-authorization letter and renal panel.",
  };

  cases.push({
    id: "CASE-004",
    patientId: "P-1004",
    patientName: "James Okonkwo",
    patientAge: 56,
    patientGender: "Male",
    patientPhone: "+1 (555) 345-0987",
    patientLanguage: "en",
    program: "Cancer Screening Program",
    facility: "South County Community Health",
    screeningType: "FIT / Colon Cancer",
    pathwayType: "endoscopy-referral",
    resultValue: "Positive Occult Blood (FIT 180 ug Hb/g feces)",
    resultInterpretation: "The stool test detected traces of blood. This is not a cancer diagnosis, but a diagnostic colonoscopy is required to safely evaluate the source.",
    urgency: "urgent",
    status: "open",
    currentOwner: "u7",
    currentOwnerName: "Carlos Mendez",
    currentOwnerRole: "coordinator",
    isQueueOwner: false,
    nextAction: "Referral rejected: Obtain prior authorization form & resubmit to alternate endoscopy partner",
    nextActionDue: addDays(DEMO_BASE_DATE, -1),
    steps: jamesSteps,
    sideState: "rejected",
    notifications: [
      {
        id: "notif-004-1",
        channel: "sms",
        to: "+1 (555) 345-0987",
        message: "CareLoop: Your FIT screening returned positive. Our care team is coordinating your colonoscopy.",
        status: "read",
        sentAt: addHours(jamesIssued, 2),
      },
    ],
    audit: [
      {
        id: "aud-004-1",
        caseId: "CASE-004",
        action: "Referral rejected by receiving specialist",
        fromStep: "referral",
        toStep: "referral",
        owner: "Metro Endoscopy Scheduling",
        ownerRole: "specialist",
        reason: "Procedure rejected: Lacks HMO prior authorization code and recent serum creatinine.",
        timestamp: addDays(jamesIssued, 5),
      },
    ],
    consults: [],
    referral: {
      caseId: "CASE-004",
      patientId: "P-1004",
      patientName: "James Okonkwo",
      resultSummary: "Positive FIT (180 ug/g)",
      history: "56yo male, father had colon polyps at age 60, no prior colonoscopy.",
      doneSoFar: "FIT completed; patient advised on prep.",
      reasonForReferral: "Diagnostic colonoscopy for positive fecal immunochemical screening.",
      urgency: "urgent",
      specialtyRequired: "Gastroenterology",
      status: "rejected",
      rejectReason: "Endoscopy schedule full & missing insurance pre-authorization documentation.",
    },
    aiSuggestedNextStep: "Trigger instant re-referral packet to Valley Gastro Group with attached pre-auth template.",
    aiDelayRiskScore: 92,
    delayReasonPrimary: "Referral rejected",
    createdAt: jamesIssued,
  });

  // 5. PRIYA NAIR - Abnormal Pap Smear (UNASSIGNED Case in Triage Queue)
  const priyaIssued = addDays(DEMO_BASE_DATE, -2);
  const priyaSteps = createPathwaySteps("Pap Smear", priyaIssued, "Central Cytology Lab");

  cases.push({
    id: "CASE-005",
    patientId: "P-1005",
    patientName: "Priya Nair",
    patientAge: 34,
    patientGender: "Female",
    patientPhone: "+1 (555) 671-8833",
    patientLanguage: "en",
    program: "Women's Health Program",
    facility: "City General Hospital",
    screeningType: "Pap Smear",
    pathwayType: "biopsy-referral",
    resultValue: "ASC-US with high-risk HPV positive",
    resultInterpretation: "Your Pap smear showed mild cellular changes along with HPV. This is very common and usually clears with minor treatment, but needs colposcopy follow-up.",
    urgency: "high",
    status: "open",
    currentOwner: "queue-cancer", // Accountable triage queue!
    currentOwnerName: "Triage Queue - Cancer Screening",
    currentOwnerRole: "triage-queue",
    isQueueOwner: true,
    nextAction: "Unassigned case: Triage supervisor must assign dedicated coordinator within SLA",
    nextActionDue: addDays(DEMO_BASE_DATE, 0),
    steps: priyaSteps,
    sideState: "unassigned",
    notifications: [],
    audit: [
      {
        id: "aud-005-1",
        caseId: "CASE-005",
        action: "Abnormal result entered triage queue",
        fromStep: undefined,
        toStep: "issued",
        owner: "Central Cytology Lab",
        ownerRole: "system",
        reason: "Electronic lab HL7 feed ingested abnormal cervical cytology result.",
        timestamp: priyaIssued,
      },
    ],
    consults: [],
    aiSuggestedNextStep: "Assign immediately to Care Coordinator Riya Sharma based on current capacity.",
    aiDelayRiskScore: 68,
    delayReasonPrimary: "Language barrier",
    createdAt: priyaIssued,
  });

  // 6. BABY AL-MANSOURI - Newborn Hearing Screen (Repeat Screen Pathway - FULLY CLOSED)
  const babyIssued = addDays(DEMO_BASE_DATE, -20);
  const babySteps = createPathwaySteps("Newborn Hearing Screen", babyIssued, "Maternity Ward Audiology");
  babySteps[1] = { ...babySteps[1], status: "completed", timestamp: addHours(babyIssued, 3) };
  babySteps[2] = { ...babySteps[2], status: "completed", timestamp: addHours(babyIssued, 8) };
  babySteps[3] = { ...babySteps[3], status: "completed", timestamp: addDays(babyIssued, 10), note: "Repeat ABR test passed bilaterally at 30 dB nHL." };
  babySteps[4] = { ...babySteps[4], status: "skipped", note: "No audiology referral needed as repeat screen passed." };
  babySteps[5] = { ...babySteps[5], status: "skipped" };
  babySteps[6] = { ...babySteps[6], status: "skipped" };
  babySteps[7] = { ...babySteps[7], status: "completed", timestamp: addDays(babyIssued, 10) };
  babySteps[8] = { ...babySteps[8], status: "completed", timestamp: addDays(babyIssued, 12), note: "Developmental surveillance plan established." };
  babySteps[9] = { ...babySteps[9], status: "completed", owner: "Riya Sharma", ownerRole: "coordinator", timestamp: addDays(babyIssued, 14) };

  cases.push({
    id: "CASE-006",
    patientId: "P-1006",
    patientName: "Baby Al-Mansouri",
    patientAge: 0,
    patientGender: "Male",
    patientPhone: "+1 (555) 888-2341",
    patientLanguage: "ar",
    program: "Maternal & Child Health",
    facility: "City General Hospital",
    screeningType: "Newborn Hearing Screen",
    pathwayType: "repeat-screen",
    resultValue: "Refer (Unilateral - Right Ear)",
    resultInterpretation: "The newborn screen did not record a clear signal in the right ear. This is very common right after birth due to fluid. A repeat screen confirmed normal hearing.",
    urgency: "routine",
    status: "closed",
    currentOwner: "u1",
    currentOwnerName: "Riya Sharma",
    currentOwnerRole: "coordinator",
    isQueueOwner: false,
    nextAction: "Loop Closed ✓ — Surveillance plan documented for 6-month developmental milestone check",
    nextActionDue: addDays(DEMO_BASE_DATE, 90),
    steps: babySteps,
    sideState: null,
    notifications: [
      {
        id: "notif-006-1",
        channel: "whatsapp",
        to: "+1 (555) 888-2341",
        message: "CareLoop: تم إغلاق ملف متابعة السمع لطفلك بنجاح بعد التأكد من سلامة السمع تمامًا.",
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
        owner: "Riya Sharma",
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
        attachedBy: "u1",
        attachedByName: "Riya Sharma",
        attachedAt: addDays(babyIssued, 14),
      },
    ],
    closedBy: "u1",
    closedByName: "Riya Sharma",
    closedAt: addDays(babyIssued, 14),
    closureReason: "Repeat screening resolved anomaly; infant hearing confirmed normal.",
    understandingScore: 5,
    confidenceScore: 5,
    createdAt: babyIssued,
  });

  // 7. ROBERT CHEN - Elevated Lipid Panel (Overdue Case)
  const robertIssued = addDays(DEMO_BASE_DATE, -6);
  const robertSteps = createPathwaySteps("Lipid Panel", robertIssued, "Dr. Sneha Patil");
  robertSteps[1] = { ...robertSteps[1], status: "completed", timestamp: addHours(robertIssued, 3) };
  robertSteps[2] = { ...robertSteps[2], status: "overdue", dueAt: addHours(robertIssued, 75) };

  cases.push({
    id: "CASE-007",
    patientId: "P-1007",
    patientName: "Robert Chen",
    patientAge: 49,
    patientGender: "Male",
    patientPhone: "+1 (555) 443-8910",
    patientLanguage: "en",
    program: "Cardiovascular Risk Prevention",
    facility: "Northside Primary Care",
    screeningType: "Lipid Panel",
    pathwayType: "lifestyle-medication",
    resultValue: "LDL-C 194 mg/dL, Triglycerides 280 mg/dL",
    resultInterpretation: "Your bad cholesterol (LDL) is very high, putting extra strain on your blood vessels. Medication and dietary adjustments are recommended.",
    urgency: "high",
    status: "open",
    currentOwner: "u6",
    currentOwnerName: "Dr. Sneha Patil",
    currentOwnerRole: "clinician",
    isQueueOwner: false,
    nextAction: "Overdue acknowledgement: Nudge patient via WhatsApp / phone call to initiate statin therapy",
    nextActionDue: addDays(DEMO_BASE_DATE, -2),
    steps: robertSteps,
    sideState: "overdue",
    notifications: [
      {
        id: "notif-007-1",
        channel: "sms",
        to: "+1 (555) 443-8910",
        message: "CareLoop: Your lipid panel results are ready. Please review in your patient portal.",
        status: "delivered",
        sentAt: addHours(robertIssued, 3),
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
        timestamp: addDays(robertIssued, 3),
      },
    ],
    consults: [],
    aiSuggestedNextStep: "Send automated WhatsApp nudge and queue outreach callback.",
    aiDelayRiskScore: 74,
    delayReasonPrimary: "Fear / anxiety",
    createdAt: robertIssued,
  });

  // 8. FATIMA AL-SAYED - Lung Nodule CT (Accepted Referral, Appointment Attended)
  const fatimaIssued = addDays(DEMO_BASE_DATE, -11);
  const fatimaSteps = createPathwaySteps("Lung Nodule CT", fatimaIssued, "Dr. David Okoro");
  fatimaSteps[1] = { ...fatimaSteps[1], status: "completed", timestamp: addHours(fatimaIssued, 3) };
  fatimaSteps[2] = { ...fatimaSteps[2], status: "completed", timestamp: addDays(fatimaIssued, 1) };
  fatimaSteps[3] = { ...fatimaSteps[3], status: "completed", timestamp: addDays(fatimaIssued, 3), note: "High-resolution thin slice CT confirmed 8mm solid nodule in right middle lobe." };
  fatimaSteps[4] = { ...fatimaSteps[4], status: "completed", timestamp: addDays(fatimaIssued, 4) };
  fatimaSteps[5] = { ...fatimaSteps[5], status: "completed", owner: "Dr. David Okoro", timestamp: addDays(fatimaIssued, 5) };
  fatimaSteps[6] = { ...fatimaSteps[6], status: "completed", timestamp: addDays(fatimaIssued, 6) };
  fatimaSteps[7] = { ...fatimaSteps[7], status: "completed", owner: "Dr. David Okoro", timestamp: addDays(fatimaIssued, 9), note: "Pulmonology consult attended. Low clinical probability of malignancy." };
  fatimaSteps[8] = { ...fatimaSteps[8], status: "in-progress", dueAt: addDays(fatimaIssued, 14) };

  cases.push({
    id: "CASE-008",
    patientId: "P-1008",
    patientName: "Fatima Al-Sayed",
    patientAge: 61,
    patientGender: "Female",
    patientPhone: "+1 (555) 772-1109",
    patientLanguage: "ar",
    program: "Cancer Screening Program",
    facility: "Metro Oncology Center",
    screeningType: "Lung Nodule CT",
    pathwayType: "biopsy-referral",
    resultValue: "8mm non-calcified solid nodule, right middle lobe",
    resultInterpretation: "A small spot was detected on your lung scan. Most nodules are harmless scars from past infections, but surveillance is required.",
    urgency: "high",
    status: "open",
    currentOwner: "u8",
    currentOwnerName: "Dr. David Okoro",
    currentOwnerRole: "specialist",
    isQueueOwner: false,
    nextAction: "Document 3-month follow-up CT surveillance order and sign off closure evidence",
    nextActionDue: addDays(DEMO_BASE_DATE, 3),
    steps: fatimaSteps,
    sideState: null,
    notifications: [
      {
        id: "notif-008-1",
        channel: "sms",
        to: "+1 (555) 772-1109",
        message: "كيرلوب: تم تأكيد موعدك مع د. ديفيد أوكورو يوم الإثنين القادم.",
        status: "acknowledged",
        sentAt: addDays(fatimaIssued, 6),
      },
    ],
    audit: [
      {
        id: "aud-008-1",
        caseId: "CASE-008",
        action: "Referral accepted by Specialist",
        fromStep: "referral",
        toStep: "accepted",
        owner: "Dr. David Okoro",
        ownerRole: "specialist",
        reason: "Accepted for Fleischer society guideline surveillance protocol.",
        timestamp: addDays(fatimaIssued, 5),
      },
    ],
    consults: [],
    referral: {
      caseId: "CASE-008",
      patientId: "P-1008",
      patientName: "Fatima Al-Sayed",
      resultSummary: "8mm solid non-calcified nodule on low-dose chest CT",
      history: "61yo female, former light smoker (10 pack-years, quit 15 years ago).",
      doneSoFar: "Diagnostic chest CT complete; clinical consult completed.",
      reasonForReferral: "Pulmonology evaluation and 3-month follow-up interval imaging protocol.",
      urgency: "high",
      specialtyRequired: "Pulmonology",
      status: "accepted",
      acceptedBy: "u8",
      acceptedByName: "Dr. David Okoro",
      acceptedAt: addDays(fatimaIssued, 5),
    },
    aiSuggestedNextStep: "Attach Fleischer surveillance protocol note and complete case closure.",
    aiDelayRiskScore: 20,
    createdAt: fatimaIssued,
  });

  // FILLER CASES 9 TO 50 (Deterministic, Diverse, Statistically balanced)
  const patientProfiles = [
    { name: "Ananya Sharma", age: 46, gender: "Female" as const, lang: "hi" as const, phone: "+1 (555) 901-1122" },
    { name: "Miguel Ramirez", age: 52, gender: "Male" as const, lang: "es" as const, phone: "+1 (555) 902-2233" },
    { name: "Zainab Al-Farsi", age: 39, gender: "Female" as const, lang: "ar" as const, phone: "+1 (555) 903-3344" },
    { name: "Sunil Kadam", age: 64, gender: "Male" as const, lang: "mr" as const, phone: "+1 (555) 904-4455" },
    { name: "Sarah Jenkins", age: 41, gender: "Female" as const, lang: "en" as const, phone: "+1 (555) 905-5566" },
    { name: "Kavita Rao", age: 50, gender: "Female" as const, lang: "hi" as const, phone: "+1 (555) 906-6677" },
    { name: "Baby Noah Campbell", age: 0, gender: "Male" as const, lang: "en" as const, phone: "+1 (555) 907-7788" },
    { name: "Elena Rostova", age: 67, gender: "Female" as const, lang: "en" as const, phone: "+1 (555) 908-8899" },
    { name: "Tariq Mansoor", age: 58, gender: "Male" as const, lang: "ar" as const, phone: "+1 (555) 909-9900" },
    { name: "Deepak Joshi", age: 48, gender: "Male" as const, lang: "mr" as const, phone: "+1 (555) 910-0011" },
    { name: "Alejandro Morales", age: 63, gender: "Male" as const, lang: "es" as const, phone: "+1 (555) 911-1122" },
    { name: "Pooja Hegde", age: 32, gender: "Female" as const, lang: "hi" as const, phone: "+1 (555) 912-2233" },
    { name: "Arthur Pendelton", age: 72, gender: "Male" as const, lang: "en" as const, phone: "+1 (555) 913-3344" },
    { name: "Nadia Nour", age: 44, gender: "Female" as const, lang: "ar" as const, phone: "+1 (555) 914-4455" },
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
    "City General Hospital",
    "Northside Primary Care",
    "Metro Oncology Center",
    "Heart & Vascular Institute",
    "East Valley Primary Care",
    "South County Community Health",
  ];

  const delayReasons = [
    "No contact / unreachable",
    "Transport / cost",
    "Referral rejected",
    "Language barrier",
    "Fear / anxiety",
    "Patient declined",
    "Pre-authorization pending",
  ];

  for (let i = 8; i < 50; i++) {
    const caseNum = i + 1;
    const caseId = `CASE-${String(caseNum).padStart(3, "0")}`;
    const patientProfile = patientProfiles[(i - 8) % patientProfiles.length];
    const screeningType = screeningCycle[(i - 8) % screeningCycle.length];
    const config = screeningConfigs[screeningType];
    const facility = facilities[i % facilities.length];

    // Determine state distribution
    let status: "open" | "closed" = "open";
    let sideState: SideState = null;
    let urgency: Urgency = (i % 5 === 0) ? "urgent" : (i % 3 === 0) ? "high" : "routine";
    let closedBy: string | undefined;
    let closedByName: string | undefined;
    let closedAt: string | undefined;
    let closureEvidence: ClosureEvidence[] | undefined;
    let referral: Case["referral"];
    let ownerId = allUsers[i % allUsers.length].id;
    let ownerRole: Role | "triage-queue" = allUsers[i % allUsers.length].role;
    let isQueue = false;
    let daysAgo = 2 + (i % 18);
    const issuedAt = addDays(DEMO_BASE_DATE, -daysAgo);
    let nextAction = "Review screening findings and confirm outreach";
    let nextActionDue = addDays(DEMO_BASE_DATE, (i % 4) - 1);
    let delayReason: string | undefined = delayReasons[i % delayReasons.length];

    // Specific deterministic distributions:
    if (i % 7 === 0) {
      // Fully closed
      status = "closed";
      sideState = null;
      closedBy = ownerId;
      closedByName = allUsers[i % allUsers.length].name;
      closedAt = addDays(DEMO_BASE_DATE, -1);
      nextAction = "Loop Closed ✓ — Patient entered into maintenance care protocol";
      closureEvidence = [
        {
          type: "appointment-attended",
          description: "Follow-up clinical consultation documented with clear management plan.",
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
      // Escalated
      sideState = "escalated";
      urgency = "urgent";
      nextAction = "High-risk flag: Multi-attempt communication failure escalated to nurse coordinator";
    } else if (i % 19 === 0) {
      // Patient declined
      sideState = "patient-declined";
      nextAction = "Patient declined recommended procedure; clinician documentation required";
    } else if (i % 23 === 0) {
      // Lost to follow-up
      sideState = "lost-to-follow-up";
      nextAction = "Certified outreach letter sent; pending case closure documentation";
    }

    const steps = createPathwaySteps(screeningType, issuedAt, allUsers[i % allUsers.length].name);

    // Progress steps proportionally to age of case
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

    const ownerDetails = findOwnerDetails(ownerId);

    cases.push({
      id: caseId,
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
      resultValue: `Abnormal / Actionable ${screeningType}`,
      resultInterpretation: `Screening report flagged an out-of-range value requiring clinical follow-up under ${config.program}.`,
      urgency,
      status,
      currentOwner: ownerId,
      currentOwnerName: ownerDetails.name,
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
          message: `CareLoop: Important update regarding your ${screeningType} test.`,
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
          reason: `Routine screening completed and delivered to ${ownerDetails.name}.`,
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

  // Mark all steps up to targetStep as completed (unless skipped)
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

  // Activate next un-skipped step
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

  // Case ownership update
  updated.currentOwner = input.ownerId;
  updated.currentOwnerName = input.ownerName;
  updated.currentOwnerRole = input.ownerRole;
  updated.isQueueOwner = input.ownerRole === "triage-queue";

  // Side-state automatic resolution
  if (c.sideState === "escalated" || c.sideState === "overdue" || c.sideState === "unassigned") {
    updated.sideState = null;
  }

  // Loop closure handling
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

  // Immutable audit log
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
