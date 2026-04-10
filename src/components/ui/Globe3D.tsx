"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import * as topojson from "topojson-client";
import worldData from "world-atlas/countries-110m.json";
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

    const GLOBE_RADIUS = 60;
    const colorPrimary = new THREE.Color(0xc8ff00);

    // 1. Core Sphere (Dark)
    const sphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS - 1, 64, 64);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x020304,
      transparent: true,
      opacity: 0.9,
      shininess: 40,
    });
    globeRoot.add(new THREE.Mesh(sphereGeometry, sphereMaterial));

    // 2. High-Fidelity Continents from world-atlas
    // @ts-ignore
    const land = topojson.feature(worldData, worldData.objects.land);
    const pointsGeometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];

    function processCoord(lon: number, lat: number) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);

        const x = - (GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta));
        const z = (GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta));
        const y = (GLOBE_RADIUS * Math.cos(phi));

        positions.push(x, y, z);
        colors.push(colorPrimary.r, colorPrimary.g, colorPrimary.b);
    }

    // @ts-ignore
    if (land.geometry.type === "MultiPolygon") {
        // @ts-ignore
        land.geometry.coordinates.forEach((polygon: any) => {
            polygon.forEach((ring: any) => {
                ring.forEach((coord: [number, number]) => {
                    processCoord(coord[0], coord[1]);
                });
            });
        });
    } else {
        // @ts-ignore
        land.geometry.coordinates.forEach((ring: any) => {
            ring.forEach((coord: [number, number]) => {
                processCoord(coord[0], coord[1]);
            });
        });
    }

    pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    pointsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const pointsMaterial = new THREE.PointsMaterial({
        size: 0.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
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
        const startLat = (Math.random() - 0.5) * 160;
        const startLon = (Math.random() - 0.5) * 360;
        const endLat = (Math.random() - 0.5) * 160;
        const endLon = (Math.random() - 0.5) * 360;

        const start = getCoord(startLat, startLon);
        const end = getCoord(endLat, endLon);

        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        const distance = start.distanceTo(end);
        mid.normalize().multiplyScalar(GLOBE_RADIUS + distance * 0.4);

        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        const material = new THREE.LineBasicMaterial({
            color: colorPrimary,
            transparent: true,
            opacity: 0,
        });

        const line = new THREE.Line(geometry, material);
        arcGroup.add(line);

        gsap.to(material, {
            opacity: 0.6,
            duration: 1,
            repeat: 1,
            yoyo: true,
            onComplete: () => {
                arcGroup.remove(line);
                geometry.dispose();
                material.dispose();
            }
        });
    };

    const arcInterval = setInterval(createArc, 1200);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const topLight = new THREE.PointLight(0xc8ff00, 2);
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
        {/* Glow Overlay */}
        <div className="absolute inset-0 bg-radial-gradient from-primary/5 to-transparent pointer-events-none -z-10" />
        
        {/* HUD Elements */}
        <div className="absolute top-8 right-8 z-30 font-mono text-[7px] text-primary/40 tracking-[0.3em] uppercase hidden xl:block text-right">
            <div className="animate-pulse">LATENCY: 24MS</div>
            <div className="mt-1">THREAT_LEVEL: NOMINAL</div>
        </div>
    </div>
  );
}
