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

import { useDeepWeb } from "./DeepWebContext";

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isDeepWeb, setIsDeepWeb] = useState(false); // Can't easily use useContext here due to provider order, so we'll listen to a custom event or wrap carefully. Wait, let's just create an event listener for deep web state to decouple it.

  useEffect(() => {
     const hw = () => setIsDeepWeb(true);
     const lw = () => setIsDeepWeb(false);
     window.addEventListener("deepweb-engage", hw);
     window.addEventListener("deepweb-disengage", lw);
     return () => {
         window.removeEventListener("deepweb-engage", hw);
         window.removeEventListener("deepweb-disengage", lw);
     };
  }, []);

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
    osc.frequency.setValueAtTime(55, audioCtxRef.current.currentTime);
    osc.connect(humGain);
    osc.start();
    humOscRef.current = osc;
  };

  useEffect(() => {
      if (humOscRef.current && audioCtxRef.current) {
          if (isDeepWeb) {
              // Pitch drop to eerie deep web sound
              humOscRef.current.frequency.setTargetAtTime(35, audioCtxRef.current.currentTime, 1);
          } else {
              humOscRef.current.frequency.setTargetAtTime(55, audioCtxRef.current.currentTime, 1);
          }
      }
  }, [isDeepWeb]);

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
        // Very low volume: 0.005 instead of 0.04
        humGainRef.current.gain.setTargetAtTime(0.005, audioCtxRef.current.currentTime, 1);
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
      osc.frequency.setValueAtTime(isDeepWeb ? 300 : 600, t);
      osc.frequency.exponentialRampToValueAtTime(isDeepWeb ? 600 : 1200, t + 0.05);
      // Extremely low hover volume
      gain.gain.setValueAtTime(0.002, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
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
      filter.frequency.setValueAtTime(isDeepWeb ? 2000 : 4000, t);
      
      const gain = ctx.createGain();
      // Extremely quiet typing sound
      gain.gain.setValueAtTime(0.015, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);

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
      osc.frequency.setValueAtTime(isDeepWeb ? 80 : 150, t);
      osc.frequency.exponentialRampToValueAtTime(isDeepWeb ? 20 : 40, t + 0.1);
      // Extremely low click volume
      gain.gain.setValueAtTime(0.003, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
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
      // Alarm volume also lowered
      gain.gain.setValueAtTime(0.01, t);
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
