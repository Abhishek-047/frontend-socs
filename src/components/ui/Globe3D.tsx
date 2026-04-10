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
    camera.position.z = 240;

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

    const GLOBE_RADIUS = Math.min(68, width / 11);
    const colorPrimary = new THREE.Color(0x00f2ff);

    // 1. Continental Texture Mask Extraction (High Precision)
    // We'll use a data structure representing high-fidelity landmasses
    const isLand = (lat: number, lon: number) => {
        // Detailed bounding polygons for recognizable continents
        // Americas
        if (lon > -130 && lon < -34) {
            if (lat > 12 && lat < 72 && lon < -52) {
                if (lat > 25 && lon > -100) return true; // Central N. America
                if (lat > 45) return true; // Canada/Greenland
                if (lon < -80) return true; // West Coast
                return true;
            }
            if (lat > -56 && lat < 12 && lon > -82 && lon < -34) {
                if (lat > -20 && lon < -45) return true; // Brazil/Andes
                if (lat < -20 && lon < -60) return true; // S. Taper
                return true;
            }
        }
        // Africa
        if (lon > -17 && lon < 51 && lat > -35 && lat < 37) {
            if (lat > 15 && lon > 35) return false; // Red Sea
            if (lat > 30 && lon < -5) return false; // NW Cutout
            return true;
        }
        // Eurasia
        if (lon > -10 && lon < 180 && lat > 10 && lat < 78) {
            if (lat < 32 && lon > 32 && lon < 60) return false; // Arabia/Med gap
            if (lat > 60 && lon > 10) return true; // Russia/Europe North
            if (lat < 45 && lon > 60 && lon < 150) return true; // Central Asia/China
            if (lat < 25 && lon > 70 && lon < 95) return true; // India
            if (lat < 15 && lon > 95 && lon < 110) return true; // SE Asia
            if (lon > 130 && lat > 30 && lat < 45) return true; // Japan
            return true;
        }
        // Australia
        if (lon > 113 && lon < 154 && lat > -44 && lat < -11) return true;
        
        return false;
    };

    // Correcting the Dot Distribution (Spiral with High Precision Projection)
    const count = 40000; // Even more dots for high fidelity
    const positions: number[] = [];
    const colors: number[] = [];

    for (let i = 0; i < count; i++) {
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;
        
        const lat = 90 - (phi * 180 / Math.PI);
        const lon = (((theta * 180 / Math.PI) + 180) % 360) - 180;

        if (isLand(lat, lon)) {
            // THREE.js coordinate system (Y is UP)
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
        size: 0.9,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    globeRoot.add(new THREE.Points(pointsGeometry, pointsMaterial));

    // 2. Interior Core Mesh (Smooth surface like user image)
    const interiorGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 0.98, 64, 32);
    const interiorMat = new THREE.MeshBasicMaterial({ 
        color: 0x011e2b, // Dark navy glow
        transparent: true, 
        opacity: 0.2 
    });
    globeRoot.add(new THREE.Mesh(interiorGeo, interiorMat));

    // 3. Scanline/Grid Atmosphere
    const gridGeo = new THREE.SphereGeometry(GLOBE_RADIUS + 0.2, 72, 36);
    const gridMat = new THREE.MeshBasicMaterial({ 
        color: 0x00f2ff, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.05 
    });
    globeRoot.add(new THREE.Mesh(gridGeo, gridMat));

    // 4. Attack Arcs
    const arcGroup = new THREE.Group();
    globeRoot.add(arcGroup);

    const getCoord = (lt: number, ln: number) => {
        const p = (90 - lt) * (Math.PI / 180);
        const t = (ln + 180) * (Math.PI / 180);
        return new THREE.Vector3(
            - (GLOBE_RADIUS * Math.sin(p) * Math.cos(t)),
            (GLOBE_RADIUS * Math.cos(p)),
            (GLOBE_RADIUS * Math.sin(p) * Math.sin(t))
        );
    };

    const createArc = () => {
        const sLt = (Math.random() - 0.5) * 120;
        const sLn = (Math.random() - 0.5) * 360;
        const eLt = (Math.random() - 0.5) * 120;
        const eLn = (Math.random() - 0.5) * 360;
        const s = getCoord(sLt, sLn);
        const e = getCoord(eLt, eLn);
        const m = new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5);
        const d = s.distanceTo(e);
        m.normalize().multiplyScalar(GLOBE_RADIUS + d * 0.5);

        const curve = new THREE.QuadraticBezierCurve3(s, m, e);
        const pts = curve.getPoints(64);
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const mat = new THREE.LineBasicMaterial({ color: 0x00f2ff, transparent: true, opacity: 0 });
        const line = new THREE.Line(geo, mat);
        arcGroup.add(line);

        gsap.to(mat, {
            opacity: 0.7,
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
    const arcInterval = setInterval(createArc, 1800);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    const mainLight = new THREE.PointLight(0x00f2ff, 1.5);
    mainLight.position.set(200, 200, 200);
    scene.add(mainLight);

    // --- Animation ---
    let frameId: number;
    const render = () => {
        frameId = requestAnimationFrame(render);
        globeRoot.rotation.y += 0.0018;
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
    <div ref={containerRef} className="w-full h-full relative flex items-center justify-center pointer-events-none overflow-hidden" />
  );
}
