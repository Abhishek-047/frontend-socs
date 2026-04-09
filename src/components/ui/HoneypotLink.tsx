"use client";
import React from 'react';
import { useDeepWeb } from '@/context/DeepWebContext';

export function HoneypotLink({ label }: { label: string }) {
  const { isDeepWeb, triggerHoneypot } = useDeepWeb();
  
  if (!isDeepWeb) return null;
  
  return (
    <button 
      onClick={triggerHoneypot}
      className="text-red-500 font-mono text-[10px] uppercase tracking-widest border border-red-500/20 px-4 py-1 hover:bg-red-500/20 hover:text-white transition-all animate-pulse shadow-[0_0_15px_rgba(255,0,0,0.2)]"
    >
      [ {label} ]
    </button>
  );
}
