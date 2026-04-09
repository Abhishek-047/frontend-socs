"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { projects } from "../../../constants/projects";
import { PageWrapper } from "../../../components/layout/PageWrapper";
import { Badge } from "../../../components/ui/Badge";
import { GithubIcon, ExternalLink, ArrowLeft, Shield, Globe, Cpu } from "lucide-react";
import Link from "next/link";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) {
    return (
      <PageWrapper>
        <div className="pt-20 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">404: OBJECT_NOT_FOUND</h1>
          <p className="text-gray-400 mb-8">Metadata for requested node hash is missing or corrupted.</p>
          <Link href="/projects" className="text-primary hover:underline">
            [ Return to Database ]
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
          <span>BACK_TO_DATABASE</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
          {/* Main content */}
          <div>
            <div className="flex flex-wrap gap-3 mb-6">
              {project.tags.map((tag, i) => (
                <Badge key={i} label={tag} color="neon" />
              ))}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-grotesk text-white mb-8">
              {project.title}
            </h1>

            <div className="prose prose-invert max-w-none">
              <p className="text-xl text-gray-300 leading-relaxed mb-8 font-jetbrains">
                {project.description}
              </p>
              
              <div className="bg-primary/5 border border-primary/20 p-8 rounded-sm mb-12">
                <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2 uppercase tracking-widest">
                  <Shield className="w-5 h-5" />
                  Technical_Specifications
                </h3>
                <p className="text-gray-400 mb-6">
                  This core module is designed for deep-packet inspection and automated vulnerability research in distributed environments.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">Kernel_Version</span>
                    <p className="text-white font-mono">v1.4.2-stable</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">Compiler_Stack</span>
                    <p className="text-white font-mono">{project.techStack.join(" / ")}</p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Features_Log</h2>
              <ul className="space-y-4 list-none p-0">
                {[
                  "Automated reconnaissance and footprint mapping",
                  "Cross-entropy analysis for anomaly detection",
                  "Heuristic-based exploitation attempts with 98% accuracy",
                  "Real-time logging and distributed node synchronization"
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-start p-4 bg-white/5 border border-white/10 rounded-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0 shadow-glow" />
                    <span className="text-gray-300 font-jetbrains text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="dashboard-card p-6 border border-white/10">
              <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mb-6">Access_Controls</h3>
              
              <div className="space-y-4">
                <a 
                  href={project.githubUrl} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 py-3 text-xs font-bold font-mono tracking-widest text-white uppercase hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  style={{ clipPath: "polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)" }}
                >
                  <GithubIcon className="w-4 h-4" />
                  SOURCE_CODE
                </a>
                
                <button 
                  className="w-full flex items-center justify-center gap-3 bg-primary/10 border border-primary/40 py-3 text-xs font-bold font-mono tracking-widest text-primary uppercase hover:bg-primary hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(200,255,0,0.1)]"
                  style={{ clipPath: "polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)" }}
                >
                  <ExternalLink className="w-4 h-4" />
                  LIVE_PREVIEW
                </button>
              </div>
            </div>

            <div className="dashboard-card p-6 border border-white/10">
              <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mb-4">Node_Context</h3>
              <div className="flex items-center gap-4 py-3 border-b border-white/5">
                <Globe className="w-4 h-4 text-primary/60" />
                <div className="flex flex-col">
                  <span className="text-[8px] text-gray-600 uppercase">Deployment</span>
                  <span className="text-[10px] text-white font-mono">EDGE_DEVOPS_04</span>
                </div>
              </div>
              <div className="flex items-center gap-4 py-3">
                <Cpu className="w-4 h-4 text-primary/60" />
                <div className="flex flex-col">
                  <span className="text-[8px] text-gray-600 uppercase">Hardware</span>
                  <span className="text-[10px] text-white font-mono">NV_TESLA_A100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
