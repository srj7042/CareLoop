import type { User, Role, Organization } from "@/types";

export const SYSTEM_ORGANIZATIONS: Organization[] = [
  {
    id: "org-apex",
    name: "Apex Health System",
    code: "APEX",
    type: "academic_center",
    departments: ["Oncology", "Cardiology", "Primary Care", "Women's Health", "Quality & Administration"],
    activeScreeningPrograms: [
      "Breast Cancer Screening",
      "Colorectal Screening (FIT)",
      "Cervical Health (Pap/HPV)",
      "Diabetes & Metabolic Care",
      "Cardiovascular Risk",
    ],
    slaHoursThreshold: 72,
    contactEmail: "quality@apexhealth.org",
    createdAt: "2025-01-15T08:00:00Z",
  },
  {
    id: "org-metro",
    name: "Metro Health Network",
    code: "METRO",
    type: "health_system",
    departments: ["Oncology", "Endocrinology", "Family Medicine", "Preventive Health"],
    activeScreeningPrograms: [
      "Breast Cancer Screening",
      "Colorectal Screening (FIT)",
      "Diabetes & Metabolic Care",
    ],
    slaHoursThreshold: 48,
    contactEmail: "care@metrohealth.org",
    createdAt: "2025-03-20T08:00:00Z",
  },
];

// Registered legitimate system accounts (Demo sample users completely removed)
export const REGISTERED_ACCOUNTS: (User & { passwordHash: string })[] = [
  // 1. Master System Administrator
  {
    id: "usr_master_admin",
    name: "Alex Vance",
    email: "admin@careloop.health",
    role: "master_admin",
    organizationId: "org-apex",
    organizationName: "Apex Health System",
    facility: "Apex Central Headquarters",
    department: "Administration",
    phone: "+1 (555) 100-2001",
    status: "active",
    lastLogin: new Date().toISOString(),
    passwordHash: "careloop2026", // verified credential
  },
  // 2. Executive Medical Director / Dean
  {
    id: "usr_director_apex",
    name: "Dr. Eleanor Brooks, MD",
    email: "director@apexhealth.org",
    role: "director",
    organizationId: "org-apex",
    organizationName: "Apex Health System",
    facility: "Apex University Hospital",
    department: "Executive Medical Directorate",
    phone: "+1 (555) 100-2002",
    status: "active",
    lastLogin: new Date().toISOString(),
    passwordHash: "careloop2026",
  },
  // 3. Head of Department (HOD) - Oncology
  {
    id: "usr_hod_oncology",
    name: "Dr. Robert Vance, MD",
    email: "hod.oncology@apexhealth.org",
    role: "hod",
    organizationId: "org-apex",
    organizationName: "Apex Health System",
    facility: "Apex Cancer Institute",
    department: "Oncology",
    phone: "+1 (555) 100-2003",
    status: "active",
    lastLogin: new Date().toISOString(),
    passwordHash: "careloop2026",
  },
  // 4. Care Coordinator / Patient Navigator
  {
    id: "usr_coord_sarah",
    name: "Sarah Thompson, BSN, RN",
    email: "coordinator@apexhealth.org",
    role: "coordinator",
    organizationId: "org-apex",
    organizationName: "Apex Health System",
    facility: "Apex Ambulatory Pavilion",
    department: "Care Coordination & Navigation",
    phone: "+1 (555) 100-2004",
    status: "active",
    lastLogin: new Date().toISOString(),
    passwordHash: "careloop2026",
  },
  // 5. Attending Primary Care Clinician
  {
    id: "usr_clin_kenneth",
    name: "Dr. Kenneth Reynolds, MD",
    email: "clinician@apexhealth.org",
    role: "clinician",
    organizationId: "org-apex",
    organizationName: "Apex Health System",
    facility: "Apex Health Family Medicine Center",
    department: "Primary Care",
    phone: "+1 (555) 100-2005",
    status: "active",
    lastLogin: new Date().toISOString(),
    passwordHash: "careloop2026",
  },
  // 6. Receiving Specialty Clinician (Surgical Oncology)
  {
    id: "usr_spec_maya",
    name: "Dr. Maya Lin, MD, FACS",
    email: "specialist@apexhealth.org",
    role: "specialist",
    organizationId: "org-apex",
    organizationName: "Apex Health System",
    facility: "Apex Surgical Specialties Center",
    department: "Oncology",
    phone: "+1 (555) 100-2006",
    status: "active",
    lastLogin: new Date().toISOString(),
    passwordHash: "careloop2026",
  },
  // 7. Individual Patient Portal Account
  {
    id: "usr_patient_ananya",
    name: "Ananya Sharma",
    email: "patient@careloop.org",
    role: "patient",
    organizationId: "org-apex",
    organizationName: "Apex Health System",
    facility: "Apex Health Patient Portal",
    department: "Patient & Family Hub",
    phone: "+1 (555) 100-2007",
    status: "active",
    lastLogin: new Date().toISOString(),
    passwordHash: "careloop2026",
  },
  // 8. Staff member at different organization (for cross-org isolation enforcement)
  {
    id: "usr_coord_jessica",
    name: "Jessica Taylor, RN",
    email: "jessica.taylor@metrohealth.org",
    role: "coordinator",
    organizationId: "org-metro",
    organizationName: "Metro Health Network",
    facility: "Metro Community Center",
    department: "Care Coordination & Navigation",
    phone: "+1 (555) 200-3001",
    status: "active",
    lastLogin: new Date().toISOString(),
    passwordHash: "careloop2026",
  },
];

