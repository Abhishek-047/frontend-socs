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
    <PageWrapper className="flex items-center justify-center min-h-[90vh] !max-w-none !px-0">
      <div className="w-full flex flex-col items-center justify-center relative px-6">
        <AnimatePresence mode="wait">
          {view === "initial" ? (
            <motion.div
              key="initial"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
              className="flex flex-col items-center justify-center py-20 w-full"
            >
              {/* Central Auth Module */}
              <div className="relative group cursor-pointer flex flex-col items-center" onClick={handleInitialClick}>
                {/* Hexagon Frame */}
                <div className="w-80 h-80 flex items-center justify-center relative">
                    {/* Animated rings */}
                    <div className="absolute inset-0 border-[3px] border-primary/10 rounded-full animate-[spin_8s_linear_infinite]" />
                    <div className="absolute inset-6 border-2 border-primary/20 rounded-full animate-[spin_12s_linear_infinite_reverse] border-dashed" />
                    <div className="absolute inset-12 border border-primary/5 rounded-full animate-[pulse_4s_ease-in-out_infinite]" />
                    
                    <div className="z-10 bg-black/90 backdrop-blur-xl border-2 border-primary/40 w-56 h-56 flex flex-col items-center justify-center shadow-[0_0_80px_rgba(200,255,0,0.15)] group-hover:border-primary group-hover:shadow-[0_0_100px_rgba(200,255,0,0.3)] transition-all duration-700"
                        style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                        
                        {loading ? (
                             <div className="flex flex-col items-center gap-4">
                                <Activity className="w-12 h-12 text-primary animate-pulse" />
                                <div className="flex flex-col items-center">
                                    <span className="text-[12px] font-mono text-primary tracking-[0.3em] font-black">SECURITY_SCAN</span>
                                    <span className="text-[8px] font-mono text-primary/50 mt-1">MATCHING_BIO_SIGNATURE...</span>
                                </div>
                             </div>
                        ) : (
                            <>
                                <Fingerprint className="w-20 h-20 text-primary/40 group-hover:text-primary transition-all duration-500 transform group-hover:scale-110" />
                                <div className="mt-6 text-center">
                                    <div className="text-[11px] font-mono text-primary tracking-[0.4em] font-black group-hover:scale-110 transition-transform">SYSTEM_ACCESS</div>
                                    <div className="text-[7px] font-mono text-gray-600 mt-2 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">Click to Decrypt</div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Corner tags */}
                <div className="absolute -top-10 -left-10 text-[10px] font-mono text-primary/30 tracking-[0.5em] uppercase [writing-mode:vertical-lr] rotate-180">AUTH_REQUIRED</div>
                <div className="absolute -bottom-10 -right-10 text-[10px] font-mono text-primary/30 tracking-[0.5em] uppercase [writing-mode:vertical-lr]">NODE_UPLINK</div>
              </div>

              <div className="mt-20 text-center flex flex-col items-center">
                <div className="flex items-center gap-3 justify-center mb-6">
                    <div className="h-[1px] w-20 bg-gradient-to-l from-primary/40 to-transparent" />
                    <span className="text-primary/80 font-mono text-xs tracking-[0.6em] font-black">SOCS_KERNEL</span>
                    <div className="h-[1px] w-20 bg-gradient-to-r from-primary/40 to-transparent" />
                </div>
                <p className="text-gray-500 font-mono text-[10px] tracking-[0.4em] uppercase opacity-60">
                  {loading ? "INITIALIZING SECURITY OVERRIDE..." : "IDENTIFY YOURSELF TO THE NETWORK"}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="selection"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl"
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
    <div className={`relative group p-[1px] ${primary ? 'bg-primary/40' : 'bg-white/10'} w-full`}
        style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)" }}>
        
        <div className="bg-[#020508] p-8 h-full flex flex-col items-center text-center transition-all duration-300 group-hover:bg-[#03080c]"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 19px), calc(100% - 19px) 100%, 0 100%)" }}>
            
            <div className="flex flex-col items-center w-full mb-8">
                <div className={`p-4 border ${primary ? 'border-primary/30 bg-primary/5 text-primary' : 'border-white/10 bg-white/5 text-gray-400'} group-hover:scale-110 transition-transform duration-500 mb-4`}>
                    {icon}
                </div>
                <span className="text-[10px] font-mono text-gray-700 tracking-widest uppercase">PROTOCOL::{id}</span>
            </div>

            <div className="mb-2 text-[10px] font-mono text-primary/60 tracking-[0.4em] uppercase">{subtitle}</div>
            <h3 className="text-xl font-black text-white mb-4 tracking-tighter uppercase">
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
