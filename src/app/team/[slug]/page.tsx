"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { teamMembers } from "../../../constants/team";
import { PageWrapper } from "../../../components/layout/PageWrapper";
import { Badge } from "../../../components/ui/Badge";
import { GithubIcon, TwitterIcon } from "../../../components/ui/Icons";
import { ArrowLeft, Shield, Terminal, Globe, User, Zap, Mail, Activity } from "lucide-react";
import Link from "next/link";
import { GlitchText } from "../../../components/ui/GlitchText";

export default function TeamMemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const member = teamMembers.find((m) => m.slug === slug);

  if (!member) {
    return (
      <PageWrapper>
        <div className="pt-20 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">404: NODE_NOT_FOUND</h1>
          <p className="text-gray-400 mb-8">Agent profile is missing or identity has been purged.</p>
          <Link href="/team" className="text-primary hover:underline">
            [ Return to Directory ]
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="pt-10 pb-20 max-w-5xl mx-auto">
        {/* Back button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary/60 hover:text-primary transition-colors text-xs font-mono mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>BACK_TO_DIRECTORY</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-12">
          {/* Profile Sidebar */}
          <div className="space-y-8">
            <div className="relative group">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-black border border-primary/20 rounded-sm overflow-hidden flex items-center justify-center p-8">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                ) : (
                  <User className="w-24 h-24 text-gray-700 group-hover:text-primary/40 transition-all duration-500" />
                )}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              
              {/* Clearance Badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-black border border-primary/40 text-[10px] font-bold text-primary tracking-widest uppercase">
                CLEARANCE_{member.tier}
              </div>
            </div>

            <div className="dashboard-card p-6 border border-white/10 bg-black/40 backdrop-blur-md space-y-6">
              <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mb-4 text-center">Identity_Verified</h3>
              
              <div className="flex justify-center gap-4">
                <a href={member.github || "#"} className="p-3 bg-white/5 border border-white/10 text-gray-400 hover:text-primary hover:border-primary/40 transition-all">
                  <GithubIcon className="w-5 h-5" />
                </a>
                <a href={member.linkedin || "#"} className="p-3 bg-white/5 border border-white/10 text-gray-400 hover:text-primary hover:border-primary/40 transition-all">
                  <Globe className="w-5 h-5" />
                </a>
                <a href="#" className="p-3 bg-white/5 border border-white/10 text-gray-400 hover:text-primary hover:border-primary/40 transition-all">
                  <Mail className="w-5 h-5" />
                </a>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                 <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-primary" />
                    <div className="flex flex-col">
                       <span className="text-[8px] text-gray-600 uppercase">Status</span>
                       <span className="text-[10px] text-white font-mono uppercase tracking-tighter">ACTIVE_OPERATOR</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-primary" />
                    <div className="flex flex-col">
                       <span className="text-[8px] text-gray-600 uppercase">Encryption</span>
                       <span className="text-[10px] text-white font-mono uppercase tracking-tighter">P2P_RSA_4096</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Member Details */}
          <div>
            <h1 className="text-4xl md:text-6xl font-bold font-grotesk text-white mb-2 text-glow uppercase">
              <GlitchText text={member.name.replace(" ", "_")} />
            </h1>
            <p className="text-primary/60 font-jetbrains tracking-[0.4em] uppercase text-sm mb-10 pb-4 border-b border-primary/20 inline-block">
              {member.role}
            </p>

            <div className="space-y-12">
              <section>
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-widest">
                  <Terminal className="w-5 h-5 text-primary" />
                  Operator_Profile
                </h3>
                <p className="text-gray-400 leading-relaxed font-jetbrains">
                  A high-level technical operator specializing in secure systems and offensive security methodologies.
                  Responsible for coordinating core society protocols and maintaining internal node integrity.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest">Skill_Modules</h3>
                <div className="flex flex-wrap gap-3">
                  {member.skills.map((skill, i) => (
                    <div key={i} className="px-4 py-2 bg-primary/5 border border-primary/20 text-xs font-mono text-primary uppercase tracking-widest hover:bg-primary/10 transition-colors">
                      {skill}
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                   <Activity className="w-5 h-5 text-primary" />
                   Contribution_Log
                </h3>
                <div className="space-y-4">
                  {[
                    "Initialized SOCS_LEGACY_v1.0 framework",
                    "Lead researcher on Project ZeroDay vulnerability analysis",
                    "Winner of HackTheValley 2025 - Security Track",
                    "Continuous monitoring of society threat landscape"
                  ].map((log, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-white/2 border border-white/5 rounded-sm font-jetbrains text-sm text-gray-300">
                       <span className="text-primary/40">[{i+1}]</span>
                       <span>{log}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
