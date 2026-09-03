"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Gamepad2, Puzzle, Eye, Award, Sparkles, RefreshCw, HelpCircle, CheckCircle, Check, Plus } from "lucide-react";

export function ArcadePreview() {
  // Mini interactive Jigsaw state (4 pieces for quick demonstration)
  const [placedPieces, setPlacedPieces] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);

  const pieces = [
    { id: 1, label: "Kelopak Barat", gridPos: "Kiri Atas", style: "rounded-tl-2xl" },
    { id: 2, label: "Kelopak Utara", gridPos: "Kanan Atas", style: "rounded-tr-2xl" },
    { id: 3, label: "Kelopak Selatan", gridPos: "Kiri Bawah", style: "rounded-bl-2xl" },
    { id: 4, label: "Kelopak Timur", gridPos: "Kanan Bawah", style: "rounded-br-2xl" },
  ];

  const handlePlacePiece = (id: number) => {
    if (placedPieces.includes(id)) return;
    const newPlaced = [...placedPieces, id];
    setPlacedPieces(newPlaced);

    if (newPlaced.length === 4) {
      setCompleted(true);
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#713f2c", "#D4AF37", "#1E3A8A", "#faf8f4"],
        });
      } catch (e) {
        // fallback
      }
    }
  };

  const handleReset = () => {
    setPlacedPieces([]);
    setCompleted(false);
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
            Batik Jigsaw & Detektif Isen
          </h2>

          <p className="font-narrative text-base sm:text-lg text-[#8d786a] leading-relaxed mb-6">
            Pahami anatomi geometri, simetri belah ketupat, dan kehalusan elemen isen-isen (cecek, sawut, sisik) dengan cara yang adiktif dan mengasah otak.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3 bg-[#F5F3EF] p-4 rounded-xl border border-[#ada69f]/40">
              <div className="w-9 h-9 rounded-lg bg-[#713f2c] flex items-center justify-center text-[#D4AF37] font-bold shrink-0">
                1
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-[#2d2b38]">Jigsaw & Tangram Puzzle</h4>
                <p className="font-narrative text-xs text-[#8d786a]">
                  Susun pecahan simetri ragam hias Kawung, Truntum, dan Mega Mendung dengan sistem snap magnetik.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#F5F3EF] p-4 rounded-xl border border-[#ada69f]/40">
              <div className="w-9 h-9 rounded-lg bg-[#1E3A8A] flex items-center justify-center text-white font-bold shrink-0">
                2
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-[#2d2b38]">Detektif Isen-Isen</h4>
                <p className="font-narrative text-xs text-[#8d786a]">
                  Misi menemukan ornamen isen-isen tersembunyi pada kain batik beresolusi ultra-tinggi.
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
          <div className="glass-card p-6 rounded-3xl shadow-2xl border border-[#D4AF37]/40 relative overflow-hidden">
            {/* Header controls */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#ada69f]/40">
              <div className="flex items-center gap-2">
                <Puzzle className="w-5 h-5 text-[#713f2c]" />
                <span className="font-display font-bold text-sm text-[#2d2b38]">
                  Mini-Demo: Motif Kawung
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className={`text-xs font-display font-semibold px-3 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                    showHint ? "bg-[#D4AF37] text-[#4A2511] border-[#D4AF37]" : "bg-white text-[#8d786a] border-[#ada69f]"
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" /> Petunjuk
                </button>
                <button
                  onClick={handleReset}
                  className="p-1.5 rounded-lg bg-white border border-[#ada69f] text-[#8d786a] hover:text-[#713f2c] transition-colors"
                  title="Ulangi"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Puzzle Board 2x2 Grid */}
            <div className="relative aspect-square max-w-[320px] mx-auto bg-[#4A2511]/10 rounded-2xl p-3 border-2 border-dashed border-[#713f2c]/40 mb-6">
              {/* Hint Siluet */}
              {showHint && (
                <div className="absolute inset-3 rounded-xl opacity-30 bg-[#D4AF37] pointer-events-none flex items-center justify-center font-display font-bold text-xs text-[#713f2c]">
                  Siluet Motif Kawung 4 Kelopak
                </div>
              )}

              {/* Grid Cells */}
              <div className="grid grid-cols-2 grid-rows-2 gap-2 w-full h-full">
                {pieces.map((p) => {
                  const isPlaced = placedPieces.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      className={`rounded-xl flex flex-col items-center justify-center text-center transition-all ${
                        isPlaced
                          ? "bg-gradient-to-br from-[#713f2c] to-[#4A2511] text-[#D4AF37] shadow-lg border-2 border-[#D4AF37] scale-100"
                          : "bg-white/60 border border-dashed border-[#ada69f] text-[#86736B]"
                      }`}
                    >
                      {isPlaced ? (
                        <>
                          <CheckCircle className="w-6 h-6 mb-1 text-[#D4AF37]" />
                          <span className="font-display font-bold text-xs text-white">{p.label}</span>
                        </>
                      ) : (
                        <span className="text-[11px] font-medium text-[#86736B]">Slot {p.gridPos}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tray: Pieces to click / place */}
            <div className="space-y-2">
              <span className="text-xs font-display font-bold text-[#8d786a] block">
                {completed ? "Selamat! Geometri Motif Tersusun Sempurna!" : "Klik kepingan untuk memasang:"}
              </span>

              {completed ? (
                <div className="bg-[#D4AF37]/20 border border-[#D4AF37] p-3.5 rounded-xl flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#713f2c]" />
                    <span className="font-display font-bold text-xs text-[#713f2c]">
                      Kartu Kawung Terbuka! (+100 XP)
                    </span>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-xs font-bold text-[#713f2c] underline"
                  >
                    Main Lagi
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {pieces.map((p) => {
                    const isPlaced = placedPieces.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        disabled={isPlaced}
                        onClick={() => handlePlacePiece(p.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-display font-semibold transition-all flex items-center justify-between ${
                          isPlaced
                            ? "bg-[#EAE8E4] text-[#86736B] cursor-not-allowed opacity-50"
                            : "bg-[#713f2c] text-[#faf8f4] hover:bg-[#583122] shadow hover:scale-105"
                        }`}
                      >
                        <span>{p.label}</span>
                        {isPlaced ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Plus className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
