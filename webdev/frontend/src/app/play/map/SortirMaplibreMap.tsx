"use client";

import React, { useMemo, useState, useRef, useCallback, useEffect } from "react";
import Map, { Source, Layer, Marker, NavigationControl, MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type { StyleSpecification } from "maplibre-gl";
import Image from "next/image";
import { Check, Layers, ZoomIn, Sun, Moon, Satellite, Compass } from "lucide-react";
import regionsGeoData from "@/data/regionsGeo.json";

export interface RegionData {
  id: string;
  name: string;
  shortName: string;
  province: string;
  island: string;
  lat: number;
  lng: number;
  radiusMeters?: number;
  description: string;
}

export interface PlacedItem {
  regionId: string;
  cardName: string;
  cardImage: string;
}

interface SortirMaplibreMapProps {
  regions: RegionData[];
  placedItems: Record<string, PlacedItem>;
  activeCard: { id: string; name: string; regionId: string; image: string } | null;
  selectedCard: { id: string; name: string; regionId: string } | null;
  flashRegion: { id: string; status: "correct" | "wrong" } | null;
  onSelectRegion: (regionId: string) => void;
  isDraggingCard: boolean;
  dragPos: { x: number; y: number };
  onHoverRegionChange: (regionId: string | null) => void;
}

type TileTheme = "dark" | "satellite" | "osm";

// Reliable, 100% free basemap tile styles (No API key needed)
const BASEMAP_STYLES: Record<TileTheme, StyleSpecification> = {
  dark: {
    version: 8,
    sources: {
      "esri-dark": {
        type: "raster",
        tiles: [
          "https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        attribution: "&copy; Esri, DeLorme, NAVTEQ",
      },
      "esri-dark-labels": {
        type: "raster",
        tiles: [
          "https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
      },
    },
    layers: [
      {
        id: "esri-dark-base",
        type: "raster",
        source: "esri-dark",
        minzoom: 0,
        maxzoom: 19,
      },
      {
        id: "esri-dark-labels",
        type: "raster",
        source: "esri-dark-labels",
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  },
  satellite: {
    version: 8,
    sources: {
      "esri-sat": {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        attribution: "&copy; Esri, Maxar, Earthstar Geographics",
      },
    },
    layers: [
      {
        id: "esri-sat-layer",
        type: "raster",
        source: "esri-sat",
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  },
  osm: {
    version: 8,
    sources: {
      osm: {
        type: "raster",
        tiles: [
          "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
          "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
          "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
        ],
        tileSize: 256,
        attribution: "&copy; OpenStreetMap contributors",
      },
    },
    layers: [
      {
        id: "osm-layer",
        type: "raster",
        source: "osm",
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  },
};

export const REGION_THEME_COLORS: Record<
  string,
  {
    fill: string;
    border: string;
    glow: string;
    name: string;
  }
> = {
  jakarta: {
    fill: "#0EA5E9", // Sky Blue
    border: "#0284C7",
    glow: "#38BDF8",
    name: "DKI Jakarta",
  },
  garut: {
    fill: "#84CC16", // Lime Green
    border: "#65A30D",
    glow: "#A3E635",
    name: "Garut",
  },
  cirebon: {
    fill: "#06B6D4", // Ocean Cyan
    border: "#0891B2",
    glow: "#22D3EE",
    name: "Cirebon",
  },
  pekalongan: {
    fill: "#22C55E", // Vibrant Emerald Green (persis area hijau pada gambar kedua)
    border: "#16A34A",
    glow: "#4ADE80",
    name: "Pekalongan",
  },
  yogyakarta: {
    fill: "#8B5CF6", // Royal Purple / Violet
    border: "#7C3AED",
    glow: "#A78BFA",
    name: "Yogyakarta",
  },
  surakarta: {
    fill: "#F59E0B", // Warm Amber / Orange (persis area oranye pada gambar kedua)
    border: "#D97706",
    glow: "#FBBF24",
    name: "Surakarta (Solo)",
  },
  lasem: {
    fill: "#F43F5E", // Coral Crimson
    border: "#E11D48",
    glow: "#FB7185",
    name: "Lasem",
  },
  madura: {
    fill: "#EA580C", // Tangerine Orange
    border: "#C2410C",
    glow: "#FB923C",
    name: "Madura",
  },
  bali: {
    fill: "#EAB308", // Sun Gold
    border: "#CA8A04",
    glow: "#FACC15",
    name: "Bali",
  },
  kalimantan: {
    fill: "#10B981", // Deep Jade Forest
    border: "#059669",
    glow: "#34D399",
    name: "Kalimantan",
  },
};

interface CelebrationParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
  type: "spark" | "confetti" | "star";
  rotation?: number;
  rotSpeed?: number;
  gravity?: number;
  drag?: number;
}

interface CelebrationRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

interface GeoJsonFeature {
  type: "Feature";
  properties: Record<string, unknown> & { id: string };
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

export default function SortirMaplibreMap({
  regions,
  placedItems,
  activeCard: _activeCard,
  selectedCard,
  flashRegion,
  onSelectRegion,
  isDraggingCard,
  dragPos,
  onHoverRegionChange,
}: SortirMaplibreMapProps) {
  const mapRef = useRef<MapRef | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<CelebrationParticle[]>([]);
  const ringsRef = useRef<CelebrationRing[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const [theme, setTheme] = useState<TileTheme>("osm");
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);

  const currentMapStyle = useMemo(() => BASEMAP_STYLES[theme], [theme]);

  // Update hover state and notify parent
  const handleRegionHover = useCallback(
    (id: string | null) => {
      setHoveredRegionId(id);
      onHoverRegionChange(id);
    },
    [onHoverRegionChange]
  );

  // Resize canvas to match map container
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current && particleCanvasRef.current) {
        particleCanvasRef.current.width = containerRef.current.clientWidth;
        particleCanvasRef.current.height = containerRef.current.clientHeight;
      }
    };
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  // Helper drawing functions for celebration particle types
  const drawSparkle = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    color: string,
    alpha: number,
    rotation = 0
  ) => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.beginPath();
    ctx.moveTo(0, -size * 1.5);
    ctx.quadraticCurveTo(0, 0, size * 1.5, 0);
    ctx.quadraticCurveTo(0, 0, 0, size * 1.5);
    ctx.quadraticCurveTo(0, 0, -size * 1.5, 0);
    ctx.quadraticCurveTo(0, 0, 0, -size * 1.5);
    ctx.fill();
    ctx.restore();
  };

  const drawConfetti = (ctx: CanvasRenderingContext2D, p: CelebrationParticle) => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.translate(p.x, p.y);
    if (p.rotation !== undefined) ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 3, p.size, (p.size / 3) * 2);
    ctx.restore();
  };

  const drawSpark = (ctx: CanvasRenderingContext2D, p: CelebrationParticle) => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.fillStyle = p.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const drawRing = (ctx: CanvasRenderingContext2D, ring: CelebrationRing) => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, ring.alpha);
    ctx.strokeStyle = ring.color;
    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 12;
    ctx.shadowColor = ring.color;
    ctx.beginPath();
    ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };

  // Dedicated celebration rendering loop
  const startCelebrationLoop = useCallback(() => {
    if (animFrameIdRef.current !== null) return;

    const render = () => {
      const canvas = particleCanvasRef.current;
      if (!canvas) {
        animFrameIdRef.current = null;
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        animFrameIdRef.current = null;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Render & update expanding shockwave rings
      const activeRings: CelebrationRing[] = [];
      for (let i = 0; i < ringsRef.current.length; i++) {
        const ring = ringsRef.current[i];
        ring.radius += (ring.maxRadius - ring.radius) * 0.12 + 1.2;
        ring.alpha -= 0.024;
        if (ring.alpha > 0 && ring.radius < ring.maxRadius) {
          drawRing(ctx, ring);
          activeRings.push(ring);
        }
      }
      ringsRef.current = activeRings;

      // 2. Render & update active celebration particles
      const alive: CelebrationParticle[] = [];
      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.vx *= p.drag ?? 0.96;
        p.vy *= p.drag ?? 0.96;
        if (p.gravity) p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        if (p.rotation !== undefined && p.rotSpeed !== undefined) {
          p.rotation += p.rotSpeed;
        }
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          if (p.type === "star") {
            drawSparkle(ctx, p.x, p.y, p.size, p.color, p.alpha, p.rotation);
          } else if (p.type === "confetti") {
            drawConfetti(ctx, p);
          } else {
            drawSpark(ctx, p);
          }
          alive.push(p);
        }
      }
      particlesRef.current = alive;

      // Continue animating if there are active particles or rings
      if (particlesRef.current.length > 0 || ringsRef.current.length > 0) {
        animFrameIdRef.current = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animFrameIdRef.current = null;
      }
    };

    animFrameIdRef.current = requestAnimationFrame(render);
  }, []);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // Celebration burst when correct/wrong drop occurs
  useEffect(() => {
    if (!flashRegion || !mapRef.current) return;
    const region = regions.find((r) => r.id === flashRegion.id);
    if (!region) return;
    const map = mapRef.current.getMap();
    if (!map) return;
    const pt = map.project([region.lng, region.lat]);
    const isCorrect = flashRegion.status === "correct";

    if (isCorrect) {
      // 1. Dual Shockwave Rings (Golden & Emerald)
      ringsRef.current.push({
        x: pt.x,
        y: pt.y,
        radius: 12,
        maxRadius: 110,
        alpha: 0.9,
        color: "#D4AF37",
      });
      ringsRef.current.push({
        x: pt.x,
        y: pt.y,
        radius: 8,
        maxRadius: 75,
        alpha: 0.75,
        color: "#10B981",
      });

      const celebrationColors = [
        "#D4AF37", // Gold
        "#F59E0B", // Amber
        "#FCD34D", // Light Gold
        "#10B981", // Emerald
        "#34D399", // Light Emerald
        "#8B5CF6", // Royal Purple
        "#06B6D4", // Ocean Cyan
        "#F43F5E", // Coral Crimson
        "#FFFFFF", // Pearl Sparkle
      ];

      // 2. Stars & Shimmering Sparkles (28 particles)
      for (let i = 0; i < 28; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5.5 + 2.0;
        particlesRef.current.push({
          x: pt.x,
          y: pt.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2,
          size: Math.random() * 4 + 2,
          alpha: 1.0,
          decay: Math.random() * 0.02 + 0.012,
          color: celebrationColors[Math.floor(Math.random() * celebrationColors.length)],
          type: "star",
          rotation: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 0.15,
          drag: 0.94,
        });
      }

      // 3. Floating Confetti Ribbons (30 particles)
      for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4.0 + 1.2;
        particlesRef.current.push({
          x: pt.x,
          y: pt.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2.5,
          size: Math.random() * 7 + 4,
          alpha: 1.0,
          decay: Math.random() * 0.018 + 0.01,
          color: celebrationColors[Math.floor(Math.random() * celebrationColors.length)],
          type: "confetti",
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.25,
          gravity: 0.07,
          drag: 0.97,
        });
      }

      // 4. Upward Rising Golden Embers (18 particles)
      for (let i = 0; i < 18; i++) {
        const spreadX = (Math.random() - 0.5) * 40;
        particlesRef.current.push({
          x: pt.x + spreadX,
          y: pt.y + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -Math.random() * 2.8 - 0.8,
          size: Math.random() * 2.5 + 1.2,
          alpha: 1.0,
          decay: Math.random() * 0.015 + 0.01,
          color: Math.random() > 0.3 ? "#FBBF24" : "#FFFFFF",
          type: "spark",
          drag: 0.99,
        });
      }
    } else {
      // Wrong drop: gentle red cue, 12 subtle particles
      for (let i = 0; i < 14; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.5 + 0.8;
        particlesRef.current.push({
          x: pt.x,
          y: pt.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2.5 + 1.5,
          alpha: 0.9,
          decay: 0.035,
          color: "#EF4444",
          type: "spark",
          drag: 0.95,
        });
      }
    }

    startCelebrationLoop();
  }, [flashRegion, regions, startCelebrationLoop]);

  // Real-time Drag Detection: as user moves the dragged card, query map polygon and marker proximity
  useEffect(() => {
    if (!isDraggingCard || !mapRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = dragPos.x - rect.left;
    const y = dragPos.y - rect.top;

    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      const map = mapRef.current.getMap();
      if (map) {
        // 1. Check if hovering inside any polygon feature
        try {
          const features = map.queryRenderedFeatures([x, y], {
            layers: ["regions-fill"],
          });
          if (features && features.length > 0) {
            const fid = (features[0].properties as { id?: string })?.id;
            if (fid) {
              handleRegionHover(fid);
              return;
            }
          }
        } catch {
          // ignore
        }

        // 2. Proximity check to region centers / markers (snap radius 65px)
        for (const reg of regions) {
          try {
            const pt = map.project([reg.lng, reg.lat]);
            const dist = Math.hypot(pt.x - x, pt.y - y);
            if (dist < 65) {
              handleRegionHover(reg.id);
              return;
            }
          } catch {
            // ignore
          }
        }
      }
    }

    handleRegionHover(null);
  }, [isDraggingCard, dragPos, regions, handleRegionHover]);

  // Ensure MapLibre WebGL canvas accurately measures and resizes on mount
  useEffect(() => {
    const t = setTimeout(() => {
      mapRef.current?.resize();
    }, 150);
    return () => clearTimeout(t);
  }, []);

  // Camera preset navigation
  const flyToPreset = (preset: "all" | "java" | "kalimantan") => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    if (preset === "all") {
      map.flyTo({ center: [114.5, -4.2], zoom: 4.5, duration: 1000 });
    } else if (preset === "java") {
      map.flyTo({ center: [110.8, -7.2], zoom: 6.6, duration: 1000 });
    } else if (preset === "kalimantan") {
      map.flyTo({ center: [113.6, -1.8], zoom: 5.8, duration: 1000 });
    }
  };

  // Fly to specific region when clicked
  const flyToRegion = (reg: RegionData) => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    map.flyTo({ center: [reg.lng, reg.lat], zoom: 8, duration: 1000 });
  };

  // Prepare dynamic GeoJSON mapping properties for active regions with distinct rich colors per region
  const interactiveGeoJson = useMemo(() => {
    const activeIds = new Set(regions.map((r) => r.id));
    const rawData = regionsGeoData as unknown as { features: GeoJsonFeature[] };
    const featureCollection = {
      type: "FeatureCollection" as const,
      features: rawData.features
        .filter((feature) => activeIds.has(feature.properties.id))
        .map((feature) => {
          const regionId = feature.properties.id;
          const placed = !!placedItems[regionId];
          const isHovered = hoveredRegionId === regionId;
          const isSelected = selectedCard?.regionId === regionId;
          const isFlashCorrect = flashRegion?.id === regionId && flashRegion?.status === "correct";
          const isFlashWrong = flashRegion?.id === regionId && flashRegion?.status === "wrong";

          const themeColor = REGION_THEME_COLORS[regionId] || {
            fill: "#0EA5E9",
            border: "#0284C7",
            glow: "#38BDF8",
            name: regionId,
          };

          let fillColor = themeColor.fill;
          let fillOpacity = 0.55;
          let lineColor = themeColor.border;
          let lineWidth = 3.0;

          if (placed || isFlashCorrect) {
            fillColor = "#10B981";
            fillOpacity = 0.65;
            lineColor = "#059669";
            lineWidth = 4.0;
          } else if (isFlashWrong) {
            fillColor = "#EF4444";
            fillOpacity = 0.70;
            lineColor = "#DC2626";
            lineWidth = 4.0;
          } else if (isHovered) {
            fillColor = themeColor.glow;
            fillOpacity = 0.75;
            lineColor = "#FFFFFF";
            lineWidth = 4.5;
          } else if (isSelected) {
            fillColor = "#F59E0B";
            fillOpacity = 0.70;
            lineColor = "#FFFFFF";
            lineWidth = 4.0;
          }

          return {
            ...feature,
            type: "Feature" as const,
            properties: {
              ...feature.properties,
              fillColor,
              fillOpacity,
              lineColor,
              lineWidth,
            },
          };
        }),
    };
    return featureCollection;
  }, [regions, placedItems, hoveredRegionId, selectedCard, flashRegion]);

  return (
    <div
      ref={containerRef}
      className="w-full relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-[#D4AF37]/30 bg-[#1A1816] h-[320px] xs:h-[350px] sm:h-[420px] md:h-[460px]"
    >
      {/* Top Left: Map Tile Switcher */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-[#0F172A]/90 backdrop-blur-md border border-white/20 p-1 rounded-xl shadow-lg">
        <span className="text-white/50 px-1 text-[11px] flex items-center gap-1">
          <Layers className="w-3 h-3 text-[#D4AF37]" />
        </span>
        <button
          type="button"
          onClick={() => setTheme("osm")}
          className={`text-[11px] font-display font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            theme === "osm"
              ? "bg-[#D4AF37] text-[#1A1614] shadow-md"
              : "text-white/70 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10"
          }`}
        >
          <Sun className="w-3 h-3" />
          <span>Peta Terang</span>
        </button>
        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={`text-[11px] font-display font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            theme === "dark"
              ? "bg-[#D4AF37] text-[#1A1614] shadow-md"
              : "text-white/70 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10"
          }`}
        >
          <Moon className="w-3 h-3" />
          <span>Mode Gelap</span>
        </button>
        <button
          type="button"
          onClick={() => setTheme("satellite")}
          className={`text-[11px] font-display font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            theme === "satellite"
              ? "bg-[#D4AF37] text-[#1A1614] shadow-md"
              : "text-white/70 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10"
          }`}
        >
          <Satellite className="w-3 h-3" />
          <span>Satelit</span>
        </button>
      </div>

      {/* Top Right: Quick Focus Navigation Presets */}
      <div className="absolute top-3 right-14 z-10 hidden sm:flex items-center gap-1.5 bg-[#0F172A]/90 backdrop-blur-md border border-white/20 p-1 rounded-xl shadow-lg">
        <span className="text-white/50 px-1 text-[11px] flex items-center gap-1">
          <ZoomIn className="w-3 h-3 text-[#D4AF37]" />
          Fokus:
        </span>
        <button
          type="button"
          onClick={() => flyToPreset("all")}
          className="text-[11px] font-display font-bold px-2.5 py-1 rounded-lg text-white/70 hover:text-[#D4AF37] hover:bg-[#D4AF37]/15 transition-all cursor-pointer flex items-center gap-1"
        >
          <Compass className="w-3 h-3 text-[#D4AF37]" />
          <span>Nusantara</span>
        </button>
        <button
          type="button"
          onClick={() => flyToPreset("java")}
          className="text-[11px] font-display font-bold px-2.5 py-1 rounded-lg text-white/70 hover:text-[#D4AF37] hover:bg-[#D4AF37]/15 transition-all cursor-pointer"
        >
          Jawa & Bali
        </button>
        <button
          type="button"
          onClick={() => flyToPreset("kalimantan")}
          className="text-[11px] font-display font-bold px-2.5 py-1 rounded-lg text-white/70 hover:text-[#D4AF37] hover:bg-[#D4AF37]/15 transition-all cursor-pointer"
        >
          Kalimantan
        </button>
      </div>

      {/* Boundary Particles & Burst FX Canvas Overlay */}
      <canvas
        ref={particleCanvasRef}
        className="absolute inset-0 pointer-events-none z-10"
      />

      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 110.8,
          latitude: -7.2,
          zoom: 6.6,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={currentMapStyle}
        interactiveLayerIds={["regions-fill"]}
        onLoad={() => {
          mapRef.current?.resize();
        }}
        onMouseMove={(e) => {
          if (isDraggingCard) return;
          if (e.features && e.features.length > 0) {
            const featureId = (e.features[0].properties as { id?: string })?.id;
            if (featureId && featureId !== hoveredRegionId) {
              handleRegionHover(featureId);
            }
          } else if (hoveredRegionId) {
            handleRegionHover(null);
          }
        }}
        onMouseLeave={() => {
          if (!isDraggingCard) handleRegionHover(null);
        }}
        onClick={(e) => {
          if (e.features && e.features.length > 0) {
            const featureId = (e.features[0].properties as { id?: string })?.id;
            if (featureId) onSelectRegion(featureId);
          }
        }}
        cursor={hoveredRegionId ? "pointer" : "grab"}
      >
        <NavigationControl position="bottom-right" />

        {/* Polygons with colorful area styling like the user's reference image */}
        <Source id="regions-source" type="geojson" data={interactiveGeoJson as unknown as GeoJSON.FeatureCollection}>
          {/* Inner Fill with distinct rich area colors (matching Image 2) */}
          <Layer
            id="regions-fill"
            type="fill"
            paint={{
              "fill-color": ["get", "fillColor"],
              "fill-opacity": ["get", "fillOpacity"],
            }}
          />
          {/* Outer Boundary Line */}
          <Layer
            id="regions-line"
            type="line"
            layout={{
              "line-join": "round",
              "line-cap": "round",
            }}
            paint={{
              "line-color": ["get", "lineColor"],
              "line-width": ["get", "lineWidth"],
              "line-opacity": 0.95,
            }}
          />
          {/* Crisp white inner border separator (like GIS choropleth borders in Image 2) */}
          <Layer
            id="regions-line-inner"
            type="line"
            layout={{
              "line-join": "round",
              "line-cap": "round",
            }}
            paint={{
              "line-color": "#FFFFFF",
              "line-width": 1.5,
              "line-opacity": 0.75,
            }}
          />
        </Source>

        {/* Sleek Area Label Badges (Matching Image 2: NO circular dots or balls!) */}
        {regions.map((region) => {
          const placed = placedItems[region.id];
          const isHovered = hoveredRegionId === region.id;
          const isSelected = selectedCard?.regionId === region.id;
          const isFlashCorrect = flashRegion?.id === region.id && flashRegion?.status === "correct";
          const isFlashWrong = flashRegion?.id === region.id && flashRegion?.status === "wrong";

          return (
            <Marker
              key={region.id}
              longitude={region.lng}
              latitude={region.lat}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                onSelectRegion(region.id);
                flyToRegion(region);
              }}
            >
              <div
                data-region-id={region.id}
                className="relative flex flex-col items-center group cursor-pointer select-none"
                onMouseEnter={() => handleRegionHover(region.id)}
                onMouseLeave={() => {
                  if (!isDraggingCard) handleRegionHover(null);
                }}
              >
                {/* Clean District Label Tag (NO circle dot, pure clean map typography like Image 2) */}
                <div
                  className={`px-3 py-1 rounded-md text-[12px] font-display font-extrabold tracking-wide shadow-md backdrop-blur-md border transition-all duration-200 ${
                    placed || isFlashCorrect
                      ? "bg-emerald-950/90 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/40"
                      : isFlashWrong
                      ? "bg-red-950/90 border-red-400 text-red-200 ring-2 ring-red-500/50"
                      : isHovered
                      ? "bg-[#0F172A]/95 border-white text-white scale-110 shadow-2xl ring-2 ring-white/80 -translate-y-0.5"
                      : isSelected
                      ? "bg-[#0F172A]/95 border-amber-400 text-amber-200 scale-105 shadow-xl ring-2 ring-amber-400/50"
                      : "bg-[#0F172A]/75 border-white/40 text-white hover:border-white hover:bg-[#0F172A]/90"
                  }`}
                >
                  <span>{region.shortName}</span>

                  {placed || isFlashCorrect ? (
                    <Check className="inline-block ml-1.5 w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                  ) : isHovered ? (
                    <span className="ml-1 text-[10px] text-blue-300 font-semibold animate-pulse">
                      (Drop)
                    </span>
                  ) : null}
                </div>

                {/* Placed Motif Card preview badge */}
                {placed && (
                  <div className="absolute top-full mt-1 flex items-center gap-1.5 bg-[#0F172A]/95 border border-emerald-500/50 px-2 py-0.5 rounded-md shadow-xl backdrop-blur-md pointer-events-none whitespace-nowrap z-20">
                    <Image
                      src={placed.cardImage}
                      alt={placed.cardName}
                      width={18}
                      height={18}
                      className="rounded-xs object-cover border border-emerald-400/40"
                    />
                    <span className="text-[10px] font-semibold text-emerald-200">
                      {placed.cardName}
                    </span>
                  </div>
                )}
              </div>
            </Marker>
          );
        })}
      </Map>
    </div>
  );
}





