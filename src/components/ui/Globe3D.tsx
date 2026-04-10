"use client";

import React, { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";

export function Globe3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeRef = useRef<THREE.Group | null>(null);
  const cloudsRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Scene Setup ---
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 2000);
    camera.position.z = 280;

    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- Globe Creation ---
    const globeRoot = new THREE.Group();
    scene.add(globeRoot);
    globeRef.current = globeRoot;

    // 1. Core Sphere (Dark Base)
    const sphereGeometry = new THREE.SphereGeometry(100, 64, 64);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x05080a,
      transparent: true,
      opacity: 0.9,
      shininess: 20,
    });
    const mainSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    globeRoot.add(mainSphere);

    // 2. Atmospheric Glow
    const glowGeometry = new THREE.SphereGeometry(105, 64, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xc8ff00,
      transparent: true,
      opacity: 0.05,
      side: THREE.BackSide,
    });
    const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glowSphere); // Static outer glow

    // 3. Grid / Wireframe (Outer Layer)
    const wireframeGeometry = new THREE.SphereGeometry(101, 48, 48);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xc8ff00,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    globeRoot.add(wireframe);

    // 4. World Map Points (High-Quality Distribution)
    // We simulate continents by focusing points in specific areas or using a high density
    const pointsCount = 12000;
    const pointsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(pointsCount * 3);
    const colors = new Float32Array(pointsCount * 3);
    
    for (let i = 0; i < pointsCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / pointsCount);
        const theta = Math.sqrt(pointsCount * Math.PI) * phi;
        
        positions[i * 3] = 100.5 * Math.cos(theta) * Math.sin(phi);
        positions[i * 3 + 1] = 100.5 * Math.sin(theta) * Math.sin(phi);
        positions[i * 3 + 2] = 100.5 * Math.cos(phi);

        // Variant colors for slight digital glitch look
        const color = new THREE.Color(0xc8ff00);
        if (Math.random() > 0.95) color.setHex(0xffffff);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }
    
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const pointsMaterial = new THREE.PointsMaterial({
        size: 0.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.5,
    });
    const globePoints = new THREE.Points(pointsGeometry, pointsMaterial);
    globeRoot.add(globePoints);

    // 5. Orbital Rings
    const ringGeom = new THREE.RingGeometry(130, 131, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xc8ff00, side: THREE.DoubleSide, transparent: true, opacity: 0.1 });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.rotation.x = Math.PI / 2;
    globeRoot.add(ring);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0xc8ff00, 2);
    blueLight.position.set(200, 100, 200);
    scene.add(blueLight);

    const topLight = new THREE.SpotLight(0xffffff, 1);
    topLight.position.set(0, 500, 0);
    scene.add(topLight);

    // --- Animation Loop ---
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      if (globeRef.current) {
        globeRef.current.rotation.y += 0.003; // Fixed rotation
        globeRef.current.rotation.z += 0.0002;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // --- Resize Handler ---
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
