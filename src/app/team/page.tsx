"use client";

import React, { useEffect, useRef, useState } from "react";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { teamMembers, TeamMember } from "../../constants/team";
import { Search, User, Shield, Terminal, Globe, Zap, Activity } from "lucide-react";
import gsap from "gsap";

function CollectiveCard({ member, delay }: { member: TeamMember, delay: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay: delay * 0.05, ease: "power2.out" }
    );
  }, [delay]);

  // Map tier to clearance
  const clearanceMap = {
    core: { label: "ADMIN", color: "bg-red-500", text: "text-red-500" },
    lead: { label: "SENIOR", color: "bg-yellow-500", text: "text-yellow-500" },
    member: { label: "MEMBER", color: "bg-blue-500", text: "text-blue-500" }
  };

  const clearance = clearanceMap[member.tier];
  
  // Generate a mock hex ID based on name length/char codes
  const hexId = `#0X${(member.name.length * 153).toString(16).toUpperCase()}${member.name.charCodeAt(0).toString(16).toUpperCase()}`;

  return (
    <div ref={cardRef} className="dashboard-card p-6 rounded-sm border-b-2 border-b-white/5 hover:border-b-primary/50 transition-all group opacity-0 h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black border border-white/10 rounded-sm flex items-center justify-center overflow-hidden">
            <User className="w-8 h-8 text-gray-600 group-hover:text-primary/40 transition-colors" />
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${clearance.color} rounded-sm shadow-[0_0_8px_rgba(255,255,255,0.2)]`}></div>
        </div>
        
        <div className="text-right">
          <div className={`text-[9px] font-bold tracking-widest ${clearance.text} uppercase mb-1`}>CLEARANCE: {clearance.label}</div>
          <div className="text-[10px] text-gray-500 font-mono tracking-tighter">ID: {hexId}</div>
        </div>
      </div>

      <div className="flex-grow">
        <h3 className="text-white font-bold font-grotesk text-xl tracking-tight mb-1 uppercase group-hover:text-primary transition-colors">
          {member.name.replace(" ", "_")}
        </h3>
        <p className="text-[10px] text-primary/60 font-jetbrains tracking-widest uppercase mb-4">
          {member.role.replace(" ", "_")}
        </p>
      </div>

      <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
        <div className="flex gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
          <Globe className="w-3 h-3 text-gray-500" />
          <Terminal className="w-3 h-3 text-gray-500" />
          <Zap className="w-3 h-3 text-gray-500" />
        </div>
        <div className="text-[8px] text-gray-700 font-mono uppercase tracking-tighter group-hover:text-primary/40 transition-colors">
          NODE_ACCESS_GRANTED
        </div>
      </div>
    </div>
  );
}

import { GlitchText } from "../../components/ui/GlitchText";

export default function TeamPage() {
  const [filter, setFilter] = useState("ALL_NODES");
  
  const filteredMembers = teamMembers.filter(m => {
    if (filter === "ALL_NODES") return true;
    if (filter === "RED_TEAM") return m.role.toLowerCase().includes("offen") || m.role.toLowerCase().includes("ctf") || m.tier === "core";
    if (filter === "BLUE_TEAM") return m.role.toLowerCase().includes("cloud") || m.role.toLowerCase().includes("net") || m.role.toLowerCase().includes("ops");
    return true;
  });

  return (
    <PageWrapper className="pt-24 pb-32">
      <div className="absolute inset-0 dot-grid opacity-20 -z-20"></div>
      
      {/* Top Status Bar ( Cockpit element ) */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full max-w-7xl px-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-4 text-[10px] text-primary/60 tracking-[0.3em] font-jetbrains uppercase">
          <Activity className="w-3 h-3" />
          <span>SOCS_COLLECTIVE_DIRECTORY</span>
        </div>
        <div className="flex items-center gap-3 px-3 py-1 bg-primary/5 border border-primary/20 rounded-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
          <span className="text-[10px] text-primary tracking-widest uppercase font-bold">System Status: Secure</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 z-10 relative">
        {/* Header Section */}
        <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-10">
          <div>
            <h1 className="text-6xl md:text-8xl font-bold font-grotesk text-white tracking-tighter mb-4">
              <GlitchText text="THE" as="span" intensity="high" />
              <span className="text-gray-600">_</span>
              <GlitchText text="COLLECTIVE" as="span" intensity="high" />
            </h1>
            <div className="flex items-center gap-3 text-[10px] text-primary/60 font-jetbrains tracking-[0.3em] uppercase">
              <Globe className="w-3 h-3 text-primary animate-pulse" />
              <span>NODE_NETWORK_DIRECTORY_v3.0.4</span>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col gap-4 items-end">
            <div className="relative w-full md:w-[400px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                 type="text" 
                 placeholder="FILTER_BY_OPERATOR_ID_OR_SPECIALITY..." 
                 className="w-full bg-black/40 border border-white/10 rounded-sm px-12 py-3 text-xs font-jetbrains text-white outline-none focus:border-primary/40 focus:bg-primary/5 transition-all placeholder:text-gray-700 uppercase"
              />
            </div>
            
            <div className="flex gap-2">
              {["ALL_NODES", "RED_TEAM", "BLUE_TEAM"].map((btn) => (
                <button 
                  key={btn}
                  onClick={() => setFilter(btn)}
                  className={`px-6 py-2 text-[10px] font-bold tracking-widest uppercase border transition-all ${
                    filter === btn 
                    ? "bg-primary/10 border-primary text-primary shadow-[0_0_10px_rgba(200,255,0,0.15)]" 
                    : "bg-white/5 border-white/10 text-gray-500 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member, i) => (
            <CollectiveCard key={member.name} member={member} delay={i} />
          ))}
        </div>

        {/* Floating Footer Detail */}
        <div className="mt-20 pt-8 border-t border-white/5 flex items-center justify-between text-[8px] text-gray-700 font-mono tracking-widest uppercase">
          <div className="flex gap-4">
            <span className="text-primary/40 leading-none">● {filteredMembers.length} ACTIVE OPERATORS</span>
            <span className="leading-none">SYST_LOG: DIRECTORY_LOAD_OK</span>
          </div>
          <div className="leading-none text-right">
            © 2024 SOCS // ENCRYPTED_ACCESS_ONLY
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
