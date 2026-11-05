import type { Role } from "@/types";

export type FeatureKey =
  | "admin-portal"
  | "user-management"
  | "org-management"
  | "security-audit"
  | "executive-kpis"
  | "department-oversight"
  | "sla-analytics"
  | "escalations"
  | "department-worklist"
  | "coordinator-caseload"
  | "specialist-referrals"
  | "clinical-triage"
  | "worklist"
  | "outreach"
  | "case-tracker"
  | "clinical-orders"
  | "consults"
  | "loop-closure"
  | "referrals"
  | "consult-inbox"
  | "biopsy-review"
  | "patient-view"
  | "acknowledgements"
  | "callbacks"
  | "appointments";

export type RolePermissionConfig = {
  role: Role;
  roleTitle: string;
  roleSubtitle: string;
  defaultPath: string;
  allowedFeatures: FeatureKey[];
  allowedPathPrefixes: string[];
};

export const ROLE_PERMISSIONS: Record<Role, RolePermissionConfig> = {
  master_admin: {
    role: "master_admin",
    roleTitle: "Master Administrator",
    roleSubtitle: "Enterprise System Governance & RBAC",
    defaultPath: "/admin",
    allowedFeatures: [
      "admin-portal",
      "user-management",
      "org-management",
      "security-audit",
      "executive-kpis",
      "department-oversight",
    ],
    allowedPathPrefixes: [
      "/admin",
      "/security",
      "/users",
      "/organizations",
    ],
  },
  director: {
    role: "director",
    roleTitle: "Executive Medical Director",
    roleSubtitle: "Organization-Wide Screening & SLA Oversight",
    defaultPath: "/director",
    allowedFeatures: [
      "executive-kpis",
      "department-oversight",
      "sla-analytics",
      "escalations",
      "worklist",
      "case-tracker",
    ],
    allowedPathPrefixes: [
      "/director",
      "/coordinator",
      "/case",
      "/referral",
    ],
  },
  hod: {
    role: "hod",
    roleTitle: "Head of Department (HOD)",
    roleSubtitle: "Department Caseload & Clinical Escalations",
    defaultPath: "/hod",
    allowedFeatures: [
      "department-worklist",
      "coordinator-caseload",
      "specialist-referrals",
      "clinical-triage",
      "case-tracker",
      "escalations",
    ],
    allowedPathPrefixes: [
      "/hod",
      "/coordinator",
      "/case",
      "/referral",
    ],
  },
  coordinator: {
    role: "coordinator",
    roleTitle: "Care Coordinator",
    roleSubtitle: "Patient Navigation, Triage & Outreach",
    defaultPath: "/coordinator",
    allowedFeatures: [
      "worklist",
      "outreach",
      "case-tracker",
      "patient-view",
      "appointments",
    ],
    allowedPathPrefixes: [
      "/coordinator",
      "/case",
      "/patient",
    ],
  },
  clinician: {
    role: "clinician",
    roleTitle: "Primary Clinician",
    roleSubtitle: "Diagnostic Orders, Specialist Consults & Loop Closure",
    defaultPath: "/case",
    allowedFeatures: [
      "case-tracker",
      "clinical-orders",
      "consults",
      "loop-closure",
      "worklist",
    ],
    allowedPathPrefixes: [
      "/case",
      "/coordinator",
    ],
  },
  specialist: {
    role: "specialist",
    roleTitle: "Specialist Clinician",
    roleSubtitle: "Referral Ingestion, Biopsy Review & Care Plans",
    defaultPath: "/referral",
    allowedFeatures: [
      "referrals",
      "consult-inbox",
      "biopsy-review",
      "case-tracker",
    ],
    allowedPathPrefixes: [
      "/referral",
      "/case",
    ],
  },
  patient: {
    role: "patient",
    roleTitle: "Patient / Family",
    roleSubtitle: "Plain-Language Results & Multilingual Care Journey",
    defaultPath: "/patient",
    allowedFeatures: [
      "patient-view",
      "acknowledgements",
      "callbacks",
      "appointments",
    ],
    allowedPathPrefixes: [
      "/patient",
    ],
  },
};

/**
 * Checks if a given pathname is permitted for a specific role.
 */
export const isPathAllowedForRole = (pathname: string, role: Role): boolean => {
  // Public routes (landing and login) are accessible to all or handled by router
  if (pathname === "/" || pathname === "/landing" || pathname === "/login") {
    return true;
  }

  const config = ROLE_PERMISSIONS[role];
  if (!config) return false;

  return config.allowedPathPrefixes.some((prefix) => pathname.startsWith(prefix));
};

/**
 * Checks if a feature key is allowed for a specific role.
 */
export const isFeatureAllowedForRole = (feature: FeatureKey, role: Role): boolean => {
  const config = ROLE_PERMISSIONS[role];
  if (!config) return false;
  return config.allowedFeatures.includes(feature);
};

/**
 * Returns default authorized landing route for a given role.
 */
export const getDefaultPathForRole = (role: Role): string => {
  return ROLE_PERMISSIONS[role]?.defaultPath || "/login";
};
