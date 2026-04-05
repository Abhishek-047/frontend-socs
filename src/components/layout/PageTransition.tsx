"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

interface NetNode {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  dist: number;
  alpha: number;
  phase: number;
}

interface Edge {
  a: number;
  b: number;
  len: number;
}

interface EdgeDir {
  fromNode: number;
  toNode: number;
  fromKillAt: number;
  travelMs: number;
}

// ── Color helpers ─────────────────────────────────────────────────────────────

/**
 * Read the current primary color from the CSS variable, returning it as
 * an {r, g, b} object.  Falls back to the original lime-green.
 */
function readPrimaryRGB(): { r: number; g: number; b: number } {
  if (typeof window === "undefined") return { r: 200, g: 255, b: 0 };
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-primary")
    .trim();
  return parseCSSColor(raw) ?? { r: 200, g: 255, b: 0 };
}

/** Parse any CSS color string → {r,g,b} | null  (browser trick via canvas). */
function parseCSSColor(color: string): { r: number; g: number; b: number } | null {
  if (!color) return null;
  try {
    const ctx = Object.assign(document.createElement("canvas"), {
      width: 1,
      height: 1,
    }).getContext("2d")!;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return { r, g, b };
  } catch {
    return null;
  }
}

// ────────────────────────────────────────────────────────────────────────────

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const clickOrigin = useRef({ x: 0, y: 0 });
  const isTransitioning = useRef(false);

  const [frozenChildren, setFrozenChildren] = useState<React.ReactNode>(null);
  const liveChildren = useRef(children);
  liveChildren.current = children;

  useEffect(() => {
    const track = (e: MouseEvent) => { clickOrigin.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", track, { passive: true });
    clickOrigin.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const handleClick = (e: MouseEvent) => {
      if (isTransitioning.current) return;
      const target = e.target as Element;
      if (!target || typeof target.closest !== "function") return;
      const anchor = target.closest("a[href]");
      if (!anchor) return;
      const href = (anchor as HTMLAnchorElement).getAttribute("href") ?? "";
      if (!href.startsWith("/") || href.startsWith("//") || href === pathname) return;
      e.preventDefault();
      e.stopPropagation();
      runTransition({ x: clickOrigin.current.x, y: clickOrigin.current.y }, href);
    };

    window.addEventListener("click", handleClick, true);
    return () => {
      window.removeEventListener("mousemove", track);
      window.removeEventListener("click", handleClick, true);
    };
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const runTransition = useCallback(
    (origin: { x: number; y: number }, targetHref: string) => {
      const canvas = canvasRef.current;
      if (!canvas || !contentRef.current || isTransitioning.current) return;
      isTransitioning.current = true;

      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) return;

      // ── Snapshot current primary color ONCE at transition start ──────────
      const { r, g, b } = readPrimaryRGB();
      // Helper: primary color string with alpha
      const pc = (a: number) => `rgba(${r},${g},${b},${a})`;
      // Slightly brighter tint for bloom/glow (clamp to 255)
      const br = Math.min(r + 55, 255);
      const bg_ = Math.min(g, 255);
      const bb = Math.min(b + 20, 255);
      const bloom = (a: number) => `rgba(${br},${bg_},${bb},${a})`;

      const dpr = window.devicePixelRatio || 1;
      const W = window.innerWidth;
      const H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.cssText = `width:${W}px;height:${H}px;display:block;z-index:999998;pointer-events:all;position:fixed;top:0;left:0;`;

      setFrozenChildren(liveChildren.current);

      const ox = origin.x, oy = origin.y;
      const maxR = Math.max(
        Math.hypot(ox, oy),
        Math.hypot(W - ox, oy),
        Math.hypot(ox, H - oy),
        Math.hypot(W - ox, H - oy)
      );

      // ── Build node grid ───────────────────────────────────────────────────
      const spacing = Math.min(W, H) / 9;
      const cols = Math.ceil(W / spacing) + 2;
      const rows = Math.ceil(H / spacing) + 2;
      const nodes: NetNode[] = [];
      for (let i = -1; i < cols; i++) {
        for (let j = -1; j < rows; j++) {
          const bx = i * spacing + (Math.random() - 0.5) * spacing * 0.75;
          const by = j * spacing + (Math.random() - 0.5) * spacing * 0.75;
          nodes.push({
            baseX: bx, baseY: by, x: bx, y: by,
            dist: Math.hypot(bx - ox, by - oy),
            alpha: 0,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }

      // ── Build edge list ───────────────────────────────────────────────────
      const CONN = spacing * 1.6;
      const edges: Edge[] = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].baseX - nodes[j].baseX;
          const dy = nodes[i].baseY - nodes[j].baseY;
          const len = Math.hypot(dx, dy);
          if (len < CONN) edges.push({ a: i, b: j, len });
        }
      }

      // ── Timing ────────────────────────────────────────────────────────────
      const EXPAND_MS  = 700;
      const HOLD_MS    = 100;
      const SHRINK_MS  = 900;
      const TOTAL_MS   = EXPAND_MS + HOLD_MS + SHRINK_MS;
      const FEATHER    = 160;
      const PARTICLE_EDGE_MS = 200;

      const eio = (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const eioInv = (y: number) => {
        if (y <= 0) return 0;
        if (y >= 1) return 1;
        return y < 0.5 ? Math.sqrt(y / 2) : 1 - Math.sqrt((1 - y) / 2);
      };

      const nodeKillAt = nodes.map(n => SHRINK_MS * eioInv(Math.min(n.dist / maxR, 1)));
      const edgeDirs: EdgeDir[] = edges.map(e => {
        const killA = nodeKillAt[e.a];
        const killB = nodeKillAt[e.b];
        const fromNode = killA <= killB ? e.a : e.b;
        const toNode   = fromNode === e.a ? e.b : e.a;
        return { fromNode, toNode, fromKillAt: Math.min(killA, killB), travelMs: PARTICLE_EDGE_MS };
      });

      let hasNavigated = false;
      let shrinkStarted = false;
      let prevNow = performance.now();
      const startTime = prevNow;
      let raf: number;

      const draw = (now: number) => {
        prevNow = now;
        const elapsed = now - startTime;
        const totalP = Math.min(elapsed / TOTAL_MS, 1);
        const phaseTime = elapsed * 0.001;

        // Float nodes
        nodes.forEach(n => {
          n.x = n.baseX + Math.cos(phaseTime + n.phase) * 8;
          n.y = n.baseY + Math.sin(phaseTime * 1.2 + n.phase) * 8;
        });

        let shrinkElapsed = -1;

        if (elapsed <= EXPAND_MS) {
          const ease = 1 - Math.pow(1 - elapsed / EXPAND_MS, 3);
          const waveR = maxR * ease;
          nodes.forEach(n => {
            n.alpha = n.dist <= waveR ? Math.min((waveR - n.dist) / FEATHER, 1) : 0;
          });
        } else if (elapsed <= EXPAND_MS + HOLD_MS) {
          nodes.forEach(n => { n.alpha = 1; });
          if (!hasNavigated) {
            hasNavigated = true;
            setFrozenChildren(null);
            if (contentRef.current) contentRef.current.style.opacity = "1";
            router.push(targetHref);
          }
        } else {
          shrinkElapsed = elapsed - EXPAND_MS - HOLD_MS;
          const shrinkP = eio(shrinkElapsed / SHRINK_MS);
          const killR = maxR * shrinkP;
          nodes.forEach(n => {
            n.alpha = n.dist < killR
              ? Math.max(0, 1 - (killR - n.dist) / FEATHER)
              : 1;
          });
          if (!shrinkStarted) shrinkStarted = true;
        }

        // ── DRAW ──────────────────────────────────────────────────────────
        ctx.clearRect(0, 0, W, H);

        // Background
        if (elapsed <= EXPAND_MS) {
          const ease = 1 - Math.pow(1 - elapsed / EXPAND_MS, 3);
          const waveR = maxR * ease;
          const outerR = Math.max(1, waveR + 220);
          const innerR = Math.max(0, waveR - 80);
          const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, outerR);
          g.addColorStop(0, "rgba(5,5,8,1)");
          g.addColorStop(Math.min(innerR / outerR, 0.99), "rgba(5,5,8,1)");
          g.addColorStop(1, "rgba(5,5,8,0)");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, W, H);
        } else if (elapsed <= EXPAND_MS + HOLD_MS) {
          ctx.fillStyle = "rgba(5,5,8,1)";
          ctx.fillRect(0, 0, W, H);
        } else {
          const shrinkP = eio(shrinkElapsed / SHRINK_MS);
          const killR = maxR * shrinkP;
          const innerEdge = Math.max(0, killR - FEATHER);
          const outerEdge = killR + FEATHER * 0.5;
          const g = ctx.createRadialGradient(ox, oy, innerEdge, ox, oy, outerEdge);
          g.addColorStop(0, "rgba(5,5,8,0)");
          g.addColorStop(0.5, "rgba(5,5,8,0.98)");
          g.addColorStop(1, "rgba(5,5,8,0.98)");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, W, H);
        }

        // ── Draw connections ─────────────────────────────────────────────
        ctx.lineWidth = 0.7;
        edges.forEach(e => {
          const na = nodes[e.a], nb = nodes[e.b];
          const la = Math.min(na.alpha, nb.alpha) * (1 - e.len / CONN) * 0.65;
          if (la < 0.01) return;
          ctx.strokeStyle = pc(la);
          ctx.beginPath();
          ctx.moveTo(na.x, na.y);
          ctx.lineTo(nb.x, nb.y);
          ctx.stroke();
        });

        // ── Particles ────────────────────────────────────────────────────
        if (shrinkElapsed >= 0) {
          edges.forEach((e, i) => {
            const { fromNode, toNode, fromKillAt, travelMs } = edgeDirs[i];
            const fn = nodes[fromNode];
            const tn = nodes[toNode];
            const edgeAlpha = Math.min(fn.alpha, tn.alpha);
            if (edgeAlpha < 0.01) return;
            const progress = (shrinkElapsed - fromKillAt) / travelMs;
            if (progress <= 0 || progress >= 1) return;

            const px = fn.x + (tn.x - fn.x) * progress;
            const py = fn.y + (tn.y - fn.y) * progress;
            const tailP = Math.max(0, progress - 0.3);
            const tx = fn.x + (tn.x - fn.x) * tailP;
            const ty = fn.y + (tn.y - fn.y) * tailP;
            const fade = Math.min(progress / 0.08, 1) * Math.min((1 - progress) / 0.08, 1);
            const a = fade * edgeAlpha;

            // Tail
            const tailGrad = ctx.createLinearGradient(tx, ty, px, py);
            tailGrad.addColorStop(0, pc(0));
            tailGrad.addColorStop(0.6, pc(a * 0.6));
            tailGrad.addColorStop(1, pc(a * 0.95));
            ctx.strokeStyle = tailGrad;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(px, py);
            ctx.stroke();

            // Bloom halo
            const bloomGrad = ctx.createRadialGradient(px, py, 0, px, py, 10);
            bloomGrad.addColorStop(0, bloom(a * 0.45));
            bloomGrad.addColorStop(1, bloom(0));
            ctx.fillStyle = bloomGrad;
            ctx.beginPath();
            ctx.arc(px, py, 10, 0, Math.PI * 2);
            ctx.fill();

            // Inner core
            const core = ctx.createRadialGradient(px, py, 0, px, py, 4);
            core.addColorStop(0, `rgba(255,255,255,${a})`);
            core.addColorStop(0.5, pc(a * 0.9));
            core.addColorStop(1, pc(0));
            ctx.fillStyle = core;
            ctx.beginPath();
            ctx.arc(px, py, 4, 0, Math.PI * 2);
            ctx.fill();

            // Pixel center
            ctx.fillStyle = `rgba(255,255,255,${a})`;
            ctx.beginPath();
            ctx.arc(px, py, 1.5, 0, Math.PI * 2);
            ctx.fill();
          });
        }

        // ── Draw nodes ───────────────────────────────────────────────────
        nodes.forEach(n => {
          if (n.alpha < 0.01) return;
          const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 10);
          glow.addColorStop(0, pc(n.alpha * 0.2));
          glow.addColorStop(1, pc(0));
          ctx.fillStyle = glow;
          ctx.beginPath(); ctx.arc(n.x, n.y, 10, 0, Math.PI * 2); ctx.fill();

          ctx.fillStyle = pc(n.alpha);
          ctx.beginPath(); ctx.arc(n.x, n.y, 2.5, 0, Math.PI * 2); ctx.fill();
        });

        if (totalP < 1) {
          raf = requestAnimationFrame(draw);
        } else {
          canvas.style.display = "none";
          canvas.style.pointerEvents = "none";
          if (contentRef.current) contentRef.current.style.opacity = "1";
          isTransitioning.current = false;
        }
      };

      raf = requestAnimationFrame(draw);
      return () => cancelAnimationFrame(raf);
    },
    [router] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // First-load fade
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      const el = contentRef.current;
      if (el) {
        el.style.opacity = "0";
        requestAnimationFrame(() => {
          el.style.transition = "opacity 0.7s ease";
          el.style.opacity = "1";
          setTimeout(() => { if (el) el.style.transition = ""; }, 800);
        });
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ display: "none" }}
      />
      {frozenChildren && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 999997 }}>
          {frozenChildren}
        </div>
      )}
      <div ref={contentRef}>{children}</div>
    </>
  );
}
