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
    <section className="relative w-full min-h-[100dvh] overflow-hidden flex items-center">
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
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-0" />

      {/* ─── 3D Golden Particles ─── */}
      <HeroParticles />

      {/* Text Content: centered on left */}
      <div className="absolute inset-0 flex flex-col justify-center pt-24 pb-12 px-5 sm:px-8 lg:px-20 z-20 pointer-events-none">
        <motion.div 
          className="max-w-xl pointer-events-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Trust badge */}
          <motion.div variants={itemVariants} className="flex items-center gap-2 sm:gap-2.5 mb-3 sm:mb-5">
            <Image
              src="/images/logo-batik-kita.png"
              alt="Logo Batik Kita"
              width={26}
              height={26}
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain drop-shadow-sm"
            />
            <span className="text-white/90 font-display text-xs sm:text-sm font-medium tracking-wide">
              Platform Edukasi Batik Nusantara
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={itemVariants} className="font-display font-bold text-[32px] xs:text-[38px] sm:text-[50px] lg:text-[60px] leading-[1.08] text-white mb-3 sm:mb-4">
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
          <motion.p variants={itemVariants} className="font-narrative text-sm sm:text-base text-white/80 leading-relaxed mb-6 sm:mb-8 max-w-md">
            Kenali ragam motif kain nusantara, telusuri filosofi di balik setiap goresan canting, dan asah kepekaan budayamu lewat permainan edukatif dan pengenal citra visual.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 sm:gap-4">
            <a
              href="#arcade"
              className="inline-flex items-center justify-center gap-2 bg-[#D4AF37] text-[#2d2b38] font-display font-bold text-xs sm:text-sm px-6 sm:px-7 py-3 sm:py-3.5 rounded-full hover:bg-[#c9a52f] transition-all shadow-lg hover:shadow-[#D4AF37]/30 active:scale-95"
            >
              <span>Mulai Jelajahi</span>
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
              href="https://drive.google.com/file/d/10wYwC7uparS5deE57DmuNSLMzMT1B3x_/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/90 font-display font-semibold text-xs sm:text-sm hover:text-white transition-colors group py-2"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white/70 flex items-center justify-center backdrop-blur-sm bg-white/10 group-hover:bg-white/20 transition-colors">
                <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white ml-0.5" />
              </div>
              <span>Tonton Demo</span>
            </a>
          </motion.div>

          {/* Bottom info strip */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 sm:gap-6 mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-white/20">
            {[
              "Peta Interaktif Batik",
              "AI Identifikasi Motif",
              "Arcade Edukasi Budaya",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-1.5 text-white/75 text-[11px] sm:text-xs font-display font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                {item}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
