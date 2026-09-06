"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion } from "motion/react";
import { RefreshCw, Timer, Target } from "lucide-react";
import { GameNavbar } from "@/components/shared/GameNavbar";
import { CapStampingBoard } from "@/components/games/CapStampingBoard";
import { WinModal } from "@/components/games/WinModal";
import { useXp } from "@/hooks/useXp";
import { useGameTheme } from "@/hooks/useGameTheme";

const MOTIFS = [
  {
    id: "kawung",
    name: "Kawung Picis",
    region: "D.I. Yogyakarta",
    category: "Batik Keraton",
    difficulty: "Mudah",
    image: "/images/motifs/batik_kawung.webp",
    philosophy: "Pola 4 kelopak buah aren melambangkan empat penjuru mata angin, kesucian niat, dan kemurnian budi pekerti manusia.",
    xp: 100,
    color: "from-[#713f2c] to-[#8d786a]",
  },
  {
    id: "parang",
    name: "Parang Rusak Barong",
    region: "Surakarta & Yogyakarta",
    category: "Batik Larangan",
    difficulty: "Menengah",
    image: "/images/motifs/batik_parang.webp",
    philosophy: "Garis diagonal ombak tak terputus melambangkan semangat pantang menyerah dan keteguhan pemimpin.",
    xp: 150,
    color: "from-[#1E3A8A] to-[#2d2b38]",
  },
  {
    id: "megamendung",
    name: "Mega Mendung",
    region: "Cirebon, Jawa Barat",
    category: "Batik Pesisiran",
    difficulty: "Lanjutan",
    image: "/images/motifs/batik_mega_mendung_v2.webp",
    philosophy: "Awan pembawa hujan melambangkan kesabaran, kesejukan hati, dan ketenangan jiwa laksana awan penyejuk.",
    xp: 200,
    color: "from-[#D4AF37] to-[#713f2c]",
  },
];

export default function CapStampingPage() {
  const [selected, setSelected] = useState<(typeof MOTIFS)[0] | null>(null);
  const [gameKey, setGameKey] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [winData, setWinData] = useState<{ open: boolean; time: number }>({ open: false, time: 0 });
  const { addXp } = useXp();
  const { isDark } = useGameTheme();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    setElapsed(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const handleSelect = useCallback((motif: (typeof MOTIFS)[0]) => {
    setSelected(motif);
    setGameKey((k) => k + 1);
    startTimer();
  }, [startTimer]);

  const handleSolve = useCallback((timeSeconds: number) => {
    stopTimer();
    if (!selected) return;
    addXp(selected.xp);
    setWinData({ open: true, time: timeSeconds });
  }, [selected, addXp, stopTimer]);

  const handleReset = useCallback(() => {
    setGameKey((k) => k + 1);
    startTimer();
  }, [startTimer]);

  const handleCloseWin = useCallback(() => {
    setWinData({ open: false, time: 0 });
  }, []);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark ? "bg-[#1A1614] text-white" : "bg-[#FAF8F4] text-[#2D2B38]"
      }`}
    >
      <GameNavbar title="Batik Cap Stamping" />

      <main className="pt-14 min-h-screen">
        {!selected ? (
          /* ─── Level Select ─── */
          <div className="max-w-4xl mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-display font-bold px-4 py-1.5 rounded-full mb-4">
                <Target className="w-3.5 h-3.5" /> PILIH KANVAS MOTIF
              </div>
              <h1
                className={`font-display font-extrabold text-3xl md:text-4xl mb-3 ${
                  isDark ? "text-white" : "text-[#2D2B38]"
                }`}
              >
                Batik Cap Stamping
              </h1>
              <p
                className={`font-body max-w-md mx-auto text-sm ${
                  isDark ? "text-white/60" : "text-stone-600"
                }`}
              >
                Warnai sketsa batik dengan menempatkan kepingan motif (cap) di posisi yang tepat agar menyatu sempurna (*seamless*).
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {MOTIFS.map((motif, i) => (
                <motion.button
                  key={motif.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => handleSelect(motif)}
                  className={`group relative rounded-2xl overflow-hidden border transition-all hover:scale-[1.02] text-left cursor-pointer ${
                    isDark
                      ? "border-white/10 hover:border-[#D4AF37]/50"
                      : "border-[#E2DDD5] hover:border-[#D4AF37] shadow-sm"
                  }`}
                >
                  {/* Image */}
                  <div
                    className="h-44 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url(${motif.image})` }}
                  />
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${motif.color} opacity-60`} />
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="inline-block bg-white/10 backdrop-blur-sm text-white/80 text-[10px] font-display font-bold px-2 py-0.5 rounded mb-1">
                      {motif.difficulty} · +{motif.xp} XP
                    </span>
                    <h3 className="font-display font-bold text-lg text-white">{motif.name}</h3>
                    <p className="text-white/70 text-xs">{motif.region}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          /* ─── Game Area ─── */
          <div className="max-w-2xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2
                  className={`font-display font-bold text-lg ${
                    isDark ? "text-white" : "text-[#2D2B38]"
                  }`}
                >
                  {selected.name}
                </h2>
                <p
                  className={`text-xs ${
                    isDark ? "text-white/50" : "text-stone-500"
                  }`}
                >
                  {selected.region} · {selected.category}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center gap-1.5 border rounded-lg px-3 py-1.5 ${
                    isDark ? "bg-white/5 border-white/10" : "bg-white border-[#E2DDD5] shadow-xs"
                  }`}
                >
                  <Timer className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="font-display font-bold text-sm text-[#D4AF37]">
                    {mins > 0 ? `${mins}:${secs.toString().padStart(2, "0")}` : `${secs}s`}
                  </span>
                </div>
                <button
                  onClick={handleReset}
                  className={`flex items-center gap-1.5 text-xs rounded-lg px-3 py-1.5 transition-colors cursor-pointer border ${
                    isDark
                      ? "text-white/50 hover:text-white border-white/10 hover:border-white/20"
                      : "text-stone-600 hover:text-stone-900 border-[#E2DDD5] hover:border-stone-400 bg-white shadow-xs"
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Acak Ulang
                </button>
              </div>
            </div>

            <CapStampingBoard 
              key={gameKey} 
              motifId={selected.id}
              motifName={selected.name}
              image={selected.image} 
              philosophy={selected.philosophy}
              onSolve={handleSolve} 
            />
          </div>
        )}
      </main>

      {/* Win Modal */}
      {selected && (
        <WinModal
          open={winData.open}
          motifName={selected.name}
          motifRegion={selected.region}
          philosophy={selected.philosophy}
          image={selected.image}
          xpEarned={selected.xp}
          timeSeconds={winData.time}
          onClose={handleCloseWin}
        />
      )}
    </div>
  );
}
