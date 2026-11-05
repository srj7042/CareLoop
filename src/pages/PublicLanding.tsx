import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  CheckCircle2,
  Users,
  Stethoscope,
  ArrowRight,
  Activity,
  HeartPulse,
  Lock,
  Clock,
  Sparkles,
  FileCheck2,
  PhoneCall,
  Globe2,
  Building2,
  ChevronRight,
  Award,
  Layers,
  Check,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { getDefaultPathForRole } from "@/lib/permissions";

export const PublicLanding: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentRole } = useStore();

  const handleCtaClick = () => {
    if (isAuthenticated && currentRole) {
      navigate(getDefaultPathForRole(currentRole));
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#36271E] flex flex-col font-sans selection:bg-[#965F2B]/20 selection:text-[#965F2B]">
      {/* Light Mode Top Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-[#EADFCF] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#965F2B] to-[#332219] flex items-center justify-center shadow-md shadow-[#965F2B]/20">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-[#332219]">CareLoop</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#F4ECE1] text-[#965F2B] border border-[#DFCBB5] tracking-wider">
                  AI HEALTH
                </span>
              </div>
              <p className="text-[11px] text-[#7B685B] font-medium">Closing the Screening-to-Care Loop</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#7B685B]">
            <a href="#workflows" className="hover:text-[#332219] transition-colors">Closed-Loop Workflow</a>
            <a href="#programs" className="hover:text-[#332219] transition-colors">Screening Programs</a>
            <a href="#governance" className="hover:text-[#332219] transition-colors">Clinical Governance</a>
            <a href="#languages" className="hover:text-[#332219] transition-colors">Accessibility</a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated && currentRole ? (
              <Button
                onClick={handleCtaClick}
                className="bg-[#332219] hover:bg-[#965F2B] text-white font-bold text-sm px-5 h-10 rounded-xl shadow-md shadow-[#332219]/20"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="bg-[#332219] hover:bg-[#965F2B] text-white font-bold text-sm px-5 h-10 rounded-xl shadow-md shadow-[#332219]/20"
              >
                Sign In
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 bg-gradient-to-b from-[#F4ECE1]/60 via-[#FAF6F0] to-[#FAF6F0] border-b border-[#EADFCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#EADFCF] text-xs font-bold text-[#332219] mb-8 shadow-xs">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#965F2B] animate-pulse" />
            Enterprise Healthcare Closed-Loop Navigation Platform
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#332219] tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6">
            Never Let an Abnormal Screening Fall Through the Cracks.
          </h1>

          <p className="text-lg sm:text-xl text-[#7B685B] max-w-3xl mx-auto font-medium leading-relaxed mb-10">
            CareLoop AI orchestrates patient navigation from initial abnormal lab or imaging detection all the way to verified diagnostic completion. Built for health systems, academic centers, and outpatient networks.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              onClick={handleCtaClick}
              className="w-full sm:w-auto bg-[#332219] hover:bg-[#965F2B] text-white font-extrabold text-base px-8 h-14 rounded-2xl shadow-xl shadow-[#332219]/20 flex items-center justify-center gap-2"
            >
              Access CareLoop Portal
              <ArrowRight className="w-5 h-5" />
            </Button>
            <a
              href="#workflows"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 h-14 rounded-2xl bg-white hover:bg-[#F4ECE1] border-2 border-[#EADFCF] text-[#332219] font-bold text-base transition-colors shadow-xs"
            >
              Explore Clinical Pathway
            </a>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8 border-t border-[#EADFCF]">
            <div className="p-5 rounded-2xl bg-white border border-[#EADFCF] text-left shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-[#332219] mb-1">94.2%</div>
              <div className="text-xs text-[#7B685B] font-semibold">Verified Loop Closure Rate</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#EADFCF] text-left shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-[#965F2B] mb-1">&lt; 48 hrs</div>
              <div className="text-xs text-[#7B685B] font-semibold">Mean Time to Patient Outreach</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#EADFCF] text-left shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-[#332219] mb-1">5 Languages</div>
              <div className="text-xs text-[#7B685B] font-semibold">EN, தமிழ், తెలుగు, हिन्दी, मराठी</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#EADFCF] text-left shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-[#332219] mb-1">100%</div>
              <div className="text-xs text-[#7B685B] font-semibold">Human Clinician Verification</div>
            </div>
          </div>
        </div>
      </section>

      {/* The 6-Step Closed-Loop Architecture */}
      <section id="workflows" className="py-20 lg:py-24 bg-white border-b border-[#EADFCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4ECE1] border border-[#DFCBB5] text-xs font-bold text-[#965F2B] mb-4">
              <Activity className="w-3.5 h-3.5" />
              Continuous Clinical Safeguards
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#332219] tracking-tight mb-4">
              The Screening-to-Care Continuum
            </h2>
            <p className="text-[#7B685B] text-base sm:text-lg">
              Every abnormal finding progresses through six verifiable checkpoints. AI predicts delay risks and accelerates workflows; qualified human clinicians always maintain final authority.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[#FAF6F0] border border-[#EADFCF] hover:border-[#965F2B]/50 transition-all flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-9 h-9 rounded-xl bg-white border border-[#EADFCF] text-[#332219] font-extrabold text-sm flex items-center justify-center shadow-2xs">
                    01
                  </span>
                  <Badge variant="mint" className="text-[10px]">EHR / HL7 Feed</Badge>
                </div>
                <h3 className="text-base font-extrabold text-[#332219] mb-2">Automated Ingestion &amp; Triage</h3>
                <p className="text-xs sm:text-sm text-[#7B685B] leading-relaxed">
                  Ingests abnormal lab and imaging reports instantly. Evaluates clinical delay risk scores (0–100) based on severity, social vulnerability, and past compliance.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#EADFCF] flex items-center gap-2 text-xs text-[#332219] font-semibold">
                <Clock className="w-3.5 h-3.5 text-[#965F2B]" />
                Zero-hour automated registration
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-[#FAF6F0] border border-[#EADFCF] hover:border-[#965F2B]/50 transition-all flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-9 h-9 rounded-xl bg-white border border-[#EADFCF] text-[#332219] font-extrabold text-sm flex items-center justify-center shadow-2xs">
                    02
                  </span>
                  <Badge variant="teal" className="text-[10px]">Multichannel</Badge>
                </div>
                <h3 className="text-base font-extrabold text-[#332219] mb-2">Multichannel Patient Outreach</h3>
                <p className="text-xs sm:text-sm text-[#7B685B] leading-relaxed">
                  Dispatches notifications across preferred channels: SMS, WhatsApp, voice calls, and secure portal releases. Adapts to preferred regional language automatically.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#EADFCF] flex items-center gap-2 text-xs text-[#332219] font-semibold">
                <PhoneCall className="w-3.5 h-3.5 text-[#965F2B]" />
                24-hour delivery SLA window
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[#FAF6F0] border border-[#EADFCF] hover:border-[#965F2B]/50 transition-all flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-9 h-9 rounded-xl bg-white border border-[#EADFCF] text-[#332219] font-extrabold text-sm flex items-center justify-center shadow-2xs">
                    03
                  </span>
                  <Badge variant="mint" className="text-[10px]">Patient Portal</Badge>
                </div>
                <h3 className="text-base font-extrabold text-[#332219] mb-2">Plain-Language Acknowledgement</h3>
                <p className="text-xs sm:text-sm text-[#7B685B] leading-relaxed">
                  Converts dense medical jargon into empathetic 6th-grade reading level summaries. Enables 1-tap confirmation, callback requests, and pulse understanding scores.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#EADFCF] flex items-center gap-2 text-xs text-[#332219] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#965F2B]" />
                72-hour acknowledgement timer
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-[#FAF6F0] border border-[#EADFCF] hover:border-[#965F2B]/50 transition-all flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-9 h-9 rounded-xl bg-white border border-[#EADFCF] text-[#332219] font-extrabold text-sm flex items-center justify-center shadow-2xs">
                    04
                  </span>
                  <Badge variant="amber" className="text-[10px]">Order Protocol</Badge>
                </div>
                <h3 className="text-base font-extrabold text-[#332219] mb-2">Diagnostic Workup Orders</h3>
                <p className="text-xs sm:text-sm text-[#7B685B] leading-relaxed">
                  Clinicians order guideline-recommended confirmatory procedures (e.g., diagnostic mammogram, ultrasound-guided core biopsy, repeat lab, or diagnostic colonoscopy).
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#EADFCF] flex items-center gap-2 text-xs text-[#332219] font-semibold">
                <FileCheck2 className="w-3.5 h-3.5 text-[#965F2B]" />
                Protocol-driven diagnostic pathways
              </div>
            </div>

            {/* Step 5 */}
            <div className="p-6 rounded-2xl bg-[#FAF6F0] border border-[#EADFCF] hover:border-[#965F2B]/50 transition-all flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-9 h-9 rounded-xl bg-white border border-[#EADFCF] text-[#332219] font-extrabold text-sm flex items-center justify-center shadow-2xs">
                    05
                  </span>
                  <Badge variant="mint" className="text-[10px]">Specialist Network</Badge>
                </div>
                <h3 className="text-base font-extrabold text-[#332219] mb-2">Structured Specialist Referral</h3>
                <p className="text-xs sm:text-sm text-[#7B685B] leading-relaxed">
                  Pre-assembles referral packets containing relevant medical history, lab values, and clinical questions. Specialists accept, reject, or request more information in one click.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#EADFCF] flex items-center gap-2 text-xs text-[#332219] font-semibold">
                <Stethoscope className="w-3.5 h-3.5 text-[#965F2B]" />
                Integrated specialist consult threads
              </div>
            </div>

            {/* Step 6 */}
            <div className="p-6 rounded-2xl bg-[#F4ECE1]/60 border-2 border-[#965F2B] flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-9 h-9 rounded-xl bg-[#965F2B] text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                    06
                  </span>
                  <Badge variant="mint" className="text-[10px]">Proof of Closure</Badge>
                </div>
                <h3 className="text-base font-extrabold text-[#332219] mb-2">Verified Loop Closure</h3>
                <p className="text-xs sm:text-sm text-[#36271E] leading-relaxed">
                  Loops can never close autonomously. Closure requires documented evidence: attended clinical visit, initiated treatment, or long-term surveillance protocol.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#965F2B]/30 flex items-center gap-2 text-xs text-[#332219] font-extrabold">
                <ShieldCheck className="w-4 h-4 text-[#965F2B]" />
                Immutable human sign-off audit trail
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Specific Workspaces Strip */}
      <section className="py-20 lg:py-24 bg-[#FAF6F0] border-b border-[#EADFCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-[#332219] tracking-tight mb-4">
              Dedicated Workspaces for Every Healthcare Role
            </h2>
            <p className="text-[#7B685B] text-base sm:text-lg">
              Each user operates in a segregated, role-specific environment with strict permission boundaries and zero cross-organizational data leakage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#EADFCF] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-[#332219] mb-1">Executive Directors &amp; Deans</h3>
              <p className="text-xs text-[#7B685B] mb-3 font-semibold">Enterprise Oversight &amp; SLA Analytics</p>
              <p className="text-xs sm:text-sm text-[#36271E] leading-relaxed">
                Track hospital-wide loop closure metrics, department comparisons, and systemic bottleneck risks across oncology, cardiology, and primary care.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EADFCF] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#F4ECE1] text-[#965F2B] border border-[#DFCBB5] flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-[#332219] mb-1">Heads of Department (HOD)</h3>
              <p className="text-xs text-[#7B685B] mb-3 font-semibold">Departmental Worklists &amp; Capacity</p>
              <p className="text-xs sm:text-sm text-[#36271E] leading-relaxed">
                Oversee department queue volumes, balance coordinator caseloads, manage high-risk escalations, and review specialist referral latency.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EADFCF] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#F4ECE1] text-[#965F2B] border border-[#DFCBB5] flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-[#332219] mb-1">Care Coordinators &amp; Navigators</h3>
              <p className="text-xs text-[#7B685B] mb-3 font-semibold">Triage Worklist &amp; Direct Patient Contact</p>
              <p className="text-xs sm:text-sm text-[#36271E] leading-relaxed">
                Prioritize overdue acknowledgements, dispatch multichannel nudges, answer patient questions, and arrange specialist diagnostic bookings.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EADFCF] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-4">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-[#332219] mb-1">Primary Clinicians</h3>
              <p className="text-xs text-[#7B685B] mb-3 font-semibold">Order Management &amp; Evidence Sign-Off</p>
              <p className="text-xs sm:text-sm text-[#36271E] leading-relaxed">
                Review abnormal test findings, initiate peer-to-peer consults, verify biopsy results, and officially certify clinical loop closure.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EADFCF] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-[#332219] mb-1">Consulting Specialists</h3>
              <p className="text-xs text-[#7B685B] mb-3 font-semibold">Diagnostic Packets &amp; Referrals</p>
              <p className="text-xs sm:text-sm text-[#36271E] leading-relaxed">
                Receive pre-assembled clinical referral packets, rapidly accept urgent bookings, respond to clinician questions, and establish care plans.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EADFCF] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center mb-4">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-[#332219] mb-1">Patients &amp; Families</h3>
              <p className="text-xs text-[#7B685B] mb-3 font-semibold">Multilingual Portal &amp; 1-Tap Actions</p>
              <p className="text-xs sm:text-sm text-[#36271E] leading-relaxed">
                Access compassionate plain-language explanations in English, Tamil, Telugu, Hindi, or Marathi with responsive web and mobile layouts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Multilingual Health Literacy Section */}
      <section id="languages" className="py-20 lg:py-24 bg-white border-b border-[#EADFCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4ECE1] border border-[#DFCBB5] text-xs font-bold text-[#965F2B] mb-4">
                <Globe2 className="w-3.5 h-3.5" />
                Language Equity &amp; Health Literacy
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#332219] tracking-tight mb-6">
                Bridging the Language Divide in Critical Diagnostics
              </h2>
              <p className="text-[#7B685B] text-base leading-relaxed mb-6 font-medium">
                Healthcare communication fails when jargon induces panic. CareLoop bridges this gap with culturally attuned, 6th-grade reading level translations across five major languages:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                <div className="p-3.5 rounded-xl bg-[#FAF6F0] border border-[#EADFCF] text-center shadow-2xs">
                  <span className="font-extrabold text-[#332219] text-sm">English</span>
                  <p className="text-[11px] text-[#7B685B]">Default Clinical</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF6F0] border border-[#EADFCF] text-center shadow-2xs">
                  <span className="font-extrabold text-[#965F2B] text-sm">தமிழ்</span>
                  <p className="text-[11px] text-[#7B685B]">Tamil</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF6F0] border border-[#EADFCF] text-center shadow-2xs">
                  <span className="font-extrabold text-[#965F2B] text-sm">తెలుగు</span>
                  <p className="text-[11px] text-[#7B685B]">Telugu</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF6F0] border border-[#EADFCF] text-center shadow-2xs">
                  <span className="font-extrabold text-[#965F2B] text-sm">हिन्दी</span>
                  <p className="text-[11px] text-[#7B685B]">Hindi</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF6F0] border border-[#EADFCF] text-center shadow-2xs">
                  <span className="font-extrabold text-[#965F2B] text-sm">मराठी</span>
                  <p className="text-[11px] text-[#7B685B]">Marathi</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#965F2B] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#36271E] font-medium">Unicode font rendering with proper word-wrapping and script aesthetics.</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#965F2B] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#36271E] font-medium">Persistent language preference preserved throughout session navigation.</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#965F2B] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#36271E] font-medium">Plain-language explanations for all 8 standardized screening pathways.</span>
                </div>
              </div>
            </div>

            {/* Language Preview Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EADFCF] shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-[#EADFCF] mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#965F2B]" />
                  <span className="text-xs font-bold text-[#332219]">Patient Portal Example: Mammogram Result</span>
                </div>
                <Badge variant="mint" className="text-[10px]">Hindi / हिन्दी</Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-extrabold text-[#332219] mb-1.5">सरल शब्दों में इसका क्या मतलब है:</h4>
                  <p className="text-xs sm:text-sm text-[#36271E] leading-relaxed bg-[#FAF6F0] p-4 rounded-xl border border-[#EADFCF]">
                    &ldquo;आपकी जांच में एक ऐसा हिस्सा दिखा है जिसे दोबारा ध्यान से देखना ज़रूरी है। ज्यादातर मामलों में यह कैंसर नहीं होता (जैसे सिस्ट या घने ऊतक), लेकिन पूरी तसल्ली के लिए एक अल्ट्रासाउंड आवश्यक है।&rdquo;
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F4ECE1] border border-[#DFCBB5] text-xs text-[#332219] font-semibold flex items-center gap-2.5">
                  <HeartPulse className="w-4 h-4 text-[#965F2B] flex-shrink-0" />
                  <span>घबराएं नहीं, आपकी देखभाल टीम हर कदम पर आपके साथ है।</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button className="h-10 px-4 rounded-xl bg-[#332219] text-white font-bold text-xs text-center flex items-center justify-center shadow-xs">
                    हाँ, मैं समझ गया
                  </button>
                  <button className="h-10 px-4 rounded-xl bg-white text-[#332219] font-bold text-xs text-center flex items-center justify-center border-2 border-[#EADFCF] hover:bg-[#FAF6F0]">
                    मुफ़्त कॉलबैक मांगें
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Governance Section */}
      <section id="governance" className="py-20 lg:py-24 bg-[#FAF6F0] border-b border-[#EADFCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#EADFCF] text-xs font-bold text-[#332219] mb-4 shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-[#965F2B]" />
              Enterprise Healthcare Security
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#332219] tracking-tight mb-4">
              Clinical Safety &amp; Data Isolation Safeguards
            </h2>
            <p className="text-[#7B685B] text-base sm:text-lg">
              Designed from day one to uphold HIPAA requirements, organizational data boundaries, and strict non-autonomous clinical governance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EADFCF] shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#F4ECE1] border border-[#DFCBB5] text-[#965F2B] flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-[#332219] mb-2">Zero Autonomous Closure</h3>
              <p className="text-xs sm:text-sm text-[#7B685B] leading-relaxed">
                AI never closes a diagnostic loop, cancels a consult, or overrides clinical judgement. Every loop closure requires human clinician sign-off with attached diagnostic evidence.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EADFCF] shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-[#332219] mb-2">Multi-Tenant Isolation</h3>
              <p className="text-xs sm:text-sm text-[#7B685B] leading-relaxed">
                Health systems maintain strict multi-tenant boundaries. Patient and clinical records belonging to one health system cannot be viewed or accessed by staff of another.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EADFCF] shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-6">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-[#332219] mb-2">Immutable Audit Trails</h3>
              <p className="text-xs sm:text-sm text-[#7B685B] leading-relaxed">
                Every action—notification dispatch, patient portal view, clinical consult message, and procedural sign-off—is permanently recorded with user identity and timestamp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-16 bg-white border-t border-[#EADFCF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-[#332219] tracking-tight mb-4">
            Ready to Close the Care Loop?
          </h2>
          <p className="text-[#7B685B] text-base mb-8">
            Sign in with your clinical credentials to access your organization&apos;s dedicated workspace.
          </p>
          <Button
            size="lg"
            onClick={handleCtaClick}
            className="bg-[#332219] hover:bg-[#965F2B] text-white font-extrabold text-base px-10 h-14 rounded-2xl shadow-xl shadow-[#332219]/20"
          >
            Sign In to CareLoop
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#EADFCF] bg-[#FAF6F0] text-xs text-[#7B685B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-[#965F2B]" />
            <span className="font-extrabold text-[#332219]">CareLoop Health Systems</span>
            <span>&copy; {new Date().getFullYear()} CareLoop AI Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-[#7B685B] font-semibold">
            <span>HIPAA Compliant</span>
            <span>HL7 / FHIR Ready</span>
            <span>SOC2 Type II Aligned</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
