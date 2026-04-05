"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// ── Color helpers ─────────────────────────────────────────────────────────────

/** Read the current primary color CSS variable. Returns a hex-like string. */
function readPrimaryColor(): string {
  if (typeof window === "undefined") return "#C8FF00";
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue("--color-primary")
      .trim() || "#C8FF00"
  );
}

interface RGB { r: number; g: number; b: number }

/** Parse any CSS color string → {r,g,b} using a 1×1 canvas. Cached. */
function parseColor(cssColor: string): RGB {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = cssColor;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return { r, g, b };
  } catch {
    return { r: 200, g: 255, b: 0 };
  }
}

/** Convert {r,g,b} to a CSS hex color string. */
function toHex({ r, g, b }: RGB): string {
  return (
    "#" +
    r.toString(16).padStart(2, "0") +
    g.toString(16).padStart(2, "0") +
    b.toString(16).padStart(2, "0")
  );
}

/**
 * Returns the hover color for the cursor.
 * Default hover = #FF0040 (red).
 * BUT if the current primary color is perceptually close to #FF0040 (within
 * Euclidean distance 80 in RGB space), we use the hex-invert of primary
 * instead so they're never the same.
 */
function getHoverColor(primary: string): string {
  const { r, g, b } = parseColor(primary);
  const hR = 255, hG = 0, hB = 64; // #FF0040
  const dist = Math.sqrt((r - hR) ** 2 + (g - hG) ** 2 + (b - hB) ** 2);
  if (dist < 80) {
    // Primary is too similar to default hover — use hex-invert
    return toHex({ r: 255 - r, g: 255 - g, b: 255 - b });
  }
  return "#FF0040";
}

// ─────────────────────────────────────────────────────────────────────────────

