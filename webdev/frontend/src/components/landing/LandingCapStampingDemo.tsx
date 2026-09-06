"use client";

import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, RotateCcw, ArrowRight, CheckCircle2, Hand } from "lucide-react";
import Link from "next/link";

const GRID_SIZE = 6;

interface Coord {
  x: number;
  y: number;
}

interface PieceDef {
  id: number;
  name: string;
  cells: Coord[];
  minX: number;
  minY: number;
  width: number;
  height: number;
  localCells: Coord[];
}

// 4 iconic Kawung polyomino stamp shapes
const KAWUNG_MAP = [
  [1, 1, 0, 2, 2, 2],
  [1, 1, 0, 0, 0, 0],
  [0, 0, 0, 3, 3, 3],
  [0, 0, 0, 0, 3, 0],
  [4, 0, 0, 0, 0, 0],
  [4, 4, 4, 0, 0, 0],
];

const PIECE_NAMES: Record<number, string> = {
  1: "Poros Persegi (2x2)",
  2: "Bilah Mendatar (3x1)",
  3: "Pusar Kelopak (T)",
  4: "Siku Sudut (L)",
};

function extractPieces(shapeMap: number[][]): PieceDef[] {
  const map = new Map<number, Coord[]>();
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const pid = shapeMap[y][x];
      if (pid === 0) continue;
      if (!map.has(pid)) map.set(pid, []);
      map.get(pid)!.push({ x, y });
    }
  }

  const defs: PieceDef[] = [];
  map.forEach((cells, id) => {
    const minX = Math.min(...cells.map((c) => c.x));
    const maxX = Math.max(...cells.map((c) => c.x));
    const minY = Math.min(...cells.map((c) => c.y));
    const maxY = Math.max(...cells.map((c) => c.y));
    const width = maxX - minX + 1;
    const height = maxY - minY + 1;
    const localCells = cells.map((c) => ({ x: c.x - minX, y: c.y - minY }));

    defs.push({
      id,
      name: PIECE_NAMES[id] || `Cap #${id}`,
      cells,
      minX,
      minY,
      width,
      height,
      localCells,
    });
  });

  return defs.sort((a, b) => a.id - b.id);
}

const PIECE_DEFS = extractPieces(KAWUNG_MAP);
const BATIK_IMAGE = "/images/motifs/batik_kawung.webp";

interface DragState {
  pieceId: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isMagnetized: boolean;
  pullX: number;
  pullY: number;
}

