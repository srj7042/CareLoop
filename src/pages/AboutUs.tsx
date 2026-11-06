import * as React from "react";
import { Link } from "react-router-dom";
import {
  HeartPulse,
  ShieldCheck,
  Building2,
  Stethoscope,
  ArrowRight,
  Eye,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard, StatusPill } from "@/components/design-system";

export const AboutUs: React.FC = () => {
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
            <Link to="/about" className="text-[#1E2532] font-bold">About Us</Link>
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
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <StatusPill variant="lavender" label="Our Mission &amp; Clinical Architecture" size="sm" />
          <h1 className="text-3xl sm:text-5xl font-black text-[#1E2532] tracking-tight">
            Built by Healthcare Leaders to Eliminate Diagnostic Drop-Off.
          </h1>
          <p className="text-sm sm:text-base text-[#798393] leading-relaxed">
            Every year, millions of abnormal cancer, metabolic, and cardiovascular screening results fall through the cracks between disparate electronic health records, siloed departments, and overburdened coordinators. CareLoop AI was engineered to guarantee that every actionable finding reaches a certified clinician and a confirmed resolution.
          </p>
        </div>

        {/* Core Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6 rounded-[26px] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center font-bold shadow-2xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-[#1E2532]">Zero Autonomous Closure</h3>
            <p className="text-xs text-[#798393] leading-relaxed">
              We reject black-box automation in patient care. AI assists with queue prioritization, natural language patient summaries, and SLA nudges, but only licensed human clinicians hold authority to sign off on clinical milestones.
            </p>
          </GlassCard>

          <GlassCard className="p-6 rounded-[26px] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-2xs">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-[#1E2532]">Multi-Tenant Isolation</h3>
            <p className="text-xs text-[#798393] leading-relaxed">
              Every health system operates within an isolated cryptographic domain. Patient rosters, physician caseloads, and diagnostic evidence remain strictly quarantined behind organizational boundaries.
            </p>
          </GlassCard>

          <GlassCard className="p-6 rounded-[26px] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/15 text-[#8B5CF6] flex items-center justify-center font-bold shadow-2xs">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-[#1E2532]">Plain-Language Empathy</h3>
            <p className="text-xs text-[#798393] leading-relaxed">
              Patients receive screening results translated into understandable 6th-grade language across multiple native dialects, lowering health literacy barriers and alleviating clinical anxiety.
            </p>
          </GlassCard>
        </div>

        {/* Clinical Advisory & Leadership Framework */}
        <GlassCard className="p-8 rounded-[28px] space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">Clinical Governance</span>
            <h2 className="text-2xl font-black text-[#1E2532]">Multidisciplinary Clinical Advisory</h2>
            <p className="text-xs text-[#798393]">
              CareLoop protocols are vetted in collaboration with practicing surgical oncologists, diagnostic radiologists, and chief medical officers across academic medical networks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/70 border border-white/80 space-y-1 shadow-2xs">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-[#10B981]" />
                <h4 className="font-extrabold text-sm text-[#1E2532]">Diagnostic Quality &amp; Safety</h4>
              </div>
              <p className="text-xs text-[#798393] leading-relaxed">
                Standardized ACR BI-RADS, Colonoscopy Quality Indicators, and Fleischner Society Lung Nodule surveillance pathways encoded directly into operational tracking.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 border border-white/80 space-y-1 shadow-2xs">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#8B5CF6]" />
                <h4 className="font-extrabold text-sm text-[#1E2532]">Health Equity &amp; Localization</h4>
              </div>
              <p className="text-xs text-[#798393] leading-relaxed">
                Native linguistic translation pipelines audited by certified medical translators to prevent miscommunication and ensure equitable care delivery.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Technical Standards Section */}
        <div className="p-8 rounded-[28px] bg-slate-900/70 backdrop-blur-md border border-white/10 text-white shadow-xl space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#10B981] uppercase tracking-wider">Enterprise Healthcare Architecture</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Built for Interoperability and Regulatory Compliance</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              CareLoop AI is designed to integrate seamlessly with major hospital electronic health record systems via standardized HL7 / FHIR APIs, respecting existing clinician workflows rather than replacing them.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1">
              <strong className="text-white block font-bold text-sm">HIPAA &amp; HITECH</strong>
              <span className="text-slate-300">Administrative, technical, and physical safeguards enforcing minimum necessary access.</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1">
              <strong className="text-white block font-bold text-sm">HL7 &amp; FHIR R4</strong>
              <span className="text-slate-300">Bi-directional patient demographic and diagnostic report ingestion interfaces.</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1">
              <strong className="text-white block font-bold text-sm">Immutable Audit Logs</strong>
              <span className="text-slate-300">Cryptographically verifiable event streams tracking all clinical communications.</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4 pt-6">
          <h3 className="text-2xl font-black text-[#1E2532]">Partner With CareLoop</h3>
          <p className="text-xs text-[#798393] max-w-lg mx-auto">
            Schedule an executive consultation or clinical pilot demonstration for your hospital system or ambulatory network.
          </p>
          <div className="flex justify-center gap-3">
            <Link to="/contact">
              <Button className="bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs h-11 px-6 rounded-xl shadow-xs">
                Contact Enterprise Sales
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link to="/help">
              <Button variant="outline" className="border-white/80 bg-white/70 text-[#1E2532] hover:bg-white text-xs h-11 px-5 rounded-xl font-semibold shadow-2xs">
                Explore Help &amp; Docs
              </Button>
            </Link>
          </div>
        </div>
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
            <Link to="/terms" className="hover:text-[#1E2532]">Terms of Service</Link>
            <Link to="/help" className="hover:text-[#1E2532]">Help Center</Link>
            <Link to="/contact" className="hover:text-[#1E2532]">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};