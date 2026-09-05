"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Paintbrush, RotateCcw, Download, Layers, Trophy, Droplets, ChevronRight, PenTool, Palette, Info } from "lucide-react";
import { GameNavbar } from "@/components/shared/GameNavbar";
import { useXp } from "@/hooks/useXp";

// ── Palette ───────────────────────────────────────────────────────────────────
const DYE_COLORS = [
  { id: "sogan",    label: "Sogan",   hex: "#713F2C", desc: "Cokelat kemerahan khas Jawa (Royal Sogan)" },
  { id: "indigo",   label: "Indigo",  hex: "#1E3A8A", desc: "Biru gelap pesisiran (Indigofera)" },
  { id: "merah",    label: "Merah",   hex: "#B91C1C", desc: "Merah bata tradisional" },
  { id: "hitam",    label: "Hitam",   hex: "#1A1614", desc: "Hitam pekat canting" },
  { id: "kuning",   label: "Sogan Kuning", hex: "#D4AF37", desc: "Kuning keemasan (Heritage Gold)" },
];

// Simple outline patterns (SVG path data per pola)
interface OutlinePattern {
  id: string;
  name: string;
  paths: string[];
}

const OUTLINE_PATTERNS: OutlinePattern[] = [
  {
    id: "kawung",
    name: "Kawung Sederhana",
    paths: [
      "M 100 80 C 100 60, 80 50, 80 80 C 80 110, 100 120, 100 100 C 100 120, 120 110, 120 80 C 120 50, 100 60, 100 80 Z",
      "M 200 80 C 200 60, 180 50, 180 80 C 180 110, 200 120, 200 100 C 200 120, 220 110, 220 80 C 220 50, 200 60, 200 80 Z",
      "M 100 180 C 100 160, 80 150, 80 180 C 80 210, 100 220, 100 200 C 100 220, 120 210, 120 180 C 120 150, 100 160, 100 180 Z",
      "M 200 180 C 200 160, 180 150, 180 180 C 180 210, 200 220, 200 200 C 200 220, 220 210, 220 180 C 220 150, 200 160, 200 180 Z",
    ],
  },
  {
    id: "parang",
    name: "Parang Sederhana",
    paths: [
      "M 60 20 Q 90 50, 60 80 Q 30 110, 60 140 Q 90 170, 60 200 Q 30 230, 60 260",
      "M 120 20 Q 150 50, 120 80 Q 90 110, 120 140 Q 150 170, 120 200 Q 90 230, 120 260",
      "M 180 20 Q 210 50, 180 80 Q 150 110, 180 140 Q 210 170, 180 200 Q 150 230, 180 260",
    ],
  },
  {
    id: "mega",
    name: "Mega Mendung Sederhana",
    paths: [
      "M 40 120 Q 60 90, 80 100 Q 100 70, 130 85 Q 150 65, 170 80 Q 190 60, 220 75 Q 240 90, 260 80 Q 260 120, 240 130 Q 220 140, 200 130 Q 180 145, 160 135 Q 140 150, 120 140 Q 100 155, 80 145 Q 60 135, 40 120 Z",
      "M 50 200 Q 80 175, 110 185 Q 140 165, 170 178 Q 200 162, 230 175 Q 230 215, 210 225 Q 190 235, 170 225 Q 150 238, 130 228 Q 110 240, 90 230 Q 70 218, 50 200 Z",
    ],
  },
];

// ── Canvas drawing helpers ────────────────────────────────────────────────────
const CANVAS_W = 300;
const CANVAS_H = 300;

