"use client";

import React, { useEffect, useRef, useState } from "react";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { GlowBorder } from "../../components/ui/GlowBorder";
import { NeonButton } from "../../components/ui/NeonButton";
import { fadeUpOnScroll } from "../../lib/animations";

export default function JoinPage() {
  const formRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (formRef.current) fadeUpOnScroll(formRef.current);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No backend yet, just show success state
    setSubmitted(true);
  };

  return (
    <PageWrapper>
      <div className="pt-10 pb-20 max-w-3xl mx-auto">
        <SectionHeader 
          title="Init Connection" 
          subtitle="Apply to join the SOCS network. We're looking for passionate hackers and builders."
        />
        
        <div ref={formRef} className="mt-12 opacity-0">
          <GlowBorder intensity="medium">
            <div className="bg-background/80 p-6 md:p-10 rounded">
              {submitted ? (
                <div className="text-center py-20">
                  <div className="text-primary text-5xl mb-6 mb-4">
                    ✓
                  </div>
                  <h3 className="font-grotesk text-2xl text-white mb-2">Payload Delivered</h3>
                  <p className="font-jetbrains text-gray-400">
                    We've received your data. Stand by for further instructions from root.
                  </p>
                  <NeonButton 
                    onClick={() => setSubmitted(false)} 
                    variant="outline" 
                    className="mt-8"
                  >
                    Return
                  </NeonButton>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-primary font-jetbrains text-sm">
                        &gt; FULL_NAME
                      </label>
                      <input 
                        required 
                        type="text" 
                        className="w-full bg-[#111] border border-gray-700 rounded p-3 text-white font-jetbrains focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(0,255,65,0.2)] transition-all"
                        placeholder="Anonymous"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-primary font-jetbrains text-sm">
                        &gt; CONTACT_EMAIL
                      </label>
                      <input 
                        required 
                        type="email" 
                        className="w-full bg-[#111] border border-gray-700 rounded p-3 text-white font-jetbrains focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(0,255,65,0.2)] transition-all"
                        placeholder="user@network.local"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-primary font-jetbrains text-sm">
                      &gt; EXPERIENCE_LEVEL
                    </label>
                    <div className="relative">
                      <select required className="w-full bg-[#111] border border-gray-700 rounded p-3 text-white font-jetbrains focus:outline-none focus:border-primary appearance-none">
                        <option value="" disabled selected>Select level...</option>
                        <option value="beginner">Beginner (Checking the doors)</option>
                        <option value="intermediate">Intermediate (Writing scripts)</option>
                        <option value="advanced">Advanced (Popping shells)</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                        ▼
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-primary font-jetbrains text-sm">
                      &gt; PRIMARY_SKILLS
                    </label>
                    <input 
                      type="text" 
                      className="w-full bg-[#111] border border-gray-700 rounded p-3 text-white font-jetbrains focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(0,255,65,0.2)] transition-all"
                      placeholder="e.g. Python, Linux, Web Exploitation (comma separated)"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-primary font-jetbrains text-sm">
                      &gt; MESSAGE_OPTIONAL
                    </label>
                    <textarea 
                      rows={4}
                      className="w-full bg-[#111] border border-gray-700 rounded p-3 text-white font-jetbrains focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(0,255,65,0.2)] transition-all"
                      placeholder="Why do you want to join SOCS?"
                    ></textarea>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-800">
                    <button 
                      type="submit" 
                      className="w-full bg-primary/20 border border-primary text-primary font-jetbrains uppercase tracking-widest py-4 rounded hover:bg-primary/30 hover:shadow-glow transition-all"
                    >
                      [ Execute Transmission ]
                    </button>
                  </div>
                </form>
              )}
            </div>
          </GlowBorder>
        </div>
      </div>
    </PageWrapper>
  );
}
