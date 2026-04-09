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
        <div className="text-left w-full min-w-0">
          {/* eyebrow */}
          <div className="mb-5 inline-flex items-center gap-2 text-[10px] text-primary/40 tracking-[0.5em] font-jetbrains uppercase">
            <span className="w-2 h-2 bg-primary/40 animate-pulse" />
            <span>Society of Cyber Security</span>
          </div>

          <h1 ref={headingRef} className="text-4xl md:text-5xl xl:text-[4rem] font-bold font-grotesk text-white mb-5 tracking-tighter leading-[1.05] break-words">
            <GlitchText text="THE CYBER" as="span" className="block text-gray-500" intensity="low" />
            <GlitchText text="ARCHITECTS" as="span" className="text-primary text-glow" intensity="low" />
          </h1>

          <p ref={subtextRef} className="max-w-lg text-gray-400 font-jetbrains text-sm md:text-base mb-8 leading-relaxed opacity-0">
            <ScrambleText text="Uniting elite researchers, ethical hackers, and security engineers. Learn. Break. Secure. Repeat." delay={1000} />
          </p>

          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 opacity-0">
            <NeonButton href="/join" variant="primary" className="px-8 py-3 font-bold text-sm">
              Join the Network
            </NeonButton>
            <NeonButton href="/projects" variant="outline" className="px-8 py-3 text-sm">
              View Projects
            </NeonButton>
          </div>

          {/* Status strip */}
          <div className="mt-10 flex items-center gap-4 text-[9px] text-gray-600 font-mono tracking-widest">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              SYSTEM_ONLINE
            </span>
            <span className="text-gray-800">|</span>
            <span>NODE_COUNT: 42</span>
            <span className="text-gray-800">|</span>
            <span>ENC: AES-256</span>
          </div>
        </div>

        {/* ── RIGHT: Threat Map ── */}
        <div ref={mapRef} className="w-full h-[520px] lg:h-[600px] relative opacity-0">
          {/* Outer frame */}
          <div
            className="absolute inset-0 border border-primary/30 bg-black/60 backdrop-blur-sm"
            style={{ clipPath: "polygon(0 16px, 16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)" }}
          >
            {/* Inner content */}
            <div
              className="absolute inset-[1px] bg-[#020508]"
              style={{ clipPath: "polygon(0 15px, 15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)" }}
            >
              <ThreatMap />
            </div>
          </div>

          {/* Corner accent labels */}
          <div className="absolute -top-4 left-0 text-[8px] text-primary/50 font-mono tracking-widest">THREAT_MAP_v3.1</div>
          <div className="absolute -bottom-4 right-0 text-[8px] text-gray-700 font-mono">LIVE // ENCRYPTED</div>
        </div>
      </div>

      {/* Bottom left watermark */}
      <div className="absolute bottom-8 left-0 hidden xl:block">
        <div className="text-[8px] text-gray-700 font-mono tracking-[0.4em] rotate-90 origin-left uppercase">
          SOCS_Network_Protocol_v2.5
        </div>
      </div>
    </section>
  );
}
