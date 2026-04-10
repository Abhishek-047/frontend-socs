"use client";

import React, { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";

export function Globe3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const globeRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Scene Setup ---
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 250;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- Globe Creation ---
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeRef.current = globeGroup;

    // 1. Base Sphere (Inner Glow)
    const sphereGeometry = new THREE.SphereGeometry(100, 64, 64);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.8,
      side: THREE.FrontSide,
    });
    const mainSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    globeGroup.add(mainSphere);

    // 2. Wireframe / Grid
    const wireframeGeometry = new THREE.SphereGeometry(100.5, 40, 40);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xc8ff00,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    globeGroup.add(wireframe);

    // 3. Points (Dots on surface to look like a map)
    const pointsCount = 10000;
    const pointsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(pointsCount * 3);
    
    // Roughly distribute points on a sphere
    for (let i = 0; i < pointsCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / pointsCount);
        const theta = Math.sqrt(pointsCount * Math.PI) * phi;
        
        positions[i * 3] = 100 * Math.cos(theta) * Math.sin(phi);
        positions[i * 3 + 1] = 100 * Math.sin(theta) * Math.sin(phi);
        positions[i * 3 + 2] = 100 * Math.cos(phi);
    }
    
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pointsMaterial = new THREE.PointsMaterial({
        color: 0xc8ff00,
        size: 0.8,
        transparent: true,
        opacity: 0.4,
    });
    const globePoints = new THREE.Points(pointsGeometry, pointsMaterial);
    globeGroup.add(globePoints);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xc8ff00, 2);
    mainLight.position.set(500, 300, 500);
    scene.add(mainLight);

    const backLight = new THREE.PointLight(0xc8ff00, 1);
    backLight.position.set(-500, -300, -500);
    scene.add(backLight);

    // --- Animation ---
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (globeGroup) {
        globeGroup.rotation.y += 0.002;
        globeGroup.rotation.x += 0.0005;
      }
      renderer.render(scene, camera);
    };
    animate();

    // --- Resize Handler ---
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (containerRef.current) containerRef.current.removeChild(renderer.domElement);
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
