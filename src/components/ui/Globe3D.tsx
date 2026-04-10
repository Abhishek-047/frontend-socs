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

    // 4. Continent Points (Using a texture/image to filter points)
    const pointsCount = 18000;
    const pointsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(pointsCount * 3);
    const colors = new Float32Array(pointsCount * 3);
    
    // We'll use a World Map image to define where the points go
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg"; // Using specular as a land mask
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

      let pIdx = 0;
      for (let i = 0; i < pointsCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / pointsCount);
        const theta = Math.sqrt(pointsCount * Math.PI) * phi;
        
        // Convert spherical to texture coordinates
        const u = 1 - (theta / (Math.PI * 2) % 1);
        const v = phi / Math.PI;
        
        const tx = Math.floor(u * (canvas.width - 1));
        const ty = Math.floor(v * (canvas.height - 1));
        const offset = (ty * canvas.width + tx) * 4;
        
        // If the pixel is "land" (non-black in the specular map)
        if (data[offset] > 30) {
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
          size: 0.9,
          vertexColors: true,
          transparent: true,
          opacity: 0.6,
          blending: THREE.AdditiveBlending
      });
      const globePoints = new THREE.Points(pointsGeometry, pointsMaterial);
      globeRoot.add(globePoints);
    };

    // --- Animation Loop ---
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (globeRef.current) {
        globeRef.current.rotation.y += 0.0025;
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
        {/* Decorative Grid Overlays (CSS) */}
        <div className="absolute inset-0 pointer-events-none border border-primary/10 m-8 z-20" />
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30 z-20">
            <div className="w-[80%] h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="h-[80%] w-[1px] bg-gradient-to-b from-transparent via-primary to-transparent absolute" />
        </div>
        
        {/* HUD Elements */}
        <div className="absolute top-10 left-10 z-30 font-mono text-[9px] text-primary/60 tracking-widest hidden md:block">
            <div>OBJECT: CORE_NODE_01</div>
            <div className="mt-1">STATUS: STABLE</div>
            <div className="mt-1">SCANNING...</div>
        </div>
        
        <div className="absolute bottom-10 right-10 z-30 font-mono text-[9px] text-primary/60 tracking-widest hidden md:block">
            <div className="text-right">LAT: 0.00000</div>
            <div className="mt-1 text-right">LON: 0.00000</div>
            <div className="mt-1 text-right">ROT: SYNCED</div>
        </div>
    </div>
  );
}
