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
        <div className="max-w-[1700px] mx-auto flex items-center h-full px-6 md:px-12">
          {/* ── Left: Logo (Fixed Width for Centering) ── */}
          <div className="flex items-center w-[300px] shrink-0">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="relative">
                <span className="font-turret text-2xl font-black text-white tracking-[0.05em] transition-all duration-300 group-hover:text-primary">
                  SOCS
                </span>
                <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300 shadow-[0_0_10px_rgba(200,255,0,0.8)]" />
              </div>
              <div className="relative flex items-center">
                <div className="w-[3px] h-6 bg-primary shadow-[0_0_15px_rgba(200,255,0,0.6)]" />
                <div className="ml-2 w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(200,255,0,0.8)]" />
                <span className="ml-2 text-[8px] font-mono text-primary tracking-[0.2em] hidden lg:block uppercase font-bold opacity-60">SYS_ACTIVE</span>
              </div>
            </Link>
          </div>

          {/* ── Center: Nav Links (Desktop) ── */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-5 xl:px-8 py-2 text-[16px] xl:text-[18px] font-black font-turret tracking-[0.1em] uppercase transition-all duration-300 group ${
                    isActive ? "text-primary" : "text-gray-500 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="nav-glow"
                      className="absolute inset-x-0 bottom-0 top-0 z-0 bg-primary/5 border-l border-r border-primary/30"
                      style={{
                        backgroundImage: "radial-gradient(circle, #c8ff0011 1px, transparent 1px)",
                        backgroundSize: "6px 6px"
                      }}
                    >
                      <motion.div 
                        animate={{ y: ["-100%", "100%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-x-0 h-[100%] bg-gradient-to-b from-transparent via-primary/10 to-transparent opacity-50"
                      />
                    </motion.div>
                  )}
                  <span className="relative z-10 flex items-center transition-all duration-300 group-hover:text-primary group-hover:scale-105">
                    <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 mr-1 text-primary font-mono text-sm">[</span>
                    {link.name}
                    <span className="opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ml-1 text-primary font-mono text-sm">]</span>
                  </span>
                </Link>
              );
            })}
          </div>

          {/* ── Right: CTA (Desktop) (Fixed Width for Centering) ── */}
          <div className="flex items-center justify-end w-[300px] shrink-0 gap-4">
            <NeonButton href="/login" variant="outline" className="hidden md:inline-flex text-[14px] px-8 py-2.5 font-black tracking-[0.2em] border-2">
              JOIN
            </NeonButton>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-300 hover:text-primary transition-colors p-2"
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
