"use client";
import React from 'react';
import { useAudio } from "@/context/AudioContext";
import { useDeepWeb } from "@/context/DeepWebContext";
import { Volume2, VolumeX, Eye, EyeOff, Terminal, Activity } from "lucide-react";

export function SystemStatusDock() {
  const { isMuted, toggleMute } = useAudio();
  const { isDeepWeb, triggerDeepWeb, disableDeepWeb } = useDeepWeb();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3 pointer-events-none">
      {/* Status Bar */}
      <div className="flex items-center gap-4 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-sm pointer-events-auto shadow-2xl">
        <div className="flex items-center gap-2 text-[9px] font-mono tracking-widest text-primary/70">
          <Activity className="w-3 h-3 animate-pulse text-primary" />
          <span>SYSTEM_HEALTH: NOMINAL</span>
        </div>
        <div className="h-3 w-[1px] bg-white/10" />
        <div className="flex items-center gap-2 text-[9px] font-mono tracking-widest text-yellow-500/70">
          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" />
          <span>THREAT: MED</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Deep Web toggle */}
        <button 
          onClick={isDeepWeb ? disableDeepWeb : triggerDeepWeb}
          title={isDeepWeb ? "Disable Deep Web" : "Enable Deep Web"}
          className={`flex items-center justify-center w-10 h-10 border transition-all duration-300 ${
            isDeepWeb 
            ? "bg-red-900/40 border-red-500 text-red-500 hover:bg-red-500 hover:text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]" 
            : "bg-black/60 border-white/10 text-gray-500 hover:text-white hover:border-primary"
          }`}
          style={{ clipPath: "polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)" }}
        >
          {isDeepWeb ? <EyeOff className="w-4 h-4 animate-pulse" /> : <Eye className="w-4 h-4" />}
        </button>

        {/* Audio toggle */}
        <button 
          onClick={toggleMute}
          title={isMuted ? "Unmute Audio" : "Mute Audio"}
          className={`flex items-center justify-center w-10 h-10 border transition-all duration-300 ${
            isMuted 
            ? "bg-black/60 border-white/10 text-gray-500 hover:text-white hover:border-primary" 
            : "bg-primary/10 border-primary text-primary hover:bg-primary hover:text-black shadow-[0_0_20px_rgba(200,255,0,0.3)]"
          }`}
          style={{ clipPath: "polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)" }}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
        </button>

        {/* Terminal Toggle Hook */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("toggle-terminal"))}
          className="flex items-center justify-center gap-2 bg-primary/10 border border-primary text-primary px-4 h-10 font-mono text-[11px] font-bold tracking-widest hover:bg-primary hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(200,255,0,0.2)]"
          style={{ clipPath: "polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)" }}
        >
          <Terminal className="w-4 h-4" />
          <span>TERM</span>
        </button>
      </div>
    </div>
  );
}
