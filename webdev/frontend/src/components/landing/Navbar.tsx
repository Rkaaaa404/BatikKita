"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Gamepad2, Sparkles } from "lucide-react";

interface NavbarProps {
  variant?: "auto" | "transparent" | "solid";
}

const NAV_LINKS = [
  { href: "/", label: "Beranda", exact: true },
  { href: "/play", label: "Batik Arcade", exact: false },
  { href: "/scan", label: "Batik Lens", exact: false },
  { href: "/chat", label: "Batik Ask", exact: false },
  { href: "/batikpedia", label: "Batik Pedia", exact: false },
  { href: "/collection", label: "Koleksi", exact: false },
];

export function Navbar({ variant = "auto" }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine if this page has a dark hero at the top (now all main tabs have consistent dark hero banners)
  const pagesWithDarkHero = ["/", "/play", "/scan", "/chat", "/batikpedia"];
  const hasDarkHero =
    variant === "transparent" ||
    (variant === "auto" && pagesWithDarkHero.some((p) => p === "/" ? pathname === "/" : pathname?.startsWith(p)));

  // Solid mode is active either when forced, scrolled, or on pages without dark hero
  const isSolid = variant === "solid" || !hasDarkHero || isScrolled;

  const isActive = (href: string, exact: boolean) => {
    if (!pathname) return false;
    return exact ? pathname === href : pathname.startsWith(href);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isSolid
          ? "bg-[#faf8f4]/95 backdrop-blur-md border-b border-[#713f2c]/10 py-2.5 sm:py-3 shadow-sm"
          : "bg-gradient-to-b from-black/60 via-black/25 to-transparent py-3 sm:py-4"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group">
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 md:w-13 md:h-13 flex items-center justify-center shrink-0">
            <Image
              src="/images/logo-batik-kita.png"
              alt="Logo Batik Kita"
              width={52}
              height={52}
              className="w-full h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span
              className={`font-philosopher font-bold text-xl sm:text-2xl md:text-3xl tracking-wide transition-colors leading-none ${
                isSolid ? "text-[#713f2c]" : "text-white"
              }`}
            >
              Batik Kita
            </span>
            <span
              className={`text-[9px] sm:text-[10px] tracking-widest uppercase font-display font-medium transition-colors ${
                isSolid ? "text-[#8d786a]" : "text-[#D4AF37]"
              }`}
            >
              Warisan Luhur Nusantara
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href, link.exact);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-body text-sm transition-all relative py-1 ${
                  isSolid
                    ? active
                      ? "text-[#713f2c] font-bold"
                      : "text-[#8d786a] hover:text-[#713f2c] font-medium"
                    : active
                    ? "text-[#D4AF37] font-bold drop-shadow-sm"
                    : "text-white/85 hover:text-white font-medium"
                }`}
              >
                {link.label}
                {active && (
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all ${
                      isSolid ? "bg-[#713f2c]" : "bg-[#D4AF37]"
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          {pathname === "/" ? (
            <a
              href="#arcade"
              className={`inline-flex items-center gap-2 font-display font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm ${
                isSolid
                  ? "bg-[#713f2c] text-[#D4AF37] hover:bg-[#583122]"
                  : "bg-[#D4AF37] text-[#2d2b38] hover:bg-[#c9a52f] shadow-lg shadow-[#D4AF37]/20"
              }`}
            >
              Mulai Jelajahi
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          ) : (
            <Link
              href={pathname?.startsWith("/play") ? "/chat" : "/play"}
              className={`inline-flex items-center gap-2 font-display font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm ${
                isSolid
                  ? "bg-[#713f2c] text-[#D4AF37] hover:bg-[#583122]"
                  : "bg-[#D4AF37] text-[#2d2b38] hover:bg-[#c9a52f] shadow-lg shadow-[#D4AF37]/20"
              }`}
            >
              {pathname?.startsWith("/play") ? (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Batik Ask
                </>
              ) : (
                <>
                  <Gamepad2 className="w-3.5 h-3.5" />
                  Main Arcade
                </>
              )}
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className={`md:hidden p-2 rounded-xl transition-colors ${
            isSolid ? "text-[#713f2c] hover:bg-[#713f2c]/10" : "text-white hover:bg-white/15"
          }`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Buka Menu Navigasi"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#faf8f4]/98 backdrop-blur-xl border-t border-[#713f2c]/10 px-5 py-4 space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href, link.exact);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between text-sm py-2.5 px-3 rounded-xl transition-colors ${
                  active
                    ? "bg-[#713f2c] text-[#D4AF37] font-bold shadow-xs"
                    : "text-[#2d2b38] hover:text-[#713f2c] hover:bg-[#713f2c]/5"
                }`}
              >
                <span>{link.label}</span>
                {active && <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-[#713f2c]/10">
            <Link
              href="/play"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#713f2c] text-[#D4AF37] font-display font-semibold text-sm px-4 py-3 rounded-xl text-center shadow-md active:scale-98 transition-transform"
            >
              <Gamepad2 className="w-4 h-4" />
              Main Arcade Sekarang
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
