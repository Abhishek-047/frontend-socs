"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

// Web Audio API Context
interface AudioContextProps {
  playHover: () => void;
  playType: () => void;
  playClick: () => void;
  playAlert: () => void;
  toggleMute: () => void;
  isMuted: boolean;
}

const AudioUIContext = createContext<AudioContextProps | null>(null);

export function useAudio() {
  const ctx = useContext(AudioUIContext);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(true); // default muted to prevent autoplay policies
  const audioCtxRef = useRef<AudioContext | null>(null);
  const humOscRef = useRef<OscillatorNode | null>(null);
  const humGainRef = useRef<GainNode | null>(null);

  // Initialize audio context on first interaction
  const initAudio = () => {
    if (audioCtxRef.current) return;
    const CtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!CtxClass) return;
    audioCtxRef.current = new CtxClass();
    
    // Create Background Hum
    const humGain = audioCtxRef.current.createGain();
    humGain.gain.value = 0; // muted initially
    humGain.connect(audioCtxRef.current.destination);
    humGainRef.current = humGain;

    const osc = audioCtxRef.current.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(55, audioCtxRef.current.currentTime); // Low hum (55Hz)
    osc.connect(humGain);
    osc.start();
    humOscRef.current = osc;
  };

  useEffect(() => {
    if (isMuted) {
      if (humGainRef.current && audioCtxRef.current) {
        humGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
      }
    } else {
      initAudio();
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      if (humGainRef.current && audioCtxRef.current) {
        humGainRef.current.gain.setTargetAtTime(0.04, audioCtxRef.current.currentTime, 1);
      }
    }
  }, [isMuted]);

  // Synthesis helpers
  const playSound = (config: (ctx: AudioContext, t: number) => void) => {
    if (isMuted) return;
    initAudio();
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();
    config(ctx, ctx.currentTime);
  };

  const playHover = () => {
    playSound((ctx, t) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(1200, t + 0.05);
      gain.gain.setValueAtTime(0.03, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.05);
    });
  };

  const playType = () => {
    playSound((ctx, t) => {
      // White noise burst for mechanical clack
      const bufferSize = ctx.sampleRate * 0.02; // 20ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      // Bandpass filter for that clicky sound
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(4000, t);
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(t);
    });
  };

  const playClick = () => {
    playSound((ctx, t) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.1);
      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.1);
    });
  };

  const playAlert = () => {
    playSound((ctx, t) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.linearRampToValueAtTime(400, t + 0.2);
      osc.frequency.setValueAtTime(300, t + 0.2);
      osc.frequency.linearRampToValueAtTime(400, t + 0.4);
      gain.gain.setValueAtTime(0.05, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.4);
    });
  };

  const toggleMute = () => setIsMuted(p => !p);

  // Global hover listener injection for all buttons/links
  useEffect(() => {
    if (isMuted) return;
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'button' || target.tagName.toLowerCase() === 'a' || target.closest('button') || target.closest('a')) {
        playHover();
      }
    };
    
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'button' || target.tagName.toLowerCase() === 'a' || target.closest('button') || target.closest('a')) {
        playClick();
      }
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("click", handleClick);
    
    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("click", handleClick);
    };
  }, [isMuted]);

  return (
    <AudioUIContext.Provider value={{ playHover, playType, playClick, playAlert, toggleMute, isMuted }}>
      {children}
    </AudioUIContext.Provider>
  );
}
