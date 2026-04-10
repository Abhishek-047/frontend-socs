"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export function Globe3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Dimensions
    const width = containerRef.current.clientWidth || 600;
    const height = containerRef.current.clientHeight || 600;

    // --- Scene Setup ---
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
    
    // Clear naming for the renderer element
    renderer.domElement.id = "globe-canvas";
    containerRef.current.innerHTML = ""; // Clear any previous content
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const globeRoot = new THREE.Group();
    scene.add(globeRoot);

    const GLOBE_RADIUS = 75;

    // 1. Core Sphere
    const sphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS - 0.5, 64, 64);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x020406,
      transparent: true,
      opacity: 0.9,
      shininess: 30,
    });
    const mainSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    globeRoot.add(mainSphere);

    // 2. Grid lines
    const gridGeometry = new THREE.SphereGeometry(GLOBE_RADIUS + 0.2, 40, 40);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0xc8ff00,
      wireframe: true,
      transparent: true,
      opacity: 0.04,
    });
    globeRoot.add(new THREE.Mesh(gridGeometry, gridMaterial));

    // 3. Continent Dots (Hardcoded simplified continent logic)
    // We use a mathematical approximation for basic continents if images fail
    const pointsCount = 15000;
    const positions = [];
    const colors = [];
    const colorPrimary = new THREE.Color(0xc8ff00);

    // Basic continent detection logic based on spherical coordinates
    // Approximate land masses
    const isLand = (lat: number, lon: number) => {
        // Simple bounding boxes for continents
        // North America
        if (lat > 0.1 && lat < 1.3 && lon > -3.0 && lon < -1.0) return true;
        // South America
        if (lat > -1.0 && lat < 0.1 && lon > -1.5 && lon < -0.5) return true;
        // Africa
        if (lat > -0.8 && lat < 0.8 && lon > -0.4 && lon < 0.9) return true;
        // Eurasia
        if (lat > 0.2 && lat < 1.4 && lon > 0.1 && lon < 3.0) return true;
        // Australia
        if (lat > -0.9 && lat < -0.2 && lon > 1.8 && lon < 2.8) return true;
        // Antarctica (center)
        if (lat < -1.2) return true;
        
        // Random Noise for "islands"
        const noise = Math.sin(lat * 10) * Math.cos(lon * 10);
        return noise > 0.7;
    };

    for (let i = 0; i < pointsCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / pointsCount);
        const theta = Math.sqrt(pointsCount * Math.PI) * phi;
        
        // Calculate lat/lon
        const lat = Math.PI/2 - phi;
        const lon = ((theta + Math.PI) % (Math.PI * 2)) - Math.PI;

        if (isLand(lat, lon)) {
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xc8ff00, 1.5);
    pointLight.position.set(200, 100, 150);
    scene.add(pointLight);

    // --- Animation Loop ---
    let frameId: number;
    const render = () => {
        frameId = requestAnimationFrame(render);
        if (globeRoot) {
            globeRoot.rotation.y += 0.003;
        }
        renderer.render(scene, camera);
    };
    render();

    // --- Resize handler ---
    const handleResize = () => {
        if (!containerRef.current || !rendererRef.current) return;
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
