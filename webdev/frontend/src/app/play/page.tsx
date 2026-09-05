"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import {
  Puzzle,
  Trophy,
  ArrowRight,
  Star,
  ChevronRight,
  Sprout,
  Compass,
  BookOpen,
  Crown,
  Brain,
  MapPin,
  ZoomIn,
  Sparkles,
  Gamepad2,
} from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { XpBar } from "@/components/shared/XpBar";
import { useXp } from "@/hooks/useXp";

const GAMES = [
  {
    id: "cap-stamping",
    href: "/play/cap-stamping",
    icon: Puzzle,
    title: "Batik Cap Stamping",
    category: "Geometri & Presisi",
    desc: "Warnai sketsa batik dengan menempatkan kepingan motif (cap) secara tepat dan presisi agar menyatu sempurna.",
    xp: "+100 XP",
    difficulty: "Mudah → Lanjutan",
    image: "/images/batik-kawung.jpg",
    accent: "#D4AF37",
    badge: "3 MOTIF TERSEDIA",
    buttonText: "Mulai Stamping",
  },
  {
    id: "tebak-motif",
    href: "/play/tebak-motif",
    icon: Brain,
    title: "Tebak Motif Berjenjang",
    category: "Wawasan & Filosofi",
    desc: "Uji pengetahuanmu! Tebak nama motif batik dari petunjuk bertahap, semakin sedikit petunjuk, semakin besar XP.",
    xp: "Max +100 XP",
    difficulty: "Semua Level",
    image: "/images/batik-parang-rusak.jpg",
    accent: "#c4b5fd",
    badge: "9 MOTIF TERSEDIA",
    buttonText: "Tebak Motif",
  },
  {
    id: "sortir-peta",
    href: "/play/sortir-peta",
    icon: MapPin,
    title: "Sortir Motif ke Peta",
    category: "Geografi Budaya",
    desc: "Drag kartu motif batik ke pin daerah asalnya pada peta Nusantara sebelum waktu 90 detik berakhir!",
    xp: "+40 - 50 XP / motif",
    difficulty: "Tantangan Waktu",
    image: "/images/batik-mega-mendung.jpg",
    accent: "#7dd3fc",
    badge: "8 SENTRA NUSANTARA",
    buttonText: "Jelajahi Peta",
  },
  {
    id: "tika",
    href: "/play/tika",
    icon: ZoomIn,
    title: "Tika: Tebak Batik Nusantara",
    category: "Observasi & Deduksi",
    desc: "Tebak nama motif batik dari potongan visual makro super detail (zoom 800% hingga 100%) sebelum kesempatan habis!",
    xp: "Max +100 XP",
    difficulty: "Tantangan Harian & Bebas",
    image: "/images/batik-kawung.jpg",
    accent: "#f59e0b",
    badge: "PROGRESSIVE ZOOM",
    buttonText: "Mainkan Tika",
  },
];

const RANKS = [
  {
    name: "Pelajar Budaya",
    minXp: 0,
    maxXp: 250,
    icon: Sprout,
    desc: "Mengenal dasar ornamen geometris dan keindahan visual batik.",
    color: "text-emerald-400 bg-emerald-950/40 border-emerald-500/30",
  },
  {
    name: "Penjelajah Ragam Hias",
    minXp: 251,
    maxXp: 600,
    icon: Compass,
    desc: "Memahami ragam motif pesisiran, keraton, dan filosofi maknanya.",
    color: "text-amber-400 bg-amber-950/40 border-amber-500/30",
  },
  {
    name: "Kolektor Batik Nusantara",
    minXp: 601,
    maxXp: 1200,
    icon: BookOpen,
    desc: "Menguasai peta sentra budaya, observasi mikro batik, dan teknik cap.",
    color: "text-blue-400 bg-blue-950/40 border-blue-500/30",
  },
  {
    name: "Empu Batik Digital",
    minXp: 1201,
    maxXp: null,
    icon: Crown,
    desc: "Pakar sejati pelestari warisan adiluhung batik Indonesia.",
    color: "text-[#D4AF37] bg-[#713f2c]/40 border-[#D4AF37]/50",
  },
];

