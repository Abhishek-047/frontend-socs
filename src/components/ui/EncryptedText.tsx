"use client";
import React, { useState, useEffect } from "react";
import { useDeepWeb } from "@/context/DeepWebContext";

interface EncryptedTextProps {
  children: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

const HEX_CHARS = "0123456789ABCDEF!@#$%^&*";

export function EncryptedText({ children, className = "", as: Component = "span" }: EncryptedTextProps) {
  const { isDeepWeb } = useDeepWeb();
  const [isHovered, setIsHovered] = useState(false);
  const [displayText, setDisplayText] = useState<string>(children);

  useEffect(() => {
    if (!isDeepWeb || isHovered) {
      setDisplayText(children);
      return;
    }

    // Interval to scramble text repeatedly while deep web is on and not hovered
    const scramble = () => {
      const arr = children.split("");
      for (let i = 0; i < arr.length; i++) {
         if (arr[i] === " " || arr[i] === "\n") continue;
         if (Math.random() > 0.3) {
             arr[i] = HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
         }
      }
      setDisplayText(arr.join(""));
    };
    
    scramble(); // initial
    const iv = setInterval(scramble, 100);
    return () => clearInterval(iv);
  }, [isDeepWeb, isHovered, children]);

  return (
    <Component 
      className={`${className} ${isDeepWeb ? "cursor-crosshair font-mono" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        color: isDeepWeb && !isHovered ? "var(--color-primary)" : undefined,
        opacity: isDeepWeb && !isHovered ? 0.6 : 1,
        textShadow: isDeepWeb && isHovered ? "0 0 10px var(--color-primary)" : "none"
      }}
    >
      {displayText}
    </Component>
  );
}
