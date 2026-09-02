"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
          ? "bg-[#fbf9f5]/95 backdrop-blur-md border-b border-[#7A3E1D]/10 py-3 shadow-sm"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center gap-1.5">
            <svg
              className="w-5 h-5 transition-colors"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 4L10 4M4 4L4 10M4 4L10 10M20 4L14 4M20 4L20 10M20 4L14 10M4 20L10 20M4 20L4 14M4 20L10 14M20 20L14 20M20 20L20 14M20 20L14 14"
                stroke={isScrolled ? "#7A3E1D" : "#FFFFFF"}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span
              className={`font-display font-bold text-lg tracking-tight transition-colors ${
                isScrolled ? "text-[#7A3E1D]" : "text-white"
              }`}
            >
              BatikKita
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {["Arcade", "AI Scanner", "Batikpedia"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className={`font-body text-sm font-medium transition-colors ${
                isScrolled ? "text-[#53433C] hover:text-[#7A3E1D]" : "text-white/80 hover:text-white"
              }`}
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <a
            href="#arcade"
            className={`inline-flex items-center gap-2 font-display font-semibold text-sm px-5 py-2.5 rounded-lg transition-all shadow-sm ${
              isScrolled 
                ? "bg-[#7A3E1D] text-[#D4AF37] hover:bg-[#5D2808]" 
                : "bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20"
            }`}
          >
            Mulai Jelajahi
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className={`md:hidden p-2 transition-colors ${isScrolled ? "text-[#7A3E1D]" : "text-white"}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#fbf9f5] border-t border-[#7A3E1D]/10 px-6 py-4 space-y-3">
          {["Arcade", "AI Scanner", "Batikpedia"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#53433C] hover:text-[#7A3E1D] py-2"
            >
              {item}
            </a>
          ))}
          <a
            href="#arcade"
            className="block bg-[#7A3E1D] text-[#D4AF37] text-sm font-semibold px-4 py-2.5 rounded-lg text-center"
          >
            Mulai Jelajahi
          </a>
        </div>
      )}
    </nav>
  );
}
