"use client";

import React from "react";
import { Gamepad2 } from "lucide-react";
import { LandingCapStampingDemo } from "@/components/landing/LandingCapStampingDemo";

export function ArcadePreview() {
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
            Pahami anatomi motif, sejarah persebaran budaya Nusantara, hingga tebak motif makro secara interaktif dan menyenangkan.
          </p>

          <div className="space-y-3 mb-8">
            <div className="flex items-start gap-3 bg-[#F5F3EF] p-3.5 rounded-xl border border-[#ada69f]/40">
              <div className="w-8 h-8 rounded-lg bg-[#713f2c] flex items-center justify-center text-[#D4AF37] font-bold text-xs shrink-0">
                1
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-[#2d2b38]">Batik Cap Stamping</h4>
                <p className="font-narrative text-xs text-[#8d786a]">
                  Warnai sketsa batik dengan menempatkan kepingan cap secara presisi.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#F5F3EF] p-3.5 rounded-xl border border-[#ada69f]/40">
              <div className="w-8 h-8 rounded-lg bg-[#f59e0b] flex items-center justify-center text-[#1A1614] font-bold text-xs shrink-0">
                2
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-[#2d2b38]">Tika (Tebak Batik Nusantara)</h4>
                <p className="font-narrative text-xs text-[#8d786a]">
                  Tebak nama motif dari potongan visual makro berjenjang zoom 800% hingga 100%.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#F5F3EF] p-3.5 rounded-xl border border-[#ada69f]/40">
              <div className="w-8 h-8 rounded-lg bg-[#0284c7] flex items-center justify-center text-white font-bold text-xs shrink-0">
                3
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-[#2d2b38]">Sortir Peta & Tebak Motif</h4>
                <p className="font-narrative text-xs text-[#8d786a]">
                  Petakan sentra budaya Nusantara dan uji wawasan filosofi motif berjenjang.
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
        <div className="lg:col-span-6 flex justify-center">
          <LandingCapStampingDemo />
        </div>
      </div>
    </section>
  );
}
