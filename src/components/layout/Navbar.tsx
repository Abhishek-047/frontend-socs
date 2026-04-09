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
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Home",      href: "/",          code: "01" },
    { name: "Team",      href: "/team",       code: "02" },
    { name: "Projects",  href: "/projects",   code: "03" },
    { name: "Events",    href: "/events",     code: "04" },
    { name: "Resources", href: "/resources",  code: "05" },
    { name: "Gallery",   href: "/gallery",    code: "06" },
  ];

  return (
    <>
      {/* ── Floating Pill Navbar ── */}
      <nav
        className="fixed top-[12px] left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[calc(100%-32px)] md:w-[calc(100%-80px)] max-w-[1400px]"
      >
        <div
          className={`relative flex items-center justify-between px-4 md:px-8 h-[62px] transition-all duration-300 ${
            scrolled
              ? "bg-black/90 border-primary/40 shadow-[0_0_40px_rgba(200,255,0,0.1)]"
              : "bg-black/60 border-primary/15"
          }`}
          style={{
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid",
            clipPath: "polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)",
          }}
        >
          {/* ── Left: Logo ── */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <Link href="/" className="flex items-center gap-2 md:gap-3 group">
              {/* Logo Image */}
              <div className="relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center overflow-hidden border border-primary/20 bg-black/40 p-1 group-hover:border-primary transition-colors duration-300"
                style={{ clipPath: "polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)" }}>
                <img src="/assets/logo.png" alt="SOCS Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-jetbrains text-sm md:text-lg font-black text-white tracking-[0.1em] group-hover:text-primary transition-colors duration-200">
                  SOCS
                </span>
                <span className="text-[5px] md:text-[6px] text-primary/40 tracking-[0.5em] font-mono">EST_2024</span>
              </div>
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
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <Link 
              href="/join"
              className="px-3 py-1.5 md:hidden text-[9px] font-bold text-primary font-mono tracking-widest border border-primary/20 hover:bg-primary/10 transition-colors uppercase whitespace-nowrap"
            >
              Join Node
            </Link>

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
        </div>
      </nav>

      <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} links={links} pathname={pathname} />
    </>
  );
}
