import * as React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Login } from "@/pages/Login";
import { PublicLanding } from "@/pages/PublicLanding";
import { AboutUs } from "@/pages/AboutUs";
import { ContactUs } from "@/pages/ContactUs";
import { HelpCenter } from "@/pages/HelpCenter";
import { PrivacyPolicy } from "@/pages/PrivacyPolicy";
import { TermsOfService } from "@/pages/TermsOfService";
import { NotFound } from "@/pages/NotFound";
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
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public Trust & Discovery Routes */}
          <Route path="/" element={<PublicLanding />} />
          <Route path="/landing" element={<PublicLanding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/404" element={<NotFound />} />

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
          </Route>

          {/* Global Fallback for Unmatched Routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
