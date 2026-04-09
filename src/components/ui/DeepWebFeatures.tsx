"use client";
import React, { useEffect, useState, useRef } from "react";
import { useDeepWeb } from "@/context/DeepWebContext";
import { Search } from "lucide-react";

export function DeepWebFeatures() {
  const { isDeepWeb, honeyPotLockdown } = useDeepWeb();
  
  // Ransomware State
  const [ransomwareActive, setRansomwareActive] = useState(false);
  // Watchdog State
  const [isIdle, setIsIdle] = useState(false);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleRe = () => setRansomwareActive(true);
    const handleRd = () => setRansomwareActive(false);
    
    window.addEventListener("ransomware-engage", handleRe);
    window.addEventListener("ransomware-disengage", handleRd);
    return () => {
      window.removeEventListener("ransomware-engage", handleRe);
      window.removeEventListener("ransomware-disengage", handleRd);
    }
  }, []);

  // Watchdog mouse movement tracking
  useEffect(() => {
    if (!isDeepWeb) {
      setIsIdle(false);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      return;
    }

    const resetIdle = () => {
      setIsIdle(false);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        setIsIdle(true);
      }, 5000);
    };

    window.addEventListener("mousemove", resetIdle);
    window.addEventListener("keydown", resetIdle);
    resetIdle();
    
    return () => {
      window.removeEventListener("mousemove", resetIdle);
      window.removeEventListener("keydown", resetIdle);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    }
  }, [isDeepWeb]);

  return (
    <>
      {/* 1. Watchdog UI Overlay */}
      {isDeepWeb && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {/* Paranoia eye effect chasing cursor */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,0,0,0.03)_0%,transparent_70%)] opacity-50 mix-blend-screen animate-pulse" />
          
          {isIdle && (
            <div className="absolute bottom-6 right-6 bg-red-900/40 border border-red-500/50 text-red-500 font-mono text-[10px] p-4 max-w-sm backdrop-blur-md flex items-start gap-4">
               <div className="w-4 h-4 mt-0.5 relative shrink-0">
                 <div className="absolute inset-0 border border-red-500 rounded-full animate-ping"></div>
                 <div className="absolute inset-1 bg-red-500 rounded-full animate-pulse"></div>
               </div>
               <div>
                  <h4 className="font-bold tracking-widest uppercase mb-1">SYSTEM_WATCHDOG_ALERT</h4>
                  <p className="opacity-80 leading-relaxed uppercase">Target stationary for 5.0 seconds. Initiating reverse coordinates track protocol. Disconnect immediately.</p>
               </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Ransomware Modal Overlay */}
      {ransomwareActive && (
        <div className="fixed inset-0 z-[99999] bg-red-950 flex flex-col justify-center items-center pointer-events-auto">
          <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjMiPiA8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIC8+IDwvc3ZnPg==')] opacity-30 animate-scanlines" />
          <div className="max-w-xl w-full bg-black border-2 border-red-500 p-8 relative z-10 shadow-[0_0_100px_rgba(255,0,0,0.6)]">
            <h1 className="text-4xl font-black font-grotesk text-red-500 text-center mb-6 tracking-tighter uppercase glitch-effect" data-text="SYSTEM LOCKDOWN">
              SYSTEM LOCKDOWN
            </h1>
            <div className="space-y-4 font-mono text-sm text-red-400">
              <p>*** WARNING: YOUR SYSTEM HAS BEEN ENCRYPTED ***</p>
              <p>All sensitive nodes, cryptographic keys, and database records have been locked using military-grade RSA-4096 encryption.</p>
              <p className="text-white mt-4 bg-red-900/50 p-2 border border-red-500/30">
                To decrypt your files, enter the master decryption key in the secure terminal context. 
                <br /><br />
                Hint: "Admin overrides require absolute FORCE to RESTORE functionality."
              </p>
              <div className="text-xs opacity-60 text-center mt-8 uppercase">Time remaining before complete data wipe: 09:59:59</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
