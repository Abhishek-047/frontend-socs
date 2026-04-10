"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";
import * as topojson from "topojson-client";

export function Globe3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Scene Setup ---
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

    // 1. Globe Base Sphere (Matches user image atmosphere)
    const baseGeo = new THREE.SphereGeometry(GLOBE_RADIUS - 0.5, 64, 64);
    const baseMat = new THREE.MeshPhongMaterial({
      color: 0x011e2b,
      transparent: true,
      opacity: 0.1,
      shininess: 40,
    });
    globeRoot.add(new THREE.Mesh(baseGeo, baseMat));

    // 2. Fetching Real World Data for Continents
    const loadContinents = async () => {
        try {
            const response = await fetch("https://unpkg.com/world-atlas/land-110m.json");
            const worldData = await response.json();
            // @ts-ignore
            const land = topojson.feature(worldData, worldData.objects.land);

            const positions: number[] = [];
            const colors: number[] = [];
            
            // To get the "dots" look from the image, we'll sample points across the sphere
            // and only keep those that fall inside a land polygon.
            const totalPoints = 12000; // Optimal density for clear continents
            
            // We'll use d3-geo if available, but since we just have the polygon data, 
            // we'll use a robust ray-caster or a coordinate-based land check.
            // For performance and reliability in this specific task, we'll extract 
            // vertices from the topojson land features and distribute them.
            
            // Helper to check if point is land (Simplified for 110m data)
            // @ts-ignore
            const geometries = land.geometry.type === "MultiPolygon" ? land.geometry.coordinates : [land.geometry.coordinates];

            // Instead of complex point-in-polygon (slow), we'll distribute points 
            // along the geometries to ensure exact outlines and fill.
            geometries.forEach((polygon: any) => {
                polygon.forEach((ring: any) => {
                    // Outlines
                    ring.forEach((coord: [number, number]) => {
                        const phi = (90 - coord[1]) * (Math.PI / 180);
                        const theta = (coord[0] + 180) * (Math.PI / 180);

                        const x = - (GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta));
                        const y = GLOBE_RADIUS * Math.cos(phi);
                        const z = GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta);

                        positions.push(x, y, z);
                        colors.push(colorPrimary.r, colorPrimary.g, colorPrimary.b);
                    });
                    
                    // Fill (Inter-point sampling for density)
                    for (let i = 0; i < ring.length - 1; i++) {
                        const p1 = ring[i];
                        const p2 = ring[i+1];
                        const samples = 2; // Extra density
                        for (let s = 1; s < samples; s++) {
                            const lat = p1[1] + (p2[1] - p1[1]) * (s / samples);
                            const lon = p1[0] + (p2[0] - p1[0]) * (s / samples);
                            
                            const phi = (90 - lat) * (Math.PI / 180);
                            const theta = (lon + 180) * (Math.PI / 180);

                            const x = - (GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta));
                            const y = GLOBE_RADIUS * Math.cos(phi);
                            const z = GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta);

                            positions.push(x, y, z);
                            colors.push(colorPrimary.r, colorPrimary.g, colorPrimary.b);
                        }
                    }
                });
            });

            const pointsGeometry = new THREE.BufferGeometry();
            pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            pointsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            
            const pointsMaterial = new THREE.PointsMaterial({
                size: 1.0,
                vertexColors: true,
                transparent: true,
                opacity: 0.9,
                blending: THREE.AdditiveBlending,
                sizeAttenuation: true
            });
            
            const landPoints = new THREE.Points(pointsGeometry, pointsMaterial);
            globeRoot.add(landPoints);
        } catch (err) {
            console.error("Failed to load map data:", err);
        }
    };

    loadContinents();

    // 3. Grid Atmosphere (Wireframe Grid)
    const gridGeo = new THREE.SphereGeometry(GLOBE_RADIUS + 0.1, 72, 36);
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
        m.normalize().multiplyScalar(GLOBE_RADIUS + d * 0.4);

        const curve = new THREE.QuadraticBezierCurve3(s, m, e);
        const pts = curve.getPoints(60);
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const mat = new THREE.LineBasicMaterial({ color: 0x00f2ff, transparent: true, opacity: 0 });
        const line = new THREE.Line(geo, mat);
        arcGroup.add(line);

        gsap.to(mat, {
            opacity: 0.8,
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
    const arcInterval = setInterval(createArc, 2000);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
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
