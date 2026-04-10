"use client";
import React from 'react';
import { Terminal } from "lucide-react";

export function SystemStatusDock() {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-2 pointer-events-none">
      <div className="flex flex-col items-center gap-2 pointer-events-auto">
        {/* Terminal Toggle Hook */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("toggle-terminal"))}
          className="flex items-center justify-center gap-2 bg-primary/10 border border-primary text-primary px-4 h-10 font-mono text-[11px] font-bold tracking-widest hover:bg-primary hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(200,255,0,0.2)] w-32"
          style={{ clipPath: "polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)" }}
        >
          <Terminal className="w-4 h-4" />
          <span>TERM</span>
        </button>
      </div>
    </div>
  );
}
