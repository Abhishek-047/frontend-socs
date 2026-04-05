"use client";

import React, { useEffect, useRef } from "react";
import { animateCounter } from "../../lib/animations";
import { Shield } from "lucide-react";

export function StatsSection() {
  const membersRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const ctfsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (membersRef.current) animateCounter(membersRef.current, 42);
    if (projectsRef.current) animateCounter(projectsRef.current, 15);
    if (ctfsRef.current) animateCounter(ctfsRef.current, 8);
  }, []);

  return (
    <section className="py-10 mb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="dashboard-card p-10 text-center relative group overflow-hidden border-t-2 border-t-primary/30">
          <div className="absolute top-0 left-0 p-2 text-[8px] text-gray-500 font-bold tracking-widest uppercase">Metric_001</div>
          <div className="text-6xl font-grotesk font-bold text-primary text-glow mb-4 inline-flex items-center">
            <span ref={membersRef}>0</span><span className="text-3xl ml-1">+</span>
          </div>
          <div className="font-jetbrains text-gray-400 uppercase tracking-[0.3em] text-xs">Active_Members</div>
          <div className="mt-6 flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1 h-3 bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>)}
          </div>
        </div>

        <div className="dashboard-card p-10 text-center relative group overflow-hidden border-t-2 border-t-[#6200EA]/30">
          <div className="absolute top-0 left-0 p-2 text-[8px] text-gray-500 font-bold tracking-widest uppercase">Metric_002</div>
          <div className="text-6xl font-grotesk font-bold text-white mb-4 inline-flex items-center">
            <span ref={projectsRef}>0</span><span className="text-3xl ml-1">+</span>
          </div>
          <div className="font-jetbrains text-gray-400 uppercase tracking-[0.3em] text-xs">Research_Projects</div>
          <div className="mt-6 w-full h-[1px] bg-gradient-to-r from-transparent via-[#6200EA]/50 to-transparent"></div>
        </div>

        <div className="dashboard-card p-10 text-center relative group overflow-hidden border-t-2 border-t-primary/30">
          <div className="absolute top-0 left-0 p-2 text-[8px] text-gray-500 font-bold tracking-widest uppercase">Metric_003</div>
          <div className="text-6xl font-grotesk font-bold text-primary text-glow mb-4 inline-flex items-center">
            <span ref={ctfsRef}>0</span>
          </div>
          <div className="font-jetbrains text-gray-400 uppercase tracking-[0.3em] text-xs">CTF_Victories</div>
          <div className="mt-6 flex justify-between items-end">
             <div className="w-10 h-10 border border-primary/20 flex items-center justify-center">
               <Shield className="w-4 h-4 text-primary" />
             </div>
             <div className="text-[8px] text-primary/40 font-mono tracking-tighter">NODE_READY</div>
          </div>
        </div>
      </div>
    </section>
  );
}
