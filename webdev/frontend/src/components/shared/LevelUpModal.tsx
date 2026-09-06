"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Crown, ArrowRight, Trophy, Sprout, Compass, BookOpen } from "lucide-react";
import confetti from "canvas-confetti";
import { RANKS } from "@/hooks/useXp";

interface LevelUpModalProps {
  open: boolean;
  newRank: string;
  previousRank: string;
  onClose: () => void;
}

function getRankIcon(rank: string) {
  switch (rank) {
    case "Penjelajah Ragam Hias":
      return <Compass className="w-9 h-9 text-[#D4AF37]" />;
    case "Kolektor Batik Nusantara":
      return <BookOpen className="w-9 h-9 text-[#D4AF37]" />;
    case "Empu Batik Digital":
      return <Crown className="w-9 h-9 text-[#D4AF37]" />;
    default:
      return <Sprout className="w-9 h-9 text-emerald-400" />;
  }
}

export function LevelUpModal({
  open,
  newRank,
  previousRank,
  onClose,
}: LevelUpModalProps) {
  useEffect(() => {
    if (open) {
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.55 },
          colors: ["#D4AF37", "#10B981", "#E5C158", "#ffffff"],
        });
      } catch {
        // Confetti fallback
      }
    }
  }, [open]);

  const rankData = RANKS.find((r) => r.name === newRank) ?? RANKS[0];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="relative w-full max-w-md bg-[#1A1614] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 text-white text-center shadow-[0_0_50px_rgba(212,175,55,0.4)] overflow-hidden"
          >
            {/* Ambient gold glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none" />

            {/* Icon Avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 400 }}
              className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#8d786a] p-0.5 shadow-xl shadow-[#D4AF37]/30 flex items-center justify-center"
            >
              <div className="w-full h-full bg-[#1A1614] rounded-2xl flex items-center justify-center">
                {getRankIcon(newRank)}
              </div>
            </motion.div>

            {/* Badge Pill */}
            <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-display font-bold px-3 py-1 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" /> NAIK PANGKAT BUDAYA
            </div>

            {/* Title */}
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-1">
              {newRank}
            </h2>

            <p className="text-white/60 text-xs mb-4">
              Sebelumnya: <span className="text-white/80">{previousRank}</span>
            </p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 text-left">
              <p className="text-xs text-white/85 font-body leading-relaxed">
                {rankData.description}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#D4AF37] text-[#1A1614] font-display font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/25 hover:brightness-105 transition-all cursor-pointer"
            >
              <span>Lanjutkan Eksplorasi</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
