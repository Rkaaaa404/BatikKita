"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Timer, Trophy, RotateCcw, CheckCircle } from "lucide-react";
import { GameNavbar } from "@/components/shared/GameNavbar";
import { useXp } from "@/hooks/useXp";

// ── Data ─────────────────────────────────────────────────────────────────────
interface MotifCard {
  id: string;
  name: string;
  image: string;
  regionId: string;
}

interface Region {
  id: string;
  name: string;
  // percentage positions on the map SVG (0-100)
  x: number;
  y: number;
}

const REGIONS: Region[] = [
  { id: "yogyakarta", name: "Yogyakarta", x: 52, y: 77 },
  { id: "surakarta",  name: "Surakarta",  x: 57, y: 72 },
  { id: "cirebon",    name: "Cirebon",    x: 44, y: 66 },
  { id: "pekalongan", name: "Pekalongan", x: 48, y: 63 },
  { id: "lasem",      name: "Lasem",      x: 60, y: 63 },
  { id: "madura",     name: "Madura",     x: 64, y: 65 },
  { id: "bali",       name: "Bali",       x: 73, y: 78 },
  { id: "garut",      name: "Garut",      x: 41, y: 70 },
];

const MOTIF_CARDS: MotifCard[] = [
  { id: "kawung",       name: "Batik Kawung",       image: "/images/batik-kawung.jpg",       regionId: "yogyakarta" },
  { id: "parang",       name: "Parang Rusak",        image: "/images/batik-parang-rusak.jpg", regionId: "surakarta" },
  { id: "megamendung",  name: "Mega Mendung",        image: "/images/batik-mega-mendung.jpg", regionId: "cirebon" },
  { id: "pekalongan",   name: "Batik Pekalongan",    image: "/images/batik-mega-mendung.jpg", regionId: "pekalongan" },
  { id: "lasem",        name: "Batik Lasem",         image: "/images/batik-parang-rusak.jpg", regionId: "lasem" },
  { id: "madura",       name: "Batik Madura",        image: "/images/batik-kawung.jpg",       regionId: "madura" },
  { id: "bali",         name: "Batik Bali",          image: "/images/batik-mega-mendung.jpg", regionId: "bali" },
  { id: "garut",        name: "Batik Garut",         image: "/images/batik-kawung.jpg",       regionId: "garut" },
];

const ROUND_DURATION = 90; // seconds

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ── Component ─────────────────────────────────────────────────────────────────
type GameState = "idle" | "playing" | "done";

interface PinState {
  regionId: string;
  cardId: string | null;
  flash: "correct" | "wrong" | null;
}

