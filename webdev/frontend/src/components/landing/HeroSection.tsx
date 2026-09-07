"use client";

import React from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { HeroParticles } from "@/components/landing/HeroParticles";

export function HeroSection() {
  // Framer Motion variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* ─── Full-bleed Background Image ─── */}
      <Image
        src="/images/batik-hero-canting.webp"
        alt="Pengrajin batik melukis malam menggunakan canting tembaga"
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority
      />

      {/* ─── Dark gradient overlay for text legibility ─── */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-0" />

      {/* ─── 3D Golden Particles ─── */}
      <HeroParticles />

      {/* Text Content: centered on left */}
      <div className="absolute inset-0 flex flex-col justify-center pt-20 pb-10 px-8 lg:px-20 z-20 pointer-events-none">
        <motion.div 
          className="max-w-xl pointer-events-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Trust badge */}
          <motion.div variants={itemVariants} className="flex items-center gap-2.5 mb-5">
            <Image
              src="/images/logo-batik-kita.png"
              alt="Logo Batik Kita"
              width={26}
              height={26}
              className="w-6 h-6 object-contain drop-shadow-sm"
            />
            <span className="text-white/90 font-display text-sm font-medium tracking-wide">
              Platform Edukasi Batik Nusantara
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={itemVariants} className="font-display font-bold text-[44px] sm:text-[52px] lg:text-[60px] leading-[1.05] text-white mb-4">
            <span className="font-philosopher tracking-wide">Batik Kita:</span>
            <br />
            <span
              style={{
                color: "#D4AF37",
                textShadow: "0 2px 20px rgba(212,175,55,0.4)",
              }}
            >
              Warisan Luhur
            </span>{" "}
            <br />
            dalam Sentuhan Digital.
          </motion.h1>

          {/* Sub */}
          <motion.p variants={itemVariants} className="font-narrative text-base text-white/80 leading-relaxed mb-8 max-w-md">
            Kenali ragam motif kain nusantara, telusuri filosofi di balik setiap goresan canting, dan asah kepekaan budayamu lewat permainan edukatif dan pengenal citra visual.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
            <a
              href="#arcade"
              className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#2d2b38] font-display font-bold text-sm px-7 py-3.5 rounded-full hover:bg-[#c9a52f] transition-all shadow-lg hover:shadow-[#D4AF37]/30"
            >
              Mulai Jelajahi
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>

            <a
              href="#demo"
              className="inline-flex items-center gap-2.5 text-white/90 font-display font-semibold text-sm hover:text-white transition-colors group"
            >
              <div className="w-9 h-9 rounded-full border-2 border-white/70 flex items-center justify-center backdrop-blur-sm bg-white/10 group-hover:bg-white/20 transition-colors">
                <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
              </div>
              Tonton Video Demo
            </a>
          </motion.div>

          {/* Bottom info strip */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-6 mt-10 pt-6 border-t border-white/20">
            {[
              "Peta Interaktif Batik",
              "AI Identifikasi Motif",
              "Arcade Edukasi Budaya",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-1.5 text-white/70 text-xs font-display font-medium"
              >
                <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />
                {item}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
