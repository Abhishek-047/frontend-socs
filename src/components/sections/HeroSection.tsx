"use client";

import React, { useEffect, useRef } from "react";

import { NeonButton } from "../ui/NeonButton";
import gsap from "gsap";
import { GlitchText } from "../ui/GlitchText";
import { ScrambleText } from "../ui/ScrambleText";
import dynamic from "next/dynamic";

// Disable SSR for Globe3D to prevent Three.js window/document issues
const Globe3D = dynamic(
  () => import("../ui/Globe3D").then(m => ({ default: m.Globe3D })),
  { ssr: false, loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#030608] border border-primary/20">
      <span className="text-[10px] text-primary/40 font-mono tracking-widest animate-pulse">BOOTING GLOBAL_INTERFACE...</span>
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
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      "-=0.8"
    );

    return () => { tl.kill(); };
  }, []);

  return (
    <section className="relative pt-16 pb-16 min-h-[90vh] flex flex-col justify-center overflow-hidden">
      {/* Background grids */}
      <div className="absolute inset-0 dot-grid opacity-20 -z-20" />
      <div className="absolute inset-0 motherboard-lines opacity-10 -z-20" />

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 xl:gap-16 items-center z-10 w-full">

        {/* ── LEFT: Text content ── */}
        <div className="text-left w-full min-w-0 pt-0 lg:pt-12 order-2 lg:order-1">
          {/* eyebrow */}
          <div className="mb-6 inline-flex items-center gap-3 px-3 py-1 bg-primary/10 border border-primary/20 text-[10px] md:text-[11px] text-primary tracking-[0.5em] md:tracking-[0.6em] font-jetbrains uppercase">
            <span className="w-2 h-2 bg-primary animate-pulse" />
            <span>Society of Cyber Security</span>
          </div>

          <h1 ref={headingRef} className="text-4xl sm:text-5xl md:text-7xl xl:text-[5.5rem] font-bold font-grotesk text-white mb-6 tracking-tighter leading-[1] break-words">
            <GlitchText text="THE CYBER" as="span" className="block text-gray-400" intensity="low" />
            <GlitchText text="ARCHITECTS" as="span" className="text-primary text-glow" intensity="low" />
          </h1>

          <p ref={subtextRef} className="max-w-xl text-gray-300 font-jetbrains text-sm md:text-lg mb-10 leading-relaxed opacity-0">
            <ScrambleText text="Uniting elite researchers, ethical hackers, and security engineers. Learn. Break. Secure. Repeat." delay={1000} />
          </p>

          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 opacity-0">
            <NeonButton href="/login" variant="primary" className="px-8 py-3.5 font-bold text-sm md:text-base">
              Join the Network
            </NeonButton>
            <NeonButton href="/projects" variant="outline" className="px-8 py-3.5 text-sm md:text-base">
              View Projects
            </NeonButton>
          </div>
        </div>

        {/* ── RIGHT: 3D Globe ── */}
        <div ref={mapRef} className="w-full h-[400px] sm:h-[500px] lg:h-[600px] xl:h-[700px] relative opacity-0 order-1 lg:order-2 flex items-center justify-center">
            <div className="w-full h-full max-w-full max-h-full">
              <Globe3D />
            </div>
        </div>
      </div>
    </section>
  );
}
