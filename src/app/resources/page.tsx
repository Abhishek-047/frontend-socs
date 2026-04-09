"use client";

import React, { useEffect, useRef } from "react";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { ResourceCard } from "../../components/cards/ResourceCard";
import { resources } from "../../constants/resources";
import { staggerCardsOnScroll } from "../../lib/animations";

export default function ResourcesPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Setup animation for all sections at once or separate depending on complexity.
      // We will do a generic stagger for all cards.
      staggerCardsOnScroll(containerRef.current);
    }
  }, []);

  const categories = [
    { title: "Learning Roadmaps", id: "roadmap", color: "text-blue-400" },
    { title: "Security Tools", id: "tool", color: "text-red-400" },
    { title: "Writeups", id: "writeup", color: "text-green-400" },
    { title: "Blogs & Articles", id: "blog", color: "text-yellow-400" },
  ];

  return (
    <PageWrapper>
      <div className="pt-10 pb-20">
        <SectionHeader 
          title="Data Vault" 
          subtitle="Curated intelligence, tools, and learning materials."
        />
        
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mt-8">
          <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono tracking-widest uppercase">
            <span className="w-2 h-2 bg-primary/40 rounded-full animate-pulse" />
            <span>ARCHIVE_STATUS: SYNCHRONIZED</span>
          </div>
          <button 
            className="flex items-center gap-2 bg-primary/10 border border-primary/40 px-4 py-2 text-[10px] font-bold font-mono tracking-[0.2em] text-primary hover:bg-primary hover:text-black transition-all duration-300 group"
            style={{ clipPath: "polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)" }}
          >
            <span className="text-lg group-hover:rotate-90 transition-transform">+</span>
            <span>UPLOAD_INTEL</span>
          </button>
        </div>
        
        <div ref={containerRef} className="space-y-16 mt-16">
          {categories.map((category) => {
            const items = resources.filter(r => r.category === category.id);
            if (items.length === 0) return null;
            
            return (
              <section key={category.id}>
                <h3 className={`font-jetbrains text-xl ${category.color} mb-6 flex items-center`}>
                  <span className="mr-2">#</span> {category.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {items.map((resource, i) => (
                    <div key={i} className="opacity-0">
                      <ResourceCard resource={resource} />
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}
