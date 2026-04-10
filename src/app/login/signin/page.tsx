"use client";

import React from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { NeonButton } from "@/components/ui/NeonButton";
import { GlitchText } from "@/components/ui/GlitchText";
import { Lock, User, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <PageWrapper className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md">
        <Link href="/login" className="flex items-center gap-2 text-primary/50 hover:text-primary mb-8 font-mono text-[10px] tracking-widest transition-colors group">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            BACK_TO_ROOT
        </Link>

        <div className="bg-black/60 backdrop-blur-md border border-primary/20 p-8 relative overflow-hidden"
             style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)" }}>
            
            {/* Scanline overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-10" />

            <div className="mb-8">
                <div className="text-[10px] font-mono text-primary/40 tracking-[0.4em] mb-1">RECOVERY_PROTOCOL</div>
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase font-grotesk">
                    <GlitchText text="LOGIN_SESSION" />
                </h2>
            </div>

            <form 
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                // Simulate delay then redirect
                const btn = e.currentTarget.querySelector('button');
                if (btn) btn.innerHTML = "AUTHENTICATING...";
                setTimeout(() => window.location.href = "/", 1000);
              }}
            >
                <div>
                    <label className="block text-[9px] font-mono text-gray-500 tracking-[0.3em] uppercase mb-2">IDENTIFIER_TOKEN</label>
                    <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 transition-colors group-focus-within:text-primary" />
                        <input 
                            type="text" 
                            placeholder="admin@socs.network"
                            className="w-full bg-white/5 border border-white/10 px-10 py-3 text-sm font-mono text-white placeholder:text-gray-700 focus:border-primary/50 focus:outline-none focus:bg-primary/5 transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[9px] font-mono text-gray-500 tracking-[0.3em] uppercase mb-2">ACCESS_BYCODE</label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 transition-colors group-focus-within:text-primary" />
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            className="w-full bg-white/5 border border-white/10 px-10 py-3 text-sm font-mono text-white placeholder:text-gray-700 focus:border-primary/50 focus:outline-none focus:bg-primary/5 transition-all"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between text-[8px] font-mono">
                    <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-3 h-3 border border-white/20 peer-checked:bg-primary peer-checked:border-primary transition-all" />
                        REMEMBER_NODE
                    </label>
                    <a href="#" className="text-primary/60 hover:text-primary transition-colors uppercase">FORGOT_DECRYPT_KEY?</a>
                </div>

                <NeonButton variant="primary" className="w-full py-4 font-bold text-[10px] tracking-[0.4em] mt-4">
                    ESTABLISH_UPLINK
                </NeonButton>
            </form>

            {/* Bottom info */}
            <div className="mt-8 pt-6 border-t border-white/5 flex justify-center">
                <p className="text-[9px] font-mono text-gray-600 tracking-widest">
                    NO ACCOUNT? <Link href="/login/signup" className="text-primary hover:underline">REGISTER_NEW_NODE</Link>
                </p>
            </div>
        </div>
      </div>
    </PageWrapper>
  );
}