export default function ArcadeHubPage() {
  const { xp, rank } = useXp();

  return (
    <div className="min-h-screen bg-[#1A1614] font-body text-white flex flex-col relative overflow-hidden">
      {/* Global Navbar */}
      <Navbar variant="transparent" />

      {/* ─── Dedicated Full Tab Background: Batik Tab Arcade.jpg ─── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Image
          src="/images/Batik Tab Arcade.jpg"
          alt="Background Tab Arcade Batik"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        {/* Luxury heritage vignette overlay for seamless tab cohesion */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#1A1614]/85 to-[#1A1614]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-[#1A1614]/50 to-[#1A1614]" />
      </div>

      <main className="flex-1 relative z-10">
        {/* ─── Hero Section with Dedicated Arcade Heritage Copy ─── */}
        <section className="relative w-full pt-32 pb-20 px-6 lg:px-16 min-h-[560px] lg:min-h-[620px] flex items-center">
          {/* Golden glow accents */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none z-0" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#713f2c]/25 rounded-full blur-3xl pointer-events-none z-0" />

          <div className="max-w-[1280px] mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left column: Editorial copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 text-left"
            >
              <div className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-display font-bold px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm shadow-sm">
                <Gamepad2 className="w-4 h-4" />
                <span>ARENA EDU-GAMES BATIK NUSANTARA</span>
              </div>

              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-[54px] text-white leading-[1.08] tracking-tight mb-5">
                <span className="font-philosopher tracking-wide">Batik Kita</span>:{" "}
                <span
                  style={{
                    color: "#D4AF37",
                    textShadow: "0 2px 20px rgba(212,175,55,0.4)",
                  }}
                >
                  Belajar Ragam Hias
                </span>{" "}
                <br />
                Sambil Bermain.
              </h1>

              <p className="font-narrative text-base sm:text-lg text-white/80 leading-relaxed mb-8 max-w-xl">
                Asah ketajaman mata terhadap ornamen tradisional, uji memori filosofis, petakan sentra Nusantara, hingga pecahkan tebakan makro visual melalui empat mini-game budaya berhadiah XP.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-display text-white/70">
                <span className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-lg backdrop-blur-sm border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> 4 Mode Permainan Aktif
                </span>
                <span className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-lg backdrop-blur-sm border border-white/10">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Gamifikasi Berbasis Peringkat Budaya
                </span>
              </div>
            </motion.div>

            {/* Right column: Prestigious Cultural XP Pass */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="lg:col-span-5"
            >
              <div className="bg-[#231e1c]/90 border border-[#D4AF37]/35 backdrop-blur-md rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden group hover:border-[#D4AF37]/60 transition-all">
                {/* Subtle batik watermark corner ornament */}
                <div className="absolute -right-8 -bottom-8 w-40 h-40 opacity-10 pointer-events-none">
                  <Image
                    src="/images/logo-batik-kita.png"
                    alt="Ornament"
                    width={160}
                    height={160}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#713f2c] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-md">
                      <Star className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                      <span className="text-[11px] font-display font-semibold tracking-wider text-[#D4AF37] uppercase">
                        Paspor Budaya Digital
                      </span>
                      <h3 className="font-display font-bold text-lg text-white">
                        {rank}
                      </h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-white/50 font-body block">Total Poin</span>
                    <span className="font-display font-extrabold text-xl text-[#D4AF37]">
                      {xp} <span className="text-xs font-normal text-white/70">XP</span>
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-white/60 font-body">
                    <span>Kemajuan Peringkat</span>
                    <span className="text-[#D4AF37] font-semibold">Tingkatkan XP</span>
                  </div>
                  <XpBar xp={xp} rank={rank} />
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                  <span>Peringkat Berikutnya</span>
                  <span className="text-white font-semibold flex items-center gap-1">
                    {xp < 251 ? "Penjelajah Ragam Hias" : xp < 601 ? "Kolektor Batik" : "Empu Batik Digital"}
                    <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Main Games Grid Section ─── */}
        <section className="max-w-[1280px] mx-auto px-6 lg:px-16 py-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-white/10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-[#D4AF37] text-xs font-display font-bold tracking-wider uppercase mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                Katalog Permainan
              </div>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                Pilih Tantangan Anda
              </h2>
            </div>
            <p className="font-narrative text-sm text-white/70 max-w-md">
              Selesaikan tantangan untuk mengumpulkan kartu koleksi dan membuka filosofi tersembunyi motif batik nusantara.
            </p>
          </div>

          {/* 2x2 Grid of 4 Games with Authentic Visuals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {GAMES.map((game, i) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Link
                  href={game.href}
                  className="group block rounded-2xl overflow-hidden border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:shadow-[0_10px_35px_rgba(212,175,55,0.18)] transition-all duration-300 bg-[#231e1c]/90 backdrop-blur-md h-full flex flex-col hover:-translate-y-1"
                >
                  {/* Card Visual Header with Real Motif Image */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#2d2b38]">
                    <Image
                      src={game.image}
                      alt={game.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-85"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#231e1c] via-black/40 to-black/20" />

                    {/* Badges on Top */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-display font-bold px-3 py-1 rounded-full border border-white/20">
                        {game.badge}
                      </span>
                      <span
                        className="bg-black/70 backdrop-blur-md text-xs font-display font-bold px-3 py-1 rounded-full border border-[#D4AF37]/50 shadow-sm"
                        style={{ color: game.accent }}
                      >
                        {game.xp}
                      </span>
                    </div>

                    {/* Category and Icon at Bottom of image */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-[#713f2c]/90 border border-[#D4AF37]/50 text-[#D4AF37] flex items-center justify-center shadow-md">
                          <game.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-display font-semibold tracking-wider text-[#D4AF37] uppercase block">
                            {game.category}
                          </span>
                          <span className="text-xs text-white/90 font-body">
                            {game.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between bg-[#231e1c]/95">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-display font-bold text-xl text-white group-hover:text-[#D4AF37] transition-colors">
                          {game.title}
                        </h3>
                        <ChevronRight className="w-5 h-5 text-[#D4AF37]/60 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                      </div>
                      <p className="font-narrative text-sm text-white/70 leading-relaxed mb-6">
                        {game.desc}
                      </p>
                    </div>

                    {/* Card Action Footer */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs font-display font-medium text-white/60 group-hover:text-white transition-colors">
                        Tingkat Kesulitan: <strong className="text-[#D4AF37]">{game.difficulty}</strong>
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-[#D4AF37] group-hover:brightness-125">
                        {game.buttonText}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── Cultural Rank Roadmap Section ─── */}
        <section className="bg-black/50 backdrop-blur-md border-t border-white/10 py-16 px-6 lg:px-16 relative z-10">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 text-[#D4AF37] text-xs font-display font-bold tracking-wider uppercase mb-2">
                <Trophy className="w-3.5 h-3.5 text-[#D4AF37]" />
                Tangga Kebudayaan
              </div>
              <h2 className="font-display font-extrabold text-3xl text-white">
                Peringkat & Pencapaian Budaya
              </h2>
              <p className="font-narrative text-sm text-white/70 mt-2">
                Semakin banyak mini-game yang Anda taklukkan, semakin tinggi gelar kebudayaan yang Anda sandang.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {RANKS.map((r, i) => {
                const isCurrent = rank === r.name;
                const isUnlocked = xp >= r.minXp;
                return (
                  <div
                    key={r.name}
                    className={`rounded-2xl p-6 border transition-all ${
                      isCurrent
                        ? "bg-[#2a2421] border-[#D4AF37] shadow-xl ring-2 ring-[#D4AF37]/40"
                        : isUnlocked
                        ? "bg-[#231e1c]/90 border-white/15 shadow-md"
                        : "bg-[#1a1614]/60 border-white/10 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                          isUnlocked
                            ? "bg-[#713f2c] text-[#D4AF37] border-[#D4AF37]/40"
                            : "bg-white/10 text-white/40 border-transparent"
                        }`}
                      >
                        <r.icon className="w-5 h-5" />
                      </div>
                      {isCurrent ? (
                        <span className="bg-[#D4AF37] text-[#2d2b38] text-[10px] font-display font-bold px-2.5 py-0.5 rounded-full">
                          AKTIF
                        </span>
                      ) : isUnlocked ? (
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-display font-bold px-2 py-0.5 rounded-full">
                          TERBUKA
                        </span>
                      ) : (
                        <span className="text-white/40 text-[10px] font-display">
                          {r.minXp} XP
                        </span>
                      )}
                    </div>

                    <h4 className="font-display font-bold text-base text-white mb-1">
                      {r.name}
                    </h4>
                    <p className="text-[11px] font-display font-semibold text-[#D4AF37] mb-2">
                      {r.maxXp ? `${r.minXp} - ${r.maxXp} XP` : `${r.minXp}+ XP`}
                    </p>
                    <p className="font-narrative text-xs text-white/70 leading-relaxed">
                      {r.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Landing Page Footer */}
      <Footer />
    </div>
  );
}
