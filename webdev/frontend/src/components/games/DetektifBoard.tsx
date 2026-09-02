"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";

export interface DetektifTarget {
  id: string;
  label: string; // e.g., "Cecek (Titik)"
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
      const clickX = ((e.clientX - rect.left) / rect.width) * 100;
      const clickY = ((e.clientY - rect.top) / rect.height) * 100;

      setTotalClicks((c) => c + 1);

      // Check against targets
      for (const target of level.targets) {
        if (found.has(target.id)) continue;
        const dist = Math.sqrt(Math.pow(clickX - target.x, 2) + Math.pow(clickY - target.y, 2));
        if (dist <= target.radius) {
          setFound((prev) => new Set([...prev, target.id]));
          setHits((prev) => [...prev, { targetId: target.id, x: clickX, y: clickY }]);
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
    <div className="flex flex-col gap-4 h-full">
      {/* Mission banner */}
      <div className="bg-[#1A1614] border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] text-[#D4AF37] font-display font-bold uppercase tracking-wide mb-0.5">Misi Detektif</p>
          <p className="text-sm text-white font-body leading-snug">{level.mission}</p>
        </div>
        <div className="shrink-0 text-center">
          <div className="font-display font-extrabold text-2xl text-[#D4AF37]">{foundCount}/{totalTargets}</div>
          <p className="text-[10px] text-white/50">Ditemukan</p>
        </div>
      </div>

      {/* Image board */}
      <div
        ref={containerRef}
        onClick={handleClick}
        className="relative flex-1 min-h-[300px] rounded-xl overflow-hidden cursor-crosshair border border-white/10 select-none"
        style={{ backgroundImage: `url(${level.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Hint circles */}
        <AnimatePresence>
          {showHint &&
            level.targets
              .filter((t) => !found.has(t.id))
              .map((t) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.4, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute border-2 border-dashed border-yellow-300 rounded-full"
                  style={{
                    left: `${t.x}%`,
                    top: `${t.y}%`,
                    width: `${t.radius * 2}%`,
                    height: `${t.radius * 2}%`,
                    transform: "translate(-50%,-50%)",
                  }}
                />
              ))}
        </AnimatePresence>

        {/* Hit markers */}
        {hits.map((h) => (
          <motion.div
            key={h.targetId}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute pointer-events-none"
            style={{ left: `${h.x}%`, top: `${h.y}%`, transform: "translate(-50%,-50%)" }}
          >
            <div className="w-8 h-8 rounded-full border-2 border-[#10B981] bg-[#10B981]/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
            </div>
          </motion.div>
        ))}

        {/* Miss markers */}
        <AnimatePresence>
          {misses.map((m) => (
            <motion.div
              key={m.id}
              initial={{ scale: 0, opacity: 1, x: -50, y: -50 }}
              animate={{ scale: [1, 1.1, 1, 1.1, 1], opacity: [1, 1, 1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute pointer-events-none"
              style={{ left: `${m.x}%`, top: `${m.y}%`, transform: "translate(-50%,-50%)" }}
            >
              <XCircle className="w-7 h-7 text-red-400" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {level.targets.map((t) => (
            <span
              key={t.id}
              className={`inline-flex items-center gap-1 text-xs font-display font-semibold px-2.5 py-1 rounded-full transition-colors ${
                found.has(t.id)
                  ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30"
                  : "bg-white/5 text-white/50 border border-white/10"
              }`}
            >
              {found.has(t.id) ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
              {t.label}
            </span>
          ))}
        </div>
        <button
          onClick={() => { setShowHint(true); setTimeout(() => setShowHint(false), 2000); }}
          className="shrink-0 flex items-center gap-1.5 text-xs font-display font-semibold text-[#D4AF37]/70 hover:text-[#D4AF37] transition-colors border border-white/10 hover:border-[#D4AF37]/30 px-3 py-1.5 rounded-lg"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Petunjuk
        </button>
      </div>
    </div>
  );
}
