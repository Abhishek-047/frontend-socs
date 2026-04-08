"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrambleTextProps {
  text: string;
  className?: string;
  delay?: number; // Delay in ms before starting
}

const CHARS = "!<>-_\\\\/[]{}—=+*^?#_";

export function ScrambleText({ text, className = "", delay = 0 }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [isDone, setIsDone] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let frame: number;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isDone) {
          timeout = setTimeout(() => {
            startScramble();
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const startScramble = () => {
      let iteration = 0;
      const maxIterations = text.length;

      const tick = () => {
        setDisplayText(
          text
            .split("")
            .map((char, index) => {
              if (index < iteration) {
                return text[index];
              }
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("")
        );

        if (iteration >= maxIterations) {
          setIsDone(true);
          return;
        }

        iteration += 1 / 3; // speed of deciphering
        frame = requestAnimationFrame(tick);
      };

      frame = requestAnimationFrame(tick);
    };

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [text, delay, isDone]);

  return (
    <span ref={containerRef} className={className}>
      {isDone ? text : displayText || text.replace(/./g, "\u00A0")}
    </span>
  );
}
