"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Timer,
  Trophy,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Volume2,
  VolumeX,
  Flame,
  Info,
  Check,
  Compass,
} from "lucide-react";
import confetti from "canvas-confetti";
import Image from "next/image";
import Link from "next/link";
import { GameNavbar } from "@/components/shared/GameNavbar";
import { useXp } from "@/hooks/useXp";
import type { RegionData, PlacedItem } from "./SortirMaplibreMap";

// Dynamic import Leaflet map with ssr: false for Next.js 16 SSR safety
const SortirMaplibreMap = dynamic(() => import("./SortirMaplibreMap"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-2xl sm:rounded-3xl border border-[#D4AF37]/20 bg-[#0F172A] flex flex-col items-center justify-center gap-3 text-white"
      style={{ height: 460, minHeight: 400 }}
    >
      <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
      <p className="font-display font-bold text-sm text-blue-200">
        Memuat Basemap Geografis Nusantara...
      </p>
    </div>
  ),
});

// ── Web Audio Sound Synthesizer ──────────────────────────────────────────────
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

// ── 10 Sentra Geografis Resmi (Koordinat Peta Nyata) ─────────────────────────
export const REGIONS_DATA: RegionData[] = [
  {
    id: "jakarta",
    name: "DKI Jakarta (Betawi)",
    shortName: "Jakarta",
    province: "DKI Jakarta",
    island: "Jawa",
    lat: -6.2088,
    lng: 106.8456,
    radiusMeters: 28000,
    description: "Sentra Batik Betawi Ondel-ondel dan Pucuk Rebung",
  },
  {
    id: "garut",
    name: "Garut (Priangan)",
    shortName: "Garut",
    province: "Jawa Barat",
    island: "Jawa",
    lat: -7.2274,
    lng: 107.9087,
    radiusMeters: 30000,
    description: "Batik Priangan Sunda, Sentra Merak Ngibing dan Lereng Gumading",
  },
  {
    id: "cirebon",
    name: "Cirebon",
    shortName: "Cirebon",
    province: "Jawa Barat",
    island: "Jawa",
    lat: -6.732,
    lng: 108.5523,
    radiusMeters: 30000,
    description: "Pesisir Utara, Sentra Mega Mendung dan Singa Barong",
  },
  {
    id: "pekalongan",
    name: "Pekalongan",
    shortName: "Pekalongan",
    province: "Jawa Tengah",
    island: "Jawa",
    lat: -6.8886,
    lng: 109.6753,
    radiusMeters: 32000,
    description: "Kota Batik Dunia, Sentra Jlamprang dan Buketan",
  },
  {
    id: "yogyakarta",
    name: "D.I. Yogyakarta",
    shortName: "Yogyakarta",
    province: "D.I. Yogyakarta",
    island: "Jawa",
    lat: -7.7956,
    lng: 110.3695,
    radiusMeters: 32000,
    description: "Keraton Mataram, Sentra Kawung, Parang, dan Sekar Jagad",
  },
  {
    id: "surakarta",
    name: "Surakarta (Solo)",
    shortName: "Solo",
    province: "Jawa Tengah",
    island: "Jawa",
    lat: -7.5755,
    lng: 110.8243,
    radiusMeters: 32000,
    description: "Keraton Kasunanan, Sentra Sido Mukti, Truntum, dan Wirasat",
  },
  {
    id: "lasem",
    name: "Lasem (Rembang)",
    shortName: "Lasem",
    province: "Jawa Tengah",
    island: "Jawa",
    lat: -6.6917,
    lng: 111.4528,
    radiusMeters: 30000,
    description: "Pusaka Tiongkok Kecil, Sentra Batik Liong Merah Getih Pitik",
  },
  {
    id: "madura",
    name: "Bangkalan (Madura)",
    shortName: "Madura",
    province: "Jawa Timur",
    island: "Madura",
    lat: -7.0456,
    lng: 112.9357,
    radiusMeters: 35000,
    description: "Pesisiran Madura, Warna Berani Gentongan dan Karapan",
  },
  {
    id: "bali",
    name: "Denpasar (Bali)",
    shortName: "Bali",
    province: "Bali",
    island: "Bali",
    lat: -8.6705,
    lng: 115.2126,
    radiusMeters: 35000,
    description: "Wastra Dewata, Sentra Singa Ambara Raja dan Barong",
  },
  {
    id: "kalimantan",
    name: "Kalimantan",
    shortName: "Kalimantan",
    province: "Kalimantan Tengah",
    island: "Kalimantan",
    lat: -1.6815,
    lng: 113.3823,
    radiusMeters: 75000,
    description: "Wastra Dayak Batang Garing (Pohon Kehidupan) dan Tameng Telawang",
  },
];

