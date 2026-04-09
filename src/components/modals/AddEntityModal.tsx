"use client";

import React, { useState, useEffect } from "react";
import { X, Terminal, Shield, Save, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddEntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: "PROJECT" | "NODE" | "EVENT" | "RESOURCE" | "VISUAL";
}

export function AddEntityModal({ isOpen, onClose, entityType }: AddEntityModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(0);

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setFormData({});
      setIsSubmitting(false);
      setStep(0);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network delay
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(1); // Show success
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1500);
  };

  const getFields = () => {
    switch (entityType) {
      case "PROJECT":
        return [
          { name: "title", label: "PROJECT_TITLE", placeholder: "e.g. Project Nightshade" },
          { name: "description", label: "SYNOPSIS", placeholder: "Brief description of the objective..." },
          { name: "tech", label: "TECH_STACK", placeholder: "React, Python, Go..." },
          { name: "github", label: "REPOSITORY_URL", placeholder: "https://github.com/..." },
        ];
      case "NODE":
        return [
          { name: "name", label: "AGENT_NAME", placeholder: "e.g. John Doe (Alias)" },
          { name: "role", label: "DESIGNATION", placeholder: "e.g. Core Developer" },
          { name: "clearance", label: "CLEARANCE_LEVEL", placeholder: "ADMIN / SENIOR / MEMBER" },
        ];
      case "EVENT":
        return [
          { name: "title", label: "EXECUTION_NAME", placeholder: "e.g. HackTheBox Workshop" },
          { name: "date", label: "TIMESTAMP", placeholder: "YYYY-MM-DD" },
          { name: "location", label: "COORDINATES", placeholder: "e.g. Virtual Node / Room 402" },
        ];
      case "RESOURCE":
        return [
          { name: "title", label: "INTEL_TITLE", placeholder: "e.g. OWASP Top 10 Guide" },
          { name: "category", label: "CLASSIFICATION", placeholder: "TOOL / ROADMAP / WRITEUP" },
          { name: "url", label: "DATA_LINK", placeholder: "https://..." },
        ];
      case "VISUAL":
        return [
          { name: "title", label: "ASSET_ID", placeholder: "e.g. LAB_SNAPSHOT_01" },
          { name: "category", label: "TAG", placeholder: "TEAM / INFRA / EVENT" },
          { name: "url", label: "IMAGE_URI", placeholder: "https://images.unsplash.com/..." },
        ];
      default:
        return [];
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-black border border-primary/30 shadow-[0_0_50px_rgba(200,255,0,0.1)] overflow-hidden"
            style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))" }}
          >
            {/* Header */}
            <div className="bg-primary/10 border-b border-primary/20 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-primary" />
                <span className="text-xs font-bold font-mono tracking-widest text-primary uppercase">
                  INITIALIZE_{entityType}_HANDSHAKE
                </span>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Area */}
            <div className="p-8">
              {step === 0 ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center gap-4 text-gray-500 mb-6 border-l-2 border-primary/40 pl-4 py-1">
                    <Shield className="w-4 h-4" />
                    <span className="text-[10px] font-mono uppercase tracking-widest">Awaiting local node parameters...</span>
                  </div>

                  <div className="grid gap-6">
                    {getFields().map((field) => (
                      <div key={field.name} className="space-y-2">
                        <label className="text-[10px] font-bold font-mono tracking-widest text-primary/60 uppercase">
                          {field.label}
                        </label>
                        <input 
                          required
                          type="text"
                          placeholder={field.placeholder}
                          className="w-full bg-white/5 border border-white/10 p-3 text-sm font-jetbrains text-white placeholder:text-gray-700 outline-none focus:border-primary/40 focus:bg-primary/5 transition-all"
                        />
                      </div>
                    ))}
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className="w-full mt-10 flex items-center justify-center gap-3 bg-primary text-black font-bold font-mono text-xs tracking-[0.3em] py-4 uppercase hover:bg-white transition-all disabled:opacity-50"
                    style={{ clipPath: "polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)" }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>PROCESSING...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>COMMIT_DATA</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="py-12 text-center animate-pulse">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Save className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">SUCCESS_SYNC</h3>
                  <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">
                    Entry broadcoast to society network successful.
                  </p>
                </div>
              )}
            </div>

            {/* Matrix Footer Decor */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
