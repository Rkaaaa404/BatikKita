"use client";

import React, { useState } from "react";
import { Gamepad2, Puzzle, Eye } from "lucide-react";
import { CapStampingBoard } from "@/components/games/CapStampingBoard";

export function ArcadePreview() {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSolve = (timeSeconds: number) => {
    setShowConfetti(true);
    // You could trigger confetti here if desired
  };

  return (
    <section id="arcade" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Game Info & Modes */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 self-start bg-[#713f2c]/10 text-[#713f2c] px-3.5 py-1 rounded-full text-xs font-bold mb-3">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Edu-Games Arcade</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#713f2c] tracking-tight mb-4">
            Batik Cap Stamping & Ragam Permainan Edukasi
          </h2>

          <p className="font-narrative text-base sm:text-lg text-[#8d786a] leading-relaxed mb-6">
            Pahami anatomi motif, sejarah persebaran budaya Nusantara, hingga simulasi membatik canting tradisional secara interaktif dan menyenangkan.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3 bg-[#F5F3EF] p-4 rounded-xl border border-[#ada69f]/40">
              <div className="w-9 h-9 rounded-lg bg-[#713f2c] flex items-center justify-center text-[#D4AF37] font-bold shrink-0">
                1
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-[#2d2b38]">Batik Cap Stamping</h4>
                <p className="font-narrative text-xs text-[#8d786a]">
                  Warnai sketsa batik dengan menempatkan kepingan motif (cap) secara tepat agar menyatu sempurna.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#F5F3EF] p-4 rounded-xl border border-[#ada69f]/40">
              <div className="w-9 h-9 rounded-lg bg-[#78350f] flex items-center justify-center text-[#fcd34d] font-bold shrink-0">
                2
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-[#2d2b38]">Tebak Motif & Simulasi Canting</h4>
                <p className="font-narrative text-xs text-[#8d786a]">
                  Uji wawasan motif Nusantara, sortir peta daerah, dan torehkan lilin malam menggunakan canting virtual.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <a
            href="/play"
            className="inline-flex items-center gap-2 bg-[#713f2c] text-[#D4AF37] font-display font-bold text-sm px-6 py-3 rounded-xl hover:bg-[#583122] transition-all shadow-md hover:shadow-lg mb-2"
          >
            <Gamepad2 className="w-4 h-4" />
            Mainkan Sekarang
          </a>
        </div>

        {/* Right Column: Mini Interactive Puzzle Simulation */}
        <div className="lg:col-span-6">
          <div className="glass-card p-4 sm:p-6 rounded-3xl shadow-2xl border border-[#D4AF37]/40 relative overflow-hidden bg-[#1A1614] text-white">
            {/* Header controls */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Puzzle className="w-5 h-5 text-[#D4AF37]" />
                <span className="font-display font-bold text-sm text-white">
                  Mini-Demo: Cap Stamping
                </span>
              </div>
            </div>

            <div className="scale-90 origin-top">
              <CapStampingBoard 
                motifId="kawung"
                image="/images/batik-kawung.jpg" 
                philosophy="Pola 4 kelopak buah aren melambangkan empat penjuru mata angin."
                onSolve={handleSolve} 
              />
            </div>

            {showConfetti && (
              <div className="absolute inset-0 bg-[#1A1614]/80 flex flex-col items-center justify-center z-50">
                <p className="font-display font-bold text-2xl text-[#D4AF37] mb-2">Hebat!</p>
                <p className="text-white/80 font-body mb-4 text-center px-6">Anda telah menyelesaikan demo Cap Stamping.</p>
                <a href="/play" className="bg-[#D4AF37] text-[#1A1614] px-4 py-2 rounded-lg font-bold">Main Versi Penuh</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
