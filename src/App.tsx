import * as React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Login } from "@/pages/Login";
import { PublicLanding } from "@/pages/PublicLanding";
import { DirectorDashboard } from "@/pages/DirectorDashboard";
import { HodDashboard } from "@/pages/HodDashboard";
import { CoordinatorWorklist } from "@/pages/CoordinatorWorklist";
import { CaseDetail } from "@/pages/CaseDetail";
import { PatientView } from "@/pages/PatientView";
import { ReferralInbox } from "@/pages/ReferralInbox";
import { AdminDashboard } from "@/pages/AdminDashboard";

const DEFAULT_CASE_ID = "CASE-001";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLanding />} />
        <Route path="/landing" element={<PublicLanding />} />
        <Route path="/login" element={<Login />} />

        {/* Authenticated Protected Workspaces */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Master System Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/organizations" element={<Navigate to="/admin?tab=organizations" replace />} />
          <Route path="/users" element={<Navigate to="/admin?tab=users" replace />} />
          <Route path="/security" element={<Navigate to="/admin?tab=security" replace />} />

          {/* Executive Medical Director / Dean */}
          <Route path="/director" element={<DirectorDashboard />} />

          {/* Head of Department (HOD) */}
          <Route path="/hod" element={<HodDashboard />} />

          {/* Care Coordinator Worklist */}
          <Route path="/coordinator" element={<CoordinatorWorklist />} />

          {/* Clinical Review & Orders */}
          <Route path="/case" element={<Navigate to={`/case/${DEFAULT_CASE_ID}`} replace />} />
          <Route path="/case/:caseId" element={<CaseDetail />} />

          {/* Specialist Referral Inbox */}
          <Route path="/referral" element={<ReferralInbox />} />

          {/* Multilingual Patient Portal */}
          <Route path="/patient" element={<Navigate to={`/patient/${DEFAULT_CASE_ID}`} replace />} />
          <Route path="/patient/:caseId" element={<PatientView />} />

          {/* Catch-all for authenticated shell */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
