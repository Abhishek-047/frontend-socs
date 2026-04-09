"use client";

import React, { useEffect, useRef, useState } from "react";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { ProjectCard } from "../../components/cards/ProjectCard";
import { AddEntityModal } from "../../components/modals/AddEntityModal";
import { projects, ProjectTag } from "../../constants/projects";
import { staggerCardsOnScroll } from "../../lib/animations";

export default function ProjectsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<ProjectTag | "All">("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tags: (ProjectTag | "All")[] = [
    "All", "Web Security", "OSINT", "Reverse Engineering", "AI Security"
  ];
  
  // existing logic...
  const filteredProjects = projects.filter(p => filter === "All" || p.tags.includes(filter as ProjectTag));

  useEffect(() => {
    // Re-trigger animation when filter changes
    if (containerRef.current) {
      setTimeout(() => {
        if (containerRef.current) {
          staggerCardsOnScroll(containerRef.current);
        }
      }, 50);
    }
  }, [filter]);

  return (
    <PageWrapper>
      <AddEntityModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        entityType="PROJECT" 
      />

      <div className="pt-10 pb-20">
        <SectionHeader 
          title="Project Database" 
          subtitle="Open-source intelligence, vulnerability scanners, and automated exploitation frameworks built by our members."
        />
        
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-12 mb-10 pb-4 border-b border-white/5">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-jetbrains text-gray-500 py-2">Filter_by:</span>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`px-4 py-2 font-jetbrains text-sm transition-all duration-300 relative ${
                  filter === tag 
                    ? "text-primary" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tag}
                {filter === tag && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary shadow-glow"></span>
                )}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary/10 border border-primary/40 px-4 py-2 text-[10px] font-bold font-mono tracking-[0.2em] text-primary hover:bg-primary hover:text-black transition-all duration-300 group ml-auto"
            style={{ clipPath: "polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)" }}
          >
            <span className="text-lg group-hover:rotate-90 transition-transform">+</span>
            <span>INITIALIZE_PROJECT</span>
          </button>
        </div>
        
        {/* Grid */}
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project, i) => (
            <div key={`${project.title}-${i}`} className="opacity-0">
              <ProjectCard project={project} />
            </div>
          ))}
          {filteredProjects.length === 0 && (
            <div className="col-span-full py-20 text-center font-jetbrains text-gray-500">
              <p>&gt; Error: No projects matching criteria found.</p>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
