import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";

export const LoopRing = ({
  closed,
  size = 56,
  strokeWidth = 5,
  className,
}: {
  closed: boolean;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        <defs>
          <linearGradient id="loopGradientRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DFCBB5" />
            <stop offset="100%" stopColor="#965F2B" />
          </linearGradient>
        </defs>

        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E8DFD3"
          strokeWidth={strokeWidth}
        />

        {/* Animated Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#loopGradientRing)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={closed ? 0 : circumference * 0.35}
          style={{
            transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </svg>

      {/* Center Icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        {closed ? (
          <div className="w-6 h-6 rounded-full bg-teal-brand text-white flex items-center justify-center shadow-xs animate-in zoom-in-75 duration-300">
            <Check size={14} strokeWidth={3} />
          </div>
        ) : (
          <div className="w-5 h-5 rounded-full bg-mint-wash text-teal-brand flex items-center justify-center animate-spin">
            <Loader2 size={13} strokeWidth={2.5} />
          </div>
        )}
      </div>
    </div>
  );
};
