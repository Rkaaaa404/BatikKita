"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Map, Search, MapPin, ChevronRight, X, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

const REGIONS = [
  {
    id: "yogyakarta",
    name: "Yogyakarta",
    description: "Pusat kebudayaan Mataram. Terkenal dengan motif geometris berfilosofi luhur, berlatar putih pethak, seperti Kawung, Parang, Sekar Jagad, Bokor Kencono, Sidomulyo, dan Wahyu Tumurun.",
    color: "from-[#713f2c] to-[#4A2511]",
    motifs: [
      { name: "Kawung", category: "Keraton", image: "/images/batik-kawung.jpg" },
      { name: "Parang", category: "Keraton Larangan", image: "/images/batik-parang-rusak.jpg" },
      { name: "Sekar Jagad", category: "Keraton", image: "/images/batik-kawung.jpg" },
      { name: "Bokor Kencono", category: "Keraton", image: "/images/batik-kawung.jpg" },
      { name: "Sidomulyo", category: "Keraton", image: "/images/batik-kawung.jpg" },
      { name: "Wahyu Tumurun", category: "Keraton", image: "/images/batik-parang-rusak.jpg" },
    ],
  },
  {
    id: "solo",
    name: "Surakarta (Solo)",
    description: "Khas dengan warna soga cokelat kekuningan hangat dan isen-isen lembut. Rumah bagi motif Sidomukti, Truntum, Sidoluhur, Srikaton, Tribusono, dan Wirasat.",
    color: "from-[#8d786a] to-[#4A2511]",
    motifs: [
      { name: "Sidomukti", category: "Keraton", image: "/images/batik-kawung.jpg" },
      { name: "Truntum", category: "Keraton", image: "/images/batik-truntum.jpg" },
      { name: "Sidoluhur", category: "Keraton", image: "/images/batik-kawung.jpg" },
      { name: "Srikaton", category: "Keraton", image: "/images/batik-parang-rusak.jpg" },
      { name: "Tribusono", category: "Keraton", image: "/images/batik-kawung.jpg" },
      { name: "Wirasat", category: "Keraton", image: "/images/batik-parang-rusak.jpg" },
    ],
  },
  {
    id: "cirebon",
    name: "Cirebon",
    description: "Pertemuan budaya pesisir Jawa, Sunda, dan Tiongkok. Terkenal dengan gradasi awan Mega Mendung dan keagungan kereta Singa Barong Kasepuhan.",
    color: "from-[#1E3A8A] to-[#0F172A]",
    motifs: [
      { name: "Mega Mendung", category: "Pesisiran", image: "/images/batik-mega-mendung.jpg" },
      { name: "Singa Barong", category: "Keraton", image: "/images/batik-mega-mendung.jpg" },
    ],
  },
  {
    id: "pekalongan",
    name: "Pekalongan",
    description: "Kota Batik Dunia. Motif pesisiran dinamis penuh warna cerah, dengan pengaruh akulturasi buketan bunga Eropa, Jlamprang geometri Arab-India, dan Tujuh Rupa flora fauna.",
    color: "from-[#10B981] to-[#047857]",
    motifs: [
      { name: "Jlamprang", category: "Pesisiran", image: "/images/batik-jlamprang.jpg" },
      { name: "Buketan", category: "Pesisiran", image: "/images/batik-mega-mendung.jpg" },
      { name: "Tujuh Rupa", category: "Pesisiran", image: "/images/batik-mega-mendung.jpg" },
    ],
  },
  {
    id: "jakarta",
    name: "DKI Jakarta (Betawi)",
    description: "Sentra batik ibu kota dengan warna cerah ceria, mengekspresikan keramahan warga Betawi dengan ornamen Ondel-ondel, pucuk rebung, dan kembang kelapa.",
    color: "from-[#EA580C] to-[#C2410C]",
    motifs: [
      { name: "Batik Betawi", category: "Pesisiran", image: "/images/batik-mega-mendung.jpg" },
    ],
  },
  {
    id: "lasem",
    name: "Lasem (Rembang)",
    description: "Kota Pusaka Tiongkok Kecil di pesisir Jawa Tengah. Terkenal dengan warna merah getih pitik dan motif Naga Liong yang melambangkan kemakmuran akulturasi.",
    color: "from-[#DC2626] to-[#991B1B]",
    motifs: [
      { name: "Batik Liong", category: "Pesisiran", image: "/images/batik-parang-rusak.jpg" },
    ],
  },
  {
    id: "kalimantan",
    name: "Kalimantan",
    description: "Kekayaan wastra luar Jawa dengan ragam hias Batang Garing (Pohon Kehidupan), tameng telawang, dan sulur pakis khas kearifan suku Dayak.",
    color: "from-[#059669] to-[#064E3B]",
    motifs: [
      { name: "Batik Dayak", category: "Nusantara", image: "/images/batik-kawung.jpg" },
    ],
  },
];

