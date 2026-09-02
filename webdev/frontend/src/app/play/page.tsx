"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Puzzle, Eye, Sparkles, Trophy, ArrowRight, Star, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { XpBar } from "@/components/shared/XpBar";
import { useXp } from "@/hooks/useXp";

const GAMES = [
  {
    id: "jigsaw",
    href: "/play/jigsaw",
    icon: Puzzle,
    title: "Batik Jigsaw Puzzle",
    desc: "Susun kepingan motif batik kembali ke posisi aslinya. Uji pemahamanmu tentang geometri pola batik sambil belajar filosofinya.",
    xp: "+100 XP per selesai",
    difficulty: "Mudah → Lanjutan",
    color: "from-[#713f2c] via-[#8d786a] to-[#ada69f]",
    accent: "#D4AF37",
    badge: "3 MOTIF TERSEDIA",
  },
  {
    id: "detektif",
    href: "/play/detektif",
    icon: Eye,
    title: "Detektif Isen-Isen",
    desc: "Jadilah detektif budaya! Temukan elemen pengisi (isen-isen) tersembunyi seperti cecek, sawut, dan mlinjon pada kain batik.",
    xp: "+80 XP per selesai",
    difficulty: "Menengah",
    color: "from-[#1E3A8A] via-[#2d2b38] to-[#51586b]",
    accent: "#60A5FA",
    badge: "3 MISI TERSEDIA",
  },
];

const RANKS = [
  { name: "Pelajar Budaya", xp: 0, icon: "🌱" },
  { name: "Penjelajah Ragam Hias", xp: 251, icon: "🗺️" },
  { name: "Kolektor Batik Nusantara", xp: 601, icon: "📚" },
  { name: "Empu Batik Digital", xp: 1201, icon: "👑" },
];

export default function ArcadeHubPage() {
  const { xp, rank, addXp } = useXp();

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <Navbar />

      <main className="pt-16">
        {/* Hero banner */}
        <section className="bg-[#1A1614] py-16 px-6 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[#713f2c]/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-display font-bold px-4 py-1.5 rounded-full mb-4">
                <Trophy className="w-3.5 h-3.5" /> ARCADE EDU-GAME
              </div>
              <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white mb-3 leading-tight">
                Belajar Batik<br />
                <span className="text-[#D4AF37]">Sambil Bermain</span>
              </h1>
              <p className="text-white/60 font-body max-w-lg mx-auto text-base">
                Mainkan mini-game interaktif, kumpulkan XP, dan naiki peringkat budaya dari Pelajar hingga Empu Batik Digital.
              </p>
            </motion.div>

            {/* XP Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-md mx-auto bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-[#D4AF37] fill-current" />
                </div>
                <div>
                  <p className="font-display font-bold text-white">Progres Budayamu</p>
                  <p className="text-xs text-white/50 font-body">Peringkat: {rank}</p>
                </div>
              </div>
              <XpBar xp={xp} rank={rank} />
            </motion.div>
          </div>
        </section>

        {/* Game cards */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-bold text-2xl text-[#2d2b38] mb-8 text-center"
          >
            Pilih Game
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GAMES.map((game, i) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={game.href}
                  className="group block rounded-2xl overflow-hidden border border-[#d3ccc2] hover:border-[#713f2c]/40 hover:shadow-xl transition-all bg-white"
                >
                  {/* Image Header */}
                  <div className={`h-40 bg-gradient-to-br ${game.color} relative flex items-center justify-center`}>
                    <game.icon className="w-16 h-16 text-white/20 group-hover:text-white/30 transition-colors" strokeWidth={1} />
                    <span className="absolute top-3 left-3 bg-black/30 backdrop-blur-sm text-white text-[10px] font-display font-bold px-2.5 py-1 rounded-full">
                      {game.badge}
                    </span>
                    <span className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm text-xs font-display font-semibold px-2.5 py-1 rounded-full"
                      style={{ color: game.accent }}>
                      {game.xp}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display font-bold text-lg text-[#2d2b38] group-hover:text-[#713f2c] transition-colors">
                        {game.title}
                      </h3>
                      <ChevronRight className="w-5 h-5 text-[#8d786a] group-hover:text-[#713f2c] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                    <p className="text-sm text-[#8d786a] font-body leading-relaxed mb-4">{game.desc}</p>
                    <div className="flex items-center gap-2">
                      <span className="inline-block bg-[#e8e5df] text-[#8d786a] text-[10px] font-display font-bold px-2.5 py-1 rounded-full">
                        {game.difficulty}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Rank Progression */}
        <section className="bg-[#1A1614] py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="font-display font-bold text-2xl text-white mb-2">Tingkatan Gelar Budaya</h2>
              <p className="text-white/50 font-body text-sm">Kumpulkan XP dari setiap aktivitas untuk naik peringkat</p>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {RANKS.map((r, i) => {
                const active = rank === r.name;
                return (
                  <motion.div
                    key={r.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`rounded-xl p-4 text-center border transition-all ${
                      active
                        ? "border-[#D4AF37]/50 bg-[#D4AF37]/10"
                        : xp >= r.xp
                        ? "border-white/10 bg-white/5"
                        : "border-white/5 opacity-50"
                    }`}
                  >
                    <div className="text-2xl mb-2">{r.icon}</div>
                    <p className="font-display font-bold text-xs text-white leading-tight mb-1">{r.name}</p>
                    <p className="text-[10px] text-white/40 font-body">{r.xp}+ XP</p>
                    {active && (
                      <div className="mt-2 inline-block bg-[#D4AF37] text-[#1A1614] text-[9px] font-display font-extrabold px-2 py-0.5 rounded-full">
                        SEKARANG
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Coming Soon */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <div className="rounded-2xl border border-dashed border-[#d3ccc2] p-8 text-center">
            <Sparkles className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg text-[#2d2b38] mb-2">Segera Hadir: Quick Draw Canvas</h3>
            <p className="text-sm text-[#8d786a] font-body max-w-sm mx-auto">
              Coba menjiplak dan menggambar motif batik dengan kuas digital interaktif. Coming soon!
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
