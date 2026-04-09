"use client";

import { useEffect, useRef } from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { fadeUpOnScroll } from "../../lib/animations";
import { Activity } from "lucide-react";

export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      fadeUpOnScroll(sectionRef.current);
    }
  }, []);

  return (
    <section ref={sectionRef} className="py-20 border-t border-primary/5 opacity-0">
      <SectionHeader title="Mission Statement" />
      
      <div className="max-w-4xl mx-auto dashboard-card rounded-sm p-8 border-l-2 border-l-primary relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <Activity className="w-40 h-40 text-primary" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3 text-[10px] text-primary/60 tracking-[0.4em] font-bold uppercase mb-4">
              <span>Operational_Directive</span>
            </div>
            
            <p className="text-gray-300 text-lg leading-relaxed font-jetbrains">
              The Society of Cyber Security (SOCS) is an interdisciplinary organization dedicated to the exploration, research, and dissemination of computer security knowledge.
            </p>
            <p className="text-gray-400 text-base leading-relaxed">
              We bridge the gap between theoretical academia and practical hacking. By fostering a collaborative ecosystem, we empower the next generation of researchers to secure the digital frontier through deep exploitation analysis.
            </p>
            
            <div className="pt-6 flex gap-4">
              <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-sm text-[10px] text-primary font-bold tracking-widest uppercase">
                Ethical_First
              </div>
              <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-sm text-[10px] text-primary font-bold tracking-widest uppercase">
                Research_Led
              </div>
            </div>
          </div>

          <div className="w-px h-full bg-white/5 hidden md:block self-stretch"></div>

          <div className="md:w-1/3">
             <div className="text-[10px] text-gray-500 tracking-widest mb-4 uppercase">Executive_Quote</div>
             <p className="text-xl font-grotesk text-white leading-tight italic grayscale group-hover:grayscale-0 transition-all duration-500">
               "We build it up, tear it down, and figure out how it ticks."
             </p>
          </div>
        </div>
      </div>
    </section>
  );
}
