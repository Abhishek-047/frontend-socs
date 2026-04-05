import React from "react";
import { Project } from "../../constants/projects";
import { Badge } from "../ui/Badge";
import { GlowBorder } from "../ui/GlowBorder";
import { GithubIcon } from "../ui/Icons";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <GlowBorder intensity={project.featured ? "medium" : "low"} className="h-full group">
      <div className="p-6 flex flex-col h-full bg-background/60 rounded-md transition-transform duration-300 group-hover:-translate-y-1">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold font-grotesk text-white group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <a href={project.githubUrl} className="text-gray-500 hover:text-primary transition-colors">
            <GithubIcon className="w-5 h-5" />
          </a>
        </div>
        
        <div className="mb-3 flex flex-wrap gap-2">
          {project.tags.map((tag, i) => (
            <Badge key={i} label={tag} color="neon" />
          ))}
        </div>
        
        <p className="text-gray-400 font-jetbrains text-sm mb-6 flex-grow leading-relaxed">
          {project.description}
        </p>
        
        <div className="pt-4 border-t border-gray-800 flex flex-wrap gap-2">
          {project.techStack.map((tech, i) => (
            <Badge key={i} label={tech} color="dim" />
          ))}
        </div>
      </div>
    </GlowBorder>
  );
}
