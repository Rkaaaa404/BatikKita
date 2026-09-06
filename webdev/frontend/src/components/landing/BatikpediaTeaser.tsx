"use client";

import React from "react";
import { Star, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const CARDS = [
  {
    id: "kawung",
    name: "Kawung",
    region: "Yogyakarta",
    category: "Motif Keraton",
    stars: 1,
    isUnlocked: true,
    image: "/images/motifs/batik_kawung.webp",
    philosophy:
      "Melambangkan kesempurnaan, kesucian, dan kemurnian hati. Terinspirasi dari irisan empat kelopak buah aren.",
  },
  {
    id: "parang",
    name: "Parang Rusak",
    region: "Solo & Jogja",
    category: "Motif Larangan",
    stars: 2,
    isUnlocked: true,
    image: "/images/motifs/batik_parang.webp",
    philosophy:
      "Simbol keteguhan, pantang menyerah, dan kesinambungan budi luhur laksana ombak karang samudra.",
  },
  {
    id: "megamendung",
    name: "Mega Mendung",
    region: "Cirebon",
    category: "Motif Pesisiran",
    stars: 3,
    isUnlocked: true,
    image: "/images/motifs/batik_mega_mendung_v2.webp",
    philosophy:
      "Awan pembawa hujan sebagai lambang kesabaran dan keteduhan jiwa, lahir dari akulturasi Cirebon dan Tiongkok.",
  },
];

export function BatikpediaTeaser() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as any } },
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
        <a
          href="#arcade"
          className="inline-flex items-center gap-1.5 text-sm font-display font-semibold text-[#713f2c] hover:text-[#D4AF37] transition-colors"
        >
          Lihat Seluruh Koleksi
          <ArrowRight className="w-4 h-4" />
        </a>
      </motion.div>
      </div>
    </section>
  );
}
