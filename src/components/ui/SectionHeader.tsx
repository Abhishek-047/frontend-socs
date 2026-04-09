import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

import { GlitchText } from "./GlitchText";
import { ScrambleText } from "./ScrambleText";

export function SectionHeader({ title, subtitle, className = "" }: SectionHeaderProps) {
  return (
    <div className={`mb-12 ${className}`}>
      <h2 className="text-3xl md:text-4xl font-grotesk font-bold text-white flex items-center relative group">
        <span className="text-primary font-jetbrains mr-3 opacity-80 group-hover:opacity-100 transition-opacity">
          &gt;_
        </span>
        <GlitchText text={title} className="text-white" />
      </h2>
      {subtitle && (
        <p className="mt-4 text-gray-400 font-jetbrains text-sm md:text-base max-w-2xl border-l-2 border-primary/30 pl-4">
          <ScrambleText text={subtitle} delay={200} />
        </p>
      )}
    </div>
  );
}
