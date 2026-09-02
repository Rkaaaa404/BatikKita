"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Map, ArrowLeft, Search, MapPin, ChevronRight, X, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const REGIONS = [
  {
    id: "yogyakarta",
    name: "Yogyakarta",
    description: "Pusat kebudayaan Mataram. Terkenal dengan motif geometris yang sarat makna filosofis keraton seperti Kawung dan Parang.",
    color: "from-[#713f2c] to-[#4A2511]",
    motifs: [
      { name: "Kawung", category: "Keraton", image: "/images/batik-kawung.jpg" },
      { name: "Parang Rusak", category: "Keraton", image: "/images/batik-parang.jpg" },
    ]
  },
  {
    id: "cirebon",
    name: "Cirebon",
    description: "Terletak di pesisir utara, batiknya banyak dipengaruhi budaya Tiongkok. Warna lebih cerah dengan motif alam yang bebas.",
    color: "from-[#1E3A8A] to-[#0F172A]",
    motifs: [
      { name: "Mega Mendung", category: "Pesisiran", image: "/images/batik-megamendung.jpg" },
      { name: "Singa Barong", category: "Pesisiran", image: "/images/batik-singabarong.jpg" }
    ]
  },
  {
    id: "solo",
    name: "Surakarta (Solo)",
    description: "Khas dengan warna soga (cokelat kekuningan) yang hangat. Cenderung memiliki motif yang lebih detail dan luwes dibanding Yogya.",
    color: "from-[#8d786a] to-[#4A2511]",
    motifs: [
      { name: "Sidomukti", category: "Keraton", image: "/images/batik-sidomukti.jpg" },
      { name: "Truntum", category: "Keraton", image: "/images/batik-truntum.jpg" }
    ]
  },
  {
    id: "pekalongan",
    name: "Pekalongan",
    description: "Kota Batik Dunia. Motif pesisiran yang sangat dinamis, penuh warna, dan banyak dipengaruhi motif buketan bunga Eropa.",
    color: "from-[#10B981] to-[#047857]",
    motifs: [
      { name: "Jlamprang", category: "Pesisiran", image: "/images/batik-jlamprang.jpg" },
      { name: "Buketan", category: "Pesisiran", image: "/images/batik-buketan.jpg" }
    ]
  }
];

export default function BatikpediaPage() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredRegions = REGIONS.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.description.toLowerCase().includes(search.toLowerCase())
  );

  const selectedRegion = REGIONS.find(r => r.id === activeRegion);

  return (
    <div className="min-h-screen bg-[#faf8f4] font-body text-[#2d2b38] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#d3ccc2] px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/" className="w-10 h-10 rounded-full bg-[#f5f3ef] flex items-center justify-center text-[#713f2c] hover:bg-[#e8e5df] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-display font-bold text-xl text-[#713f2c]">Peta Batikpedia</h1>
            <p className="text-xs text-[#8d786a]">Jelajahi sentra batik nusantara</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Link href="/collection" className="flex items-center gap-2 bg-[#713f2c] text-[#D4AF37] px-4 py-2 rounded-full font-display font-bold text-xs hover:bg-[#583122] transition-colors">
            <Sparkles className="w-4 h-4" />
            Koleksi Kartu Saya
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Explorer */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari daerah atau motif..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-[#d3ccc2] rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-[#713f2c] focus:ring-1 focus:ring-[#713f2c] transition-all shadow-sm"
            />
            <Search className="w-5 h-5 text-[#8d786a] absolute left-4 top-1/2 -translate-y-1/2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredRegions.map((region, i) => (
              <motion.button
                key={region.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setActiveRegion(region.id)}
                className={`relative overflow-hidden rounded-2xl text-left transition-all border group ${
                  activeRegion === region.id 
                    ? "border-[#713f2c] shadow-md ring-2 ring-[#713f2c]/20 scale-[1.02]" 
                    : "border-[#d3ccc2] bg-white hover:border-[#713f2c]/50 hover:shadow-sm"
                }`}
              >
                <div className={`h-24 bg-gradient-to-br ${region.color} relative p-4 flex flex-col justify-end`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  <h3 className="font-display font-bold text-xl text-white relative z-10 drop-shadow-md">
                    {region.name}
                  </h3>
                </div>
                <div className="p-4 bg-white flex items-start justify-between gap-4">
                  <p className="text-sm text-[#8d786a] line-clamp-2 leading-relaxed">
                    {region.description}
                  </p>
                  <div className="w-8 h-8 rounded-full bg-[#f5f3ef] flex items-center justify-center shrink-0 text-[#713f2c] group-hover:bg-[#713f2c] group-hover:text-[#D4AF37] transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right Column: Region Details (Slide Over on mobile, fixed on desktop) */}
        <AnimatePresence mode="wait">
          {selectedRegion ? (
            <motion.div
              key={selectedRegion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full lg:w-[400px] shrink-0 flex flex-col gap-4 sticky top-24"
            >
              <div className="bg-white rounded-3xl p-6 border border-[#d3ccc2] shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-display font-bold text-[#713f2c] bg-[#713f2c]/10 px-2.5 py-1 rounded-full w-fit mb-2">
                      <MapPin className="w-3.5 h-3.5" /> Sentra Batik
                    </div>
                    <h2 className="font-display font-bold text-2xl text-[#2d2b38]">{selectedRegion.name}</h2>
                  </div>
                  <button 
                    onClick={() => setActiveRegion(null)}
                    className="w-8 h-8 rounded-full bg-[#f5f3ef] flex items-center justify-center text-[#8d786a] hover:bg-[#e8e5df] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[#8d786a] text-sm leading-relaxed mb-6 pb-6 border-b border-[#d3ccc2]">
                  {selectedRegion.description}
                </p>

                <h3 className="font-display font-bold text-sm text-[#2d2b38] mb-4">Katalog Motif Khas</h3>
                <div className="space-y-3">
                  {selectedRegion.motifs.map((motif, i) => (
                    <div key={i} className="flex gap-4 items-center p-3 rounded-xl hover:bg-[#f5f3ef] transition-colors cursor-pointer border border-transparent hover:border-[#d3ccc2]">
                      <div className="w-16 h-16 rounded-lg bg-[#e8e5df] shrink-0 border border-[#d3ccc2] relative overflow-hidden">
                         <div className="absolute inset-0 bg-[#d3ccc2]/30 flex items-center justify-center text-[10px] text-[#8d786a] font-display">No Image</div>
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-[#2d2b38]">{motif.name}</h4>
                        <p className="text-xs text-[#8d786a]">{motif.category}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#d3ccc2] ml-auto" />
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-[#d3ccc2]">
                  <Link href="/play" className="w-full flex items-center justify-center gap-2 bg-[#713f2c] text-[#D4AF37] px-6 py-3 rounded-xl font-display font-bold text-sm hover:bg-[#583122] transition-colors shadow-md">
                    Mainkan Puzzle {selectedRegion.name}
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="hidden lg:flex w-[400px] shrink-0 items-center justify-center border-2 border-dashed border-[#d3ccc2] rounded-3xl bg-[#f5f3ef]/50 h-[600px] sticky top-24">
              <div className="text-center p-8">
                <Map className="w-12 h-12 text-[#d3ccc2] mx-auto mb-4" />
                <h3 className="font-display font-bold text-lg text-[#8d786a] mb-2">Pilih Daerah</h3>
                <p className="text-sm text-[#8d786a]/70">Klik salah satu kartu di sebelah kiri untuk melihat detail sejarah dan motif dari daerah tersebut.</p>
              </div>
            </div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
