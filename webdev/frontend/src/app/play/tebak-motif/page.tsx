"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Lightbulb,
  RotateCcw,
  Trophy,
  Sparkles,
  Volume2,
  VolumeX,
  HelpCircle,
  Flame,
  Search,
  ZoomIn,
  Eye,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";
import confetti from "canvas-confetti";
import Image from "next/image";
import Link from "next/link";
import { GameNavbar } from "@/components/shared/GameNavbar";
import { useXp } from "@/hooks/useXp";
import { useGameTheme } from "@/hooks/useGameTheme";

// ── Web Audio Sound Synthesizer (No external audio files needed) ─────────────
class SoundEffects {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playChime() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Ignore audio failure
    }
  }

  playWin() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
      });
    } catch {
      // Ignore
    }
  }

  playWrong() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.linearRampToValueAtTime(140, now + 0.25);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    } catch {
      // Ignore
    }
  }
}

const sfx = new SoundEffects();

// ── Data Motif Pool (Menggunakan 20 Dataset Resmi) ───────────────────────────
import { BATIK_DATASET_20, ALL_20_MOTIF_NAMES, type BatikMotif } from "@/data/batikDataset";

const MOTIF_POOL = BATIK_DATASET_20;
const ALL_MOTIF_NAMES = ALL_20_MOTIF_NAMES;
const XP_PER_HINT: Record<number, number> = { 1: 100, 2: 75, 3: 50, 4: 25 };

type GameState = "idle" | "playing" | "round-complete";

