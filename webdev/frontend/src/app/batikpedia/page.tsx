"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  MapPin,
  ChevronRight,
  X,
  Sparkles,
  ArrowRight,
  Palette,
  Layers,
  Info,
  Compass,
  Check,
  Scan,
  Gamepad2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { BATIK_DATASET_20, BatikMotif } from "@/data/batikDataset";

interface RegionData {
  id: string;
  name: string;
  province: string;
  description: string;
  motifIds: string[];
}

const REGIONS: RegionData[] = [
  {
    id: "yogyakarta",
    name: "Yogyakarta",
    province: "D.I. Yogyakarta",
    description:
      "Pusat kebudayaan Mataram Islam. Ciri khas motifnya berkarakter tegas, sakral, dan bersahaja dengan dominasi warna putih pethak, sogan cokelat, dan biru tua wedelan.",
    motifIds: [
      "batik_kawung",
      "batik_parang",
      "batik_sekarjagad",
      "batik_bokor_kencono",
      "batik_sidomulyo",
    ],
  },
  {
    id: "solo",
    name: "Surakarta (Solo)",
    province: "Jawa Tengah",
    description:
      "Terkenal dengan soga cokelat keemasan hangat dan isen-isen cecek yang sangat halus. Menghasilkan motif berfilosofi doa restu dan keluhuran budi.",
    motifIds: [
      "batik_sidomukti",
      "batik_truntum",
      "batik_sidoluhur",
      "batik_srikaton",
      "batik_tribusono",
      "batik_wahyu_tumurun",
      "batik_wirasat",
    ],
  },
  {
    id: "cirebon",
    name: "Cirebon",
    province: "Jawa Barat",
    description:
      "Pertemuan akulturasi maritim pesisir Jawa, Sunda, dan Tiongkok. Menghasilkan gradasi awan bertumpuk Mega Mendung dan keagungan kereta Singa Barong.",
    motifIds: [
      "batik_mega_mendung",
      "batik_singa_barong",
    ],
  },
  {
    id: "pekalongan",
    name: "Pekalongan",
    province: "Jawa Tengah",
    description:
      "Sentra batik pesisiran paling dinamis dengan keterbukaan pengaruh buketan bunga Belanda, geometri Patola India (Jlamprang), dan warna-warni cerah multi-etnis.",
    motifIds: [
      "batik_jlamprang",
      "batik_buketan",
      "batik_tujuh_rupa",
    ],
  },
  {
    id: "lasem",
    name: "Lasem (Rembang)",
    province: "Jawa Tengah",
    description:
      "Kota pusaka akulturasi Tionghoa dan Jawa di pesisir utara. Terkenal dengan merah getih pitik dan ornamen naga liong pembawa kemakmuran.",
    motifIds: [
      "batik_liong",
    ],
  },
  {
    id: "jakarta",
    name: "DKI Jakarta (Betawi)",
    province: "DKI Jakarta",
    description:
      "Batik pesisir ibu kota dengan palet warna menyala ceria. Mengekspresikan keramahan warga Betawi melalui figur Ondel-ondel dan tumpal pucuk rebung penangkal bala.",
    motifIds: [
      "batik_betawi",
    ],
  },
  {
    id: "kalimantan",
    name: "Kalimantan",
    province: "Kalimantan",
    description:
      "Wastra Dayak dengan stilasi Pohon Kehidupan (Batang Garing), tameng telawang, dan sulur pakis alam yang sarat penghormatan kepada semesta.",
    motifIds: [
      "batik_dayak",
    ],
  },
];

