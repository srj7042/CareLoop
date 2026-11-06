import * as React from "react";
import { Link } from "react-router-dom";
import {
  HeartPulse,
  Mail,
  Phone,
  Building2,
  Clock,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Headphones,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard, StatusPill } from "@/components/design-system";

export const ContactUs: React.FC = () => {
  const [formData, setFormData] = React.useState({
    fullName: "",
    workEmail: "",
    organization: "",
    role: "Clinical Director",
    inquiryType: "pilot",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

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
            <Link to="/contact" className="text-[#1E2532] font-bold">Contact</Link>
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
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
          <StatusPill variant="lavender" label="Direct Hospital Support &amp; Inquiries" size="sm" />
          <h1 className="text-3xl sm:text-4xl font-black text-[#1E2532] tracking-tight">
            Connect With Our Clinical Enterprise Team
          </h1>
          <p className="text-xs sm:text-sm text-[#798393] leading-relaxed">
            Whether you are evaluating a health system deployment, requesting clinical onboarding, or seeking immediate technical support, our team is ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Form */}
          <GlassCard className="lg:col-span-7 p-6 sm:p-10 rounded-[28px]">
            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center mx-auto text-[#10B981]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-[#1E2532]">Inquiry Received</h3>
                <p className="text-xs sm:text-sm text-[#798393] max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{formData.fullName}</strong>. A CareLoop healthcare solutions director will review your request for <strong>{formData.organization}</strong> and reach out within 1 business day.
                </p>
                <Button
                  onClick={() => setSubmitted(false)}
                  className="bg-[#1E2532] hover:bg-slate-800 text-white text-xs font-bold h-10 px-6 rounded-xl mt-2 shadow-xs"
                >
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <h2 className="text-lg font-black text-[#1E2532] mb-4">Enterprise Contact Form</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1E2532] uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Dr. Jennifer Hayes"
                      className="w-full h-11 px-3.5 rounded-xl border border-white/80 bg-white/80 text-xs font-semibold text-[#1E2532] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E2532] uppercase tracking-wider mb-1.5">
                      Clinical Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.workEmail}
                      onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                      placeholder="j.hayes@healthsystem.org"
                      className="w-full h-11 px-3.5 rounded-xl border border-white/80 bg-white/80 text-xs font-semibold text-[#1E2532] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1E2532] uppercase tracking-wider mb-1.5">
                      Health System / Facility *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="e.g. Northwest Health Alliance"
                      className="w-full h-11 px-3.5 rounded-xl border border-white/80 bg-white/80 text-xs font-semibold text-[#1E2532] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E2532] uppercase tracking-wider mb-1.5">
                      Inquiry Focus
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-xl border border-white/80 bg-white/80 text-xs font-semibold text-[#1E2532] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 shadow-2xs"
                    >
                      <option value="pilot">Enterprise Clinical Pilot Request</option>
                      <option value="ehr">EHR Integration (Epic / Cerner FHIR)</option>
                      <option value="compliance">HIPAA BAA &amp; Security Review</option>
                      <option value="support">Active Hospital Technical Support</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E2532] uppercase tracking-wider mb-1.5">
                    Message / Clinical Requirements *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your current screening follow-up volume, EHR environment, or questions regarding closed-loop tracking..."
                    className="w-full p-3.5 rounded-xl border border-white/80 bg-white/80 text-xs font-medium text-[#1E2532] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 shadow-2xs"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-[#1E2532] hover:bg-slate-800 text-white font-extrabold text-xs h-11 px-8 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      "Transmitting Encrypted Dispatch..."
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Send Enterprise Inquiry
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-[11px] text-[#798393] pt-2">
                  We respect healthcare confidentiality. No Protected Health Information (PHI) should be entered in this general contact form.
                </p>
              </form>
            )}
          </GlassCard>

          {/* Right Column: Contact Details & Escalation Directory */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <GlassCard className="p-6 rounded-[28px] space-y-4">
              <h3 className="text-base font-extrabold text-[#1E2532] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#8B5CF6]" />
                Headquarters &amp; Direct Lines
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#1E2532] block">Clinical Enterprise Team</span>
                    <a href="mailto:solutions@careloop.health" className="text-[#8B5CF6] hover:underline font-mono">
                      solutions@careloop.health
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#1E2532] block">Institutional Advisory Desk</span>
                    <span className="text-[#798393] font-mono">+1 (800) 555-LOOP (5667)</span>
                    <span className="text-[10px] text-[#798393] block">Mon–Fri: 8:00 AM – 7:00 PM EST</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Lock className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#1E2532] block">HIPAA Privacy &amp; Security Officer</span>
                    <a href="mailto:compliance@careloop.health" className="text-[#8B5CF6] hover:underline font-mono">
                      compliance@careloop.health
                    </a>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Critical Incident Escalation Banner */}
            <GlassCard variant="subtle" className="p-5 rounded-[24px] space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#10B981] font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Active Hospital SLA Priority Support</span>
              </div>
              <p className="text-[#798393] leading-relaxed">
                Health systems running CareLoop enterprise workflows receive 24/7 dedicated engineering and tier-3 clinical coordination escalation via their contracted SLA portal.
              </p>
            </GlassCard>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/80 bg-white/60 backdrop-blur-md text-xs text-[#798393] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-[#10B981]" />
            <span className="font-extrabold text-[#1E2532]">CareLoop Health Systems</span>
            <span>&copy; {new Date().getFullYear()} CareLoop AI Inc. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[#798393] font-semibold">
            <Link to="/privacy" className="hover:text-[#1E2532]">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#1E2532]">Terms of Service</Link>
            <Link to="/help" className="hover:text-[#1E2532]">Help Center</Link>
            <Link to="/about" className="hover:text-[#1E2532]">About Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};