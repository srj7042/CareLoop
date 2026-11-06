import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  HeartPulse,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

export interface HeroAnimatedStageProps {
  className?: string;
}

export const HeroAnimatedStage: React.FC<HeroAnimatedStageProps> = ({ className = "" }) => {
  const shouldReduceMotion = useReducedMotion();

  // Three clinical nodes
  const nodes = [
    {
      step: "01",
      title: "Screening",
      subtitle: "Abnormal Finding Detected",
      status: "Ingested via HL7 / EHR",
      icon: Activity,
      accent: "#609983",
      badge: "Detected",
      badgeVariant: "mint",
    },
    {
      step: "02",
      title: "Follow-up",
      subtitle: "Navigated & Scheduled",
      status: "Dedicated Coordinator Outreach",
      icon: HeartPulse,
      accent: "#609983",
      badge: "Active Care",
      badgeVariant: "brand",
    },
    {
      step: "03",
      title: "Care Completed",
      subtitle: "Verified Loop Closure",
      status: "Documented Human Sign-off",
      icon: ShieldCheck,
      accent: "#1E2522",
      badge: "Loop Closed ✓",
      badgeVariant: "verified",
    },
  ];

  return (
    <div
      className={`relative w-full max-w-5xl mx-auto my-8 sm:my-12 px-4 select-none ${className}`}
      aria-label="CareLoop Closed-Loop Patient Navigation Stage"
    >
      {/* Soft Ambient Radial Backlights */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[340px] sm:h-[460px] bg-gradient-to-tr from-[#609983]/15 via-[#C6DDD3]/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Main Glass Stage Showcase */}
      <div className="relative rounded-3xl bg-white/70 backdrop-blur-xl border border-[#E8ECE9] shadow-[0_16px_40px_-12px_rgba(30,37,34,0.06)] p-6 sm:p-10 overflow-hidden">
        {/* Subtle background decorative grid / aura */}
        <div
          className="absolute inset-0 bg-[radial-gradient(#C6DDD3_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col items-center">
          {/* Top Label Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7F2ED] border border-[#C6DDD3] text-[11px] font-bold text-[#609983] mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Continuity &bull; Human Final Authority</span>
          </div>

          {/* Centered Floating 3D Glass Orb Stage */}
          <div className="relative flex flex-col items-center justify-center my-2 sm:my-4">
            {/* The 3D Glass Orb */}
            <motion.div
              className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full flex items-center justify-center cursor-pointer group"
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      y: [-8, 8, -8],
                      rotate: [0, 1.5, -1.5, 0],
                    }
              }
              transition={{
                duration: 6,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              style={{
                // Multi-layered realistic 3D glass rendering
                background:
                  "radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.45) 22%, rgba(231, 242, 237, 0.25) 50%, rgba(96, 153, 131, 0.35) 85%, rgba(30, 37, 34, 0.15) 100%)",
                boxShadow:
                  "inset 0 2px 6px rgba(255, 255, 255, 0.9), inset 0 -12px 24px rgba(96, 153, 131, 0.35), inset 0 0 20px rgba(255, 255, 255, 0.5), 0 24px 48px -12px rgba(96, 153, 131, 0.28)",
                backdropFilter: "blur(14px)",
                border: "1.5px solid rgba(255, 255, 255, 0.8)",
              }}
            >
              {/* Specular Highlight Glint */}
              <div
                className="absolute top-4 left-6 sm:top-6 sm:left-8 w-12 sm:w-16 h-6 sm:h-8 rounded-full bg-white/70 blur-[1px] -rotate-45 pointer-events-none"
                aria-hidden="true"
              />

              {/* Secondary Bottom Caustic Glow */}
              <div
                className="absolute bottom-4 right-6 w-16 h-8 rounded-full bg-[#609983]/30 blur-md pointer-events-none"
                aria-hidden="true"
              />

              {/* Outer Pulsing Heartbeat Aureole Waves */}
              {!shouldReduceMotion && (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-full border border-[#609983]/40 pointer-events-none"
                    animate={{
                      scale: [1, 1.35],
                      opacity: [0.65, 0],
                    }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border border-[#609983]/30 pointer-events-none"
                    animate={{
                      scale: [1, 1.55],
                      opacity: [0.45, 0],
                    }}
                    transition={{
                      duration: 2.4,
                      delay: 0.35,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                </>
              )}

              {/* Inner Heartbeat Core & Clinical Pulse */}
              <div className="relative z-10 flex flex-col items-center justify-center p-4">
                {/* Heartbeat Pulse Icon */}
                <motion.div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/80 backdrop-blur-md border border-white shadow-md flex items-center justify-center text-[#609983]"
                  animate={
                    shouldReduceMotion
                      ? {}
                      : {
                          // Medical heartbeat rhythm (lub-dub pulse)
                          scale: [1, 1.14, 1, 1.22, 1],
                        }
                  }
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    times: [0, 0.12, 0.22, 0.36, 1],
                    ease: "easeInOut",
                  }}
                >
                  <HeartPulse className="w-8 h-8 sm:w-9 sm:h-9 text-[#609983]" />
                </motion.div>

                {/* Subtitle Inside Orb */}
                <span className="mt-2 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#1E2522]">
                  CareLoop Pulse
                </span>
                <span className="text-[9px] font-semibold text-[#5B6660]">
                  Closed-Loop Active
                </span>
              </div>
            </motion.div>

            {/* Dynamic Ground Shadow */}
            <motion.div
              className="w-32 sm:w-44 h-4 mt-4 rounded-[100%] bg-gradient-to-r from-transparent via-[#1E2522]/15 to-transparent blur-md"
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      scaleX: [1, 0.86, 1],
                      opacity: [0.35, 0.2, 0.35],
                    }
              }
              transition={{
                duration: 6,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              aria-hidden="true"
            />
          </div>

          {/* Connected Pathways SVG Conduits (Visible on Medium+ screens) */}
          <div className="w-full relative mt-6 mb-2 hidden md:block">
            <svg
              className="w-full h-8 overflow-visible"
              viewBox="0 0 800 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Static Background Conduit Track */}
              <path
                d="M 140 16 L 400 16 L 660 16"
                stroke="#C6DDD3"
                strokeWidth="2.5"
                strokeDasharray="6 6"
              />

              {/* Animated Traveling Pulse Beam */}
              {!shouldReduceMotion && (
                <motion.line
                  x1="120"
                  y1="16"
                  x2="200"
                  y2="16"
                  stroke="#609983"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  initial={{ x: 0, opacity: 0 }}
                  animate={{
                    x: [0, 480],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </svg>
          </div>

          {/* Three Connected Glowing Nodes (Screening → Follow-up → Care Completed) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full mt-4">
            {nodes.map((node, index) => {
              const IconComponent = node.icon;
              return (
                <motion.div
                  key={node.step}
                  className="relative p-4 sm:p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-[#E8ECE9] hover:border-[#609983]/60 shadow-sm hover:shadow-md transition-all duration-200 card-hover flex flex-col justify-between group"
                  whileHover={shouldReduceMotion ? {} : { y: -3 }}
                >
                  <div>
                    {/* Top Row: Step Tag + Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-[#E7F2ED] text-[#609983] font-black text-xs flex items-center justify-center border border-[#C6DDD3]">
                          {node.step}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#5B6660]">
                          Node
                        </span>
                      </div>

                      {/* Status Beacon Badge */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          node.badgeVariant === "verified"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : node.badgeVariant === "brand"
                            ? "bg-[#E7F2ED] text-[#609983] border-[#C6DDD3]"
                            : "bg-[#F7F8F5] text-[#1E2522] border-[#E8ECE9]"
                        }`}
                      >
                        {node.badge}
                      </span>
                    </div>

                    {/* Node Title & Icon */}
                    <div className="flex items-start gap-3 my-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E7F2ED] to-white border border-[#C6DDD3] flex items-center justify-center text-[#609983] shadow-2xs group-hover:scale-105 transition-transform">
                        <IconComponent className="w-5 h-5 text-[#609983]" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm sm:text-base text-[#1E2522] leading-tight">
                          {node.title}
                        </h4>
                        <p className="text-xs text-[#5B6660] font-medium mt-0.5">
                          {node.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Node Footer Info */}
                  <div className="mt-4 pt-3 border-t border-[#E8ECE9] flex items-center justify-between text-[11px]">
                    <span className="text-[#5B6660] font-medium truncate">
                      {node.status}
                    </span>
                    <span className="flex h-2 w-2 relative ml-2">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          index === 2 ? "bg-emerald-400" : "bg-[#609983]"
                        }`}
                      />
                      <span
                        className={`relative inline-flex rounded-full h-2 w-2 ${
                          index === 2 ? "bg-emerald-600" : "bg-[#609983]"
                        }`}
                      />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Pathway Indicator Text */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-[#5B6660]">
            <span className="flex items-center gap-1 text-[#1E2522]">
              <Clock className="w-3.5 h-3.5 text-[#609983]" />
              Continuous Closed-Loop Pipeline:
            </span>
            <span className="text-[#609983] font-bold">Screening</span>
            <span className="text-[#C6DDD3]">&rarr;</span>
            <span className="text-[#609983] font-bold">Follow-up</span>
            <span className="text-[#C6DDD3]">&rarr;</span>
            <span className="text-emerald-700 font-bold">Care Completed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

