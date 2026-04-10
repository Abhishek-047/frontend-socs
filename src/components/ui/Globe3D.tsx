"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";

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

    const GLOBE_RADIUS = Math.min(65, width / 12);
    const colorPrimary = new THREE.Color(0xc8ff00);

    // 1. Core Sphere
    const baseGeo = new THREE.SphereGeometry(GLOBE_RADIUS - 1.5, 64, 64);
    const baseMat = new THREE.MeshPhongMaterial({
      color: 0x010203,
      transparent: true,
      opacity: 0.95,
      shininess: 60,
    });
    globeRoot.add(new THREE.Mesh(baseGeo, baseMat));

    // 2. High-Fidelity Continents (Correct Spherical Projection)
    const isLand = (lat: number, lon: number) => {
        // High-precision geographic masks
        // Americas
        if (lat > -55 && lat < 72 && lon > -168 && lon < -34) {
            if (lat < 12 && lon < -82) return false;
            if (lat > 15 && lat < 30 && lon > -80) return false; // Gulf
            return true;
        }
        // Africa
        if (lat > -35 && lat < 37 && lon > -18 && lon < 51) {
            if (lat > 15 && lon > 35) return false; // Red Sea
            return true;
        }
        // Eurasia
        if (lat > 10 && lat < 78 && lon > -10 && lon < 190) {
            if (lat < 32 && lon > 32 && lon < 60) return false; // Arabia/Med gap
            return true;
        }
        // Australia
        if (lat > -44 && lat < -10 && lon > 112 && lon < 154) return true;
        // Greenland
        if (lat > 60 && lat < 84 && lon > -70 && lon < -10) return true;
        
        return false;
    };

    const count = 30000;
    const positions: number[] = [];
    const colors: number[] = [];

    for (let i = 0; i < count; i++) {
        // Correct Spherical Fibonacci Distribution
        const phi = Math.acos(-1 + (2 * i) / count); // 0 to PI
        const theta = Math.sqrt(count * Math.PI) * phi; // Angle around Y

        // Lat/Lon mapping (Correct Projection)
        const lat = 90 - (phi * 180 / Math.PI);
        const lon = (((theta * 180 / Math.PI) + 180) % 360) - 180;

        if (isLand(lat, lon)) {
            // Correct Three.js Cartesian conversion (Y is UP)
            const x = GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta);
            const z = GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta);
            const y = GLOBE_RADIUS * Math.cos(phi);
            
            positions.push(x, y, z);
            colors.push(colorPrimary.r, colorPrimary.g, colorPrimary.b);
        }
    }

    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    pointsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const pointsMaterial = new THREE.PointsMaterial({
        size: 1.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    globeRoot.add(new THREE.Points(pointsGeometry, pointsMaterial));

    // 3. Attack Arcs
    const arcGroup = new THREE.Group();
    globeRoot.add(arcGroup);

    const getCoord = (lat: number, lon: number) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        return new THREE.Vector3(
            - (GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta)),
            (GLOBE_RADIUS * Math.cos(phi)),
            (GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta))
        );
    };

    const createArc = () => {
        const startLat = (Math.random() - 0.5) * 140;
        const startLon = (Math.random() - 0.5) * 360;
        const endLat = (Math.random() - 0.5) * 140;
        const endLon = (Math.random() - 0.5) * 360;

        const start = getCoord(startLat, startLon);
        const end = getCoord(endLat, endLon);
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        const dist = start.distanceTo(end);
        mid.normalize().multiplyScalar(GLOBE_RADIUS + dist * 0.4);

        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const pts = curve.getPoints(50);
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const mat = new THREE.LineBasicMaterial({ color: colorPrimary, transparent: true, opacity: 0 });

        const line = new THREE.Line(geo, mat);
        arcGroup.add(line);

        gsap.to(mat, {
            opacity: 0.6,
            duration: 1.5,
            repeat: 1,
            yoyo: true,
            onComplete: () => {
                arcGroup.remove(line);
                geo.dispose();
                mat.dispose();
            }
        });
    };
    const arcInterval = setInterval(createArc, 1500);

    // 4. Lighting & Effects
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const topLight = new THREE.PointLight(0xc8ff00, 2);
    topLight.position.set(200, 200, 200);
    scene.add(topLight);

    const coreGlow = new THREE.Mesh(
        new THREE.SphereGeometry(GLOBE_RADIUS * 0.95, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xc8ff00, transparent: true, opacity: 0.05 })
    );
    globeRoot.add(coreGlow);

    // 5. Animation
    let frameId: number;
    const render = () => {
        frameId = requestAnimationFrame(render);
        globeRoot.rotation.y += 0.002;
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
        clearInterval(arcInterval);
        window.removeEventListener("resize", handleResize);
        renderer.dispose();
        if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative border-none outline-none flex items-center justify-center pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-radial-gradient from-primary/5 to-transparent pointer-events-none -z-10" />
    </div>
  );
}
