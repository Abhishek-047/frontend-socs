"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export function Globe3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Scene Setup ---
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    
    // Closer FOV for more impact with smaller radius
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 2000);
    camera.position.z = 300;

    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const globeRoot = new THREE.Group();
    scene.add(globeRoot);
    globeRef.current = globeRoot;

    const GLOBE_RADIUS = 80;

    // 1. Core Sphere (Dark Base)
    const sphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS - 1, 64, 64);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x020406,
      transparent: true,
      opacity: 0.95,
      shininess: 40,
    });
    const mainSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    globeRoot.add(mainSphere);

    // 2. Atmospheric Glow
    const glowGeometry = new THREE.SphereGeometry(GLOBE_RADIUS + 5, 64, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xc8ff00,
      transparent: true,
      opacity: 0.03,
      side: THREE.BackSide,
    });
    const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glowSphere);

    // 3. Grid (Outer Utility)
    const gridGeometry = new THREE.SphereGeometry(GLOBE_RADIUS + 0.5, 36, 36);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0xc8ff00,
      wireframe: true,
      transparent: true,
      opacity: 0.05,
    });
    const globeGrid = new THREE.Mesh(gridGeometry, gridMaterial);
    globeRoot.add(globeGrid);

    // 4. Continent Points (Reliable Image Scan + Local Fallback)
    const pointsCount = 20000;
    const pointsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(pointsCount * 3);
    const colors = new Float32Array(pointsCount * 3);
    
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    
    const createPointsFromData = (data: Uint8ClampedArray, w: number, h: number) => {
        let pIdx = 0;
        for (let i = 0; i < pointsCount; i++) {
          const phi = Math.acos(-1 + (2 * i) / pointsCount);
          const theta = Math.sqrt(pointsCount * Math.PI) * phi;
          
          const u = 1 - (theta / (Math.PI * 2) % 1);
          const v = phi / Math.PI;
          
          const tx = Math.floor(u * (w - 1));
          const ty = Math.floor(v * (h - 1));
          const offset = (ty * w + tx) * 4;
          
          if (data[offset] > 40) {
            positions[pIdx * 3] = GLOBE_RADIUS * Math.cos(theta) * Math.sin(phi);
            positions[pIdx * 3 + 1] = GLOBE_RADIUS * Math.sin(theta) * Math.sin(phi);
            positions[pIdx * 3 + 2] = GLOBE_RADIUS * Math.cos(phi);

            const color = new THREE.Color(0xc8ff00);
            colors[pIdx * 3] = color.r;
            colors[pIdx * 3 + 1] = color.g;
            colors[pIdx * 3 + 2] = color.b;
            pIdx++;
          }
        }
        
        pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions.slice(0, pIdx * 3), 3));
        pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors.slice(0, pIdx * 3), 3));
        
        const pointsMaterial = new THREE.PointsMaterial({
            size: 0.9,
            vertexColors: true,
            transparent: true,
            opacity: 0.75,
            blending: THREE.AdditiveBlending
        });
        const globePoints = new THREE.Points(pointsGeometry, pointsMaterial);
        globeRoot.add(globePoints);
    };

    // Load world map
    loader.load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg", 
      (texture) => {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(texture.image, 0, 0, 1024, 512);
        const data = ctx.getImageData(0, 0, 1024, 512).data;
        createPointsFromData(data, 1024, 512);
      },
      undefined,
      () => {
        // Simple internal fallback if image fails
        console.warn("Using fallback grid");
        const fallbackData = new Uint8ClampedArray(64 * 32 * 4);
        for(let i=0; i<fallbackData.length; i+=4) {
            // Randomish "continents"
            if (Math.random() > 0.5) fallbackData[i] = 255; 
        }
        createPointsFromData(fallbackData, 64, 32);
      }
    );

    // --- Animation Loop ---
    const animate = () => {
      if (globeRoot) {
        globeRoot.rotation.y += 0.003;
      }
      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (containerRef.current && renderer.domElement.parentElement === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden">
        {/* Decorative HUD Lines */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center translate-x-[3px]">
            <div className="w-[120%] h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent rotate-45 opacity-50" />
            <div className="w-[120%] h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent -rotate-45 opacity-50 absolute" />
        </div>
        
        {/* HUD Elements */}
        <div className="absolute top-0 right-0 z-30 font-mono text-[8px] text-primary/40 tracking-[0.4em] uppercase p-10 space-y-2 hidden xl:block">
            <div className="animate-pulse">STREAMING_UPLINK: ACTIVE</div>
            <div>CORE_TEMP: 32°C</div>
            <div className="h-[1px] w-12 bg-primary/20" />
            <div>NODE_ID: 0x82FA</div>
        </div>
        
        <div className="absolute bottom-4 left-4 z-30 font-mono text-[7px] text-primary/30 tracking-widest p-8">
            <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-primary/50 rounded-full" />
                <span>GLOBAL_POSTURE: SECURE</span>
            </div>
        </div>
    </div>
  );
}
