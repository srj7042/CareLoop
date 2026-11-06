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
import { GlassCard, StatusPill } from "@/components/design-system";
import { useStore } from "@/lib/store";
import { getDefaultPathForRole } from "@/lib/permissions";
import { motion, useReducedMotion } from "framer-motion";
import { HeroAnimatedStage } from "@/components/landing/HeroAnimatedStage";

export const PublicLanding: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentRole } = useStore();
  const shouldReduceMotion = useReducedMotion();

  const handleCtaClick = () => {
    if (isAuthenticated && currentRole) {
      navigate(getDefaultPathForRole(currentRole));
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#1E2532] flex flex-col font-sans selection:bg-[#8B5CF6]/20 selection:text-[#8B5CF6]">
      {/* Frosted Top Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/75 border-b border-white/80 shadow-[0_4px_20px_rgba(100,115,140,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group">
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
          </div>

          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#798393]">
            <a href="#workflows" className="hover:text-[#1E2532] transition-colors">Closed-Loop Workflow</a>
            <a href="#programs" className="hover:text-[#1E2532] transition-colors">Screening Programs</a>
            <a href="#governance" className="hover:text-[#1E2532] transition-colors">Clinical Governance</a>
            <Link to="/about" className="hover:text-[#1E2532] transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-[#1E2532] transition-colors">Contact</Link>
            <Link to="/help" className="hover:text-[#1E2532] transition-colors">Help Center</Link>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated && currentRole ? (
              <Button
                onClick={handleCtaClick}
                className="bg-[#1E2532] hover:bg-slate-800 text-white font-bold text-sm px-5 h-10 rounded-xl shadow-xs"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="bg-[#1E2532] hover:bg-slate-800 text-white font-bold text-sm px-5 h-10 rounded-xl shadow-xs"
              >
                Sign In
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 border-b border-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Top Category Badge */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/80 text-xs font-bold text-[#1E2532] mb-8 shadow-xs"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
            Enterprise Healthcare Closed-Loop Navigation Platform
          </motion.div>

          {/* Animated Hero Heading */}
          <motion.h1
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#1E2532] tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6"
          >
            Never Let an Abnormal Screening Fall Through the Cracks.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22, ease: "easeOut" }}
            className="text-lg sm:text-xl text-[#798393] max-w-3xl mx-auto font-medium leading-relaxed mb-10"
          >
            CareLoop AI orchestrates patient navigation from initial abnormal lab or imaging detection all the way to verified diagnostic completion. Built for health systems, academic centers, and outpatient networks.
          </motion.p>

          {/* CTA Buttons with Subtle Hover Animations */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4"
          >
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -2 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                onClick={handleCtaClick}
                className="w-full sm:w-auto bg-[#1E2532] hover:bg-slate-800 text-white font-extrabold text-base px-8 h-14 rounded-2xl shadow-xl flex items-center justify-center gap-2"
              >
                Access CareLoop Portal
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>

            <motion.a
              href="#workflows"
              whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -2 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 h-14 rounded-2xl bg-white/80 backdrop-blur-md hover:bg-white border border-white text-[#1E2532] font-bold text-base transition-colors shadow-xs"
            >
              Explore Clinical Pathway
            </motion.a>
          </motion.div>

          {/* Animated 3D Glass Orb Stage & Connected Glowing Nodes */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42, ease: "easeOut" }}
          >
            <HeroAnimatedStage />
          </motion.div>

          {/* Key Metrics Strip */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8 border-t border-white/80"
          >
            <GlassCard className="p-5 rounded-[24px] text-left">
              <div className="text-2xl sm:text-3xl font-black text-[#1E2532] mb-1">94.2%</div>
              <div className="text-xs text-[#798393] font-semibold">Verified Loop Closure Rate</div>
            </GlassCard>
            <GlassCard className="p-5 rounded-[24px] text-left">
              <div className="text-2xl sm:text-3xl font-black text-[#10B981] mb-1">&lt; 48 hrs</div>
              <div className="text-xs text-[#798393] font-semibold">Mean Time to Patient Outreach</div>
            </GlassCard>
            <GlassCard className="p-5 rounded-[24px] text-left">
              <div className="text-2xl sm:text-3xl font-black text-[#8B5CF6] mb-1">5 Languages</div>
              <div className="text-xs text-[#798393] font-semibold">EN, தமிழ், తెలుగు, हिन्दी, मराठी</div>
            </GlassCard>
            <GlassCard className="p-5 rounded-[24px] text-left">
              <div className="text-2xl sm:text-3xl font-black text-[#1E2532] mb-1">100%</div>
              <div className="text-xs text-[#798393] font-semibold">Human Clinician Verification</div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* The 6-Step Closed-Loop Architecture */}
      <section id="workflows" className="py-20 lg:py-24 border-b border-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-white/80 text-xs font-bold text-[#8B5CF6] mb-4 shadow-2xs">
              <Activity className="w-3.5 h-3.5" />
              Continuous Clinical Safeguards
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1E2532] tracking-tight mb-4">
              The Screening-to-Care Continuum
            </h2>
            <p className="text-[#798393] text-base sm:text-lg">
              Every abnormal finding progresses through six verifiable checkpoints. AI predicts delay risks and accelerates workflows; qualified human clinicians always maintain final authority.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Step 1 */}
            <GlassCard className="p-6 rounded-[26px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-9 h-9 rounded-2xl bg-white border border-white/80 text-[#1E2532] font-extrabold text-sm flex items-center justify-center shadow-xs">
                    01
                  </span>
                  <StatusPill variant="mint" label="EHR / HL7 Feed" size="sm" />
                </div>
                <h3 className="text-base font-extrabold text-[#1E2532] mb-2">Automated Ingestion &amp; Triage</h3>
                <p className="text-xs sm:text-sm text-[#798393] leading-relaxed">
                  Ingests abnormal lab and imaging reports instantly. Evaluates clinical delay risk scores (0–100) based on severity, social vulnerability, and past compliance.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/80 flex items-center gap-2 text-xs text-[#1E2532] font-semibold">
                <Clock className="w-3.5 h-3.5 text-[#10B981]" />
                Zero-hour automated registration
              </div>
            </GlassCard>

            {/* Step 2 */}
            <GlassCard className="p-6 rounded-[26px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-9 h-9 rounded-2xl bg-white border border-white/80 text-[#1E2532] font-extrabold text-sm flex items-center justify-center shadow-xs">
                    02
                  </span>
                  <StatusPill variant="lavender" label="Multichannel" size="sm" />
                </div>
                <h3 className="text-base font-extrabold text-[#1E2532] mb-2">Multichannel Patient Outreach</h3>
                <p className="text-xs sm:text-sm text-[#798393] leading-relaxed">
                  Dispatches notifications across preferred channels: SMS, WhatsApp, voice calls, and secure portal releases. Adapts to preferred regional language automatically.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/80 flex items-center gap-2 text-xs text-[#1E2532] font-semibold">
                <PhoneCall className="w-3.5 h-3.5 text-[#8B5CF6]" />
                24-hour delivery SLA window
              </div>
            </GlassCard>

            {/* Step 3 */}
            <GlassCard className="p-6 rounded-[26px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-9 h-9 rounded-2xl bg-white border border-white/80 text-[#1E2532] font-extrabold text-sm flex items-center justify-center shadow-xs">
                    03
                  </span>
                  <StatusPill variant="mint" label="Patient Portal" size="sm" />
                </div>
                <h3 className="text-base font-extrabold text-[#1E2532] mb-2">Plain-Language Acknowledgement</h3>
                <p className="text-xs sm:text-sm text-[#798393] leading-relaxed">
                  Converts dense medical jargon into empathetic 6th-grade reading level summaries. Enables 1-tap confirmation, callback requests, and pulse understanding scores.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/80 flex items-center gap-2 text-xs text-[#1E2532] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                72-hour acknowledgement timer
              </div>
            </GlassCard>

            {/* Step 4 */}
            <GlassCard className="p-6 rounded-[26px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-9 h-9 rounded-2xl bg-white border border-white/80 text-[#1E2532] font-extrabold text-sm flex items-center justify-center shadow-xs">
                    04
                  </span>
                  <StatusPill variant="amber" label="Order Protocol" size="sm" />
                </div>
                <h3 className="text-base font-extrabold text-[#1E2532] mb-2">Diagnostic Workup Orders</h3>
                <p className="text-xs sm:text-sm text-[#798393] leading-relaxed">
                  Clinicians order guideline-recommended confirmatory procedures (e.g., diagnostic mammogram, ultrasound-guided core biopsy, repeat lab, or diagnostic colonoscopy).
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/80 flex items-center gap-2 text-xs text-[#1E2532] font-semibold">
                <FileCheck2 className="w-3.5 h-3.5 text-[#F59E0B]" />
                Protocol-driven diagnostic pathways
              </div>
            </GlassCard>

            {/* Step 5 */}
            <GlassCard className="p-6 rounded-[26px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-9 h-9 rounded-2xl bg-white border border-white/80 text-[#1E2532] font-extrabold text-sm flex items-center justify-center shadow-xs">
                    05
                  </span>
                  <StatusPill variant="lavender" label="Specialist Network" size="sm" />
                </div>
                <h3 className="text-base font-extrabold text-[#1E2532] mb-2">Structured Specialist Referral</h3>
                <p className="text-xs sm:text-sm text-[#798393] leading-relaxed">
                  Pre-assembles referral packets containing relevant medical history, lab values, and clinical questions. Specialists accept, reject, or request more information in one click.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/80 flex items-center gap-2 text-xs text-[#1E2532] font-semibold">
                <Stethoscope className="w-3.5 h-3.5 text-[#8B5CF6]" />
                Integrated specialist consult threads
              </div>
            </GlassCard>

            {/* Step 6 */}
            <GlassCard className="p-6 rounded-[26px] border-2 border-[#10B981]/50 bg-white/90 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-9 h-9 rounded-2xl bg-[#10B981] text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                    06
                  </span>
                  <StatusPill variant="mint" label="Proof of Closure" size="sm" />
                </div>
                <h3 className="text-base font-extrabold text-[#1E2532] mb-2">Verified Loop Closure</h3>
                <p className="text-xs sm:text-sm text-[#1E2532] leading-relaxed">
                  Loops can never close autonomously. Closure requires documented evidence: attended clinical visit, initiated treatment, or long-term surveillance protocol.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/80 flex items-center gap-2 text-xs text-[#1E2532] font-extrabold">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                Immutable human sign-off audit trail
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Role-Specific Workspaces Strip */}
      <section className="py-20 lg:py-24 border-b border-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-[#1E2532] tracking-tight mb-4">
              Dedicated Workspaces for Every Healthcare Role
            </h2>
            <p className="text-[#798393] text-base sm:text-lg">
              Each user operates in a segregated, role-specific environment with strict permission boundaries and zero cross-organizational data leakage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GlassCard className="p-6 rounded-[26px]">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/80 flex items-center justify-center mb-4 shadow-2xs">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-[#1E2532] mb-1">Executive Directors &amp; Deans</h3>
              <p className="text-xs text-[#798393] mb-3 font-semibold">Enterprise Oversight &amp; SLA Analytics</p>
              <p className="text-xs sm:text-sm text-[#798393] leading-relaxed">
                Track hospital-wide loop closure metrics, department comparisons, and systemic bottleneck risks across oncology, cardiology, and primary care.
              </p>
            </GlassCard>

            <GlassCard className="p-6 rounded-[26px]">
              <div className="w-11 h-11 rounded-2xl bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/20 flex items-center justify-center mb-4 shadow-2xs">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-[#1E2532] mb-1">Heads of Department (HOD)</h3>
              <p className="text-xs text-[#798393] mb-3 font-semibold">Departmental Worklists &amp; Capacity</p>
              <p className="text-xs sm:text-sm text-[#798393] leading-relaxed">
                Oversee department queue volumes, balance coordinator caseloads, manage high-risk escalations, and review specialist referral latency.
              </p>
            </GlassCard>

            <GlassCard className="p-6 rounded-[26px]">
              <div className="w-11 h-11 rounded-2xl bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/20 flex items-center justify-center mb-4 shadow-2xs">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-[#1E2532] mb-1">Care Coordinators &amp; Navigators</h3>
              <p className="text-xs text-[#798393] mb-3 font-semibold">Triage Worklist &amp; Direct Patient Contact</p>
              <p className="text-xs sm:text-sm text-[#798393] leading-relaxed">
                Prioritize overdue acknowledgements, dispatch multichannel nudges, answer patient questions, and arrange specialist diagnostic bookings.
              </p>
            </GlassCard>

            <GlassCard className="p-6 rounded-[26px]">
              <div className="w-11 h-11 rounded-2xl bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/20 flex items-center justify-center mb-4 shadow-2xs">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-[#1E2532] mb-1">Primary Clinicians</h3>
              <p className="text-xs text-[#798393] mb-3 font-semibold">Order Management &amp; Evidence Sign-Off</p>
              <p className="text-xs sm:text-sm text-[#798393] leading-relaxed">
                Review abnormal test findings, initiate peer-to-peer consults, verify biopsy results, and officially certify clinical loop closure.
              </p>
            </GlassCard>

            <GlassCard className="p-6 rounded-[26px]">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-[#F59E0B] border border-amber-500/20 flex items-center justify-center mb-4 shadow-2xs">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-[#1E2532] mb-1">Consulting Specialists</h3>
              <p className="text-xs text-[#798393] mb-3 font-semibold">Diagnostic Packets &amp; Referrals</p>
              <p className="text-xs sm:text-sm text-[#798393] leading-relaxed">
                Receive pre-assembled clinical referral packets, rapidly accept urgent bookings, respond to clinician questions, and establish care plans.
              </p>
            </GlassCard>

            <GlassCard className="p-6 rounded-[26px]">
              <div className="w-11 h-11 rounded-2xl bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/20 flex items-center justify-center mb-4 shadow-2xs">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-[#1E2532] mb-1">Patients &amp; Families</h3>
              <p className="text-xs text-[#798393] mb-3 font-semibold">Multilingual Portal &amp; 1-Tap Actions</p>
              <p className="text-xs sm:text-sm text-[#798393] leading-relaxed">
                Access compassionate plain-language explanations in English, Tamil, Telugu, Hindi, or Marathi with responsive web and mobile layouts.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Multilingual Health Literacy Section */}
      <section id="languages" className="py-20 lg:py-24 border-b border-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-white/80 text-xs font-bold text-[#8B5CF6] mb-4 shadow-2xs">
                <Globe2 className="w-3.5 h-3.5" />
                Language Equity &amp; Health Literacy
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#1E2532] tracking-tight mb-6">
                Bridging the Language Divide in Critical Diagnostics
              </h2>
              <p className="text-[#798393] text-base leading-relaxed mb-6 font-medium">
                Healthcare communication fails when jargon induces panic. CareLoop bridges this gap with culturally attuned, 6th-grade reading level translations across five major languages:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                <GlassCard className="p-3.5 rounded-2xl text-center">
                  <span className="font-extrabold text-[#1E2532] text-sm">English</span>
                  <p className="text-[11px] text-[#798393]">Default Clinical</p>
                </GlassCard>
                <GlassCard className="p-3.5 rounded-2xl text-center">
                  <span className="font-extrabold text-[#8B5CF6] text-sm">தமிழ்</span>
                  <p className="text-[11px] text-[#798393]">Tamil</p>
                </GlassCard>
                <GlassCard className="p-3.5 rounded-2xl text-center">
                  <span className="font-extrabold text-[#8B5CF6] text-sm">తెలుగు</span>
                  <p className="text-[11px] text-[#798393]">Telugu</p>
                </GlassCard>
                <GlassCard className="p-3.5 rounded-2xl text-center">
                  <span className="font-extrabold text-[#8B5CF6] text-sm">हिन्दी</span>
                  <p className="text-[11px] text-[#798393]">Hindi</p>
                </GlassCard>
                <GlassCard className="p-3.5 rounded-2xl text-center">
                  <span className="font-extrabold text-[#8B5CF6] text-sm">मराठी</span>
                  <p className="text-[11px] text-[#798393]">Marathi</p>
                </GlassCard>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#1E2532] font-medium">Unicode font rendering with proper word-wrapping and script aesthetics.</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#1E2532] font-medium">Persistent language preference preserved throughout session navigation.</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#1E2532] font-medium">Plain-language explanations for all 8 standardized screening pathways.</span>
                </div>
              </div>
            </div>

            {/* Language Preview Card */}
            <GlassCard className="p-6 sm:p-8 rounded-[28px] shadow-lg">
              <div className="flex items-center justify-between pb-4 border-b border-white/80 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  <span className="text-xs font-bold text-[#1E2532]">Patient Portal Example: Mammogram Result</span>
                </div>
                <StatusPill variant="mint" label="Hindi / हिन्दी" size="sm" />
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-extrabold text-[#1E2532] mb-1.5">सरल शब्दों में इसका क्या मतलब है:</h4>
                  <p className="text-xs sm:text-sm text-[#1E2532] leading-relaxed bg-white/70 p-4 rounded-2xl border border-white/80 shadow-2xs">
                    &ldquo;आपकी जांच में एक ऐसा हिस्सा दिखा है जिसे दोबारा ध्यान से देखना ज़रूरी है। ज्यादातर मामलों में यह कैंसर नहीं होता (जैसे सिस्ट या घने ऊतक), लेकिन पूरी तसल्ली के लिए एक अल्ट्रासाउंड आवश्यक है।&rdquo;
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 text-xs text-[#065F46] font-semibold flex items-center gap-2.5">
                  <HeartPulse className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                  <span>घबराएं नहीं, आपकी देखभाल टीम हर कदम पर आपके साथ है।</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button className="h-11 px-4 rounded-xl bg-[#1E2532] text-white font-bold text-xs text-center flex items-center justify-center shadow-xs cursor-pointer">
                    हाँ, मैं समझ गया
                  </button>
                  <button className="h-11 px-4 rounded-xl bg-white/80 text-[#1E2532] font-bold text-xs text-center flex items-center justify-center border border-white/90 hover:bg-white cursor-pointer shadow-2xs">
                    मुफ़्त कॉलबैक मांगें
                  </button>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Security & Governance Section */}
      <section id="governance" className="py-20 lg:py-24 border-b border-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-white/80 text-xs font-bold text-[#1E2532] mb-4 shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-[#10B981]" />
              Enterprise Healthcare Security
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1E2532] tracking-tight mb-4">
              Clinical Safety &amp; Data Isolation Safeguards
            </h2>
            <p className="text-[#798393] text-base sm:text-lg">
              Designed from day one to uphold HIPAA requirements, organizational data boundaries, and strict non-autonomous clinical governance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassCard className="p-6 sm:p-8 rounded-[28px] shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/20 text-[#10B981] flex items-center justify-center mb-6 shadow-2xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-[#1E2532] mb-2">Zero Autonomous Closure</h3>
              <p className="text-xs sm:text-sm text-[#798393] leading-relaxed">
                AI never closes a diagnostic loop, cancels a consult, or overrides clinical judgement. Every loop closure requires human clinician sign-off with attached diagnostic evidence.
              </p>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8 rounded-[28px] shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-6 shadow-2xs">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-[#1E2532] mb-2">Multi-Tenant Isolation</h3>
              <p className="text-xs sm:text-sm text-[#798393] leading-relaxed">
                Health systems maintain strict multi-tenant boundaries. Patient and clinical records belonging to one health system cannot be viewed or accessed by staff of another.
              </p>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8 rounded-[28px] shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/20 text-[#8B5CF6] flex items-center justify-center mb-6 shadow-2xs">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-[#1E2532] mb-2">Immutable Audit Trails</h3>
              <p className="text-xs sm:text-sm text-[#798393] leading-relaxed">
                Every action—notification dispatch, patient portal view, clinical consult message, and procedural sign-off—is permanently recorded with user identity and timestamp.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-20 border-t border-white/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-[#1E2532] tracking-tight mb-4">
            Ready to Close the Care Loop?
          </h2>
          <p className="text-[#798393] text-base mb-8">
            Sign in with your clinical credentials to access your organization&apos;s dedicated workspace.
          </p>
          <Button
            size="lg"
            onClick={handleCtaClick}
            className="bg-[#1E2532] hover:bg-slate-800 text-white font-extrabold text-base px-10 h-14 rounded-2xl shadow-xl shadow-slate-900/10 cursor-pointer"
          >
            Sign In to CareLoop
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Frosted Footer */}
      <footer className="py-12 border-t border-white/80 bg-white/60 backdrop-blur-md text-xs text-[#798393]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-[#10B981]" />
            <span className="font-extrabold text-[#1E2532]">CareLoop Health Systems</span>
            <span>&copy; 2026 CareLoop AI Inc. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[#798393] font-semibold">
            <Link to="/about" className="hover:text-[#1E2532] transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-[#1E2532] transition-colors">Contact</Link>
            <Link to="/help" className="hover:text-[#1E2532] transition-colors">Help Center</Link>
            <Link to="/privacy" className="hover:text-[#1E2532] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#1E2532] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};