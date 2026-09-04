"use client";

import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, Sparkles, Eye, Grid } from "lucide-react";

const GRID_SIZE = 6;

interface Coord { x: number; y: number }

interface PieceDef {
  id: number;
  cells: Coord[]; // cells in 6x6 grid
  minX: number;
  minY: number;
  width: number;
  height: number;
  localCells: Coord[]; // relative to its bounding box
}

function extractPieces(shapeMap: number[][]): PieceDef[] {
  const piecesMap = new Map<number, Coord[]>();
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const pid = shapeMap[y][x];
      if (pid === 0) continue;
      if (!piecesMap.has(pid)) piecesMap.set(pid, []);
      piecesMap.get(pid)!.push({ x, y });
    }
  }

  const defs: PieceDef[] = [];
  piecesMap.forEach((cells, id) => {
    const minX = Math.min(...cells.map(c => c.x));
    const maxX = Math.max(...cells.map(c => c.x));
    const minY = Math.min(...cells.map(c => c.y));
    const maxY = Math.max(...cells.map(c => c.y));
    const width = maxX - minX + 1;
    const height = maxY - minY + 1;

    const localCells = cells.map(c => ({ x: c.x - minX, y: c.y - minY }));

    defs.push({ id, cells, minX, minY, width, height, localCells });
  });

  return defs.sort((a, b) => a.id - b.id);
}

// 1. Kawung: Simetri 4 Kelopak (Geometris & Harmonis)
// Piece 1: Square 2x2 (top-left)
// Piece 2: Horizontal 3x1 bar (top-right)
// Piece 3: T-shape (middle-right)
// Piece 4: L-corner (bottom-left)
const KAWUNG_MAP = [
  [1, 1, 0, 2, 2, 2],
  [1, 1, 0, 0, 0, 0],
  [0, 0, 0, 3, 3, 3],
  [0, 0, 0, 0, 3, 0],
  [4, 0, 0, 0, 0, 0],
  [4, 4, 4, 0, 0, 0],
];

// 2. Parang: Ombak & Bilah Lereng Diagonal
// Piece 1: Vertical 1x3 bar (left slope)
// Piece 2: Z-step shape (top-right)
// Piece 3: 3-block Corner (bottom-right)
// Piece 4: Plus (+) Cross shape (bottom-center)
const PARANG_MAP = [
  [0, 0, 0, 2, 2, 0],
  [0, 1, 0, 0, 2, 2],
  [0, 1, 0, 0, 0, 0],
  [0, 1, 4, 0, 3, 3],
  [0, 4, 4, 4, 0, 3],
  [0, 0, 4, 0, 0, 0],
];

// 3. Megamendung: Liukan Awan Berarak
// Piece 1: 4x1 Long horizontal bar (top sky)
// Piece 2: 2x2 Square cloud block (center-right)
// Piece 3: Inverted T-shape (center-left)
// Piece 4: L-shape tail (bottom)
const MEGAMENDUNG_MAP = [
  [0, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0],
  [3, 3, 3, 0, 2, 2],
  [0, 3, 0, 0, 2, 2],
  [0, 0, 4, 0, 0, 0],
  [0, 0, 4, 4, 4, 0],
];

interface PieceKnowledge {
  name: string;
  anatomy: string;
  hint: string;
  praise: string;
}

interface MotifConfig {
  shapeMap: number[][];
  pieceDefs: PieceDef[];
  cutoutFilter: string;
  defaultIntro: string;
  pieceHints: Record<number, PieceKnowledge>;
}

