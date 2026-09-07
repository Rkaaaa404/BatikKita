"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion } from "motion/react";
import { RefreshCw, Timer, Target, ChevronLeft } from "lucide-react";
import { GameNavbar } from "@/components/shared/GameNavbar";
import { CapStampingBoard } from "@/components/games/CapStampingBoard";
import { WinModal } from "@/components/games/WinModal";
import { LevelUpModal } from "@/components/shared/LevelUpModal";
import { useXp } from "@/hooks/useXp";
import { useGameTheme } from "@/hooks/useGameTheme";
import { BATIK_DATASET_20, BatikMotif } from "@/data/batikDataset";
import { PuzzleDifficulty } from "@/lib/polyominoPartition";

const DIFFICULTY_XP: Record<PuzzleDifficulty, number> = {
  Mudah: 100,
  Menengah: 150,
  Sulit: 200,
};

export default function CapStampingPage() {
  const [selected, setSelected] = useState<BatikMotif | null>(null);
  const [difficulty, setDifficulty] = useState<PuzzleDifficulty>("Mudah");
  const [gameKey, setGameKey] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [winData, setWinData] = useState<{ open: boolean; time: number }>({ open: false, time: 0 });

  const { addXp, levelUpInfo, dismissLevelUp } = useXp();
  const { isDark } = useGameTheme();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    setElapsed(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleSelect = useCallback(
    (motif: BatikMotif) => {
      setSelected(motif);
      setGameKey((k) => k + 1);
      startTimer();
    },
    [startTimer]
  );

  const handleSolve = useCallback(
    (timeSeconds: number) => {
      stopTimer();
      if (!selected) return;
      const xpReward = DIFFICULTY_XP[difficulty];
      addXp(xpReward);
      setWinData({ open: true, time: timeSeconds });
    },
    [selected, difficulty, addXp, stopTimer]
  );

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
      <GameNavbar title="Batik Cap (Presisi Canting Cap Tembaga)" />

      <main className="pt-14 min-h-screen">
        {!selected ? (
          /* ─── Level & Motif Select ─── */
          <div className="max-w-5xl mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-display font-bold px-4 py-1.5 rounded-full mb-3">
                <Target className="w-3.5 h-3.5" /> TEKNIK CANTING CAP NUSANTARA
              </div>
              <h1
                className={`font-display font-extrabold text-3xl md:text-4xl mb-3 ${
                  isDark ? "text-white" : "text-[#2D2B38]"
                }`}
              >
                Batik Cap
              </h1>
              <p
                className={`font-body max-w-lg mx-auto text-sm ${
                  isDark ? "text-white/60" : "text-stone-600"
                }`}
              >
                Pilih kanvas motif batik favoritmu dan tentukan tingkat kerumitan cap tembaga.
                Semakin tinggi tingkat kesulitan, semakin banyak kepingan yang harus kamu pasang!
              </p>
            </motion.div>

            {/* Difficulty Selector Pills */}
            <div className="flex flex-col items-center gap-2.5 sm:gap-3 mb-8 sm:mb-10 px-2">
              <span className="text-[11px] sm:text-xs font-display font-bold text-[#D4AF37] tracking-wider uppercase text-center">
                PILIH TINGKAT KESULITAN BLOK:
              </span>
              <div
                className={`inline-flex flex-wrap justify-center p-1 sm:p-1.5 rounded-2xl border backdrop-blur-md gap-1.5 sm:gap-2 max-w-full ${
                  isDark ? "bg-black/20 border-white/10" : "bg-stone-100 border-[#E2DDD5] shadow-xs"
                }`}
              >
                {(["Mudah", "Menengah", "Sulit"] as PuzzleDifficulty[]).map((diff) => {
                  const isCur = difficulty === diff;
                  return (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficulty(diff)}
                      className={`px-3.5 sm:px-5 py-2 rounded-xl text-xs font-display font-bold transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 ${
                        isCur
                          ? "bg-[#D4AF37] text-[#1A1614] shadow-md shadow-[#D4AF37]/20 scale-105"
                          : isDark
                          ? "text-white/70 hover:text-white hover:bg-white/5"
                          : "text-stone-700 hover:text-stone-900 hover:bg-white"
                      }`}
                    >
                      <span>{diff}</span>
                      <span
                        className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full ${
                          isCur
                            ? "bg-black/20 text-[#1A1614]"
                            : isDark
                            ? "bg-white/10 text-white/60"
                            : "bg-stone-200 text-stone-700"
                        }`}
                      >
                        +{DIFFICULTY_XP[diff]} XP
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className={`text-[11px] sm:text-xs text-center max-w-md ${isDark ? "text-white/60" : "text-stone-600"}`}>
                {difficulty === "Mudah" && "5–6 kepingan presisi. Pilihan ideal untuk pemula."}
                {difficulty === "Menengah" && "8–10 kepingan terukur. Menuntut ketelitian dan fokus."}
                {difficulty === "Sulit" && "12–15 kepingan canting detail. Tantangan deduksi Empu sejati!"}
              </p>
            </div>

            {/* Motifs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
              {BATIK_DATASET_20.map((motif, i) => (
                <motion.button
                  key={motif.id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => handleSelect(motif)}
                  className={`group relative rounded-2xl overflow-hidden border transition-all hover:scale-[1.02] text-left cursor-pointer ${
                    isDark
                      ? "border-white/10 hover:border-[#D4AF37]/60 bg-[#25201C]"
                      : "border-[#E2DDD5] hover:border-[#D4AF37] bg-white shadow-sm"
                  }`}
                >
                  <div
                    className="h-36 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url(${motif.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3.5">
                    <span className="inline-block bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-display font-bold px-2 py-0.5 rounded mb-1">
                      {motif.region}
                    </span>
                    <h3 className="font-display font-bold text-sm text-white truncate">
                      {motif.fullName}
                    </h3>
                    <p className="text-white/70 text-[11px] truncate">{motif.category}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          /* ─── Game Area ─── */
          <div className="max-w-2xl mx-auto px-4 py-6">
            {/* Header with Back to Motif Selection & Difficulty Info */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    stopTimer();
                    setSelected(null);
                  }}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white/70 hover:text-white"
                      : "bg-white border-[#E2DDD5] text-stone-700 hover:text-stone-900 shadow-xs"
                  }`}
                  title="Pilih Motif Lain"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div>
                  <h2
                    className={`font-display font-bold text-lg leading-tight ${
                      isDark ? "text-white" : "text-[#2D2B38]"
                    }`}
                  >
                    {selected.fullName}
                  </h2>
                  <p
                    className={`text-xs ${
                      isDark ? "text-white/50" : "text-stone-500"
                    }`}
                  >
                    {selected.region} · Tingkat:{" "}
                    <span className="text-[#D4AF37] font-bold">{difficulty}</span> (+
                    {DIFFICULTY_XP[difficulty]} XP)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
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
                      ? "text-white/70 hover:text-white border-white/10 hover:border-white/20 bg-white/5"
                      : "text-stone-600 hover:text-stone-900 border-[#E2DDD5] hover:border-stone-400 bg-white shadow-xs"
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Acak Ulang Grid
                </button>
              </div>
            </div>

            <CapStampingBoard
              key={`${gameKey}-${difficulty}`}
              motifId={selected.id}
              motifName={selected.fullName}
              image={selected.image}
              philosophy={selected.philosophy}
              difficulty={difficulty}
              onSolve={handleSolve}
            />
          </div>
        )}
      </main>

      {/* Win Modal */}
      {selected && (
        <WinModal
          open={winData.open}
          motifName={selected.fullName}
          motifRegion={selected.region}
          philosophy={selected.philosophy}
          image={selected.image}
          xpEarned={DIFFICULTY_XP[difficulty]}
          timeSeconds={winData.time}
          onClose={handleCloseWin}
        />
      )}

      {/* Level Up Celebration Modal */}
      <LevelUpModal
        open={levelUpInfo.show}
        newRank={levelUpInfo.newRank}
        previousRank={levelUpInfo.previousRank}
        onClose={dismissLevelUp}
      />
    </div>
  );
}
