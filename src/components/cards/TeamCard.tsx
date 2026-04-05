"use client";

import React from "react";
import { TeamMember } from "../../constants/team";
import { Badge } from "../ui/Badge";
import { GlowBorder } from "../ui/GlowBorder";
import { GithubIcon, LinkedinIcon } from "../ui/Icons";

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <GlowBorder intensity="low" className="group h-full">
      <div className="p-6 flex flex-col h-full bg-background/60 rounded-md">
        <div className="mb-4">
          <h3 className="text-xl font-bold font-grotesk text-white group-hover:text-primary transition-colors flex items-center">
            {member.name}
            <span className="inline-block w-2 h-4 ml-2 bg-primary opacity-0 group-hover:opacity-100 animate-[blink-cursor_1s_step-end_infinite]"></span>
          </h3>
          <p className="text-primary/80 font-jetbrains text-sm">
            &gt; {member.role}
          </p>
        </div>
        
        <div className="flex-grow">
          {/* Terminal reveal animation on hover */}
          <div className="font-jetbrains text-xs text-gray-400 mb-3 overflow-hidden h-0 group-hover:h-auto opacity-0 group-hover:opacity-100 transition-all duration-500 will-change-auto">
            <p className="mb-1 text-primary/60">$ cat /info/skills.txt</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {member.skills.map((skill, i) => (
              <Badge key={i} label={skill} color="dim" />
            ))}
          </div>
        </div>
        
        <div className="mt-6 flex items-center gap-3 pt-4 border-t border-gray-800">
          {member.github && (
            <a href={member.github} className="text-gray-500 hover:text-primary transition-colors">
              <GithubIcon className="w-[18px] h-[18px]" />
            </a>
          )}
          {member.linkedin && (
            <a href={member.linkedin} className="text-gray-500 hover:text-primary transition-colors">
              <LinkedinIcon className="w-[18px] h-[18px]" />
            </a>
          )}
        </div>
      </div>
    </GlowBorder>
  );
}
