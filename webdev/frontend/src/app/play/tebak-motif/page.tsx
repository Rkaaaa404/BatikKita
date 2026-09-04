"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Brain, ChevronRight, CheckCircle, XCircle, Lightbulb, RotateCcw, Trophy } from "lucide-react";
import { GameNavbar } from "@/components/shared/GameNavbar";
import { useXp } from "@/hooks/useXp";

// ── Data Motif & Hint ────────────────────────────────────────────────────────
interface MotifData {
  id: string;
  name: string;
  region: string;
  category: string;
  image: string;
  philosophy: string;
  hint1: string; // paling samar
  hint2: string; // kategori/rumpun
  hint3: string; // asal daerah
  hint4: string; // ciri visual
}

const MOTIF_POOL: MotifData[] = [
  {
    id: "kawung",
    name: "Kawung",
    region: "D.I. Yogyakarta",
    category: "Batik Keraton",
    image: "/images/batik-kawung.jpg",
    philosophy: "Pola 4 kelopak buah aren melambangkan empat penjuru mata angin, kesucian niat, dan kemurnian budi pekerti manusia.",
    hint1: "Motif ini terinspirasi dari buah tanaman yang tumbuh di pedesaan Jawa dan melambangkan kemurnian niat.",
    hint2: "Motif ini termasuk rumpun batik Keraton (Pedalaman) dari tradisi kebangsawanan Jawa.",
    hint3: "Motif ini erat kaitannya dengan lingkungan Kraton Ngayogyakarta dan Surakarta.",
    hint4: "Motif ini berbentuk empat kelopak lonjong yang tersusun mengelilingi titik pusat, menyerupai potongan buah aren (kolang-kaling).",
  },
  {
    id: "parang",
    name: "Parang Rusak",
    region: "Surakarta & Yogyakarta",
    category: "Batik Larangan",
    image: "/images/batik-parang-rusak.jpg",
    philosophy: "Garis diagonal ombak tak terputus melambangkan semangat pantang menyerah dan keteguhan pemimpin.",
    hint1: "Motif ini terinspirasi oleh kekuatan alam yang tak pernah berhenti bergerak, simbol ketangguhan jiwa.",
    hint2: "Motif ini termasuk rumpun batik Larangan yang dahulu hanya boleh dikenakan oleh keluarga raja.",
    hint3: "Motif ini erat kaitannya dengan wilayah Yogyakarta dan Surakarta, merupakan identitas batik keraton.",
    hint4: "Motif ini berbentuk garis-garis diagonal berulang menyerupai huruf S yang saling berkaitan, terinspirasi dari batu karang dan ombak laut.",
  },
  {
    id: "megamendung",
    name: "Mega Mendung",
    region: "Cirebon, Jawa Barat",
    category: "Batik Pesisiran",
    image: "/images/batik-mega-mendung.jpg",
    philosophy: "Awan pembawa hujan melambangkan kesabaran, kesejukan hati, dan ketenangan jiwa laksana awan penyejuk.",
    hint1: "Motif ini terinspirasi dari fenomena alam langit yang membawa berkah hujan dan kesuburan bumi.",
    hint2: "Motif ini termasuk rumpun batik Pesisiran dengan pengaruh kuat kebudayaan Tiongkok.",
    hint3: "Motif ini merupakan ikon budaya dari kota pelabuhan di Pantai Utara Jawa Barat.",
    hint4: "Motif ini berbentuk gumpalan awan berlapis-lapis dengan gradasi warna biru tua hingga biru muda atau merah, dengan ornamen lengkung berulang.",
  },
  {
    id: "truntum",
    name: "Truntum",
    region: "Surakarta",
    category: "Batik Keraton",
    image: "/images/batik-kawung.jpg", // fallback image
    philosophy: "Melambangkan cinta yang bersemi kembali, sering dipakai orang tua pengantin sebagai doa untuk anaknya.",
    hint1: "Motif ini terinspirasi dari kisah cinta yang mekar kembali setelah melewati masa sulit.",
    hint2: "Motif ini termasuk rumpun batik Keraton Surakarta dengan motif kecil-kecil yang bertebaran.",
    hint3: "Motif ini lahir di lingkungan Kraton Kasunanan Surakarta Hadiningrat.",
    hint4: "Motif ini memiliki ciri khas berupa bintang atau bunga kecil bertebaran merata di seluruh permukaan kain seperti taburan bintang di langit malam.",
  },
  {
    id: "sidomukti",
    name: "Sido Mukti",
    region: "Surakarta",
    category: "Batik Keraton",
    image: "/images/batik-kawung.jpg", // fallback image
    philosophy: "Sido berarti terus-menerus, mukti berarti kebahagiaan. Melambangkan harapan akan kehidupan yang sejahtera dan bahagia.",
    hint1: "Nama motif ini secara harfiah berarti 'terus-menerus dalam kemuliaan' — harapan luhur bagi pemakainya.",
    hint2: "Motif ini termasuk rumpun batik Keraton, biasa dipakai dalam upacara pernikahan adat Jawa.",
    hint3: "Motif ini berasal dari tradisi batik Kraton Surakarta dan sering dipilih sebagai busana pengantin Jawa.",
    hint4: "Motif ini menampilkan pola kotak-kotak (ceplok) berulang yang di dalamnya terdapat ragam hias tumbuhan, kupu-kupu, atau garuda kecil.",
  },
  {
    id: "sekar-jagad",
    name: "Sekar Jagad",
    region: "Yogyakarta & Surakarta",
    category: "Batik Keraton",
    image: "/images/batik-kawung.jpg", // fallback image
    philosophy: "Sekar berarti bunga, jagad berarti dunia. Melambangkan keindahan alam semesta dan keanekaragaman budaya.",
    hint1: "Nama motif ini bermakna 'bunga dunia' — merayakan keindahan dan keanekaragaman alam semesta.",
    hint2: "Motif ini termasuk rumpun batik Keraton yang memiliki tampilan paling beragam dan kompleks.",
    hint3: "Motif ini populer di kedua pusat kebudayaan Jawa: Yogyakarta dan Surakarta.",
    hint4: "Motif ini ditandai dengan pola tak beraturan menyerupai kepulauan atau benua, di mana setiap 'pulau' diisi dengan motif berbeda-beda.",
  },
  {
    id: "lereng",
    name: "Lereng",
    region: "Yogyakarta",
    category: "Batik Keraton",
    image: "/images/batik-parang-rusak.jpg", // fallback
    philosophy: "Garis miring berkesinambungan melambangkan ketekunan, konsistensi, dan keseimbangan dalam menjalani kehidupan.",
    hint1: "Motif ini terinspirasi dari lereng pegunungan yang berundak — simbol ketekunan tanpa henti.",
    hint2: "Motif ini termasuk rumpun batik geometris pedalaman Jawa yang sederhana namun bermakna mendalam.",
    hint3: "Motif ini banyak diproduksi di sentra batik Yogyakarta sebagai variasi dari tradisi batik keraton.",
    hint4: "Motif ini memiliki ciri khas garis-garis diagonal sejajar yang membentuk pola miring berkesinambungan di seluruh permukaan kain.",
  },
  {
    id: "nitik",
    name: "Nitik",
    region: "Yogyakarta",
    category: "Batik Keraton",
    image: "/images/batik-kawung.jpg", // fallback
    philosophy: "Pola titik-titik kecil melambangkan ketelitian, kesabaran, dan dedikasi tinggi sang pembatik.",
    hint1: "Motif ini menuntut kesabaran dan ketelitian luar biasa dari pembuatnya — setiap detik penuh perhitungan.",
    hint2: "Motif ini adalah teknik khusus batik tulis yang menggunakan canting khusus berbilah tipis untuk membentuk titik.",
    hint3: "Motif ini adalah kebanggaan sentra batik tulis tradisional Bantul, Yogyakarta.",
    hint4: "Motif ini memiliki ciri khas berupa susunan titik-titik (dot) kecil sangat rapat yang membentuk pola geometris atau tumbuhan.",
  },
  {
    id: "batik-pekalongan",
    name: "Batik Pekalongan",
    region: "Pekalongan, Jawa Tengah",
    category: "Batik Pesisiran",
    image: "/images/batik-mega-mendung.jpg", // fallback
    philosophy: "Perpaduan motif lokal Jawa dengan pengaruh budaya Belanda, Tiongkok, dan Arab mencerminkan keterbukaan kota pelabuhan.",
    hint1: "Motif ini lahir dari kota yang dijuluki 'World City of Batik' karena keberagaman pengaruh budayanya.",
    hint2: "Motif ini termasuk rumpun batik Pesisiran dengan ciri khas warna cerah dan beragam motif bunga.",
    hint3: "Motif ini merupakan produk kebudayaan kota di Jawa Tengah bagian utara yang terkenal sebagai sentra batik nasional.",
    hint4: "Motif ini dikenal dengan warna-warna cerah (merah, hijau, kuning) dan motif bunga naturalis yang dipengaruhi seni Eropa dan Asia.",
  },
];

