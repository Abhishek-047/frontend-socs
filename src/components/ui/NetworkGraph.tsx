"use client";
import React, { useEffect, useRef, useState } from "react";
import { TeamMember, teamMembers } from "@/constants/team";
import { Search } from "lucide-react";

// Generate graph nodes and links from teamMembers
const rootNode = { id: "SOCS_ROOT", label: "SOCS MAINFRAME", group: 0, radius: 12, x: 0, y: 0, vx: 0, vy: 0 };
const nodes: any[] = [rootNode];
const links: any[] = [];

// Hierarchy maps
const coreNodes: any[] = [];
const leadNodes: any[] = [];

teamMembers.forEach((m) => {
  const node = { id: m.name, label: m.name, role: m.role, group: m.tier === "core" ? 1 : m.tier === "lead" ? 2 : 3, radius: m.tier === "core" ? 8 : m.tier === "lead" ? 6 : 4, x: Math.random() * 500, y: Math.random() * 500, vx: 0, vy: 0, member: m };
  nodes.push(node);
  if (m.tier === "core") {
    coreNodes.push(node);
    links.push({ source: rootNode, target: node });
  } else if (m.tier === "lead") {
    leadNodes.push(node);
    if (coreNodes.length > 0) {
      links.push({ source: coreNodes[Math.floor(Math.random() * coreNodes.length)], target: node });
    } else {
      links.push({ source: rootNode, target: node });
    }
  } else {
    if (leadNodes.length > 0) {
      links.push({ source: leadNodes[Math.floor(Math.random() * leadNodes.length)], target: node });
    } else {
      links.push({ source: rootNode, target: node });
    }
  }
});

// A simple verlet integration force graph
export function NetworkGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [hoverNode, setHoverNode] = useState<any | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width;
    let height = canvas.height;
    const updateSize = () => {
      if (wrapperRef.current) {
        width = wrapperRef.current.clientWidth;
        height = wrapperRef.current.clientHeight;
        canvas.width = width;
        canvas.height = height;
        // initial scatter
        nodes.forEach((n) => {
          n.x = width / 2 + (Math.random() - 0.5) * 200;
          n.y = height / 2 + (Math.random() - 0.5) * 200;
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    // Mouse interaction variables
    let mouseX = 0, mouseY = 0;
    let dragNode: any | null = null;
    let isMouseDown = false;

    const getMousePos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    canvas.addEventListener("mousemove", (e) => {
      getMousePos(e);
      let hovered = null;
      for (const node of nodes) {
        const dx = node.x - mouseX;
        const dy = node.y - mouseY;
        if (Math.sqrt(dx * dx + dy * dy) < node.radius + 10) {
          hovered = node;
          break;
        }
      }
      if (dragNode) {
        dragNode.x = mouseX;
        dragNode.y = mouseY;
        dragNode.vx = 0;
        dragNode.vy = 0;
      }
      setHoverNode(hovered);
      canvas.style.cursor = hovered ? "pointer" : "crosshair";
    });

    canvas.addEventListener("mousedown", () => {
      isMouseDown = true;
      if (hoverNode) dragNode = hoverNode;
    });
    
    canvas.addEventListener("mouseup", () => {
      isMouseDown = false;
      dragNode = null;
    });
    
    const resolveNodes = () => {
        links.forEach((link) => {
            const dx = link.target.x - link.source.x;
            const dy = link.target.y - link.source.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const diff = (dist - 100) / dist; // Ideal length 100
            const force = (diff * 0.05);
            link.source.vx += force * dx;
            link.source.vy += force * dy;
            link.target.vx -= force * dx;
            link.target.vy -= force * dy;
        });

        // Repel
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i];
                const b = nodes[j];
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const distSq = dx * dx + dy * dy || 1;
                if (distSq < 15000) {
                    const force = 100 / distSq;
                    const len = Math.sqrt(distSq);
                    a.vx -= force * (dx / len);
                    a.vy -= force * (dy / len);
                    b.vx += force * (dx / len);
                    b.vy += force * (dy / len);
                }
            }
        }
        
        // Center force
        nodes.forEach((n) => {
            const dx = width / 2 - n.x;
            const dy = height / 2 - n.y;
            n.vx += dx * 0.002;
            n.vy += dy * 0.002;
            
            // Drag overrule
            if (dragNode !== n) {
                n.vx *= 0.85; // friction
                n.vy *= 0.85;
                n.x += n.vx;
                n.y += n.vy;
            }
        });
    };

    let rafId: number;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      resolveNodes();

      // draw lines
      ctx.lineWidth = 1;
      links.forEach((l) => {
        ctx.beginPath();
        const active = (hoverNode === l.source || hoverNode === l.target);
        ctx.strokeStyle = active ? "rgba(200, 255, 0, 0.6)" : "rgba(255, 255, 255, 0.1)";
        ctx.moveTo(l.source.x, l.source.y);
        ctx.lineTo(l.target.x, l.target.y);
        ctx.stroke();
      });

      // draw nodes
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        
        const isHovered = hoverNode === n;
        
        if (n.group === 0) { // Root
            ctx.fillStyle = isHovered ? "#fff" : "#ff0040";
        } else if (n.group === 1) { // Core
            ctx.fillStyle = isHovered ? "#fff" : "#ff2d55";
        } else if (n.group === 2) { // Lead
            ctx.fillStyle = isHovered ? "#fff" : "#ff6b00";
        } else { // Member
            ctx.fillStyle = isHovered ? "#fff" : "rgba(200, 255, 0, 0.8)";
        }
        
        ctx.shadowBlur = isHovered ? 20 : 10;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
        
        // Small label below node
        if (n.group === 0 || isHovered) {
          ctx.fillStyle = "rgba(200, 255, 0, 0.8)";
          ctx.font = "10px monospace";
          ctx.textAlign = "center";
          ctx.fillText(n.label, n.x, n.y + n.radius + 12);
        }
      });
      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateSize);
    };
  }, [hoverNode]);

  return (
    <div ref={wrapperRef} className="w-full h-full relative cursor-crosshair">
      <canvas ref={canvasRef} className="w-full h-full block mix-blend-screen" />
      {/* Node specific info panel */}
      {hoverNode && hoverNode.group !== 0 && (
         <div className="absolute top-4 right-4 bg-black/80 border border-primary/30 p-4 w-64 backdrop-blur-sm pointer-events-none z-10 transition-all duration-200 shadow-[0_0_20px_rgba(200,255,0,0.1)]">
             <div className="text-[9px] text-primary/50 font-mono tracking-widest uppercase mb-1">NODE_INSPECT</div>
             <h3 className="text-white font-bold font-grotesk text-lg tracking-tight uppercase">{hoverNode.label}</h3>
             <p className="text-[10px] text-primary/80 font-jetbrains tracking-widest uppercase mb-3">{hoverNode.role}</p>
             <div className="flex flex-wrap gap-1 mt-2 border-t border-primary/20 pt-2">
                 {hoverNode.member.skills.map((s: string) => (
                     <span key={s} className="px-1.5 py-0.5 bg-primary/10 border border-primary/20 text-primary text-[8px] font-mono">{s}</span>
                 ))}
             </div>
         </div>
      )}
    </div>
  );
}
