"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import Fuse from "fuse.js";
import confetti from "canvas-confetti";
import {
  Search,
  ZoomIn,
  Check,
  X,
  FastForward,
  RotateCcw,
  Trophy,
  Share2,
  Volume2,
  VolumeX,
  Compass,
  ArrowRight,
  Info,
  Calendar,
  Layers,
  MapPin,
} from "lucide-react";
import { GameNavbar } from "@/components/shared/GameNavbar";
import { LevelUpModal } from "@/components/shared/LevelUpModal";
import { useXp } from "@/hooks/useXp";
import { useGameTheme } from "@/hooks/useGameTheme";
import {
  TikaMotif,
  TIKA_CATALOG,
  getDailyTikaMotif,
  getRandomTikaMotif,
} from "@/data/batikDataset";
import { sfx } from "@/lib/soundEffects";

// ── Tahapan Zoom Sesuai PRD (Progressive Reveal Engine) ───────────────────────
const ZOOM_STAGES = [
  { stage: 1, scale: 8.0, points: 1000, label: "Zoom 800% (Tekstur Mikro)" },
  { stage: 2, scale: 4.0, points: 750, label: "Zoom 400% (Kontur Bentuk)" },
  { stage: 3, scale: 2.0, points: 500, label: "Zoom 200% (Unit Motif)" },
  { stage: 4, scale: 1.0, points: 250, label: "Zoom 100% (Pola Utuh)" },
];

const MAX_STAGES = ZOOM_STAGES.length;

interface GuessRecord {
  stage: number;
  type: "guess" | "pass";
  guessName?: string;
  isCorrect?: boolean;
}

