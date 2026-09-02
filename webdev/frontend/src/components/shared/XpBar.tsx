"use client";

import React from "react";
import { motion } from "motion/react";
import { Star } from "lucide-react";

const RANKS = [
  { name: "Pelajar Budaya", min: 0, max: 250 },
  { name: "Penjelajah Ragam Hias", min: 251, max: 600 },
  { name: "Kolektor Batik Nusantara", min: 601, max: 1200 },
  { name: "Empu Batik Digital", min: 1201, max: Infinity },
];

function getNextRankXp(xp: number): number {
  const next = RANKS.find((r) => xp < r.max);
  return next ? Math.min(next.max, 1201) : 1201;
}

interface XpBarProps {
  xp: number;
  rank: string;
  className?: string;
}

export function XpBar({ xp, rank, className = "" }: XpBarProps) {
  const nextXp = getNextRankXp(xp);
  const currentRankMin = RANKS.find((r) => xp >= r.min && xp <= r.max)?.min ?? 0;
  const progress = Math.min(((xp - currentRankMin) / (nextXp - currentRankMin)) * 100, 100);

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-current" />
          <span className="font-display font-bold text-sm text-[#D4AF37]">{xp} XP</span>
        </div>
        <span className="font-body text-xs text-[#8d786a]">{rank}</span>
      </div>
      <div className="h-2 bg-[#d3ccc2] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#713f2c] to-[#D4AF37] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <p className="text-right text-[10px] text-[#8d786a] font-body">
        {nextXp === Infinity ? "Level Maksimum" : `${nextXp} XP untuk rank berikutnya`}
      </p>
    </div>
  );
}
