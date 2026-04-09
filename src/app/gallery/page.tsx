"use client";
import React from 'react';
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlitchText } from "@/components/ui/GlitchText";
import { Camera, Lock } from "lucide-react";

const GALLERY_IMAGES = [
  { id: 1, title: "CORE_TEAM_BETA", category: "Team", src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80" },
  { id: 2, title: "INFRA_DUMP_01", category: "Infrastructure", src: "https://images.unsplash.com/photo-1558494949-ef0109121c9b?auto=format&fit=crop&w=800&q=80" },
  { id: 3, title: "HACKATHON_RITUAL", category: "Events", src: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80" },
  { id: 4, title: "NODE_SQUAD_OMEGA", category: "Team", src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80" },
  { id: 5, title: "SECURITY_LAB_V2", category: "Infrastructure", src: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80" },
  { id: 6, title: "NIGHT_PROTOCOL", category: "Events", src: "https://images.unsplash.com/photo-1510511459019-5dee1a2078a5?auto=format&fit=crop&w=800&q=80" },
];

export default function GalleryPage() {
  return (
    <PageWrapper>
      <div className="mb-12">
        <SectionHeader 
          title="DECRYPTED_VISUALS" 
          subtitle="A visual log of the society's physical footprint and core node members." 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {GALLERY_IMAGES.map((img) => (
          <div key={img.id} className="group relative dashboard-card overflow-hidden">
            {/* Image Container */}
            <div className="aspect-video overflow-hidden border-b border-white/5">
              <img 
                src={img.src} 
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100"
              />
              
              {/* Scanline overlay */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />
            </div>

            {/* Content info */}
            <div className="p-4 relative bg-black/40 backdrop-blur-sm">
               <div className="flex justify-between items-start mb-2">
                  <div className="text-[10px] text-primary/60 font-mono tracking-widest uppercase">{img.category}</div>
                  <Lock className="w-3 h-3 text-white/20 group-hover:text-primary transition-colors" />
               </div>
               <h3 className="text-sm font-bold font-jetbrains text-white group-hover:text-primary transition-colors truncate">
                 <GlitchText text={img.title} />
               </h3>
               
               {/* Hover reveal info */}
               <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  <div className="flex items-center gap-2 text-[8px] text-gray-500 font-mono">
                    <Camera className="w-3 h-3" />
                    <span>IMG_SCAN_SUCCESS</span>
                  </div>
                  <div className="text-[8px] text-primary font-bold tracking-tighter uppercase">VIEW_METADATA</div>
               </div>
            </div>
            
            {/* Corner accents */}
            <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none overflow-hidden">
               <div className="absolute top-0 right-0 w-full h-[1px] bg-primary/40" />
               <div className="absolute top-0 right-0 w-[1px] h-full bg-primary/40" />
            </div>
            <div className="absolute bottom-0 left-0 w-8 h-8 pointer-events-none overflow-hidden">
               <div className="absolute bottom-0 left-0 w-full h-[1px] bg-primary/40" />
               <div className="absolute bottom-0 left-0 w-[1px] h-full bg-primary/40" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Disclaimer */}
      <div className="mt-20 p-6 border border-white/5 bg-white/2 self-start max-w-lg">
        <div className="text-[9px] text-gray-500 font-mono uppercase tracking-[0.3em] mb-2 leading-tight">
          Warning: Unauthorized replication of society visuals is strictly prohibited under SOCS Protocol Sec. 4.
        </div>
      </div>
    </PageWrapper>
  );
}
