"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Timer,
  Trophy,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Compass,
  Volume2,
  VolumeX,
  Flame,
  Layers,
  Navigation,
  Move,
  Info,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";
import Image from "next/image";
import Link from "next/link";
import { GameNavbar } from "@/components/shared/GameNavbar";
import { useXp } from "@/hooks/useXp";

// ── Web Audio Sound Synthesizer (No external sound files required) ───────────
class SoundEffects {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
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
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Audio fallback
    }
  }

  playSnap() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Ignore
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
      osc.frequency.setValueAtTime(220, now);
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

// ── Region Sentra Pin Model ──────────────────────────────────────────────────
export interface RegionPin {
  id: string;
  name: string;
  shortName: string;
  province: string;
  island: string;
  x: number; // in SVG map coordinates (0..1100)
  y: number; // in SVG map coordinates (0..580)
  description: string;
}

export const REGIONS: RegionPin[] = [
  {
    id: "jakarta",
    name: "DKI Jakarta",
    shortName: "Jakarta",
    province: "DKI Jakarta",
    island: "Jawa",
    x: 345,
    y: 408,
    description: "Sentra Batik Betawi Ondel-ondel dan Pucuk Rebung",
  },
  {
    id: "garut",
    name: "Garut (Priangan)",
    shortName: "Garut",
    province: "Jawa Barat",
    island: "Jawa",
    x: 366,
    y: 432,
    description: "Batik Priangan Sunda dengan ornamen Merak Ngibing dan Lereng",
  },
  {
    id: "cirebon",
    name: "Cirebon",
    shortName: "Cirebon",
    province: "Jawa Barat",
    island: "Jawa",
    x: 398,
    y: 412,
    description: "Pesisir Utara, Sentra Mega Mendung dan Singa Barong",
  },
  {
    id: "pekalongan",
    name: "Pekalongan",
    shortName: "Pekalongan",
    province: "Jawa Tengah",
    island: "Jawa",
    x: 428,
    y: 412,
    description: "Kota Batik Dunia, Sentra Jlamprang dan Buketan",
  },
  {
    id: "yogyakarta",
    name: "D.I. Yogyakarta",
    shortName: "Yogyakarta",
    province: "D.I. Yogyakarta",
    island: "Jawa",
    x: 446,
    y: 446,
    description: "Keraton Mataram, Sentra Kawung, Parang, dan Sekar Jagad",
  },
  {
    id: "surakarta",
    name: "Surakarta (Solo)",
    shortName: "Solo",
    province: "Jawa Tengah",
    island: "Jawa",
    x: 472,
    y: 434,
    description: "Keraton Kasunanan, Sentra Sido Mukti, Truntum, dan Wirasat",
  },
  {
    id: "lasem",
    name: "Lasem (Rembang)",
    shortName: "Lasem",
    province: "Jawa Tengah",
    island: "Jawa",
    x: 494,
    y: 410,
    description: "Pusaka Tiongkok Kecil, Sentra Batik Liong Merah Getih Pitik",
  },
  {
    id: "madura",
    name: "Bangkalan (Madura)",
    shortName: "Madura",
    province: "Jawa Timur",
    island: "Madura",
    x: 538,
    y: 408,
    description: "Pesisiran Madura, Warna Berani Gentongan dan Karapan",
  },
  {
    id: "bali",
    name: "Denpasar (Bali)",
    shortName: "Bali",
    province: "Bali",
    island: "Bali",
    x: 578,
    y: 450,
    description: "Wastra Dewata, Sentra Singa Ambara Raja dan Barong",
  },
  {
    id: "kalimantan",
    name: "Kalimantan",
    shortName: "Kalimantan",
    province: "Kalimantan Tengah",
    island: "Kalimantan",
    x: 450,
    y: 260,
    description: "Wastra Dayak Batang Garing (Pohon Kehidupan) dan Tameng Telawang",
  },
];

// ── Motif Card Model ─────────────────────────────────────────────────────────
export interface MotifCard {
  id: string;
  name: string;
  regionId: string;
  regionLabel: string;
  category: string;
  philosophy: string;
  image: string;
}

