"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
        <div className="max-w-[1600px] mx-auto flex items-center h-full relative">
          {/* ── Left: Logo ── */}
          <div className="flex items-center shrink-0 pl-10 md:pl-20">
            <Link href="/" className="flex items-center gap-6 group">
              <div className="relative">
                <span className="font-turret text-3xl font-black text-white tracking-[0.05em] transition-all duration-300 group-hover:text-primary">
                  SOCS
                </span>
                <div className="absolute -bottom-1 left-0 w-0 h-[2.5px] bg-primary group-hover:w-full transition-all duration-300 shadow-[0_0_15px_rgba(200,255,0,0.8)]" />
              </div>
              <div className="relative flex items-center">
                <div className="w-[4px] h-8 bg-primary shadow-[0_0_20px_rgba(200,255,0,0.7)]" />
                <div className="ml-3 w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_12px_rgba(200,255,0,0.9)]" />
                <span className="ml-3 text-[10px] font-mono text-primary tracking-[0.3em] hidden lg:block uppercase font-bold">SYS_ACTIVE</span>
              </div>
            </Link>
          </div>

          {/* ── Center: Nav Links (Desktop) ── */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-2">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-10 py-3 text-[19px] font-black font-turret tracking-[0.12em] uppercase transition-all duration-300 group ${
                    isActive ? "text-primary" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="nav-glow"
                      className="absolute inset-0 z-0 bg-primary/5 border-l-2 border-r-2 border-primary/40 overflow-hidden"
                      style={{
                        backgroundImage: "radial-gradient(circle, #c8ff0022 1px, transparent 1px)",
                        backgroundSize: "8px 8px"
                      }}
                    >
                      <motion.div 
                        animate={{ y: ["-100%", "100%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-x-0 h-[2px] bg-primary/40 blur-[2px]"
                      />
                    </motion.div>
                  )}
                  <span className="relative z-10 flex items-center transition-all duration-300 group-hover:text-primary group-hover:scale-105">
                    <span className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 mr-2 text-primary font-mono text-xl">[</span>
                    {link.name}
                    <span className="opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ml-2 text-primary font-mono text-xl">]</span>
                  </span>
                </Link>
              );
            })}
          </div>

          {/* ── Right: CTA (Desktop) + Mobile Menu Toggle ── */}
          <div className="ml-auto flex items-center justify-end shrink-0 pr-10 md:pr-20">
            <NeonButton href="/login" variant="outline" className="hidden md:inline-flex text-[16px] px-10 py-3.5 font-black tracking-[0.25em] border-2">
              JOIN
            </NeonButton>

            {/* Mobile menu toggle (3 dots as requested) */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-300 hover:text-primary transition-colors p-2"
              aria-label="Toggle menu"
            >
              {isOpen
                ? <X className="h-7 w-7 text-primary" />
                : <MoreVertical className="h-7 w-7" />
              }
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} links={links} pathname={pathname} />
    </>
  );
}