const MOTIF_CONFIGS: Record<string, MotifConfig> = {
  kawung: {
    shapeMap: KAWUNG_MAP,
    pieceDefs: extractPieces(KAWUNG_MAP),
    cutoutFilter: "grayscale(100%) contrast(230%) brightness(1.0)",
    defaultIntro: "Mari, Ananda, pasang 4 kepingan cap berlainan bentuk ke rongga sketsa hitam-putih (B&W) yang sesuai anatominya.",
    pieceHints: {
      1: {
        name: "Cap Poros Persegi (2x2)",
        anatomy: "rongga bujur sangkar (persegi 2x2) di sudut kiri atas kanvas",
        hint: "Perhatikan bentuk bujur sangkar 2x2 yang berada di sudut kiri atas kain.",
        praise: "Elok sekali, Ananda! Blok poros buah aren di kiri atas kini terkunci mantap.",
      },
      2: {
        name: "Cap Bilah Mendatar (3x1)",
        anatomy: "rongga bilah memanjang mendatar (3 balok) di kanan atas",
        hint: "Cari rongga garis mendatar 3 balok di sisi kanan atas kanvas.",
        praise: "Tepat sekali, Ananda! Garis mendatar kelopak aren kini menyambung anggun.",
      },
      3: {
        name: "Cap T-Roset Pusar Bunga",
        anatomy: "rongga bentuk T pada pusar kelopak di area tengah kanan",
        hint: "Perhatikan rongga bentuk T tegak di area pertemuan kelopak tengah kanan.",
        praise: "Luar biasa! Pusar roset T ini melambangkan kesucian niat dan keteguhan batin.",
      },
      4: {
        name: "Cap Siku Sudut Bawah (L)",
        anatomy: "rongga siku bentuk L di sudut kiri bawah kanvas",
        hint: "Amati lekukan siku huruf L di bagian sudut kiri bawah.",
        praise: "Sempurna! Garis siku dasar kawung menyatu utuh tanpa cela.",
      },
    },
  },
  parang: {
    shapeMap: PARANG_MAP,
    pieceDefs: extractPieces(PARANG_MAP),
    cutoutFilter: "grayscale(100%) contrast(250%) brightness(1.02)",
    defaultIntro: "Mari, Ananda, pasang kepingan cap ke rongga sketsa hitam-putih kontras tinggi. Amati ragam bentuknya: bilah tegak, Z, siku, hingga bintang silang.",
    pieceHints: {
      1: {
        name: "Cap Bilah Tegak (1x3)",
        anatomy: "rongga bilah memanjang tegak lurus (3 blok) di lereng kiri",
        hint: "Amati bilah garis tegak 3 blok di sisi kiri lereng parang.",
        praise: "Mantap, Ananda! Bilah pedang parang kiri tertancap kokoh pantang menyerah.",
      },
      2: {
        name: "Cap Gelombang Bertingkat (Z)",
        anatomy: "rongga gelombang bertingkat (Z) di lereng kanan atas",
        hint: "Perhatikan pola patahan ombak bertingkat (Z) di sebelah kanan atas.",
        praise: "Bagus sekali! Lereng miring parang ini melambangkan kesiapsiagaan kesatria.",
      },
      3: {
        name: "Cap Sudut Tajuk Pedang",
        anatomy: "rongga sudut siku 3 balok di lereng kanan bawah",
        hint: "Lihat rongga siku kecil di bagian lereng kanan bawah kanvas.",
        praise: "Tepat sasaran! Ujung bilah tajam kini menyatu dengan tebing karang.",
      },
      4: {
        name: "Cap Bintang Poros Mlinjon (+)",
        anatomy: "rongga bentuk silang (+) pada poros mlinjon di tengah bawah",
        hint: "Ini lekukan bintang tanda tambah (+) di pusar belah ketupat tengah bawah.",
        praise: "Sempurna! Poros mlinjon melambangkan keseimbangan cipta, rasa, dan karsa.",
      },
    },
  },
  megamendung: {
    shapeMap: MEGAMENDUNG_MAP,
    pieceDefs: extractPieces(MEGAMENDUNG_MAP),
    cutoutFilter: "grayscale(100%) contrast(280%) brightness(1.05)",
    defaultIntro: "Mari, Ananda, pasang cap awan bergradasi ke rongga sketsa awan hitam-putih yang tepat bentuk liukannya.",
    pieceHints: {
      1: {
        name: "Cap Garis Awan Panjang (4x1)",
        anatomy: "rongga bilah horizontal memanjang (4 balok) di puncak langit atas",
        hint: "Perhatikan garis mendatar panjang 4 balok yang membentang di puncak langit atas.",
        praise: "Indah sekali, Ananda! Garis mega pembawa berkah mulai menaungi bumi.",
      },
      2: {
        name: "Cap Gumpalan Inti Awan (2x2)",
        anatomy: "rongga kotak persegi 2x2 pada gumpalan awan kanan tengah",
        hint: "Fokus pada gumpalan kotak bujur sangkar di sisi kanan tengah.",
        praise: "Tepat sasaran! Puncak gumpalan megamendung berarak anggun dan berwibawa.",
      },
      3: {
        name: "Cap Pusaran Payung Awan (T)",
        anatomy: "rongga bentuk T terbalik di pusaran awan kiri tengah",
        hint: "Cari liukan pusaran awan bentuk T terbalik di sisi kiri tengah.",
        praise: "Pusaran payung awan terpasang! Melambangkan ketenangan jiwa di tengah gejolak dunia.",
      },
      4: {
        name: "Cap Ekor Melengkung (L)",
        anatomy: "rongga bentuk L pada ekor awan melandai di dasar kanvas",
        hint: "Lihat ekor awan pesisir bentuk L yang melandai di bagian bawah kanvas.",
        praise: "Sempurna! Seluruh hamparan awan penyejuk jiwa kini telah terhubung utuh.",
      },
    },
  },
};

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

