"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
// @ts-ignore – react-simple-maps has no @types package
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const NODES = [
  { id:"nyc", label:"N.York",    lat:40.7,  lng:-74.0  },
  { id:"lon", label:"London",    lat:51.5,  lng:-0.1   },
  { id:"mos", label:"Moscow",    lat:55.7,  lng:37.6   },
  { id:"bei", label:"Beijing",   lat:39.9,  lng:116.4  },
  { id:"tok", label:"Tokyo",     lat:35.7,  lng:139.7  },
  { id:"del", label:"Delhi",     lat:28.6,  lng:77.2   },
  { id:"sao", label:"S.Paulo",   lat:-23.5, lng:-46.6  },
  { id:"syd", label:"Sydney",    lat:-33.9, lng:151.2  },
  { id:"par", label:"Paris",     lat:48.8,  lng:2.3    },
  { id:"dub", label:"Dubai",     lat:25.2,  lng:55.3   },
  { id:"sgp", label:"Singapore", lat:1.3,   lng:103.8  },
  { id:"lag", label:"Lagos",     lat:6.5,   lng:3.4    },
  { id:"chi", label:"Chicago",   lat:41.9,  lng:-87.6  },
  { id:"sea", label:"Seattle",   lat:47.6,  lng:-122.3 },
  { id:"ber", label:"Berlin",    lat:52.5,  lng:13.4   },
  { id:"mum", label:"Mumbai",    lat:19.1,  lng:72.9   },
];

const ATTACK_TYPES = [
  { label:"DDoS",       color:"#ff2d55" },
  { label:"SQLi",       color:"#ff6b00" },
  { label:"Ransomware", color:"#c8ff00" },
  { label:"Phishing",   color:"#ff0dd4" },
  { label:"BruteForce", color:"#00f5ff" },
  { label:"Zero-Day",   color:"#a855f7" },
];

interface Feed { id:number; time:string; src:string; dst:string; type:string; color:string; }

// Geoequal-earth project approximation matching react-simple-maps defaults
// scale=153, center=[10,2], viewBox matches the SVG
function project(lat: number, lng: number, W: number, H: number) {
  // equirectangular – close enough for arc overlay on geoEqualEarth at these settings
  const x = ((lng - 10 + 180) / 360) * W;
  const y = ((90 - lat - 2) / 180) * H;
  return { x, y };
}

function qbez(t: number, x0: number, y0: number, cx: number, cy: number, x1: number, y1: number) {
  const m = 1 - t;
  return { x: m*m*x0 + 2*m*t*cx + t*t*x1, y: m*m*y0 + 2*m*t*cy + t*t*y1 };
}

let arcId = 0, feedId = 0;

interface Arc {
  id: number;
  src: typeof NODES[0]; dst: typeof NODES[0];
  atk: typeof ATTACK_TYPES[0];
  progress: number; speed: number;
  trail: {x:number;y:number}[];
  done: boolean;
}

