"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Lock,
  Share2,
  Sparkles,
  MapPin,
  Search,
  Trophy,
  Award,
  Crown,
  Shield,
  Gamepad2,
  MessageSquare,
  X,
  Check,
  Compass,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Navbar } from "@/components/landing/Navbar";
import { BATIK_DATASET_20, BatikMotif } from "@/data/batikDataset";
import { useXp, MasteryTier } from "@/hooks/useXp";
import { AudioNarratorButton } from "@/components/shared/AudioNarratorButton";

// Starter cards always visible for new visitors
const STARTER_CARD_IDS = [
  "batik_kawung",
  "batik_parang",
  "batik_mega_mendung_v2",
  "batik_truntum",
  "batik_sekar_jagad",
  "batik_sidomukti",
];

const REGION_LIST = [
  "Semua Sentra",
  "D.I. Yogyakarta",
  "Surakarta",
  "Pekalongan",
  "Cirebon",
  "DKI Jakarta",
  "Lasem",
  "Kalimantan",
];

export default function CollectionPage() {
  const { unlockedCards = [], masteryCards = {} } = useXp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("Semua Sentra");
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>("Semua");
  const [selectedMotif, setSelectedMotif] = useState<BatikMotif | null>(null);
  const [lockedModalMotif, setLockedModalMotif] = useState<BatikMotif | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Helper to determine if a motif is unlocked
  const isCardUnlocked = React.useCallback((motif: BatikMotif): boolean => {
    const safeUnlocked = Array.isArray(unlockedCards) ? unlockedCards : [];
    const safeMastery = masteryCards && typeof masteryCards === "object" ? masteryCards : {};
    return (
      STARTER_CARD_IDS.includes(motif.rawId) ||
      STARTER_CARD_IDS.includes(motif.id) ||
      safeUnlocked.includes(motif.rawId) ||
      safeUnlocked.includes(motif.id) ||
      Boolean(safeMastery[motif.rawId]) ||
      Boolean(safeMastery[motif.id])
    );
  }, [unlockedCards, masteryCards]);

  // Helper to get mastery tier
  const getCardMastery = React.useCallback((motif: BatikMotif): MasteryTier | "Locked" => {
    const safeMastery = masteryCards && typeof masteryCards === "object" ? masteryCards : {};
    const rawTier = safeMastery[motif.rawId] || safeMastery[motif.id];
    if (rawTier) return rawTier;
    if (isCardUnlocked(motif)) return "Unlocked";
    return "Locked";
  }, [masteryCards, isCardUnlocked]);

  // Counts & Progress
  const totalCards = BATIK_DATASET_20.length;
  const unlockedCount = useMemo(() => {
    return BATIK_DATASET_20.filter(isCardUnlocked).length;
  }, [isCardUnlocked]);

  const progressPercent = Math.round((unlockedCount / totalCards) * 100);

  const goldCount = useMemo(() => {
    return BATIK_DATASET_20.filter((m) => getCardMastery(m) === "Sulit").length;
  }, [getCardMastery]);

  // Filtered Motifs
  const filteredMotifs = useMemo(() => {
    return BATIK_DATASET_20.filter((motif) => {
      // Search filter
      const matchesSearch =
        motif.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        motif.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        motif.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Region filter
      if (selectedRegion !== "Semua Sentra") {
        if (!motif.region.toLowerCase().includes(selectedRegion.toLowerCase())) {
          return false;
        }
      }

      // Tier filter
      const mastery = getCardMastery(motif);
      if (selectedTierFilter === "Emas") return mastery === "Sulit";
      if (selectedTierFilter === "Perak") return mastery === "Menengah";
      if (selectedTierFilter === "Perunggu") return mastery === "Mudah";
      if (selectedTierFilter === "Terbuka") return mastery !== "Locked";
      if (selectedTierFilter === "Terkunci") return mastery === "Locked";

      return true;
    });
  }, [searchQuery, selectedRegion, selectedTierFilter, getCardMastery]);

  const handleShare = async (motif: BatikMotif, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `Saya telah mengoleksi kartu budaya ${motif.fullName} dari sentra ${motif.region} di Batik Kita! #BatikKita #HOLOGY`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: motif.fullName,
          text: shareText,
          url: window.location.href,
        });
      } catch {
        // Fallback to clipboard
      }
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2200);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f4] font-body text-[#2d2b38] flex flex-col selection:bg-[#D4AF37] selection:text-[#1A1614]">
      {/* Toast Notification */}
      <AnimatePresence>
        {copiedNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1A1614] text-white px-5 py-2.5 rounded-xl border border-[#D4AF37]/50 shadow-xl flex items-center gap-2 text-xs font-display font-semibold"
          >
            <Check className="w-4 h-4 text-[#D4AF37]" />
            <span>Teks pencapaian berhasil disalin ke clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Navbar */}
      <Navbar variant="transparent" />

      <main className="flex-1 w-full">
        {/* ─── Hero Section with Dedicated WebP Imagery ─── */}
        <section className="relative w-full overflow-hidden bg-[#1A1614] pt-24 pb-12 sm:pt-32 sm:pb-20 px-4 sm:px-6 lg:px-16 min-h-[440px] lg:min-h-[520px] flex items-center">
          {/* Background Image: batik-tab-koleksi.jpg */}
          <Image
            src="/images/batik-tab-koleksi.jpg"
            alt="Album Koleksi Wastra Nusantara"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />

          {/* Contrast overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/30 z-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1614] via-transparent to-black/50 z-0" />

          {/* Golden glow accents */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none z-0" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#713f2c]/25 rounded-full blur-3xl pointer-events-none z-0" />

          <div className="max-w-[1280px] mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 text-left"
            >
              <div className="flex items-center gap-2.5 mb-4 sm:mb-5">
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
                <span className="text-white/90 font-display text-xs sm:text-sm font-medium tracking-wide">
                  Pencapaian & Tingkat Mastery Cap
                </span>
              </div>

              <h1 className="font-display font-bold text-3xl xs:text-4xl sm:text-5xl lg:text-[54px] text-white leading-[1.12] sm:leading-[1.08] tracking-tight mb-4 sm:mb-5">
                <span className="font-philosopher tracking-wide">Album Koleksi:</span>
                <br />
                <span
                  style={{
                    color: "#D4AF37",
                    textShadow: "0 2px 20px rgba(212,175,55,0.4)",
                  }}
                >
                  Wastra
                </span>{" "}
                Nusantara.
              </h1>

              <p className="font-narrative text-sm sm:text-base lg:text-lg text-white/80 max-w-xl leading-relaxed mb-6">
                Telusuri koleksi kartu budaya yang telah Anda buka. Selesaikan tantangan Batik Cap tingkat mahakarya untuk mendapatkan bingkai emas berkilau.
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-display text-white/70">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg border border-white/15">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/50 uppercase tracking-wider mb-0.5">Koleksi Terbuka</span>
                    <span className="font-bold text-[#D4AF37] text-xs sm:text-sm">{unlockedCount} / {totalCards} Motif ({progressPercent}%)</span>
                  </div>
                  <div className="w-16 sm:w-28 h-2 bg-white/20 rounded-full overflow-hidden ml-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#B87333] via-[#D4AF37] to-[#10B981]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-[#FFF9E6]/10 px-3 py-2 rounded-lg border border-[#D4AF37]/30 backdrop-blur-sm">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/50 uppercase tracking-wider mb-0.5">Mahakarya Emas</span>
                    <span className="font-bold text-[#D4AF37] text-xs sm:text-sm flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5" />
                      {goldCount} Kartu
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <div className="max-w-[1280px] mx-auto w-full px-4 py-6 sm:p-6 lg:p-8 pb-28 md:pb-12 space-y-5 sm:space-y-6">
        {/* Tier Legend & Explanation Banner */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#d3ccc2] shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-[#713f2c] mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                Bingkai Dinamis Mastery Batik Cap
              </div>
              <p className="text-xs text-[#8d786a] leading-relaxed max-w-2xl">
                Warna border kartu bertransformasi sesuai tingkat kesulitan yang berhasil Anda tuntaskan di <strong>Batik Cap</strong>: Perunggu (Mudah), Perak (Menengah), dan Emas Berkilau (Sulit).
              </p>
            </div>

            {/* Visual Pill Legend */}
            <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] font-display font-bold">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF0E6] text-[#8B4513] border border-[#B87333]/40">
                <Shield className="w-3.5 h-3.5 text-[#B87333]" />
                <span>Cap Dasar</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F1F5F9] text-slate-700 border border-slate-300">
                <Award className="w-3.5 h-3.5 text-slate-500" />
                <span>Cap Terampil</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFF9E6] text-[#713f2c] border border-[#D4AF37] shadow-xs">
                <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Mahakarya Empu</span>
              </span>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#8d786a] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama motif, sentra, atau filosofi..."
              className="w-full bg-white border border-[#d3ccc2] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#2d2b38] placeholder-[#8d786a]/70 focus:outline-hidden focus:border-[#713f2c] transition-colors"
            />
          </div>

          {/* Filter Chips: Region & Tier */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-white border border-[#d3ccc2] rounded-xl px-3 py-2 text-xs font-display font-semibold text-[#713f2c] focus:outline-hidden focus:border-[#713f2c] cursor-pointer shrink-0"
            >
              {REGION_LIST.map((reg) => (
                <option key={reg} value={reg}>
                  {reg}
                </option>
              ))}
            </select>

            {/* Tier Filters */}
            <div className="inline-flex rounded-xl border border-[#d3ccc2] bg-white p-0.5 overflow-x-auto no-scrollbar max-w-full touch-pan-x">
              {["Semua", "Emas", "Perak", "Perunggu", "Terbuka", "Terkunci"].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTierFilter(t)}
                  className={`px-2 sm:px-2.5 py-1 text-xs font-display font-bold rounded-lg transition-colors cursor-pointer shrink-0 ${
                    selectedTierFilter === t
                      ? "bg-[#713f2c] text-[#D4AF37]"
                      : "text-[#8d786a] hover:text-[#2d2b38]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card Grid */}
        {filteredMotifs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#d3ccc2] p-8 sm:p-12 text-center my-8">
            <Compass className="w-12 h-12 text-[#8d786a]/50 mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg text-[#2d2b38] mb-1">Motif Tidak Ditemukan</h3>
            <p className="text-xs text-[#8d786a] max-w-sm mx-auto">
              Tidak ada kartu motif yang sesuai dengan filter atau kata kunci pencarian. Coba reset filter Anda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredMotifs.map((motif, i) => {
              const unlocked = isCardUnlocked(motif);
              const mastery = getCardMastery(motif);

              // Dynamic Border & Shadow classes
              let borderClass = "border border-[#d3ccc2] bg-[#f0ede6] opacity-75";
              let badgeBg = "bg-stone-500 text-white";
              let BadgeIcon = Lock;
              let badgeLabel = "Terkunci";

              if (unlocked) {
                if (mastery === "Sulit") {
                  borderClass =
                    "border-2 border-[#D4AF37] ring-2 sm:ring-4 ring-[#D4AF37]/35 shadow-[0_0_20px_rgba(212,175,55,0.4)] bg-white cursor-pointer hover:scale-[1.02] transition-all";
                  badgeBg = "bg-gradient-to-r from-[#8a5d24] via-[#D4AF37] to-[#8a5d24] text-white shadow-xs font-extrabold";
                  BadgeIcon = Crown;
                  badgeLabel = "Mahakarya";
                } else if (mastery === "Menengah") {
                  borderClass =
                    "border-2 border-slate-300 ring-1 sm:ring-2 ring-slate-400/35 shadow-md bg-white cursor-pointer hover:scale-[1.02] transition-all";
                  badgeBg = "bg-gradient-to-r from-slate-600 to-slate-500 text-white shadow-xs font-bold";
                  BadgeIcon = Award;
                  badgeLabel = "Terampil";
                } else if (mastery === "Mudah") {
                  borderClass =
                    "border-2 border-[#B87333] ring-1 ring-[#B87333]/30 shadow-md bg-white cursor-pointer hover:scale-[1.02] transition-all";
                  badgeBg = "bg-gradient-to-r from-[#8B4513] to-[#B87333] text-white shadow-xs font-bold";
                  BadgeIcon = Shield;
                  badgeLabel = "Cap Dasar";
                } else {
                  // Unlocked baseline
                  borderClass =
                    "border border-emerald-500/70 shadow-md bg-white cursor-pointer hover:scale-[1.02] transition-all";
                  badgeBg = "bg-emerald-600 text-white font-medium";
                  BadgeIcon = Sparkles;
                  badgeLabel = "Dasar";
                }
              }

              return (
                <motion.div
                  key={motif.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.4) }}
                  onClick={() => {
                    if (unlocked) {
                      setSelectedMotif(motif);
                    } else {
                      setLockedModalMotif(motif);
                    }
                  }}
                  className={`relative aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden group ${borderClass}`}
                >
                  {unlocked ? (
                    <>
                      {/* Background Image */}
                      <div className="absolute inset-0 z-0">
                        <Image
                          src={motif.image}
                          alt={motif.fullName}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover group-hover:scale-108 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-[#713f2c]/35 backdrop-blur-[0.3px]" />
                      </div>

                      {/* Holographic Shimmer Effect for Gold */}
                      {mastery === "Sulit" && (
                        <div
                          className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#D4AF37]/35 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 -translate-x-full z-20 pointer-events-none"
                          style={{ width: "200%" }}
                        />
                      )}

                      {/* Card Content Overlay */}
                      <div className="absolute inset-0 z-10 flex flex-col justify-between p-2.5 sm:p-4 bg-gradient-to-b from-black/50 via-transparent to-black/85">
                        {/* Top Bar: Category & Share */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-display uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full ${badgeBg}`}
                          >
                            <BadgeIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                            <span>{badgeLabel}</span>
                          </span>
                          <button
                            onClick={(e) => handleShare(motif, e)}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-[#1A1614] transition-colors shrink-0"
                            title="Bagikan Pencapaian"
                          >
                            <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </button>
                        </div>

                        {/* Bottom Information */}
                        <div>
                          <div className="flex items-center gap-1 text-white/80 text-[10px] sm:text-[11px] font-display font-medium mb-0.5">
                            <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#D4AF37] shrink-0" />
                            <span className="truncate">{motif.region}</span>
                          </div>
                          <h3 className="font-display font-bold text-sm sm:text-lg lg:text-xl text-white drop-shadow-md leading-tight line-clamp-2">
                            {motif.fullName}
                          </h3>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Locked Card State */
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-6 text-center z-10 bg-[#e8e5df]/80 backdrop-blur-xs cursor-pointer hover:bg-[#e8e5df]/90 transition-colors">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#d3ccc2]/60 flex items-center justify-center text-[#8d786a] mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                        <Lock className="w-4 h-4 sm:w-6 sm:h-6" />
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-display font-bold uppercase tracking-wider text-[#8d786a] mb-0.5">
                        Terkunci
                      </span>
                      <h3 className="font-display font-bold text-xs sm:text-base text-[#2d2b38] mb-0.5 line-clamp-2">
                        {motif.fullName}
                      </h3>
                      <p className="text-[10px] sm:text-[11px] text-[#8d786a] line-clamp-2 hidden xs:block">
                        Sentra {motif.region}. Klik untuk buka.
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
        </div>
      </main>

      {/* ── Motif Detail Popup Modal ── */}
      <AnimatePresence>
        {selectedMotif && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedMotif(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border-t-2 sm:border-2 border-[#D4AF37]/50 max-h-[90dvh] flex flex-col"
            >
              {/* Sticky Top Header Bar */}
              <div className="bg-[#faf8f4] border-b border-[#d3ccc2] px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-display font-bold px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#1A1614] uppercase">
                    {selectedMotif.category}
                  </span>
                  <span className="text-xs text-stone-600 font-display flex items-center gap-1 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {selectedMotif.region}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedMotif(null)}
                  className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Tutup dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Modal Content */}
              <div
                className="flex-1 overflow-y-auto overscroll-contain touch-pan-y"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {/* Header Image with Mastery Badge Overlay */}
                <div className="relative h-44 xs:h-52 sm:h-64 w-full overflow-hidden bg-[#2d2b38] shrink-0">
                  <Image
                    src={selectedMotif.image}
                    alt={selectedMotif.fullName}
                    fill
                    sizes="(max-width: 768px) 100vw, 700px"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1614] via-black/30 to-transparent" />

                  {/* Badge Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-6 sm:right-6 flex items-end justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="font-display font-extrabold text-lg sm:text-2xl text-white truncate drop-shadow">
                        {selectedMotif.fullName}
                      </h2>
                    </div>

                    {/* Current Mastery Pill */}
                    <div className="bg-black/65 backdrop-blur-md border border-[#D4AF37]/50 px-2.5 py-1 rounded-xl text-right shrink-0">
                      <span className="text-[9px] uppercase font-display font-bold text-[#D4AF37] block">
                        Mastery Cap
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold text-white flex items-center justify-end gap-1">
                        {getCardMastery(selectedMotif) === "Sulit" ? (
                          <>
                            <Crown className="w-3 h-3 text-[#D4AF37]" />
                            <span>Mahakarya</span>
                          </>
                        ) : getCardMastery(selectedMotif) === "Menengah" ? (
                          <>
                            <Award className="w-3 h-3 text-slate-300" />
                            <span>Terampil</span>
                          </>
                        ) : getCardMastery(selectedMotif) === "Mudah" ? (
                          <>
                            <Shield className="w-3 h-3 text-[#B87333]" />
                            <span>Cap Dasar</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 text-emerald-400" />
                            <span>Koleksi Dasar</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 sm:p-6 space-y-4">
                  {/* Upgrade Mastery Prompt */}
                  {getCardMastery(selectedMotif) !== "Sulit" && (
                    <div className="bg-[#FFF9E6] border border-[#D4AF37]/50 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37] shrink-0" />
                        <div>
                          <h4 className="font-display font-bold text-xs text-[#713f2c]">
                            Tingkatkan Border ke Mahakarya Emas
                          </h4>
                          <p className="text-[11px] text-[#8d786a]">
                            Selesaikan tantangan Batik Cap tingkat <strong>Sulit</strong> untuk motif ini!
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/play/cap?motif=${selectedMotif.rawId}`}
                        className="bg-[#713f2c] text-[#D4AF37] px-3 py-1.5 rounded-xl text-xs font-display font-bold shrink-0 hover:bg-[#583122] transition-colors"
                      >
                        Batik Cap →
                      </Link>
                    </div>
                  )}

                  {/* Filosofi Section */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h3 className="font-display font-bold text-xs sm:text-sm text-[#713f2c] uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                        Makna Filosofis & Nilai Warisan
                      </h3>
                      <AudioNarratorButton
                        text={selectedMotif.philosophy}
                        title={selectedMotif.fullName}
                        variant="compact"
                      />
                    </div>
                    <p className="font-narrative text-xs sm:text-sm text-[#2d2b38] leading-relaxed bg-[#FAF8F4] p-3.5 rounded-xl border border-[#d3ccc2]/60">
                      {selectedMotif.philosophy}
                    </p>
                  </div>

                  {/* Visual Traits */}
                  <div>
                    <h3 className="font-display font-bold text-xs sm:text-sm text-[#713f2c] uppercase tracking-wider mb-1">
                      Ciri Khas Visual & Ornamen
                    </h3>
                    <p className="text-xs text-[#8d786a] leading-relaxed">
                      {selectedMotif.visualTraits}
                    </p>
                  </div>

                  {/* Usage */}
                  <div>
                    <h3 className="font-display font-bold text-xs sm:text-sm text-[#713f2c] uppercase tracking-wider mb-1">
                      Penggunaan Tradisional & Busana Adat
                    </h3>
                    <p className="text-xs text-[#8d786a] leading-relaxed">
                      {selectedMotif.usage}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sticky Action Buttons */}
              <div className="p-3 sm:p-4 bg-[#FAF8F4] border-t border-stone-200 shrink-0 grid grid-cols-2 gap-2.5">
                <Link
                  href={`/chat?prompt=Ceritakan filosofi dan asal usul mendalam tentang ${selectedMotif.fullName} dari daerah ${selectedMotif.region}`}
                  className="w-full bg-white hover:bg-stone-100 text-[#713f2c] font-display font-bold text-xs py-2.5 sm:py-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-[#d3ccc2] shadow-xs"
                >
                  <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                  <span>Batik Ask</span>
                </Link>

                <Link
                  href={`/play/cap?motif=${selectedMotif.rawId}`}
                  className="w-full bg-[#713f2c] hover:bg-[#583122] text-[#D4AF37] font-display font-bold text-xs py-2.5 sm:py-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>Batik Cap</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Locked Card Guidance Modal ── */}
      <AnimatePresence>
        {lockedModalMotif && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md"
            onClick={() => setLockedModalMotif(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 sm:p-6 text-center border-t-2 sm:border border-[#d3ccc2] shadow-2xl max-h-[85dvh] overflow-y-auto overscroll-contain touch-pan-y"
            >
              <button
                onClick={() => setLockedModalMotif(null)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FFF9E6] border border-[#D4AF37]/50 flex items-center justify-center text-[#713f2c] mx-auto mb-3">
                <Lock className="w-6 h-6 text-[#D4AF37]" />
              </div>

              <h3 className="font-display font-extrabold text-lg sm:text-xl text-[#2d2b38] mb-1">
                {lockedModalMotif.fullName} Masih Terkunci
              </h3>
              <p className="text-xs text-[#8d786a] mb-4">
                Kartu ini merupakan wastra adiluhung dari sentra <strong>{lockedModalMotif.region}</strong>.
              </p>

              <div className="bg-[#FAF8F4] p-3.5 sm:p-4 rounded-xl border border-[#d3ccc2] text-left text-xs space-y-2 mb-5">
                <p className="font-display font-bold text-[#713f2c]">Cara Membuka Kartu Ini:</p>
                <ul className="space-y-1.5 text-[#2d2b38] list-disc list-inside text-[11px] sm:text-xs leading-relaxed">
                  <li>Mainkan <strong>Batik Cap</strong> dan selesaikan stempel cap motif ini.</li>
                  <li>Petakan motif ini ke sentra {lockedModalMotif.region} di <strong>Batik Map</strong>.</li>
                  <li>Atau tebak motif ini dengan benar di <strong>Batik Guess</strong>.</li>
                </ul>
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={() => setLockedModalMotif(null)}
                  className="flex-1 border border-[#d3ccc2] text-[#8d786a] font-display font-semibold text-xs py-2.5 rounded-xl hover:bg-[#e8e5df] transition-colors cursor-pointer"
                >
                  Tutup
                </button>
                <Link
                  href="/play"
                  className="flex-1 bg-[#713f2c] text-[#D4AF37] font-display font-semibold text-xs py-2.5 rounded-xl hover:bg-[#583122] transition-colors flex items-center justify-center gap-1 shadow-xs"
                >
                  Ke Batik Arcade →
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
