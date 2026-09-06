"use client";

import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Eye, Grid } from "lucide-react";
import {
  generateDynamicPuzzle,
  PuzzleResult,
  PuzzleDifficulty,
  PieceDef,
  Coord,
} from "@/lib/polyominoPartition";
import { useXp } from "@/hooks/useXp";
import { useGameTheme } from "@/hooks/useGameTheme";

const GRID_SIZE = 6;

function getCutoutBorderClasses(x: number, y: number, pid: number, shapeMap: number[][]): string {
  const classes: string[] = [];

  if (y === 0 || shapeMap[y - 1][x] !== pid) {
    classes.push("border-t-2 border-stone-800/90 shadow-[0_-1px_2px_rgba(0,0,0,0.35)]");
  } else {
    classes.push("border-t border-dashed border-stone-400/40");
  }

  if (y === GRID_SIZE - 1 || shapeMap[y + 1][x] !== pid) {
    classes.push("border-b-2 border-stone-800/90 shadow-[0_1px_2px_rgba(0,0,0,0.35)]");
  } else {
    classes.push("border-b border-dashed border-stone-400/40");
  }

  if (x === 0 || shapeMap[y][x - 1] !== pid) {
    classes.push("border-l-2 border-stone-800/90 shadow-[-1px_0_2px_rgba(0,0,0,0.35)]");
  } else {
    classes.push("border-l border-dashed border-stone-400/40");
  }

  if (x === GRID_SIZE - 1 || shapeMap[y][x + 1] !== pid) {
    classes.push("border-r-2 border-stone-800/90 shadow-[1px_0_2px_rgba(0,0,0,0.35)]");
  } else {
    classes.push("border-r border-dashed border-stone-400/40");
  }

  return classes.join(" ");
}

interface MagneticSnapResult {
  isMagnetized: boolean;
  pullX: number;
  pullY: number;
}

function checkMagneticSnap(
  def: PieceDef,
  currentX: number,
  currentY: number,
  boardRect: DOMRect
): MagneticSnapResult {
  const cellWidth = boardRect.width / GRID_SIZE;
  const cellHeight = boardRect.height / GRID_SIZE;

  // 1. Center of the target socket in screen pixels
  const targetCenterX = boardRect.left + (def.minX + def.width / 2) * cellWidth;
  const targetCenterY = boardRect.top + (def.minY + def.height / 2) * cellHeight;

  // Center distance in grid units
  const dxCenter = Math.abs(currentX - targetCenterX) / cellWidth;
  const dyCenter = Math.abs(currentY - targetCenterY) / cellHeight;
  const centerHypot = Math.hypot(dxCenter, dyCenter);

  // 2. Cursor position in grid units
  const cursorGridX = (currentX - boardRect.left) / cellWidth;
  const cursorGridY = (currentY - boardRect.top) / cellHeight;

  // Min distance from cursor to any cell of the target socket
  const minCursorDist = Math.min(
    ...def.cells.map((c) => Math.hypot(c.x + 0.5 - cursorGridX, c.y + 0.5 - cursorGridY))
  );

  // 3. Top-left of the piece in screen pixels when centered on pointer
  const pieceWidthPx = def.width * cellWidth;
  const pieceHeightPx = def.height * cellHeight;
  const pieceLeftPx = currentX - pieceWidthPx / 2;
  const pieceTopPx = currentY - pieceHeightPx / 2;

  // Ideal target top-left position in screen pixels
  const idealTargetLeftPx = boardRect.left + def.minX * cellWidth;
  const idealTargetTopPx = boardRect.top + def.minY * cellHeight;

  // Offset distance between piece top-left and socket top-left in grid units
  const shiftX = Math.abs(pieceLeftPx - idealTargetLeftPx) / cellWidth;
  const shiftY = Math.abs(pieceTopPx - idealTargetTopPx) / cellHeight;
  const shiftHypot = Math.hypot(shiftX, shiftY);

  // Tight precision snapping: block must be brought closely within 0.85 cell units
  const isMagnetized = centerHypot <= 0.85 || (shiftHypot <= 0.8 && minCursorDist <= 0.8);

  // Gentle micro-assist pull when close
  const pullFactor = isMagnetized ? Math.max(0.15, 1 - centerHypot / 0.9) * 0.35 : 0;
  const pullX = pieceLeftPx + (idealTargetLeftPx - pieceLeftPx) * pullFactor;
  const pullY = pieceTopPx + (idealTargetTopPx - pieceTopPx) * pullFactor;

  return { isMagnetized, pullX, pullY };
}

