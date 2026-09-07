"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-[#d3ccc2] border-t border-[#d8c2b8] pt-12 pb-24 md:py-12 px-4 sm:px-6 lg:px-16">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-sm text-[#8d786a]">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <Image
                src="/images/logo-batik-kita.png"
                alt="Logo Batik Kita"
                width={36}
                height={36}
                className="w-9 h-9 object-contain"
              />
              <span className="font-philosopher font-bold text-2xl text-[#713f2c]">Batik Kita</span>
            </div>
            <p className="font-narrative text-xs text-[#86736B] leading-relaxed">
              © 2026 Hology. Warisan Luhur dalam Sentuhan Digital.
            </p>
          </div>

          {/* Spacer */}
          <div className="hidden md:block md:col-span-1" />

          {/* Links */}
          <div className="flex flex-col gap-2">
            <Link href="/play" className="hover:text-[#713f2c] transition-colors">Batik Arcade</Link>
            <Link href="/scan" className="hover:text-[#713f2c] transition-colors">Batik Lens</Link>
            <Link href="/chat" className="hover:text-[#713f2c] transition-colors">Batik Ask</Link>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/batikpedia" className="hover:text-[#713f2c] transition-colors">Batik Pedia</Link>
            <Link href="/collection" className="hover:text-[#713f2c] transition-colors">Album Koleksi</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
