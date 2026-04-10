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

    // 4. Continent Points (Reliable Image Scan)
    const pointsCount = 20000;
    const pointsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(pointsCount * 3);
    const colors = new Float32Array(pointsCount * 3);
    
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    
    // Using a more stable world map alpha texture
    loader.load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg", 
      (texture) => {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(texture.image, 0, 0, 1024, 512);
        const data = ctx.getImageData(0, 0, 1024, 512).data;

        let pIdx = 0;
        for (let i = 0; i < pointsCount; i++) {
          const phi = Math.acos(-1 + (2 * i) / pointsCount);
          const theta = Math.sqrt(pointsCount * Math.PI) * phi;
          
          const u = 1 - (theta / (Math.PI * 2) % 1);
          const v = phi / Math.PI;
          
          const tx = Math.floor(u * 1023);
          const ty = Math.floor(v * 511);
          const offset = (ty * 1024 + tx) * 4;
          
          // Higher threshold for more distinct continents
          if (data[offset] > 40) {
            positions[pIdx * 3] = GLOBE_RADIUS * Math.cos(theta) * Math.sin(phi);
            positions[pIdx * 3 + 1] = GLOBE_RADIUS * Math.sin(theta) * Math.sin(phi);
            positions[pIdx * 3 + 2] = GLOBE_RADIUS * Math.cos(phi);

            const color = new THREE.Color(0xc8ff00);
            if (Math.random() > 0.98) color.setHex(0xffffff);
            colors[pIdx * 3] = color.r;
            colors[pIdx * 3 + 1] = color.g;
            colors[pIdx * 3 + 2] = color.b;
            pIdx++;
          }
        }
        
        pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions.slice(0, pIdx * 3), 3));
        pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors.slice(0, pIdx * 3), 3));
        
        const pointsMaterial = new THREE.PointsMaterial({
            size: 0.85,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });
        const globePoints = new THREE.Points(pointsGeometry, pointsMaterial);
        globeRoot.add(globePoints);
      },
      undefined,
      (err) => {
        console.error("Failed to load map texture, using grid-fallback");
        // Fallback: Uniform but sparse grid
        for (let i = 0; i < 5000; i++) {
            const phi = Math.acos(-1 + (2 * i) / 5000);
            const theta = Math.sqrt(5000 * Math.PI) * phi;
            positions[i * 3] = GLOBE_RADIUS * Math.cos(theta) * Math.sin(phi);
            positions[i * 3 + 1] = GLOBE_RADIUS * Math.sin(theta) * Math.sin(phi);
            positions[i * 3 + 2] = GLOBE_RADIUS * Math.cos(phi);
        }
        pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions.slice(0, 15000), 3));
        const pointsMaterialStyle = new THREE.PointsMaterial({ color: 0xc8ff00, size: 0.8, transparent: true, opacity: 0.3 });
        globeRoot.add(new THREE.Points(pointsGeometry, pointsMaterialStyle));
      }
    );

    // --- Animation Loop ---
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (globeRoot) {
        globeRoot.rotation.y += 0.003;
      }
      renderer.render(scene, camera);
    };
    animate();

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
      cancelAnimationFrame(animationId);
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
