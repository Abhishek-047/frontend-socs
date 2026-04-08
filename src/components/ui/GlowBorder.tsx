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
      className={`relative p-[1px] bg-primary/20 backdrop-blur-sm transition-all duration-300 group hover:bg-primary/50 ${className}`}
      style={{ clipPath: "polygon(0 15px, 15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)" }}
    >
      <div 
        className={`w-full h-full bg-neutral/80 relative z-10 transition-shadow duration-300 ${intensities[intensity]}`}
        style={{ clipPath: "polygon(0 14px, 14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)" }}
      >
      {/* Subtle scanline effect on border hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-white/0 group-hover:from-primary/5 group-hover:to-transparent pointer-events-none transition-colors duration-500"></div>
      
      <div className="relative z-10 w-full h-full">{children}</div>
      </div>
    </div>
  );
}
