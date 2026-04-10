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
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* ── Left: Logo ── */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              <span className="font-turret text-2xl font-black text-white tracking-[0.05em] transition-colors duration-200">
                SOCS
              </span>
              <div className="w-2.5 h-6 bg-primary shadow-[0_0_15px_rgba(200,255,0,0.5)]" />
            </Link>
          </div>

          {/* ── Center: Nav Links (Desktop) ── */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-0">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-6 py-3 text-[18px] font-black font-turret tracking-[0.15em] uppercase transition-all duration-200 group ${
                    isActive ? "text-primary" : "text-gray-500 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="nav-glow"
                      className="absolute inset-0 z-0 bg-primary/5 border-l border-r border-primary/20 overflow-hidden"
                      style={{
                        backgroundImage: "radial-gradient(circle, #c8ff0022 1px, transparent 1px)",
                        backgroundSize: "6px 6px"
                      }}
                    >
                      {/* Animated Scan Line */}
                      <motion.div 
                        animate={{ y: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-x-0 h-[2px] bg-primary/20 blur-[1px]"
                      />
                    </motion.div>
                  )}
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300">{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* ── Right: CTA (Desktop) + Mobile Menu Toggle ── */}
          <div className="flex items-center justify-end shrink-0 gap-4">
            <NeonButton href="/login" variant="outline" className="hidden md:inline-flex text-[14px] px-8 py-3 font-black tracking-[0.2em] border-2">
              JOIN
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
