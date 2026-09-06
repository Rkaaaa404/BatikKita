"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Star, Gamepad2, Sun, Moon } from "lucide-react";
import { useXp } from "@/hooks/useXp";
import { useGameTheme } from "@/hooks/useGameTheme";

interface GameNavbarProps {
  title?: string;
  backHref?: string;
}

export function GameNavbar({ title, backHref = "/play" }: GameNavbarProps) {
  const { xp, rank } = useXp();
  const { isDark, toggleTheme } = useGameTheme();

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 h-14 backdrop-blur-md border-b transition-colors duration-200 flex items-center px-4 lg:px-8 gap-3 sm:gap-4 ${
        isDark
          ? "bg-[#1A1614]/95 border-white/10 text-white"
          : "bg-[#FAF8F4]/95 border-[#D3CCC2]/80 text-[#2D2B38]"
      }`}
    >
      <Link
        href={backHref}
        className={`flex items-center gap-1.5 transition-colors text-sm shrink-0 ${
          isDark ? "text-white/60 hover:text-white" : "text-[#713F2C] hover:text-[#583122]"
        }`}
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline font-medium">Kembali</span>
      </Link>

      <div className={`h-4 w-px hidden sm:block ${isDark ? "bg-white/10" : "bg-[#D3CCC2]"}`} />

      <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
        <Image
          src="/images/logo-batik-kita.png"
          alt="Logo Batik Kita"
          width={36}
          height={36}
          className="w-9 h-9 object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
          priority
        />
        <span
          className={`font-philosopher font-bold text-xl sm:text-2xl hidden md:inline tracking-wide ${
            isDark ? "text-white" : "text-[#2D2B38]"
          }`}
        >
          Batik Kita
        </span>
      </Link>

      {title && (
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Gamepad2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <span
            className={`font-display font-semibold text-xs sm:text-sm truncate ${
              isDark ? "text-white" : "text-[#2D2B38]"
            }`}
          >
            {title}
          </span>
        </div>
      )}

      {/* Right controls: Theme Toggle & XP */}
      <div className="ml-auto flex items-center gap-2 shrink-0">
        {/* Theme Toggle Button (Light/Dark) */}
        <button
          type="button"
          onClick={toggleTheme}
          className={`p-1.5 rounded-full border transition-all cursor-pointer ${
            isDark
              ? "bg-white/10 border-white/15 text-[#D4AF37] hover:bg-white/20"
              : "bg-[#FAF8F4] border-[#D3CCC2] text-[#713F2C] hover:bg-[#F2EFE9]"
          }`}
          title={isDark ? "Ubah ke Mode Terang (Light)" : "Ubah ke Mode Gelap (Dark)"}
          aria-label="Ganti tema permainan"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* XP Status Pill */}
        <div
          className={`flex items-center gap-2 border rounded-full px-3 py-1 ${
            isDark
              ? "bg-white/5 border-white/10 text-white"
              : "bg-white border-[#D3CCC2] text-[#2D2B38] shadow-xs"
          }`}
        >
          <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-current" />
          <span className="font-display font-bold text-xs text-[#D4AF37]">{xp} XP</span>
          <span className={`text-xs hidden sm:inline ${isDark ? "text-white/40" : "text-[#8D786A]"}`}>
            ·
          </span>
          <span
            className={`font-body text-xs hidden sm:inline truncate max-w-[100px] ${
              isDark ? "text-white/60" : "text-[#8D786A]"
            }`}
          >
            {rank}
          </span>
        </div>
      </div>
    </nav>
  );
}