const ALL_MOTIF_NAMES = MOTIF_POOL.map((m) => m.name);

const XP_PER_HINT: Record<number, number> = { 1: 100, 2: 75, 3: 50, 4: 25, 5: 25 };

// ── Component ────────────────────────────────────────────────────────────────
type GameState = "idle" | "playing" | "correct" | "round-complete";

export default function TebakMotifPage() {
  const { addXp } = useXp();
  const [gameState, setGameState] = useState<GameState>("idle");
  const [currentMotif, setCurrentMotif] = useState<MotifData | null>(null);
  const [revealedHints, setRevealedHints] = useState<number>(1);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [wrongAttempt, setWrongAttempt] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [roundCount, setRoundCount] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [usedMotifIds, setUsedMotifIds] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const pickNewMotif = useCallback(() => {
    const available = MOTIF_POOL.filter((m) => !usedMotifIds.includes(m.id));
    const pool = available.length > 0 ? available : MOTIF_POOL;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    setCurrentMotif(chosen);
    setRevealedHints(1);
    setQuery("");
    setSuggestions([]);
    setWrongAttempt(false);
    setGameState("playing");
    if (available.length === 0) setUsedMotifIds([chosen.id]);
    else setUsedMotifIds((prev) => [...prev, chosen.id]);
  }, [usedMotifIds]);

  const startGame = useCallback(() => {
    setRoundCount(0);
    setTotalXp(0);
    setUsedMotifIds([]);
    const chosen = MOTIF_POOL[Math.floor(Math.random() * MOTIF_POOL.length)];
    setCurrentMotif(chosen);
    setRevealedHints(1);
    setQuery("");
    setSuggestions([]);
    setWrongAttempt(false);
    setGameState("playing");
    setUsedMotifIds([chosen.id]);
  }, []);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (val.length > 0) {
      const filtered = ALL_MOTIF_NAMES.filter((n) =>
        n.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const submitAnswer = useCallback((answer: string) => {
    if (!currentMotif) return;
    setShowSuggestions(false);
    const correct = answer.toLowerCase().trim() === currentMotif.name.toLowerCase().trim();
    if (correct) {
      const xp = XP_PER_HINT[revealedHints] ?? 25;
      setEarnedXp(xp);
      setTotalXp((prev) => prev + xp);
      addXp(xp);
      setGameState("correct");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
      setTimeout(() => setGameState("round-complete"), 1200);
      setRoundCount((prev) => prev + 1);
    } else {
      setWrongAttempt(true);
      setTimeout(() => setWrongAttempt(false), 600);
      // Push to reveal next hint after wrong attempt if at last hint
      if (revealedHints >= 4) {
        // reveal answer
        const xp = 25;
        setEarnedXp(xp);
        setTotalXp((prev) => prev + xp);
        addXp(xp);
        setTimeout(() => {
          setGameState("round-complete");
          setRoundCount((prev) => prev + 1);
        }, 700);
      }
    }
  }, [currentMotif, revealedHints, addXp]);

  const revealNextHint = () => {
    if (revealedHints < 4) setRevealedHints((prev) => prev + 1);
    else {
      // auto-reveal answer after hint 4
      const xp = 25;
      setEarnedXp(xp);
      setTotalXp((prev) => prev + xp);
      addXp(xp);
      setGameState("round-complete");
      setRoundCount((prev) => prev + 1);
    }
  };

  const potentialScore = XP_PER_HINT[revealedHints] ?? 25;
  const potentialPercent = (potentialScore / 100) * 100;

  const hints = currentMotif
    ? [currentMotif.hint1, currentMotif.hint2, currentMotif.hint3, currentMotif.hint4]
    : [];

  return (
    <div className="min-h-screen bg-[#1A1614] text-white">
      <GameNavbar title="Tebak Motif Berjenjang" />

      <main className="pt-14 min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          {/* ── IDLE / START SCREEN ── */}
          {gameState === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center text-center gap-8"
            >
              <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center">
                <Brain className="w-10 h-10 text-[#D4AF37]" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-display font-bold px-4 py-1.5 rounded-full mb-4">
                  <Brain className="w-3.5 h-3.5" /> TEBAK MOTIF BERJENJANG
                </div>
                <h1 className="font-display font-extrabold text-3xl md:text-4xl mb-3">
                  Uji Pengetahuan<br />
                  <span className="text-[#D4AF37]">Batik Nusantaramu</span>
                </h1>
                <p className="text-white/60 font-body max-w-md mx-auto">
                  Tebak nama motif batik berdasarkan petunjuk yang diberikan secara bertahap. 
                  Semakin sedikit petunjuk yang kamu butuhkan, semakin besar XP yang kamu dapatkan!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full max-w-sm text-left">
                {[
                  { hint: "Tebak dengan Hint 1", xp: "100 XP" },
                  { hint: "Tebak dengan Hint 2", xp: "75 XP" },
                  { hint: "Tebak dengan Hint 3", xp: "50 XP" },
                  { hint: "Tebak dengan Hint 4", xp: "25 XP" },
                ].map((item) => (
                  <div key={item.hint} className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <p className="text-[10px] text-white/50 font-body mb-1">{item.hint}</p>
                    <p className="text-[#D4AF37] font-display font-bold text-sm">{item.xp}</p>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={startGame}
                className="bg-[#D4AF37] text-[#1A1614] font-display font-extrabold px-10 py-3.5 rounded-full text-base hover:bg-[#c9a42c] transition-colors shadow-lg shadow-[#D4AF37]/20"
              >
                Mulai Kuis
              </motion.button>
            </motion.div>
          )}

          {/* ── PLAYING ── */}
          {(gameState === "playing" || gameState === "correct") && currentMotif && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6 w-full"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/50 text-xs font-body">Ronde #{roundCount + 1}</p>
                  <p className="text-white/80 text-sm font-display font-semibold">Tebak motif batik ini!</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-white/40 font-body">Total XP sesi ini</p>
                  <p className="text-[#D4AF37] font-display font-bold text-lg">{totalXp} XP</p>
                </div>
              </div>

              {/* Potential Score Bar */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-white/60 font-body">Skor Potensial</span>
                  <span className="text-sm font-display font-bold text-[#D4AF37]">{potentialScore} XP</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${potentialPercent}%` }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#f0cc5a]"
                  />
                </div>
              </div>

              {/* Hint Cards */}
              <div className="flex flex-col gap-3">
                {hints.slice(0, revealedHints).map((hint, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i === revealedHints - 1 ? 0 : 0 }}
                    className={`rounded-xl border p-4 ${
                      i === revealedHints - 1
                        ? "bg-[#D4AF37]/10 border-[#D4AF37]/30"
                        : "bg-white/5 border-white/10 opacity-60"
                    }`}
                  >
                    <div className="flex gap-3 items-start">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        i === revealedHints - 1 ? "bg-[#D4AF37] text-[#1A1614]" : "bg-white/10 text-white/60"
                      }`}>
                        {i + 1}
                      </div>
                      <p className="font-body text-sm text-white/80 leading-relaxed">{hint}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Input */}
              <div className="relative">
                <div className={`flex gap-2 rounded-xl border overflow-hidden transition-all ${
                  wrongAttempt ? "border-red-500 animate-[shake_0.3s_ease]" : "border-white/20 focus-within:border-[#D4AF37]/60"
                } bg-white/5`}>
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => handleQueryChange(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && query) submitAnswer(query); }}
                    onFocus={() => query && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    placeholder="Ketik nama motif batik..."
                    className="flex-1 bg-transparent px-4 py-3.5 text-sm font-body text-white placeholder-white/30 outline-none"
                    autoComplete="off"
                  />
                  <button
                    onClick={() => query && submitAnswer(query)}
                    disabled={!query}
                    className="px-4 text-[#D4AF37] hover:text-white transition-colors disabled:opacity-30"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Autocomplete */}
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-full mt-1 left-0 right-0 bg-[#25201C] border border-white/10 rounded-xl overflow-hidden z-10 shadow-2xl"
                    >
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          onMouseDown={() => { setQuery(s); submitAnswer(s); }}
                          className="w-full text-left px-4 py-3 text-sm font-body text-white/80 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5 last:border-0"
                        >
                          {s}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wrong attempt feedback */}
              <AnimatePresence>
                {wrongAttempt && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-red-400 text-sm font-body bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                  >
                    <XCircle className="w-4 h-4 shrink-0" />
                    Jawaban kurang tepat. Coba perhatikan petunjuk lebih cermat atau buka hint berikutnya!
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Correct feedback */}
              <AnimatePresence>
                {gameState === "correct" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 text-emerald-400 text-sm font-body bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3"
                  >
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    Tepat sekali! Kamu berhasil menebak dengan {revealedHints} petunjuk dan mendapat{" "}
                    <span className="font-bold text-[#D4AF37]">+{earnedXp} XP</span>!
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Reveal next hint button */}
              {gameState === "playing" && (
                <button
                  onClick={revealNextHint}
                  className="flex items-center justify-center gap-2 border border-white/15 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm font-display font-semibold px-5 py-3 rounded-xl transition-all"
                >
                  <Lightbulb className="w-4 h-4 text-[#D4AF37]" />
                  {revealedHints < 4
                    ? `Petunjuk Berikutnya (−${potentialScore - (XP_PER_HINT[revealedHints + 1] ?? 25)} poin)`
                    : "Ungkap Jawaban"}
                </button>
              )}
            </motion.div>
          )}

          {/* ── ROUND COMPLETE ── */}
          {gameState === "round-complete" && currentMotif && (
            <motion.div
              key="round-complete"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6 w-full"
            >
              {/* Motif reveal card */}
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                <div
                  className="h-52 bg-cover bg-center"
                  style={{ backgroundImage: `url(${currentMotif.image})` }}
                />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="font-display font-bold text-xl text-white">{currentMotif.name}</h2>
                      <p className="text-white/50 text-xs font-body">{currentMotif.region} · {currentMotif.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-white/40 font-body">XP diperoleh</p>
                      <p className="text-[#D4AF37] font-display font-bold text-xl">+{earnedXp}</p>
                    </div>
                  </div>
                  <div className="h-px bg-white/10 my-3" />
                  <p className="text-white/70 font-body text-sm leading-relaxed italic">
                    "{currentMotif.philosophy}"
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <p className="text-[10px] text-white/40 font-body mb-1">Ronde</p>
                  <p className="font-display font-bold text-lg text-white">#{roundCount}</p>
                </div>
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <p className="text-[10px] text-white/40 font-body mb-1">Hint Terpakai</p>
                  <p className="font-display font-bold text-lg text-white">{revealedHints}</p>
                </div>
                <div className="flex-1 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl p-4 text-center">
                  <p className="text-[10px] text-[#D4AF37]/70 font-body mb-1">Total XP</p>
                  <p className="font-display font-bold text-lg text-[#D4AF37]">{totalXp}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={pickNewMotif}
                  className="flex-1 bg-[#D4AF37] text-[#1A1614] font-display font-extrabold py-3.5 rounded-xl hover:bg-[#c9a42c] transition-colors"
                >
                  Motif Berikutnya
                </motion.button>
                <button
                  onClick={() => setGameState("idle")}
                  className="flex items-center gap-2 border border-white/15 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-display font-semibold px-5 py-3.5 rounded-xl transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Selesai
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confetti overlay */}
        <AnimatePresence>
          {showConfetti && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
            >
              <div className="text-6xl animate-bounce">🎉</div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 1] }}
                transition={{ duration: 0.5 }}
                className="absolute text-4xl"
                style={{ top: "30%", left: "20%" }}
              >✨</motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 1] }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="absolute text-4xl"
                style={{ top: "25%", right: "20%" }}
              >🌟</motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .animate-\\[shake_0\\.3s_ease\\] { animation: shake 0.3s ease; }
      `}</style>
    </div>
  );
}
