"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Trophy, X, ChevronRight, Layers } from "lucide-react";
import Link from "next/link";

interface WinModalProps {
  open: boolean;
  motifName: string;
  motifRegion: string;
  philosophy: string;
  image: string;
  xpEarned: number;
  timeSeconds: number;
  onClose: () => void;
  onNext?: () => void;
}

export function WinModal({
  open,
  motifName,
  motifRegion,
  philosophy,
  image,
  xpEarned,
  timeSeconds,
  onClose,
  onNext,
}: WinModalProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; delay: number; size: number }[]>([]);

  useEffect(() => {
    if (open) {
      setParticles(
        Array.from({ length: 24 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 0.8,
          size: Math.random() * 6 + 4,
        }))
      );
    }
  }, [open]);

  const mins = Math.floor(timeSeconds / 60);
  const secs = timeSeconds % 60;
  const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        >
          {/* Particles */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full bg-[#D4AF37]"
                style={{ left: `${p.x}%`, top: `${p.y + 20}%`, width: p.size, height: p.size }}
                initial={{ opacity: 0, y: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], y: -120, scale: [0, 1, 0.5] }}
                transition={{ duration: 2, delay: p.delay, ease: "easeOut" }}
              />
            ))}
          </div>

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="relative bg-[#faf8f4] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
          >
            {/* Golden header strip */}
            <div className="bg-gradient-to-r from-[#713f2c] to-[#D4AF37] px-6 pt-8 pb-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm"
              >
                <Trophy className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="font-display font-extrabold text-2xl text-white mb-1">Hebat! Selesai!</h2>
              <p className="text-white/80 text-sm font-body">Kamu telah mengungkap kartu motif baru</p>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="p-6">
              {/* Motif card */}
              <div className="flex gap-4 bg-white rounded-xl p-4 border border-[#d3ccc2] mb-4 shadow-sm">
                <div
                  className="w-20 h-20 rounded-lg bg-cover bg-center shrink-0"
                  style={{ backgroundImage: `url(${image})` }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block bg-[#D4AF37]/20 text-[#713f2c] font-display font-bold text-[10px] px-2 py-0.5 rounded-full">
                      BARU TERBUKA
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-[#2d2b38]">{motifName}</h3>
                  <p className="text-xs text-[#8d786a] mb-2">{motifRegion}</p>
                  <p className="text-xs text-[#2d2b38] leading-relaxed line-clamp-2">{philosophy}</p>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-[#e8e5df] rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <Star className="w-4 h-4 text-[#D4AF37] fill-current" />
                    <span className="font-display font-extrabold text-lg text-[#713f2c]">+{xpEarned}</span>
                  </div>
                  <p className="text-[10px] text-[#8d786a] font-body">XP Diperoleh</p>
                </div>
                <div className="bg-[#e8e5df] rounded-xl p-3 text-center">
                  <span className="font-display font-extrabold text-lg text-[#713f2c]">{timeStr}</span>
                  <p className="text-[10px] text-[#8d786a] font-body">Waktu Selesai</p>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 border border-[#d3ccc2] text-[#8d786a] font-display font-semibold text-sm py-2.5 rounded-xl hover:bg-[#e8e5df] transition-colors"
                  >
                    Main Lagi
                  </button>
                  {onNext ? (
                    <button
                      onClick={onNext}
                      className="flex-1 bg-[#713f2c] text-[#D4AF37] font-display font-semibold text-sm py-2.5 rounded-xl hover:bg-[#583122] transition-colors flex items-center justify-center gap-1.5"
                    >
                      Game Lain <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <Link
                      href="/play"
                      className="flex-1 bg-[#713f2c] text-[#D4AF37] font-display font-semibold text-sm py-2.5 rounded-xl hover:bg-[#583122] transition-colors flex items-center justify-center gap-1.5"
                    >
                      Batik Arcade <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
                <Link
                  href="/collection"
                  className="w-full text-center text-xs text-[#713f2c] hover:text-[#583122] font-display font-bold py-1.5 bg-[#FAF8F4] hover:bg-[#F3EFEA] rounded-xl border border-[#d3ccc2]/80 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Buka Album Koleksi Kartu</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
