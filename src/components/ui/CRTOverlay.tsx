"use client";
import React from 'react';

export function CRTOverlay() {
  return (
    <>
      <div 
        className="pointer-events-none fixed inset-0 z-50 overflow-hidden mix-blend-screen hidden md:block"
        style={{
          boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.9)'
        }}
      >
        {/* Subtle scanline animation */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjMiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSIxIiBmaWxsPSJyZ2JhKDI1NSoyNTUsMjU1LDAuMDMpIiAvPgo8L3N2Zz4=')] opacity-50 bg-repeat bg-top w-full h-[200%] animate-scanlines" />
        
        {/* Curvature distortion approximation using radial gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0)_60%,rgba(0,0,0,0.4)_100%)] opacity-80" />
      </div>

      <style jsx global>{`
        @keyframes scanlines {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-50%);
          }
        }
        .animate-scanlines {
          animation: scanlines 8s linear infinite;
        }

        /* Subtle RGB shift that acts as CRT chromatic aberration (globally) */
        .crt-flicker-container {
          animation: crtflicker 0.15s infinite;
        }

        @keyframes crtflicker {
          0% { opacity: 0.98; }
          50% { opacity: 1; }
          100% { opacity: 0.99; }
        }
      `}</style>
    </>
  );
}
