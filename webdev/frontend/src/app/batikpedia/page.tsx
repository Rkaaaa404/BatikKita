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
      {/* Global Navbar (solid state on light background) */}
      <Navbar variant="solid" />

      <main className="flex-1 max-w-[1280px] mx-auto w-full px-6 lg:px-16 pt-24 pb-16 flex flex-col gap-8">
        {/* Page Title & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#713f2c]/10">
          <div>
            <div className="inline-flex items-center gap-2 text-[#713f2c] text-xs font-display font-bold tracking-wider uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              Ensiklopedia Wastra Nusantara
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#2d2b38] tracking-tight">
              Peta Sentra Batikpedia
            </h1>
            <p className="font-narrative text-sm text-[#8d786a] mt-1 max-w-xl">
              Telusuri asal-usul geografis, sejarah akulturasi, dan karakteristik ragam hias dari sentra-sentra batik terkemuka di tanah air.
            </p>
          </div>

          <div className="w-full md:w-80 relative">
            <input
              type="text"
              placeholder="Cari daerah atau motif..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-[#d3ccc2] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-hidden focus:border-[#713f2c] focus:ring-1 focus:ring-[#713f2c] transition-all shadow-xs"
            />
            <Search className="w-4 h-4 text-[#8d786a] absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
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
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
