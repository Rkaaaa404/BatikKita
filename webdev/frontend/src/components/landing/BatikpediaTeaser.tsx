"use client";

import React from "react";
import { Star, ArrowRight } from "lucide-react";
import { motion, type Variants } from "motion/react";
import Link from "next/link";
import { BATIK_DATASET_20 } from "@/data/batikDataset";

const FEATURED_MOTIFS = ["batik_kawung", "batik_parang", "batik_mega_mendung"];

const CARDS = FEATURED_MOTIFS.map((id, index) => {
  const motif = BATIK_DATASET_20.find((m) => m.id === id);
  if (!motif) return null;
  return {
    id: motif.id,
    name: motif.name,
    region: motif.region,
    category: motif.category,
    stars: index + 1,
    isUnlocked: true,
    image: motif.image,
    philosophy: motif.philosophy,
  };
}).filter(Boolean) as Array<{
  id: string;
  name: string;
  region: string;
  category: string;
  stars: number;
  isUnlocked: boolean;
  image: string;
  philosophy: string;
}>;

export function BatikpediaTeaser() {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  return (
    <section
      id="batikpedia"
      className="py-24 w-full bg-[#e8e5df] relative overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <span className="inline-block bg-[#D4AF37]/20 text-[#713f2c] font-display font-semibold text-xs px-4 py-1.5 rounded-full mb-4">
          Galeri Koleksi
        </span>
        <h2 className="font-display font-bold text-2xl text-[#713f2c] mb-3">
          Kumpulkan Kartu Batikpedia
        </h2>
        <p className="font-narrative text-base text-[#8d786a] max-w-xl mx-auto">
          Selesaikan tantangan di Arcade dan temukan motif baru melalui AI Scanner untuk melengkapi koleksi digital eksklusif Anda.
        </p>
      </motion.div>

      {/* Cards: 3 columns */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
      >
        {CARDS.map((card) => (
          <motion.div
            key={card.id}
            variants={cardVariants}
            className="bg-white border border-[#d3ccc2] rounded-xl overflow-hidden group hover:-translate-y-1.5 transition-transform duration-300 shadow-sm hover:shadow-lg cursor-pointer"
          >
            {/* Image */}
            <div className="relative h-44 overflow-hidden bg-[#e8e5df]">
              <div
                className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url(${card.image})` }}
              />
              <div className="absolute top-3 right-3 bg-[#1E3A8A] text-white font-display text-[11px] font-bold px-2.5 py-1 rounded shadow">
                {card.region}
              </div>
            </div>

            {/* Body */}
            <div className="p-5">
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-display font-semibold text-base text-[#2d2b38]">
                  {card.name}
                </h4>
                <div className="flex text-[#D4AF37]">
                  {Array.from({ length: card.stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-[11px] font-display font-semibold text-[#713f2c] mb-3 pb-3 border-b border-[#d3ccc2]">
                {card.category}
              </p>
              <p className="font-narrative text-xs text-[#8d786a] line-clamp-2 leading-relaxed">
                {card.philosophy}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer CTA */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-10 text-center"
      >
        <Link
          href="/collection"
          className="inline-flex items-center gap-1.5 text-sm font-display font-semibold text-[#713f2c] hover:text-[#D4AF37] transition-colors"
        >
          Lihat Seluruh Koleksi
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
      </div>
    </section>
  );
}
