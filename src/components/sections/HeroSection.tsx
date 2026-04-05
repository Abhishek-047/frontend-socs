"use client";

import React, { useEffect, useRef } from "react";
import { NeonButton } from "../ui/NeonButton";
import gsap from "gsap";
import { Activity } from "lucide-react";
import { GlitchText } from "../ui/GlitchText";

export function HeroSection() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

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
    
    return () => { tl.kill(); };
  }, []);

  return (
    <section className="relative pt-32 pb-20 min-h-[95vh] flex flex-col justify-center overflow-hidden">
      {/* Background dot grid and accent lines */}
      <div className="absolute inset-0 dot-grid opacity-20 -z-20"></div>
      <div className="absolute inset-0 motherboard-lines opacity-10 -z-20"></div>
      

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-12 xl:gap-20 items-center z-10 w-full">
        <div className="text-left w-full min-w-0">
          <div className="hero-text-animate mb-6 inline-flex items-center gap-2 text-[10px] text-primary/40 tracking-[0.5em] font-jetbrains uppercase">
            <div className="w-2 h-2 bg-primary/40"></div>
            <span>Society of Cyber Security</span>
          </div>

          <h1 ref={headingRef} className="text-5xl md:text-7xl xl:text-[5.5rem] font-bold font-grotesk text-white mb-8 tracking-tighter leading-[0.9] break-words">
            <GlitchText text="THE CYBER" as="span" className="block text-gray-500" intensity="high" />
            <GlitchText text="ARCHITECTS" as="span" className="text-primary text-glow" intensity="high" />
          </h1>
          
          <p ref={subtextRef} className="max-w-xl text-gray-400 font-jetbrains text-lg md:text-xl mb-12 leading-relaxed opacity-0">
            Uniting elite researchers, ethical hackers, and security engineers. 
            Learn. Break. Secure. Repeat.
          </p>
          
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-6 opacity-0">
            <NeonButton href="/join" variant="primary" className="px-10 py-4 font-bold">
              Join the Network
            </NeonButton>
            <NeonButton href="/projects" variant="outline" className="px-10 py-4">
              View Projects
            </NeonButton>
          </div>
        </div>

        
      </div>

      {/* Floating accent elements */}
      <div className="absolute bottom-10 left-10 hidden xl:block">
        <div className="text-[8px] text-gray-600 font-mono tracking-[0.4em] rotate-90 origin-left uppercase">
          SOCS_Network_Protocol_v2.5
        </div>
      </div>
    </section>
  );
}