export default function TebakMotifPage() {
  const { addXp } = useXp();
  const { isDark } = useGameTheme();
  const [gameState, setGameState] = useState<GameState>("idle");
  const [currentMotif, setCurrentMotif] = useState<BatikMotif | null>(null);
  const [revealedHints, setRevealedHints] = useState<number>(1);
  const [roundCount, setRoundCount] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);
  const [usedMotifIds, setUsedMotifIds] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);

  // Input modes: "choices" (interactive cards) or "type" (manual mastery)
  const [inputMode, setInputMode] = useState<"choices" | "type">("choices");
  const [choices, setChoices] = useState<string[]>([]);
  const [disabledChoices, setDisabledChoices] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [wrongAttempt, setWrongAttempt] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  // Lifelines
  const [used5050, setUsed5050] = useState(false);

  // Interactive Loupe (Kaca Pembesar) state
  const [lensPos, setLensPos] = useState<{ x: number; y: number; active: boolean }>({
    x: 50,
    y: 50,
    active: false,
  });

  const clothContainerRef = useRef<HTMLDivElement>(null);

  // Generate 4 plausible choices for multiple choice mode
  const generateChoices = useCallback((correctName: string) => {
    const others = ALL_MOTIF_NAMES.filter((n) => n !== correctName);
    // Shuffle others and take 3
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
    const combined = [correctName, ...shuffledOthers].sort(() => 0.5 - Math.random());
    setChoices(combined);
    setDisabledChoices([]);
    setUsed5050(false);
  }, []);

  const pickNewMotif = useCallback(() => {
    const available = MOTIF_POOL.filter((m) => !usedMotifIds.includes(m.id));
    const pool = available.length > 0 ? available : MOTIF_POOL;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    setCurrentMotif(chosen);
    setRevealedHints(1);
    setQuery("");
    setSuggestions([]);
    setWrongAttempt(false);
    generateChoices(chosen.name);
    setGameState("playing");

    if (available.length === 0) setUsedMotifIds([chosen.id]);
    else setUsedMotifIds((prev) => [...prev, chosen.id]);
  }, [usedMotifIds, generateChoices]);

  const startGame = useCallback(() => {
    setRoundCount(0);
    setTotalXp(0);
    setStreak(0);
    setUsedMotifIds([]);
    const chosen = MOTIF_POOL[Math.floor(Math.random() * MOTIF_POOL.length)];
    setCurrentMotif(chosen);
    setRevealedHints(1);
    setQuery("");
    setSuggestions([]);
    setWrongAttempt(false);
    generateChoices(chosen.name);
    setGameState("playing");
    setUsedMotifIds([chosen.id]);
    sfx.playChime();
  }, [generateChoices]);

  // Handle Interactive Loupe / Magnifier mouse move
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!clothContainerRef.current) return;
    const rect = clothContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)), active: true });
  };

  const handlePointerLeave = () => {
    setLensPos((prev) => ({ ...prev, active: false }));
  };

  const submitAnswer = useCallback(
    (answer: string) => {
      if (!currentMotif || gameState !== "playing") return;
      setShowSuggestions(false);
      const isCorrect = answer.toLowerCase().trim() === currentMotif.name.toLowerCase().trim();

      if (isCorrect) {
        sfx.playWin();
        const baseScore = XP_PER_HINT[revealedHints] ?? 25;
        const masteryBonus = inputMode === "type" ? 20 : 0;
        const totalEarned = baseScore + masteryBonus;

        setEarnedXp(totalEarned);
        setTotalXp((prev) => prev + totalEarned);
        setStreak((prev) => prev + 1);
        addXp(totalEarned);

        // Confetti celebration
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#D4AF37", "#10B981", "#ffffff", "#713f2c"],
        });

        setGameState("round-complete");
        setRoundCount((prev) => prev + 1);
      } else {
        sfx.playWrong();
        setWrongAttempt(true);
        setStreak(0);
        setTimeout(() => setWrongAttempt(false), 600);

        // Disable this incorrect choice
        setDisabledChoices((prev) => [...prev, answer]);

        // If wrong on the last hint, auto complete round with minimum points
        if (revealedHints >= 4) {
          setTimeout(() => {
            const xp = 15;
            setEarnedXp(xp);
            setTotalXp((prev) => prev + xp);
            addXp(xp);
            setGameState("round-complete");
            setRoundCount((prev) => prev + 1);
          }, 800);
        }
      }
    },
    [currentMotif, gameState, revealedHints, inputMode, addXp]
  );

  const revealNextHint = () => {
    if (revealedHints < 4) {
      setRevealedHints((prev) => prev + 1);
      sfx.playChime();
    } else {
      // Auto-reveal
      const xp = 15;
      setEarnedXp(xp);
      setTotalXp((prev) => prev + xp);
      addXp(xp);
      setGameState("round-complete");
      setRoundCount((prev) => prev + 1);
    }
  };

  // 50:50 Lifeline
  const useLifeline5050 = () => {
    if (!currentMotif || used5050 || choices.length < 4) return;
    const wrongOptions = choices.filter((c) => c !== currentMotif.name);
    // pick 2 to disable
    const toDisable = wrongOptions.slice(0, 2);
    setDisabledChoices((prev) => [...prev, ...toDisable]);
    setUsed5050(true);
    sfx.playChime();
  };

  const potentialScore = (XP_PER_HINT[revealedHints] ?? 25) + (inputMode === "type" ? 20 : 0);
  const potentialPercent = ((XP_PER_HINT[revealedHints] ?? 25) / 100) * 100;

  const hints = currentMotif ? currentMotif.hints : [];

  // Blur level depending on hints revealed
  const getBlurClass = () => {
    switch (revealedHints) {
      case 1:
        return "blur-2xl scale-110";
      case 2:
        return "blur-lg scale-105";
      case 3:
        return "blur-sm scale-102";
      case 4:
      default:
        return "blur-none scale-100";
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-body selection:bg-[#D4AF37] selection:text-[#1A1614] transition-colors duration-200 ${
        isDark ? "bg-[#141211] text-white" : "bg-[#FAF8F4] text-[#2D2B38]"
      }`}
    >
      {/* Top Bar with back link and XP */}
      <GameNavbar title="Tebak Motif Berjenjang" />

      <main className="flex-1 pt-20 pb-12 px-4 sm:px-6 max-w-5xl mx-auto w-full flex flex-col">
        {/* Audio Toggle & Streak Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const nextState = !soundOn;
                setSoundOn(nextState);
                sfx.enabled = nextState;
              }}
              className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all border ${
                isDark
                  ? "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border-white/10"
                  : "bg-white hover:bg-stone-100 text-stone-700 hover:text-stone-900 border-[#E2DDD5] shadow-xs"
              }`}
              title="Pengaturan Suara"
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" /> : <VolumeX className="w-3.5 h-3.5 text-red-400" />}
              <span>{soundOn ? "Suara Aktif" : "Bisu"}</span>
            </button>

            {streak > 1 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-1 bg-amber-500/20 border border-amber-500/40 text-amber-500 text-xs font-display font-bold px-3 py-1 rounded-full shadow-sm"
              >
                <Flame className="w-3.5 h-3.5 fill-current text-amber-500 animate-bounce" />
                <span>Streak {streak}x!</span>
              </motion.div>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs font-display">
            <span className={isDark ? "text-white/60" : "text-stone-500"}>
              Ronde: <strong className={isDark ? "text-white" : "text-[#2D2B38]"}>#{roundCount + 1}</strong>
            </span>
            <span className="text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-3 py-1 rounded-full font-bold">
              Total: {totalXp} XP
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* ── 1. IDLE / INTRO SCREEN ── */}
          {gameState === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col items-center justify-center text-center max-w-xl mx-auto py-8"
            >
              {/* Animated Emblem */}
              <div
                className={`relative w-24 h-24 rounded-3xl p-1 flex items-center justify-center mb-6 shadow-2xl border-2 ${
                  isDark
                    ? "bg-gradient-to-br from-[#713f2c] via-[#8d786a] to-[#2d2b38] border-[#D4AF37]/50"
                    : "bg-gradient-to-br from-[#713f2c]/15 via-[#FAF8F4] to-white border-[#D4AF37]/50 shadow-md"
                }`}
              >
                <Brain className="w-12 h-12 text-[#D4AF37] drop-shadow-md animate-pulse" />
                <div className="absolute -top-2 -right-2 bg-[#D4AF37] text-[#1A1614] text-[10px] font-display font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                  INTERAKTIF
                </div>
              </div>

              <div className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-display font-bold px-4 py-1.5 rounded-full mb-4">
                <Sparkles className="w-3.5 h-3.5" /> ARENA UJI PENGETAHUAN BUDAYA
              </div>

              <h1
                className={`font-display font-extrabold text-3xl sm:text-4xl mb-3 tracking-tight ${
                  isDark ? "text-white" : "text-[#2D2B38]"
                }`}
              >
                Tebak Motif Berjenjang
              </h1>

              <p
                className={`font-body text-sm sm:text-base leading-relaxed mb-8 ${
                  isDark ? "text-white/80" : "text-stone-600"
                }`}
              >
                Amati corak kain di pemidangan, gunakan kaca pembesar untuk melihat isen-isen halus, lalu tebak nama motifnya. Petunjuk bertahap akan terbuka bila Anda membutuhkan bantuan.
              </p>

              {/* Point Rules Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mb-8">
                {[
                  { hint: "Petunjuk 1", xp: "+100 XP", desc: "Mata Elang" },
                  { hint: "Petunjuk 2", xp: "+75 XP", desc: "Paham Rumpun" },
                  { hint: "Petunjuk 3", xp: "+50 XP", desc: "Kolektor Sentra" },
                  { hint: "Petunjuk 4", xp: "+25 XP", desc: "Pakar Ciri Visual" },
                ].map((tier, idx) => (
                  <div
                    key={idx}
                    className={`border rounded-xl p-3.5 text-center flex flex-col justify-between transition-colors ${
                      isDark
                        ? "bg-[#1f1a18] border-[#713f2c]/40 hover:border-[#D4AF37]/50"
                        : "bg-white border-[#E2DDD5] hover:border-[#D4AF37]/50 shadow-xs"
                    }`}
                  >
                    <span className={`text-[11px] font-body ${isDark ? "text-white/50" : "text-stone-500"}`}>
                      {tier.hint}
                    </span>
                    <span className="font-display font-extrabold text-base text-[#D4AF37] my-1">
                      {tier.xp}
                    </span>
                    <span className={`text-[10px] font-display ${isDark ? "text-white/70" : "text-stone-600"}`}>
                      {tier.desc}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={startGame}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D4AF37] text-[#1A1614] font-display font-bold text-base px-10 py-4 rounded-xl hover:bg-[#c9a52f] transition-all shadow-xl shadow-[#D4AF37]/20 active:scale-98 cursor-pointer"
              >
                <span>Mulai Tantangan Sekarang</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* ── 2. ACTIVE PLAYING STAGE ── */}
          {gameState === "playing" && currentMotif && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left Column: Mystery Cloth Canvas with Interactive Loupe */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {/* Visual Canvas Card */}
                <div
                  className={`border-2 rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden flex flex-col items-center transition-colors ${
                    isDark
                      ? "bg-[#1f1a18] border-[#713f2c]/50"
                      : "bg-white border-[#E2DDD5] shadow-md"
                  }`}
                >
                  <div
                    className={`w-full flex items-center justify-between text-xs mb-3 px-1 ${
                      isDark ? "text-white/60" : "text-stone-600"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5 text-[#D4AF37] font-display font-bold">
                      <ZoomIn className="w-3.5 h-3.5" /> Kain Misteri Pemidangan
                    </span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full ${
                        isDark ? "bg-white/10 text-white/70" : "bg-stone-100 text-stone-700"
                      }`}
                    >
                      Tingkat Keburaman: {5 - revealedHints}/4
                    </span>
                  </div>

                  {/* Interactive Cloth Container */}
                  <div
                    ref={clothContainerRef}
                    onPointerMove={handlePointerMove}
                    onPointerLeave={handlePointerLeave}
                    className="relative w-full aspect-square rounded-2xl overflow-hidden cursor-crosshair border border-white/15 bg-black select-none group"
                  >
                    {/* Blurred base motif image */}
                    <Image
                      src={currentMotif.image}
                      alt="Kain Misteri"
                      fill
                      className={`object-cover object-center transition-all duration-700 ${getBlurClass()}`}
                      priority
                    />

                    {/* Dark mystery gradient scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                    {/* Interactive Loupe (Kaca Pembesar Budaya) */}
                    {lensPos.active && (
                      <div
                        className="absolute pointer-events-none rounded-full border-2 border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.8)] overflow-hidden z-20"
                        style={{
                          width: "120px",
                          height: "120px",
                          left: `${lensPos.x}%`,
                          top: `${lensPos.y}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        {/* Zoomed clear image slice */}
                        <div
                          className="w-full h-full relative"
                          style={{
                            backgroundImage: `url(${currentMotif.image})`,
                            backgroundPosition: `${lensPos.x}% ${lensPos.y}%`,
                            backgroundSize: "400%",
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                        <span className="absolute bottom-1 right-2 text-[8px] font-display font-extrabold text-[#D4AF37] uppercase tracking-wider">
                          LOUPE 2X
                        </span>
                      </div>
                    )}

                    {/* Tip overlay when not hovering */}
                    {!lensPos.active && (
                      <div className="absolute bottom-3 inset-x-3 bg-black/70 backdrop-blur-sm border border-white/10 rounded-xl py-1.5 px-3 text-center text-[11px] text-white/75 pointer-events-none flex items-center justify-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Arahkan kursor atau sentuh untuk melihat detail isen</span>
                      </div>
                    )}
                  </div>

                  {/* Lifeline Buttons */}
                  <div className="w-full grid grid-cols-2 gap-2.5 mt-4">
                    <button
                      type="button"
                      onClick={useLifeline5050}
                      disabled={used5050 || inputMode !== "choices"}
                      className={`flex items-center justify-center gap-1.5 disabled:opacity-30 border py-2.5 px-3 rounded-xl text-xs font-display font-semibold transition-all cursor-pointer ${
                        isDark
                          ? "bg-white/5 hover:bg-white/10 border-white/10 text-[#D4AF37]"
                          : "bg-white hover:bg-stone-50 border-[#E2DDD5] text-[#713f2c] shadow-xs"
                      }`}
                      title="Eliminasi 2 pilihan jawaban yang salah"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>{used5050 ? "50:50 Terpakai" : "Bantuan 50:50"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={revealNextHint}
                      disabled={revealedHints >= 4}
                      className={`flex items-center justify-center gap-1.5 disabled:opacity-40 border py-2.5 px-3 rounded-xl text-xs font-display font-semibold transition-all cursor-pointer ${
                        isDark
                          ? "bg-[#713f2c]/40 hover:bg-[#713f2c]/70 border-[#D4AF37]/30 text-white"
                          : "bg-[#713f2c] hover:bg-[#583122] border-[#713f2c] text-[#D4AF37] shadow-xs"
                      }`}
                      title="Buka petunjuk teks berikutnya dengan penalti 25 XP"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{revealedHints < 4 ? "Petunjuk (-25 XP)" : "Petunjuk Terakhir"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Progressive Hints & Answer Controls */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                {/* Potential Score Gauge */}
                <div
                  className={`border rounded-2xl p-4 shadow-md transition-colors ${
                    isDark ? "bg-[#1f1a18] border-white/10" : "bg-white border-[#E2DDD5] shadow-xs"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className={`text-xs font-body flex items-center gap-1.5 ${
                        isDark ? "text-white/70" : "text-stone-600"
                      }`}
                    >
                      <Trophy className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Skor Potensial Ronde Ini:
                    </span>
                    <span className="text-sm font-display font-bold text-[#D4AF37]">
                      {potentialScore} XP{" "}
                      {inputMode === "type" && (
                        <span className="text-emerald-500 text-xs">(+20 Bonus)</span>
                      )}
                    </span>
                  </div>
                  <div
                    className={`h-2.5 rounded-full overflow-hidden p-0.5 border ${
                      isDark ? "bg-black/50 border-white/10" : "bg-stone-100 border-[#E2DDD5]"
                    }`}
                  >
                    <motion.div
                      animate={{ width: `${potentialPercent}%` }}
                      transition={{ type: "spring", stiffness: 180, damping: 22 }}
                      className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-amber-300 shadow-sm"
                    />
                  </div>
                </div>

                {/* Progressive Hints Accordion */}
                <div className="space-y-3">
                  <div
                    className={`flex items-center justify-between text-xs px-1 ${
                      isDark ? "text-white/60" : "text-stone-600"
                    }`}
                  >
                    <span className="font-display font-bold uppercase tracking-wider text-[#D4AF37]">
                      Petunjuk Filosofi & Budaya:
                    </span>
                    <span>{revealedHints} dari 4 Terbuka</span>
                  </div>

                  {hints.slice(0, revealedHints).map((hint, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`rounded-2xl border p-4 transition-all shadow-sm ${
                        i === revealedHints - 1
                          ? isDark
                            ? "bg-[#28211e] border-[#D4AF37]/50 ring-1 ring-[#D4AF37]/20"
                            : "bg-[#FAF8F4] border-[#D4AF37]/60 ring-1 ring-[#D4AF37]/30"
                          : isDark
                          ? "bg-[#1b1716] border-white/10 opacity-70"
                          : "bg-white border-[#E2DDD5] opacity-80"
                      }`}
                    >
                      <div className="flex gap-3.5 items-start">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-display font-bold border ${
                            i === revealedHints - 1
                              ? "bg-[#D4AF37] text-[#1A1614] border-[#D4AF37]"
                              : isDark
                              ? "bg-white/10 text-white/70 border-white/15"
                              : "bg-stone-100 text-stone-600 border-[#E2DDD5]"
                          }`}
                        >
                          {i + 1}
                        </div>
                        <p
                          className={`font-narrative text-sm leading-relaxed pt-0.5 ${
                            isDark ? "text-white/90" : "text-[#2D2B38]"
                          }`}
                        >
                          {hint}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Answer Mode Tabs: Multiple Choice vs Type Mastery */}
                <div
                  className={`mt-2 border rounded-2xl p-5 shadow-xl transition-colors ${
                    isDark ? "bg-[#1f1a18] border-white/10" : "bg-white border-[#E2DDD5] shadow-sm"
                  }`}
                >
                  <div
                    className={`flex items-center justify-between pb-3 mb-4 border-b ${
                      isDark ? "border-white/10" : "border-[#E2DDD5]"
                    }`}
                  >
                    <span
                      className={`text-xs font-display font-bold uppercase tracking-wider ${
                        isDark ? "text-white" : "text-[#2D2B38]"
                      }`}
                    >
                      Tebak Nama Motif:
                    </span>
                    <div
                      className={`flex gap-1 p-1 rounded-xl border ${
                        isDark ? "bg-black/40 border-white/10" : "bg-stone-100 border-[#E2DDD5]"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setInputMode("choices")}
                        className={`text-xs px-3 py-1 rounded-lg font-display transition-all cursor-pointer ${
                          inputMode === "choices"
                            ? "bg-[#713f2c] text-[#D4AF37] font-bold shadow-xs"
                            : isDark
                            ? "text-white/60 hover:text-white"
                            : "text-stone-600 hover:text-stone-900"
                        }`}
                      >
                        Pilihan Kartu
                      </button>
                      <button
                        type="button"
                        onClick={() => setInputMode("type")}
                        className={`text-xs px-3 py-1 rounded-lg font-display transition-all cursor-pointer ${
                          inputMode === "type"
                            ? "bg-[#713f2c] text-[#D4AF37] font-bold shadow-xs"
                            : isDark
                            ? "text-white/60 hover:text-white"
                            : "text-stone-600 hover:text-stone-900"
                        }`}
                      >
                        Ketik Bebas (+20 XP)
                      </button>
                    </div>
                  </div>

                  {/* Mode 1: Interactive Choice Cards */}
                  {inputMode === "choices" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {choices.map((choiceName) => {
                        const isDisabled = disabledChoices.includes(choiceName);
                        return (
                          <motion.button
                            key={choiceName}
                            type="button"
                            whileHover={!isDisabled ? { scale: 1.02 } : {}}
                            whileTap={!isDisabled ? { scale: 0.98 } : {}}
                            onClick={() => submitAnswer(choiceName)}
                            disabled={isDisabled}
                            className={`p-4 rounded-xl border text-left font-display font-bold text-sm transition-all flex items-center justify-between group cursor-pointer ${
                              isDisabled
                                ? isDark
                                  ? "bg-black/30 border-white/5 text-white/20 line-through cursor-not-allowed"
                                  : "bg-stone-100 border-[#E2DDD5] text-stone-400 line-through cursor-not-allowed"
                                : wrongAttempt
                                ? "bg-red-950/30 border-red-500/50 text-red-400"
                                : isDark
                                ? "bg-[#28221f] hover:bg-[#713f2c]/50 border-white/15 hover:border-[#D4AF37] text-white shadow-md"
                                : "bg-white hover:bg-stone-50 border-[#E2DDD5] hover:border-[#D4AF37] text-[#2D2B38] shadow-xs"
                            }`}
                          >
                            <span>{choiceName}</span>
                            {!isDisabled && (
                              <ChevronRight className="w-4 h-4 text-[#D4AF37] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  ) : (
                    /* Mode 2: Manual Typing Input with Autocomplete */
                    <div className="relative">
                      <div
                        className={`flex gap-2 rounded-xl border overflow-hidden transition-all ${
                          wrongAttempt
                            ? "border-red-500 ring-2 ring-red-500/30 animate-pulse"
                            : isDark
                            ? "bg-black/40 border-white/20 focus-within:border-[#D4AF37]"
                            : "bg-stone-50 border-[#E2DDD5] focus-within:border-[#D4AF37]"
                        }`}
                      >
                        <input
                          type="text"
                          value={query}
                          onChange={(e) => {
                            const val = e.target.value;
                            setQuery(val);
                            if (val.length > 0) {
                              const filtered = ALL_MOTIF_NAMES.filter((n) =>
                                n.toLowerCase().includes(val.toLowerCase())
                              );
                              setSuggestions(filtered);
                              setShowSuggestions(true);
                            } else {
                              setShowSuggestions(false);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && query.trim()) submitAnswer(query.trim());
                          }}
                          placeholder="Ketik nama motif (contoh: Kawung, Parang, Mega Mendung)..."
                          className={`flex-1 bg-transparent px-4 py-3.5 text-sm focus:outline-hidden ${
                            isDark
                              ? "text-white placeholder-white/40"
                              : "text-[#2D2B38] placeholder-stone-400"
                          }`}
                          autoComplete="off"
                        />
                        <button
                          type="button"
                          onClick={() => query.trim() && submitAnswer(query.trim())}
                          disabled={!query.trim()}
                          className="px-5 bg-[#713f2c] hover:bg-[#583122] disabled:opacity-30 text-[#D4AF37] font-display font-bold text-sm transition-all cursor-pointer"
                        >
                          Kirim
                        </button>
                      </div>

                      {/* Autocomplete Suggestions */}
                      {showSuggestions && suggestions.length > 0 && (
                        <div
                          className={`absolute top-full left-0 right-0 mt-1.5 border rounded-xl overflow-hidden shadow-2xl z-30 ${
                            isDark
                              ? "bg-[#231e1c] border-[#D4AF37]/40"
                              : "bg-white border-[#E2DDD5]"
                          }`}
                        >
                          {suggestions.map((sug) => (
                            <button
                              key={sug}
                              type="button"
                              onClick={() => {
                                setQuery(sug);
                                setShowSuggestions(false);
                                submitAnswer(sug);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-xs transition-colors border-b last:border-none flex items-center justify-between cursor-pointer ${
                                isDark
                                  ? "text-white/90 hover:bg-[#713f2c] hover:text-[#D4AF37] border-white/5"
                                  : "text-[#2D2B38] hover:bg-stone-100 hover:text-[#713f2c] border-[#E2DDD5]"
                              }`}
                            >
                              <span>{sug}</span>
                              <Search className="w-3.5 h-3.5 text-[#D4AF37]" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {wrongAttempt && (
                    <p className="text-xs text-red-500 mt-2.5 flex items-center gap-1.5 font-display animate-bounce">
                      <XCircle className="w-4 h-4" />
                      Jawaban belum tepat, silakan coba tebakan motif lain.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── 3. ROUND COMPLETE MODAL / SUCCESS CELEBRATION ── */}
          {gameState === "round-complete" && currentMotif && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 max-w-2xl mx-auto w-full py-6 flex flex-col justify-center"
            >
              <div
                className={`border-2 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-colors ${
                  isDark
                    ? "bg-[#1f1a18] border-[#D4AF37]/60"
                    : "bg-white border-[#D4AF37]/60 shadow-xl"
                }`}
              >
                {/* Confetti Glow Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-500 text-xs font-display font-bold px-4 py-1.5 rounded-full mb-3">
                    <CheckCircle2 className="w-4 h-4" /> TEBAKAN TEPAT
                  </div>
                  <h2
                    className={`font-display font-bold text-3xl sm:text-4xl ${
                      isDark ? "text-white" : "text-[#2D2B38]"
                    }`}
                  >
                    {currentMotif.name}
                  </h2>
                  <p className="text-sm font-display text-[#D4AF37] mt-1">
                    Sentra Asal: {currentMotif.region} • {currentMotif.category}
                  </p>
                </div>

                {/* Motif Image Showcase */}
                <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-white/20 mb-6 shadow-xl">
                  <Image
                    src={currentMotif.image}
                    alt={currentMotif.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md border border-[#D4AF37]/50 text-[#D4AF37] font-display font-extrabold text-sm px-3.5 py-1 rounded-full shadow-md">
                    +{earnedXp} XP Diperoleh
                  </div>
                </div>

                {/* Cultural Philosophy Card */}
                <div
                  className={`rounded-2xl p-5 border mb-6 ${
                    isDark
                      ? "bg-[#28221f] border-white/10 text-white/90"
                      : "bg-[#FAF8F4] border-[#E2DDD5] text-stone-800"
                  }`}
                >
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#D4AF37] mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Kearifan & Makna Filosofis
                  </h4>
                  <p className="font-narrative text-sm leading-relaxed">
                    {currentMotif.philosophy}
                  </p>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={pickNewMotif}
                    className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 bg-[#D4AF37] text-[#1A1614] font-display font-bold text-sm py-3.5 rounded-xl hover:bg-[#c9a52f] transition-all shadow-lg shadow-[#D4AF37]/20 cursor-pointer"
                  >
                    <span>Lanjut ke Ronde Berikutnya</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <Link
                    href="/play"
                    className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 font-display font-semibold text-sm py-3.5 px-6 rounded-xl border transition-colors cursor-pointer ${
                      isDark
                        ? "bg-white/10 hover:bg-white/20 text-white border-white/10"
                        : "bg-stone-100 hover:bg-stone-200 text-[#2D2B38] border-[#E2DDD5]"
                    }`}
                  >
                    Kembali ke Arena
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
