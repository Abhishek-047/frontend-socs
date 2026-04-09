"use client";

import React, { useRef, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import gsap from "gsap";
import { useDeepWeb } from "@/context/DeepWebContext";

export function DataStreamBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const { isDeepWeb } = useDeepWeb();

  useEffect(() => {
    if (wrapperRef.current) {
      gsap.fromTo(
        wrapperRef.current,
        { opacity: 0 },
        { opacity: 0.35, duration: 2.5, ease: "power2.out" }
      );
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Characters array to mimic cyber/hex stream
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%#&_(),.;:?!\\|{}<>[]^~アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン".split("");
    const deepWebLeaks = [
      "admin@socs.io:a3c89ff", "CC:4512-****-2311", "0x34BF12A", 
      "sudo rm -rf /", "root:x:0:0:root", "ETH_WALLET_DUMP", 
      "kernel_panic_0x000", "DB_LEAK_SUCCESS", "SYSLOG_WIPE_OK",
      "ip_address=192.168.1.44", "RSA_PRIV_KEY_B64"
    ];
    
    // Matrix configuration
    const fontSize = isDeepWeb ? 12 : 16;
    let columns = Math.floor(width / fontSize);
    let drops: number[] = [];
    
    // Initialize drops - randomize start height to prevent uniform wall
    for (let x = 0; x < columns; x++) {
      drops[x] = (Math.random() * -100) - 10;
    }

    // Convert hex theme variable to RGB format for the transparent trail
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '5, 5, 8';
    };

    let animationFrameId: number;
    let lastDrawTime = 0;
    const fps = 30; // 30 FPS gives standard matrix-y chunkiness
    const interval = 1000 / fps;

    const draw = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(draw);
      
      const deltaTime = currentTime - lastDrawTime;
      if (deltaTime < interval) return;
      lastDrawTime = currentTime - (deltaTime % interval);

      // Create faded trail effect over the canvas each run
      const bgRgb = hexToRgb(theme.background);
      ctx.fillStyle = `rgba(${bgRgb}, 0.12)`;
      ctx.fillRect(0, 0, width, height);

      // Setup typography configuration
      ctx.font = `600 ${fontSize}px mx-font, monospace`;
      ctx.textAlign = "center";
      
      for (let i = 0; i < drops.length; i++) {
        const text = isDeepWeb && Math.random() > 0.9 
             ? deepWebLeaks[Math.floor(Math.random() * deepWebLeaks.length)]
             : chars[Math.floor(Math.random() * chars.length)];
             
        // Occasional color glitch
        const randColor = Math.random();
        if (isDeepWeb) {
            if (randColor > 0.95) ctx.fillStyle = "#ff0000";
            else if (randColor > 0.8) ctx.fillStyle = "#ff6b00";
            else ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
        } else {
            if (randColor > 0.98) {
                 ctx.fillStyle = "#ffffff";
            } else if (randColor > 0.95) {
                 ctx.fillStyle = theme.secondary;
            } else {
                 ctx.fillStyle = theme.primary;
            }
        }

        const dropX = i * fontSize + (fontSize / 2);
        const dropY = drops[i] * fontSize;
        
        ctx.fillText(text, dropX, dropY);

        // Reset drop offscreen top randomly, or if it reached the bottom
        if (dropY > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Deep web matrix moves faster
        drops[i] += isDeepWeb ? 1.5 : 1;
      }
    };

    animationFrameId = requestAnimationFrame(draw);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      
      const newColumns = Math.floor(width / fontSize);
      if (newColumns > columns) {
          for(let i = columns; i < newColumns; i++) {
              drops[i] = (Math.random() * -100) - 10;
          }
      }
      columns = newColumns;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [theme.primary, theme.secondary, theme.background, isDeepWeb]);

  return (
    <div ref={wrapperRef} className="fixed inset-0 z-[0] pointer-events-none opacity-0 overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)] pointer-events-none" />
    </div>
  );
}
