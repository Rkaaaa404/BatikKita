"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Hash, Eye, EyeOff, Sparkles } from "lucide-react";

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
  const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null);
  const [wrongSlot, setWrongSlot] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  const [showNumbers, setShowNumbers] = useState(true);
  const [showGhost, setShowGhost] = useState(false);
  const startTime = useRef<number>(Date.now());
  const boardRef = useRef<HTMLDivElement>(null);

  // Initialise — shuffle pieces into tray
  useEffect(() => {
    const shuffled = Array.from({ length: total }, (_, i) => i)
      .sort(() => Math.random() - 0.5)
      .map((correctIndex, i) => ({ id: i, correctIndex, currentIndex: null as number | null }));
    setPieces(shuffled);
    setSelectedPieceId(null);
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

  const placePieceAtSlot = useCallback((pieceId: number, slotIndex: number) => {
    const piece = pieces.find((p) => p.id === pieceId);
    if (!piece) return;

    if (piece.correctIndex === slotIndex) {
      // Correct placement
      setPieces((prev) =>
        prev.map((p) => (p.id === pieceId ? { ...p, currentIndex: slotIndex } : p))
      );
      setSelectedPieceId(null);
    } else {
      // Wrong — shake animation
      setWrongSlot(slotIndex);
      setTimeout(() => setWrongSlot(null), 600);
    }
  }, [pieces]);

  const handleDrop = useCallback(
    (slotIndex: number) => {
      if (dragging === null) return;
      placePieceAtSlot(dragging, slotIndex);
      setDragging(null);
    },
    [dragging, placePieceAtSlot]
  );

  const handleSlotClick = useCallback(
    (slotIndex: number) => {
      if (selectedPieceId !== null) {
        placePieceAtSlot(selectedPieceId, slotIndex);
      }
    },
    [selectedPieceId, placePieceAtSlot]
  );

  const trayPieces = pieces.filter((p) => p.currentIndex === null);
  const selectedPiece = pieces.find((p) => p.id === selectedPieceId);

  return (
    <div className="flex flex-col gap-4">
      {/* Helper Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 max-w-[400px] mx-auto w-full px-1">
        <button
          type="button"
          onClick={() => setShowNumbers(!showNumbers)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-display font-semibold transition-all shadow-sm ${
            showNumbers
              ? "bg-[#D4AF37] text-[#1A1614] shadow-[#D4AF37]/20 ring-1 ring-[#D4AF37]"
              : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white border border-white/10"
          }`}
        >
          <Hash className="w-3.5 h-3.5" />
          <span>Bantuan Nomor: {showNumbers ? "Aktif" : "Nonaktif"}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowGhost(!showGhost)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-display font-medium transition-all ${
            showGhost
              ? "bg-white/20 text-white border border-white/30"
              : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
          }`}
        >
          {showGhost ? <Eye className="w-3.5 h-3.5 text-[#D4AF37]" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>Pola Asli: {showGhost ? "Terang" : "Samar"}</span>
        </button>
      </div>

      {/* Puzzle grid board */}
      <div
        ref={boardRef}
        className="relative w-full max-w-[400px] mx-auto aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-[#713f2c]/50 bg-[#2d2b38]/30 shadow-xl"
        style={{ backgroundImage: `url(${image})`, backgroundSize: "cover" }}
      >
        {/* Background shading based on showGhost */}
        <div
          className={`absolute inset-0 transition-colors duration-300 ${
            showGhost ? "bg-black/15" : "bg-black/60 backdrop-blur-[1px]"
          }`}
        />

        {/* Grid Slots */}
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize}, 1fr)`,
          }}
        >
          {Array.from({ length: total }, (_, slotIndex) => {
            const placedPiece = pieces.find((p) => p.currentIndex === slotIndex);
            const isWrong = wrongSlot === slotIndex;
            const isTargetOfSelected = selectedPiece?.correctIndex === slotIndex;

            return (
              <motion.div
                key={slotIndex}
                animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(slotIndex)}
                onClick={() => handleSlotClick(slotIndex)}
                className={`relative border border-white/15 transition-all cursor-pointer ${
                  placedPiece
                    ? ""
                    : isTargetOfSelected && showNumbers
                    ? "bg-[#D4AF37]/20 border-[#D4AF37] ring-1 ring-[#D4AF37] animate-pulse"
                    : "hover:bg-white/10"
                }`}
              >
                {/* Number Watermark on Empty Slot */}
                {!placedPiece && showNumbers && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span
                      className={`w-7 h-7 rounded-full font-display font-extrabold text-xs flex items-center justify-center shadow-lg transition-all ${
                        isTargetOfSelected
                          ? "bg-[#D4AF37] text-[#1A1614] scale-110 ring-2 ring-white"
                          : "bg-[#1A1614]/80 border border-[#D4AF37]/60 text-[#D4AF37]"
                      }`}
                    >
                      {slotIndex + 1}
                    </span>
                  </div>
                )}

                {/* Placed Piece */}
                {placedPiece && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${image})`,
                      backgroundSize: `${gridSize * 100}%`,
                      backgroundPosition: `${(placedPiece.correctIndex % gridSize) * (100 / (gridSize - 1))}% ${
                        Math.floor(placedPiece.correctIndex / gridSize) * (100 / (gridSize - 1))
                      }%`,
                    }}
                  >
                    {/* Green glow on correct placement */}
                    <div className="absolute inset-0 border-2 border-[#10B981] shadow-[inset_0_0_8px_rgba(16,185,129,0.4)]" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Instructions / Status */}
      <div className="text-center">
        {selectedPieceId !== null ? (
          <p className="text-xs text-[#D4AF37] font-display font-semibold animate-pulse flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Kepingan #{selectedPiece ? selectedPiece.correctIndex + 1 : ""} dipilih. Klik kotak nomor {selectedPiece ? selectedPiece.correctIndex + 1 : ""} di papan!
          </p>
        ) : (
          <p className="text-[11px] text-white/50 font-body">
            💡 Tip: Klik kepingan lalu klik kotak tujuan, atau geser langsung (*drag & drop*).
          </p>
        )}
      </div>

      {/* Tray of remaining pieces */}
      <div className="flex flex-wrap justify-center gap-3 min-h-[110px] bg-[#1A1614]/70 rounded-2xl p-4 border border-white/10 shadow-inner">
        <AnimatePresence>
          {trayPieces.map((piece) => {
            const isSelected = selectedPieceId === piece.id;

            return (
              <motion.div
                key={piece.id}
                layout
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: isSelected ? 1.08 : 1 }}
                exit={{ opacity: 0, scale: 0.3 }}
                draggable
                onDragStart={() => setDragging(piece.id)}
                onDragEnd={() => setDragging(null)}
                onClick={() => setSelectedPieceId((prev) => (prev === piece.id ? null : piece.id))}
                whileDrag={{ scale: 1.1, zIndex: 50, boxShadow: "0 8px 32px rgba(212,175,55,0.4)" }}
                className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all select-none ${
                  isSelected
                    ? "border-[#D4AF37] ring-2 ring-[#D4AF37] shadow-[0_0_18px_rgba(212,175,55,0.6)]"
                    : "border-[#D4AF37]/40 hover:border-[#D4AF37] hover:scale-105"
                }`}
                style={{
                  width: 82,
                  height: 82,
                  backgroundImage: `url(${image})`,
                  backgroundSize: `${gridSize * 100}%`,
                  backgroundPosition: `${(piece.correctIndex % gridSize) * (100 / (gridSize - 1))}% ${
                    Math.floor(piece.correctIndex / gridSize) * (100 / (gridSize - 1))
                  }%`,
                }}
              >
                {/* Number Badge on Tray Piece */}
                {showNumbers && (
                  <div className="absolute top-1.5 left-1.5 pointer-events-none">
                    <span className="w-5 h-5 rounded-full bg-[#1A1614]/90 border border-[#D4AF37] text-[#D4AF37] font-display font-extrabold text-[10px] flex items-center justify-center shadow-md">
                      {piece.correctIndex + 1}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        {trayPieces.length === 0 && !solved && (
          <p className="text-white/40 text-sm self-center font-body">Semua kepingan sudah diletakkan!</p>
        )}
      </div>
    </div>
  );
}