interface DraggingPieceState {
  id: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  offsetX: number;
  offsetY: number;
}

interface CapStampingBoardProps {
  image: string;
  philosophy: string;
  motifId?: string;
  motifName?: string;
  difficulty?: PuzzleDifficulty;
  onSolve: (timeSeconds: number) => void;
}

export function CapStampingBoard({
  image,
  philosophy,
  motifId,
  difficulty = "Mudah",
  onSolve,
}: CapStampingBoardProps) {
  const { unlockMotif } = useXp();
  const { isDark } = useGameTheme();

  // Dynamic Randomized Polyomino Partitioning
  const [puzzle, setPuzzle] = useState<PuzzleResult>(() =>
    generateDynamicPuzzle(GRID_SIZE, difficulty)
  );

  const currentShapeMap = puzzle.shapeMap;
  const currentPieceDefs = puzzle.pieces;

  // 3-Slot Workbench: only 3 blocks active simultaneously in fixed slot positions
  const [workbench, setWorkbench] = useState<{
    activeSlots: (number | null)[];
    queue: number[];
  }>({
    activeSlots: [null, null, null],
    queue: [],
  });
  const [placed, setPlaced] = useState<number[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [draggingPiece, setDraggingPiece] = useState<DraggingPieceState | null>(null);
  const [wrongSlot, setWrongSlot] = useState<Coord | null>(null);
  const [guidePiece, setGuidePiece] = useState<number | null>(null);
  const [justPlacedPiece, setJustPlacedPiece] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  const [showGridOverlay, setShowGridOverlay] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const startTime = useRef<number>(Date.now());

  // Re-generate dynamic puzzle when image, difficulty or reset occurs
  useEffect(() => {
    const newPuzzle = generateDynamicPuzzle(GRID_SIZE, difficulty);
    setPuzzle(newPuzzle);
    const shuffled = newPuzzle.pieces.map((p) => p.id).sort(() => Math.random() - 0.5);
    setWorkbench({
      activeSlots: [shuffled[0] ?? null, shuffled[1] ?? null, shuffled[2] ?? null],
      queue: shuffled.slice(3),
    });
    setPlaced([]);
    setSelectedPiece(null);
    setDraggingPiece(null);
    setGuidePiece(null);
    setJustPlacedPiece(null);
    setShowGridOverlay(false);
    startTime.current = Date.now();
    setSolved(false);
  }, [image, difficulty]);

  // Check victory condition
  useEffect(() => {
    if (placed.length === currentPieceDefs.length && !solved && placed.length > 0) {
      setSolved(true);
      setShowGridOverlay(false);

      if (motifId) {
        unlockMotif(motifId, difficulty);
      }

      const elapsed = Math.round((Date.now() - startTime.current) / 1000);
      setTimeout(() => onSolve(elapsed), 2400);
    }
  }, [placed, solved, onSolve, currentPieceDefs.length, motifId, difficulty, unlockMotif]);

  // Attempt placement with tight, realistic stamping precision
  const attemptPlace = useCallback(
    (pieceId: number, dropX: number, dropY: number, forceSuccess = false) => {
      const def = currentPieceDefs.find((p) => p.id === pieceId);
      if (!def) return;

      const isDirectMatch = forceSuccess || def.cells.some((c) => c.x === dropX && c.y === dropY);

      if (isDirectMatch) {
        // The newly placed block's exact slot is immediately replaced by the next block from queue
        setWorkbench((prev) => {
          const slotIdx = prev.activeSlots.indexOf(pieceId);
          if (slotIdx === -1) return prev;

          const nextSlots = [...prev.activeSlots];
          const nextPiece = prev.queue.length > 0 ? prev.queue[0] : null;
          nextSlots[slotIdx] = nextPiece;

          return {
            activeSlots: nextSlots,
            queue: prev.queue.slice(1),
          };
        });

        setPlaced((prev) => [...prev, pieceId]);
        setSelectedPiece(null);
        setGuidePiece(null);
        setJustPlacedPiece(pieceId);
        setTimeout(() => setJustPlacedPiece(null), 1000);
      } else {
        setWrongSlot({ x: dropX, y: dropY });
        setTimeout(() => setWrongSlot(null), 700);

        setGuidePiece(pieceId);
        setTimeout(() => setGuidePiece(null), 2500);
      }
    },
    [currentPieceDefs]
  );

  // Handle pointer down on tray piece
  const handlePiecePointerDown = useCallback(
    (e: React.PointerEvent, pieceId: number) => {
      if (e.button !== 0) return;
      e.preventDefault();

      const def = currentPieceDefs.find((p) => p.id === pieceId);
      if (!def) return;

      const boardRect = boardRef.current?.getBoundingClientRect();
      const boardCellSize = boardRect ? boardRect.width / GRID_SIZE : 72;

      const pieceWidth = def.width * boardCellSize;
      const pieceHeight = def.height * boardCellSize;

      setDraggingPiece({
        id: pieceId,
        startX: e.clientX,
        startY: e.clientY,
        currentX: e.clientX,
        currentY: e.clientY,
        offsetX: pieceWidth / 2,
        offsetY: pieceHeight / 2,
      });

      setSelectedPiece(pieceId);
    },
    [currentPieceDefs]
  );

  // Global pointer move and pointer up
  useEffect(() => {
    if (!draggingPiece) return;

    const handlePointerMove = (e: PointerEvent) => {
      setDraggingPiece((prev) =>
        prev
          ? {
              ...prev,
              currentX: e.clientX,
              currentY: e.clientY,
            }
          : null
      );
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!draggingPiece) return;

      const dist = Math.hypot(e.clientX - draggingPiece.startX, e.clientY - draggingPiece.startY);

      if (dist > 4 && boardRef.current) {
        const boardRect = boardRef.current.getBoundingClientRect();
        const def = currentPieceDefs.find((p) => p.id === draggingPiece.id);

        if (def) {
          const snap = checkMagneticSnap(def, e.clientX, e.clientY, boardRect);

          if (snap.isMagnetized) {
            attemptPlace(draggingPiece.id, def.cells[0].x, def.cells[0].y, true);
          } else {
            const cellWidth = boardRect.width / GRID_SIZE;
            const cellHeight = boardRect.height / GRID_SIZE;
            const gridX = Math.floor((e.clientX - boardRect.left) / cellWidth);
            const gridY = Math.floor((e.clientY - boardRect.top) / cellHeight);

            if (gridX >= 0 && gridX < GRID_SIZE && gridY >= 0 && gridY < GRID_SIZE) {
              attemptPlace(draggingPiece.id, gridX, gridY);
            }
          }
        }
      }

      setDraggingPiece(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [draggingPiece, attemptPlace, currentPieceDefs]);

  // Click on cell
  const handleCellClick = useCallback(
    (x: number, y: number) => {
      const pid = currentShapeMap[y][x];

      if (pid === 0 || placed.includes(pid)) {
        if (selectedPiece !== null) {
          attemptPlace(selectedPiece, x, y);
        }
        return;
      }

      if (selectedPiece !== null) {
        attemptPlace(selectedPiece, x, y);
      } else {
        if (workbench.activeSlots.includes(pid)) {
          setSelectedPiece(pid);
        }
      }
    },
    [currentShapeMap, placed, selectedPiece, attemptPlace, workbench.activeSlots]
  );

  const magneticInfo = useMemo(() => {
    if (!draggingPiece || !boardRef.current) return { isMagnetized: false, pullX: 0, pullY: 0 };
    const def = currentPieceDefs.find((p) => p.id === draggingPiece.id);
    if (!def) return { isMagnetized: false, pullX: 0, pullY: 0 };
    const boardRect = boardRef.current.getBoundingClientRect();
    return checkMagneticSnap(def, draggingPiece.currentX, draggingPiece.currentY, boardRect);
  }, [draggingPiece, currentPieceDefs]);

  const isMagnetized = magneticInfo.isMagnetized;

  return (
    <div className="flex flex-col gap-6">
      {/* Progress & Mode Bar */}
      <div className="relative flex items-center justify-center px-2">
        <p
          className={`text-center font-display text-xs sm:text-sm font-medium ${
            isDark ? "text-white/80" : "text-stone-700"
          }`}
        >
          <span className="text-[#D4AF37] font-bold font-display">{placed.length}</span>{" "}
          dari{" "}
          <span className="font-bold">{currentPieceDefs.length}</span> Kepingan Terpasang
        </p>

        {solved && (
          <div className="absolute right-0">
            <button
              onClick={() => setShowGridOverlay((prev) => !prev)}
              className="flex items-center gap-1.5 text-xs font-display font-semibold text-[#D4AF37] hover:text-[#e5c358] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 px-3 py-1.5 rounded-lg transition-all"
            >
              {showGridOverlay ? <Eye className="w-3.5 h-3.5" /> : <Grid className="w-3.5 h-3.5" />}
              {showGridOverlay ? "Tampilkan Kain Utuh" : "Tampilkan Garis Sambungan"}
            </button>
          </div>
        )}
      </div>

      {/* Main Cap Stamping Canvas */}
      <div className="relative w-full max-w-[460px] mx-auto select-none">
        <div
          className={`relative w-full aspect-square rounded-2xl overflow-hidden border-2 shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all ${
            isMagnetized
              ? "border-[#10B981] shadow-[0_0_30px_rgba(16,185,129,0.4)]"
              : isDark
              ? "border-[#D4AF37]/60 bg-[#1A1614]"
              : "border-[#D4AF37]/70 bg-[#FAF8F5] shadow-md"
          }`}
        >
          {/* Layer 1: Unified Completed Masterpiece Fabric when Solved */}
          {solved && !showGridOverlay ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0 overflow-hidden"
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
              />
              <motion.div
                initial={{ x: "-120%" }}
                animate={{ x: "220%" }}
                transition={{ duration: 1.6, ease: "easeInOut", repeat: 1, repeatDelay: 1.2 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/35 to-transparent skew-x-12 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 bg-[#1A1614]/90 backdrop-blur-md border border-[#D4AF37]/60 rounded-xl p-3 text-center shadow-2xl">
                <p className="text-xs font-display font-bold text-[#D4AF37] flex items-center justify-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> Mahakarya Batik Utuh Sempurna
                </p>
                <p className="text-[11px] text-white/85 font-body">
                  Seluruh kepingan cap tembaga telah menyatu tanpa sekat. Kain mori kini bermotif
                  anggun dan harmonis.
                </p>
              </div>
            </motion.div>
          ) : (
            /* Layer 2: 6x6 Grid where Unplaced Pieces are White / B&W Sketch Cutouts */
            <div ref={boardRef} className="absolute inset-0 grid grid-cols-6 grid-rows-6">
              {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
                const x = i % GRID_SIZE;
                const y = Math.floor(i / GRID_SIZE);
                const pid = currentShapeMap[y][x];

                const isPieceCell = pid > 0;
                const isPlaced = isPieceCell && placed.includes(pid);
                const isUnplacedCutout = isPieceCell && !placed.includes(pid);
                const isWrong = wrongSlot?.x === x && wrongSlot?.y === y;
                const isGuided = guidePiece === pid;
                const isJustPlaced = justPlacedPiece === pid;
                const isTargetMagnetized = isMagnetized && draggingPiece?.id === pid;
                const cutoutBorderClasses = isUnplacedCutout
                  ? getCutoutBorderClasses(x, y, pid, currentShapeMap)
                  : "";

                const bgPosX = `${(x / (GRID_SIZE - 1)) * 100}%`;
                const bgPosY = `${(y / (GRID_SIZE - 1)) * 100}%`;

                return (
                  <motion.div
                    key={i}
                    animate={
                      isWrong
                        ? { backgroundColor: "rgba(239, 68, 68, 0.55)", scale: [1, 0.93, 1] }
                        : isTargetMagnetized
                        ? { backgroundColor: "rgba(16, 185, 129, 0.35)", scale: 1.02 }
                        : isGuided
                        ? {
                            backgroundColor: [
                              "rgba(212, 175, 55, 0.15)",
                              "rgba(212, 175, 55, 0.5)",
                              "rgba(212, 175, 55, 0.15)",
                            ],
                          }
                        : {}
                    }
                    transition={
                      isGuided
                        ? { repeat: Infinity, duration: 0.9 }
                        : { duration: 0.25 }
                    }
                    onClick={() => handleCellClick(x, y)}
                    className={`relative overflow-hidden transition-all duration-150 ${cutoutBorderClasses} ${
                      isUnplacedCutout
                        ? "cursor-pointer hover:brightness-105"
                        : isPlaced
                        ? "cursor-default"
                        : "cursor-default"
                    }`}
                  >
                    {/* 1. Placed Piece: Authentic Full Color Fabric Pattern */}
                    {isPlaced && (
                      <motion.div
                        initial={isJustPlaced ? { scale: 0.94, opacity: 0.7 } : false}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        className="absolute inset-0 overflow-hidden shadow-inner"
                      >
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            backgroundImage: `url(${image})`,
                            backgroundSize: "600% 600%",
                            backgroundPosition: `${bgPosX} ${bgPosY}`,
                          }}
                        />
                        {/* Stamp Gold Impression Flash */}
                        {isJustPlaced && (
                          <motion.div
                            initial={{ opacity: 0.9 }}
                            animate={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="absolute inset-0 bg-[#D4AF37]/40"
                          />
                        )}
                      </motion.div>
                    )}

                    {/* 2. Unplaced Puzzle Cutout: High-Intensity B&W Grayscale Blueprint */}
                    {isUnplacedCutout && (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden bg-white/50">
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            backgroundImage: `url(${image})`,
                            backgroundSize: "600% 600%",
                            backgroundPosition: `${bgPosX} ${bgPosY}`,
                            filter: "grayscale(100%) contrast(230%) brightness(1.0)",
                          }}
                        />
                      </div>
                    )}

                    {/* 3. Magnetic Hover Aura */}
                    {isTargetMagnetized && (
                      <div className="absolute inset-0 bg-emerald-400/25 border-2 border-emerald-400 pointer-events-none z-20 animate-pulse" />
                    )}

                    {/* 4. Golden Pulse Guide */}
                    {isGuided && isUnplacedCutout && !isTargetMagnetized && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="absolute inset-0 bg-[#D4AF37]/30 border-2 border-[#D4AF37] pointer-events-none z-20"
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Guide Note */}
      <div className="text-center px-4">
        <p
          className={`text-xs font-body ${
            isDark ? "text-white/60" : "text-stone-600"
          }`}
        >
          Tarik kepingan cap tembaga ke arah rongga sketsa hingga{" "}
          <span className="text-emerald-500 font-semibold">berpendar hijau</span>, lalu lepaskan
          untuk mencap kain mori.
        </p>
      </div>

      {/* Piece Tray (Baki Meja Kerja Cap Tembaga - 3 Slot Aktif) */}
      <div
        className={`rounded-2xl p-4 sm:p-5 border shadow-xl max-w-2xl mx-auto w-full transition-colors ${
          isDark
            ? "bg-[#1A1614]/90 border-white/10 text-white"
            : "bg-white border-[#E2DDD5] text-[#2D2B38] shadow-md"
        }`}
      >
        {workbench.activeSlots.every((s) => s === null) ? (
          <div className="text-center py-5">
            <p className="text-[#D4AF37] text-sm font-display font-semibold flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" /> Seluruh kepingan cap tembaga telah terpasang sempurna!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:gap-4 items-center justify-items-center min-h-[130px]">
            {workbench.activeSlots.map((pieceId, slotIdx) => {
              const def = pieceId !== null ? currentPieceDefs.find((p) => p.id === pieceId) : null;
              const isSelected = pieceId !== null && selectedPiece === pieceId;
              const isBeingDragged = pieceId !== null && draggingPiece?.id === pieceId;
              const cellSize = 30;

              return (
                <div
                  key={`slot-${slotIdx}`}
                  className="w-full flex items-center justify-center min-h-[110px]"
                >
                  <AnimatePresence mode="wait">
                    {pieceId !== null && def ? (
                      <motion.div
                        key={pieceId}
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{
                          opacity: isBeingDragged ? 0.3 : 1,
                          scale: isSelected && !isBeingDragged ? 1.08 : 1,
                          boxShadow:
                            isSelected && !isBeingDragged
                              ? "0 0 20px rgba(212,175,55,0.75)"
                              : isDark
                              ? "0 4px 12px rgba(0,0,0,0.5)"
                              : "0 2px 8px rgba(0,0,0,0.08)",
                        }}
                        exit={{ opacity: 0, scale: 0.4 }}
                        transition={{ duration: 0.25 }}
                        onPointerDown={(e) => handlePiecePointerDown(e, pieceId)}
                        onClick={() =>
                          setSelectedPiece((prev) => (prev === pieceId ? null : pieceId))
                        }
                        className={`flex items-center justify-center p-2.5 sm:p-3.5 rounded-2xl border transition-all cursor-grab active:cursor-grabbing select-none touch-none ${
                          isSelected
                            ? "bg-[#D4AF37]/20 border-[#D4AF37]"
                            : isDark
                            ? "bg-[#25201C] border-white/15 hover:border-[#D4AF37]/50 hover:bg-[#2b2520]"
                            : "bg-[#FAF8F5] border-[#E2DDD5] hover:border-[#D4AF37]/60 hover:bg-stone-100 shadow-xs"
                        }`}
                      >
                        <div
                          className="relative pointer-events-none"
                          style={{
                            width: def.width * cellSize,
                            height: def.height * cellSize,
                          }}
                        >
                          <div
                            className="absolute inset-0 grid"
                            style={{
                              gridTemplateColumns: `repeat(${def.width}, 1fr)`,
                              gridTemplateRows: `repeat(${def.height}, 1fr)`,
                            }}
                          >
                            {Array.from({ length: def.width * def.height }, (_, i) => {
                              const lx = i % def.width;
                              const ly = Math.floor(i / def.width);
                              const isCellActive = def.localCells.some(
                                (c) => c.x === lx && c.y === ly
                              );

                              if (!isCellActive)
                                return (
                                  <div key={i} className="pointer-events-none bg-transparent" />
                                );

                              const origX = def.minX + lx;
                              const origY = def.minY + ly;
                              const bgPosX = `${(origX / (GRID_SIZE - 1)) * 100}%`;
                              const bgPosY = `${(origY / (GRID_SIZE - 1)) * 100}%`;

                              return (
                                <div
                                  key={i}
                                  className="relative overflow-hidden rounded-[3px]"
                                  style={{
                                    backgroundImage: `url(${image})`,
                                    backgroundSize: "600% 600%",
                                    backgroundPosition: `${bgPosX} ${bgPosY}`,
                                    border: isSelected
                                      ? "1.5px solid #D4AF37"
                                      : "1px solid rgba(212,175,55,0.4)",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                                  }}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Dragged Polyomino Piece */}
      {draggingPiece &&
        (() => {
          const def = currentPieceDefs.find((p) => p.id === draggingPiece.id);
          if (!def) return null;

          const boardRect = boardRef.current?.getBoundingClientRect();
          const boardCellSize = boardRect ? boardRect.width / GRID_SIZE : 72;

          return (
            <div
              className={`fixed pointer-events-none z-50 select-none transition-transform duration-75 ${
                isMagnetized
                  ? "scale-105 drop-shadow-[0_16px_32px_rgba(16,185,129,0.7)]"
                  : "drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)]"
              }`}
              style={{
                left: isMagnetized
                  ? magneticInfo.pullX
                  : draggingPiece.currentX - draggingPiece.offsetX,
                top: isMagnetized
                  ? magneticInfo.pullY
                  : draggingPiece.currentY - draggingPiece.offsetY,
                width: def.width * boardCellSize,
                height: def.height * boardCellSize,
              }}
            >
              <div
                className="w-full h-full grid"
                style={{
                  gridTemplateColumns: `repeat(${def.width}, 1fr)`,
                  gridTemplateRows: `repeat(${def.height}, 1fr)`,
                }}
              >
                {Array.from({ length: def.width * def.height }, (_, i) => {
                  const lx = i % def.width;
                  const ly = Math.floor(i / def.width);
                  const isCellActive = def.localCells.some((c) => c.x === lx && c.y === ly);

                  if (!isCellActive)
                    return <div key={i} className="pointer-events-none bg-transparent" />;

                  const origX = def.minX + lx;
                  const origY = def.minY + ly;
                  const bgPosX = `${(origX / (GRID_SIZE - 1)) * 100}%`;
                  const bgPosY = `${(origY / (GRID_SIZE - 1)) * 100}%`;

                  return (
                    <div
                      key={i}
                      className="relative overflow-hidden rounded-[4px]"
                      style={{
                        backgroundImage: `url(${image})`,
                        backgroundSize: "600% 600%",
                        backgroundPosition: `${bgPosX} ${bgPosY}`,
                        border: isMagnetized ? "2.5px solid #10B981" : "2px solid #D4AF37",
                        boxShadow: isMagnetized
                          ? "0 0 16px rgba(16,185,129,0.8), inset 0 0 8px rgba(16,185,129,0.4)"
                          : "0 4px 12px rgba(0,0,0,0.5), inset 0 0 8px rgba(212,175,55,0.4)",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })()}
    </div>
  );
}