export default function SortirPetaPage() {
  const { addXp } = useXp();
  const [gameState, setGameState] = useState<GameState>("idle");
  const [queue, setQueue] = useState<MotifCard[]>([]);
  const [currentCard, setCurrentCard] = useState<MotifCard | null>(null);
  const [pinStates, setPinStates] = useState<Record<string, PinState>>({});
  const [score, setScore] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [earnedXp, setEarnedXp] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  // Mobile tap-to-select
  const [selectedCard, setSelectedCard] = useState<MotifCard | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const endGame = useCallback(() => {
    stopTimer();
    setGameState("done");
  }, [stopTimer]);

  const startGame = useCallback(() => {
    const shuffled = shuffleArray(MOTIF_CARDS);
    setQueue(shuffled.slice(1));
    setCurrentCard(shuffled[0]);
    setPinStates({});
    setScore(0);
    setTotalCorrect(0);
    setTimeLeft(ROUND_DURATION);
    setEarnedXp(0);
    setSelectedCard(null);
    setGameState("playing");

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setGameState("done");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => () => stopTimer(), [stopTimer]);

  const handleDropOnRegion = useCallback((regionId: string, dropTime?: number) => {
    if (!currentCard || gameState !== "playing") return;

    const correct = currentCard.regionId === regionId;

    if (correct) {
      const bonus = dropTime !== undefined && dropTime < 5000 ? 10 : 0;
      const xp = 40 + bonus;
      setScore((prev) => prev + 1);
      setTotalCorrect((prev) => prev + 1);
      setEarnedXp((prev) => prev + xp);
      addXp(xp);
      setPinStates((prev) => ({ ...prev, [regionId]: { regionId, cardId: currentCard.id, flash: "correct" } }));
      setTimeout(() => {
        setPinStates((prev) => ({ ...prev, [regionId]: { ...prev[regionId], flash: null } }));
      }, 1200);

      const next = queue[0];
      setQueue((prev) => prev.slice(1));
      setCurrentCard(next ?? null);
      setSelectedCard(null);

      if (!next) {
        // all cards placed
        setTimeout(() => endGame(), 600);
      }
    } else {
      // bounce back: wrong pin flash
      setPinStates((prev) => ({ ...prev, [regionId]: { regionId, cardId: null, flash: "wrong" } }));
      setTimeout(() => {
        setPinStates((prev) => ({ ...prev, [regionId]: { ...prev[regionId], flash: null } }));
      }, 800);
    }
  }, [currentCard, queue, gameState, addXp, endGame]);

  // Pointer drag handlers
  const handleCardPointerDown = (e: React.PointerEvent) => {
    if (gameState !== "playing") return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragPos({ x: e.clientX, y: e.clientY });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    setDragPos({ x: e.clientX, y: e.clientY });
  }, [isDragging]);

  const dropTimeRef = useRef<number>(Date.now());
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    if (!mapRef.current) return;
    const mapRect = mapRef.current.getBoundingClientRect();
    const relX = ((e.clientX - mapRect.left) / mapRect.width) * 100;
    const relY = ((e.clientY - mapRect.top) / mapRect.height) * 100;

    // Find nearest pin within 6% radius
    let best: Region | null = null;
    let bestDist = Infinity;
    for (const region of REGIONS) {
      const dist = Math.hypot(relX - region.x, relY - region.y);
      if (dist < 6 && dist < bestDist) {
        best = region;
        bestDist = dist;
      }
    }
    if (best) {
      const elapsed = Date.now() - dropTimeRef.current;
      handleDropOnRegion(best.id, elapsed);
    }
  }, [isDragging, handleDropOnRegion]);

  // Mobile tap-on-pin
  const handlePinTap = (regionId: string) => {
    if (selectedCard) {
      handleDropOnRegion(regionId, undefined);
    }
  };

  const handleCardTap = () => {
    if (!isDragging) {
      setSelectedCard((prev) => prev ? null : currentCard);
      dropTimeRef.current = Date.now();
    }
  };

  const timerPercent = (timeLeft / ROUND_DURATION) * 100;
  const timerColor = timerPercent > 50 ? "#22c55e" : timerPercent > 20 ? "#eab308" : "#ef4444";
  const totalCards = MOTIF_CARDS.length;

  return (
    <div className="min-h-screen bg-[#1A1614] text-white flex flex-col"
      onPointerMove={isDragging ? handlePointerMove : undefined}
      onPointerUp={isDragging ? handlePointerUp : undefined}
    >
      <GameNavbar title="Sortir Motif ke Peta" />

      <main className="pt-14 flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {/* ── IDLE ── */}
          {gameState === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center text-center gap-8"
            >
              <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                <MapPin className="w-10 h-10 text-blue-400" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-display font-bold px-4 py-1.5 rounded-full mb-4">
                  <MapPin className="w-3.5 h-3.5" /> SORTIR MOTIF KE PETA
                </div>
                <h1 className="font-display font-extrabold text-3xl md:text-4xl mb-3">
                  Pasang Motif ke<br /><span className="text-blue-400">Daerah Asalnya</span>
                </h1>
                <p className="text-white/60 font-body max-w-md mx-auto">
                  Drag kartu motif ke pin daerah yang benar pada peta Nusantara. 
                  Kamu punya 90 detik untuk memasang semua motif. Jawab cepat, dapat bonus XP!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full max-w-sm text-left">
                {[
                  { label: "Per motif benar", val: "+40 XP" },
                  { label: "Bonus < 5 detik", val: "+10 XP" },
                  { label: "Total motif", val: `${totalCards} motif` },
                  { label: "Durasi sesi", val: "90 detik" },
                ].map((item) => (
                  <div key={item.label} className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <p className="text-[10px] text-white/50 font-body mb-1">{item.label}</p>
                    <p className="text-blue-400 font-display font-bold text-sm">{item.val}</p>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={startGame}
                className="bg-blue-500 text-white font-display font-extrabold px-10 py-3.5 rounded-full text-base hover:bg-blue-400 transition-colors shadow-lg shadow-blue-500/20"
              >
                Mulai Sesi
              </motion.button>
            </motion.div>
          )}

          {/* ── PLAYING ── */}
          {gameState === "playing" && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 py-4 gap-4"
            >
              {/* Timer bar */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-body text-white/60">
                    <Timer className="w-3.5 h-3.5" /> {timeLeft}s
                  </div>
                  <span className="text-xs font-display font-bold text-white/70">{score}/{totalCards} benar</span>
                </div>
                <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${timerPercent}%`, backgroundColor: timerColor }}
                    transition={{ duration: 0.5 }}
                    className="h-full rounded-full"
                  />
                </div>
              </div>

              {/* MAP */}
              <div
                ref={mapRef}
                className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0d3b6e] select-none touch-none"
                style={{ aspectRatio: "16/9" }}
              >
                {/* Indonesia map SVG background (simplified island shapes) */}
                <svg viewBox="0 0 100 56" className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                  {/* Sumatra */}
                  <ellipse cx="26" cy="48" rx="18" ry="7" fill="#1e6aa8" transform="rotate(-30 26 48)" />
                  {/* Java */}
                  <ellipse cx="52" cy="70" rx="20" ry="4" fill="#1e6aa8" transform="rotate(-8 52 70)" />
                  {/* Kalimantan */}
                  <ellipse cx="70" cy="40" rx="14" ry="14" fill="#1e6aa8" />
                  {/* Sulawesi */}
                  <ellipse cx="90" cy="42" rx="5" ry="10" fill="#1e6aa8" />
                  {/* Bali */}
                  <ellipse cx="73" cy="78" rx="3" ry="2" fill="#1e6aa8" />
                </svg>

                {/* Region Pins */}
                {REGIONS.map((region) => {
                  const ps = pinStates[region.id];
                  const isCorrect = ps?.flash === "correct";
                  const isWrong = ps?.flash === "wrong";
                  const hasCard = ps?.cardId != null;
                  return (
                    <motion.button
                      key={region.id}
                      onClick={() => handlePinTap(region.id)}
                      animate={{
                        scale: isCorrect ? 1.3 : isWrong ? 0.85 : selectedCard ? 1.1 : 1,
                      }}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                      style={{ left: `${region.x}%`, top: `${region.y}%` }}
                    >
                      <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                        isCorrect
                          ? "bg-emerald-500 border-emerald-300 shadow-lg shadow-emerald-500/50"
                          : isWrong
                          ? "bg-red-500 border-red-300"
                          : hasCard
                          ? "bg-emerald-600/80 border-emerald-400"
                          : selectedCard
                          ? "bg-blue-500/80 border-blue-300 shadow-md shadow-blue-500/40 animate-pulse"
                          : "bg-white/10 border-white/30 hover:bg-white/20"
                      }`}>
                        {isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5 text-white" />
                        )}
                      </div>
                      <span className={`text-[9px] font-display font-bold mt-0.5 px-1 py-0.5 rounded ${
                        isCorrect ? "text-emerald-300" : isWrong ? "text-red-400" : "text-white/70"
                      }`}>{region.name}</span>
                    </motion.button>
                  );
                })}

                {/* Drag ghost card */}
                {isDragging && currentCard && (
                  <div
                    className="fixed pointer-events-none z-50 rounded-xl overflow-hidden border-2 border-blue-400 shadow-2xl opacity-90"
                    style={{
                      width: 80, height: 80,
                      left: dragPos.x - 40,
                      top: dragPos.y - 40,
                      transform: "rotate(5deg)",
                    }}
                  >
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${currentCard.image})` }}
                    />
                  </div>
                )}
              </div>

              {/* Current card tray */}
              {currentCard && (
                <div className="flex items-center gap-4">
                  <div className="shrink-0">
                    <p className="text-xs text-white/50 font-body mb-1">Pasang ke daerah asal:</p>
                    <motion.div
                      animate={{ scale: selectedCard ? 1.05 : 1, boxShadow: selectedCard ? "0 0 0 3px #60a5fa" : "none" }}
                      className="w-24 h-24 rounded-xl overflow-hidden border-2 border-blue-400/50 cursor-grab active:cursor-grabbing touch-none select-none"
                      onPointerDown={(e) => { dropTimeRef.current = Date.now(); handleCardPointerDown(e); }}
                      onClick={handleCardTap}
                    >
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${currentCard.image})` }}
                      />
                    </motion.div>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-display font-bold text-base text-white">{currentCard.name}</h3>
                    <p className="text-white/50 text-sm font-body mt-1">
                      {selectedCard
                        ? "✅ Kartu dipilih: ketuk pin daerah yang tepat"
                        : "Drag kartu ke peta atau ketuk kartu lalu ketuk pin daerah"}
                    </p>
                    <p className="text-white/30 text-xs font-body mt-2">
                      {queue.length} motif dalam antrian
                    </p>
                  </div>

                  {/* Queue preview */}
                  {queue.slice(0, 3).map((card, i) => (
                    <div
                      key={card.id}
                      className="shrink-0 rounded-lg overflow-hidden border border-white/20 opacity-50"
                      style={{ width: 40, height: 40, transform: `scale(${1 - i * 0.07})` }}
                    >
                      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${card.image})` }} />
                    </div>
                  ))}
                </div>
              )}

              {!currentCard && (
                <div className="flex items-center justify-center py-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-display font-bold">
                    <CheckCircle className="w-5 h-5" /> Semua kartu sudah dipasang!
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ── DONE ── */}
          {gameState === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto px-4 py-12 flex flex-col items-center text-center gap-8"
            >
              <div className="w-24 h-24 rounded-full bg-[#D4AF37]/10 border-2 border-[#D4AF37]/30 flex items-center justify-center">
                <Trophy className="w-12 h-12 text-[#D4AF37]" />
              </div>

              <div>
                <h2 className="font-display font-extrabold text-3xl text-white mb-2">Sesi Selesai!</h2>
                <p className="text-white/60 font-body">
                  {score === totalCards
                    ? "Luar biasa! Kamu berhasil memasang semua motif dengan tepat."
                    : `Kamu berhasil memasang ${score} dari ${totalCards} motif batik.`}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 w-full">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                  <p className="text-white/40 text-[10px] font-body mb-1">Benar</p>
                  <p className="font-display font-bold text-3xl text-white">{score}</p>
                  <p className="text-white/40 text-xs font-body">dari {totalCards}</p>
                </div>
                <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-2xl p-5 text-center">
                  <p className="text-[#D4AF37]/70 text-[10px] font-body mb-1">XP Diperoleh</p>
                  <p className="font-display font-bold text-3xl text-[#D4AF37]">+{earnedXp}</p>
                  <p className="text-[#D4AF37]/50 text-xs font-body">XP</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                  <p className="text-white/40 text-[10px] font-body mb-1">Akurasi</p>
                  <p className="font-display font-bold text-3xl text-white">
                    {Math.round((score / totalCards) * 100)}%
                  </p>
                </div>
              </div>

              <div className="flex gap-3 w-full">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={startGame}
                  className="flex-1 bg-blue-500 text-white font-display font-extrabold py-3.5 rounded-xl hover:bg-blue-400 transition-colors"
                >
                  Main Lagi
                </motion.button>
                <button
                  onClick={() => setGameState("idle")}
                  className="flex items-center gap-2 border border-white/15 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-display font-semibold px-5 py-3.5 rounded-xl transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Menu
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
