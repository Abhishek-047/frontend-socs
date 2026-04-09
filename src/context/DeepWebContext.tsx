"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface DeepWebContextProps {
  isDeepWeb: boolean;
  tier: number; // 0, 1, 2, 3
  setTier: (v: number) => void;
  triggerDeepWeb: () => void;
  disableDeepWeb: () => void;
  honeyPotLockdown: boolean;
  triggerHoneypot: () => void;
  clearHoneypot: () => void;
}

const DeepWebContext = createContext<DeepWebContextProps | null>(null);

export const useDeepWeb = () => {
  const ctx = useContext(DeepWebContext);
  if (!ctx) throw new Error("useDeepWeb must be used inside DeepWebProvider");
  return ctx;
};

export function DeepWebProvider({ children }: { children: React.ReactNode }) {
  const [isDeepWeb, setIsDeepWeb] = useState(false);
  const [tier, setTier] = useState(0);
  const [honeyPotLockdown, setHoneyPotLockdown] = useState(false);

  // Global Shortcut
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Ctrl+Shift+Z triggers / disables it
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "z") {
        setIsDeepWeb(p => {
          const next = !p;
          if (next) window.dispatchEvent(new Event("deepweb-engage"));
          else window.dispatchEvent(new Event("deepweb-disengage"));
          return next;
        });
        if (!isDeepWeb) setTier(1); // Set to tier 1 when turning on
        else setTier(0);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isDeepWeb]);

  const triggerDeepWeb = () => { setIsDeepWeb(true); setTier(1); window.dispatchEvent(new Event("deepweb-engage")); };
  const disableDeepWeb = () => { setIsDeepWeb(false); setTier(0); window.dispatchEvent(new Event("deepweb-disengage")); };
  
  
  const triggerHoneypot = () => setHoneyPotLockdown(true);
  const clearHoneypot = () => setHoneyPotLockdown(false);

  return (
    <DeepWebContext.Provider value={{ isDeepWeb, tier, setTier, triggerDeepWeb, disableDeepWeb, honeyPotLockdown, triggerHoneypot, clearHoneypot }}>
      {children}
    </DeepWebContext.Provider>
  );
}
