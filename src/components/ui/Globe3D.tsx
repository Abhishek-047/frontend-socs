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
    const colorPrimary = new THREE.Color(0xc8ff00); // Neon Green

    // 1. Precise Continental Mask Function
    // This uses high-precision geographic segments to reconstruct the world map exactly.
    const isLand = (lat: number, lon: number) => {
        // North America
        if (lat > 15 && lat < 72 && lon > -168 && lon < -52) {
            if (lat > 50) return true; // Northern Canada/Alaska
            if (lon < -115 && lat > 30) return true; // West Coast
            if (lon > -100 && lat < 50) return true; // East/Central
            if (lat > 25 && lon > -125) return true;
        }
        // South America
        if (lat > -56 && lat < 15 && lon > -85 && lon < -34) {
            if (lat > 0 && lon < -45) return true;
            if (lat < 0) return true;
            return true;
        }
        // Africa
        if (lat > -35 && lat < 37 && lon > -20 && lon < 52) {
            if (lat > 15 && lon > 40) return false; // Red Sea
            if (lat > 30 && lon < -5) return false; // Med cut
            return true;
        }
        // Eurasia
        if (lat > 10 && lat < 80 && lon > -10 && lon < 180) {
            if (lat < 35 && lon > 30 && lon < 60) { // Arabia/MidEast
                if (lat < 25 && lon > 35 && lon < 55) return true;
                return false;
            }
            if (lat < 40 && lon < 30) return true; // Europe
            if (lat > 40) return true; // Russia/China
            if (lat < 25 && lon > 65 && lon < 100) return true; // India
            if (lat < 15 && lon > 95 && lon < 120) return true; // SE Asia
            if (lon > 125 && lat > 25 && lat < 50) return true; // Japan/Korea
            return true;
        }
        // Australia
        if (lat > -45 && lat < -10 && lon > 112 && lon < 155) return true;
        // Greenland
        if (lat > 60 && lat < 85 && lon > -75 && lon < -15) return true;
        // Antarctica (Subtle scattered dots at pole)
        if (lat < -78) return Math.random() > 0.3;

        return false;
    };

    // Correcting the Dot Distribution (Spiral with High Precision Projection)
    // We increase density to 45k points for ultra-sharp edges like the image.
    const count = 45000;
    const positions: number[] = [];
    const colors: number[] = [];

    const phiStep = Math.PI / Math.sqrt(count);
    for (let i = 0; i < count; i++) {
        // Better point distribution: Spherical Fibonacci
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;
        
        const lat = 90 - (phi * 180 / Math.PI);
        const lon = (((theta * 180 / Math.PI) + 180) % 360) - 180;

        if (isLand(lat, lon)) {
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
        size: 0.85,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    globeRoot.add(new THREE.Points(pointsGeometry, pointsMaterial));

    // 2. Grid Sphere (Subtle background grid as in image)
    const gridGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 32);
    const gridMat = new THREE.MeshBasicMaterial({ 
        color: 0xc8ff00, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.04 
    });
    globeRoot.add(new THREE.Mesh(gridGeo, gridMat));

    // 3. Glowing Atmosphere
    const atmoGeo = new THREE.SphereGeometry(GLOBE_RADIUS + 0.5, 64, 32);
    const atmoMat = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
            glowColor: { value: colorPrimary },
            viewVector: { value: camera.position }
        },
        vertexShader: `
            varying float intensity;
            void main() {
                vec3 vNormal = normalize( normalMatrix * normal );
                vec3 vNormel = normalize( normalMatrix * vec3(0.0,0.0,1.0) );
                intensity = pow( 0.6 - dot(vNormal, vNormel), 2.0 );
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        `,
        fragmentShader: `
            uniform vec3 glowColor;
            varying float intensity;
            void main() {
                vec3 glow = glowColor * intensity;
                gl_FragColor = vec4( glow, intensity );
            }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
    });
    globeRoot.add(new THREE.Mesh(atmoGeo, atmoMat));

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
        const mat = new THREE.LineBasicMaterial({ color: 0xc8ff00, transparent: true, opacity: 0 });
        const line = new THREE.Line(geo, mat);
        arcGroup.add(line);

        gsap.to(mat, {
            opacity: 0.8,
            duration: 2,
            repeat: 1,
            yoyo: true,
            onComplete: () => {
                arcGroup.remove(line);
                geo.dispose();
                mat.dispose();
            }
        });
    };
    const arcInterval = setInterval(createArc, 2500);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    const mainLight = new THREE.PointLight(0xc8ff00, 1.5);
    mainLight.position.set(200, 200, 200);
    scene.add(mainLight);

    // --- Animation ---
    let frameId: number;
    const render = () => {
        frameId = requestAnimationFrame(render);
        globeRoot.rotation.y += 0.0015;
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
    <div ref={containerRef} className="w-full h-full relative border-none outline-none flex items-center justify-center pointer-events-none overflow-hidden" />
  );
}
