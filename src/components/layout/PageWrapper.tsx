"use client";

import React, { useEffect } from "react";
import { registerGSAP } from "../../lib/animations";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className = "" }: PageWrapperProps) {
  useEffect(() => {
    registerGSAP();
  }, []);

  return (
    <div className={`relative min-h-screen pt-20 pb-12 w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 ${className}`}>
      {/* Background layer */}
      <div className="fixed inset-0 pointer-events-none -z-20 grid-background opacity-20"></div>
      <div className="fixed inset-0 pointer-events-none -z-20 grid-background-dots opacity-10"></div>
      
      {/* Scan line overlay (globally applied utility class or div here) */}
      <div className="fixed inset-0 pointer-events-none z-50 scan-line opacity-30"></div>
      
      {/* Page Content */}
      <div className="relative z-10 w-full animate-fade-up">
        {children}
      </div>
    </div>
  );
}
