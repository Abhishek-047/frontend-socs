"use client";

import React from "react";
import { SmoothScroll } from "../components/layout/SmoothScroll";
import { PageTransition } from "../components/layout/PageTransition";
import { ThemeProvider } from "@/context/ThemeContext";
import { Terminal } from "@/components/ui/Terminal";
import { DataStreamBackground } from "@/components/ui/DataStreamBackground";
import { AudioProvider } from "@/context/AudioContext";
import { CRTOverlay } from "@/components/ui/CRTOverlay";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AudioProvider>
      <ThemeProvider>
      {/* Background and Terminal live here so they can access ThemeContext */}
      <DataStreamBackground />
      <Terminal />
        <SmoothScroll>
          <PageTransition>
            {children}
          </PageTransition>
        </SmoothScroll>
        <CRTOverlay />
      </ThemeProvider>
    </AudioProvider>
  );
}
