"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";

export interface DetektifTarget {
  id: string;
  label: string; // e.g., "Roset Kiri Atas"
  x: number; // percentage 0-100 relative to image width
  y: number; // percentage 0-100 relative to image height
  radius: number; // percentage radius of click tolerance
}

export interface DetektifLevel {
  id: string;
  motifName: string;
  region: string;
  image: string;
  mission: string;
  aspectRatio?: string;
  targets: DetektifTarget[];
}

interface DetektifBoardProps {
  level: DetektifLevel;
  onComplete: (score: number, totalClicks: number) => void;
}

interface Hit {
  targetId: string;
  x: number;
  y: number;
}

interface Miss {
  id: number;
  x: number;
  y: number;
}

export function DetektifBoard({ level, onComplete }: DetektifBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [hits, setHits] = useState<Hit[]>([]);
  const [misses, setMisses] = useState<Miss[]>([]);
  const [totalClicks, setTotalClicks] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const missCounter = useRef(0);

  const totalTargets = level.targets.length;
  const foundCount = found.size;

  // Reset state when level changes
  useEffect(() => {
    setFound(new Set());
    setHits([]);
    setMisses([]);
    setTotalClicks(0);
    setShowHint(false);
  }, [level.id]);

  useEffect(() => {
    if (foundCount === totalTargets && totalTargets > 0) {
      const accuracy = Math.round((totalTargets / Math.max(totalClicks, totalTargets)) * 100);
      setTimeout(() => onComplete(accuracy, totalClicks), 800);
    }
  }, [foundCount, totalTargets, totalClicks, onComplete]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const clickPxX = e.clientX - rect.left;
      const clickPxY = e.clientY - rect.top;
      const clickX = (clickPxX / rect.width) * 100;
      const clickY = (clickPxY / rect.height) * 100;

      setTotalClicks((c) => c + 1);

      // Check against targets using true screen pixel distance with generous circular tolerance
      for (const target of level.targets) {
        if (found.has(target.id)) continue;

        const targetPxX = (target.x / 100) * rect.width;
        const targetPxY = (target.y / 100) * rect.height;
        const distPx = Math.hypot(clickPxX - targetPxX, clickPxY - targetPxY);

        // Toleransi klik presisi: target.radius % dari lebar atau minimal 42px
        const tolerancePx = Math.max((target.radius / 100) * rect.width, 42);

        if (distPx <= tolerancePx) {
          setFound((prev) => new Set([...prev, target.id]));
          // Center the hit badge exactly on the target center
          setHits((prev) => [...prev, { targetId: target.id, x: target.x, y: target.y }]);
          return;
        }
      }

      // Miss
      missCounter.current += 1;
      const id = missCounter.current;
      setMisses((prev) => [...prev, { id, x: clickX, y: clickY }]);
      setTimeout(() => setMisses((prev) => prev.filter((m) => m.id !== id)), 800);
    },
    [found, level.targets]
  );

  return (
    <div className="flex flex-col gap-5 h-full max-w-4xl mx-auto w-full">
      {/* Mission banner */}
      <div className="bg-[#1A1614] border border-white/10 rounded-2xl px-5 py-4 flex items-center justify-between gap-4 shadow-lg">
        <div>
          <p className="text-[11px] text-[#D4AF37] font-display font-bold uppercase tracking-wider mb-1">
            Misi Detektif
          </p>
          <p className="text-sm text-white font-body leading-relaxed max-w-2xl">{level.mission}</p>
        </div>
        <div className="shrink-0 text-center bg-white/5 border border-white/10 rounded-xl px-4 py-2">
          <div className="font-display font-extrabold text-2xl text-[#D4AF37]">
            {foundCount}/{totalTargets}
          </div>
          <p className="text-[10px] text-white/50 font-display font-medium">Ditemukan</p>
        </div>
      </div>

      {/* Image board with 100% exact aspect ratio and zero cropping */}
      <div
        ref={containerRef}
        onClick={handleClick}
        className="relative w-full rounded-2xl overflow-hidden cursor-crosshair border-2 border-[#713f2c]/50 bg-black shadow-2xl select-none"
        style={{ aspectRatio: level.aspectRatio || "16 / 9" }}
      >
        <img
          src={level.image}
          alt={level.motifName}
          className="w-full h-full object-fill pointer-events-none"
        />

        {/* Subtle dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />

        {/* Hint rings */}
        <AnimatePresence>
          {showHint &&
            level.targets
              .filter((t) => !found.has(t.id))
              .map((t) => (
                <motion.div
                  key={t.id}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: [0.9, 1.3, 1], opacity: [0.4, 0.9, 0.6] }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse" }}
                  className="absolute rounded-full border-2 border-[#D4AF37] bg-[#D4AF37]/25 shadow-[0_0_24px_rgba(212,175,55,0.8)] pointer-events-none flex items-center justify-center"
                  style={{
                    left: `${t.x}%`,
                    top: `${t.y}%`,
                    width: "56px",
                    height: "56px",
                    transform: "translate(-50%,-50%)",
                  }}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-ping" />
                </motion.div>
              ))}
        </AnimatePresence>

        {/* Hit markers */}
        {hits.map((h) => (
          <motion.div
            key={h.targetId}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.25, 1], opacity: 1 }}
            transition={{ type: "spring", stiffness: 450, damping: 22 }}
            className="absolute pointer-events-none"
            style={{ left: `${h.x}%`, top: `${h.y}%`, transform: "translate(-50%,-50%)" }}
          >
            <div className="w-10 h-10 rounded-full border-2 border-[#10B981] bg-[#10B981]/40 backdrop-blur-sm flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.9)]">
              <CheckCircle2 className="w-6 h-6 text-white drop-shadow" />
            </div>
          </motion.div>
        ))}

        {/* Miss markers */}
        <AnimatePresence>
          {misses.map((m) => (
            <motion.div
              key={m.id}
              initial={{ scale: 0.6, opacity: 1 }}
              animate={{ scale: [1, 1.25, 1], opacity: [1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute pointer-events-none"
              style={{ left: `${m.x}%`, top: `${m.y}%`, transform: "translate(-50%,-50%)" }}
            >
              <div className="w-8 h-8 rounded-full border border-red-500 bg-red-500/40 backdrop-blur-sm flex items-center justify-center shadow-[0_0_14px_rgba(239,68,68,0.8)]">
                <XCircle className="w-5 h-5 text-white drop-shadow" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom controls & Target status badges */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-xl p-3">
        <div className="flex flex-wrap gap-2">
          {level.targets.map((t) => {
            const isFound = found.has(t.id);
            return (
              <span
                key={t.id}
                className={`inline-flex items-center gap-1.5 text-xs font-display font-semibold px-3 py-1.5 rounded-full transition-all ${
                  isFound
                    ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 shadow-sm"
                    : "bg-white/5 text-white/50 border border-white/10"
                }`}
              >
                {isFound ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                ) : (
                  <div className="w-3 h-3 rounded-full border border-white/30" />
                )}
                {t.label}
              </span>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            setShowHint(true);
            setTimeout(() => setShowHint(false), 2500);
          }}
          className="shrink-0 flex items-center gap-1.5 text-xs font-display font-semibold text-[#D4AF37] hover:text-white bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 transition-all border border-[#D4AF37]/30 px-3.5 py-1.5 rounded-lg shadow-sm"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Petunjuk
        </button>
      </div>
    </div>
  );
}
