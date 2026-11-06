import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HeartPulse,
  Home,
  ArrowLeft,
  LifeBuoy,
  FileQuestion,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#1E2522] flex flex-col font-sans selection:bg-[#609983]/20 selection:text-[#609983]">
      {/* Header */}
      <header className="backdrop-blur-md bg-white/95 border-b border-[#E8ECE9] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#609983] to-[#1E2522] flex items-center justify-center shadow-md shadow-[#609983]/20">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-[#1E2522]">CareLoop</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#E7F2ED] text-[#609983] border border-[#E8ECE9] tracking-wider">
                  AI HEALTH
                </span>
              </div>
              <p className="text-[11px] text-[#5B6660] font-medium">Closing the Screening-to-Care Loop</p>
            </div>
          </Link>

          <Link to="/login">
            <Button className="bg-[#1E2522] hover:bg-[#609983] text-white font-bold text-sm px-5 h-10 rounded-xl shadow-md">
              Sign In to Portal
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-2xl bg-[#E7F2ED] border border-[#E8ECE9] mx-auto flex items-center justify-center text-[#609983] shadow-inner">
            <FileQuestion className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-extrabold text-[#609983] uppercase tracking-widest bg-[#E7F2ED] px-3 py-1 rounded-full border border-[#E8ECE9]">
              Error 404 • Resource Not Found
            </span>
            <h1 className="text-3xl font-extrabold text-[#1E2522] tracking-tight">
              Page or Clinical Resource Not Found
            </h1>
            <p className="text-sm text-[#5B6660] leading-relaxed">
              The destination you requested does not exist, has been archived, or requires verified clinician or patient authorization.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="w-full sm:w-auto border-[#E8ECE9] text-[#1E2522] hover:bg-white text-xs h-11 px-5 rounded-xl font-semibold gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            <Link to="/" className="w-full sm:w-auto">
              <Button className="w-full bg-[#609983] hover:bg-[#52826f] text-white font-bold text-xs h-11 px-6 rounded-xl shadow-md gap-2">
                <Home className="w-4 h-4" />
                Return to Home
              </Button>
            </Link>
          </div>

          <div className="pt-6 border-t border-[#E8ECE9] flex items-center justify-center gap-6 text-xs text-[#5B6660]">
            <Link to="/login" className="flex items-center gap-1.5 hover:text-[#1E2522] font-medium">
              <LogIn className="w-3.5 h-3.5 text-[#609983]" />
              Sign In
            </Link>
            <Link to="/help" className="flex items-center gap-1.5 hover:text-[#1E2522] font-medium">
              <LifeBuoy className="w-3.5 h-3.5 text-[#609983]" />
              Help Center
            </Link>
            <Link to="/contact" className="hover:text-[#1E2522] font-medium">
              Contact Support
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-[#E8ECE9] bg-[#F7F8F5] text-xs text-[#5B6660]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-[#609983]" />
            <span className="font-extrabold text-[#1E2522]">CareLoop Health Systems</span>
            <span>&copy; 2026 CareLoop AI Inc.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-[#1E2522]">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#1E2522]">Terms</Link>
            <Link to="/contact" className="hover:text-[#1E2522]">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
