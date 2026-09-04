"use client";

import React, { useState, useCallback } from "react";
import { motion } from "motion/react";
import { Eye, Award, RefreshCw } from "lucide-react";
import { GameNavbar } from "@/components/shared/GameNavbar";
import { DetektifBoard, DetektifLevel } from "@/components/games/DetektifBoard";
import { WinModal } from "@/components/games/WinModal";
import { useXp } from "@/hooks/useXp";

const LEVELS: DetektifLevel[] = [
  {
    id: "kawung-level1",
    motifName: "Kawung",
    region: "Yogyakarta",
    image: "/images/batik-kawung.jpg",
    aspectRatio: "3409 / 2001",
    mission: "Temukan 4 titik pusat (center cecek) dari motif Kawung ini! Klik dengan tepat pada bulatan hitam di dalam setiap roset.",
    targets: [
      { id: "t1", label: "Roset Kiri Atas", x: 45, y: 30, radius: 10 },
      { id: "t2", label: "Roset Kanan Atas", x: 67, y: 30, radius: 10 },
      { id: "t3", label: "Roset Kiri Bawah", x: 45, y: 67, radius: 10 },
      { id: "t4", label: "Roset Kanan Bawah", x: 67, y: 67, radius: 10 },
    ],
  },
  {
    id: "megamendung-level1",
    motifName: "Mega Mendung",
    region: "Cirebon",
    image: "/images/batik-mega-mendung.jpg",
    aspectRatio: "4 / 3",
    mission: "Identifikasi 3 lengkungan spiral awan (sawut) pada motif Mega Mendung! Klik pada pusaran awan.",
    targets: [
      { id: "c1", label: "Pusaran Awan Kiri", x: 20, y: 25, radius: 11 },
      { id: "c2", label: "Pusaran Awan Tengah", x: 63, y: 34, radius: 11 },
      { id: "c3", label: "Pusaran Awan Kanan", x: 76, y: 55, radius: 11 },
    ],
  },
  {
    id: "parang-level1",
    motifName: "Parang Rusak",
    region: "Solo",
    image: "/images/batik-parang-rusak.jpg",
    aspectRatio: "3 / 2",
    mission: "Temukan 3 elemen mlinjon utama yang membentuk alur parang! Klik di sepanjang garis diagonal.",
    targets: [
      { id: "d1", label: "Mlinjon Kiri Atas", x: 25, y: 25, radius: 11 },
      { id: "d2", label: "Mlinjon Tengah", x: 50, y: 50, radius: 11 },
      { id: "d3", label: "Mlinjon Kanan Bawah", x: 75, y: 75, radius: 11 },
    ],
  },
];

export default function DetektifPage() {
  const [selectedLevel, setSelectedLevel] = useState<DetektifLevel | null>(null);
  const [winData, setWinData] = useState<{ open: boolean; score: number; clicks: number }>({
    open: false, score: 0, clicks: 0,
  });
  const { addXp } = useXp();

  const handleComplete = useCallback(
    (score: number, totalClicks: number) => {
      addXp(80);
      setWinData({ open: true, score, clicks: totalClicks });
    },
    [addXp]
  );

  const handleCloseWin = useCallback(() => {
    setWinData({ open: false, score: 0, clicks: 0 });
    setSelectedLevel(null);
  }, []);

  return (
    <div className="min-h-screen bg-[#1A1614] text-white">
      <GameNavbar title="Detektif Isen-Isen" />

      <main className="pt-14 min-h-screen">
        {!selectedLevel ? (
          /* ─── Level Select ─── */
          <div className="max-w-4xl mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-display font-bold px-4 py-1.5 rounded-full mb-4">
                <Eye className="w-3.5 h-3.5" /> PILIH TANTANGAN
              </div>
              <h1 className="font-display font-extrabold text-3xl md:text-4xl mb-3">Detektif Isen-Isen</h1>
              <p className="text-white/60 font-body max-w-lg mx-auto">
                Jadilah detektif budaya! Temukan dan identifikasi elemen pengisi (isen-isen) tersembunyi di dalam kain batik.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {LEVELS.map((level, i) => (
                <motion.button
                  key={level.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedLevel(level)}
                  className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/50 transition-all hover:scale-[1.02] text-left"
                >
                  <div
                    className="h-40 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url(${level.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1614] via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="inline-block bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-display font-bold px-2 py-0.5 rounded mb-1">
                      {level.targets.length} Target · +80 XP
                    </span>
                    <h3 className="font-display font-bold text-base text-white">{level.motifName}</h3>
                    <p className="text-white/60 text-xs">{level.region}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          /* ─── Game Area ─── */
          <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-4" style={{ minHeight: "calc(100vh - 56px)" }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-base text-white">{selectedLevel.motifName}</h2>
                <p className="text-white/50 text-xs">{selectedLevel.region}</p>
              </div>
              <button
                onClick={() => setSelectedLevel(null)}
                className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Ganti Level
              </button>
            </div>

            <DetektifBoard level={selectedLevel} onComplete={handleComplete} />
          </div>
        )}
      </main>

      {selectedLevel && (
        <WinModal
          open={winData.open}
          motifName={selectedLevel.motifName}
          motifRegion={selectedLevel.region}
          philosophy="Kamu berhasil mengidentifikasi elemen isen-isen dengan tepat. Kemampuan mata detektifmu sangat tajam!"
          image={selectedLevel.image}
          xpEarned={80}
          timeSeconds={winData.clicks * 3}
          onClose={handleCloseWin}
        />
      )}
    </div>
  );
}
