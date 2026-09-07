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

import { BATIK_DATASET_20, BatikMotif } from "@/data/batikDataset";
import { useXp, MasteryTier } from "@/hooks/useXp";

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

      {/* Header */}
      <header className="bg-white border-b border-[#d3ccc2] px-6 py-4 flex flex-wrap items-center justify-between sticky top-0 z-40 shadow-xs gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/play"
            className="w-10 h-10 rounded-full bg-[#f5f3ef] flex items-center justify-center text-[#713f2c] hover:bg-[#e8e5df] transition-colors border border-[#d3ccc2]/60"
            title="Kembali ke Batik Arcade"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo-batik-kita.png"
              alt="Logo Batik Kita"
              width={44}
              height={44}
              className="w-11 h-11 object-contain drop-shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-philosopher font-bold text-xl text-[#713f2c]">Batik Kita</span>
                <span className="text-xs text-[#d3ccc2]">/</span>
                <h1 className="font-display font-bold text-base text-[#2d2b38]">Album Koleksi Wastra</h1>
              </div>
              <p className="text-xs text-[#8d786a]">Kartu Pencapaian & Tingkat Mastery Cap</p>
            </div>
          </div>
        </div>

        {/* Progress Tracker & Badges */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Gold Mastery Count */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#FFF9E6] border border-[#D4AF37]/40 px-3 py-1.5 rounded-xl text-xs font-display">
            <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-bold text-[#713f2c]">{goldCount}</span>
            <span className="text-[#8d786a] text-[10px]">Mahakarya</span>
          </div>

          {/* Progress Tracker */}
          <div className="flex items-center gap-3 bg-[#f5f3ef] px-4 py-2 rounded-xl border border-[#d3ccc2]">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#8d786a] font-display font-bold uppercase tracking-wider">
                Koleksi Terbuka
              </span>
              <span className="text-sm font-bold text-[#713f2c]">
                {unlockedCount} / {totalCards} Motif ({progressPercent}%)
              </span>
            </div>
            <div className="w-24 sm:w-28 h-2 bg-[#d3ccc2] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#B87333] via-[#D4AF37] to-[#10B981]"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-8 space-y-6">
        {/* Tier Legend & Explanation Banner */}
        <div className="bg-white rounded-2xl p-5 border border-[#d3ccc2] shadow-xs">
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
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-display font-bold">
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#8d786a] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama motif, sentra, atau filosofi..."
              className="w-full bg-white border border-[#d3ccc2] rounded-xl pl-10 pr-4 py-2 text-xs text-[#2d2b38] placeholder-[#8d786a]/70 focus:outline-hidden focus:border-[#713f2c] transition-colors"
            />
          </div>

          {/* Filter Chips: Region & Tier */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-white border border-[#d3ccc2] rounded-xl px-3 py-2 text-xs font-display font-semibold text-[#713f2c] focus:outline-hidden focus:border-[#713f2c] cursor-pointer"
            >
              {REGION_LIST.map((reg) => (
                <option key={reg} value={reg}>
                  {reg}
                </option>
              ))}
            </select>

            {/* Tier Filters */}
            <div className="inline-flex rounded-xl border border-[#d3ccc2] bg-white p-0.5 overflow-hidden">
              {["Semua", "Emas", "Perak", "Perunggu", "Terbuka", "Terkunci"].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTierFilter(t)}
                  className={`px-2.5 py-1 text-xs font-display font-bold rounded-lg transition-colors cursor-pointer ${
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
          <div className="bg-white rounded-3xl border border-[#d3ccc2] p-12 text-center my-8">
            <Compass className="w-12 h-12 text-[#8d786a]/50 mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg text-[#2d2b38] mb-1">Motif Tidak Ditemukan</h3>
            <p className="text-xs text-[#8d786a] max-w-sm mx-auto">
              Tidak ada kartu motif yang sesuai dengan filter atau kata kunci pencarian. Coba reset filter Anda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                    "border-2 border-[#D4AF37] ring-4 ring-[#D4AF37]/35 shadow-[0_0_25px_rgba(212,175,55,0.45)] bg-white cursor-pointer hover:scale-[1.02] transition-all";
                  badgeBg = "bg-gradient-to-r from-[#8a5d24] via-[#D4AF37] to-[#8a5d24] text-white shadow-sm font-extrabold";
                  BadgeIcon = Crown;
                  badgeLabel = "Mahakarya Empu";
                } else if (mastery === "Menengah") {
                  borderClass =
                    "border-2 border-slate-300 ring-2 ring-slate-400/35 shadow-lg bg-white cursor-pointer hover:scale-[1.02] transition-all";
                  badgeBg = "bg-gradient-to-r from-slate-600 to-slate-500 text-white shadow-sm font-bold";
                  BadgeIcon = Award;
                  badgeLabel = "Cap Terampil";
                } else if (mastery === "Mudah") {
                  borderClass =
                    "border-2 border-[#B87333] ring-1 ring-[#B87333]/30 shadow-md bg-white cursor-pointer hover:scale-[1.02] transition-all";
                  badgeBg = "bg-gradient-to-r from-[#8B4513] to-[#B87333] text-white shadow-sm font-bold";
                  BadgeIcon = Shield;
                  badgeLabel = "Cap Dasar";
                } else {
                  // Unlocked baseline
                  borderClass =
                    "border border-emerald-500/70 shadow-md bg-white cursor-pointer hover:scale-[1.02] transition-all";
                  badgeBg = "bg-emerald-600 text-white font-medium";
                  BadgeIcon = Sparkles;
                  badgeLabel = "Koleksi Dasar";
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
                  className={`relative aspect-[3/4] rounded-3xl overflow-hidden group ${borderClass}`}
                >
                  {unlocked ? (
                    <>
                      {/* Background Image */}
                      <div className="absolute inset-0 z-0">
                        <Image
                          src={motif.image}
                          alt={motif.fullName}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
                      <div className="absolute inset-0 z-10 flex flex-col justify-between p-4 bg-gradient-to-b from-black/50 via-transparent to-black/85">
                        {/* Top Bar: Category & Share */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-display uppercase tracking-wider px-2.5 py-0.5 rounded-full ${badgeBg}`}
                          >
                            <BadgeIcon className="w-3 h-3 shrink-0" />
                            <span>{badgeLabel}</span>
                          </span>
                          <button
                            onClick={(e) => handleShare(motif, e)}
                            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-[#1A1614] transition-colors"
                            title="Bagikan Pencapaian"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Bottom Information */}
                        <div>
                          <div className="flex items-center gap-1.5 text-white/80 text-[11px] font-display font-medium mb-1">
                            <MapPin className="w-3 h-3 text-[#D4AF37]" />
                            <span>{motif.region}</span>
                            <span className="text-white/40">•</span>
                            <span>{motif.category}</span>
                          </div>
                          <h3 className="font-display font-bold text-xl text-white drop-shadow-md leading-snug">
                            {motif.fullName}
                          </h3>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Locked Card State */
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-[#e8e5df]/80 backdrop-blur-xs cursor-pointer hover:bg-[#e8e5df]/90 transition-colors">
                      <div className="w-14 h-14 rounded-full bg-[#d3ccc2]/60 flex items-center justify-center text-[#8d786a] mb-3 group-hover:scale-110 transition-transform">
                        <Lock className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#8d786a] mb-1">
                        Motif Terkunci
                      </span>
                      <h3 className="font-display font-bold text-base text-[#2d2b38] mb-1">
                        {motif.fullName}
                      </h3>
                      <p className="text-[11px] text-[#8d786a] line-clamp-2">
                        Sentra {motif.region}. Klik untuk melihat cara membuka kartu ini.
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── Motif Detail Popup Modal ── */}
      <AnimatePresence>
        {selectedMotif && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={() => setSelectedMotif(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#D4AF37]/40 max-h-[90vh] flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMotif(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header Image with Glow */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#2d2b38] shrink-0">
                <Image
                  src={selectedMotif.image}
                  alt={selectedMotif.fullName}
                  fill
                  sizes="(max-width: 768px) 100vw, 700px"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1614] via-black/30 to-transparent" />

                {/* Badge Overlay */}
                <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-display font-bold px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#1A1614] uppercase">
                        {selectedMotif.category}
                      </span>
                      <span className="text-xs text-white/80 font-display flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                        {selectedMotif.region}
                      </span>
                    </div>
                    <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                      {selectedMotif.fullName}
                    </h2>
                  </div>

                  {/* Current Mastery Pill */}
                  <div className="bg-black/60 backdrop-blur-md border border-[#D4AF37]/50 px-3 py-1.5 rounded-xl text-right">
                    <span className="text-[10px] uppercase font-display font-bold text-[#D4AF37] block">
                      Tingkat Mastery Cap
                    </span>
                    <span className="text-xs font-bold text-white flex items-center justify-end gap-1.5">
                      {getCardMastery(selectedMotif) === "Sulit" ? (
                        <>
                          <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Mahakarya Empu (Sulit)</span>
                        </>
                      ) : getCardMastery(selectedMotif) === "Menengah" ? (
                        <>
                          <Award className="w-3.5 h-3.5 text-slate-300" />
                          <span>Cap Terampil (Menengah)</span>
                        </>
                      ) : getCardMastery(selectedMotif) === "Mudah" ? (
                        <>
                          <Shield className="w-3.5 h-3.5 text-[#B87333]" />
                          <span>Cap Dasar (Mudah)</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Belum Di-Cap (Koleksi Dasar)</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Scrollable Modal Content */}
              <div className="p-6 sm:p-7 overflow-y-auto space-y-5">
                {/* Upgrade Mastery Prompt */}
                {getCardMastery(selectedMotif) !== "Sulit" && (
                  <div className="bg-[#FFF9E6] border border-[#D4AF37]/50 rounded-2xl p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-6 h-6 text-[#D4AF37] shrink-0" />
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
                  <h3 className="font-display font-bold text-sm text-[#713f2c] uppercase tracking-wider mb-1.5 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    Makna Filosofis & Nilai Warisan
                  </h3>
                  <p className="font-narrative text-xs sm:text-sm text-[#2d2b38] leading-relaxed bg-[#FAF8F4] p-4 rounded-xl border border-[#d3ccc2]/60">
                    {selectedMotif.philosophy}
                  </p>
                </div>

                {/* Visual Traits */}
                <div>
                  <h3 className="font-display font-bold text-sm text-[#713f2c] uppercase tracking-wider mb-1.5">
                    Ciri Khas Visual & Ornamen
                  </h3>
                  <p className="text-xs text-[#8d786a] leading-relaxed">
                    {selectedMotif.visualTraits}
                  </p>
                </div>

                {/* Usage */}
                <div>
                  <h3 className="font-display font-bold text-sm text-[#713f2c] uppercase tracking-wider mb-1.5">
                    Penggunaan Tradisional & Busana Adat
                  </h3>
                  <p className="text-xs text-[#8d786a] leading-relaxed">
                    {selectedMotif.usage}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-[#d3ccc2] grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link
                    href={`/chat?prompt=Ceritakan filosofi dan asal usul mendalam tentang ${selectedMotif.fullName} dari daerah ${selectedMotif.region}`}
                    className="w-full bg-[#f5f3ef] hover:bg-[#e8e5df] text-[#713f2c] font-display font-semibold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 border border-[#d3ccc2]"
                  >
                    <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                    Batik Ask
                  </Link>

                  <Link
                    href={`/play/cap?motif=${selectedMotif.rawId}`}
                    className="w-full bg-[#713f2c] hover:bg-[#583122] text-[#D4AF37] font-display font-semibold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Gamepad2 className="w-4 h-4" />
                    Mainkan di Batik Cap
                  </Link>
                </div>
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setLockedModalMotif(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-3xl max-w-md w-full p-6 text-center border border-[#d3ccc2] shadow-2xl"
            >
              <button
                onClick={() => setLockedModalMotif(null)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-[#FFF9E6] border border-[#D4AF37]/50 flex items-center justify-center text-[#713f2c] mx-auto mb-4">
                <Lock className="w-7 h-7 text-[#D4AF37]" />
              </div>

              <h3 className="font-display font-extrabold text-xl text-[#2d2b38] mb-1">
                {lockedModalMotif.fullName} Masih Terkunci
              </h3>
              <p className="text-xs text-[#8d786a] mb-5">
                Kartu ini merupakan wastra adiluhung dari sentra <strong>{lockedModalMotif.region}</strong>.
              </p>

              <div className="bg-[#FAF8F4] p-4 rounded-xl border border-[#d3ccc2] text-left text-xs space-y-2 mb-6">
                <p className="font-display font-bold text-[#713f2c]">Cara Membuka Kartu Ini:</p>
                <ul className="space-y-1.5 text-[#2d2b38] list-disc list-inside">
                  <li>Mainkan <strong>Batik Cap</strong> dan selesaikan stempel cap motif ini.</li>
                  <li>Petakan motif ini ke sentra {lockedModalMotif.region} di <strong>Batik Map</strong>.</li>
                  <li>Atau tebak motif ini dengan benar di <strong>Batik Guess</strong>.</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setLockedModalMotif(null)}
                  className="flex-1 border border-[#d3ccc2] text-[#8d786a] font-display font-semibold text-xs py-2.5 rounded-xl hover:bg-[#e8e5df] transition-colors"
                >
                  Tutup
                </button>
                <Link
                  href="/play"
                  className="flex-1 bg-[#713f2c] text-[#D4AF37] font-display font-semibold text-xs py-2.5 rounded-xl hover:bg-[#583122] transition-colors flex items-center justify-center gap-1"
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