export default function CantingPage() {
  const { addXp } = useXp();
  const [gameState, setGameState] = useState<"idle" | "drawing" | "dyeing" | "done">("idle");
  const [selectedPattern, setSelectedPattern] = useState<OutlinePattern | null>(null);
  const [selectedColor, setSelectedColor] = useState(DYE_COLORS[0]);
  const [layerCount, setLayerCount] = useState(0);
  const [completedLayers, setCompletedLayers] = useState<Array<{ color: string; maskData: ImageData | null }>>([]);
  const [earnedXp, setEarnedXp] = useState(0);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Canvas refs
  const maskCanvasRef   = useRef<HTMLCanvasElement>(null); // malam strokes (white = drawn)
  const colorCanvasRef  = useRef<HTMLCanvasElement>(null); // dye color layer
  const displayCanvasRef = useRef<HTMLCanvasElement>(null); // composite output

  const isDrawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  // Draw outline pattern on mask canvas
  const drawOutline = useCallback(() => {
    if (!maskCanvasRef.current || !selectedPattern) return;
    const ctx = maskCanvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.strokeStyle = "rgba(100,100,100,0.3)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    selectedPattern.paths.forEach((pathStr) => {
      const path = new Path2D(pathStr);
      ctx.stroke(path);
    });
    ctx.setLineDash([]);
  }, [selectedPattern]);

  const compositeDisplay = useCallback(() => {
    if (!displayCanvasRef.current || !colorCanvasRef.current || !maskCanvasRef.current) return;
    const dCtx = displayCanvasRef.current.getContext("2d");
    const cCtx = colorCanvasRef.current.getContext("2d");
    if (!dCtx || !cCtx) return;

    // Start with natural mori fabric color
    dCtx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    dCtx.fillStyle = "#FAF3E0";
    dCtx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Draw each completed layer
    for (const layer of completedLayers) {
      if (!layer.maskData) continue;
      // Create temp canvas for this layer
      const tmp = document.createElement("canvas");
      tmp.width = CANVAS_W; tmp.height = CANVAS_H;
      const tCtx = tmp.getContext("2d");
      if (!tCtx) continue;

      // Fill with dye color
      tCtx.fillStyle = layer.color;
      tCtx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Use mask to punch out waxed areas
      tCtx.globalCompositeOperation = "destination-out";
      tCtx.putImageData(layer.maskData, 0, 0);
      tCtx.globalCompositeOperation = "source-over";

      dCtx.drawImage(tmp, 0, 0);
    }

    // Draw current mask strokes as dark wax lines on top
    dCtx.drawImage(maskCanvasRef.current, 0, 0);

    // Draw current color layer preview
    dCtx.drawImage(colorCanvasRef.current, 0, 0);
  }, [completedLayers]);

  useEffect(() => { compositeDisplay(); }, [compositeDisplay, completedLayers]);

  const startDrawing = (pattern: OutlinePattern) => {
    setSelectedPattern(pattern);
    setLayerCount(0);
    setCompletedLayers([]);
    setHasDrawn(false);
    setEarnedXp(0);
    setGameState("drawing");

    // Clear canvases next tick
    setTimeout(() => {
      [maskCanvasRef, colorCanvasRef, displayCanvasRef].forEach((ref) => {
        if (!ref.current) return;
        const ctx = ref.current.getContext("2d");
        ctx?.clearRect(0, 0, CANVAS_W, CANVAS_H);
      });
      // Draw outline
      if (maskCanvasRef.current) {
        const ctx = maskCanvasRef.current.getContext("2d");
        if (ctx) {
          ctx.strokeStyle = "rgba(100,100,100,0.3)";
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          pattern.paths.forEach((pathStr) => {
            ctx.stroke(new Path2D(pathStr));
          });
          ctx.setLineDash([]);
        }
      }
      // Fill display with mori
      if (displayCanvasRef.current) {
        const ctx = displayCanvasRef.current.getContext("2d");
        if (ctx) { ctx.fillStyle = "#FAF3E0"; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H); }
      }
    }, 50);
  };

  const getPos = (e: React.PointerEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    const clientX = "touches" in e ? e.touches[0].clientX : (e as React.PointerEvent).clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : (e as React.PointerEvent).clientY;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  };

  const startStroke = (e: React.PointerEvent) => {
    if (gameState !== "drawing") return;
    isDrawing.current = true;
    const pos = getPos(e, maskCanvasRef.current!);
    lastPoint.current = pos;
    setHasDrawn(true);
  };

  const continueStroke = (e: React.PointerEvent) => {
    if (!isDrawing.current || !maskCanvasRef.current || gameState !== "drawing") return;
    const ctx = maskCanvasRef.current.getContext("2d");
    if (!ctx || !lastPoint.current) return;

    const pos = getPos(e, maskCanvasRef.current);
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPoint.current = pos;

    compositeDisplay();
  };

  const endStroke = () => { isDrawing.current = false; lastPoint.current = null; };

  const applyDye = () => {
    if (!maskCanvasRef.current || !colorCanvasRef.current) return;
    const maskCtx = maskCanvasRef.current.getContext("2d");
    const colorCtx = colorCanvasRef.current.getContext("2d");
    if (!maskCtx || !colorCtx) return;

    // Create mask from current canting strokes (white = resist)
    const maskData = maskCtx.getImageData(0, 0, CANVAS_W, CANVAS_H);

    // Invert: strokes become white resist, rest becomes transparent
    const resistData = maskCtx.createImageData(CANVAS_W, CANVAS_H);
    for (let i = 0; i < maskData.data.length; i += 4) {
      const brightness = (maskData.data[i] + maskData.data[i + 1] + maskData.data[i + 2]) / 3;
      const isWax = brightness < 128; // dark pixel = waxed area
      resistData.data[i] = 255;
      resistData.data[i + 1] = 255;
      resistData.data[i + 2] = 255;
      resistData.data[i + 3] = isWax ? 255 : 0;
    }

    const xp = layerCount === 0 ? 60 : 20;
    setEarnedXp((prev) => prev + xp);
    addXp(xp);

    setCompletedLayers((prev) => [...prev, { color: selectedColor.hex, maskData: resistData }]);
    setLayerCount((prev) => prev + 1);

    // Clear mask canvas (keep outline only)
    maskCtx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    colorCtx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    setHasDrawn(false);

    if (layerCount >= 2) {
      setGameState("done");
    } else {
      setGameState("drawing");
      // Redraw outline
      setTimeout(() => {
        if (maskCanvasRef.current && selectedPattern) {
          const ctx = maskCanvasRef.current.getContext("2d");
          if (ctx) {
            ctx.strokeStyle = "rgba(100,100,100,0.3)";
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            selectedPattern.paths.forEach((p) => ctx.stroke(new Path2D(p)));
            ctx.setLineDash([]);
          }
        }
      }, 50);
    }
    compositeDisplay();
  };

  const downloadResult = () => {
    if (!displayCanvasRef.current) return;
    const link = document.createElement("a");
    link.download = "batik-canting-karyaku.png";
    link.href = displayCanvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#1A1614] text-white">
      <GameNavbar title="Simulasi Membatik Canting" />

      <main className="pt-14 min-h-screen">
        <AnimatePresence mode="wait">
          {/* ── IDLE ── */}
          {gameState === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto px-4 py-12 flex flex-col items-center gap-8"
            >
              <div className="w-20 h-20 rounded-full bg-[#713F2C]/15 border border-[#713F2C]/30 flex items-center justify-center">
                <Paintbrush className="w-10 h-10 text-[#D4AF37]" />
              </div>
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-[#713F2C]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-display font-bold px-4 py-1.5 rounded-full mb-4">
                  <Paintbrush className="w-3.5 h-3.5" /> SIMULASI MEMBATIK CANTING
                </div>
                <h1 className="font-display font-extrabold text-3xl md:text-4xl mb-3">
                  Torehkan Malam,<br /><span className="text-[#D4AF37]">Celupkan Warna</span>
                </h1>
                <p className="text-white/60 font-body max-w-md mx-auto text-sm">
                  Simulasikan proses batik wax-resist yang sesungguhnya. Gambarkan garis malam (canting) 
                  sebagai resist, lalu celupkan kain ke pewarna. Area yang dilapisi malam akan tetap berwarna dasar kain!
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 w-full max-w-md">
                {[
                  { step: "1", label: "Torehkan Malam", desc: "Gambar garis dengan canting virtual", icon: PenTool },
                  { step: "2", label: "Celupkan Warna", desc: "Pilih warna tradisional, terapkan ke kain", icon: Palette },
                  { step: "3", label: "Simpan Karya", desc: "Unduh hasil karya batik digitalmu", icon: Download },
                ].map((s) => (
                  <div key={s.step} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center flex flex-col items-center">
                    <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center mb-2 text-[#D4AF37]">
                      <s.icon className="w-4 h-4" />
                    </div>
                    <p className="font-display font-bold text-xs text-white mb-1">{s.label}</p>
                    <p className="text-[10px] text-white/40 font-body">{s.desc}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-white/50 font-display font-semibold text-sm text-center mb-4">Pilih Pola Outline</p>
                <div className="grid grid-cols-3 gap-3">
                  {OUTLINE_PATTERNS.map((pattern) => (
                    <motion.button
                      key={pattern.id}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => startDrawing(pattern)}
                      className="bg-[#25201C] border border-white/15 hover:border-[#D4AF37]/60 rounded-xl p-4 text-center transition-all cursor-pointer"
                    >
                      <p className="font-display font-bold text-sm text-white">{pattern.name}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── DRAWING ── */}
          {gameState === "drawing" && selectedPattern && (
            <motion.div
              key="drawing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/50 text-xs font-body">Mode: Menorehkan Malam</p>
                  <h2 className="font-display font-bold text-base text-white">{selectedPattern.name}</h2>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="font-display font-bold text-xs text-white">Lapisan {layerCount + 1}/3</span>
                </div>
              </div>

              {/* Canvas Area */}
              <div className="relative mx-auto rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#FAF3E0]"
                style={{ width: "100%", maxWidth: CANVAS_W, aspectRatio: "1/1" }}>
                {/* Display composite (bottom) */}
                <canvas
                  ref={displayCanvasRef}
                  width={CANVAS_W}
                  height={CANVAS_H}
                  className="absolute inset-0 w-full h-full"
                />
                {/* Color layer */}
                <canvas
                  ref={colorCanvasRef}
                  width={CANVAS_W}
                  height={CANVAS_H}
                  className="absolute inset-0 w-full h-full opacity-0"
                />
                {/* Mask/drawing layer (top, interactive) */}
                <canvas
                  ref={maskCanvasRef}
                  width={CANVAS_W}
                  height={CANVAS_H}
                  className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                  onPointerDown={startStroke}
                  onPointerMove={continueStroke}
                  onPointerUp={endStroke}
                  onPointerLeave={endStroke}
                />
              </div>

              {/* Instructions */}
              <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl px-4 py-3 text-sm text-[#D4AF37] font-body text-center flex items-center justify-center gap-2">
                <Info className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>
                  Gambarkan garis mengikuti pola putus-putus sebagai &quot;malam&quot; (wax resist). 
                  Area yang digambar akan tetap berwarna dasar kain setelah dicelup warna.
                </span>
              </div>

              {/* Reset strokes */}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    if (!maskCanvasRef.current) return;
                    const ctx = maskCanvasRef.current.getContext("2d");
                    if (!ctx) return;
                    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
                    // Redraw outline
                    ctx.strokeStyle = "rgba(100,100,100,0.3)";
                    ctx.lineWidth = 1;
                    ctx.setLineDash([4, 4]);
                    selectedPattern.paths.forEach((p) => ctx.stroke(new Path2D(p)));
                    ctx.setLineDash([]);
                    setHasDrawn(false);
                    compositeDisplay();
                  }}
                  className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Hapus Coretan
                </button>
              </div>

              {/* Proceed to dye */}
              <button
                disabled={!hasDrawn}
                onClick={() => setGameState("dyeing")}
                className={`flex items-center justify-center gap-2 py-3.5 rounded-xl font-display font-bold text-sm transition-all cursor-pointer ${
                  hasDrawn
                    ? "bg-[#D4AF37] text-[#1A1614] hover:bg-[#c9a52f] shadow-lg shadow-[#D4AF37]/20"
                    : "bg-white/10 text-white/30 cursor-not-allowed"
                }`}
              >
                <Droplets className="w-4 h-4" />
                Celupkan ke Pewarna
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* ── DYEING ── */}
          {gameState === "dyeing" && (
            <motion.div
              key="dyeing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6"
            >
              <div className="text-center">
                <p className="text-white/50 text-xs font-body mb-1">Mode: Memilih Warna Celup</p>
                <h2 className="font-display font-bold text-xl text-white">Pilih Warna Pewarna</h2>
                <p className="text-white/50 text-sm font-body mt-1">
                  Warna akan meresap ke seluruh kain kecuali area yang tertutup malam.
                </p>
              </div>

              {/* Color preview + canvas side by side */}
              <div className="flex gap-4 items-start">
                <div className="relative mx-auto rounded-xl overflow-hidden border border-white/15 shrink-0"
                  style={{ width: 160, height: 160 }}>
                  <canvas ref={displayCanvasRef} width={CANVAS_W} height={CANVAS_H}
                    className="absolute inset-0 w-full h-full" />
                  <canvas ref={colorCanvasRef} width={CANVAS_W} height={CANVAS_H}
                    className="absolute inset-0 w-full h-full opacity-0" />
                  <canvas ref={maskCanvasRef} width={CANVAS_W} height={CANVAS_H}
                    className="absolute inset-0 w-full h-full" />
                  {/* Dye preview overlay */}
                  <div className="absolute inset-0 rounded-xl" style={{ backgroundColor: selectedColor.hex, opacity: 0.4, mixBlendMode: "multiply" }} />
                </div>

                <div className="flex-1">
                  <p className="font-body text-sm text-white/60 mb-3">Pilih warna celup tradisional:</p>
                  <div className="flex flex-col gap-2">
                    {DYE_COLORS.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                          selectedColor.id === color.id
                            ? "border-[#D4AF37] bg-[#D4AF37]/15 shadow-sm"
                            : "border-white/10 bg-white/5 hover:border-white/20"
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: color.hex }} />
                        <div>
                          <p className="font-display font-bold text-xs text-white">{color.label}</p>
                          <p className="text-[10px] text-white/40 font-body">{color.desc}</p>
                        </div>
                        {selectedColor.id === color.id && (
                          <div className="ml-auto w-2 h-2 rounded-full bg-[#D4AF37]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={applyDye}
                className="w-full py-3.5 rounded-xl font-display font-extrabold text-sm transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: selectedColor.hex, color: "#FAF3E0" }}
              >
                <Droplets className="w-4 h-4" />
                Celupkan ke Warna {selectedColor.label}!
              </motion.button>

              <button
                onClick={() => setGameState("drawing")}
                className="text-xs text-white/40 hover:text-white text-center font-body transition-colors"
              >
                ← Kembali ke papan canting
              </button>
            </motion.div>
          )}

          {/* ── DONE ── */}
          {gameState === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto px-4 py-12 flex flex-col items-center gap-8"
            >
              <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 border-2 border-[#D4AF37]/30 flex items-center justify-center">
                <Trophy className="w-10 h-10 text-[#D4AF37]" />
              </div>
              <div className="text-center">
                <h2 className="font-display font-extrabold text-3xl text-white mb-2">Karya Batikmu Selesai!</h2>
                <p className="text-white/60 font-body">
                  Kamu telah menyelesaikan simulasi membatik dengan {layerCount} lapisan warna.
                </p>
                <p className="text-[#D4AF37] font-display font-bold text-xl mt-2">+{earnedXp} XP diperoleh!</p>
              </div>

              {/* Final canvas */}
              <div className="rounded-2xl overflow-hidden border-2 border-[#D4AF37]/30 shadow-2xl shadow-[#D4AF37]/10"
                style={{ width: 200, height: 200 }}>
                <canvas ref={displayCanvasRef} width={CANVAS_W} height={CANVAS_H}
                  className="w-full h-full" />
              </div>

              <div className="flex gap-3 w-full">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={downloadResult}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#D4AF37] text-[#1A1614] font-display font-extrabold py-3.5 rounded-xl hover:bg-[#c9a42c] transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Simpan Karya
                </motion.button>
                <button
                  onClick={() => setGameState("idle")}
                  className="flex items-center gap-2 border border-white/15 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-display font-semibold px-5 py-3.5 rounded-xl transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Mulai Lagi
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
