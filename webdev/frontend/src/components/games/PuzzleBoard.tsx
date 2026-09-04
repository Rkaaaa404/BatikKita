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
  const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null);
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

  const placePieceAtSlot = useCallback(
    (pieceId: number, slotIndex: number) => {
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
    },
    [pieces]
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent, piece: PuzzlePieceData) => {
      setDragging(piece.id);
      setSelectedPieceId(piece.id);
      e.dataTransfer.setData("text/plain", String(piece.id));

      // Ensure the drag preview is 100% full-size matching the target board slot
      if (boardRef.current) {
        const boardWidth = boardRef.current.clientWidth;
        const currentSlotSize = boardWidth / gridSize;

        let ghost = document.getElementById("puzzle-drag-ghost") as HTMLDivElement;
        if (!ghost) {
          ghost = document.createElement("div");
          ghost.id = "puzzle-drag-ghost";
          ghost.style.position = "fixed";
          ghost.style.top = "-9999px";
          ghost.style.left = "-9999px";
          ghost.style.pointerEvents = "none";
          ghost.style.zIndex = "9999";
          document.body.appendChild(ghost);
        }

        ghost.style.width = `${currentSlotSize}px`;
        ghost.style.height = `${currentSlotSize}px`;
        ghost.style.backgroundImage = `url(${image})`;
        ghost.style.backgroundSize = `${boardWidth}px ${boardWidth}px`;
        ghost.style.backgroundPosition = `${(piece.correctIndex % gridSize) * (100 / (gridSize - 1))}% ${
          Math.floor(piece.correctIndex / gridSize) * (100 / (gridSize - 1))
        }%`;
        ghost.style.borderRadius = "10px";
        ghost.style.boxShadow = "0 10px 30px rgba(0,0,0,0.6)";
        ghost.style.border = "2px solid #D4AF37";

        e.dataTransfer.setDragImage(ghost, currentSlotSize / 2, currentSlotSize / 2);
      }
    },
    [image, gridSize]
  );

  const handleDragEnd = useCallback(() => {
    setDragging(null);
  }, []);

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

  return (
    <div className="flex flex-col gap-6">
      {/* Puzzle grid board - Empty / Kosongan without background image */}
      <div
        ref={boardRef}
        className="relative w-full max-w-[420px] mx-auto aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-[#713f2c]/60 bg-[#141110] shadow-2xl"
      >
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

            return (
              <motion.div
                key={slotIndex}
                animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(slotIndex)}
                onClick={() => handleSlotClick(slotIndex)}
                className={`relative border border-white/10 transition-colors cursor-pointer ${
                  placedPiece ? "" : "bg-white/[0.02] hover:bg-white/[0.06]"
                }`}
              >
                {/* Placed Piece */}
                {placedPiece && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${image})`,
                      backgroundSize: `${gridSize * 100}%`,
                      backgroundPosition: `${(placedPiece.correctIndex % gridSize) * (100 / (gridSize - 1))}% ${
                        Math.floor(placedPiece.correctIndex / gridSize) * (100 / (gridSize - 1))
                      }%`,
                    }}
                  >
                    {/* Subtle green glow on correct placement */}
                    <div className="absolute inset-0 border border-[#10B981]/50 shadow-[inset_0_0_6px_rgba(16,185,129,0.3)]" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Helper text */}
      <div className="text-center">
        <p className="text-xs text-white/50 font-body">
          Klik kepingan di bawah lalu klik kotak di papan, atau geser langsung (*drag & drop*).
        </p>
      </div>

      {/* Tray of remaining pieces */}
      <div className="flex flex-wrap justify-center gap-3.5 min-h-[120px] bg-[#1A1614]/70 rounded-2xl p-4 border border-white/10 shadow-inner max-w-2xl mx-auto w-full">
        <AnimatePresence>
          {trayPieces.map((piece) => {
            const isSelected = selectedPieceId === piece.id;

            return (
              <motion.div
                key={piece.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: isSelected ? 1.05 : 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                draggable
                onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, piece)}
                onDragEnd={handleDragEnd}
                onClick={() => setSelectedPieceId((prev) => (prev === piece.id ? null : piece.id))}
                className={`relative cursor-grab active:cursor-grabbing rounded-xl overflow-hidden border-2 transition-all select-none ${
                  isSelected
                    ? "border-[#D4AF37] ring-2 ring-[#D4AF37] shadow-[0_0_18px_rgba(212,175,55,0.6)]"
                    : "border-[#D4AF37]/40 hover:border-[#D4AF37] hover:scale-102"
                }`}
                style={{
                  width: 104,
                  height: 104,
                  backgroundImage: `url(${image})`,
                  backgroundSize: `${gridSize * 100}%`,
                  backgroundPosition: `${(piece.correctIndex % gridSize) * (100 / (gridSize - 1))}% ${
                    Math.floor(piece.correctIndex / gridSize) * (100 / (gridSize - 1))
                  }%`,
                }}
              />
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