export function ThreatMap() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const mapDivRef  = useRef<HTMLDivElement>(null);
  const arcsRef    = useRef<Arc[]>([]);
  const rafRef     = useRef<number>(0);

  const [feed,   setFeed]   = useState<Feed[]>([]);
  const [counts, setCounts] = useState({ total: 0, blocked: 0 });
  const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set());

  const spawnArc = useCallback(() => {
    let si = Math.floor(Math.random()*NODES.length), di = si;
    while (di === si) di = Math.floor(Math.random()*NODES.length);
    const atk = ATTACK_TYPES[Math.floor(Math.random()*ATTACK_TYPES.length)];
    arcsRef.current.push({
      id: arcId++, src: NODES[si], dst: NODES[di],
      atk, progress: 0, speed: 0.005 + Math.random()*0.008,
      trail: [], done: false,
    });
    const t = new Date().toTimeString().slice(0,8);
    setFeed(p => [{
      id: feedId++, time:t, src:NODES[si].label,
      dst:NODES[di].label, type:atk.label, color:atk.color,
    }, ...p].slice(0, 7));
    setCounts(p => ({ total: p.total+1, blocked: p.blocked+(Math.random()>0.45?1:0) }));
  }, []);

  // Canvas arc animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const spawnInt = setInterval(spawnArc, 600);
    for (let i = 0; i < 8; i++) setTimeout(spawnArc, i * 150);

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, W, H);

      // Draw arcs
      arcsRef.current.filter(a => !a.done).forEach(arc => {
        const p0 = project(arc.src.lat, arc.src.lng, W, H);
        const p2 = project(arc.dst.lat, arc.dst.lng, W, H);
        const cx = (p0.x + p2.x) / 2;
        const cy = (p0.y + p2.y) / 2 - Math.max(25, Math.abs(p2.x - p0.x) * 0.25);
        const cp = { x: cx, y: cy };

        arc.progress = Math.min(1, arc.progress + arc.speed);
        const cur = qbez(arc.progress, p0.x, p0.y, cp.x, cp.y, p2.x, p2.y);
        arc.trail.push(cur);
        if (arc.trail.length > 50) arc.trail.shift();

        // Glowing trail
        for (let i = 1; i < arc.trail.length; i++) {
          const alpha = (i / arc.trail.length) * 0.85;
          ctx.beginPath();
          ctx.strokeStyle = arc.atk.color + Math.floor(alpha*255).toString(16).padStart(2,"0");
          ctx.lineWidth = 1.5;
          ctx.moveTo(arc.trail[i-1].x, arc.trail[i-1].y);
          ctx.lineTo(arc.trail[i].x,   arc.trail[i].y);
          ctx.stroke();
        }

        // Head dot
        ctx.beginPath();
        ctx.arc(cur.x, cur.y, 3, 0, Math.PI*2);
        ctx.fillStyle   = arc.atk.color;
        ctx.shadowColor = arc.atk.color;
        ctx.shadowBlur  = 14;
        ctx.fill();
        ctx.shadowBlur  = 0;

        // Impact pulse
        if (arc.progress >= 0.95) {
          const t = (arc.progress - 0.95) / 0.05;
          ctx.beginPath();
          ctx.arc(p2.x, p2.y, t * 20, 0, Math.PI*2);
          ctx.strokeStyle = arc.atk.color + "88";
          ctx.lineWidth   = 2;
          ctx.stroke();
          if (t >= 0.95) arc.done = true;
        }
      });
      arcsRef.current = arcsRef.current.filter(a => !a.done).slice(-40);

      // Update active nodes
      const active = new Set<string>();
      arcsRef.current.forEach(a => { active.add(a.src.id); active.add(a.dst.id); });
      setActiveNodes(new Set(active));

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(spawnInt);
      ro.disconnect();
    };
  }, [spawnArc]);

  return (
    <div className="w-full h-full flex flex-col bg-[#030608]" style={{ fontFamily:"monospace" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-primary/20 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[9px] tracking-[0.3em] text-primary/70 uppercase">Global Threat Map</span>
        </div>
        <div className="flex gap-3 text-[8px]">
          <span className="text-red-400">{counts.total} attacks</span>
          <span className="text-primary">{counts.blocked} blocked</span>
        </div>
      </div>

      {/* Map area — SVG world map + canvas arc overlay */}
      <div ref={mapDivRef} className="relative" style={{ flex:"1 1 0%", minHeight:0, overflow:"hidden" }}>

        {/* SVG world map with dot pattern fill */}
        <ComposableMap
          suppressHydrationWarning
          projection="geoEqualEarth"
          projectionConfig={{ scale: 153, center: [10, 2] }}
          style={{ width:"100%", height:"100%", display:"block" }}
        >
          <defs>
            <pattern id="landDots" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="0.85" fill="rgba(200,255,0,0.5)" />
            </pattern>
            <filter id="glowCity">
              <feGaussianBlur stdDeviation="2.5" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="url(#landDots)"
                  stroke="rgba(200,255,0,0.06)"
                  strokeWidth={0.4}
                  style={{
                    default: { outline:"none" },
                    hover:   { outline:"none", fill:"url(#landDots)" },
                    pressed: { outline:"none" },
                  }}
                />
              ))
            }
          </Geographies>

          {/* City markers */}
          {NODES.map(node => {
            const active = activeNodes.has(node.id);
            return (
              <Marker key={node.id} coordinates={[node.lng, node.lat]} suppressHydrationWarning>
                {active && (
                  <>
                    <circle r={8}   fill="none" stroke="rgba(200,255,0,0.3)" strokeWidth={1} />
                    <circle r={4.5} fill="none" stroke="rgba(200,255,0,0.15)" strokeWidth={1} />
                  </>
                )}
                <circle
                  r={active ? 2.2 : 1.6}
                  fill={active ? "#C8FF00" : "rgba(200,255,0,0.5)"}
                  filter={active ? "url(#glowCity)" : undefined}
                  suppressHydrationWarning
                />
                <text
                  y={-7} fontSize={active ? 5.5 : 4.5}
                  fill={active ? "rgba(200,255,0,0.9)" : "rgba(200,255,0,0.3)"}
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontWeight={active ? "bold" : "normal"}
                >
                  {node.label.toUpperCase()}
                </text>
              </Marker>
            );
          })}
        </ComposableMap>

        {/* Canvas overlay for animated arcs */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ mixBlendMode: "screen" }}
        />

        {/* Corner brackets */}
        <div className="absolute top-2 left-2   w-3 h-3 border-t border-l border-primary/40 pointer-events-none" />
        <div className="absolute top-2 right-2  w-3 h-3 border-t border-r border-primary/40 pointer-events-none" />
        <div className="absolute bottom-2 left-2  w-3 h-3 border-b border-l border-primary/40 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-primary/40 pointer-events-none" />
      </div>
    </div>
  );
}
