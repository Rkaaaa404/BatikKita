"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface PuzzlePieceData {
  id: number;
  correctIndex: number;
  currentIndex: number | null; // null = in tray
}

interface PuzzleBoardProps {
  image: string;
  gridSize?: number; // default 3 (= 3x3)
  onSolve: (timeSeconds: number) => void;
}

export function PuzzleBoard({ image, gridSize = 3, onSolve }: PuzzleBoardProps) {
  const total = gridSize * gridSize;
  const [pieces, setPieces] = useState<PuzzlePieceData[]>([]);
  const [dragging, setDragging] = useState<number | null>(null); // piece id
  const [wrongSlot, setWrongSlot] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  const startTime = useRef<number>(Date.now());
  const boardRef = useRef<HTMLDivElement>(null);

  // Initialise — shuffle pieces into tray
  useEffect(() => {
    const shuffled = Array.from({ length: total }, (_, i) => i)
      .sort(() => Math.random() - 0.5)
      .map((correctIndex, i) => ({ id: i, correctIndex, currentIndex: null as number | null }));
    setPieces(shuffled);
    startTime.current = Date.now();
    setSolved(false);
  }, [image, total]);

  // Check win
  useEffect(() => {
    if (pieces.length === 0) return;
    const allCorrect = pieces.every((p) => p.currentIndex === p.correctIndex);
    if (allCorrect && !solved) {
      setSolved(true);
      const elapsed = Math.round((Date.now() - startTime.current) / 1000);
      setTimeout(() => onSolve(elapsed), 600);
    }
  }, [pieces, solved, onSolve]);

  const handleDrop = useCallback(
    (slotIndex: number) => {
      if (dragging === null) return;
      const piece = pieces.find((p) => p.id === dragging);
      if (!piece) return;

      if (piece.correctIndex === slotIndex) {
        // Correct placement
        setPieces((prev) =>
          prev.map((p) => (p.id === dragging ? { ...p, currentIndex: slotIndex } : p))
        );
      } else {
        // Wrong — shake animation
        setWrongSlot(slotIndex);
        setTimeout(() => setWrongSlot(null), 600);
      }
      setDragging(null);
    },
    [dragging, pieces]
  );

  const trayPieces = pieces.filter((p) => p.currentIndex === null);

  // Piece size: use a fixed aspect for the board
  const pieceSize = 100 / gridSize; // percentage

  return (
    <div className="flex flex-col gap-6">
      {/* Puzzle grid board */}
      <div
        ref={boardRef}
        className="relative w-full max-w-[400px] mx-auto aspect-square rounded-xl overflow-hidden border-2 border-dashed border-[#713f2c]/40 bg-[#2d2b38]/20"
        style={{ backgroundImage: `url(${image})`, backgroundSize: "cover" }}
      >
        {/* Semi-transparent overlay so unfilled slots are visible */}
        <div className="absolute inset-0 grid"
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)`, gridTemplateRows: `repeat(${gridSize}, 1fr)` }}
        >
          {Array.from({ length: total }, (_, slotIndex) => {
            const placedPiece = pieces.find((p) => p.currentIndex === slotIndex);
            const isWrong = wrongSlot === slotIndex;
            return (
              <motion.div
                key={slotIndex}
                animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(slotIndex)}
                className={`relative border border-white/10 transition-colors ${placedPiece ? "" : "bg-black/40"}`}
              >
                {placedPiece && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${image})`,
                      backgroundSize: `${gridSize * 100}%`,
                      backgroundPosition: `${(placedPiece.correctIndex % gridSize) * (100 / (gridSize - 1))}% ${Math.floor(placedPiece.correctIndex / gridSize) * (100 / (gridSize - 1))}%`,
                    }}
                  >
                    {/* Green glow on correct placement */}
                    <div className="absolute inset-0 rounded-sm border-2 border-[#10B981] shadow-[inset_0_0_8px_rgba(16,185,129,0.4)]" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Tray of remaining pieces */}
      <div className="flex flex-wrap justify-center gap-3 min-h-[100px] bg-[#1A1614]/60 rounded-xl p-3 border border-white/5">
        <AnimatePresence>
          {trayPieces.map((piece) => (
            <motion.div
              key={piece.id}
              layout
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.3 }}
              draggable
              onDragStart={() => setDragging(piece.id)}
              onDragEnd={() => setDragging(null)}
              whileDrag={{ scale: 1.1, zIndex: 50, boxShadow: "0 8px 32px rgba(212,175,55,0.4)" }}
              className="cursor-grab active:cursor-grabbing rounded-lg overflow-hidden border-2 border-[#D4AF37]/40 hover:border-[#D4AF37] transition-colors"
              style={{
                width: 80,
                height: 80,
                backgroundImage: `url(${image})`,
                backgroundSize: `${gridSize * 100}%`,
                backgroundPosition: `${(piece.correctIndex % gridSize) * (100 / (gridSize - 1))}% ${Math.floor(piece.correctIndex / gridSize) * (100 / (gridSize - 1))}%`,
              }}
            />
          ))}
        </AnimatePresence>
        {trayPieces.length === 0 && !solved && (
          <p className="text-white/30 text-sm self-center font-body">Semua kepingan sudah diletakkan!</p>
        )}
      </div>
    </div>
  );
}