export default function TikaGamePage() {
  const { addXp, unlockMotif, levelUpInfo, dismissLevelUp } = useXp();
  const { isDark } = useGameTheme();

  // Mode: Harian (Daily) atau Bebas (Endless)
  const [gameMode, setGameMode] = useState<"daily" | "endless">("daily");
  const [currentMotif, setCurrentMotif] = useState<TikaMotif>(() => getDailyTikaMotif());
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [guesses, setGuesses] = useState<GuessRecord[]>([]);
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing");
  const [earnedScore, setEarnedScore] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);

  // Search input & dropdown
  const [inputValue, setInputValue] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<TikaMotif | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [soundOn, setSoundOn] = useState(true);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Fuse.js client-side search engine
  const fuse = useMemo(() => {
    return new Fuse(TIKA_CATALOG, {
      keys: [
        { name: "batik_name", weight: 0.5 },
        { name: "normalized_name", weight: 0.3 },
        { name: "aliases", weight: 0.2 },
      ],
      threshold: 0.38,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }, []);

  // Filtered dropdown results
  const searchResults = useMemo(() => {
    const trimmed = inputValue.trim();
    if (trimmed.length < 2) return [];
    return fuse.search(trimmed).map((res) => res.item).slice(0, 6);
  }, [inputValue, fuse]);

  // Restart / Switch motif
  const startNewGame = useCallback((mode: "daily" | "endless", nextMotif?: TikaMotif) => {
    setGameMode(mode);
    const motif = nextMotif || (mode === "daily" ? getDailyTikaMotif() : getRandomTikaMotif());
    setCurrentMotif(motif);
    setCurrentStageIdx(0);
    setGuesses([]);
    setGameStatus("playing");
    setEarnedScore(0);
    setEarnedXp(0);
    setInputValue("");
    setSelectedCandidate(null);
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
    sfx.playSnap();
  }, []);

  // Toggle sound
  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    sfx.enabled = next;
  };

  // Submit Guess
  const handleSubmitGuess = () => {
    if (gameStatus !== "playing") return;
    if (!selectedCandidate) return;

    const isMatch = selectedCandidate.id === currentMotif.id;
    const currentStageData = ZOOM_STAGES[currentStageIdx];

    if (isMatch) {
      // MENANG
      const finalPoints = currentStageData.points;
      const xpPoints = Math.round(finalPoints / 10);
      setGuesses((prev) => [
        ...prev,
        {
          stage: currentStageIdx + 1,
          type: "guess",
          guessName: selectedCandidate.batik_name,
          isCorrect: true,
        },
      ]);
      setEarnedScore(finalPoints);
      setEarnedXp(xpPoints);
      setGameStatus("won");
      addXp(xpPoints);
      unlockMotif(currentMotif.id);
      sfx.playWin();

      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#D4AF37", "#10B981", "#3B82F6", "#F59E0B"],
        });
      } catch {
        // Confetti fallback
      }
    } else {
      // SALAH
      sfx.playWrong();
      const nextGuesses: GuessRecord[] = [
        ...guesses,
        {
          stage: currentStageIdx + 1,
          type: "guess",
          guessName: selectedCandidate.batik_name,
          isCorrect: false,
        },
      ];
      setGuesses(nextGuesses);
      setInputValue("");
      setSelectedCandidate(null);

      if (currentStageIdx + 1 >= MAX_STAGES) {
        // Kesempatan habis -> KALAH
        setGameStatus("lost");
      } else {
        // Zoom out ke tahap berikutnya
        setCurrentStageIdx((prev) => prev + 1);
      }
    }
  };

  // Pass / Skip zoom stage
  const handlePassStage = () => {
    if (gameStatus !== "playing") return;
    sfx.playSnap();

    const nextGuesses: GuessRecord[] = [
      ...guesses,
      {
        stage: currentStageIdx + 1,
        type: "pass",
      },
    ];
    setGuesses(nextGuesses);
    setInputValue("");
    setSelectedCandidate(null);

    if (currentStageIdx + 1 >= MAX_STAGES) {
      setGameStatus("lost");
      sfx.playWrong();
    } else {
      setCurrentStageIdx((prev) => prev + 1);
    }
  };

  // Select candidate from dropdown
  const handleSelectCandidate = (motif: TikaMotif) => {
    setSelectedCandidate(motif);
    setInputValue(motif.batik_name);
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  // Keyboard navigation for dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen || searchResults.length === 0) {
      if (e.key === "Enter" && selectedCandidate) {
        e.preventDefault();
        handleSubmitGuess();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < searchResults.length) {
        handleSelectCandidate(searchResults[highlightedIndex]);
      } else if (selectedCandidate) {
        handleSubmitGuess();
      }
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Wordle-style summary share
  const handleShareResult = () => {
    const stageSquares = ZOOM_STAGES.map((s, idx) => {
      const g = guesses.find((record) => record.stage === idx + 1);
      if (!g) return "⬛";
      if (g.isCorrect) return "🟩";
      if (g.type === "pass") return "🟧";
      return "🟥";
    }).join("");

    const shareText = [
      `Batik Zoom: Observasi Makro Nusantara`,
      `Mode: ${gameMode === "daily" ? "Tantangan Harian" : "Latihan Bebas"}`,
      `Hasil: ${gameStatus === "won" ? `Menang (+${earnedScore} Poin)` : "Belum Berhasil"} (${guesses.length}/${MAX_STAGES})`,
      stageSquares,
      `Mainkan sekarang: https://batikkita.id/play/zoom`,
    ].join("\n");

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopyFeedback(true);
      sfx.playChime();
      setTimeout(() => setCopyFeedback(false), 2500);
    }
  };

  const currentStageInfo = ZOOM_STAGES[currentStageIdx];
  const activeScale = gameStatus !== "playing" ? 1.0 : currentStageInfo.scale;

  return (
    <div
      className={`min-h-screen flex flex-col font-body selection:bg-[#D4AF37] selection:text-[#1A1614] overflow-x-hidden transition-colors duration-200 ${
        isDark ? "bg-[#141211] text-white" : "bg-[#FAF8F4] text-[#2D2B38]"
      }`}
    >
      <GameNavbar title="Batik Zoom (Observasi Visual Makro)" />

      <main className="pt-16 sm:pt-20 pb-12 flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 sm:px-6 gap-4">
        {/* ── Top Bar: Mode Switcher & Stats ── */}
        <div
          className={`flex items-center justify-between gap-3 border rounded-2xl px-4 py-2.5 shadow-lg transition-colors ${
            isDark
              ? "bg-[#1A1816] border-white/10 text-white"
              : "bg-white/95 border-[#E2DDD5] text-[#2D2B38] shadow-sm"
          }`}
        >
          {/* Mode Pill Switcher */}
          <div
            className={`flex items-center gap-1 p-1 rounded-xl border ${
              isDark ? "bg-black/40 border-white/10" : "bg-stone-100 border-[#E2DDD5]"
            }`}
          >
            <button
              type="button"
              onClick={() => startNewGame("daily")}
              className={`text-xs font-display font-bold px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                gameMode === "daily"
                  ? "bg-[#D4AF37] text-[#1A1614] shadow-md"
                  : isDark
                  ? "text-white/60 hover:text-white"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Harian</span>
            </button>
            <button
              type="button"
              onClick={() => startNewGame("endless")}
              className={`text-xs font-display font-bold px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                gameMode === "endless"
                  ? "bg-[#D4AF37] text-[#1A1614] shadow-md"
                  : isDark
                  ? "text-white/60 hover:text-white"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Latihan</span>
            </button>
          </div>

          {/* Current Potential Points & Sound */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span
                className={`text-[10px] uppercase font-display font-bold block leading-tight ${
                  isDark ? "text-white/40" : "text-stone-500"
                }`}
              >
                Potensi Poin
              </span>
              <span className="text-xs sm:text-sm font-display font-extrabold text-[#D4AF37]">
                {gameStatus === "playing" ? `+${currentStageInfo.points}` : `+${earnedScore}`}
              </span>
            </div>

            <button
              type="button"
              onClick={handleToggleSound}
              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                isDark
                  ? "bg-white/5 border-white/10 text-white/70 hover:text-white"
                  : "bg-stone-100 border-[#E2DDD5] text-stone-600 hover:text-stone-900"
              }`}
              title={soundOn ? "Matikan Suara" : "Nyalakan Suara"}
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ── Attempt Progress Indicator (Wordle Style) ── */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          {ZOOM_STAGES.map((stg, idx) => {
            const guess = guesses.find((g) => g.stage === idx + 1);
            const isCurrent = idx === currentStageIdx && gameStatus === "playing";

            let bgStyle = isDark
              ? "bg-white/5 border-white/10 text-white/40"
              : "bg-white border-[#E2DDD5] text-stone-500 shadow-xs";
            let statusText = `+${stg.points}`;

            if (guess?.isCorrect) {
              bgStyle = isDark
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold"
                : "bg-emerald-100 border-emerald-400 text-emerald-800 font-bold";
              statusText = "Benar";
            } else if (guess?.type === "guess" && !guess.isCorrect) {
              bgStyle = isDark
                ? "bg-red-500/20 border-red-500/50 text-red-300"
                : "bg-red-100 border-red-400 text-red-800";
              statusText = "Salah";
            } else if (guess?.type === "pass") {
              bgStyle = isDark
                ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                : "bg-amber-100 border-amber-400 text-amber-800";
              statusText = "Lewat";
            } else if (isCurrent) {
              bgStyle = isDark
                ? "bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37] ring-2 ring-[#D4AF37]/40 shadow-lg shadow-[#D4AF37]/20"
                : "bg-amber-50 border-[#D4AF37] text-[#9a781b] ring-2 ring-[#D4AF37]/40 shadow-sm font-bold";
            }

            return (
              <div
                key={stg.stage}
                className={`rounded-xl border p-1.5 sm:p-2 flex flex-col items-center justify-center transition-all ${bgStyle}`}
              >
                <span className="text-[9px] sm:text-[10px] font-display font-semibold uppercase tracking-wider">
                  Tahap {stg.stage}
                </span>
                <span className="text-[11px] sm:text-xs font-display font-bold mt-0.5">{statusText}</span>
              </div>
            );
          })}
        </div>

        {/* ── Progressive Reveal Viewport (Zoom Engine) ── */}
        <div className="w-full max-w-[340px] sm:max-w-[420px] aspect-square mx-auto rounded-3xl overflow-hidden relative border-4 border-[#D4AF37]/30 shadow-2xl bg-[#1A1816]">
          {/* Zoom Overlay Badges */}
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 flex items-center gap-1.5 bg-[#0F172A]/90 backdrop-blur-md border border-white/20 px-2 sm:px-2.5 py-1 rounded-xl shadow-lg">
            <ZoomIn className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[11px] sm:text-xs font-display font-extrabold text-white">
              {gameStatus === "playing" ? `${Math.round(activeScale * 100)}% Makro` : "100% Utuh"}
            </span>
          </div>

          <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 bg-[#0F172A]/90 backdrop-blur-md border border-white/20 px-2 sm:px-2.5 py-1 rounded-xl shadow-lg">
            <span className="text-[10px] sm:text-[11px] font-display font-bold text-white/70">
              Sisa: <strong className="text-[#D4AF37]">{gameStatus === "playing" ? MAX_STAGES - currentStageIdx : 0}</strong>
            </span>
          </div>

          {/* Smooth Zoom Transformed Container */}
          <div
            className="w-full h-full relative"
            style={{
              transformOrigin: `${currentMotif.focus_point.x * 100}% ${currentMotif.focus_point.y * 100}%`,
              transform: `scale(${activeScale})`,
              transition: "transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
          >
            <Image
              src={currentMotif.image_url}
              alt="Misteri Motif Batik"
              fill
              priority
              sizes="(max-width: 640px) 100vw, 420px"
              className="object-cover select-none pointer-events-none"
            />
          </div>

          {/* Crosshair / Macro focus guide at Stage 1 */}
          {gameStatus === "playing" && currentStageIdx === 0 && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border border-[#D4AF37]/50 animate-pulse flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              </div>
            </div>
          )}
        </div>

        {/* ── Input & Guess Actions ── */}
        {gameStatus === "playing" && (
          <div className="space-y-3">
            {/* Autocomplete Input Container */}
            <div className="relative">
              <div
                className={`flex items-center border-2 rounded-2xl px-3.5 py-2 transition-all shadow-lg ${
                  isDark
                    ? "bg-[#1A1816] border-white/15 focus-within:border-[#D4AF37]"
                    : "bg-white border-[#E2DDD5] focus-within:border-[#D4AF37] shadow-sm"
                }`}
              >
                <Search
                  className={`w-4 h-4 mr-2 shrink-0 ${
                    isDark ? "text-white/40" : "text-stone-400"
                  }`}
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setSelectedCandidate(null);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ketik minimal 2 huruf nama motif (misal: Kawung)..."
                  className={`w-full bg-transparent text-sm font-display font-medium focus:outline-none ${
                    isDark
                      ? "text-white placeholder:text-white/30"
                      : "text-stone-900 placeholder:text-stone-400"
                  }`}
                />
                {inputValue && (
                  <button
                    type="button"
                    onClick={() => {
                      setInputValue("");
                      setSelectedCandidate(null);
                      inputRef.current?.focus();
                    }}
                    className={`p-1 cursor-pointer ${
                      isDark ? "text-white/40 hover:text-white" : "text-stone-400 hover:text-stone-700"
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Autocomplete Suggestions Dropdown */}
              <AnimatePresence>
                {isDropdownOpen && searchResults.length > 0 && (
                  <motion.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className={`absolute left-0 right-0 bottom-full mb-2 border-2 border-[#D4AF37]/40 rounded-2xl overflow-hidden shadow-2xl z-30 max-h-60 overflow-y-auto divide-y ${
                      isDark
                        ? "bg-[#1A1816] divide-white/5 text-white"
                        : "bg-white divide-stone-100 text-stone-900"
                    }`}
                  >
                    <div
                      className={`px-3 py-1.5 text-[10px] font-display font-bold uppercase tracking-wider text-[#D4AF37] ${
                        isDark ? "bg-black/40" : "bg-stone-50"
                      }`}
                    >
                      Pilih Nama Motif dari Katalog:
                    </div>
                    {searchResults.map((item, idx) => {
                      const isHighlighted = idx === highlightedIndex;
                      const isSelected = selectedCandidate?.id === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectCandidate(item)}
                          className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-[#D4AF37] text-[#1A1614]"
                              : isHighlighted
                              ? isDark
                                ? "bg-white/10 text-white"
                                : "bg-stone-100 text-stone-900"
                              : isDark
                              ? "hover:bg-white/5 text-white/90"
                              : "hover:bg-stone-50 text-stone-800"
                          }`}
                        >
                          <div>
                            <p className="text-xs sm:text-sm font-display font-bold">
                              {item.batik_name}
                            </p>
                            <p
                              className={`text-[11px] font-body ${
                                isSelected
                                  ? "text-[#1A1614]/70"
                                  : isDark
                                  ? "text-white/50"
                                  : "text-stone-500"
                              }`}
                            >
                              {item.origin} • {item.category}
                            </p>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#1A1614] stroke-[3]" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handlePassStage}
                className={`w-full flex items-center justify-center gap-2 border font-display font-bold py-3 px-4 rounded-xl transition-all cursor-pointer text-xs sm:text-sm ${
                  isDark
                    ? "border-white/15 bg-white/5 hover:bg-white/10 text-white hover:border-white/30"
                    : "border-[#E2DDD5] bg-white hover:bg-stone-100 text-stone-800 shadow-sm"
                }`}
              >
                <FastForward className="w-4 h-4 text-[#D4AF37]" />
                <span>Lewati (Zoom Out)</span>
              </button>

              <button
                type="button"
                onClick={handleSubmitGuess}
                disabled={!selectedCandidate}
                className={`w-full flex items-center justify-center gap-2 font-display font-extrabold py-3 px-4 rounded-xl transition-all text-xs sm:text-sm ${
                  selectedCandidate
                    ? "bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#D4AF37] text-[#1A1614] hover:brightness-105 shadow-lg shadow-[#D4AF37]/25 border border-[#D4AF37]/40 cursor-pointer"
                    : isDark
                    ? "bg-white/5 text-white/30 border border-white/5 cursor-not-allowed"
                    : "bg-stone-200 text-stone-400 border border-stone-200 cursor-not-allowed"
                }`}
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Tebak Motif</span>
              </button>
            </div>
          </div>
        )}

        {/* ── Guess History Chips ── */}
        {guesses.length > 0 && (
          <div
            className={`border rounded-2xl p-3 space-y-2 transition-colors ${
              isDark
                ? "bg-[#1A1816] border-white/10 text-white"
                : "bg-white border-[#E2DDD5] text-stone-900 shadow-sm"
            }`}
          >
            <span
              className={`text-[10px] font-display font-bold uppercase tracking-wider block ${
                isDark ? "text-white/40" : "text-stone-500"
              }`}
            >
              Riwayat Percobaan:
            </span>
            <div className="space-y-1.5">
              {guesses.map((rec, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between text-xs px-3 py-1.5 rounded-lg border ${
                    isDark
                      ? "bg-black/30 border-white/5"
                      : "bg-stone-50 border-[#E2DDD5]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-display font-semibold ${
                        isDark ? "text-white/40" : "text-stone-500"
                      }`}
                    >
                      #{rec.stage}
                    </span>
                    {rec.type === "pass" ? (
                      <span className="text-amber-500 font-display font-medium">
                        Dilewati (Zoom diperlebar)
                      </span>
                    ) : (
                      <span
                        className={
                          rec.isCorrect
                            ? "text-emerald-600 dark:text-emerald-300 font-bold"
                            : isDark
                            ? "text-white/80"
                            : "text-stone-800"
                        }
                      >
                        {rec.guessName}
                      </span>
                    )}
                  </div>
                  <div>
                    {rec.isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                        <Check className="w-3.5 h-3.5 stroke-[3]" /> Benar
                      </span>
                    ) : rec.type === "pass" ? (
                      <span className="inline-flex items-center gap-1 text-amber-500 text-[11px]">
                        <FastForward className="w-3 h-3" /> Pas
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-500 text-[11px]">
                        <X className="w-3.5 h-3.5" /> Salah
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── End Game Modal (Won / Lost) ── */}
        <AnimatePresence>
          {gameStatus !== "playing" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`border-2 border-[#D4AF37]/50 rounded-3xl p-5 sm:p-6 shadow-2xl text-center space-y-4 transition-colors ${
                isDark ? "bg-[#1A1816] text-white" : "bg-white text-stone-900 shadow-md"
              }`}
            >
              {/* Outcome Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-display font-extrabold uppercase tracking-wider bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]">
                <Trophy className="w-3.5 h-3.5" />
                <span>{gameStatus === "won" ? "Tebakan Tepat!" : "Kesempatan Habis"}</span>
              </div>

              <div>
                <h2
                  className={`text-2xl sm:text-3xl font-display font-extrabold ${
                    isDark ? "text-white" : "text-stone-900"
                  }`}
                >
                  {currentMotif.batik_name}
                </h2>
                <p
                  className={`text-xs sm:text-sm font-body mt-1 flex items-center justify-center gap-1.5 ${
                    isDark ? "text-white/60" : "text-stone-600"
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>
                    {currentMotif.origin} • {currentMotif.category}
                  </span>
                </p>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                <div
                  className={`border rounded-xl p-3 ${
                    isDark ? "bg-white/5 border-white/10" : "bg-stone-50 border-[#E2DDD5]"
                  }`}
                >
                  <p
                    className={`text-[10px] font-body uppercase ${
                      isDark ? "text-white/40" : "text-stone-500"
                    }`}
                  >
                    Total Skor
                  </p>
                  <p className="text-xl font-display font-extrabold text-[#D4AF37]">
                    {earnedScore} Poin
                  </p>
                </div>
                <div
                  className={`border rounded-xl p-3 ${
                    isDark ? "bg-white/5 border-white/10" : "bg-stone-50 border-[#E2DDD5]"
                  }`}
                >
                  <p
                    className={`text-[10px] font-body uppercase ${
                      isDark ? "text-white/40" : "text-stone-500"
                    }`}
                  >
                    XP Diperoleh
                  </p>
                  <p className="text-xl font-display font-extrabold text-emerald-600 dark:text-emerald-400">
                    +{earnedXp} XP
                  </p>
                </div>
              </div>

              {/* Cultural Philosophy Callout */}
              <div
                className={`border rounded-2xl p-4 text-left space-y-1.5 text-xs ${
                  isDark
                    ? "bg-black/30 border-white/10 text-white/70"
                    : "bg-stone-50 border-[#E2DDD5] text-stone-700"
                }`}
              >
                <p
                  className={`font-display font-bold flex items-center gap-1.5 text-xs ${
                    isDark ? "text-white" : "text-stone-900"
                  }`}
                >
                  <Info className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Filosofi & Makna Motif:
                </p>
                <p className="font-narrative leading-relaxed">
                  {currentMotif.description}
                </p>
              </div>

              {/* Actions: Share & Next Game */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleShareResult}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#D4AF37] text-[#1A1614] font-display font-bold py-3 px-4 rounded-xl hover:brightness-105 transition-all shadow-md shadow-[#D4AF37]/20 border border-[#D4AF37] cursor-pointer text-xs sm:text-sm"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copyFeedback ? "Tersalin ke Clipboard!" : "Bagikan Hasil"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => startNewGame("endless", getRandomTikaMotif(currentMotif.id))}
                  className={`flex-1 flex items-center justify-center gap-2 border font-display font-bold py-3 px-4 rounded-xl transition-all cursor-pointer text-xs sm:text-sm ${
                    isDark
                      ? "border-white/15 bg-white/5 hover:bg-white/10 text-white hover:border-white/30"
                      : "border-[#E2DDD5] bg-stone-100 hover:bg-stone-200 text-stone-800"
                  }`}
                >
                  <RotateCcw className="w-4 h-4 text-[#D4AF37]" />
                  <span>Main Lagi (Motif Lain)</span>
                </button>
              </div>

              <div className="pt-1 flex items-center justify-between">
                <Link
                  href="/play"
                  className={`text-xs transition-colors inline-flex items-center gap-1 font-display ${
                    isDark ? "text-white/50 hover:text-white" : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  <span>Kembali ke Arcade</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/collection"
                  className="text-xs text-[#D4AF37] hover:underline font-display font-semibold inline-flex items-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Lihat Album Koleksi</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <LevelUpModal
        open={levelUpInfo.show}
        newRank={levelUpInfo.newRank}
        previousRank={levelUpInfo.previousRank}
        onClose={dismissLevelUp}
      />
    </div>
  );
}