export default function BatikpediaPage() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredRegions = REGIONS.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase())
  );

  const selectedRegion = REGIONS.find((r) => r.id === activeRegion);

  return (
    <div className="min-h-screen bg-[#faf8f4] font-body text-[#2d2b38] flex flex-col">
      {/* Global Navbar */}
      <Navbar variant="transparent" />

      <main className="flex-1">
        {/* ─── Hero Section with Dedicated Batik Pedia Imagery (Full-bleed like Beranda) ─── */}
        <section className="relative w-full overflow-hidden bg-[#1A1614] pt-36 pb-24 px-6 lg:px-16 min-h-[560px] lg:min-h-[620px] flex items-center">
          {/* Background Image - Full-bleed like Beranda */}
          <Image
            src="/images/batik-tab-batikpedia.jpg"
            alt="Ensiklopedia Batik Pedia Nusantara"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />

          {/* Contrast overlays for text legibility & smooth page transition */}
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
                Telusuri persebaran geografis, akar sejarah akulturasi, dan kedalaman makna simbolik setiap motif khas Nusantara dari keraton Mataram hingga pesisiran.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-display text-white/70">
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{REGIONS.length} Sentra Daerah</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Katalog Ragam Hias Tradisional</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Search Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-5"
            >
              <div className="bg-[#1A1614]/80 backdrop-blur-xl border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4">
                <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#D4AF37]" />
                  Eksplorasi Sentra & Motif
                </h3>
                <p className="font-narrative text-xs text-white/70 leading-relaxed">
                  Ketik nama kota, daerah pesisir, atau nama motif untuk menelusuri keunikan budaya lokal:
                </p>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Contoh: Mega Mendung, Yogyakarta, Lasem..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-black/50 border border-white/20 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-white/40 focus:outline-hidden focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all shadow-inner"
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
                    {["Yogyakarta", "Solo", "Cirebon", "Pekalongan", "Lasem"].map((tag) => (
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

        {/* ─── Interactive Region Explorer Workspace ─── */}
        <section className="max-w-[1280px] mx-auto w-full px-6 lg:px-16 py-14 flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#713f2c]/10">
            <div>
              <h2 className="font-display font-bold text-2xl text-[#2d2b38]">
                Daftar Sentra Batik Nusantara
              </h2>
              <p className="font-narrative text-xs sm:text-sm text-[#8d786a] mt-0.5">
                Menampilkan {filteredRegions.length} sentra kebudayaan{search ? ` dengan kata kunci "${search}"` : ""}
              </p>
            </div>
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-xs font-display font-bold text-[#713f2c] hover:underline cursor-pointer self-start sm:self-auto"
              >
                Reset Pencarian
              </button>
            )}
          </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Column: Regions Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
            {filteredRegions.map((region) => {
              const isSelected = activeRegion === region.id;
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
                        {region.motifs.length} Motif Utama
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-xl text-[#2d2b38] mb-2">
                      Sentra {region.name}
                    </h3>

                    <p className="font-narrative text-xs text-[#8d786a] leading-relaxed mb-4">
                      {region.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#713f2c]/10 flex items-center justify-between text-xs font-display font-semibold text-[#713f2c]">
                    <span>Lihat Detail Ragam Hias</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Region Detail Panel */}
          <AnimatePresence mode="wait">
            {selectedRegion ? (
              <motion.div
                key={selectedRegion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full lg:w-[420px] shrink-0 bg-white rounded-2xl border border-[#713f2c]/30 shadow-xl overflow-hidden sticky top-24"
              >
                <div className="bg-[#713f2c] p-6 text-white relative">
                  <button
                    type="button"
                    onClick={() => setActiveRegion(null)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-display font-bold text-[#D4AF37] uppercase tracking-wider block mb-1">
                    Sentra Terpilih
                  </span>
                  <h2 className="font-display font-bold text-2xl mb-2">
                    {selectedRegion.name}
                  </h2>
                  <p className="font-narrative text-xs text-white/80 leading-relaxed">
                    {selectedRegion.description}
                  </p>
                </div>

                <div className="p-6 space-y-4">
                  <h4 className="font-display font-bold text-sm text-[#2d2b38] uppercase tracking-wider">
                    Ragam Motif Khas:
                  </h4>
                  <div className="space-y-3">
                    {selectedRegion.motifs.map((motif) => (
                      <div
                        key={motif.name}
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-[#d3ccc2]/70 bg-[#faf8f4]"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-[#d3ccc2]">
                          <Image
                            src={motif.image}
                            alt={motif.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h5 className="font-display font-bold text-sm text-[#2d2b38]">
                            {motif.name}
                          </h5>
                          <p className="font-narrative text-xs text-[#8d786a]">
                            Kategori: {motif.category}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[#713f2c]/10">
                    <Link
                      href="/play"
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#713f2c] text-[#D4AF37] px-6 py-3.5 rounded-xl font-display font-bold text-sm hover:bg-[#583122] transition-colors shadow-sm"
                    >
                      <span>Mainkan di Arcade</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="hidden lg:flex w-[420px] shrink-0 flex-col items-center justify-center border-2 border-dashed border-[#d3ccc2] rounded-2xl bg-white/50 p-8 text-center min-h-[420px] sticky top-24">
                <Map className="w-12 h-12 text-[#8d786a]/40 mb-4" />
                <h3 className="font-display font-bold text-lg text-[#2d2b38] mb-2">
                  Pilih Salah Satu Sentra
                </h3>
                <p className="font-narrative text-xs text-[#8d786a] max-w-xs leading-relaxed">
                  Klik kartu daerah di sebelah kiri untuk menelaah karakteristik motif dan cerita kebudayaannya.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
