"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NeonButton } from "../ui/NeonButton";
import { GlitchText } from "../ui/GlitchText";
import { MobileMenu } from "./MobileMenu";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  
  // High performance scroll tracking
  const lastPosRef = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    // Reset state for new page
    setIsVisible(true);
    
    // Give Next.js and Lenis more breathing room to complete the scroll-to-top transition
    // and reset the window.scrollY to zero on the new page
    const syncScrollPos = () => {
      lastPosRef.current = window.scrollY;
      setIsVisible(true);
    };

    const reSyncTimer = setTimeout(syncScrollPos, 100);

    const updateNavbar = () => {
      const currentPos = window.scrollY;
      
      // Top of page: always show
      if (currentPos < 50) {
        setIsVisible(true);
        lastPosRef.current = currentPos;
      } else {
        const diff = currentPos - lastPosRef.current;
        
        // Threshold check (15px to avoid jitter)
        if (Math.abs(diff) > 15) {
          if (diff > 0) {
            // Scrolling down
            setIsVisible(false);
          } else {
            // Scrolling up
            setIsVisible(true);
          }
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
    { name: "Home", href: "/" },
    { name: "Team", href: "/team" },
    { name: "Projects", href: "/projects" },
    { name: "Events", href: "/events" },
    { name: "Resources", href: "/resources" },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/20 transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-[1fr_auto_1fr] items-center h-24">
            {/* Logo */}
            <div className="flex justify-start">
              <Link href="/" className="flex items-center font-jetbrains text-3xl font-extrabold text-white group tracking-wider">
                <span className="text-primary mr-2 opacity-0 group-hover:opacity-100 transition-opacity">&gt;</span>
                SOCS
                <span className="inline-block w-3 h-6 ml-1 bg-primary animate-[blink-cursor_1s_step-end_infinite]"></span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex justify-center items-center space-x-12">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`font-turret text-lg font-bold uppercase tracking-[0.2em] transition-all duration-300 relative group px-4 py-2 ${
                      isActive ? "text-primary transition-none" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <span className="active-pixel-bg" aria-hidden="true"></span>
                    )}
                    
                    <span className="relative z-10">
                      {isActive ? (
                        <GlitchText text={link.name} intensity="low" />
                      ) : (
                        link.name
                      )}
                    </span>
                    
                  </Link>
                );
              })}
            </div>

            {/* Actions / Mobile Toggle */}
            <div className="flex justify-end items-center space-x-6">
              <NeonButton href="/join" variant="outline" className="hidden md:inline-flex text-sm px-6 py-2">
                Join
              </NeonButton>
              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-gray-300 hover:text-white hover:text-glow focus:outline-none"
                >
                  {isOpen ? <X className="h-8 w-8 text-primary" /> : <Menu className="h-8 w-8" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} links={links} pathname={pathname} />
    </>
  );
}
