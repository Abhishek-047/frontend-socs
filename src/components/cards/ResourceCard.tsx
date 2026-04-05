import React from "react";
import { Resource } from "../../constants/resources";
import { GlowBorder } from "../ui/GlowBorder";
import { ExternalLink } from "lucide-react";
import { Badge } from "../ui/Badge";

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block group h-full">
      <GlowBorder intensity="low" className="h-full">
        <div className="p-6 flex flex-col h-full bg-background/60 rounded-md">
          <div className="flex justify-between items-start mb-3">
            <Badge label={resource.category} color="neon" />
            <ExternalLink size={18} className="text-gray-500 group-hover:text-primary transition-colors" />
          </div>
          
          <h3 className="text-lg font-bold font-grotesk text-white mb-2 relative inline-block self-start">
            {resource.title}
            <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-primary scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300"></span>
          </h3>
          
          <p className="text-gray-400 font-jetbrains text-sm mb-4 flex-grow">
            {resource.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-auto">
            {resource.tags.map((tag, i) => (
              <span key={i} className="text-xs font-jetbrains text-gray-500">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </GlowBorder>
    </a>
  );
}
