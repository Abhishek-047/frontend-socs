"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { events } from "../../../constants/events";
import { PageWrapper } from "../../../components/layout/PageWrapper";
import { Badge } from "../../../components/ui/Badge";
import { ArrowLeft, Calendar, MapPin, Clock, Shield, Terminal, Zap, ExternalLink } from "lucide-react";
import Link from "next/link";
import { GlitchText } from "../../../components/ui/GlitchText";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const event = events.find((e) => e.slug === slug);

  if (!event) {
    return (
      <PageWrapper>
        <div className="pt-20 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">404: EVENT_NOT_FOUND</h1>
          <p className="text-gray-400 mb-8">Scheduled operation protocol not found in calendar cache.</p>
          <Link href="/events" className="text-primary hover:underline">
            [ Return to Calendar ]
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const isUpcoming = event.status === "upcoming";

  return (
    <PageWrapper>
      <div className="pt-10 pb-20 max-w-5xl mx-auto">
        {/* Back button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary/60 hover:text-primary transition-colors text-xs font-mono mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>BACK_TO_CALENDAR</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
          {/* Main Content */}
          <div>
            <div className="flex flex-wrap gap-3 mb-8">
               <span className={`px-4 py-1 text-[10px] font-bold font-mono tracking-widest uppercase border ${isUpcoming ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(200,255,0,0.1)]' : 'bg-gray-800 border-gray-700 text-gray-500'}`}>
                 {event.status === 'upcoming' ? 'SCHEDULED_EXECUTION' : 'ARCHIVED_PROTOCOL'}
               </span>
               <span className="px-4 py-1 text-[10px] font-bold font-mono tracking-widest uppercase border border-white/10 text-white/40">
                 {event.type}
               </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold font-grotesk text-white mb-6 uppercase leading-tight text-glow">
              <GlitchText text={event.title} />
            </h1>

            <div className="space-y-8 font-jetbrains text-gray-400 text-lg leading-relaxed">
              <p>{event.description}</p>
              
              <div className="bg-white/5 border border-white/10 p-8 rounded-sm">
                <h3 className="text-white font-bold mb-4 uppercase tracking-widest flex items-center gap-2">
                   <Shield className="w-5 h-5 text-primary" />
                   Briefing_Overview
                </h3>
                <p className="text-sm">
                  This execution will cover advanced methodologies in security research. Participants are expected to have a stable local node setup and necessary toolkits synchronized.
                </p>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2 p-4 bg-black/40 border border-white/5">
                      <span className="text-[10px] text-gray-600 uppercase">Pre-requisites</span>
                      <p className="text-xs text-white uppercase font-mono tracking-tighter">Basic CLI Knowledge // Burp Suite v2.0+</p>
                   </div>
                   <div className="space-y-2 p-4 bg-black/40 border border-white/5">
                      <span className="text-[10px] text-gray-600 uppercase">Objective</span>
                      <p className="text-xs text-white uppercase font-mono tracking-tighter">Exploit Development // Research</p>
                   </div>
                </div>
              </div>

              <section>
                 <h3 className="text-white font-bold mb-6 uppercase tracking-widest flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-primary" />
                    Protocol_Timeline
                 </h3>
                 <div className="space-y-4">
                    {[
                       { time: "09:00", event: "Node Initialization & Onboarding" },
                       { time: "10:30", event: "Phase 1: Reconnaissance & Mapping" },
                       { time: "13:00", event: "Core Breakout & Logic Analysis" },
                       { time: "15:30", event: "Final Breach & Data Recovery" }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-6 items-center p-4 border-l-2 border-primary/20 bg-white/2 hover:bg-white/5 transition-colors">
                         <span className="text-primary font-mono text-sm">{item.time}</span>
                         <span className="text-white text-sm uppercase tracking-tight">{item.event}</span>
                      </div>
                    ))}
                 </div>
              </section>
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="space-y-8">
            <div className="dashboard-card p-8 border border-white/10 bg-black/40 backdrop-blur-md space-y-8">
               <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] text-center border-b border-white/5 pb-4">Execution_Metadata</h3>
               
               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                     <Calendar className="w-5 h-5 text-primary/60" />
                     <div className="flex flex-col">
                        <span className="text-[8px] text-gray-600 uppercase tracking-widest font-bold">Launch_Date</span>
                        <span className="text-sm text-white font-mono">{new Date(event.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <MapPin className="w-5 h-5 text-primary/60" />
                     <div className="flex flex-col">
                        <span className="text-[8px] text-gray-600 uppercase tracking-widest font-bold">Coordinates</span>
                        <span className="text-sm text-white uppercase font-mono tracking-tighter">{event.location || "VIRTUAL_NODE_1"}</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <Clock className="w-5 h-5 text-primary/60" />
                     <div className="flex flex-col">
                        <span className="text-[8px] text-gray-600 uppercase tracking-widest font-bold">Duration</span>
                        <span className="text-sm text-white font-mono uppercase tracking-tighter">~ 06:00 HOURS</span>
                     </div>
                  </div>
               </div>

               {isUpcoming ? (
                 <button 
                   className="w-full bg-primary text-black font-bold font-mono py-4 text-xs tracking-[0.3em] uppercase hover:bg-white transition-all shadow-[0_0_25px_rgba(200,255,0,0.2)]"
                   style={{ clipPath: "polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)" }}
                 >
                   REGISTER_FOR_OPERATION
                 </button>
               ) : (
                 <button 
                    disabled
                    className="w-full bg-white/5 border border-white/10 text-gray-500 font-bold font-mono py-4 text-xs tracking-[0.3em] uppercase cursor-not-allowed"
                    style={{ clipPath: "polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)" }}
                 >
                   PROTOCOL_ARCHIVED
                 </button>
               )}
            </div>

            <div className="dashboard-card p-6 border border-white/10 bg-black/20 text-center">
               <Zap className="w-8 h-8 text-primary/20 mx-auto mb-4" />
               <p className="text-[10px] text-gray-600 uppercase tracking-widest leading-loose">
                  All society events are monitored. Unauthorized access to detailed briefed notes is strictly forbidden.
               </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
