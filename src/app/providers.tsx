"use client";

import React from "react";
import { SmoothScroll } from "../components/layout/SmoothScroll";
import { PageTransition } from "../components/layout/PageTransition";
import { ThemeProvider } from "@/context/ThemeContext";
import { Terminal } from "@/components/ui/Terminal";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {/* Terminal lives here so it can access ThemeContext */}
      <Terminal />
      <SmoothScroll>
        <PageTransition>
          {children}
        </PageTransition>
      </SmoothScroll>
    </ThemeProvider>
  );
}
