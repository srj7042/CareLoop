import * as React from "react";
import { Link } from "react-router-dom";
import {
  HeartPulse,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Lock,
  ArrowUp,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { StatusPill } from "@/components/design-system";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-10 border-t border-white/80 bg-white/70 backdrop-blur-xl text-[#798393] transition-colors shadow-[0_-12px_32px_rgba(100,115,140,0.04)]">
      {/* Upper Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand & Mission Column (Spans 4 columns on large screens) */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-[#10B981] text-white flex items-center justify-center shadow-md shadow-[#10B981]/25 transition-transform duration-200 group-hover:scale-105">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black text-[#1E2532] tracking-tight">CareLoop</span>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#065F46] border border-[#10B981]/30">
                    AI Health
                  </span>
                </div>
                <p className="text-[10px] font-semibold text-[#798393] uppercase tracking-wider">
                  Screening-to-Care Orchestration
                </p>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-[#798393] leading-relaxed max-w-sm">
              CareLoop AI eliminates diagnostic delays for abnormal cancer and chronic disease screenings by connecting patients, navigators, and physicians in an audited, closed-loop clinical continuum.
            </p>

            {/* Live Operational Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-white/90 shadow-2xs text-[11px] font-semibold text-[#1E2532] hover:shadow-xs transition-all">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
              </span>
              <span>All Systems Operational</span>
              <span className="text-[#798393]">&bull;</span>
              <span className="text-[#10B981] font-bold">99.98% SLA Uptime</span>
            </div>

            {/* Social Media Links */}
            <div className="pt-2">
              <p className="text-[11px] font-bold text-[#1E2532] uppercase tracking-wider mb-2.5">
                Connect With CareLoop
              </p>
              <div className="flex items-center gap-2.5">
                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="CareLoop on LinkedIn"
                  className="w-9 h-9 rounded-full bg-white/80 border border-white hover:bg-white text-[#798393] hover:text-[#0A66C2] shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                </a>

                {/* X (Twitter) */}
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="CareLoop on X (Twitter)"
                  className="w-9 h-9 rounded-full bg-white/80 border border-white hover:bg-white text-[#798393] hover:text-[#1E2532] shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/srj7042/CareLoop"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="CareLoop GitHub Repository"
                  className="w-9 h-9 rounded-full bg-white/80 border border-white hover:bg-white text-[#798393] hover:text-[#1E2532] shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="CareLoop Clinical Video Demos on YouTube"
                  className="w-9 h-9 rounded-full bg-white/80 border border-white hover:bg-white text-[#798393] hover:text-[#FF0000] shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Clinical Navigation (Spans 2 columns) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-black text-[#1E2532] uppercase tracking-wider">
              Clinical Navigation
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/#workflows" className="hover:text-[#1E2532] hover:translate-x-0.5 inline-flex items-center gap-1 transition-all">
                  Closed-Loop Workflow
                </Link>
              </li>
              <li>
                <Link to="/#programs" className="hover:text-[#1E2532] hover:translate-x-0.5 inline-flex items-center gap-1 transition-all">
                  Screening Programs
                </Link>
              </li>
              <li>
                <Link to="/#governance" className="hover:text-[#1E2532] hover:translate-x-0.5 inline-flex items-center gap-1 transition-all">
                  Clinical Governance
                </Link>
              </li>
              <li>
                <Link to="/coordinator" className="hover:text-[#1E2532] hover:translate-x-0.5 inline-flex items-center gap-1 transition-all">
                  Coordinator Worklist
                </Link>
              </li>
              <li>
                <Link to="/director" className="hover:text-[#1E2532] hover:translate-x-0.5 inline-flex items-center gap-1 transition-all">
                  Executive Oversight
                </Link>
              </li>
              <li>
                <Link to="/patient/CASE-001" className="hover:text-[#1E2532] hover:translate-x-0.5 inline-flex items-center gap-1 transition-all">
                  Patient Portal Preview
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Important Resources (Spans 2 columns) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-black text-[#1E2532] uppercase tracking-wider">
              Resources &amp; Support
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/about" className="hover:text-[#1E2532] hover:translate-x-0.5 inline-flex items-center gap-1 transition-all">
                  About CareLoop
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-[#1E2532] hover:translate-x-0.5 inline-flex items-center gap-1 transition-all">
                  Help Center &amp; FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#1E2532] hover:translate-x-0.5 inline-flex items-center gap-1 transition-all">
                  Contact Clinical Team
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#1E2532] hover:translate-x-0.5 inline-flex items-center gap-1 transition-all">
                  Privacy Policy &amp; HIPAA
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#1E2532] hover:translate-x-0.5 inline-flex items-center gap-1 transition-all">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-[#8B5CF6] hover:text-[#7C3AED] hover:translate-x-0.5 inline-flex items-center gap-1 transition-all font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Enterprise Pilot Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Emergency Info (Spans 4 columns) */}
          <div className="lg:col-span-4 space-y-3.5">
            <h4 className="text-xs font-black text-[#1E2532] uppercase tracking-wider">
              Contact &amp; Support
            </h4>
            <div className="space-y-3 text-xs">
              <a
                href="mailto:clinical@careloop.health"
                className="p-3 rounded-2xl bg-white/60 hover:bg-white border border-white/80 shadow-2xs hover:shadow-xs transition-all flex items-center gap-3 text-[#1E2532] font-semibold group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-[#798393] uppercase tracking-wider block font-bold">
                    Clinical Support Inquiries
                  </span>
                  <span className="truncate block font-mono text-xs">clinical@careloop.health</span>
                </div>
              </a>

              <a
                href="tel:+18005555667"
                className="p-3 rounded-2xl bg-white/60 hover:bg-white border border-white/80 shadow-2xs hover:shadow-xs transition-all flex items-center gap-3 text-[#1E2532] font-semibold group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/15 text-[#8B5CF6] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-[#798393] uppercase tracking-wider block font-bold">
                    Hospital Coordination Line
                  </span>
                  <span className="truncate block font-mono text-xs">+1 (800) 555-LOOP (5667)</span>
                </div>
              </a>

              <div className="p-3 rounded-2xl bg-white/60 border border-white/80 shadow-2xs flex items-start gap-3 text-[11px] text-[#798393]">
                <MapPin className="w-4 h-4 text-[#798393] flex-shrink-0 mt-0.5" />
                <span>
                  CareLoop Health Systems &bull; Apex Health Innovation Hub, Boston, MA 02115
                </span>
              </div>

              {/* Emergency Medical Alert Notice */}
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[#92400E] text-[11px] leading-tight">
                <strong>Medical Notice:</strong> CareLoop orchestrates diagnostic navigation. If experiencing an acute medical emergency, call 911 or visit the nearest emergency department immediately.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Footer Bottom Bar */}
      <div className="border-t border-white/80 bg-white/80 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#798393]">
          {/* Copyright & Tagline */}
          <div className="flex items-center gap-2 text-center md:text-left">
            <span className="font-extrabold text-[#1E2532]">CareLoop Health Systems</span>
            <span>&copy; {currentYear} CareLoop AI Inc. All rights reserved.</span>
          </div>

          {/* Trust Safeguards & Back to Top Button */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-semibold">
            <span className="inline-flex items-center gap-1.5 text-[#10B981]">
              <ShieldCheck className="w-3.5 h-3.5" />
              HIPAA Aligned
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="inline-flex items-center gap-1.5 text-[#1E2532]">
              <Lock className="w-3.5 h-3.5 text-[#8B5CF6]" />
              256-Bit TLS
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="inline-flex items-center gap-1.5 text-[#1E2532]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
              Human-in-the-Loop Sign-Off
            </span>

            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              aria-label="Scroll back to top of page"
              className="ml-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-white/90 text-[#1E2532] hover:text-[#10B981] hover:border-[#10B981]/40 shadow-2xs hover:shadow-xs transition-all cursor-pointer font-bold"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