// ── 10 Kartu Motif Resmi Acuan Tim ───────────────────────────────────────────
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

const ROUND_DURATION = 90;

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

type GameState = "idle" | "playing" | "done";

export default function SortirPetaPage() {
  const { addXp } = useXp();
  const [gameState, setGameState] = useState<GameState>("idle");
  const [queue, setQueue] = useState<MotifCard[]>([]);
  const [currentCard, setCurrentCard] = useState<MotifCard | null>(null);
  const [placedItems, setPlacedItems] = useState<Record<string, PlacedItem>>({});
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [earnedXp, setEarnedXp] = useState(0);
  const [soundOn, setSoundOn] = useState(true);

  // Drag Card State
  const [isDraggingCard, setIsDraggingCard] = useState(false);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<MotifCard | null>(null);
  const [flashRegion, setFlashRegion] = useState<{ id: string; status: "correct" | "wrong" } | null>(null);
  const [recentNotification, setRecentNotification] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dropTimeRef = useRef<number>(Date.now());

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
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#D4AF37", "#60A5FA", "#10B981", "#F59E0B"],
      });
    } catch {
      // Confetti fallback
    }
  }, [stopTimer]);

  const startGame = useCallback(() => {
    const shuffled = shuffleArray(MOTIF_CARDS);
    setQueue(shuffled.slice(1));
    setCurrentCard(shuffled[0]);
    setPlacedItems({});
    setScore(0);
    setStreak(0);
    setTimeLeft(ROUND_DURATION);
    setEarnedXp(0);
    setSelectedCard(null);
    setHoveredRegionId(null);
    setFlashRegion(null);
    setRecentNotification(null);
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

      const targetRegion = REGIONS_DATA.find((r) => r.id === regionId);
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

        setPlacedItems((prev) => ({
          ...prev,
          [regionId]: {
            regionId,
            cardName: currentCard.name,
            cardImage: currentCard.image,
          },
        }));

        setFlashRegion({ id: regionId, status: "correct" });
        setRecentNotification(
          `Bagus! ${currentCard.name} tepat berada di sentra ${targetRegion?.name} (+${reward} XP)`
        );

        setTimeout(() => {
          setFlashRegion(null);
        }, 1200);

        const nextCard = queue[0] ?? null;
        setQueue((prev) => prev.slice(1));
        setCurrentCard(nextCard);
        setSelectedCard(null);
        setHoveredRegionId(null);
        dropTimeRef.current = Date.now();

        if (!nextCard) {
          setTimeout(() => endGame(), 700);
        }
      } else {
        sfx.playWrong();
        setStreak(0);
        setFlashRegion({ id: regionId, status: "wrong" });
        setRecentNotification(
          `Kurang tepat: ${currentCard.name} bukan dari ${targetRegion?.name}. Teliti letak geografisnya!`
        );

        setTimeout(() => {
          setFlashRegion(null);
        }, 900);
      }
    },
    [currentCard, gameState, queue, streak, addXp, endGame]
  );

  const pointerStartPosRef = useRef({ x: 0, y: 0 });

  // Drag Card Handlers
  const handleCardPointerDown = (e: React.PointerEvent) => {
    if (gameState !== "playing" || !currentCard) return;
    pointerStartPosRef.current = { x: e.clientX, y: e.clientY };
    setDragPos({ x: e.clientX, y: e.clientY });
    setIsDraggingCard(true);
    sfx.playSnap();
  };

  // Window pointer listeners for smooth dragging across canvas without pointer-capture blocks
  useEffect(() => {
    if (!isDraggingCard) return;

    const handlePointerMove = (e: PointerEvent) => {
      setDragPos({ x: e.clientX, y: e.clientY });
    };

    const handlePointerUp = (e: PointerEvent) => {
      const moveDist = Math.hypot(
        e.clientX - pointerStartPosRef.current.x,
        e.clientY - pointerStartPosRef.current.y
      );

      setIsDraggingCard(false);

      // If it was just a quick tap (movement < 8px), toggle card selection
      if (moveDist < 8) {
        setSelectedCard((prev) => (prev?.id === currentCard?.id ? null : currentCard));
        return;
      }

      // If dragged and released over a detected region
      if (hoveredRegionId) {
        handleDropOnRegion(hoveredRegionId);
        setHoveredRegionId(null);
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDraggingCard, hoveredRegionId, handleDropOnRegion, currentCard]);

  const timerPercent = (timeLeft / ROUND_DURATION) * 100;
  const timerColor =
    timerPercent > 50 ? "#10B981" : timerPercent > 20 ? "#F59E0B" : "#EF4444";
  const totalCards = MOTIF_CARDS.length;

  return (
    <div className="min-h-screen bg-[#141211] text-white flex flex-col font-body selection:bg-[#D4AF37] selection:text-[#1A1614] overflow-x-hidden">
      <GameNavbar title="Sortir Motif ke Peta Basemap" />

      <main className="pt-14 sm:pt-16 flex-1 flex flex-col">
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
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#713f2c]/40 via-[#4a2511]/30 to-[#1A1816] border-2 border-[#D4AF37]/40 flex items-center justify-center shadow-2xl shadow-[#D4AF37]/15">
                  <Compass className="w-12 h-12 text-[#D4AF37] animate-pulse" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#D4AF37] text-[#1A1614] rounded-full p-1.5 shadow-md">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[#D4AF37] text-xs font-display font-bold px-4 py-1.5 rounded-full mb-3 tracking-wider uppercase">
                  <MapPin className="w-3.5 h-3.5" /> Peta Geografis Basemap Interaktif
                </div>
                <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mb-3">
                  Sortir Motif ke <span className="text-[#D4AF37]">Basemap Nusantara</span>
                </h1>
                <p className="text-white/70 font-body max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                  Jelajahi peta bumi Nusantara berbasis Basemap geografis nyata.
                  Cocokkan motif batik ke zona daerahnya masing-masing secara interaktif!
                </p>
              </div>

              {/* Interactive Features Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl text-left">
                <div className="bg-[#1A1816] border border-white/10 rounded-2xl p-3.5 flex flex-col gap-1">
                  <p className="text-[11px] text-white/50 font-body">Mesin Peta</p>
                  <p className="text-[#D4AF37] font-display font-bold text-xs">Real Basemap</p>
                </div>
                <div className="bg-[#1A1816] border border-white/10 rounded-2xl p-3.5 flex flex-col gap-1">
                  <p className="text-[11px] text-white/50 font-body">Zona Wilayah</p>
                  <p className="text-emerald-400 font-display font-bold text-xs">10 Sentra Asli</p>
                </div>
                <div className="bg-[#1A1816] border border-white/10 rounded-2xl p-3.5 flex flex-col gap-1">
                  <p className="text-[11px] text-white/50 font-body">Snapping</p>
                  <p className="text-[#D4AF37] font-display font-bold text-xs">Deteksi Magnetis</p>
                </div>
                <div className="bg-[#1A1816] border border-white/10 rounded-2xl p-3.5 flex flex-col gap-1">
                  <p className="text-[11px] text-white/50 font-body">Durasi</p>
                  <p className="text-purple-300 font-display font-bold text-xs">90 Detik</p>
                </div>
              </div>

              {/* Instructions Callout */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 max-w-xl text-left text-xs text-white/70 space-y-2">
                <div className="flex items-center gap-2 text-white font-display font-bold">
                  <Info className="w-4 h-4 text-[#D4AF37]" />
                  <span>Petunjuk Permainan:</span>
                </div>
                <ul className="space-y-1 pl-5 list-disc text-white/60">
                  <li>
                    <strong className="text-white">Peta Basemap Nyata:</strong> Drag dan pan peta
                    ke seluruh pelosok Indonesia, atau gunakan tombol zoom dan preset fokus wilayah.
                  </li>
                  <li>
                    <strong className="text-white">Pencocokan Zona Daerah:</strong> Tarik kartu batik
                    ke lingkaran zona wilayah di peta. Zona akan menyala saat kartu terdeteksi!
                  </li>
                  <li>
                    <strong className="text-white">Mode Ketuk:</strong> Anda juga bisa mengetuk kartu
                    lalu mengetuk lingkaran daerah tujuan di peta.
                  </li>
                </ul>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={startGame}
                className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#D4AF37] text-[#1A1614] font-display font-extrabold px-10 py-4 rounded-2xl text-base hover:brightness-105 transition-all shadow-xl shadow-[#D4AF37]/25 border border-[#D4AF37]/40 cursor-pointer"
              >
                <Compass className="w-5 h-5 text-[#1A1614]" />
                <span>Mulai Jelajah Basemap</span>
              </motion.button>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              PLAYING SCREEN (REAL BASEMAP INTERACTION)
             ══════════════════════════════════════════════════════════════════ */}
          {gameState === "playing" && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-3 sm:px-6 py-1 sm:py-2 gap-2 sm:gap-2.5"
            >
              {/* Top Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 bg-[#1A1816] border border-white/10 rounded-2xl px-3.5 py-1.5 sm:py-2 shadow-lg">
                {/* Timer */}
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5">
                    <Timer className="w-4 h-4 text-blue-400" />
                    <span className="font-display font-extrabold text-sm text-white">
                      {timeLeft}s
                    </span>
                  </div>
                  <div className="w-20 sm:w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: `${timerPercent}%`, backgroundColor: timerColor }}
                      transition={{ duration: 0.3 }}
                      className="h-full rounded-full"
                    />
                  </div>
                </div>

                {/* Score & Streak */}
                <div className="flex items-center gap-3">
                  {streak > 1 && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-display font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full animate-bounce">
                      <Flame className="w-3 h-3 fill-amber-400" />
                      {streak}x Kombo
                    </span>
                  )}

                  <div className="text-xs font-display font-semibold text-white/80">
                    Selesai:{" "}
                    <span className="text-[#60A5FA] font-bold">
                      {score}/{totalCards}
                    </span>
                  </div>

                  <div className="text-xs font-display font-bold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/25 px-2.5 py-0.5 rounded-lg">
                    +{earnedXp} XP
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleSound}
                    className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
                    title={soundOn ? "Matikan Suara" : "Nyalakan Suara"}
                  >
                    {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Notification Toast */}
              <AnimatePresence>
                {recentNotification && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-[#1E293B]/90 backdrop-blur-md border border-white/20 text-white text-xs font-display font-semibold px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-2 max-w-md mx-auto text-center"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    <span>{recentNotification}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── REAL BASEMAP CANVAS COMPONENT ── */}
              <SortirMaplibreMap
                regions={REGIONS_DATA}
                placedItems={placedItems}
                activeCard={currentCard}
                selectedCard={selectedCard}
                flashRegion={flashRegion}
                onSelectRegion={(regionId) => handleDropOnRegion(regionId)}
                isDraggingCard={isDraggingCard}
                dragPos={dragPos}
                onHoverRegionChange={setHoveredRegionId}
              />

              {/* Floating Ghost Card while Dragging */}
              {isDraggingCard && currentCard && (
                <div
                  className="fixed pointer-events-none z-50 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-2xl bg-[#1A1816] flex flex-col items-center p-1"
                  style={{
                    width: 75,
                    height: 75,
                    left: dragPos.x - 37,
                    top: dragPos.y - 37,
                    transform: hoveredRegionId
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
                  {hoveredRegionId && (
                    <span className="absolute -bottom-3 bg-emerald-500 text-white font-display font-extrabold text-[10px] px-2.5 py-0.5 rounded-full shadow-xl border border-white/50 whitespace-nowrap animate-bounce">
                      Lepas di {REGIONS_DATA.find((r) => r.id === hoveredRegionId)?.shortName}!
                    </span>
                  )}
                </div>
              )}

              {/* ── BOTTOM DOCK: ACTIVE MOTIF CARD TRAY ── */}
              {currentCard && (
                <div className="bg-[#1A1816] border border-white/10 rounded-2xl p-2.5 sm:p-3 flex items-center gap-3 sm:gap-4 shadow-xl">
                  {/* Draggable Active Card */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      animate={{
                        scale: selectedCard ? 1.05 : 1,
                        boxShadow: selectedCard
                          ? "0 0 0 3px #D4AF37, 0 10px 25px -5px rgba(212, 175, 55, 0.5)"
                          : "none",
                      }}
                      onPointerDown={handleCardPointerDown}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden border-2 cursor-grab active:cursor-grabbing touch-none select-none shadow-lg group bg-[#2A2421] transition-colors shrink-0 ${
                        selectedCard ? "border-[#D4AF37]" : "border-[#D4AF37]/40 hover:border-[#D4AF37]"
                      }`}
                    >
                      <Image
                        src={currentCard.image}
                        alt={currentCard.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-1 left-1 right-1 flex justify-center">
                        <span className="bg-black/80 backdrop-blur-xs text-[#D4AF37] text-[8px] sm:text-[9px] font-display font-extrabold px-1.5 py-0.5 rounded-sm border border-[#D4AF37]/40 uppercase tracking-wider">
                          {selectedCard ? "Terpilih" : "Tarik Saya"}
                        </span>
                      </div>
                    </motion.div>

                    <div className="sm:hidden min-w-0">
                      <span className="text-[9px] font-display font-bold text-[#D4AF37] bg-[#D4AF37]/15 border border-[#D4AF37]/30 px-1.5 py-0.5 rounded-full">
                        {currentCard.category}
                      </span>
                      <h3 className="font-display font-bold text-sm text-white mt-0.5 truncate">
                        {currentCard.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Narrative & Helper */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="hidden sm:inline-flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-display font-bold text-[#D4AF37] bg-[#D4AF37]/15 border border-[#D4AF37]/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {currentCard.category}
                      </span>
                      <span className="text-white/40 text-xs font-body">
                        {queue.length + 1} motif tersisa
                      </span>
                    </div>

                    <h3 className="hidden sm:block font-display font-bold text-base text-white truncate">
                      {currentCard.name}
                    </h3>

                    <p className="text-white/60 text-xs font-narrative mt-0.5 line-clamp-1 sm:line-clamp-2">
                      {currentCard.philosophy}
                    </p>

                    <p className="text-blue-300/80 text-[11px] font-display font-medium mt-0.5 hidden sm:flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                      <span>
                        {selectedCard
                          ? "Kartu terpilih: Geser peta dan ketuk zona daerah yang tepat!"
                          : "Tarik kartu ke atas daerah tujuan di peta, atau ketuk untuk memilih."}
                      </span>
                    </p>
                  </div>

                  {/* Action Button: Tap-to-Place Guide */}
                  <div className="flex flex-col items-center sm:items-end gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedCard(selectedCard ? null : currentCard)}
                      className={`text-xs font-display font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedCard
                          ? "bg-[#D4AF37] text-[#1A1614] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/30"
                          : "bg-white/5 hover:bg-white/10 text-white border-white/15 hover:border-white/30"
                      }`}
                    >
                      {selectedCard && <Check className="w-3.5 h-3.5 text-[#1A1614]" />}
                      <span>{selectedCard ? "Siap Pilih" : "Ketuk Pilih"}</span>
                    </button>
                    <span className="text-[9px] text-white/40 font-body hidden sm:inline">
                      atau Drag ke peta
                    </span>
                  </div>

                  {/* Upcoming Queue Thumbnails */}
                  <div className="hidden md:flex items-center gap-1.5 pl-3 border-l border-white/10 shrink-0">
                    <div className="text-right mr-1">
                      <p className="text-[9px] font-display font-bold text-white/40 uppercase">
                        Antrean:
                      </p>
                      <p className="text-xs font-display font-bold text-white/70">
                        {queue.length} motif
                      </p>
                    </div>
                    {queue.slice(0, 3).map((card, i) => (
                      <div
                        key={card.id}
                        className="relative rounded-lg overflow-hidden border border-white/20 opacity-60 shadow-sm"
                        style={{
                          width: 36,
                          height: 36,
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

              {/* All Placed State */}
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
                  {Object.entries(placedItems).map(([regionId, item]) => {
                    const reg = REGIONS_DATA.find((r) => r.id === regionId);
                    return (
                      <span
                        key={regionId}
                        className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1 text-xs text-white/90"
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                        <strong>{item.cardName}</strong>
                        <span className="text-white/40">({reg?.name})</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startGame}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#D4AF37] text-[#1A1614] font-display font-bold py-3.5 px-4 rounded-xl hover:brightness-105 transition-all shadow-lg shadow-[#D4AF37]/20 border border-[#D4AF37]/40 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-[#1A1614]" />
                  <span>Jelajah Ulang</span>
                </motion.button>
                <button
                  type="button"
                  onClick={() => setGameState("idle")}
                  className="w-full flex items-center justify-center gap-2 border border-white/15 bg-white/5 hover:bg-white/10 text-white font-display font-semibold py-3.5 px-4 rounded-xl transition-all hover:border-white/30 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-[#D4AF37]" />
                  <span>Halaman Awal</span>
                </button>
                <Link
                  href="/play"
                  className="w-full flex items-center justify-center gap-2 border border-white/15 bg-white/5 hover:bg-white/10 text-white font-display font-semibold py-3.5 px-4 rounded-xl transition-all hover:border-white/30 cursor-pointer"
                >
                  <Trophy className="w-4 h-4 text-emerald-400" />
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
