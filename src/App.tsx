import * as React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Landing } from "@/pages/Landing";
import { CoordinatorWorklist } from "@/pages/CoordinatorWorklist";
import { CaseDetail } from "@/pages/CaseDetail";
import { PatientView } from "@/pages/PatientView";
import { ReferralInbox } from "@/pages/ReferralInbox";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { NotificationSimulatorPage } from "@/pages/NotificationSimulatorPage";

const DEMO_CASE_ID = "CASE-001";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="landing" element={<Landing />} />
          <Route path="coordinator" element={<CoordinatorWorklist />} />
          <Route path="case" element={<Navigate to={`/case/${DEMO_CASE_ID}`} replace />} />
          <Route path="case/:caseId" element={<CaseDetail />} />
          <Route path="patient" element={<Navigate to={`/patient/${DEMO_CASE_ID}`} replace />} />
          <Route path="patient/:caseId" element={<PatientView />} />
          <Route path="referral" element={<ReferralInbox />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="notifications" element={<NotificationSimulatorPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