export const MOTIF_CARDS: MotifCard[] = [
  {
    id: "batik_kawung",
    name: "Batik Kawung",
    regionId: "yogyakarta",
    regionLabel: "D.I. Yogyakarta",
    category: "Batik Keraton",
    philosophy: "Empat kelopak aren melambangkan kemurnian hati dan harmoni semesta.",
    image: "/images/batik-kawung.jpg",
  },
  {
    id: "batik_parang",
    name: "Batik Parang",
    regionId: "surakarta",
    regionLabel: "Surakarta (Solo)",
    category: "Batik Larangan",
    philosophy: "Ombak samudra tak terputus lambang keteguhan kepemimpinan yang pantang surut.",
    image: "/images/batik-parang-rusak.jpg",
  },
  {
    id: "batik_mega_mendung",
    name: "Batik Mega Mendung",
    regionId: "cirebon",
    regionLabel: "Cirebon",
    category: "Batik Pesisiran",
    philosophy: "Awan berundak penyejuk di tengah terik, lambang kesabaran dan ketenangan emosi.",
    image: "/images/batik-mega-mendung.jpg",
  },
  {
    id: "batik_jlamprang",
    name: "Batik Jlamprang",
    regionId: "pekalongan",
    regionLabel: "Pekalongan",
    category: "Batik Pesisiran",
    philosophy: "Pola geometris 8 penjuru mata angin hasil akulturasi seni Patola India dan Arab.",
    image: "/images/batik-kawung.jpg",
  },
  {
    id: "batik_betawi",
    name: "Batik Betawi",
    regionId: "jakarta",
    regionLabel: "DKI Jakarta",
    category: "Batik Pesisiran",
    philosophy: "Ornamen Ondel-ondel dan kembang kelapa riang menyuarakan keramahan warga ibu kota.",
    image: "/images/batik-mega-mendung.jpg",
  },
  {
    id: "batik_liong",
    name: "Batik Liong",
    regionId: "lasem",
    regionLabel: "Lasem (Rembang)",
    category: "Batik Pesisiran",
    philosophy: "Naga Liong dan warna merah getih pitik wujud akulturasi Tionghoa Jawa lambang kemakmuran.",
    image: "/images/batik-parang-rusak.jpg",
  },
  {
    id: "batik_dayak",
    name: "Batik Dayak",
    regionId: "kalimantan",
    regionLabel: "Kalimantan",
    category: "Batik Nusantara",
    philosophy: "Pohon Batang Garing dan tameng telawang penjaga keseimbangan alam dan manusia.",
    image: "/images/batik-kawung.jpg",
  },
  {
    id: "batik_madura",
    name: "Batik Madura",
    regionId: "madura",
    regionLabel: "Bangkalan (Madura)",
    category: "Batik Pesisiran",
    philosophy: "Warna tajam berani direndam berbulan-bulan, mencerminkan keteguhan karakter masyarakat pesisir.",
    image: "/images/batik-mega-mendung.jpg",
  },
  {
    id: "batik_bali",
    name: "Batik Bali",
    regionId: "bali",
    regionLabel: "Denpasar (Bali)",
    category: "Batik Nusantara",
    philosophy: "Ragam hias flora sakral Dewata berpadu dengan keanggunan budaya Pulau Seribu Pura.",
    image: "/images/batik-mega-mendung.jpg",
  },
  {
    id: "batik_garut",
    name: "Batik Garut",
    regionId: "garut",
    regionLabel: "Garut (Priangan)",
    category: "Batik Pesisiran",
    philosophy: "Batik Priangan Sunda warna gumading lembut bermotif Merak Ngibing yang penuh pesona.",
    image: "/images/batik-kawung.jpg",
  },
];

const ROUND_DURATION = 90; // seconds

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

type GameState = "idle" | "playing" | "done";

interface PinPlacedState {
  card: MotifCard;
  placedAt: number;
}