// Generous magnetic snap calculation with physical attraction pull
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
    ...def.cells.map(c => Math.hypot(c.x + 0.5 - cursorGridX, c.y + 0.5 - cursorGridY))
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

  // Generous magnetic snap threshold:
  // - Center distance <= 2.2 cells OR
  // - Shift distance <= 2.0 cells OR
  // - Cursor is within 2.0 cells of ANY target cell
  const isMagnetized = centerHypot <= 2.2 || shiftHypot <= 2.0 || minCursorDist <= 2.0;

  // Physical magnetic attraction pull: smoothly draws the floating piece towards the socket
  const pullFactor = isMagnetized ? Math.max(0.3, 1 - centerHypot / 2.5) * 0.55 : 0;
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
  gridSize?: number;
  onSolve: (timeSeconds: number) => void;
}

export function CapStampingBoard({ 
  image, 
  philosophy, 
  motifId,
  onSolve 
}: CapStampingBoardProps) {
  const resolvedMotifKey = motifId 
    ? motifId 
    : image.includes("parang") 
      ? "parang" 
      : image.includes("mega") 
        ? "megamendung" 
        : "kawung";

  const motifData = MOTIF_CONFIGS[resolvedMotifKey] || MOTIF_CONFIGS.kawung;
  const currentShapeMap = motifData.shapeMap;
  const currentPieceDefs = motifData.pieceDefs;

  const [tray, setTray] = useState<number[]>([]);
  const [placed, setPlaced] = useState<number[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [draggingPiece, setDraggingPiece] = useState<DraggingPieceState | null>(null);
  const [wrongSlot, setWrongSlot] = useState<Coord | null>(null);
  const [guidePiece, setGuidePiece] = useState<number | null>(null);
  const [justPlacedPiece, setJustPlacedPiece] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  const [showGridOverlay, setShowGridOverlay] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: "perfect" | "near_miss" | "wrong_area" | "idle" }>({
    message: motifData.defaultIntro,
    type: "idle",
  });
  
  const boardRef = useRef<HTMLDivElement>(null);
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    const shuffled = currentPieceDefs.map(p => p.id).sort(() => Math.random() - 0.5);
    setTray(shuffled);
    setPlaced([]);
    setSelectedPiece(null);
    setDraggingPiece(null);
    setGuidePiece(null);
    setJustPlacedPiece(null);
    setShowGridOverlay(false);
    startTime.current = Date.now();
    setSolved(false);
    setFeedback({
      message: motifData.defaultIntro,
      type: "idle",
    });
  }, [image, motifData.defaultIntro, currentPieceDefs]);

  useEffect(() => {
    if (placed.length === currentPieceDefs.length && !solved && placed.length > 0) {
      setSolved(true);
      setShowGridOverlay(false);
      setFeedback({
        message: `Luar biasa, Ananda! Seluruh rongga cap telah terisi penuh dan menyatu sempurna (*seamless*). Tahukah kamu? ${philosophy}`,
        type: "perfect",
      });
      const elapsed = Math.round((Date.now() - startTime.current) / 1000);
      setTimeout(() => onSolve(elapsed), 2500);
    }
  }, [placed, solved, onSolve, philosophy, currentPieceDefs.length]);

  // Execute placement check with generous magnetic sensitivity
  const attemptPlace = useCallback((pieceId: number, dropX: number, dropY: number, forceSuccess = false) => {
    const def = currentPieceDefs.find(p => p.id === pieceId);
    if (!def) return;

    const pieceInfo = motifData.pieceHints[pieceId];

    // Direct hit or magnetic proximity match
    const isDirectMatch = forceSuccess || def.cells.some(c => c.x === dropX && c.y === dropY);

    if (isDirectMatch) {
      setTray(prev => prev.filter(id => id !== pieceId));
      setPlaced(prev => [...prev, pieceId]);
      setSelectedPiece(null);
      setGuidePiece(null);
      setJustPlacedPiece(pieceId);
      setTimeout(() => setJustPlacedPiece(null), 1000);

      setFeedback({
        message: pieceInfo ? pieceInfo.praise : "Sempurna, Ananda! Capnya merekat kuat pada kain mori.",
        type: "perfect",
      });
    } else {
      const minDistance = Math.min(
        ...def.cells.map(c => Math.max(Math.abs(c.x - dropX), Math.abs(c.y - dropY)))
      );

      // If clicked very close to the target (within 2 cells distance), snap it directly for great responsiveness!
      if (minDistance <= 2) {
        setTray(prev => prev.filter(id => id !== pieceId));
        setPlaced(prev => [...prev, pieceId]);
        setSelectedPiece(null);
        setGuidePiece(null);
        setJustPlacedPiece(pieceId);
        setTimeout(() => setJustPlacedPiece(null), 1000);

        setFeedback({
          message: pieceInfo ? pieceInfo.praise : "Sempurna, Ananda! Capnya merekat kuat pada kain mori.",
          type: "perfect",
        });
        return;
      }

      setWrongSlot({ x: dropX, y: dropY });
      setTimeout(() => setWrongSlot(null), 700);

      setGuidePiece(pieceId);
      setTimeout(() => setGuidePiece(null), 2500);

      const guidance = pieceInfo ? `Cap ini diperuntukkan bagi ${pieceInfo.anatomy}.` : "Cari rongga sketsa hitam-putih (B&W) yang sesuai dengan bentuk cap ini.";
      setFeedback({
        message: `Wah, sepertinya masih salah letak, Ananda. ${guidance} Cocokkan dengan rongga yang berpendar.`,
        type: "wrong_area",
      });
    }
  }, [motifData, currentPieceDefs]);

  // Handle pointer down on a tray piece to initiate custom shape drag
  const handlePiecePointerDown = useCallback((e: React.PointerEvent, pieceId: number) => {
    if (e.button !== 0) return;
    e.preventDefault();

    const def = currentPieceDefs.find(p => p.id === pieceId);
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
  }, [currentPieceDefs]);

  // Global pointer move and pointer up listeners during active drag
  useEffect(() => {
    if (!draggingPiece) return;

    const handlePointerMove = (e: PointerEvent) => {
      setDraggingPiece(prev => prev ? {
        ...prev,
        currentX: e.clientX,
        currentY: e.clientY,
      } : null);
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!draggingPiece) return;

      const dist = Math.hypot(e.clientX - draggingPiece.startX, e.clientY - draggingPiece.startY);
      
      // If dragged more than 4px, evaluate drop with high-sensitivity magnetic snap
      if (dist > 4 && boardRef.current) {
        const boardRect = boardRef.current.getBoundingClientRect();
        const def = currentPieceDefs.find(p => p.id === draggingPiece.id);

        if (def) {
          const snap = checkMagneticSnap(def, e.clientX, e.clientY, boardRect);

          if (snap.isMagnetized) {
            // High-sensitivity magnetic snap success!
            attemptPlace(draggingPiece.id, def.cells[0].x, def.cells[0].y, true);
          } else {
            // Check if dropped within board bounds
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

  // Click on a cell on the board
  const handleCellClick = useCallback((x: number, y: number) => {
    const pid = currentShapeMap[y][x];

    if (pid === 0 || placed.includes(pid)) {
      if (selectedPiece !== null) {
        attemptPlace(selectedPiece, x, y);
      } else {
        setFeedback({
          message: "Bagian kain ini sudah berwarna penuh, Ananda. Silakan pilih keping cap di bawah dan pasang ke rongga pola gelap.",
          type: "idle",
        });
      }
      return;
    }

    if (selectedPiece !== null) {
      attemptPlace(selectedPiece, x, y);
    } else {
      setSelectedPiece(pid);
      setFeedback({
        message: `Rongga ini membutuhkan keping cap yang pas. Pilih kepingan cap di wadah bawah, lalu klik di sini.`,
        type: "idle",
      });
    }
  }, [selectedPiece, placed, attemptPlace, currentShapeMap]);

  // Calculate if the dragged piece is currently hovering near its matching target (magnetic lock-on & pull)
  const magneticInfo = useMemo(() => {
    if (!draggingPiece || !boardRef.current) return { isMagnetized: false, pullX: 0, pullY: 0 };
    const def = currentPieceDefs.find(p => p.id === draggingPiece.id);
    if (!def) return { isMagnetized: false, pullX: 0, pullY: 0 };
    const boardRect = boardRef.current.getBoundingClientRect();
    return checkMagneticSnap(def, draggingPiece.currentX, draggingPiece.currentY, boardRect);
  }, [draggingPiece, currentPieceDefs]);

  const isMagnetized = magneticInfo.isMagnetized;

  return (
    <div className="flex flex-col gap-6">
      {/* Persona Feedback Area (Budayawan Nusantara) */}
      <motion.div 
        key={feedback.message}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-start gap-4 p-4 rounded-xl border shadow-md transition-colors ${
          feedback.type === "perfect" ? "bg-[#10B981]/15 border-[#10B981]/40" :
          feedback.type === "near_miss" ? "bg-[#F59E0B]/15 border-[#F59E0B]/40" :
          feedback.type === "wrong_area" ? "bg-[#EF4444]/15 border-[#EF4444]/40" :
          "bg-[#D4AF37]/15 border-[#D4AF37]/40"
        }`}
      >
        <div className="shrink-0 w-11 h-11 rounded-full bg-[#1A1614] border-2 border-[#D4AF37] flex items-center justify-center overflow-hidden shadow-inner">
          <MessageCircle className="w-5 h-5 text-[#D4AF37]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-display font-bold text-[#D4AF37] tracking-wider uppercase">Budayawan Nusantara</span>
            {feedback.type === "perfect" && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <Sparkles className="w-3 h-3" /> Presisi Sempurna
              </span>
            )}
          </div>
          <p className="text-sm font-body text-white/95 leading-relaxed">{feedback.message}</p>
        </div>
      </motion.div>

      {/* Progress & Mode Bar */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-xs text-white/70">
          <span className="font-display font-semibold text-[#D4AF37]">Proses Cap:</span>
          <span>{placed.length} dari {currentPieceDefs.length} Rongga Sketsa Terisi</span>
        </div>

        {solved && (
          <button
            onClick={() => setShowGridOverlay(prev => !prev)}
            className="flex items-center gap-1.5 text-xs font-display font-semibold text-[#D4AF37] hover:text-[#e5c358] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 px-3 py-1.5 rounded-lg transition-all"
          >
            {showGridOverlay ? <Eye className="w-3.5 h-3.5" /> : <Grid className="w-3.5 h-3.5" />}
            {showGridOverlay ? "Tampilkan Kain Utuh" : "Tampilkan Garis Sambungan"}
          </button>
        )}
      </div>

      {/* Main Cap Stamping Canvas (Seamless Pattern with Recessed B&W Cutouts) */}
      <div className="relative w-full max-w-[460px] mx-auto select-none">
        {/* Outer Frame with Gold Trim */}
        <div className={`relative w-full aspect-square rounded-2xl overflow-hidden border-2 shadow-[0_12px_40px_rgba(0,0,0,0.6)] bg-[#1A1614] transition-all ${
          isMagnetized ? "border-[#10B981] shadow-[0_0_30px_rgba(16,185,129,0.4)]" : "border-[#D4AF37]/60"
        }`}>
          {/* Layer 1: Unified Completed Masterpiece Fabric when Solved */}
          {solved && !showGridOverlay ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0 overflow-hidden"
            >
              {/* Pristine high-resolution full batik fabric */}
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
              />
              {/* Golden sweep light beam */}
              <motion.div 
                initial={{ x: "-120%" }}
                animate={{ x: "220%" }}
                transition={{ duration: 1.6, ease: "easeInOut", repeat: 1, repeatDelay: 1.2 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/35 to-transparent skew-x-12 pointer-events-none"
              />
              {/* Soft ambient vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

              {/* Bottom celebration pill */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#1A1614]/90 backdrop-blur-md border border-[#D4AF37]/60 rounded-xl p-3 text-center shadow-2xl">
                <p className="text-xs font-display font-bold text-[#D4AF37] flex items-center justify-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> Mahakarya Batik Utuh Sempurna
                </p>
                <p className="text-[11px] text-white/85 font-body">
                  Seluruh kepingan cap telah menyatu tanpa sekat. Kain mori kini bermotif anggun dan harmonis.
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
                const cutoutBorderClasses = isUnplacedCutout ? getCutoutBorderClasses(x, y, pid, currentShapeMap) : "";

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
                            ? { backgroundColor: ["rgba(212, 175, 55, 0.15)", "rgba(212, 175, 55, 0.5)", "rgba(212, 175, 55, 0.15)"] }
                            : {}
                    }
                    transition={
                      isGuided 
                        ? { repeat: 3, duration: 0.6 } 
                        : { duration: 0.2 }
                    }
                    onClick={() => handleCellClick(x, y)}
                    className={`relative cursor-pointer transition-all overflow-hidden ${
                      isUnplacedCutout 
                        ? `bg-[#FAF8F5] shadow-[inset_0_2px_8px_rgba(0,0,0,0.18)] ${cutoutBorderClasses}` 
                        : ""
                    } ${isTargetMagnetized ? "ring-2 ring-emerald-400 z-10" : ""}`}
                  >
                    {/* 1. Base Colored Fabric */}
                    {(!isPieceCell || isPlaced) && (
                      <motion.div
                        initial={isJustPlaced ? { opacity: 0, scale: 1.06, filter: "brightness(1.5)" } : false}
                        animate={{ opacity: 1, scale: 1, filter: "brightness(1)" }}
                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          backgroundImage: `url(${image})`,
                          backgroundSize: "600% 600%",
                          backgroundPosition: `${bgPosX} ${bgPosY}`,
                        }}
                      >
                        {isJustPlaced && (
                          <motion.div 
                            initial={{ opacity: 0.8 }}
                            animate={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="absolute inset-0 bg-[#D4AF37]/40"
                          />
                        )}
                      </motion.div>
                    )}

                    {/* 2. Unplaced Puzzle Cutout: High-Intensity B&W Grayscale Blueprint */}
                    {isUnplacedCutout && (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden bg-[#FAF8F5]">
                        <div 
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            backgroundImage: `url(${image})`,
                            backgroundSize: "600% 600%",
                            backgroundPosition: `${bgPosX} ${bgPosY}`,
                            filter: motifData.cutoutFilter,
                          }}
                        />
                      </div>
                    )}

                    {/* 3. Magnetic Hover Aura (Responsive Live Feedback) */}
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
        <p className="text-xs text-white/60 font-body">
          Tarik kepingan cap ke arah rongga sketsa hitam-putih hingga <span className="text-emerald-400 font-semibold">berpendar hijau</span>, lalu lepaskan untuk mencap kain.
        </p>
      </div>

      {/* Piece Tray (Wadah Kepingan Cap Penuh Warna dengan Bentuk Unik & Bervariasi) */}
      <div className="flex flex-wrap justify-center items-center gap-6 min-h-[150px] bg-[#1A1614]/80 rounded-2xl p-6 border border-white/10 shadow-2xl max-w-2xl mx-auto w-full">
        <AnimatePresence>
          {tray.map(pieceId => {
            const def = currentPieceDefs.find(p => p.id === pieceId)!;
            if (!def) return null;
            const isSelected = selectedPiece === pieceId;
            const isBeingDragged = draggingPiece?.id === pieceId;
            const cellSize = 28; // 28px per cell in tray

            return (
              <motion.div
                key={pieceId}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: isBeingDragged ? 0.3 : 1, 
                  y: 0, 
                  scale: isSelected && !isBeingDragged ? 1.08 : 1,
                  boxShadow: isSelected && !isBeingDragged ? "0 0 20px rgba(212,175,55,0.75)" : "0 4px 12px rgba(0,0,0,0.5)"
                }}
                exit={{ opacity: 0, scale: 0.4 }}
                onPointerDown={(e) => handlePiecePointerDown(e, pieceId)}
                onClick={() => setSelectedPiece(prev => prev === pieceId ? null : pieceId)}
                className={`flex items-center justify-center p-3.5 rounded-xl border transition-all cursor-grab active:cursor-grabbing select-none touch-none ${
                  isSelected 
                    ? "bg-[#D4AF37]/20 border-[#D4AF37]" 
                    : "bg-[#25201C] border-white/15 hover:border-[#D4AF37]/50 hover:bg-[#2b2520]"
                }`}
              >
                {/* Render the unique polyomino block in tray */}
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
                      const isCellActive = def.localCells.some(c => c.x === lx && c.y === ly);
                      
                      if (!isCellActive) return <div key={i} className="pointer-events-none" />;

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
                            border: isSelected ? "1.5px solid #D4AF37" : "1px solid rgba(212,175,55,0.4)",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {tray.length === 0 && !solved && (
          <p className="text-[#D4AF37] text-sm font-display font-semibold">Semua cap motif sudah tertempel sempurna!</p>
        )}
      </div>

      {/* Floating Dragged Polyomino Piece (1:1 Board Scale, Clean Transparent Shape with Magnetic Lock & Pull) */}
      {draggingPiece && (() => {
        const def = currentPieceDefs.find(p => p.id === draggingPiece.id);
        if (!def) return null;

        const boardRect = boardRef.current?.getBoundingClientRect();
        const boardCellSize = boardRect ? boardRect.width / GRID_SIZE : 72;

        return (
          <div
            className={`fixed pointer-events-none z-50 select-none transition-transform duration-75 ${
              isMagnetized ? "scale-105 drop-shadow-[0_16px_32px_rgba(16,185,129,0.7)]" : "drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)]"
            }`}
            style={{
              left: isMagnetized ? magneticInfo.pullX : draggingPiece.currentX - draggingPiece.offsetX,
              top: isMagnetized ? magneticInfo.pullY : draggingPiece.currentY - draggingPiece.offsetY,
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
                const isCellActive = def.localCells.some(c => c.x === lx && c.y === ly);
                
                if (!isCellActive) return <div key={i} className="pointer-events-none bg-transparent" />;

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
