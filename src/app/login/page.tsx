"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { NeonButton } from "@/components/ui/NeonButton";
import { GlitchText } from "@/components/ui/GlitchText";
import { Terminal, Shield, Lock, Cpu, Fingerprint, Activity } from "lucide-react";

export default function LoginPage() {
  const [view, setView] = useState<"initial" | "selection">("initial");
  const [loading, setLoading] = useState(false);

  const handleInitialClick = () => {
    setLoading(true);
    // Simulate system decryption
    setTimeout(() => {
      setLoading(false);
      setView("selection");
    }, 1500);
  };

  return (
    <PageWrapper className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-xl relative">
        <AnimatePresence mode="wait">
          {view === "initial" ? (
            <motion.div
              key="initial"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              className="flex flex-col items-center"
            >
              {/* Central Auth Module */}
              <div className="relative group cursor-pointer" onClick={handleInitialClick}>
                {/* Hexagon Frame */}
                <div className="w-64 h-64 flex items-center justify-center relative">
                    {/* Animated rings */}
                    <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-[spin_10s_linear_infinite]" />
                    <div className="absolute inset-4 border border-primary/40 rounded-full animate-[spin_15s_linear_infinite_reverse] border-dashed" />
                    
                    <div className="z-10 bg-black/80 backdrop-blur-md border border-primary/50 w-48 h-48 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(200,255,0,0.1)] group-hover:border-primary group-hover:shadow-[0_0_70px_rgba(200,255,0,0.2)] transition-all duration-500"
                        style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                        
                        {loading ? (
                             <div className="flex flex-col items-center gap-2">
                                <Activity className="w-10 h-10 text-primary animate-pulse" />
                                <span className="text-[10px] font-mono text-primary tracking-[0.2em]">DECRYPTING...</span>
                             </div>
                        ) : (
                            <>
                                <Fingerprint className="w-16 h-16 text-primary/60 group-hover:text-primary transition-colors duration-300" />
                                <div className="mt-4 text-center">
                                    <div className="text-[10px] font-mono text-primary tracking-[0.3em] font-bold">SYSTEM_ACCESS</div>
                                    <div className="text-[8px] font-mono text-gray-500 mt-1">PROTOCOL v4.0.2</div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Corner tags */}
                <div className="absolute -top-4 -left-4 text-[8px] font-mono text-primary/40 tracking-widest uppercase">AUTH_REQUIRED</div>
                <div className="absolute -bottom-4 -right-4 text-[8px] font-mono text-primary/40 tracking-widest uppercase">ENCRYPTED_LINK</div>
              </div>

              <div className="mt-12 text-center">
                <p className="text-gray-500 font-mono text-[10px] tracking-[0.4em] uppercase mb-4 animate-pulse">
                  {loading ? "AUTHENTICATING NODE..." : "Biometric identity required for secure uplink"}
                </p>
                <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary/30 to-transparent mx-auto" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="selection"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* Sign In Protocol */}
              <ProtocolCard
                id="01"
                title="RECOVERY_KEY"
                subtitle="ALREADY REGISTERED"
                description="Restore your existing presence in the network and synchronize your credentials."
                ctaText="SIGN_IN"
                icon={<Lock className="w-8 h-8" />}
                href="/login/signin"
              />

              {/* Sign Up Protocol */}
              <ProtocolCard
                id="02"
                title="INITIATE_CORE"
                subtitle="NEW ENTRANT"
                description="Begin the recruitment protocol and establish your unique cryptographic identity."
                ctaText="SIGN_UP"
                icon={<Cpu className="w-8 h-8" />}
                primary
                href="/login/signup"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative elements */}
        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-20 pointer-events-none">
            <div className="w-full h-full border border-dashed border-primary/10 rounded-full animate-[ping_8s_linear_infinite]" />
        </div>
      </div>
    </PageWrapper>
  );
}

function ProtocolCard({ 
    id, title, subtitle, description, ctaText, icon, primary = false, href 
}: { 
    id: string; title: string; subtitle: string; description: string; ctaText: string; icon: React.ReactNode; primary?: boolean; href: string;
}) {
  return (
    <div className={`relative group p-[1px] ${primary ? 'bg-primary/40' : 'bg-white/10'}`}
        style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)" }}>
        
        <div className="bg-[#020508] p-8 h-full flex flex-col items-start transition-all duration-300 group-hover:bg-[#03080c]"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 19px), calc(100% - 19px) 100%, 0 100%)" }}>
            
            <div className="flex items-center justify-between w-full mb-8">
                <div className={`p-4 border ${primary ? 'border-primary/30 bg-primary/5 text-primary' : 'border-white/10 bg-white/5 text-gray-400'} group-hover:scale-110 transition-transform duration-500`}>
                    {icon}
                </div>
                <span className="text-[10px] font-mono text-gray-700 tracking-widest">PROTOCOL::{id}</span>
            </div>

            <div className="mb-2 text-[10px] font-mono text-primary/60 tracking-[0.4em] uppercase">{subtitle}</div>
            <h3 className="text-xl font-black text-white mb-4 tracking-tighter">
                <GlitchText text={title} />
            </h3>
            
            <p className="text-gray-500 text-xs font-mono leading-relaxed mb-10 flex-1">
                {description}
            </p>

            <NeonButton 
                href={href} 
                variant={primary ? "primary" : "outline"} 
                className="w-full font-bold text-[10px] tracking-[0.3em] py-4"
            >
                {ctaText}
            </NeonButton>
        </div>
    </div>
  );
}
