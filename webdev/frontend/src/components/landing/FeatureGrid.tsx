"use client";

import React from "react";
import { Gamepad2, Sparkles, MapPin } from "lucide-react";
import { motion, type Variants } from "motion/react";

const pillars = [
  {
    icon: Gamepad2,
    title: "Batik Arcade",
    subtitle: "Bermain & Menempa Mastery",
    desc: "Uji keterampilan dan ketajaman budaya melalui Batik Cap, Batik Guess, Batik Map, dan Batik Zoom. Kumpulkan 20 kartu wastra berbingkai mahakarya.",
    iconBg: "bg-[#e8e5df]",
    iconColor: "text-[#713f2c]",
  },
  {
    icon: Sparkles,
    title: "Batik Lens & Ask",
    subtitle: "AI Cultural Suite Nusantara",
    desc: "Identifikasi motif kain seketika dengan AI Batik Lens multimodal, atau berbincang mendalam seputar filosofi wastra bersama asisten Batik Ask.",
    iconBg: "bg-[#FFF8E7]",
    iconColor: "text-[#D4AF37]",
    subtitleColor: "text-[#713f2c]",
  },
  {
    icon: MapPin,
    title: "Batik Pedia & Koleksi",
    subtitle: "Ensiklopedi & Album Wastra",
    desc: "Telusuri ragam filosofi 20 motif resmi di Batik Pedia, jelajahi 7 sentra Nusantara, dan lengkapi Album Koleksi Wastra digital Anda.",
    iconBg: "bg-[#EEF2FF]",
    iconColor: "text-[#1E3A8A]",
  },
];

export function FeatureGrid() {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.2 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="py-24 w-full bg-white relative border-b border-[#d3ccc2]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16 overflow-hidden">
      {/* Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="font-display font-bold text-2xl text-[#713f2c] mb-2">
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
            className={`bg-white border border-[#d3ccc2] rounded-xl p-8 hover:shadow-lg transition-all group ${
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
            <h3 className="font-display font-semibold text-lg text-[#2d2b38] mb-2">
              {p.title}
            </h3>
            <p
              className={`font-body text-sm font-semibold mb-4 ${
                p.subtitleColor || "text-[#8d786a]"
              }`}
            >
              {p.subtitle}
            </p>
            <p className="font-narrative text-sm text-[#8d786a] leading-relaxed">
              {p.desc}
            </p>
          </motion.div>
        ))}
        </motion.div>
      </div>
    </section>
  );
}
