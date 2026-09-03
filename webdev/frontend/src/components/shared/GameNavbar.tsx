"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Star, Gamepad2 } from "lucide-react";
import { useXp } from "@/hooks/useXp";

interface GameNavbarProps {
  title?: string;
  backHref?: string;
}

export function GameNavbar({ title, backHref = "/play" }: GameNavbarProps) {
  const { xp, rank } = useXp();

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-14 bg-[#1A1614]/95 backdrop-blur-md border-b border-white/10 flex items-center px-4 lg:px-8 gap-4">
      <Link
        href={backHref}
        className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-sm shrink-0"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Kembali</span>
      </Link>

      <div className="h-4 w-px bg-white/10 hidden sm:block" />

      <Link href="/" className="flex items-center gap-3 shrink-0 group">
        <Image
          src="/images/logo-batik-kita.png"
          alt="Logo Batik Kita"
          width={40}
          height={40}
          className="w-10 h-10 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
          priority
        />
        <span className="font-philosopher font-bold text-2xl text-white hidden sm:inline tracking-wide">
          Batik Kita
        </span>
      </Link>

      {title && (
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Gamepad2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <span className="font-display font-semibold text-sm text-white truncate">
            {title}
          </span>
        </div>
      )}

      <div className="ml-auto flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 shrink-0">
        <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-current" />
        <span className="font-display font-bold text-xs text-[#D4AF37]">{xp} XP</span>
        <span className="text-white/40 text-xs hidden sm:inline">·</span>
        <span className="font-body text-xs text-white/60 hidden sm:inline truncate max-w-[120px]">{rank}</span>
      </div>
    </nav>
  );
}
