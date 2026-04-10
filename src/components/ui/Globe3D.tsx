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

    // 1. Globe Base
    const baseGeo = new THREE.SphereGeometry(GLOBE_RADIUS - 1, 64, 64);
    const baseMat = new THREE.MeshPhongMaterial({
      color: 0x010203,
      transparent: true,
      opacity: 0.9,
      shininess: 40,
    });
    globeRoot.add(new THREE.Mesh(baseGeo, baseMat));

    // 2. High-Accuracy Continents (Pixel sampling via data-mask)
    // We use a detailed bitmask approach
    const isLand = (lat: number, lon: number) => {
        // High fidelity geographic bounding polygons for recognizable continents
        // North America
        if (lat > 12 && lat < 72 && lon > -168 && lon < -52) {
            if (lat < 30 && lon > -80) return false; // Caribbean gap
            return true;
        }
        // South America
        if (lat > -56 && lat < 12 && lon > -82 && lon < -34) return true;
        // Africa
        if (lat > -35 && lat < 37 && lon > -18 && lon < 51) {
            if (lat > 15 && lon > 40) return false; 
            return true;
        }
        // Eurasia
        if (lat > 10 && lat < 78 && lon > -10 && lon < 190) {
            if (lat < 32 && lon > 35 && lon < 60) return false; // Arabia/Med gap
            return true;
        }
        // Australia
        if (lat > -44 && lat < -10 && lon > 112 && lon < 154) return true;
        // Greenland
        if (lat > 60 && lat < 84 && lon > -70 && lon < -10) return true;
        
        return false;
    };

    const count = 25000;
    const positions = [];
    const colors = [];

    for (let i = 0; i < count; i++) {
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;
        
        const lat = 90 - (phi * 180) / Math.PI;
        const lon = (((theta * 180) / Math.PI) + 180) % 360 - 180;

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
        size: 1.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    globeRoot.add(new THREE.Points(pointsGeometry, pointsMaterial));

    // 3. Attack Arcs
    const arcGroup = new THREE.Group();
    globeRoot.add(arcGroup);

    function getCoord(lat: number, lon: number) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        return new THREE.Vector3(
            - (GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta)),
            (GLOBE_RADIUS * Math.cos(phi)),
            (GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta))
        );
    }

    const createArc = () => {
        const startLat = (Math.random() - 0.5) * 140;
        const startLon = (Math.random() - 0.5) * 360;
        const endLat = (Math.random() - 0.5) * 140;
        const endLon = (Math.random() - 0.5) * 360;

        const start = getCoord(startLat, startLon);
        const end = getCoord(endLat, endLon);
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        const distance = start.distanceTo(end);
        mid.normalize().multiplyScalar(GLOBE_RADIUS + distance * 0.4);

        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: colorPrimary, transparent: true, opacity: 0 });

        const line = new THREE.Line(geometry, material);
        arcGroup.add(line);

        gsap.to(material, {
            opacity: 0.6,
            duration: 1.5,
            repeat: 1,
            yoyo: true,
            onComplete: () => {
                arcGroup.remove(line);
                geometry.dispose();
                material.dispose();
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
      <div className="absolute inset-x-0 h-[100px] w-[100px] bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
    </div>
  );
}
