"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { SectionHeader } from "../ui/SectionHeader";
import { ProjectCard } from "../cards/ProjectCard";
import { projects } from "../../constants/projects";
import { staggerCardsOnScroll } from "../../lib/animations";

export function FeaturedProjects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const featured = projects.filter(p => p.featured).slice(0, 3);

  useEffect(() => {
    if (containerRef.current) {
      staggerCardsOnScroll(containerRef.current);
    }
  }, []);

  return (
    <section className="py-20 border-t border-primary/10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8">
        <SectionHeader 
          title="Featured Operations" 
          subtitle="Recent R&D and automated exploitation tools built by the community."
          className="mb-0"
        />
        <Link 
          href="/projects" 
          className="group inline-flex items-center font-jetbrains text-primary text-sm mt-4 md:mt-0 hover:text-white transition-colors"
        >
          [ View All Logs ]
          <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
      
      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {featured.map((project, idx) => (
          <div key={idx} className="opacity-0">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </section>
  );
}
