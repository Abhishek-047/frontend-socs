"use client";

import React from "react";
import { SmoothScroll } from "../components/layout/SmoothScroll";
import { PageTransition } from "../components/layout/PageTransition";
import { ThemeProvider } from "@/context/ThemeContext";
import { Terminal } from "@/components/ui/Terminal";
import { DataStreamBackground } from "@/components/ui/DataStreamBackground";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {/* Background and Terminal live here so they can access ThemeContext */}
      <DataStreamBackground />
      <Terminal />
      <SmoothScroll>
        <PageTransition>
          {children}
        </PageTransition>
      </SmoothScroll>
    </ThemeProvider>
  );
}
