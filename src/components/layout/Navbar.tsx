"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NeonButton } from "../ui/NeonButton";
import { MobileMenu } from "./MobileMenu";
import { Menu, X, Shield } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastPosRef = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    setIsVisible(true);
    const syncScrollPos = () => {
      lastPosRef.current = window.scrollY;
      setIsVisible(true);
    };
    const reSyncTimer = setTimeout(syncScrollPos, 100);

    const updateNavbar = () => {
      const currentPos = window.scrollY;
      setScrolled(currentPos > 20);
      if (currentPos < 50) {
        setIsVisible(true);
        lastPosRef.current = currentPos;
      } else {
        const diff = currentPos - lastPosRef.current;
        if (Math.abs(diff) > 15) {
          setIsVisible(diff <= 0);
          lastPosRef.current = currentPos;
        }
      }
      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateNavbar);
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(reSyncTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  const links = [
    { name: "Home",      href: "/",          code: "01" },
    { name: "Team",      href: "/team",       code: "02" },
    { name: "Projects",  href: "/projects",   code: "03" },
    { name: "Events",    href: "/events",     code: "04" },
    { name: "Resources", href: "/resources",  code: "05" },
  ];

  return (
    <>
      {/* ── Floating Pill Navbar ── */}
      <nav
        className={`fixed z-50 transition-all duration-500 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
        style={{
          top: "12px",
          left: "50%",
          transform: `translateX(-50%) ${isVisible ? "translateY(0)" : "translateY(-110%)"}`,
          width: "calc(100% - 80px)",
          maxWidth: "1400px",
        }}
      >
        <div
          className={`relative flex items-center justify-between px-8 h-[62px] transition-all duration-300 ${
            scrolled
              ? "bg-black/85 border-primary/30 shadow-[0_0_40px_rgba(200,255,0,0.08)]"
              : "bg-black/60 border-primary/15"
          }`}
          style={{
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid",
            clipPath: "polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)",
          }}
        >
          {/* Scan line on top edge */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-60" />

          {/* ── Left: Logo ── */}
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              {/* Icon */}
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 border border-primary/40 rotate-45 group-hover:border-primary transition-colors duration-300"
                  style={{ clipPath: "polygon(0 4px,4px 0,100% 0,100% calc(100% - 4px),calc(100% - 4px) 100%,0 100%)" }} />
                <Shield className="w-4 h-4 text-primary relative z-10" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-jetbrains text-base font-extrabold text-white tracking-[0.2em] group-hover:text-primary transition-colors duration-200">
                  SOCS
                </span>
                <span className="text-[7px] text-primary/40 tracking-[0.4em] font-mono">CYBER_SEC</span>
              </div>
              <span className="inline-block w-[2px] h-4 bg-primary animate-[blink-cursor_1s_step-end_infinite]" />
            </Link>
          </div>

          {/* ── Center: Nav Links ── */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-3.5 py-1.5 text-[11px] font-bold font-turret tracking-[0.25em] uppercase transition-all duration-200 group ${
                    isActive ? "text-primary" : "text-gray-500 hover:text-white"
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <>
                      <span className="absolute inset-0 bg-primary/10" style={{
                        clipPath: "polygon(0 4px,4px 0,100% 0,100% calc(100% - 4px),calc(100% - 4px) 100%,0 100%)"
                      }} />
                      <span className="absolute bottom-0 left-0 right-0 h-px bg-primary" />
                    </>
                  )}

                  {/* Hover bg */}
                  <span className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-200" style={{
                    clipPath: "polygon(0 4px,4px 0,100% 0,100% calc(100% - 4px),calc(100% - 4px) 100%,0 100%)"
                  }} />

                  <span className="relative z-10 flex items-center gap-1.5">
                    <span className="text-primary/30 text-[8px] font-mono hidden lg:inline">{link.code}</span>
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* ── Right: CTA + Mobile toggle ── */}
          <div className="flex items-center gap-4 shrink-0">
            <NeonButton href="/join" variant="outline" className="hidden md:inline-flex text-xs px-5 py-2">
              Join Network
            </NeonButton>

            {/* Mobile burger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-300 hover:text-primary transition-colors p-1"
            >
              {isOpen
                ? <X className="h-6 w-6 text-primary" />
                : <Menu className="h-6 w-6" />
              }
            </button>
          </div>

          {/* Bottom corner decoration */}
          <div className="absolute bottom-0 right-12 w-16 h-px bg-gradient-to-r from-transparent to-primary/30" />
        </div>
      </nav>

      <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} links={links} pathname={pathname} />
    </>
  );
}
