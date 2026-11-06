import * as React from "react";
import { Link } from "react-router-dom";
import {
  HeartPulse,
  Scale,
  ShieldAlert,
  FileCheck,
  Server,
  Lock,
  ArrowRight,
  Stethoscope,
  Building,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard, StatusPill } from "@/components/design-system";

export const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-transparent text-[#1E2532] flex flex-col font-sans selection:bg-[#8B5CF6]/20 selection:text-[#8B5CF6]">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/75 border-b border-white/80 shadow-[0_4px_20px_rgba(100,115,140,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-white border border-white/80 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <HeartPulse className="w-5 h-5 text-[#10B981]" strokeWidth={2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-[#1E2532]">CareLoop</span>
                <StatusPill variant="mint" label="AI HEALTH" size="sm" />
              </div>
              <p className="text-[11px] text-[#798393] font-medium">Closing the Screening-to-Care Loop</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#798393]">
            <Link to="/" className="hover:text-[#1E2532] transition-colors">Platform</Link>
            <Link to="/about" className="hover:text-[#1E2532] transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-[#1E2532] transition-colors">Contact</Link>
            <Link to="/help" className="hover:text-[#1E2532] transition-colors">Help Center</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button className="bg-[#1E2532] hover:bg-slate-800 text-white font-bold text-sm px-5 h-10 rounded-xl shadow-xs">
                Sign In to Portal
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        {/* Title */}
        <div className="space-y-4 border-b border-white/80 pb-8">
          <StatusPill variant="lavender" label="Master Healthcare SaaS Agreement" size="sm" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2532] tracking-tight">
            Terms of Service &amp; Clinical Disclaimers
          </h1>
          <p className="text-sm text-[#798393]">
            Last updated: <span className="font-semibold text-[#1E2532]">November 2026</span> • Version 2.4 • Applicable to Hospital Systems, Clinical Providers, Navigators, and Patients
          </p>
        </div>

        {/* Critical Clinical Disclaimer Banner */}
        <GlassCard className="p-6 rounded-[26px] bg-amber-500/10 border border-amber-500/25 text-[#92400E] space-y-3">
          <div className="flex items-center gap-2 font-extrabold text-base text-amber-900">
            <ShieldAlert className="w-5 h-5 text-amber-700" />
            <span>Mandatory Clinical &amp; Medical Disclaimer</span>
          </div>
          <p className="text-sm leading-relaxed">
            CareLoop AI is an administrative orchestration, scheduling, and decision-support workflow platform. <strong>CareLoop AI does not practice medicine, does not establish independent patient-physician relationships, and does not provide autonomous clinical diagnoses or prescription orders.</strong>
          </p>
          <p className="text-xs leading-relaxed opacity-90">
            All AI-extracted findings (including BIRADS or Lung-RADS score categorizations, urgency triage flags, and recommended biopsy pathways) must be verified and authorized by a licensed healthcare professional prior to clinical intervention. If you are experiencing a medical emergency, call 911 or your local emergency services immediately.
          </p>
        </GlassCard>

        {/* Section 1: Acceptance & Parties */}
        <GlassCard className="p-6 sm:p-8 rounded-[28px] space-y-4">
          <h2 className="text-xl font-bold text-[#1E2532] flex items-center gap-2">
            <Building className="w-5 h-5 text-[#8B5CF6]" />
            1. Acceptance of Terms &amp; Parties
          </h2>
          <p className="text-sm text-[#798393] leading-relaxed">
            These Terms of Service constitute a legally binding agreement between CareLoop AI Inc. (&quot;CareLoop&quot;, &quot;we&quot;, &quot;our&quot;) and the healthcare organization, hospital network, clinical practice, or individual user accessing our platform (&quot;Customer&quot;, &quot;User&quot;, or &quot;You&quot;).
          </p>
          <p className="text-sm text-[#798393] leading-relaxed">
            By logging into the CareLoop AI portal, integrating CareLoop with an Electronic Health Record (EHR) system via FHIR/HL7, or scheduling appointments through the patient navigation portal, you agree to be bound by these Terms and the executed Business Associate Agreement (BAA).
          </p>
        </GlassCard>

        {/* Section 2: Authorized Use & Account Security */}
        <GlassCard className="p-6 sm:p-8 rounded-[28px] space-y-4">
          <h2 className="text-xl font-bold text-[#1E2532] flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#8B5CF6]" />
            2. Permitted Use &amp; Role-Based Access Controls
          </h2>
          <p className="text-sm text-[#798393] leading-relaxed">
            Access to CareLoop is strictly compartmentalized via Role-Based Access Control (RBAC):
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/70 border border-white/80 space-y-1.5 shadow-2xs">
              <span className="font-bold text-xs text-[#8B5CF6] uppercase tracking-wide">Primary Clinicians</span>
              <p className="text-xs text-[#798393]">Access authorized to view diagnostic findings, order biopsies, submit clinical referrals, and sign off on closed loop resolutions.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 border border-white/80 space-y-1.5 shadow-2xs">
              <span className="font-bold text-xs text-[#10B981] uppercase tracking-wide">Nurse Navigators</span>
              <p className="text-xs text-[#798393]">Access authorized to conduct outreach, coordinate transportation/interpreters, schedule diagnostic appointments, and log barrier mitigations.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 border border-white/80 space-y-1.5 shadow-2xs">
              <span className="font-bold text-xs text-blue-600 uppercase tracking-wide">Health System Executives</span>
              <p className="text-xs text-[#798393]">Access authorized to audit population-level loop completion times, compliance SLAs, and de-identified operational benchmarks.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 border border-white/80 space-y-1.5 shadow-2xs">
              <span className="font-bold text-xs text-[#8B5CF6] uppercase tracking-wide">Patients &amp; Caregivers</span>
              <p className="text-xs text-[#798393]">Access authorized strictly to view personal screening records, upcoming consultations, and self-select available provider appointment slots.</p>
            </div>
          </div>
          <p className="text-xs text-[#798393] italic">
            Sharing user credentials or using shared generic logins is strictly prohibited under institutional security policies and HIPAA audit regulations.
          </p>
        </GlassCard>

        {/* Section 3: Availability & Uptime SLA */}
        <GlassCard className="p-6 sm:p-8 rounded-[28px] space-y-4">
          <h2 className="text-xl font-bold text-[#1E2532] flex items-center gap-2">
            <Server className="w-5 h-5 text-[#8B5CF6]" />
            3. Service Level Agreement (SLA) &amp; Reliability
          </h2>
          <div className="p-4 rounded-2xl bg-white/70 border border-white/80 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/80">
              <span className="text-xs font-bold text-[#1E2532]">Target Operational Uptime:</span>
              <StatusPill variant="mint" label="99.9% Monthly Availability" size="sm" />
            </div>
            <p className="text-xs text-[#798393] leading-relaxed">
              CareLoop maintains multi-region hot-standby cloud infrastructure to ensure continuous availability for clinical escalation workflows. Routine maintenance is scheduled outside peak hospital clinical operational hours with at least 72 hours advance electronic notice.
            </p>
          </div>
        </GlassCard>

        {/* Section 4: Data Ownership */}
        <GlassCard className="p-6 sm:p-8 rounded-[28px] space-y-4">
          <h2 className="text-xl font-bold text-[#1E2532] flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#8B5CF6]" />
            4. Protected Health Information (PHI) Ownership &amp; Retention
          </h2>
          <div className="space-y-2 text-sm text-[#798393] leading-relaxed">
            <p>
              <strong className="text-[#1E2532]">Customer Retains 100% PHI Ownership:</strong> As between CareLoop and Customer, Customer owns all right, title, and interest in and to all Protected Health Information (PHI) and clinical records transmitted to or processed through the platform.
            </p>
            <p>
              <strong className="text-[#1E2532]">Data Portability &amp; Deletion on Termination:</strong> Upon termination of service, CareLoop shall, in accordance with the Business Associate Agreement, export and deliver all patient records in standard HL7/FHIR format to Customer, and securely purge or de-identify all residual database instances within 30 days.
            </p>
          </div>
        </GlassCard>

        {/* Section 5: Limitation of Liability */}
        <GlassCard className="p-6 sm:p-8 rounded-[28px] space-y-4">
          <h2 className="text-xl font-bold text-[#1E2532] flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-[#8B5CF6]" />
            5. Clinical Decisions &amp; Limitation of Liability
          </h2>
          <p className="text-xs text-[#798393] leading-relaxed bg-white/70 p-4 rounded-2xl border border-white/80 shadow-2xs">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, CARELOOP AI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR LOSS OF CLINICAL REVENUE OR GOODWILL. CARELOOP SHALL NOT BE LIABLE FOR ANY CLINICAL DIAGNOSES, DELAYS IN PATIENT CARE CAUSED BY THIRD-PARTY EHR DOWNTIME, OR MEDICAL MALPRACTICE CLAIMS ARISING FROM CLINICAL DECISIONS MADE BY LICENSED HEALTHCARE PROVIDERS USING THE SOFTWARE.
          </p>
        </GlassCard>

        {/* Section 6: Inquiries & Legal Notices */}
        <GlassCard className="p-6 rounded-[26px] space-y-3 shadow-xs">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#8B5CF6]" />
            <h2 className="text-lg font-bold text-[#1E2532]">Legal Notices &amp; Inquiries</h2>
          </div>
          <p className="text-xs text-[#798393] leading-relaxed">
            Formal contractual notices, SLA claims, or legal communications regarding these Terms of Service should be directed to our General Counsel:
          </p>
          <div className="text-xs font-semibold text-[#1E2532]">
            <p>CareLoop AI Inc. — Legal &amp; Regulatory Affairs</p>
            <p className="text-[#798393] font-normal">500 Technology Square, Suite 800, Cambridge, MA 02139</p>
            <p className="text-[#8B5CF6] font-mono mt-1">legal@careloop.health</p>
          </div>
        </GlassCard>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/80 bg-white/60 backdrop-blur-md text-xs text-[#798393] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-[#10B981]" />
            <span className="font-extrabold text-[#1E2532]">CareLoop Health Systems</span>
            <span>&copy; 2026 CareLoop AI Inc. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[#798393] font-semibold">
            <Link to="/privacy" className="hover:text-[#1E2532]">Privacy Policy</Link>
            <Link to="/terms" className="text-[#1E2532] font-bold">Terms of Service</Link>
            <Link to="/help" className="hover:text-[#1E2532]">Help Center</Link>
            <Link to="/contact" className="hover:text-[#1E2532]">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};