export default function SortirPetaPage() {
  const { addXp } = useXp();
  const [gameState, setGameState] = useState<GameState>("idle");
  const [queue, setQueue] = useState<MotifCard[]>([]);
  const [currentCard, setCurrentCard] = useState<MotifCard | null>(null);
  const [placedPins, setPlacedPins] = useState<Record<string, PinPlacedState>>({});
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [earnedXp, setEarnedXp] = useState(0);
  const [soundOn, setSoundOn] = useState(true);

  // Map viewport pan and zoom state
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanningMap, setIsPanningMap] = useState(false);
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const pointerStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Drag card state
  const [isDraggingCard, setIsDraggingCard] = useState(false);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<MotifCard | null>(null);
  const [flashPinId, setFlashPinId] = useState<{ id: string; status: "correct" | "wrong" } | null>(null);
  const [recentNotification, setRecentNotification] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const pinRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dropTimeRef = useRef<number>(Date.now());

  // Toggle audio
  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    sfx.enabled = next;
  };

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const endGame = useCallback(() => {
    stopTimer();
    setGameState("done");
    sfx.playWin();
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D4AF37", "#60A5FA", "#34D399", "#F59E0B"],
      });
    } catch {
      // Confetti fallback
    }
  }, [stopTimer]);

  const startGame = useCallback(() => {
    const shuffled = shuffleArray(MOTIF_CARDS);
    setQueue(shuffled.slice(1));
    setCurrentCard(shuffled[0]);
    setPlacedPins({});
    setScore(0);
    setStreak(0);
    setTimeLeft(ROUND_DURATION);
    setEarnedXp(0);
    setSelectedCard(null);
    setHoveredPinId(null);
    setFlashPinId(null);
    setRecentNotification(null);
    setPan({ x: -40, y: -40 });
    setZoom(1.2);
    setGameState("playing");
    dropTimeRef.current = Date.now();
    sfx.playSnap();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setGameState("done");
          sfx.playWin();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => () => stopTimer(), [stopTimer]);

  // Drop card on region logic
  const handleDropOnRegion = useCallback(
    (regionId: string) => {
      if (!currentCard || gameState !== "playing") return;

      const targetRegion = REGIONS.find((r) => r.id === regionId);
      const isCorrect = currentCard.regionId === regionId;

      if (isCorrect) {
        const elapsed = Date.now() - dropTimeRef.current;
        const isQuick = elapsed < 5000;
        const baseReward = 40;
        const speedBonus = isQuick ? 10 : 0;
        const streakBonus = Math.min(streak * 5, 25);
        const reward = baseReward + speedBonus + streakBonus;

        sfx.playChime();
        setScore((prev) => prev + 1);
        setStreak((prev) => prev + 1);
        setEarnedXp((prev) => prev + reward);
        addXp(reward);

        setPlacedPins((prev) => ({
          ...prev,
          [regionId]: { card: currentCard, placedAt: Date.now() },
        }));

        setFlashPinId({ id: regionId, status: "correct" });
        setRecentNotification(
          `Bagus! ${currentCard.name} tepat berada di ${targetRegion?.name} (+${reward} XP)`
        );

        setTimeout(() => {
          setFlashPinId(null);
        }, 1200);

        const nextCard = queue[0] ?? null;
        setQueue((prev) => prev.slice(1));
        setCurrentCard(nextCard);
        setSelectedCard(null);
        setHoveredPinId(null);
        dropTimeRef.current = Date.now();

        if (!nextCard) {
          setTimeout(() => endGame(), 700);
        }
      } else {
        sfx.playWrong();
        setStreak(0);
        setFlashPinId({ id: regionId, status: "wrong" });
        setRecentNotification(
          `Kurang tepat: ${currentCard.name} bukan berasal dari ${targetRegion?.name}. Coba teliti lagi!`
        );

        setTimeout(() => {
          setFlashPinId(null);
        }, 900);
      }
    },
    [currentCard, gameState, queue, streak, addXp, endGame]
  );

  // ── Pan Map Handlers (User can drag the entire map) ─────────────────────────
  const handleMapPointerDown = (e: React.PointerEvent) => {
    // Only pan map if not dragging card and left mouse button / touch
    if (isDraggingCard || e.button !== 0) return;
    setIsPanningMap(true);
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleMapPointerMove = (e: React.PointerEvent) => {
    if (isPanningMap) {
      const deltaX = e.clientX - pointerStartRef.current.x;
      const deltaY = e.clientY - pointerStartRef.current.y;
      // Clamp pan to keep map in visible range
      const newX = Math.max(-480, Math.min(480, panStartRef.current.x + deltaX));
      const newY = Math.max(-320, Math.min(320, panStartRef.current.y + deltaY));
      setPan({ x: newX, y: newY });
    }
  };

  const handleMapPointerUp = (e: React.PointerEvent) => {
    if (isPanningMap) {
      setIsPanningMap(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Safe ignore
      }
    }
  };

  // Wheel zoom
  const handleWheelZoom = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.12 : -0.12;
    setZoom((prev) => Math.max(0.85, Math.min(2.5, +(prev + delta).toFixed(2))));
  };

  // Zoom buttons
  const zoomIn = () => setZoom((prev) => Math.min(2.5, +(prev + 0.25).toFixed(2)));
  const zoomOut = () => setZoom((prev) => Math.max(0.85, +(prev - 0.25).toFixed(2)));
  const resetCamera = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
    sfx.playSnap();
  };

  // Quick Focus Presets
  const focusPreset = (preset: "all" | "java" | "coast" | "outer") => {
    sfx.playSnap();
    switch (preset) {
      case "all":
        setPan({ x: 0, y: 0 });
        setZoom(1);
        break;
      case "java":
        setPan({ x: -90, y: -130 });
        setZoom(1.7);
        break;
      case "coast":
        setPan({ x: -120, y: -100 });
        setZoom(1.9);
        break;
      case "outer":
        setPan({ x: 40, y: 30 });
        setZoom(1.35);
        break;
    }
  };

  // ── Drag Card Handlers ──────────────────────────────────────────────────────
  const handleCardPointerDown = (e: React.PointerEvent) => {
    if (gameState !== "playing" || !currentCard) return;
    e.stopPropagation();
    setIsDraggingCard(true);
    setDragPos({ x: e.clientX, y: e.clientY });
    sfx.playSnap();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleCardPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingCard) return;
      setDragPos({ x: e.clientX, y: e.clientY });

      // Find nearest pin to pointer
      let matchedPinId: string | null = null;
      let closestDist = Infinity;

      for (const region of REGIONS) {
        const el = pinRefs.current[region.id];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const pinCenterX = rect.left + rect.width / 2;
        const pinCenterY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - pinCenterX, e.clientY - pinCenterY);

        if (dist < 46 && dist < closestDist) {
          closestDist = dist;
          matchedPinId = region.id;
        }
      }

      if (matchedPinId !== hoveredPinId) {
        setHoveredPinId(matchedPinId);
        if (matchedPinId) sfx.playSnap();
      }
    },
    [isDraggingCard, hoveredPinId]
  );

  const handleCardPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingCard) return;
      setIsDraggingCard(false);

      if (hoveredPinId) {
        handleDropOnRegion(hoveredPinId);
        setHoveredPinId(null);
      }
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Safe ignore
      }
    },
    [isDraggingCard, hoveredPinId, handleDropOnRegion]
  );

  // Tap-to-select mode (convenient on touch screens)
  const handleCardTap = () => {
    if (!isDraggingCard && currentCard) {
      setSelectedCard((prev) => (prev ? null : currentCard));
      sfx.playSnap();
    }
  };

  const handlePinTap = (regionId: string) => {
    if (selectedCard) {
      handleDropOnRegion(regionId);
    }
  };

  const timerPercent = (timeLeft / ROUND_DURATION) * 100;
  const timerColor =
    timerPercent > 50 ? "#10B981" : timerPercent > 20 ? "#F59E0B" : "#EF4444";
  const totalCards = MOTIF_CARDS.length;

  return (
    <div
      className="min-h-screen bg-[#141211] text-white flex flex-col font-body selection:bg-[#D4AF37] selection:text-[#1A1614] overflow-x-hidden"
      onPointerMove={isDraggingCard ? handleCardPointerMove : undefined}
      onPointerUp={isDraggingCard ? handleCardPointerUp : undefined}
    >
      <GameNavbar title="Sortir Motif ke Peta" />

      <main className="pt-16 flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {/* ══════════════════════════════════════════════════════════════════
              IDLE SCREEN
             ══════════════════════════════════════════════════════════════════ */}
          {gameState === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto px-4 py-12 flex flex-col items-center text-center gap-6"
            >
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#1E3A8A] via-[#1E40AF] to-[#0F172A] border-2 border-[#60A5FA]/40 flex items-center justify-center shadow-2xl shadow-blue-500/20">
                  <Compass className="w-12 h-12 text-[#93C5FD] animate-pulse" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#D4AF37] text-[#1A1614] rounded-full p-1.5 shadow-md">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-display font-bold px-4 py-1.5 rounded-full mb-3 tracking-wider uppercase">
                  <MapPin className="w-3.5 h-3.5" /> Peta Interaktif Wastra Nusantara
                </div>
                <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mb-3">
                  Sortir Motif ke <span className="text-[#60A5FA]">Peta Nusantara</span>
                </h1>
                <p className="text-white/70 font-body max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                  Jelajahi peta kepulauan Indonesia yang dapat digeser dan diperbesar.
                  Pasangkan kartu motif batik ke pin daerah asalnya sebelum waktu habis!
                </p>
              </div>

              {/* Interactive Features Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl text-left">
                <div className="bg-[#1A1816] border border-white/10 rounded-2xl p-3.5 flex flex-col gap-1">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-400 mb-1">
                    <Move className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] text-white/50 font-body">Peta Geser & Zoom</p>
                  <p className="text-white font-display font-bold text-xs">Bebas di-drag</p>
                </div>

                <div className="bg-[#1A1816] border border-white/10 rounded-2xl p-3.5 flex flex-col gap-1">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 mb-1">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] text-white/50 font-body">Sentra Budaya</p>
                  <p className="text-white font-display font-bold text-xs">10 Sentra Asli</p>
                </div>

                <div className="bg-[#1A1816] border border-white/10 rounded-2xl p-3.5 flex flex-col gap-1">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] mb-1">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] text-white/50 font-body">Bonus Kecepatan</p>
                  <p className="text-[#D4AF37] font-display font-bold text-xs">+10 XP Cepat</p>
                </div>

                <div className="bg-[#1A1816] border border-white/10 rounded-2xl p-3.5 flex flex-col gap-1">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center text-purple-400 mb-1">
                    <Timer className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] text-white/50 font-body">Durasi Sesi</p>
                  <p className="text-purple-300 font-display font-bold text-xs">90 Detik</p>
                </div>
              </div>

              {/* Instructions Callout */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 max-w-xl text-left text-xs text-white/70 space-y-2">
                <div className="flex items-center gap-2 text-white font-display font-bold">
                  <Info className="w-4 h-4 text-blue-400" />
                  <span>Cara Bermain:</span>
                </div>
                <ul className="space-y-1 pl-5 list-disc text-white/60">
                  <li>
                    <strong className="text-white">Geser & Zoom:</strong> Drag peta untuk
                    menjelajahi pulau Jawa, Sumatera, Bali, dan Kalimantan.
                  </li>
                  <li>
                    <strong className="text-white">Pasang Kartu:</strong> Drag kartu batik di bawah
                    ke pin kota tujuan, atau ketuk kartu lalu ketuk pin di peta.
                  </li>
                  <li>
                    <strong className="text-white">Presisi:</strong> Pin akan berdenyut magnetis
                    saat kartu mendekat.
                  </li>
                </ul>
              </div>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={startGame}
                className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white font-display font-extrabold px-12 py-4 rounded-full text-base hover:from-blue-500 hover:to-indigo-500 transition-all shadow-xl shadow-blue-500/25 border border-blue-400/30"
              >
                Mulai Jelajah Peta Sekarang
              </motion.button>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              PLAYING SCREEN (INTERACTIVE DRAGGABLE & ZOOMABLE MAP)
             ══════════════════════════════════════════════════════════════════ */}
          {gameState === "playing" && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-3 sm:px-6 py-2 gap-3"
            >
              {/* Top Navigation & Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1A1816] border border-white/10 rounded-2xl px-4 py-2.5 shadow-lg">
                {/* Timer */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-blue-400" />
                    <span className="font-display font-extrabold text-sm text-white">
                      {timeLeft}s
                    </span>
                  </div>
                  <div className="w-24 sm:w-36 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: `${timerPercent}%`, backgroundColor: timerColor }}
                      transition={{ duration: 0.3 }}
                      className="h-full rounded-full"
                    />
                  </div>
                </div>

                {/* Score & Streak */}
                <div className="flex items-center gap-4">
                  {streak > 1 && (
                    <span className="inline-flex items-center gap-1 text-xs font-display font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full animate-bounce">
                      <Flame className="w-3.5 h-3.5 fill-amber-400" />
                      {streak}x Kombo
                    </span>
                  )}

                  <div className="text-xs font-display font-semibold text-white/80">
                    Selesai:{" "}
                    <span className="text-[#60A5FA] font-bold">
                      {score}/{totalCards}
                    </span>
                  </div>

                  <div className="text-xs font-display font-bold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/25 px-3 py-1 rounded-lg">
                    +{earnedXp} XP
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleSound}
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                    title={soundOn ? "Matikan Suara" : "Nyalakan Suara"}
                  >
                    {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Interactive Region Focus Chips */}
              <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[11px] font-display font-bold text-white/50 uppercase tracking-wider mr-1 flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-blue-400" /> Fokus:
                  </span>
                  <button
                    type="button"
                    onClick={() => focusPreset("all")}
                    className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 font-display font-semibold transition-colors"
                  >
                    Nusantara
                  </button>
                  <button
                    type="button"
                    onClick={() => focusPreset("java")}
                    className="px-3 py-1 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 font-display font-semibold transition-colors"
                  >
                    Pulau Jawa
                  </button>
                  <button
                    type="button"
                    onClick={() => focusPreset("coast")}
                    className="px-3 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-display font-semibold transition-colors"
                  >
                    Pesisir Utara
                  </button>
                  <button
                    type="button"
                    onClick={() => focusPreset("outer")}
                    className="px-3 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 font-display font-semibold transition-colors"
                  >
                    Luar Jawa (Kalimantan & Bali)
                  </button>
                </div>

                <div className="text-[11px] text-white/40 font-body hidden md:flex items-center gap-1.5">
                  <Move className="w-3.5 h-3.5 text-blue-400" />
                  Drag peta untuk menggeser, scroll untuk zoom
                </div>
              </div>

              {/* ── MAP VIEWPORT CONTAINER (PAN & ZOOMABLE) ── */}
              <div
                ref={mapContainerRef}
                onPointerDown={handleMapPointerDown}
                onPointerMove={handleMapPointerMove}
                onPointerUp={handleMapPointerUp}
                onWheel={handleWheelZoom}
                className={`relative w-full h-[360px] sm:h-[440px] md:h-[480px] rounded-3xl overflow-hidden border border-[#60A5FA]/20 bg-[#061427] shadow-2xl select-none touch-none ${
                  isPanningMap ? "cursor-grabbing" : "cursor-grab"
                }`}
              >
                {/* Nautical Background & Compass Watermark */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#1E3A8A_1px,transparent_1px)] [background-size:24px_24px]"
                  style={{
                    transform: `translate(${pan.x * 0.2}px, ${pan.y * 0.2}px)`,
                  }}
                />

                {/* Compass Rose in Corner */}
                <div className="absolute top-4 right-4 pointer-events-none opacity-20 z-10 hidden sm:block">
                  <Compass className="w-20 h-20 text-blue-300" />
                </div>

                {/* Notification toast if any */}
                <AnimatePresence>
                  {recentNotification && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-[#1E293B]/90 backdrop-blur-md border border-white/20 text-white text-xs font-display font-semibold px-4 py-2 rounded-full shadow-xl pointer-events-none flex items-center gap-2 max-w-md text-center"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span>{recentNotification}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Floating Map Zoom & Reset Controls */}
                <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5 bg-[#0F172A]/80 backdrop-blur-md border border-white/15 p-1.5 rounded-2xl shadow-xl">
                  <button
                    type="button"
                    onClick={zoomIn}
                    className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm font-bold transition-colors"
                    title="Zoom In (+)"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <div className="text-[10px] font-display font-bold text-center text-white/60 py-0.5">
                    {Math.round(zoom * 100)}%
                  </div>
                  <button
                    type="button"
                    onClick={zoomOut}
                    className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm font-bold transition-colors"
                    title="Zoom Out (-)"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={resetCamera}
                    className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#D4AF37] text-xs font-bold transition-colors"
                    title="Reset Posisi Kamera"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Mini Viewport Radar Indicator */}
                <div className="absolute bottom-4 left-4 z-20 bg-[#0F172A]/85 backdrop-blur-md border border-white/15 p-2 rounded-xl hidden sm:flex flex-col gap-1 shadow-lg pointer-events-none">
                  <div className="flex items-center gap-1.5 text-[10px] font-display font-bold text-white/70">
                    <Layers className="w-3 h-3 text-blue-400" />
                    <span>Radar Nusantara</span>
                  </div>
                  <div className="relative w-28 h-14 bg-[#0A192F] rounded-lg overflow-hidden border border-white/10">
                    {/* Tiny silhouette islands */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-30 text-[8px] text-blue-200">
                      🇮🇩
                    </div>
                    {/* Viewport frame */}
                    <div
                      className="absolute border-2 border-blue-400 bg-blue-500/20 rounded-xs transition-all duration-75"
                      style={{
                        width: `${Math.max(25, 100 / zoom)}%`,
                        height: `${Math.max(25, 100 / zoom)}%`,
                        left: `${Math.max(0, Math.min(65, 35 - (pan.x / 400) * 35))}%`,
                        top: `${Math.max(0, Math.min(65, 30 - (pan.y / 300) * 30))}%`,
                      }}
                    />
                  </div>
                </div>

                {/* ── DRAGGABLE MAP INNER CANVAS (TRANSFORMED BY PAN & ZOOM) ── */}
                <div
                  className="absolute inset-0 w-full h-full flex items-center justify-center origin-center will-change-transform"
                  style={{
                    transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                    transition: isPanningMap ? "none" : "transform 0.15s ease-out",
                  }}
                >
                  <div className="relative w-[1100px] h-[580px] shrink-0">
                    {/* High Fidelity Indonesian Archipelago SVG */}
                    <svg
                      viewBox="0 0 1100 580"
                      className="w-full h-full drop-shadow-2xl"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        {/* Oceanic bathymetry gradient */}
                        <radialGradient id="oceanGlow" cx="45%" cy="65%" r="60%">
                          <stop offset="0%" stopColor="#133660" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#081426" stopOpacity="0.8" />
                        </radialGradient>

                        {/* Island landmass fill */}
                        <linearGradient id="islandGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#1E3E34" />
                          <stop offset="100%" stopColor="#11251F" />
                        </linearGradient>

                        {/* Island stroke / coastline */}
                        <linearGradient id="coastGlow" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.5" />
                          <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.5" />
                        </linearGradient>
                      </defs>

                      {/* Ocean Background Canvas */}
                      <rect width="1100" height="580" fill="url(#oceanGlow)" rx="24" />

                      {/* Latitude & Longitude Nautical Grid */}
                      <g stroke="#38BDF8" strokeOpacity="0.08" strokeDasharray="3,3" strokeWidth="1">
                        <line x1="0" y1="150" x2="1100" y2="150" />
                        <line x1="0" y1="290" x2="1100" y2="290" /> {/* Equator / Khatulistiwa */}
                        <line x1="0" y1="430" x2="1100" y2="430" />
                        <line x1="200" y1="0" x2="200" y2="580" />
                        <line x1="450" y1="0" x2="450" y2="580" />
                        <line x1="700" y1="0" x2="700" y2="580" />
                        <line x1="950" y1="0" x2="950" y2="580" />
                      </g>

                      {/* Khatulistiwa (Equator) text */}
                      <text
                        x="20"
                        y="285"
                        fill="#38BDF8"
                        fillOpacity="0.3"
                        fontSize="10"
                        fontFamily="monospace"
                        letterSpacing="2"
                      >
                        GARIS KHATULISTIWA (EQUATOR 0°)
                      </text>

                      {/* Shallow Water Coastal Halos */}
                      <g fill="none" stroke="#2DD4BF" strokeOpacity="0.12" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round">
                        {/* Sumatra coastal shelf */}
                        <path d="M 80,140 Q 120,120 160,170 L 220,260 Q 260,320 285,370 L 255,375 Q 160,250 80,140 Z" />
                        {/* Java coastal shelf */}
                        <path d="M 310,410 Q 430,410 550,442 L 545,450 Q 430,445 310,420 Z" />
                        {/* Kalimantan coastal shelf */}
                        <path d="M 370,260 Q 420,170 510,200 Q 530,290 450,345 Z" />
                        {/* Sulawesi coastal shelf */}
                        <path d="M 585,340 Q 610,275 600,200 Q 635,220 670,255 Q 635,310 585,340 Z" />
                      </g>

                      {/* ── LANDMASSES (PULAU-PULAU INDONESIA) ── */}
                      <g fill="url(#islandGradient)" stroke="url(#coastGlow)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
                        {/* 1. Pulau Sumatra */}
                        <path d="M 75,145 Q 105,115 140,145 L 185,215 Q 225,265 255,325 L 285,370 Q 275,385 255,375 L 210,320 Q 160,250 110,190 L 70,150 Z" />
                        {/* Kepulauan Nias & Mentawai */}
                        <ellipse cx="65" cy="195" rx="6" ry="16" transform="rotate(-35 65 195)" />
                        <ellipse cx="115" cy="285" rx="5" ry="18" transform="rotate(-35 115 285)" />
                        {/* Bangka Belitung */}
                        <ellipse cx="305" cy="310" rx="14" ry="10" />
                        <ellipse cx="335" cy="325" rx="8" ry="7" />

                        {/* 2. Pulau Jawa */}
                        <path d="M 310,412 Q 345,406 385,410 Q 430,412 480,410 Q 520,416 552,442 L 548,452 Q 500,444 450,448 Q 400,450 350,436 L 310,422 Z" />

                        {/* 3. Pulau Madura */}
                        <path d="M 515,404 Q 542,400 558,410 Q 540,416 515,414 Z" />

                        {/* 4. Kepulauan Nusa Tenggara & Bali */}
                        {/* Bali */}
                        <path d="M 568,444 Q 582,440 588,448 Q 580,456 568,450 Z" />
                        {/* Lombok */}
                        <path d="M 598,448 Q 610,446 616,452 Q 608,458 598,454 Z" />
                        {/* Sumbawa */}
                        <path d="M 625,448 Q 648,445 660,452 Q 645,460 625,455 Z" />
                        {/* Flores */}
                        <path d="M 670,450 Q 700,448 718,456 Q 695,462 670,458 Z" />
                        {/* Timor Barat */}
                        <ellipse cx="740" cy="475" rx="18" ry="8" transform="rotate(-15 740 475)" />

                        {/* 5. Pulau Kalimantan */}
                        <path d="M 370,260 Q 380,200 420,170 Q 470,165 510,200 Q 530,240 520,290 Q 490,340 450,345 Q 400,340 375,300 Z" />

                        {/* 6. Pulau Sulawesi */}
                        <path d="M 585,340 Q 595,290 610,275 Q 600,240 595,200 Q 620,175 640,190 Q 625,220 620,260 Q 640,250 670,255 Q 650,275 625,280 Q 635,310 655,335 Q 635,345 615,315 Q 605,345 585,340 Z" />

                        {/* 7. Kepulauan Maluku & Halmahera */}
                        <path d="M 708,235 Q 725,220 735,245 Q 720,265 708,235 Z" />
                        <path d="M 718,290 Q 735,280 740,305 Q 725,315 718,290 Z" />
                        <ellipse cx="750" cy="340" rx="12" ry="6" />

                        {/* 8. Pulau Papua */}
                        <path d="M 770,250 Q 800,230 840,250 Q 900,260 970,300 L 970,360 Q 910,365 850,340 Q 810,310 780,275 Z" />
                      </g>

                      {/* Subtle Mountain Ridges / Texture Highlights */}
                      <g stroke="#D4AF37" strokeOpacity="0.25" strokeWidth="1" fill="none">
                        {/* Bukit Barisan Sumatra */}
                        <path d="M 110,165 Q 160,230 230,320" />
                        {/* Pegunungan Jawa */}
                        <path d="M 330,416 Q 420,418 510,422" />
                        {/* Pegunungan Muller Kalimantan */}
                        <path d="M 430,210 Q 450,250 470,280" />
                      </g>

                      {/* Island Name Labels on Map */}
                      <g
                        fontSize="11"
                        fontFamily="var(--font-cinzel), serif"
                        fontWeight="bold"
                        fill="#E2E8F0"
                        fillOpacity="0.35"
                        letterSpacing="3"
                        pointerEvents="none"
                      >
                        <text x="140" y="240" transform="rotate(-30 140 240)">
                          SUMATRA
                        </text>
                        <text x="410" y="230">
                          KALIMANTAN
                        </text>
                        <text x="615" y="245">
                          SULAWESI
                        </text>
                        <text x="360" y="470">
                          PULAU JAWA
                        </text>
                        <text x="850" y="295">
                          PAPUA
                        </text>
                      </g>
                    </svg>

                    {/* ── REGION SENTRA PINS ON THE MAP ── */}
                    {REGIONS.map((region) => {
                      const placedData = placedPins[region.id];
                      const isHovered = hoveredPinId === region.id;
                      const isFlashCorrect =
                        flashPinId?.id === region.id && flashPinId.status === "correct";
                      const isFlashWrong =
                        flashPinId?.id === region.id && flashPinId.status === "wrong";
                      const isTargetForSelected =
                        selectedCard && selectedCard.regionId === region.id;

                      return (
                        <div
                          key={region.id}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-auto"
                          style={{ left: `${region.x}px`, top: `${region.y}px` }}
                        >
                          <button
                            ref={(el) => {
                              pinRefs.current[region.id] = el;
                            }}
                            type="button"
                            onClick={() => handlePinTap(region.id)}
                            className={`relative group flex items-center justify-center transition-all duration-200 focus:outline-hidden ${
                              isHovered || isFlashCorrect
                                ? "scale-135"
                                : isFlashWrong
                                ? "scale-90"
                                : "scale-100 hover:scale-115"
                            }`}
                          >
                            {/* Magnetic radar ripple if hovered or selected */}
                            {(isHovered || isTargetForSelected) && (
                              <span className="absolute -inset-3 rounded-full bg-blue-400/30 animate-ping pointer-events-none" />
                            )}

                            {/* Pin Container Head */}
                            <div
                              className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg transition-colors ${
                                isFlashCorrect || placedData
                                  ? "bg-emerald-500 border-emerald-300 text-white shadow-emerald-500/50"
                                  : isFlashWrong
                                  ? "bg-red-500 border-red-300 text-white shadow-red-500/50"
                                  : isHovered
                                  ? "bg-[#D4AF37] border-white text-[#1A1614] shadow-[#D4AF37]/50"
                                  : isTargetForSelected
                                  ? "bg-blue-500 border-blue-300 text-white animate-pulse"
                                  : "bg-[#0F172A]/90 border-white/40 text-blue-300 hover:border-white hover:bg-blue-600 hover:text-white"
                              }`}
                            >
                              {placedData ? (
                                <div className="relative w-full h-full rounded-full overflow-hidden border border-white/40">
                                  <Image
                                    src={placedData.card.image}
                                    alt={placedData.card.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : isFlashCorrect ? (
                                <Check className="w-4 h-4 text-white stroke-[3]" />
                              ) : isFlashWrong ? (
                                <XCircle className="w-4 h-4 text-white" />
                              ) : (
                                <MapPin className="w-4 h-4" />
                              )}
                            </div>

                            {/* Pointer needle under the pin */}
                            <div
                              className={`w-1.5 h-2 -mt-0.5 rounded-b-full transition-colors ${
                                isFlashCorrect || placedData
                                  ? "bg-emerald-400"
                                  : isHovered
                                  ? "bg-[#D4AF37]"
                                  : "bg-white/40"
                              }`}
                            />
                          </button>

                          {/* Pin Label */}
                          <div
                            className={`mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-display font-bold whitespace-nowrap shadow-md pointer-events-none transition-all ${
                              placedData
                                ? "bg-emerald-950/90 text-emerald-300 border border-emerald-500/40"
                                : isHovered
                                ? "bg-[#D4AF37] text-[#1A1614] scale-110"
                                : isTargetForSelected
                                ? "bg-blue-900/90 text-blue-200 border border-blue-400/50"
                                : "bg-[#0A1424]/85 text-white/90 border border-white/15"
                            }`}
                          >
                            <span>{region.shortName}</span>
                            {placedData && (
                              <span className="ml-1 text-[9px] text-emerald-400 font-normal">
                                ({placedData.card.name})
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Floating Drag Ghost Card while moving */}
                {isDraggingCard && currentCard && (
                  <div
                    className="fixed pointer-events-none z-50 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-2xl bg-[#1A1816] flex flex-col items-center p-1"
                    style={{
                      width: 90,
                      height: 90,
                      left: dragPos.x - 45,
                      top: dragPos.y - 45,
                      transform: hoveredPinId
                        ? "scale(1.15) rotate(0deg)"
                        : "scale(1.05) rotate(6deg)",
                      transition: "transform 0.1s ease",
                    }}
                  >
                    <div className="relative w-full h-full rounded-xl overflow-hidden">
                      <Image
                        src={currentCard.image}
                        alt={currentCard.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {hoveredPinId && (
                      <span className="absolute bottom-1 bg-[#D4AF37] text-[#1A1614] font-display font-extrabold text-[9px] px-1.5 py-0.5 rounded-sm shadow-md">
                        Lepas di sini!
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* ── BOTTOM DOCK: ACTIVE MOTIF CARD TRAY ── */}
              {currentCard && (
                <div className="bg-[#1A1816] border border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-4 shadow-xl">
                  {/* Draggable Active Card */}
                  <div className="flex items-center gap-3 shrink-0">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      animate={{
                        scale: selectedCard ? 1.05 : 1,
                        boxShadow: selectedCard
                          ? "0 0 0 3px #60A5FA, 0 10px 25px -5px rgba(96, 165, 250, 0.4)"
                          : "none",
                      }}
                      onPointerDown={handleCardPointerDown}
                      onClick={handleCardTap}
                      className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-blue-400/60 cursor-grab active:cursor-grabbing touch-none select-none shadow-lg group bg-[#2A2421]"
                    >
                      <Image
                        src={currentCard.image}
                        alt={currentCard.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-1 left-1 right-1 flex justify-center">
                        <span className="bg-black/70 backdrop-blur-xs text-[#D4AF37] text-[9px] font-display font-bold px-1.5 py-0.5 rounded-sm border border-[#D4AF37]/30 uppercase">
                          Tarik Saya
                        </span>
                      </div>
                    </motion.div>

                    <div className="sm:hidden">
                      <span className="text-[10px] font-display font-bold text-blue-400 bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 rounded-full">
                        {currentCard.category}
                      </span>
                      <h3 className="font-display font-bold text-base text-white mt-0.5">
                        {currentCard.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Narrative & Helper */}
                  <div className="flex-1 text-center sm:text-left">
                    <div className="hidden sm:inline-flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-display font-bold text-blue-400 bg-blue-500/15 border border-blue-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {currentCard.category}
                      </span>
                      <span className="text-white/40 text-xs font-body">
                        {queue.length + 1} motif tersisa
                      </span>
                    </div>

                    <h3 className="hidden sm:block font-display font-bold text-lg text-white">
                      {currentCard.name}
                    </h3>

                    <p className="text-white/60 text-xs sm:text-sm font-narrative mt-1 line-clamp-2">
                      {currentCard.philosophy}
                    </p>

                    <p className="text-blue-300/80 text-xs font-display font-medium mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>
                        {selectedCard
                          ? "Kartu terpilih: Sekarang geser peta lalu ketuk pin kota tujuan!"
                          : "Drag kartu ke atas pin peta yang tepat, atau ketuk kartu untuk memilih."}
                      </span>
                    </p>
                  </div>

                  {/* Upcoming Queue Thumbnails */}
                  <div className="hidden md:flex items-center gap-2 pl-4 border-l border-white/10 shrink-0">
                    <div className="text-right mr-1">
                      <p className="text-[10px] font-display font-bold text-white/40 uppercase">
                        Antrean:
                      </p>
                      <p className="text-xs font-display font-bold text-white/70">
                        {queue.length} motif
                      </p>
                    </div>
                    {queue.slice(0, 3).map((card, i) => (
                      <div
                        key={card.id}
                        className="relative rounded-xl overflow-hidden border border-white/20 opacity-60 shadow-sm"
                        style={{
                          width: 44,
                          height: 44,
                          transform: `scale(${1 - i * 0.08})`,
                        }}
                      >
                        <Image
                          src={card.image}
                          alt={card.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Placed state */}
              {!currentCard && (
                <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-4 text-center">
                  <div className="inline-flex items-center gap-2 text-emerald-300 font-display font-bold text-base">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Luar biasa! Semua kartu batik berhasil ditempatkan di Nusantara.</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              DONE SCREEN (SUMMARY & REWARD MODAL)
             ══════════════════════════════════════════════════════════════════ */}
          {gameState === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto px-4 py-12 flex flex-col items-center text-center gap-8"
            >
              <div className="relative">
                <div className="w-28 h-28 rounded-3xl bg-[#D4AF37]/10 border-2 border-[#D4AF37]/40 flex items-center justify-center shadow-2xl shadow-[#D4AF37]/20">
                  <Trophy className="w-14 h-14 text-[#D4AF37]" />
                </div>
                <div className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-1.5 shadow-md">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </div>

              <div>
                <span className="text-xs font-display font-extrabold text-[#D4AF37] uppercase tracking-wider bg-[#D4AF37]/10 border border-[#D4AF37]/25 px-4 py-1 rounded-full mb-3 inline-block">
                  Sesi Sortir Peta Selesai
                </span>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-2">
                  Penjelajah Wastra Nusantara
                </h2>
                <p className="text-white/70 font-body max-w-md mx-auto text-sm">
                  {score === totalCards
                    ? "Sempurna! Kamu berhasil menempatkan seluruh motif batik ke daerah asalnya dengan akurasi 100%."
                    : `Kamu berhasil menempatkan ${score} dari total ${totalCards} motif batik ke daerah asalnya.`}
                </p>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-3 gap-3 w-full">
                <div className="bg-[#1A1816] border border-white/10 rounded-2xl p-4 text-center">
                  <p className="text-white/40 text-[11px] font-body mb-1">Benar</p>
                  <p className="font-display font-bold text-2xl sm:text-3xl text-white">{score}</p>
                  <p className="text-white/40 text-[10px] font-body">dari {totalCards} motif</p>
                </div>

                <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/25 rounded-2xl p-4 text-center">
                  <p className="text-[#D4AF37]/70 text-[11px] font-body mb-1">XP Diperoleh</p>
                  <p className="font-display font-bold text-2xl sm:text-3xl text-[#D4AF37]">
                    +{earnedXp}
                  </p>
                  <p className="text-[#D4AF37]/50 text-[10px] font-body">XP Tambahan</p>
                </div>

                <div className="bg-[#1A1816] border border-white/10 rounded-2xl p-4 text-center">
                  <p className="text-white/40 text-[11px] font-body mb-1">Akurasi</p>
                  <p className="font-display font-bold text-2xl sm:text-3xl text-emerald-400">
                    {Math.round((score / totalCards) * 100)}%
                  </p>
                  <p className="text-white/40 text-[10px] font-body">Ketepatan Sentra</p>
                </div>
              </div>

              {/* Placed Showcase Chips */}
              <div className="w-full bg-[#1A1816] border border-white/10 rounded-2xl p-4 text-left">
                <p className="text-xs font-display font-bold text-white/70 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Motif yang Berhasil Dipasangkan:
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(placedPins).map(([regionId, data]) => {
                    const reg = REGIONS.find((r) => r.id === regionId);
                    return (
                      <span
                        key={regionId}
                        className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1 text-xs text-white/90"
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                        <strong>{data.card.name}</strong>
                        <span className="text-white/40">({reg?.name})</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startGame}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-display font-extrabold py-3.5 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/20"
                >
                  Jelajah Ulang Sesi Peta
                </motion.button>
                <button
                  type="button"
                  onClick={() => setGameState("idle")}
                  className="flex items-center justify-center gap-2 border border-white/15 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-display font-semibold px-6 py-3.5 rounded-xl transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Menu Game</span>
                </button>
                <Link
                  href="/play"
                  className="flex items-center justify-center gap-2 border border-white/15 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] font-display font-semibold px-6 py-3.5 rounded-xl transition-all"
                >
                  <span>Pilih Game Lain</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
