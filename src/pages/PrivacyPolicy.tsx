import * as React from "react";
import { Link } from "react-router-dom";
import {
  HeartPulse,
  ShieldCheck,
  Lock,
  FileText,
  Eye,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Database,
  Building2,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard, StatusPill } from "@/components/design-system";

export const PrivacyPolicy: React.FC = () => {
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
          <StatusPill variant="lavender" label="Healthcare Data Protection &amp; Notice of Privacy Practices" size="sm" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2532] tracking-tight">
            CareLoop Privacy Policy &amp; HIPAA Disclosures
          </h1>
          <p className="text-sm text-[#798393]">
            Last updated: <span className="font-semibold text-[#1E2532]">November 2026</span> • Effective date: Immediate • Standards: HIPAA Omnibus Rule, HITECH Act, 45 CFR Part 160/164
          </p>
        </div>

        {/* Executive Summary Callout */}
        <GlassCard className="p-6 rounded-[26px] border border-[#10B981]/25 bg-[#10B981]/10 text-[#065F46] space-y-2">
          <div className="flex items-center gap-2 font-bold text-base text-[#065F46]">
            <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
            <span>Our Core Privacy Principle: Zero Unconsented PHI Monetization</span>
          </div>
          <p className="text-sm leading-relaxed">
            CareLoop operates strictly as a HIPAA Business Associate to covered healthcare providers. We do not sell, rent, monetize, or use Protected Health Information (PHI) to train public commercial foundational AI models. All data is isolated in customer-dedicated encrypted partitions.
          </p>
        </GlassCard>

        {/* Section 1: Business Associate Role */}
        <GlassCard className="p-6 sm:p-8 rounded-[28px] space-y-4">
          <h2 className="text-xl font-bold text-[#1E2532] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#8B5CF6]" />
            1. Role as a HIPAA Business Associate
          </h2>
          <p className="text-sm text-[#798393] leading-relaxed">
            Under the Health Insurance Portability and Accountability Act of 1996 (HIPAA) and the Health Information Technology for Economic and Clinical Health (HITECH) Act, CareLoop operates primarily as a <strong>Business Associate</strong> to Covered Entities (hospitals, health systems, clinics, and physicians).
          </p>
          <p className="text-sm text-[#798393] leading-relaxed">
            Prior to processing any real patient data, CareLoop executes a formal <strong>Business Associate Agreement (BAA)</strong> governing the handling, protection, transmission, and permissible uses of Protected Health Information (PHI) pursuant to 45 CFR § 164.502(e) and § 164.504(e).
          </p>
        </GlassCard>

        {/* Section 2: Protected Health Information Handled */}
        <GlassCard className="p-6 sm:p-8 rounded-[28px] space-y-4">
          <h2 className="text-xl font-bold text-[#1E2532] flex items-center gap-2">
            <Database className="w-5 h-5 text-[#8B5CF6]" />
            2. Categories of Information We Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/70 border border-white/80 space-y-2 shadow-2xs">
              <h3 className="font-bold text-sm text-[#1E2532]">Clinical Navigation Data</h3>
              <ul className="text-xs text-[#798393] space-y-1 list-disc list-inside">
                <li>Abnormal screening findings (e.g., BIRADS, Lung-RADS, colonoscopy polpys)</li>
                <li>Recommended clinical follow-up intervals and modalities</li>
                <li>Biopsy orders, scheduling timestamps, and confirmation notices</li>
                <li>Referring clinician and assigned navigator metadata</li>
              </ul>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 border border-white/80 space-y-2 shadow-2xs">
              <h3 className="font-bold text-sm text-[#1E2532]">Patient &amp; Provider Account Data</h3>
              <ul className="text-xs text-[#798393] space-y-1 list-disc list-inside">
                <li>Patient contact credentials (phone, secure email, communication preference)</li>
                <li>Preferred language (English, Tamil, Telugu, Hindi, Marathi)</li>
                <li>Provider institutional NPI and clinical workspace roles</li>
                <li>Cryptographic authentication tokens and audit access records</li>
              </ul>
            </div>
          </div>
        </GlassCard>

        {/* Section 3: Safe Harbor De-Identification */}
        <GlassCard className="p-6 sm:p-8 rounded-[28px] space-y-4">
          <h2 className="text-xl font-bold text-[#1E2532] flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#8B5CF6]" />
            3. Safe Harbor De-Identification &amp; Secondary Analytics
          </h2>
          <p className="text-sm text-[#798393] leading-relaxed">
            For operational benchmarking, population-level oncology adherence tracking, and quality improvement metrics, CareLoop strictly enforces the <strong>HIPAA Safe Harbor De-Identification Standard</strong> (45 CFR § 164.514(b)(2)).
          </p>
          <div className="p-4 rounded-2xl bg-white/70 border border-white/80 space-y-2 shadow-2xs">
            <p className="text-xs text-[#798393] leading-relaxed">
              All 18 designated HIPAA direct identifiers—including patient names, precise addresses below state level, full telephone numbers, exact social security identifiers, medical record numbers, and full-face biometric images—are stripped or pseudonymized prior to aggregated multi-site clinical reporting.
            </p>
          </div>
        </GlassCard>

        {/* Section 4: Data Security Safeguards */}
        <GlassCard className="p-6 sm:p-8 rounded-[28px] space-y-4">
          <h2 className="text-xl font-bold text-[#1E2532] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#10B981]" />
            4. Technical, Physical, &amp; Administrative Safeguards
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/70 border border-white/80 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
              <div>
                <strong className="text-xs font-bold text-[#1E2532]">End-to-End Cryptography:</strong>
                <p className="text-xs text-[#798393]">All data in transit is enforced using TLS 1.3 with forward secrecy. All data at rest is encrypted via AES-256 with tenant-specific hardware security module (HSM) key rotations.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/70 border border-white/80 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
              <div>
                <strong className="text-xs font-bold text-[#1E2532]">Row-Level Multi-Tenant Isolation:</strong>
                <p className="text-xs text-[#798393]">Clinical databases enforce strict organization-scoped foreign keys and logical database row separation. Cross-hospital querying is architecturally prevented.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/70 border border-white/80 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
              <div>
                <strong className="text-xs font-bold text-[#1E2532]">Immutable Audit Logging:</strong>
                <p className="text-xs text-[#798393]">Every query, record view, message send, appointment booking, or export generates a write-once audit log recording the actor ID, timestamp, and action.</p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Section 5: AI Ethics & Clinician Governance */}
        <GlassCard className="p-6 sm:p-8 rounded-[28px] space-y-4">
          <h2 className="text-xl font-bold text-[#1E2532] flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#8B5CF6]" />
            5. Assistive AI &amp; Human-in-the-Loop Governance
          </h2>
          <div className="p-4 rounded-2xl bg-white/70 border border-white/80 space-y-2 shadow-2xs">
            <p className="text-xs text-[#798393] leading-relaxed">
              CareLoop AI is designed solely as an administrative orchestration and clinical decision support system. <strong>CareLoop AI does not independently issue medical diagnoses, does not prescribe pharmaceuticals, and does not close abnormal screening clinical loops autonomously.</strong>
            </p>
            <p className="text-xs text-[#798393] leading-relaxed">
              Every critical action—such as diagnostic biopsy scheduling, referral transmission, or case resolution—requires explicit human clinician or nurse navigator review and electronic confirmation.
            </p>
          </div>
        </GlassCard>

        {/* Section 6: Patient Rights */}
        <GlassCard className="p-6 sm:p-8 rounded-[28px] space-y-4">
          <h2 className="text-xl font-bold text-[#1E2532] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#8B5CF6]" />
            6. Individual Patient Rights Under HIPAA
          </h2>
          <p className="text-sm text-[#798393] leading-relaxed">
            Patients participating in CareLoop-navigated screening follow-ups maintain the full suite of rights granted under 45 CFR § 164.524, 164.526, and 164.528:
          </p>
          <ul className="text-xs text-[#798393] space-y-2 list-disc list-inside bg-white/70 p-4 rounded-2xl border border-white/80 shadow-2xs">
            <li><strong>Right to Inspect and Copy:</strong> Request access to navigation notes and scheduled appointments via your patient portal or healthcare provider.</li>
            <li><strong>Right to Amend:</strong> Request updates or corrections to contact information, communication preferences, and personal details.</li>
            <li><strong>Right to an Accounting of Disclosures:</strong> Request a record of non-routine disclosures made outside standard treatment, payment, and healthcare operations.</li>
            <li><strong>Right to Request Confidential Communications:</strong> Specify preferred languages, communication channels (SMS vs. secure portal), and blackout hours.</li>
          </ul>
        </GlassCard>

        {/* Section 7: Security Officer Contact */}
        <GlassCard className="p-6 sm:p-8 rounded-[28px] space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#8B5CF6]" />
            <h2 className="text-lg font-bold text-[#1E2532]">Contacting the Privacy &amp; Security Desk</h2>
          </div>
          <p className="text-xs text-[#798393] leading-relaxed">
            If you have questions regarding this Privacy Policy, wish to execute an enterprise Business Associate Agreement (BAA), or need to submit a privacy inquiry, please contact our Data Protection Officer:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-white/70 border border-white/80 shadow-2xs">
              <span className="font-bold text-[#1E2532] block">HIPAA Privacy Officer:</span>
              <span className="text-[#798393]">privacy@careloop.health</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/70 border border-white/80 shadow-2xs">
              <span className="font-bold text-[#1E2532] block">Security Operations Desk:</span>
              <span className="text-[#798393]">security@careloop.health</span>
            </div>
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
            <Link to="/privacy" className="text-[#1E2532] font-bold">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#1E2532]">Terms of Service</Link>
            <Link to="/help" className="hover:text-[#1E2532]">Help Center</Link>
            <Link to="/contact" className="hover:text-[#1E2532]">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};