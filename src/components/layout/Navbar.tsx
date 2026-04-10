"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NeonButton } from "../ui/NeonButton";
import { MobileMenu } from "./MobileMenu";
import { Menu, X, Shield, MoreVertical } from "lucide-react";

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
      {/* ── Standard Navbar ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled
            ? "bg-black/85 border-primary/30 py-3 backdrop-blur-xl"
            : "bg-transparent border-transparent py-5"
        }`}
      >
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* ── Left: Logo ── */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex flex-col leading-none">
                <span className="font-jetbrains text-base font-black text-white tracking-[0.1em] group-hover:text-primary transition-colors duration-200">
                  SOCS
                </span>
                <span className="text-[5px] text-primary/40 tracking-[0.5em] font-mono">EST_2024</span>
              </div>
            </Link>
          </div>

          {/* ── Center: Nav Links (Desktop) ── */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-2">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-2 text-[13px] font-bold font-turret tracking-[0.25em] uppercase transition-all duration-200 group ${
                    isActive ? "text-primary" : "text-gray-500 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <>
                      <span className="absolute inset-0 bg-primary/10" style={{
                        clipPath: "polygon(0 4px,4px 0,100% 0,100% calc(100% - 4px),calc(100% - 4px) 100%,0 100%)"
                      }} />
                      <span className="absolute bottom-0 left-0 right-0 h-px bg-primary" />
                    </>
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* ── Right: CTA (Desktop) + Mobile Menu Toggle ── */}
          <div className="flex items-center justify-end shrink-0 gap-4">
            <NeonButton href="/login" variant="outline" className="hidden md:inline-flex text-[10px] px-6 py-2.5 font-bold tracking-[0.2em]">
              CONNECT
            </NeonButton>

            {/* Mobile menu toggle (3 dots as requested) */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-300 hover:text-primary transition-colors p-2 -mr-2"
              aria-label="Toggle menu"
            >
              {isOpen
                ? <X className="h-6 w-6 text-primary" />
                : <MoreVertical className="h-6 w-6" />
              }
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} links={links} pathname={pathname} />
    </>
  );
}