export function CustomCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const coreRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isHovering = useRef(false);
  const pos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Hidden on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const numElements = 40;
    const elements: HTMLDivElement[] = [];

    if (containerRef.current) {
      for (let i = 0; i < numElements; i++) {
        const el = document.createElement("div");
        el.className =
          "fixed top-0 left-0 font-body leading-none pointer-events-none z-[99998]";
        el.style.opacity = "0";
        el.style.color = "var(--color-primary)";
        containerRef.current.appendChild(el);
        elements.push(el);
      }
    }

    let currentIndex = 0;
    const hexChars = "0123456789ABCDEF!@#$*%";

    const spawnChar = (x: number, y: number, color: string) => {
      if (x < 0 || y < 0) return;
      const el = elements[currentIndex];
      el.innerText = hexChars[Math.floor(Math.random() * hexChars.length)];
      el.style.fontWeight = "bold";
      el.style.fontSize = "16px";
      el.style.color = color;

      gsap.killTweensOf(el);
      gsap.set(el, { x: x - 6, y: y + 10, opacity: 0.9, scale: 1 });
      gsap.to(el, {
        y: y + 100 + Math.random() * 80,
        opacity: 0,
        scale: 0.5,
        duration: 0.5 + Math.random() * 0.4,
        ease: "power2.in",
      });

      currentIndex = (currentIndex + 1) % numElements;
    };

    // ── Apply primary color to cursor fragments (called whenever needed) ──
    const applyPrimaryToCores = () => {
      const primary = readPrimaryColor();
      coreRefs.current.forEach((el) => {
        if (!el || isHovering.current) return;
        el.style.backgroundColor = primary;
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;

      const target = e.target as HTMLElement;
      const interactiveEl = target.closest(
        'a, button, [role="button"], input, select, textarea'
      );

      if (interactiveEl) {
        const rect = interactiveEl.getBoundingClientRect();
        (interactiveEl as HTMLElement).style.setProperty(
          "--mouse-x",
          `${e.clientX - rect.left}px`
        );
        (interactiveEl as HTMLElement).style.setProperty(
          "--mouse-y",
          `${e.clientY - rect.top}px`
        );
      }

      // Move all cursor fragments
      coreRefs.current.forEach((el, index) => {
        if (!el) return;
        const baseOffsetX = index === 0 ? -6 : -4;
        const baseOffsetY = index === 0 ? -6 : -4;
        const jitterX = index !== 0 ? (Math.random() - 0.5) * 25 : 0;
        const jitterY = index !== 0 ? (Math.random() - 0.5) * 25 : 0;
        gsap.to(el, {
          x: e.clientX + baseOffsetX + jitterX,
          y: e.clientY + baseOffsetY + jitterY,
          duration: 0.05 + index * 0.02,
          ease: "power4.out",
        });
      });

      // Trail color: primary when idle, hover-contrast when over interactive
      const primary = readPrimaryColor();
      const charColor = isHovering.current
        ? getHoverColor(primary)
        : primary;
      spawnChar(pos.current.x, pos.current.y, charColor);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest(
        'a, button, [role="button"], input, select, textarea'
      );
      if (!interactiveEl) return;
      if (interactiveEl.closest("[data-terminal]")) return;

      const isButton =
        interactiveEl.tagName === "BUTTON" ||
        interactiveEl.tagName === "INPUT" ||
        interactiveEl.classList.contains("border");

      isHovering.current = true;
      (interactiveEl as HTMLElement).dataset.hoverType = isButton
        ? "button"
        : "link";
      interactiveEl.classList.add("cursor-corrupted");

      if (containerRef.current) containerRef.current.style.mixBlendMode = "normal";
      const fragmentsWrapper = coreRefs.current[0]?.parentElement;
      if (fragmentsWrapper) fragmentsWrapper.style.mixBlendMode = "normal";

      // Hover color: contrasts the primary
      const primary = readPrimaryColor();
      const hoverColor = getHoverColor(primary);

      coreRefs.current.forEach((el) => {
        if (!el) return;
        el.style.backgroundColor = hoverColor;
        gsap.to(el, {
          backgroundColor: hoverColor,
          opacity: 1,
          scale: isButton ? 0.6 : 1.2,
          duration: 0.15,
        });
      });
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest(
        'a, button, [role="button"], input, select, textarea'
      );
      if (!interactiveEl) return;

      const related = e.relatedTarget as Node | null;
      if (related && interactiveEl.contains(related)) return;

      isHovering.current = false;
      interactiveEl.classList.remove("cursor-corrupted");
      interactiveEl.classList.add("cursor-corrupted-removing");
      setTimeout(() => {
        interactiveEl.classList.remove("cursor-corrupted-removing");
      }, 500);

      if (containerRef.current) containerRef.current.style.mixBlendMode = "";
      const fragmentsWrapper = coreRefs.current[0]?.parentElement;
      if (fragmentsWrapper) fragmentsWrapper.style.mixBlendMode = "";

      // Revert to current primary
      const primary = readPrimaryColor();
      const targetOpacities = [0.9, 0.8, 0.7, 0.8, 0.6];
      coreRefs.current.forEach((el, index) => {
        if (!el) return;
        el.style.backgroundColor = primary;
        gsap.to(el, {
          backgroundColor: primary,
          opacity: targetOpacities[index] || 0.8,
          scale: 1.5 + Math.random(),
          duration: 0.2,
        });
      });
    };

    // 50ms interval: spawn trail + sync fragment color to live primary
    const dropInterval = setInterval(() => {
      const primary = readPrimaryColor();

      if (pos.current.x > 0) {
        const charColor = isHovering.current ? getHoverColor(primary) : primary;
        spawnChar(pos.current.x, pos.current.y, charColor);

        // Jitter satellite fragments
        if (Math.random() > 0.4) {
          coreRefs.current.forEach((el, index) => {
            if (!el || index === 0) return;
            const intensity = isHovering.current ? 40 : 20;
            gsap.to(el, {
              x: pos.current.x - 4 + (Math.random() - 0.5) * intensity,
              y: pos.current.y - 4 + (Math.random() - 0.5) * intensity,
              duration: 0.05,
              yoyo: true,
              repeat: 1,
            });
          });
        }
      }

      // Sync cursor fragment color to current primary (when not hovering)
      if (!isHovering.current) {
        applyPrimaryToCores();
      }
    }, 50);

    // Initial fragment color set to primary
    const initialPrimary = readPrimaryColor();
    coreRefs.current.forEach((el) => {
      if (!el) return;
      gsap.set(el, { backgroundColor: initialPrimary });
      gsap.to(el, { scale: 1.5 + Math.random() });
    });

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      clearInterval(dropInterval);
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className="fixed inset-0 pointer-events-none z-[99998]"
      />

      <div className="fixed top-0 left-0 z-[99999] pointer-events-none mix-blend-difference">
        <div ref={(el) => { coreRefs.current[0] = el; }} className="absolute top-0 left-0 w-3 h-4 opacity-90 scale-150" />
        <div ref={(el) => { coreRefs.current[1] = el; }} className="absolute top-0 left-0 w-4 h-1 opacity-80 scale-150" />
        <div ref={(el) => { coreRefs.current[2] = el; }} className="absolute top-0 left-0 w-1 h-4 opacity-70 scale-150" />
        <div ref={(el) => { coreRefs.current[3] = el; }} className="absolute top-0 left-0 w-2.5 h-2.5 opacity-80 scale-150" />
        <div ref={(el) => { coreRefs.current[4] = el; }} className="absolute top-0 left-0 w-2 h-2 opacity-60 scale-150" />
      </div>
    </>
  );
}
