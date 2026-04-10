"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export function Globe3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 600;
    const height = containerRef.current.clientHeight || 600;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
    camera.position.z = 250;

    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const globeRoot = new THREE.Group();
    scene.add(globeRoot);

    const GLOBE_RADIUS = 60; 

    // 1. Core Sphere
    const sphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS - 0.5, 64, 64);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x020406,
      transparent: true,
      opacity: 0.8,
      shininess: 30,
    });
    const mainSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    globeRoot.add(mainSphere);

    // 2. Subtle Grid
    const gridGeometry = new THREE.SphereGeometry(GLOBE_RADIUS + 0.2, 32, 32);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0xc8ff00,
      wireframe: true,
      transparent: true,
      opacity: 0.03,
    });
    globeRoot.add(new THREE.Mesh(gridGeometry, gridMaterial));

    // 3. Continent Mask 
    const pointsCount = 12000;
    const positions = [];
    const colors = [];
    const colorPrimary = new THREE.Color(0xc8ff00);

    const isContinent = (lat: number, lon: number) => {
      // Improved Geographic Bounding Boxes
      // Americas
      if (lat > -0.9 && lat < 1.3 && lon > -2.8 && lon < -0.6) return true;
      // Eurasia + Africa
      if (lat > -0.7 && lat < 1.4 && lon > -0.3 && lon < 3.0) return true;
      // Australia
      if (lat > -0.8 && lat < -0.2 && lon > 2.0 && lon < 2.9) return true;
      
      return false;
    };

    for (let i = 0; i < pointsCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / pointsCount);
        const theta = Math.sqrt(pointsCount * Math.PI) * phi;
        
        const lat = Math.PI/2 - phi;
        const lon = ((theta + Math.PI) % (Math.PI * 2)) - Math.PI;

        if (isContinent(lat, lon)) {
            const x = GLOBE_RADIUS * Math.cos(theta) * Math.sin(phi);
            const y = GLOBE_RADIUS * Math.sin(theta) * Math.sin(phi);
            const z = GLOBE_RADIUS * Math.cos(phi);
            positions.push(x, y, z);
            colors.push(colorPrimary.r, colorPrimary.g, colorPrimary.b);
        }
    }

    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    pointsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const pointsMaterial = new THREE.PointsMaterial({
        size: 0.9,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });
    globeRoot.add(new THREE.Points(pointsGeometry, pointsMaterial));

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // --- Animation ---
    let frameId: number;
    const render = () => {
        frameId = requestAnimationFrame(render);
        globeRoot.rotation.y += 0.0025;
        renderer.render(scene, camera);
    };
    render();

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
        cancelAnimationFrame(frameId);
        window.removeEventListener("resize", handleResize);
        renderer.dispose();
        if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative flex items-center justify-center">
        {/* Fallback during potential delay */}
        <div className="absolute font-mono text-[8px] text-primary/20 animate-pulse">INIT_COORD_STREAM...</div>
        
        {/* HUD Elements Overlay */}
        <div className="absolute top-4 right-4 z-10 font-mono text-[7px] text-primary/30 uppercase text-right space-y-1 hidden md:block">
            <div>UPLINK: ACTIVE</div>
            <div>STATION: 39°N 77°W</div>
        </div>
    </div>
  );
}
