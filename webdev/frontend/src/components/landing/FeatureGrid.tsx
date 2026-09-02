"use client";

import React from "react";
import { Gamepad2, Sparkles, MapPin } from "lucide-react";
import { motion } from "motion/react";

const pillars = [
  {
    icon: Gamepad2,
    title: "Arcade Edukasi",
    subtitle: "Bermain & Belajar",
    desc: "Uji pengetahuan Anda melalui Jigsaw Puzzle interaktif dan tantangan Detektif Isen-Isen. Belajar filosofi motif menjadi menyenangkan.",
    iconBg: "bg-[#f5f3ef]",
    iconColor: "text-[#7A3E1D]",
  },
  {
    icon: Sparkles,
    title: "AI Cultural Suite",
    subtitle: "Teknologi Penjaga Budaya",
    desc: "Gunakan AI Batik Lens Scanner untuk mengidentifikasi motif dalam sekejap, atau berbincang dengan \"Tanya Sang Empu\".",
    iconBg: "bg-[#FFF8E7]",
    iconColor: "text-[#D4AF37]",
    subtitleColor: "text-[#7A3E1D]",
  },
  {
    icon: MapPin,
    title: "Eksplorasi Budaya",
    subtitle: "Jelajahi Nusantara",
    desc: "Telusuri peta interaktif penyebaran batik dan kumpulkan koleksi digital di galeri Batikpedia Anda.",
    iconBg: "bg-[#EEF2FF]",
    iconColor: "text-[#1E3A8A]",
  },
];

export function FeatureGrid() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="py-20 px-6 lg:px-16 max-w-[1280px] mx-auto overflow-hidden">
      {/* Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="font-display font-bold text-2xl text-[#7A3E1D] mb-2">
          Pilar Penjaga Tradisi
        </h2>
        <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto rounded-full" />
      </motion.div>

      {/* 3-column grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
      >
        {pillars.map((p, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            className={`bg-white border border-[#e4e2de] rounded-xl p-8 hover:shadow-lg transition-all group ${
              idx === 1 ? "relative overflow-hidden" : ""
            }`}
          >
            {idx === 1 && (
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#D4AF37]/8 rounded-full blur-2xl group-hover:bg-[#D4AF37]/15 transition-colors" />
            )}

            {/* Icon */}
            <div
              className={`w-14 h-14 ${p.iconBg} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
            >
              <p.icon className={`w-6 h-6 ${p.iconColor}`} />
            </div>

            {/* Text */}
            <h3 className="font-display font-semibold text-lg text-[#1b1c1a] mb-2">
              {p.title}
            </h3>
            <p
              className={`font-body text-sm font-semibold mb-4 ${
                p.subtitleColor || "text-[#53433C]"
              }`}
            >
              {p.subtitle}
            </p>
            <p className="font-narrative text-sm text-[#53433C] leading-relaxed">
              {p.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
