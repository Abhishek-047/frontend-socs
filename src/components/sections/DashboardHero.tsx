"use client";

import { useEffect, useRef } from "react";
import { GlitchText } from "../ui/GlitchText";
import { NeonButton } from "../ui/NeonButton";
import gsap from "gsap";
import { Shield, Cpu, Zap, Activity, Globe, Terminal } from "lucide-react";

export function DashboardHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(".dashboard-frame", 
      { opacity: 0, scale: 0.98 },
      { opacity: 1, scale: 1, duration: 1.2, ease: "power4.out" }
    );

    tl.fromTo(".hero-text-animate",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" },
      "-=0.6"
    );

    tl.fromTo(".metric-card",
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)" },
      "-=0.4"
    );

    return () => { tl.kill(); };
  }, []);

  return (
    <div ref={containerRef} className="w-full max-w-7xl mx-auto px-4 py-12 font-jetbrains">
      {/* Main Dashboard Frame */}
      <div className="dashboard-frame relative border-[1px] border-[#6200EA]/50 bg-[#050508]/80 rounded-sm overflow-hidden shadow-[0_0_50px_rgba(98,0,234,0.1)]">
        {/* Top Status Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[#6200EA]/30 bg-[#050508]">
          <div className="flex items-center gap-6">
            <span className="text-primary font-bold text-lg tracking-tighter cursor-default animate-pulse">SOCIETY OF CYBER SECURITY</span>
            <div className="hidden md:flex gap-4 text-[10px] text-gray-500 tracking-[0.2em]">
              <span className="hover:text-primary transition-colors cursor-pointer border-b border-primary">TEMPORAL</span>
              <span className="hover:text-primary transition-colors cursor-pointer">OPERATIONS</span>
              <span className="hover:text-primary transition-colors cursor-pointer">LEDGER</span>
              <span className="hover:text-primary transition-colors cursor-pointer">COLLECTIVE</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/20 rounded-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
            <span className="text-[10px] text-primary tracking-widest uppercase font-bold">System Status: Secure</span>
          </div>
        </div>

        {/* Hero Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[600px]">
          {/* Left Hero Text Section */}
          <div className="lg:col-span-7 p-10 flex flex-col justify-start pt-20 border-r border-[#6200EA]/10">
            <div className="hero-text-animate mb-6 inline-flex items-center gap-2 text-[10px] text-primary/60 tracking-[0.3em]">
              <div className="w-2 h-2 bg-primary"></div>
              <span>CORE_INITIATIVE_V2.5</span>
            </div>
            
            <h1 className="hero-text-animate text-6xl md:text-8xl font-bold font-grotesk text-white leading-[0.85] mb-8 tracking-tighter">
              THE CYBER <br />
              <span className="text-glow">ARCHITECT</span>
            </h1>

            <div className="hero-text-animate flex gap-12 mb-10">
              <div>
                <div className="text-[10px] text-primary tracking-widest mb-1">STATUS</div>
                <div className="text-2xl font-bold text-white">99.98% ACTIVE</div>
              </div>
              <div>
                <div className="text-[10px] text-primary tracking-widest mb-1">THREAT_LEVEL</div>
                <div className="text-2xl font-bold text-white uppercase">Zero Threat Vectors</div>
              </div>
            </div>

            <div className="hero-text-animate flex flex-wrap gap-4">
              <NeonButton className="px-10 py-4 font-bold text-sm bg-primary text-black hover:bg-white hover:text-black transition-all">
                INITIALIZE SYSTEM
              </NeonButton>
              <NeonButton variant="outline" className="px-10 py-4 font-bold text-sm hover:bg-primary/5 transition-all">
                ACCESS VAULT
              </NeonButton>
            </div>
          </div>

          {/* Right Section: Monitor Illustration & Side Metrics */}
          <div className="lg:col-span-5 p-10 bg-gradient-to-br from-black to-[#0A0A10] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 dot-grid opacity-20"></div>
            
            {/* Monitor/Shield Graphic */}
            <div className="relative z-10 w-full max-w-[300px] aspect-square flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/5 blur-[80px] rounded-full animate-pulse"></div>
              <div className="relative w-full h-full border border-primary/20 bg-[#050508]/60 backdrop-blur-xl rounded-lg p-6 flex flex-col items-center justify-center group overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                <div className="text-[10px] text-gray-500 absolute top-4 left-4 tracking-tighter font-mono opacity-50 uppercase">ARCHITECTURAL_NODE</div>
                <div className="text-[10px] text-primary absolute top-4 right-4 tracking-tighter font-bold uppercase">NODE_001_ACTIVE</div>
                
                <Shield className="w-32 h-32 text-primary/10 absolute animate-pulse" />
                <div className="relative">
                  <div className="w-24 h-24 border-2 border-primary rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(200,255,0,0.3)]">
                    <Shield className="w-12 h-12 text-primary" />
                  </div>
                  {/* Rotating Outer Ring */}
                  <div className="absolute -inset-4 border border-dashed border-primary/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                </div>
              </div>
            </div>

            {/* Sidebar Terminal Log Preview (Overlay style) */}
            <div className="mt-12 w-full dashboard-card p-4 rounded-sm border-l-2 border-l-primary/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Live_Feed // Stream</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full"></div>
                </div>
              </div>
              <div className="text-[9px] font-mono text-gray-400 space-y-1">
                <div className="flex gap-2">
                  <span className="text-gray-600">[21:42:15]</span>
                  <span>MAC: E4:D1:6A:9A:88:FF</span>
                </div>
                <div className="flex gap-2 text-primary/80">
                  <span className="text-gray-600">[21:42:17]</span>
                  <span>PXP_001_CONNECTED: INCOMING_PACKET_VERIFIED</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-600">[21:42:20]</span>
                  <span>ENCRYPT_LEVEL_RSA_4096</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Core Components (Bottom Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-[#6200EA]/30 bg-[#050508]/40">
          <div className="p-8 border-r border-[#6200EA]/10 hover:bg-primary/5 transition-all group cursor-default">
            <Cpu className="w-6 h-6 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-bold text-sm tracking-widest mb-3 uppercase">Quantum Resistant</h3>
            <p className="text-[10px] text-gray-500 leading-relaxed mb-4">Lattice-based cryptography protocols designed to withstand future computational threats.</p>
            <div className="text-[9px] text-primary/60 font-bold tracking-tighter uppercase border-t border-primary/10 pt-2">
              [ LOAD: 12.4%_SYMMETRIC ]
            </div>
          </div>

          <div className="p-8 border-r border-[#6200EA]/10 bg-primary/5 relative overflow-hidden group cursor-default">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-primary"></div>
            <Zap className="w-6 h-6 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-bold text-sm tracking-widest mb-3 uppercase">Decentralized</h3>
            <p className="text-[10px] text-gray-500 leading-relaxed mb-4">Distributed node architecture ensuring no single point of failure within the collective.</p>
            <div className="flex items-center justify-between text-[9px] font-bold tracking-tighter uppercase border-t border-primary/20 pt-2">
              <span className="text-primary">[ NODE COUNT: 24,531 ]</span>
              <Activity className="w-3 h-3 text-primary animate-pulse" />
            </div>
          </div>

          <div className="p-8 hover:bg-primary/5 transition-all group cursor-default">
            <Activity className="w-6 h-6 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-bold text-sm tracking-widest mb-3 uppercase">Instant Sync</h3>
            <p className="text-[10px] text-gray-500 leading-relaxed mb-4">Real-time ledger propagation across all active global nodes with sub-1ms latency.</p>
            <div className="text-[9px] text-primary/60 font-bold tracking-tighter uppercase border-t border-primary/10 pt-2 flex justify-between">
              <span>[ LATENCY: 0.12ms ]</span>
              <Globe className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Global Node Map Section */}
        <div className="p-10 border-t border-[#6200EA]/30 bg-[#050508]/80 relative overflow-hidden">
          <div className="absolute inset-0 dot-grid opacity-10"></div>
          <div className="flex items-center gap-2 mb-8 relative z-10">
            <div className="w-1 h-3 bg-primary"></div>
            <span className="text-xs font-bold tracking-widest text-primary uppercase">Global Node Map</span>
          </div>
          
          <div className="w-full aspect-[21/9] rounded border border-[#6200EA]/20 bg-black/40 relative z-10 flex items-center justify-center overflow-hidden">
            {/* World Map Background (SVG Placeholder for now, styled to look like image) */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg viewBox="0 0 1000 500" className="w-full h-full text-gray-600 fill-current">
                {/* Simplified continents for visual effect */}
                <path d="M150 150 Q 200 100 250 150 T 350 150 L 350 250 Q 300 300 200 250 T 150 150 Z" />
                <path d="M600 100 Q 700 50 800 100 T 900 150 L 850 350 Q 750 400 650 350 T 600 100 Z" />
                <path d="M400 300 Q 500 250 550 300 T 500 450 Q 400 480 350 400 T 400 300 Z" />
              </svg>
            </div>

            {/* Glowing Map Markers */}
            <div className="absolute top-[30%] left-[20%]">
              <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
              <div className="w-2 h-2 bg-primary rounded-full absolute top-0 left-0 shadow-[0_0_10px_#C8FF00]"></div>
            </div>
            <div className="absolute top-[45%] left-[55%]">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full absolute top-0 left-0 shadow-[0_0_10px_#3B82F6]"></div>
            </div>
            <div className="absolute top-[60%] left-[80%]">
              <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
              <div className="w-2 h-2 bg-primary rounded-full absolute top-0 left-0 shadow-[0_0_10px_#C8FF00]"></div>
            </div>

            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
              [ REALTIME_NODE_TRACKING_ACTIVE ]
            </div>
          </div>
          
          {/* Footer Bar within the dashboard */}
          <div className="flex items-center justify-between mt-8 text-[8px] text-gray-600 font-mono tracking-widest">
            <span>© 2024 SOCS // ENCRYPTED_ACCESS_ONLY</span>
            <div className="flex gap-4">
              <span className="text-primary/40">GCT: 00:42:15</span>
              <span>72152345:00</span>
              <span className="text-primary">NODE_AZ7293: HQ-WEST-01</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
