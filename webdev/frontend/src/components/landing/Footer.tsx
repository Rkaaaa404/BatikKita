"use client";

import React from "react";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#e4e2de] border-t border-[#d8c2b8] py-12 px-6 lg:px-16">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-[#53433C]">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-1.5 mb-3">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4L10 4M4 4L4 10M4 4L10 10M20 4L14 4M20 4L20 10M20 4L14 10M4 20L10 20M4 20L4 14M4 20L10 14M20 20L14 20M20 20L20 14M20 20L14 14" stroke="#7A3E1D" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="font-display font-bold text-[#7A3E1D]">BatikKita</span>
            </div>
            <p className="font-narrative text-xs text-[#86736B] leading-relaxed">
              © 2026 HoloDev HOLOGY 9.0. Celebrating UNESCO Intangible Cultural Heritage.
            </p>
          </div>

          {/* Spacer */}
          <div className="hidden md:block md:col-span-1" />

          {/* Links */}
          <div className="flex flex-col gap-2">
            <a href="#" className="hover:text-[#7A3E1D] transition-colors">Tim Kami</a>
            <a href="#" className="hover:text-[#7A3E1D] transition-colors">Ketentuan</a>
          </div>
          <div className="flex flex-col gap-2">
            <a href="#" className="hover:text-[#7A3E1D] transition-colors">Kontak</a>
            <a href="#" className="hover:text-[#7A3E1D] transition-colors">Filosofi Batik</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
