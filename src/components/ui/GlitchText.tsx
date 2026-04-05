"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface GlitchTextProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "span" | "p";
  className?: string;
  intensity?: "low" | "medium" | "high";
}

export function GlitchText({ text, as: Component = "span", className = "", intensity = "medium" }: GlitchTextProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    // Intermittent hard jitter bursts
    const jitterConfig = {
      low:    { chance: 0.04, maxSkew: 3, maxX: 3 },
      medium: { chance: 0.08, maxSkew: 7, maxX: 6 },
      high:   { chance: 0.18, maxSkew: 15, maxX: 12 },
    }[intensity];

    let rafId: number;
    let frame = 0;

    const tick = () => {
      frame++;
      if (frame % 3 === 0 && Math.random() < jitterConfig.chance) {
        const skew = (Math.random() - 0.5) * jitterConfig.maxSkew;
        const tx = (Math.random() - 0.5) * jitterConfig.maxX;
        el.style.transform = `skewX(${skew}deg) translateX(${tx}px)`;

        // Reset after a few frames
        setTimeout(() => {
          if (el) el.style.transform = "";
        }, 50 + Math.random() * 80);
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [intensity]);

  const intensityClass = {
    low: "glitch-text--low",
    medium: "glitch-text--medium",
    high: "glitch-text--high",
  }[intensity];

  return (
    <Component
      ref={containerRef as any}
      className={`glitch-text ${intensityClass} ${className}`}
      data-text={text}
    >
      {text}
    </Component>
  );
}