export function LandingCapStampingDemo() {
  const [mounted, setMounted] = useState(false);
  const [placed, setPlaced] = useState<number[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [justPlaced, setJustPlaced] = useState<number | null>(null);
  const [wrongShake, setWrongShake] = useState(false);

  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const unplacedPieces = useMemo(() => {
    return PIECE_DEFS.filter((p) => !placed.includes(p.id));
  }, [placed]);

  const isCompleted = placed.length === PIECE_DEFS.length;

  // Check magnetic snap against board position
  const evaluateMagnet = useCallback(
    (pieceId: number, screenX: number, screenY: number) => {
      if (!boardRef.current) return { isMagnetized: false, pullX: screenX, pullY: screenY };

      const def = PIECE_DEFS.find((p) => p.id === pieceId);
      if (!def) return { isMagnetized: false, pullX: screenX, pullY: screenY };

      const rect = boardRef.current.getBoundingClientRect();
      const cellW = rect.width / GRID_SIZE;
      const cellH = rect.height / GRID_SIZE;

      // Target socket top-left in screen coords
      const socketLeft = rect.left + def.minX * cellW;
      const socketTop = rect.top + def.minY * cellH;
      const socketCenterX = socketLeft + (def.width * cellW) / 2;
      const socketCenterY = socketTop + (def.height * cellH) / 2;

      // Distance from pointer to target socket center
      const dist = Math.hypot(screenX - socketCenterX, screenY - socketCenterY);
      const threshold = Math.max(cellW * 1.8, 60);

      const isMagnetized = dist <= threshold;
      const pullFactor = isMagnetized ? 0.65 : 0;
      const pullX = screenX + (socketCenterX - screenX) * pullFactor;
      const pullY = screenY + (socketCenterY - screenY) * pullFactor;

      return { isMagnetized, pullX, pullY };
    },
    []
  );

  // Successfully stamp piece
  const handleStampPiece = useCallback(
    (pieceId: number) => {
      setPlaced((prev) => {
        if (prev.includes(pieceId)) return prev;
        return [...prev, pieceId];
      });
      setSelectedPiece(null);
      setJustPlaced(pieceId);
      setTimeout(() => setJustPlaced(null), 800);
    },
    []
  );

  // Handle pointer down on a piece in the tray
  const handlePiecePointerDown = useCallback(
    (e: React.PointerEvent, pieceId: number) => {
      if (e.button !== 0) return;
      e.preventDefault();

      const { isMagnetized, pullX, pullY } = evaluateMagnet(pieceId, e.clientX, e.clientY);

      setDragState({
        pieceId,
        startX: e.clientX,
        startY: e.clientY,
        currentX: e.clientX,
        currentY: e.clientY,
        isMagnetized,
        pullX,
        pullY,
      });
      setSelectedPiece(pieceId);
    },
    [evaluateMagnet]
  );

  // Global pointer move & pointer up during drag
  useEffect(() => {
    if (!dragState) return;

    const handlePointerMove = (e: PointerEvent) => {
      const { isMagnetized, pullX, pullY } = evaluateMagnet(
        dragState.pieceId,
        e.clientX,
        e.clientY
      );

      setDragState((prev) =>
        prev
          ? {
              ...prev,
              currentX: e.clientX,
              currentY: e.clientY,
              isMagnetized,
              pullX,
              pullY,
            }
          : null
      );
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!dragState) return;

      const dist = Math.hypot(e.clientX - dragState.startX, e.clientY - dragState.startY);

      // Check if released within magnetic snap or board socket
      if (dragState.isMagnetized || dist > 10) {
        if (dragState.isMagnetized) {
          handleStampPiece(dragState.pieceId);
        } else if (boardRef.current) {
          const rect = boardRef.current.getBoundingClientRect();
          const def = PIECE_DEFS.find((p) => p.id === dragState.pieceId);
          if (def) {
            const cellW = rect.width / GRID_SIZE;
            const cellH = rect.height / GRID_SIZE;
            const dropX = Math.floor((e.clientX - rect.left) / cellW);
            const dropY = Math.floor((e.clientY - rect.top) / cellH);

            const isHit = def.cells.some((c) => c.x === dropX && c.y === dropY);
            if (isHit) {
              handleStampPiece(dragState.pieceId);
            } else {
              setWrongShake(true);
              setTimeout(() => setWrongShake(false), 500);
            }
          }
        }
      }

      setDragState(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [dragState, evaluateMagnet, handleStampPiece]);

  // Click on socket cell directly (alternative click-to-place flow)
  const handleCellClick = (x: number, y: number) => {
    const pid = KAWUNG_MAP[y][x];
    if (pid === 0 || placed.includes(pid)) return;

    if (selectedPiece === pid) {
      handleStampPiece(pid);
    } else {
      setSelectedPiece(pid);
    }
  };

  const resetDemo = () => {
    setPlaced([]);
    setSelectedPiece(null);
    setDragState(null);
    setJustPlaced(null);
  };

  // Drag ghost piece rendered via React Portal so it never clips and respects true viewport coordinates
  const renderDragGhost = () => {
    if (!dragState || !mounted) return null;
    const def = PIECE_DEFS.find((p) => p.id === dragState.pieceId);
    if (!def || !boardRef.current) return null;

    const rect = boardRef.current.getBoundingClientRect();
    const cellSize = rect.width / GRID_SIZE;
    const pieceW = def.width * cellSize;
    const pieceH = def.height * cellSize;

    // Use magnetized position if snapping, otherwise center under pointer
    const posX = dragState.isMagnetized
      ? rect.left + def.minX * cellSize
      : dragState.currentX - pieceW / 2;
    const posY = dragState.isMagnetized
      ? rect.top + def.minY * cellSize
      : dragState.currentY - pieceH / 2;

    return createPortal(
      <div
        className={`fixed pointer-events-none z-[9999] select-none transition-transform duration-75 ${
          dragState.isMagnetized
            ? "scale-105 drop-shadow-[0_12px_28px_rgba(16,185,129,0.85)]"
            : "drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
        }`}
        style={{
          left: posX,
          top: posY,
          width: pieceW,
          height: pieceH,
          display: "grid",
          gridTemplateColumns: `repeat(${def.width}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${def.height}, ${cellSize}px)`,
        }}
      >
        {Array.from({ length: def.width * def.height }, (_, i) => {
          const lx = i % def.width;
          const ly = Math.floor(i / def.width);
          const isActive = def.localCells.some((c) => c.x === lx && c.y === ly);
          if (!isActive) return <div key={i} className="pointer-events-none" />;

          const ox = def.minX + lx;
          const oy = def.minY + ly;
          const bgX = `${(ox / (GRID_SIZE - 1)) * 100}%`;
          const bgY = `${(oy / (GRID_SIZE - 1)) * 100}%`;

          return (
            <div
              key={i}
              className="relative overflow-hidden rounded-[3px]"
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                backgroundImage: `url(${BATIK_IMAGE})`,
                backgroundSize: "600% 600%",
                backgroundPosition: `${bgX} ${bgY}`,
                border: dragState.isMagnetized
                  ? "2.5px solid #10B981"
                  : "2px solid #D4AF37",
                boxShadow: dragState.isMagnetized
                  ? "0 0 16px rgba(16,185,129,0.8), inset 0 0 8px rgba(16,185,129,0.4)"
                  : "0 2px 6px rgba(0,0,0,0.3), inset 0 0 6px rgba(212,175,55,0.4)",
              }}
            />
          );
        })}
      </div>,
      document.body
    );
  };

  const trayCellSize = 22; // 22px per cell in tray for clear, proportional polyomino shapes

  return (
    <div className="w-full bg-[#FAF8F5] rounded-3xl p-5 sm:p-6 border border-[#E8E1D7] shadow-xl shadow-[#713f2c]/5 flex flex-col items-center select-none relative">
      {/* Mini Demo Title Bar */}
      <div className="w-full flex items-center justify-between pb-3.5 mb-4 border-b border-[#713f2c]/10 text-xs">
        <div className="flex items-center gap-2 text-[#713f2c] font-display font-bold">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>Mini-Demo: Cap Stamping Kawung</span>
        </div>
        <span className="text-[#713f2c] bg-[#713f2c]/10 px-2.5 py-0.5 rounded-full font-display font-bold text-[11px]">
          {placed.length}/4 Cap Tertempel
        </span>
      </div>

      {/* ─── The Stamping Canvas ─── */}
      <div className="relative w-full max-w-[290px] sm:max-w-[310px] aspect-square rounded-2xl overflow-hidden border-2 border-[#D4AF37]/80 shadow-[0_8px_24px_rgba(113,63,44,0.12)] bg-[#F7F4EE]">
        {/* Layer 1: Seamless Fabric Reveal on Completion */}
        {isCompleted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 overflow-hidden"
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${BATIK_IMAGE})` }}
            />
            {/* Golden sweep light */}
            <motion.div
              initial={{ x: "-120%" }}
              animate={{ x: "220%" }}
              transition={{ duration: 1.5, repeat: 1, repeatDelay: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/40 to-transparent skew-x-12 pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </motion.div>
        ) : (
          /* Layer 2: 6x6 Stamping Board with Blueprint Cutouts */
          <div
            ref={boardRef}
            className={`absolute inset-0 grid grid-cols-6 grid-rows-6 ${
              wrongShake ? "animate-shake" : ""
            }`}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
              const x = i % GRID_SIZE;
              const y = Math.floor(i / GRID_SIZE);
              const pid = KAWUNG_MAP[y][x];

              const isPieceCell = pid > 0;
              const isPlaced = isPieceCell && placed.includes(pid);
              const isUnplaced = isPieceCell && !placed.includes(pid);
              const isTargetHover =
                dragState?.isMagnetized && dragState.pieceId === pid;
              const isSelectedTarget = selectedPiece === pid;
              const isJustStamped = justPlaced === pid;

              const bgX = `${(x / (GRID_SIZE - 1)) * 100}%`;
              const bgY = `${(y / (GRID_SIZE - 1)) * 100}%`;

              return (
                <div
                  key={i}
                  onClick={() => handleCellClick(x, y)}
                  className={`relative cursor-pointer transition-all overflow-hidden ${
                    isUnplaced
                      ? "bg-[#F7F4EE] shadow-[inset_0_1px_3px_rgba(0,0,0,0.12)] border border-dashed border-[#8d786a]/30"
                      : ""
                  }`}
                >
                  {/* Colored Fabric (Placed or Background) */}
                  {(!isPieceCell || isPlaced) && (
                    <motion.div
                      initial={
                        isJustStamped
                          ? { opacity: 0, scale: 1.15, filter: "brightness(1.5)" }
                          : false
                      }
                      animate={{ opacity: 1, scale: 1, filter: "brightness(1)" }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage: `url(${BATIK_IMAGE})`,
                        backgroundSize: "600% 600%",
                        backgroundPosition: `${bgX} ${bgY}`,
                      }}
                    />
                  )}

                  {/* Clean Mori Fabric Unplaced Stencil Cutout */}
                  {isUnplaced && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden bg-[#F8F5EF]">
                      <div
                        className="absolute inset-0 pointer-events-none opacity-40"
                        style={{
                          backgroundImage: `url(${BATIK_IMAGE})`,
                          backgroundSize: "600% 600%",
                          backgroundPosition: `${bgX} ${bgY}`,
                          filter: "grayscale(100%) contrast(140%) brightness(0.9)",
                        }}
                      />
                    </div>
                  )}

                  {/* Magnetic Hover Glow */}
                  {isTargetHover && (
                    <div className="absolute inset-0 bg-emerald-400/35 border-2 border-emerald-500 pointer-events-none z-20 animate-pulse" />
                  )}

                  {/* Selected Guide Pulse */}
                  {isSelectedTarget && isUnplaced && !isTargetHover && (
                    <div className="absolute inset-0 bg-[#D4AF37]/35 border-2 border-[#D4AF37] pointer-events-none z-20 animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── State Indicator / Micro Instructions ─── */}
      <div className="mt-3 text-center min-h-[22px]">
        {isCompleted ? (
          <p className="text-xs font-display font-bold text-[#713f2c] flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Batik Utuh Sempurna! Motif menyatu tanpa sekat.
          </p>
        ) : (
          <p className="text-[11px] sm:text-xs text-[#8d786a] font-body flex items-center justify-center gap-1.5">
            <Hand className="w-3.5 h-3.5 text-[#713f2c]" />
            <span>
              <strong>Seret cap</strong> ke rongga sketsa kain, atau klik keping lalu klik rongga.
            </span>
          </p>
        )}
      </div>

      {/* ─── Piece Tray or Completion Action ─── */}
      <div className="w-full mt-3 pt-3 border-t border-[#713f2c]/10">
        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div
              key="tray"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#F3EFE8] rounded-2xl p-3 border border-[#E8E1D7] flex items-center justify-center gap-3 sm:gap-4 flex-wrap min-h-[72px]"
            >
              {unplacedPieces.map((p) => {
                const isSelected = selectedPiece === p.id;
                const isDragging = dragState?.pieceId === p.id;

                return (
                  <div
                    key={p.id}
                    onPointerDown={(e) => handlePiecePointerDown(e, p.id)}
                    onClick={() =>
                      setSelectedPiece((prev) => (prev === p.id ? null : p.id))
                    }
                    className={`p-2 rounded-xl border transition-all cursor-grab active:cursor-grabbing flex items-center justify-center touch-none ${
                      isSelected
                        ? "bg-white border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.4)] scale-105"
                        : "bg-white border-[#E0D8CE] hover:border-[#D4AF37]/80 hover:shadow-md hover:bg-[#FFFDFB]"
                    } ${isDragging ? "opacity-25" : "opacity-100"}`}
                  >
                    {/* Visual Shape Polyomino Grid with Explicit Dimensions */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${p.width}, ${trayCellSize}px)`,
                        gridTemplateRows: `repeat(${p.height}, ${trayCellSize}px)`,
                        width: p.width * trayCellSize,
                        height: p.height * trayCellSize,
                      }}
                    >
                      {Array.from({ length: p.width * p.height }, (_, idx) => {
                        const lx = idx % p.width;
                        const ly = Math.floor(idx / p.width);
                        const isCell = p.localCells.some(
                          (c) => c.x === lx && c.y === ly
                        );
                        if (!isCell) return <div key={idx} className="pointer-events-none" />;

                        const ox = p.minX + lx;
                        const oy = p.minY + ly;
                        const bgX = `${(ox / (GRID_SIZE - 1)) * 100}%`;
                        const bgY = `${(oy / (GRID_SIZE - 1)) * 100}%`;

                        return (
                          <div
                            key={idx}
                            className="rounded-[3px] overflow-hidden"
                            style={{
                              width: `${trayCellSize}px`,
                              height: `${trayCellSize}px`,
                              backgroundImage: `url(${BATIK_IMAGE})`,
                              backgroundSize: "600% 600%",
                              backgroundPosition: `${bgX} ${bgY}`,
                              border: isSelected
                                ? "1.5px solid #D4AF37"
                                : "1px solid rgba(197, 154, 63, 0.7)",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="success-actions"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full pt-1"
            >
              <Link
                href="/play"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#713f2c] hover:bg-[#583122] text-[#D4AF37] text-xs font-display font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <span>Mainkan Versi Penuh di Arcade</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={resetDemo}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-white hover:bg-[#FAF8F5] text-[#713f2c] text-xs font-display font-semibold px-3.5 py-2.5 rounded-xl border border-[#d3ccc2] shadow-sm transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#713f2c]" />
                <span>Coba Lagi</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Render Drag Ghost Portal */}
      {renderDragGhost()}
    </div>
  );
}