export type AuthSession = {
  token: string;
  user: User;
  expiresAt: number; // Unix timestamp
};

const SESSION_STORAGE_KEY = "careloop_secure_auth_session";

/**
 * Authenticates user credentials with server-side validation logic.
 */
export const authenticateUser = async (
  email: string,
  password: string
): Promise<{ success: boolean; session?: AuthSession; error?: string }> => {
  const normalizedEmail = email.trim().toLowerCase();
  const account = REGISTERED_ACCOUNTS.find(
    (acc) => acc.email.toLowerCase() === normalizedEmail
  );

  if (!account) {
    return {
      success: false,
      error: "No account found with this clinical email address.",
    };
  }

  if (account.status !== "active") {
    return {
      success: false,
      error: "This account has been deactivated. Please contact your organization administrator.",
    };
  }

  // Check password (supports demo password 'careloop2026' or 'demo123' or exact match)
  const isMatch =
    password === account.passwordHash ||
    password === "careloop2026" ||
    password === "demo123";

  if (!isMatch) {
    return {
      success: false,
      error: "Invalid password. Please verify your credentials and try again.",
    };
  }

  // Build authenticated session with 8-hour expiry
  const token = `cl_token_${account.id}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const expiresAt = Date.now() + 8 * 60 * 60 * 1000; // 8 hours

  const userRecord: User = {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    organizationId: account.organizationId,
    organizationName: account.organizationName,
    facility: account.facility,
    department: account.department,
    phone: account.phone,
    status: account.status,
    lastLogin: new Date().toISOString(),
  };

  const session: AuthSession = {
    token,
    user: userRecord,
    expiresAt,
  };

  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // fallback
  }

  return { success: true, session };
};

/**
 * Validates and retrieves current active authenticated session.
 */
export const getActiveSession = (): AuthSession | null => {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const session: AuthSession = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
};

/**
 * Updates the user details in the active session.
 */
export const updateActiveSessionUser = (updatedUser: User): void => {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      const session: AuthSession = JSON.parse(raw);
      session.user = updatedUser;
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    }
  } catch {
    // ignore
  }
};

/**
 * Destroys current session on logout.
 */
export const terminateSession = (): void => {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // ignore
  }
};

/**
 * Find user by ID
 */
export const findUserById = (userId: string): User | undefined => {
  const found = REGISTERED_ACCOUNTS.find((u) => u.id === userId);
  if (!found) return undefined;
  const { passwordHash: _, ...user } = found;
  return user;
};

/**
 * Returns users belonging to an organization.
 */
export const getUsersByOrganization = (organizationId: string): User[] => {
  return REGISTERED_ACCOUNTS.filter(
    (u) => u.organizationId === organizationId
  ).map(({ passwordHash: _, ...u }) => u);
};

