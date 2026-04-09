"use client";

import React, { useEffect, useRef, useState } from "react";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { teamMembers, TeamMember } from "../../constants/team";
import { Search, User, Shield, Terminal, Globe, Zap, Activity } from "lucide-react";
import gsap from "gsap";
import Link from "next/link";

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
    <Link href={`/team/${member.slug}`} className="block h-full group">
      <div ref={cardRef} className="dashboard-card p-6 rounded-sm border-b-2 border-b-white/5 group-hover:border-b-primary/50 transition-all opacity-0 h-full flex flex-col cursor-pointer bg-black/40 backdrop-blur-sm">
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
    </Link>
  );
}

import { GlitchText } from "../../components/ui/GlitchText";
import { NetworkGraph } from "../../components/ui/NetworkGraph";
import { EncryptedText } from "../../components/ui/EncryptedText";
import { HoneypotLink } from "../../components/ui/HoneypotLink";
import { AddEntityModal } from "../../components/modals/AddEntityModal";
import { LayoutGrid, Network } from "lucide-react";

export default function TeamPage() {
  const [filter, setFilter] = useState("ALL_NODES");
  const [viewMode, setViewMode] = useState<"GRID_VIEW" | "NETWORK_VIEW">("GRID_VIEW");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const filteredMembers = teamMembers.filter(m => {
    if (filter === "ALL_NODES") return true;
    if (filter === "RED_TEAM") return m.role.toLowerCase().includes("offen") || m.role.toLowerCase().includes("ctf") || m.tier === "core";
    if (filter === "BLUE_TEAM") return m.role.toLowerCase().includes("cloud") || m.role.toLowerCase().includes("net") || m.role.toLowerCase().includes("ops");
    return true;
  });

  return (
    <PageWrapper className="pt-24 pb-32">
      <AddEntityModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        entityType="NODE" 
      />


      <div className="max-w-7xl mx-auto px-4 z-10 relative">
        {/* Header Section */}
        <div className="mb-10 md:mb-16 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
          <div className="w-full">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold font-grotesk text-white tracking-tighter mb-4 break-words leading-tight flex flex-wrap items-center">
              <GlitchText text="THE" as="span" intensity="high" />
              <GlitchText text="Sentinels" as="span" intensity="high" />
            </h1>
            <div className="space-y-1">
              <div className="flex items-center gap-3 text-[10px] text-primary/40 font-jetbrains tracking-[0.3em] uppercase">
                <Activity className="w-3 h-3" />
                <EncryptedText>SOCS_COLLECTIVE_DIRECTORY</EncryptedText>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-primary/60 font-jetbrains tracking-[0.3em] uppercase">
                <Globe className="w-3 h-3 text-primary animate-pulse" />
                <span><EncryptedText>NODE_NETWORK_DIRECTORY_v3.0.4</EncryptedText></span>
              </div>
            </div>
            
            <div className="mt-6">
                <HoneypotLink label="ACCESS_DATABANK_NODE" />
            </div>
          </div>

          <div className="w-full lg:w-auto flex flex-col gap-4 items-start lg:items-end mt-8 md:mt-0">
            <div className="relative w-full lg:w-[400px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                 type="text" 
                 placeholder="FILTER_BY_OPERATOR_ID_OR_SPECIALITY..." 
                 className="w-full bg-black/40 border border-white/10 rounded-sm px-12 py-3 text-xs font-jetbrains text-white outline-none focus:border-primary/40 focus:bg-primary/5 transition-all placeholder:text-gray-700 uppercase"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              {["ALL_NODES", "RED_TEAM", "BLUE_TEAM"].map((btn) => (
                <button 
                  key={btn}
                  onClick={() => setFilter(btn)}
                  className={`px-4 md:px-6 py-2 text-[10px] font-bold tracking-widest uppercase border transition-all flex-1 lg:flex-none ${
                    filter === btn 
                    ? "bg-primary/10 border-primary text-primary shadow-[0_0_10px_rgba(200,255,0,0.15)]" 
                    : "bg-white/5 border-white/10 text-gray-500 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>

            <div className="flex w-full lg:w-auto mt-2 lg:mt-0 gap-3">
              <div className="flex gap-1 border border-white/10 p-1 bg-black/40 rounded-sm">
                <button
                  onClick={() => setViewMode("GRID_VIEW")}
                  title="Grid View"
                  className={`flex-1 lg:flex-none p-2 flex justify-center items-center rounded-sm transition-colors ${viewMode === "GRID_VIEW" ? "bg-primary/20 text-primary" : "text-gray-500 hover:text-white"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("NETWORK_VIEW")}
                  title="Network Relational Graph View"
                  className={`flex-1 lg:flex-none p-2 flex justify-center items-center rounded-sm transition-colors ${viewMode === "NETWORK_VIEW" ? "bg-primary/20 text-primary" : "text-gray-500 hover:text-white"}`}
                >
                  <Network className="w-4 h-4" />
                </button>
              </div>

              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 text-[10px] font-bold tracking-[0.2em] text-primary hover:bg-primary hover:text-black transition-all duration-300 group"
                style={{ clipPath: "polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)" }}
              >
                <span className="group-hover:rotate-90 transition-transform">+</span>
                <span>ADD_NODE</span>
              </button>
            </div>
          </div>
        </div>

        {/* Directory Presentation */}
        {viewMode === "GRID_VIEW" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map((member, i) => (
              <CollectiveCard key={member.name} member={member} delay={i} />
            ))}
          </div>
        ) : (
          <div className="w-full h-[650px] border border-white/10 bg-[#030508]/80 rounded-sm relative overflow-hidden">
             <div className="absolute top-4 left-4 z-10 hidden md:block">
               <div className="text-[10px] text-primary/60 font-mono tracking-widest uppercase mb-2">GRAPH_LEGEND</div>
               <div className="flex flex-col gap-2 text-[9px] font-jetbrains text-gray-400">
                 <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#ff0040]"></div> SOCS MAINFRAME</div>
                 <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#ff2d55]"></div> CORE / ADMIN</div>
                 <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#ff6b00]"></div> LEAD</div>
                 <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary/80"></div> MEMBER</div>
               </div>
             </div>
             <NetworkGraph />
          </div>
        )}

        {/* Floating Footer Detail */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[8px] text-gray-700 font-mono tracking-widest uppercase text-center md:text-left">
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <span className="text-primary/40 leading-none">● {filteredMembers.length} ACTIVE OPERATORS</span>
            <span className="leading-none">SYST_LOG: DIRECTORY_LOAD_OK</span>
          </div>
          <div className="leading-none text-center md:text-right">
            © 2024 SOCS // ENCRYPTED_ACCESS_ONLY
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
