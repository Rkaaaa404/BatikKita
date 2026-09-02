"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Lock, Share2, Sparkles, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Mock data (in a real app, this joins with user_cards or reads from localStorage)
const CARDS = [
  { id: "kawung", name: "Kawung", region: "Yogyakarta", category: "Keraton", isUnlocked: true, image: "/images/batik-kawung.jpg" },
  { id: "parang", name: "Parang Rusak", region: "Yogyakarta", category: "Keraton", isUnlocked: true, image: "/images/batik-parang.jpg" },
  { id: "megamendung", name: "Mega Mendung", region: "Cirebon", category: "Pesisiran", isUnlocked: false, image: "/images/batik-megamendung.jpg" },
  { id: "truntum", name: "Truntum", region: "Surakarta", category: "Keraton", isUnlocked: false, image: "/images/batik-truntum.jpg" },
  { id: "jlamprang", name: "Jlamprang", region: "Pekalongan", category: "Pesisiran", isUnlocked: false, image: "/images/batik-jlamprang.jpg" },
];

export default function CollectionPage() {
  const [unlockedCards, setUnlockedCards] = useState<string[]>([]);
  
  // Load from local storage just in case we have data from useXp logic later
  useEffect(() => {
    try {
      const stored = localStorage.getItem("batik_unlocked_cards");
      if (stored) {
        setUnlockedCards(JSON.parse(stored));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const totalCards = CARDS.length;
  const unlockedCount = CARDS.filter(c => c.isUnlocked || unlockedCards.includes(c.id)).length;
  const progress = Math.round((unlockedCount / totalCards) * 100);

  return (
    <div className="min-h-screen bg-[#faf8f4] font-body text-[#2d2b38] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#d3ccc2] px-6 py-4 flex flex-wrap items-center justify-between sticky top-0 z-40 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <Link href="/batikpedia" className="w-10 h-10 rounded-full bg-[#f5f3ef] flex items-center justify-center text-[#713f2c] hover:bg-[#e8e5df] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-display font-bold text-xl text-[#713f2c]">Album Koleksi</h1>
            <p className="text-xs text-[#8d786a]">Kartu Pencapaian Batikpedia</p>
          </div>
        </div>
        
        {/* Progress Tracker */}
        <div className="flex items-center gap-4 bg-[#f5f3ef] px-4 py-2 rounded-xl border border-[#d3ccc2]">
          <div className="flex flex-col">
            <span className="text-xs text-[#8d786a] font-display font-bold uppercase tracking-wider">Progress</span>
            <span className="text-sm font-bold text-[#713f2c]">{unlockedCount} / {totalCards} Motif</span>
          </div>
          <div className="w-24 sm:w-32 h-2 bg-[#d3ccc2] rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-[#D4AF37]"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {CARDS.map((card, i) => {
            const unlocked = card.isUnlocked || unlockedCards.includes(card.id);
            
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative aspect-[3/4] rounded-3xl overflow-hidden group ${
                  unlocked 
                    ? "border border-[#D4AF37]/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-white hover:scale-[1.02] transition-transform cursor-pointer" 
                    : "border border-[#d3ccc2] bg-[#e8e5df] opacity-80"
                }`}
              >
                {unlocked ? (
                  <>
                    {/* Card Content - Unlocked */}
                    <div className="absolute inset-0 bg-[#713f2c] z-0" />
                    
                    {/* Holographic Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#D4AF37]/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 -translate-x-full z-20 pointer-events-none" style={{ width: '200%' }} />

                    <div className="absolute inset-[4px] border border-[#D4AF37]/30 rounded-[20px] z-10 flex flex-col p-4 bg-gradient-to-b from-black/40 via-transparent to-black/80">
                      
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-auto">
                        <span className="bg-[#D4AF37] text-[#1A1614] text-[10px] font-display font-extrabold px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-sm">
                          {card.category}
                        </span>
                        <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Info */}
                      <div>
                        <h3 className="font-display font-bold text-2xl text-white mb-1 shadow-black drop-shadow-md">
                          {card.name}
                        </h3>
                        <p className="text-white/80 text-xs flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {card.region}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Card Content - Locked */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                      <div className="w-16 h-16 rounded-full bg-[#d3ccc2]/50 flex items-center justify-center text-[#8d786a] mb-4">
                        <Lock className="w-6 h-6" />
                      </div>
                      <h3 className="font-display font-bold text-lg text-[#8d786a] mb-1">Motif Terkunci</h3>
                      <p className="text-xs text-[#8d786a]/80">
                        Selesaikan Jigsaw Puzzle {card.region} untuk membuka kartu ini.
                      </p>
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