export default function BatikpediaPage() {
  const [activeRegion, setActiveRegion] = useState<string | null>("yogyakarta");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"sentra" | "katalog">("sentra");

  // Selected Motif Modal State
  const [selectedMotif, setSelectedMotif] = useState<BatikMotif | null>(null);
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);

  // Quick lookup map for motifs
  const motifMap = useMemo(() => {
    const map = new Map<string, BatikMotif>();
    BATIK_DATASET_20.forEach((m) => map.set(m.id, m));
    return map;
  }, []);

  // Filtered motifs & regions based on search
  const filteredRegions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return REGIONS;
    return REGIONS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.motifIds.some((id) => {
          const m = motifMap.get(id);
          return m?.name.toLowerCase().includes(q) || m?.philosophy.toLowerCase().includes(q);
        })
    );
  }, [search, motifMap]);

  const filteredMotifs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return BATIK_DATASET_20;
    return BATIK_DATASET_20.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.region.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.visualTraits.toLowerCase().includes(q)
    );
  }, [search]);

  const currentRegion = REGIONS.find((r) => r.id === activeRegion);

  const handleOpenMotif = (motif: BatikMotif) => {
    const fullMotif = motifMap.get(motif.id) || motif;
    setSelectedMotif({
      ...fullMotif,
      variants: Array.isArray(fullMotif.variants) ? fullMotif.variants : [],
    });
    setActiveVariantIndex(0);
  };

  return (
    <div className="min-h-screen bg-[#faf8f4] font-body text-[#2d2b38] flex flex-col">
      {/* Global Navbar */}
      <Navbar variant="transparent" />

      <main className="flex-1">
        {/* ─── Hero Section with Dedicated Batik Pedia WebP Imagery ─── */}
        <section className="relative w-full overflow-hidden bg-[#1A1614] pt-36 pb-24 px-6 lg:px-16 min-h-[560px] lg:min-h-[620px] flex items-center">
          {/* Background Image: batik-tab-batikpedia.webp */}
          <Image
            src="/images/batik-tab-batikpedia.webp"
            alt="Ensiklopedia Batik Pedia Nusantara"
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

          <div className="max-w-[1280px] mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 text-left"
            >
              <div className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-display font-bold px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm shadow-sm">
                <Sparkles className="w-4 h-4" />
                <span>ENSIKLOPEDIA & SENTRA BUDAYA NUSANTARA</span>
              </div>

              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-[54px] text-white leading-[1.08] tracking-tight mb-5">
                <span className="font-philosopher tracking-wide">Batik Pedia</span>:{" "}
                <span
                  style={{
                    color: "#D4AF37",
                    textShadow: "0 2px 20px rgba(212,175,55,0.4)",
                  }}
                >
                  Peta Sentra & Filosofi
                </span>{" "}
                Wastra Nusantara.
              </h1>

              <p className="font-narrative text-base sm:text-lg text-white/80 max-w-xl leading-relaxed mb-6">
                Telusuri persebaran geografis, akar akulturasi, dan kedalaman makna simbolik dari 20 motif tradisional Nusantara dari keraton Jawa hingga pesisir dan tanah Papua.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-display text-white/70">
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>10 Sentra Kebudayaan</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
                  <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>20 Motif & Ragam Warna</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Search & Discovery Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-5"
            >
              <div className="bg-[#1A1816]/80 backdrop-blur-xl border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4">
                <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#D4AF37]" />
                  Eksplorasi Sentra & Motif
                </h3>
                <p className="font-narrative text-xs text-white/70 leading-relaxed">
                  Cari nama kota, daerah pesisir, atau nama motif untuk menelaah filosofi dan ragam warnanya:
                </p>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Contoh: Kawung, Mega Mendung, Solo, Lasem..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-black/50 border border-white/20 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all shadow-inner font-display"
                  />
                  <Search className="w-4 h-4 text-[#D4AF37] absolute left-4 top-1/2 -translate-y-1/2" />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Quick filter chips */}
                <div className="pt-2">
                  <span className="text-[11px] font-display text-white/50 block mb-2">
                    Pilihan Populer:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {["Yogyakarta", "Solo", "Cirebon", "Pekalongan", "Lasem", "Papua"].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSearch(search === tag ? "" : tag)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-display ${
                          search === tag
                            ? "bg-[#D4AF37] text-[#1A1614] border-[#D4AF37] font-bold"
                            : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10 hover:border-white/25"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Interactive Explorer Section ─── */}
        <section className="max-w-[1280px] mx-auto w-full px-6 lg:px-16 py-12 flex flex-col gap-8">
          {/* View Mode Toggle Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#713f2c]/10">
            <div>
              <h2 className="font-display font-bold text-2xl text-[#2d2b38]">
                {viewMode === "sentra" ? "Sentra Kebudayaan Nusantara" : "Katalog 20 Motif Batik"}
              </h2>
              <p className="font-narrative text-xs sm:text-sm text-[#8d786a] mt-0.5">
                {viewMode === "sentra"
                  ? `Menampilkan ${filteredRegions.length} sentra daerah dengan motif khasnya`
                  : `Menampilkan ${filteredMotifs.length} motif terakreditasi dalam model AI`}
                {search ? ` dengan kata kunci "${search}"` : ""}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="bg-[#FAF8F4] border border-[#d3ccc2] p-1 rounded-xl flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setViewMode("sentra")}
                  className={`text-xs font-display font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === "sentra"
                      ? "bg-[#713f2c] text-[#D4AF37] shadow-sm"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Berdasarkan Sentra</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("katalog")}
                  className={`text-xs font-display font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === "katalog"
                      ? "bg-[#713f2c] text-[#D4AF37] shadow-sm"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Semua 20 Motif</span>
                </button>
              </div>

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-xs font-display font-bold text-[#713f2c] hover:underline cursor-pointer ml-2"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* ─── Mode 1: Sentra Kebudayaan Layout ─── */}
          {viewMode === "sentra" && (
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Left: Sentra Cards */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                {filteredRegions.map((region) => {
                  const isSelected = activeRegion === region.id;
                  const regionMotifs = region.motifIds
                    .map((id) => motifMap.get(id))
                    .filter((m): m is BatikMotif => Boolean(m));

                  return (
                    <div
                      key={region.id}
                      onClick={() => setActiveRegion(region.id)}
                      className={`bg-white rounded-2xl p-6 border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "border-[#713f2c] shadow-lg ring-2 ring-[#713f2c]/20"
                          : "border-[#d3ccc2]/80 hover:border-[#713f2c]/50 hover:shadow-md"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-display font-bold text-[#713f2c] bg-[#faf8f4] border border-[#d3ccc2] px-3 py-1 rounded-full flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                            {region.name}
                          </span>
                          <span className="text-xs text-[#8d786a] font-body">
                            {regionMotifs.length} Motif
                          </span>
                        </div>

                        <h3 className="font-display font-bold text-xl text-[#2d2b38] mb-2">
                          Sentra {region.name}
                        </h3>

                        <p className="font-narrative text-xs text-[#8d786a] leading-relaxed mb-4">
                          {region.description}
                        </p>

                        {/* Motif Mini Preview Badges */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {regionMotifs.map((m) => (
                            <span
                              key={m.id}
                              className="text-[11px] font-display font-medium bg-[#faf8f4] text-stone-700 border border-stone-200 px-2 py-0.5 rounded-md"
                            >
                              {m.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#713f2c]/10 flex items-center justify-between text-xs font-display font-semibold text-[#713f2c]">
                        <span>Buka Koleksi Motif</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right: Selected Region Motifs Column */}
              <div className="w-full lg:w-[440px] shrink-0 sticky top-24 space-y-4">
                {currentRegion ? (
                  <div className="bg-white rounded-2xl border border-[#713f2c]/30 shadow-xl overflow-hidden">
                    <div className="bg-[#713f2c] p-6 text-white relative">
                      <span className="text-xs font-display font-bold text-[#D4AF37] uppercase tracking-wider block mb-1">
                        Sentra Terpilih
                      </span>
                      <h2 className="font-display font-bold text-2xl mb-1">
                        {currentRegion.name}
                      </h2>
                      <p className="text-xs text-white/70 font-body mb-3">
                        Provinsi: {currentRegion.province}
                      </p>
                      <p className="font-narrative text-xs text-white/85 leading-relaxed">
                        {currentRegion.description}
                      </p>
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-bold text-xs uppercase tracking-wider text-stone-500">
                          Ragam Motif Khas ({currentRegion.motifIds.length}):
                        </h4>
                        <span className="text-[11px] text-[#713f2c] font-display font-medium">
                          Klik untuk lihat ragam warna
                        </span>
                      </div>

                      <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                        {currentRegion.motifIds.map((motifId) => {
                          const motif = motifMap.get(motifId);
                          if (!motif) return null;

                          return (
                            <button
                              key={motif.id}
                              type="button"
                              onClick={() => handleOpenMotif(motif)}
                              className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl border border-[#d3ccc2]/70 bg-[#faf8f4] hover:bg-amber-50/60 hover:border-[#D4AF37] transition-all cursor-pointer group"
                            >
                              <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-[#d3ccc2] bg-stone-100">
                                <Image
                                  src={motif.image}
                                  alt={motif.name}
                                  fill
                                  sizes="56px"
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h5 className="font-display font-bold text-sm text-[#2d2b38] truncate group-hover:text-[#713f2c]">
                                    {motif.name}
                                  </h5>
                                  <span className="text-[10px] font-display font-bold text-[#D4AF37] bg-black/80 px-1.5 py-0.5 rounded shrink-0">
                                    3 Ragam
                                  </span>
                                </div>
                                <p className="font-narrative text-xs text-[#8d786a] line-clamp-1 mt-0.5">
                                  {motif.visualTraits}
                                </p>
                                <span className="text-[10px] text-stone-400 font-display block mt-1">
                                  {motif.category}
                                </span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#713f2c] shrink-0" />
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-2 border-t border-[#713f2c]/10 flex gap-2">
                        <Link
                          href="/scan"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#FAF8F4] border border-[#d3ccc2] text-stone-800 px-3 py-2.5 rounded-xl font-display font-bold text-xs hover:bg-white transition-colors"
                        >
                          <Scan className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Pindai Kain</span>
                        </Link>
                        <Link
                          href="/play"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#713f2c] text-[#D4AF37] px-3 py-2.5 rounded-xl font-display font-bold text-xs hover:bg-[#583122] transition-colors shadow-sm"
                        >
                          <Gamepad2 className="w-3.5 h-3.5" />
                          <span>Uji di Arcade</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-[#d3ccc2] rounded-2xl bg-white/50 p-8 text-center min-h-[380px] flex flex-col items-center justify-center">
                    <Compass className="w-12 h-12 text-[#8d786a]/40 mb-3" />
                    <h3 className="font-display font-bold text-base text-[#2d2b38] mb-1">
                      Pilih Salah Satu Sentra
                    </h3>
                    <p className="font-narrative text-xs text-[#8d786a] max-w-xs leading-relaxed">
                      Klik kartu sentra di sebelah kiri untuk melihat daftar motif khas dan varian warnanya.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── Mode 2: Katalog 20 Motif Grid ─── */}
          {viewMode === "katalog" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredMotifs.map((motif) => (
                <div
                  key={motif.id}
                  onClick={() => handleOpenMotif(motif)}
                  className="bg-white rounded-2xl border border-[#d3ccc2]/80 hover:border-[#713f2c]/50 hover:shadow-lg transition-all overflow-hidden flex flex-col cursor-pointer group"
                >
                  <div className="relative aspect-square w-full bg-stone-100 overflow-hidden">
                    <Image
                      src={motif.image}
                      alt={motif.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-sm text-white text-[11px] font-display font-bold px-2.5 py-0.5 rounded-full border border-white/20">
                      {motif.region}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-[#D4AF37] text-[#1A1614] text-[10px] font-display font-extrabold px-2 py-0.5 rounded shadow">
                      3 Ragam Visual
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-stone-500 font-display mb-1">
                        <span>{motif.category}</span>
                        <span>{motif.island}</span>
                      </div>
                      <h3 className="font-display font-bold text-lg text-[#2d2b38] group-hover:text-[#713f2c] transition-colors">
                        {motif.name}
                      </h3>
                      <p className="font-narrative text-xs text-[#8d786a] line-clamp-2 mt-1.5 leading-relaxed">
                        {motif.philosophy}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-[#713f2c]/10 flex items-center justify-between text-xs font-display font-semibold text-[#713f2c]">
                      <span>Ragam Warna & Ciri</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ─── Interactive Motif & Variant Gallery Modal ─── */}
        <AnimatePresence>
          {selectedMotif && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto"
              onClick={() => setSelectedMotif(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-[#D4AF37]/30 my-8"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedMotif(null)}
                  className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-12">
                  {/* Left Column: Interactive Image & Variant Thumbnails */}
                  <div className="md:col-span-6 bg-stone-900 p-6 flex flex-col justify-between text-white relative">
                    <div>
                      {/* Active Variant Badges */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-display font-bold text-[#D4AF37] bg-white/10 px-3 py-1 rounded-full border border-[#D4AF37]/30">
                          {selectedMotif.category}
                        </span>
                        <span className="text-xs text-white/60 font-display">
                          {selectedMotif.region}
                        </span>
                      </div>

                      {/* Large Active Image Preview */}
                      <div className="relative aspect-square w-full rounded-2xl overflow-hidden border-2 border-white/15 bg-black/40 shadow-inner mb-4">
                        <Image
                          src={
                            activeVariantIndex === 0
                              ? selectedMotif.image
                              : selectedMotif.variants[activeVariantIndex - 1]?.image ||
                                selectedMotif.image
                          }
                          alt={selectedMotif.name}
                          fill
                          priority
                          sizes="(max-width: 768px) 100vw, 420px"
                          className="object-cover transition-opacity duration-300"
                        />

                        <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md p-2.5 rounded-xl border border-white/15 text-xs font-display">
                          <p className="text-[#D4AF37] font-bold text-[11px] uppercase tracking-wider">
                            {activeVariantIndex === 0
                              ? "Motif Utama (Pewarnaan Tradisional)"
                              : (selectedMotif.variants && selectedMotif.variants[activeVariantIndex - 1]?.name) || "Ragam Variasi"}
                          </p>
                          <p className="text-white/80 font-body text-[11px] mt-0.5">
                            {activeVariantIndex === 0
                              ? selectedMotif.visualTraits
                              : (selectedMotif.variants && selectedMotif.variants[activeVariantIndex - 1]?.description) || selectedMotif.visualTraits}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Variant Thumbnails Gallery */}
                    <div>
                      <span className="text-[11px] font-display font-bold uppercase tracking-wider text-white/50 block mb-2">
                        Pilih Ragam Warna & Variasi Motif:
                      </span>
                      <div className="grid grid-cols-3 gap-2.5">
                        {/* Thumbnail 0: Primary Image */}
                        <button
                          type="button"
                          onClick={() => setActiveVariantIndex(0)}
                          className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                            activeVariantIndex === 0
                              ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/50 scale-95"
                              : "border-white/20 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <Image
                            src={selectedMotif.image}
                            alt="Motif Utama"
                            fill
                            sizes="90px"
                            className="object-cover"
                          />
                          <span className="absolute bottom-1 left-1 right-1 text-[9px] font-display font-bold bg-black/80 text-center text-white rounded py-0.5 truncate px-1">
                            Klasik
                          </span>
                        </button>

                        {/* Thumbnail 1: Variant 1 */}
                        {selectedMotif.variants?.[0] && (
                          <button
                            type="button"
                            onClick={() => setActiveVariantIndex(1)}
                            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                              activeVariantIndex === 1
                                ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/50 scale-95"
                                : "border-white/20 opacity-60 hover:opacity-100"
                            }`}
                          >
                            <Image
                              src={selectedMotif.variants[0].image}
                              alt={selectedMotif.variants[0].name}
                              fill
                              sizes="90px"
                              className="object-cover"
                            />
                            <span className="absolute bottom-1 left-1 right-1 text-[9px] font-display font-bold bg-black/80 text-center text-[#D4AF37] rounded py-0.5 truncate px-1">
                              Ragam 1
                            </span>
                          </button>
                        )}

                        {/* Thumbnail 2: Variant 2 */}
                        {selectedMotif.variants?.[1] && (
                          <button
                            type="button"
                            onClick={() => setActiveVariantIndex(2)}
                            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                              activeVariantIndex === 2
                                ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/50 scale-95"
                                : "border-white/20 opacity-60 hover:opacity-100"
                            }`}
                          >
                            <Image
                              src={selectedMotif.variants[1].image}
                              alt={selectedMotif.variants[1].name}
                              fill
                              sizes="90px"
                              className="object-cover"
                            />
                            <span className="absolute bottom-1 left-1 right-1 text-[9px] font-display font-bold bg-black/80 text-center text-[#D4AF37] rounded py-0.5 truncate px-1">
                              Ragam 2
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Cultural Details & Anti-AI Human Prose */}
                  <div className="md:col-span-6 p-6 sm:p-7 flex flex-col justify-between space-y-5">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-display text-stone-500 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>
                          {selectedMotif.region} • {selectedMotif.province}
                        </span>
                      </div>

                      <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#2d2b38]">
                        {selectedMotif.fullName}
                      </h2>

                      <div className="mt-4 space-y-3.5 text-xs">
                        <div>
                          <span className="font-display font-bold text-stone-800 flex items-center gap-1.5 mb-1 text-xs">
                            <Info className="w-3.5 h-3.5 text-[#713f2c]" />
                            Akar Sejarah & Makna Filosofis:
                          </span>
                          <p className="font-narrative text-stone-700 leading-relaxed bg-[#FAF8F4] p-3 rounded-xl border border-[#E2DDD5]">
                            {selectedMotif.philosophy}
                          </p>
                        </div>

                        <div>
                          <span className="font-display font-bold text-stone-800 block mb-1 text-xs">
                            Karakteristik Visual & Isen-isen:
                          </span>
                          <p className="font-narrative text-stone-600 leading-relaxed">
                            {selectedMotif.visualTraits}
                          </p>
                        </div>

                        <div>
                          <span className="font-display font-bold text-stone-800 block mb-1 text-xs">
                            Konteks Penggunaan Tradisional:
                          </span>
                          <p className="font-narrative text-stone-600 leading-relaxed">
                            {selectedMotif.usage}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row gap-3">
                      <Link
                        href="/scan"
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-[#FAF8F4] hover:bg-stone-100 text-stone-800 border border-stone-300 font-display font-bold text-xs py-3 px-4 rounded-xl transition-all"
                      >
                        <Scan className="w-4 h-4 text-[#D4AF37]" />
                        <span>Pindai di Scanner AI</span>
                      </Link>

                      <Link
                        href="/play/tebak-motif"
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-[#713f2c] hover:bg-[#583122] text-[#D4AF37] font-display font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-md"
                      >
                        <Gamepad2 className="w-4 h-4" />
                        <span>Tebak di Arcade</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
