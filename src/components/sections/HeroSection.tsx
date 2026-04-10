"use client";

import React, { useEffect, useRef } from "react";

import { NeonButton } from "../ui/NeonButton";
import gsap from "gsap";
import { GlitchText } from "../ui/GlitchText";
import { ScrambleText } from "../ui/ScrambleText";
import dynamic from "next/dynamic";

// Disable SSR for ThreatMap to prevent floating-point hydration mismatch
const ThreatMap = dynamic(
  () => import("../ui/ThreatMap").then(m => ({ default: m.ThreatMap })),
  { ssr: false, loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#030608] border border-primary/20">
      <span className="text-[10px] text-primary/40 font-mono tracking-widest animate-pulse">INITIALIZING THREAT MAP...</span>
    </div>
  )}
);

export function HeroSection() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(headingRef.current,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 1, ease: "power4.out" }
    );

    tl.fromTo(subtextRef.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
      "-=0.6"
    );

    tl.fromTo(ctaRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
      "-=0.4"
    );

    tl.fromTo(mapRef.current,
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 1, ease: "power3.out" },
      "-=0.8"
    );

    return () => { tl.kill(); };
  }, []);

  return (
    <section className="relative pt-12 pb-16 min-h-[90vh] flex flex-col justify-center overflow-hidden">
      {/* Background grids */}
      <div className="absolute inset-0 dot-grid opacity-20 -z-20" />
      <div className="absolute inset-0 motherboard-lines opacity-10 -z-20" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 xl:gap-12 items-start z-10 w-full">

        {/* ── LEFT: Text content ── */}
        <div className="text-left w-full min-w-0 pt-12">
          {/* eyebrow */}
          <div className="mb-6 inline-flex items-center gap-3 px-3 py-1 bg-primary/10 border border-primary/20 text-[11px] text-primary tracking-[0.6em] font-jetbrains uppercase">
            <span className="w-2 h-2 bg-primary animate-pulse" />
            <span>Society of Cyber Security</span>
          </div>

          <h1 ref={headingRef} className="text-5xl md:text-7xl xl:text-[5.5rem] font-bold font-grotesk text-white mb-6 tracking-tighter leading-[1] break-words">
            <GlitchText text="THE CYBER" as="span" className="block text-gray-400" intensity="low" />
            <GlitchText text="ARCHITECTS" as="span" className="text-primary text-glow" intensity="low" />
          </h1>

          <p ref={subtextRef} className="max-w-2xl text-gray-300 font-jetbrains text-base md:text-xl mb-10 leading-relaxed opacity-0">
            <ScrambleText text="Uniting elite researchers, ethical hackers, and security engineers. Learn. Break. Secure. Repeat." delay={1000} />
          </p>

          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-5 opacity-0">
            <NeonButton href="/login" variant="primary" className="px-10 py-4 font-bold text-base">
              Join the Network
            </NeonButton>
            <NeonButton href="/projects" variant="outline" className="px-10 py-4 text-base">
              View Projects
            </NeonButton>
          </div>

        </div>

        {/* ── RIGHT: Threat Map ── */}
        <div ref={mapRef} className="w-full h-[550px] lg:h-[650px] relative opacity-0 mt-8 lg:mt-0">
          {/* Outer frame */}
          <div
            className="absolute inset-0 border border-primary/30 bg-black/60 backdrop-blur-sm shadow-[0_0_50px_rgba(200,255,0,0.05)]"
            style={{ clipPath: "polygon(0 16px, 16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)" }}
          >
            {/* Inner content */}
            <div
              className="absolute inset-[2px] bg-[#010305]"
              style={{ clipPath: "polygon(0 15px, 15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)" }}
            >
              <ThreatMap />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
