import * as React from "react";
import { Link } from "react-router-dom";
import {
  HeartPulse,
  Search,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard, StatusPill } from "@/components/design-system";
import { Footer } from "@/components/Footer";

interface FAQItem {
  question: string;
  answer: string;
  category: "patient" | "coordinator" | "clinician" | "security";
}

const FAQS: FAQItem[] = [
  {
    category: "patient",
    question: "How do patients receive and acknowledge abnormal screening results?",
    answer:
      "Patients receive multi-channel notifications (secure SMS, WhatsApp, and patient portal alerts) with zero technical jargon. They can confirm receipt in 1 tap, submit questions directly to their navigator, or request an immediate callback within 2 hours.",
  },
  {
    category: "patient",
    question: "What languages does the CareLoop Patient Experience support?",
    answer:
      "CareLoop natively translates all screening explanations, care timelines, and booking instructions into English, Tamil (தமிழ்), Telugu (తెలుగు), Hindi (हिन्दी), and Marathi (मराठी) with medically verified translations.",
  },
  {
    category: "clinician",
    question: "Can AI close a screening case autonomously?",
    answer:
      "Never. CareLoop enforces a strict Zero Autonomous Closure policy. While AI helps identify delay risk and organize worklists, closing a clinical loop requires human clinician sign-off with verifiable diagnostic evidence (attended procedure note, pathology report, or documented clinical rationale).",
  },
  {
    category: "coordinator",
    question: "How are SLA deadlines and overdue nudges calculated?",
    answer:
      "Each health system configures SLA thresholds (e.g. 72 hours for urgent breast or lung nodule findings). If no patient confirmation or referral action occurs within the threshold window, the case automatically escalates to the overdue queue and triggers targeted clinical reminders.",
  },
  {
    category: "security",
    question: "Is patient data shared across different participating health systems?",
    answer:
      "No. CareLoop enforces strict multi-tenant organizational isolation. Clinicians, coordinators, and administrators can only query and view records belonging to their authorized health system and assigned facilities.",
  },
  {
    category: "security",
    question: "How does CareLoop comply with HIPAA and HITECH regulations?",
    answer:
      "CareLoop implements administrative, physical, and technical safeguards including TLS 1.3 in-transit encryption, AES-256 at-rest storage, granular role-based permissions (RBAC), and immutable cryptographic audit logging for every record access.",
  },
];

export const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<"all" | "patient" | "coordinator" | "clinician" | "security">("all");
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(0);

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesQuery =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

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
            <Link to="/help" className="text-[#1E2532] font-bold">Help Center</Link>
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
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        {/* Search Hero */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <StatusPill variant="lavender" label="Clinical Knowledge Base &amp; FAQ" size="sm" />
          <h1 className="text-3xl sm:text-4xl font-black text-[#1E2532] tracking-tight">
            How Can We Assist Your Clinical Team?
          </h1>
          <p className="text-xs sm:text-sm text-[#798393]">
            Explore clinical protocols, navigation best practices, and integration documentation.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto pt-2">
            <Search className="w-4 h-4 text-[#798393] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic (e.g. closure evidence, SLA thresholds, HIPAA, languages)..."
              className="w-full pl-11 pr-4 h-12 bg-white/90 border border-white/80 focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 rounded-2xl text-xs sm:text-sm font-semibold text-[#1E2532] placeholder:text-[#798393] outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: "all", label: "All Topics" },
            { id: "clinician", label: "Clinicians & Doctors" },
            { id: "coordinator", label: "Care Coordinators" },
            { id: "patient", label: "Patient Experience" },
            { id: "security", label: "HIPAA & Security" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-white text-[#1E2532] shadow-sm border border-white"
                  : "bg-white/60 text-[#798393] hover:text-[#1E2532] hover:bg-white/80"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3 max-w-3xl mx-auto">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isExpanded = expandedIndex === idx;
              return (
                <GlassCard
                  key={idx}
                  className="p-0 rounded-[22px] overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left hover:bg-white/60 transition-colors cursor-pointer"
                  >
                    <span className="font-extrabold text-sm text-[#1E2532]">{faq.question}</span>
                    <span className="p-1.5 rounded-xl bg-white/80 text-[#798393] flex-shrink-0 shadow-2xs">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 text-xs text-[#798393] leading-relaxed border-t border-white/60 animate-in fade-in">
                      {faq.answer}
                    </div>
                  )}
                </GlassCard>
              );
            })
          ) : (
            <GlassCard className="p-8 text-center rounded-[24px] space-y-2">
              <p className="text-sm font-bold text-[#1E2532]">No matching guides found</p>
              <p className="text-xs text-[#798393]">Try searching with a different term or clear your filter.</p>
            </GlassCard>
          )}
        </div>

        {/* Quick Links to Support */}
        <GlassCard className="p-8 rounded-[28px] max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-base font-black text-[#1E2532]">Need Dedicated Hospital Support?</h3>
            <p className="text-xs text-[#798393]">
              Our clinical informatics team is available 24/7 for contracted health system partners.
            </p>
          </div>
          <Link to="/contact">
            <Button className="bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold h-10 px-5 rounded-xl flex-shrink-0 shadow-xs cursor-pointer">
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Help Desk
            </Button>
          </Link>
        </GlassCard>
      </main>

      {/* Modern Responsive Footer */}
      <Footer />
    </div>
  );
};