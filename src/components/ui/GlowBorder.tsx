import React from "react";

interface GlowBorderProps {
  children: React.ReactNode;
  className?: string;
  intensity?: "low" | "medium" | "high";
}

export function GlowBorder({ children, className = "", intensity = "medium" }: GlowBorderProps) {
  const intensities = {
    low: "hover:shadow-[0_0_10px_rgba(0,255,65,0.3)]",
    medium: "hover:shadow-[0_0_10px_#C8FF00]",
    high: "hover:shadow-[0_0_10px_#C8FF00,0_0_15px_#C8FF00]",
  };

  return (
    <div
      className={`relative rounded-md border border-primary/20 bg-neutral/50 backdrop-blur-sm transition-all duration-300 group ${intensities[intensity]} ${className}`}
    >
      {/* Subtle scanline effect on border hover */}
      <div className="absolute inset-0 rounded-md bg-gradient-to-b from-white/0 to-white/0 group-hover:from-primary/5 group-hover:to-transparent pointer-events-none transition-colors duration-500"></div>
      
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
