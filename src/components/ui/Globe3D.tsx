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

    // Responsive Radius
    const GLOBE_RADIUS = Math.min(65, width / 12);
    const colorPrimary = new THREE.Color(0xc8ff00);

    // 1. Core Sphere
    const sphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS - 1, 64, 64);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x020304,
      transparent: true,
      opacity: 0.9,
      shininess: 40,
    });
    globeRoot.add(new THREE.Mesh(sphereGeometry, sphereMaterial));

    // 2. Continents logic (Image-Like fidelity using precise bounding boxes)
    const isLand = (lat: number, lon: number) => {
        // Americas
        if (lon > -130 && lon < -35 && lat > -55 && lat < 72) {
            if (lat < 15 && lon < -85) return false;
            if (lat > 10 && lat < 25 && lon > -80) return true; // Florida/Caribbean
            return true;
        }
        // Eurasia + Africa
        if (lon > -20 && lon < 145 && lat > -35 && lat < 78) {
            if (lat > 15 && lat < 45 && lon > 20 && lon < 50) return Math.random() > 0.4; // Sahara/Middle East sparse
            return true;
        }
        // Australia
        if (lon > 110 && lon < 155 && lat > -45 && lat < -10) return true;
        // High North (Greenland / Russia / Canada)
        if (lat > 65) return true;
        
        return false;
    };

    const pointsCount = 20000;
    const positions = [];
    const colors = [];

    for (let i = 0; i < pointsCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / pointsCount);
        const theta = Math.sqrt(pointsCount * Math.PI) * phi;
        
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
        opacity: 0.85,
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
            opacity: 0.5,
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

    const arcInterval = setInterval(createArc, 2000);

    // 4. Ambient Starfield
    const starsPositions = [];
    for(let i=0; i<3000; i++) {
        const phi = Math.acos(-1 + Math.random()*2);
        const theta = Math.random()*Math.PI*2;
        const r = GLOBE_RADIUS + 3;
        starsPositions.push(r * Math.cos(theta) * Math.sin(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(phi));
    }
    const starsGeo = new THREE.BufferGeometry();
    starsGeo.setAttribute('position', new THREE.Float32BufferAttribute(starsPositions, 3));
    globeRoot.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({color: 0xc8ff00, size: 0.5, transparent: true, opacity: 0.1})));

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const topLight = new THREE.PointLight(0xc8ff00, 1.5);
    topLight.position.set(200, 200, 200);
    scene.add(topLight);

    // --- Animation ---
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
    <div ref={containerRef} className="w-full h-full relative flex items-center justify-center pointer-events-none">
        <div className="absolute inset-0 bg-radial-gradient from-primary/5 to-transparent pointer-events-none -z-10" />
        <div className="absolute top-8 right-8 z-30 font-mono text-[7px] text-primary/40 tracking-[0.3em] uppercase hidden xl:block text-right">
            <div className="animate-pulse">LATENCY: 12MS</div>
            <div className="mt-1">THREATS: DETECTED</div>
        </div>
    </div>
  );
}
