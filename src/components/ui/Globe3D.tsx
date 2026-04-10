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

    // 1. Continental Mask (High Fidelity)
    const isLand = (lat: number, lon: number) => {
      // Precise latitude/longitude bounds for recognizable continents
      // Americas
      if (lon > -130 && lon < -34) {
        if (lat > 12 && lat < 72 && lon < -52) return true; // N. America
        if (lat > -56 && lat < 12 && lon > -82 && lon < -34) return true; // S. America
        if (lat > 8 && lat < 25 && lon > -85 && lon < -75) return true; // Central
      }
      // Africa
      if (lon > -17 && lon < 51 && lat > -35 && lat < 37) {
        if (lat > 15 && lon > 40) return false; // Red Sea
        return true;
      }
      // Eurasia
      if (lon > -10 && lon < 180 && lat > 10 && lat < 78) {
        if (lat < 32 && lon > 32 && lon < 58) return false; // Arabia/Med gap
        if (lat > 40 && lat < 50 && lon > 100 && lon < 110) return true; // China/E.Asia
        if (lat < 25 && lon > 70 && lon < 95) return true; // India
        return true;
      }
      // Australia
      if (lon > 113 && lon < 154 && lat > -44 && lat < -11) return true;
      
      return false;
    };

    const count = 35000;
    const positions: number[] = [];
    const colors: number[] = [];

    for (let i = 0; i < count; i++) {
        // Spherical Fibonacci distribution
        const phi = Math.acos(-1 + (2 * i) / count); // 0 to PI
        const theta = Math.sqrt(count * Math.PI) * phi; // Angle around Y

        // Map phi/theta to Lat/Lon
        const lat = 90 - (phi * 180 / Math.PI);
        const lon = (((theta * 180 / Math.PI) + 180) % 360) - 180;

        if (isLand(lat, lon)) {
            // Three.js Coordinate System: Y is UP
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
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    globeRoot.add(new THREE.Points(pointsGeometry, pointsMaterial));

    // 2. Translucent Base & Grid (Matches user image)
    const baseGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 0.98, 64, 32);
    const baseMat = new THREE.MeshBasicMaterial({ color: 0x001a2b, transparent: true, opacity: 0.3 });
    globeRoot.add(new THREE.Mesh(baseGeo, baseMat));

    const gridGeo = new THREE.SphereGeometry(GLOBE_RADIUS + 0.1, 72, 36);
    const gridMat = new THREE.MeshBasicMaterial({ color: 0x00f2ff, wireframe: true, transparent: true, opacity: 0.05 });
    globeRoot.add(new THREE.Mesh(gridGeo, gridMat));

    // 3. Attack Arcs
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
        const pts = curve.getPoints(60);
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
    const arcInterval = setInterval(createArc, 2000);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const topLight = new THREE.PointLight(0x00f2ff, 1.5);
    topLight.position.set(200, 200, 200);
    scene.add(topLight);

    // 5. Animation Loop
    let fId: number;
    const render = () => {
        fId = requestAnimationFrame(render);
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
        cancelAnimationFrame(fId);
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
