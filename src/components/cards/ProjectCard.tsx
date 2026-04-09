import Link from "next/link";
import { Project } from "../../constants/projects";
import { Badge } from "../ui/Badge";
import { GlowBorder } from "../ui/GlowBorder";
import { GithubIcon } from "../ui/Icons";
import { ExternalLink } from "lucide-react";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <GlowBorder intensity={project.featured ? "medium" : "low"} className="h-full group">
      <div className="flex flex-col h-full bg-background/60 transition-all duration-300 group-hover:bg-background/80 relative">
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-4 relative z-20">
            <Link href={`/projects/${project.slug}`} className="flex-grow">
              <h3 className="text-xl font-bold font-grotesk text-white group-hover:text-primary transition-colors">
                {project.title}
              </h3>
            </Link>
            <div className="flex gap-3">
              <a 
                href={project.githubUrl} 
                onClick={(e) => e.stopPropagation()} 
                className="text-gray-500 hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <Link href={`/projects/${project.slug}`} className="flex flex-col flex-grow group/desc">
            <div className="mb-3 flex flex-wrap gap-2">
              {project.tags.map((tag, i) => (
                <Badge key={i} label={tag} color="neon" />
              ))}
            </div>
            
            <p className="text-gray-400 font-jetbrains text-sm mb-6 flex-grow leading-relaxed group-hover/desc:text-gray-300 transition-colors">
              {project.description}
            </p>
            
            <div className="pt-4 border-t border-gray-800 flex flex-wrap gap-2 mb-4">
              {project.techStack.map((tech, i) => (
                <Badge key={i} label={tech} color="dim" />
              ))}
            </div>
          </Link>
        </div>

        {/* Action Buttons at the bottom */}
        <div className="px-6 pb-6 mt-auto grid grid-cols-2 gap-3">
          <Link 
            href={`/projects/${project.slug}`}
            className="flex items-center justify-center gap-2 bg-primary/5 border border-primary/20 py-2.5 text-[9px] font-bold font-mono tracking-widest text-primary uppercase hover:bg-primary/20 hover:border-primary transition-all duration-300"
            style={{ clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)" }}
          >
            <ExternalLink className="w-3 h-3" />
            <span>DETAILS</span>
          </Link>
          <a 
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-2.5 text-[9px] font-bold font-mono tracking-widest text-white uppercase hover:bg-white/10 hover:border-white/30 transition-all duration-300"
            style={{ clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)" }}
          >
            <GithubIcon className="w-3 h-3" />
            <span>SOURCE</span>
          </a>
        </div>
      </div>
    </GlowBorder>
  );
}
