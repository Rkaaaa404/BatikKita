"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Compass, Menu, X, ArrowRight } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#faf8f4]/95 backdrop-blur-md border-b border-[#713f2c]/10 py-3 shadow-sm"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 md:w-9 md:h-9 flex items-center justify-center shrink-0">
            <Image
              src="/images/logo-batik-kita.png"
              alt="Logo Batik Kita"
              width={36}
              height={36}
              className="w-full h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>
          <span
            className={`font-philosopher font-bold text-xl md:text-2xl tracking-wide transition-colors ${
              isScrolled ? "text-[#713f2c]" : "text-white"
            }`}
          >
            Batik Kita
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          <Link
            href="/play"
            className={`font-body text-sm font-medium transition-colors ${
              isScrolled ? "text-[#8d786a] hover:text-[#713f2c]" : "text-white/80 hover:text-white"
            }`}
          >
            Arcade
          </Link>
          <Link
            href="/scan"
            className={`font-body text-sm font-medium transition-colors ${
              isScrolled ? "text-[#8d786a] hover:text-[#713f2c]" : "text-white/80 hover:text-white"
            }`}
          >
            Batik Lens
          </Link>
          <Link
            href="/chat"
            className={`font-body text-sm font-medium transition-colors ${
              isScrolled ? "text-[#8d786a] hover:text-[#713f2c]" : "text-white/80 hover:text-white"
            }`}
          >
            Sang Empu
          </Link>
          <Link
            href="/batikpedia"
            className={`font-body text-sm font-medium transition-colors ${
              isScrolled ? "text-[#8d786a] hover:text-[#713f2c]" : "text-white/80 hover:text-white"
            }`}
          >
            Batikpedia
          </Link>
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <a
            href="#arcade"
            className={`inline-flex items-center gap-2 font-display font-semibold text-sm px-5 py-2.5 rounded-lg transition-all shadow-sm ${
              isScrolled 
                ? "bg-[#713f2c] text-[#D4AF37] hover:bg-[#583122]" 
                : "bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20"
            }`}
          >
            Mulai Jelajahi
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className={`md:hidden p-2 transition-colors ${isScrolled ? "text-[#713f2c]" : "text-white"}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#faf8f4] border-t border-[#713f2c]/10 px-6 py-4 space-y-3">
          <Link
            href="/play"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#8d786a] hover:text-[#713f2c] py-2"
          >
            Arcade
          </Link>
          <Link
            href="/scan"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#8d786a] hover:text-[#713f2c] py-2"
          >
            Batik Lens
          </Link>
          <Link
            href="/chat"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#8d786a] hover:text-[#713f2c] py-2"
          >
            Sang Empu
          </Link>
          <Link
            href="/batikpedia"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#8d786a] hover:text-[#713f2c] py-2"
          >
            Batikpedia
          </Link>
          <a
            href="#arcade"
            className="block bg-[#713f2c] text-[#D4AF37] text-sm font-semibold px-4 py-2.5 rounded-lg text-center"
          >
            Mulai Jelajahi
          </a>
        </div>
      )}
    </nav>
  );
}
