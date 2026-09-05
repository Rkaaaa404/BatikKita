"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Image from "next/image";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  MapPin,
  Sparkles,
  Navigation,
  Check,
} from "lucide-react";

export interface RegionData {
  id: string;
  name: string;
  shortName: string;
  province: string;
  island: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  description: string;
}

export interface PlacedItem {
  regionId: string;
  cardName: string;
  cardImage: string;
}

interface SortirLeafletMapProps {
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

type TileTheme = "dark" | "voyager" | "satellite";

const TILE_URLS: Record<TileTheme, { url: string; attr: string; subdomains?: string }> = {
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attr: "&copy; OpenStreetMap, &copy; CARTO",
    subdomains: "abcd",
  },
  voyager: {
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attr: "&copy; OpenStreetMap, &copy; CARTO",
    subdomains: "abcd",
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attr: "&copy; Esri, Maxar, Earthstar Geographics",
  },
};

export default function SortirLeafletMap({
  regions,
  placedItems,
  activeCard,
  selectedCard,
  flashRegion,
  onSelectRegion,
  isDraggingCard,
  dragPos,
  onHoverRegionChange,
}: SortirLeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const circlesRef = useRef<Record<string, L.Circle>>({});

  const [theme, setTheme] = useState<TileTheme>("dark");
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Indonesia archipelago
    const map = L.map(mapContainerRef.current, {
      center: [-4.5, 114.5],
      zoom: 5,
      minZoom: 4,
      maxZoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    // Add CartoDB Dark Matter tile layer by default
    const tileConfig = TILE_URLS[theme];
    const tileLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attr,
      subdomains: tileConfig.subdomains || "abc",
      maxZoom: 18,
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer theme
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const map = mapInstanceRef.current;
    const config = TILE_URLS[theme];

    map.removeLayer(tileLayerRef.current);
    const newLayer = L.tileLayer(config.url, {
      attribution: config.attr,
      subdomains: config.subdomains || "abc",
      maxZoom: 18,
    }).addTo(map);

    tileLayerRef.current = newLayer;
  }, [theme]);

  // Handle Region Markers and Geographical Boundaries
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers/circles
    Object.values(markersRef.current).forEach((m) => m.remove());
    Object.values(circlesRef.current).forEach((c) => c.remove());
    markersRef.current = {};
    circlesRef.current = {};

    regions.forEach((region) => {
      const placed = placedItems[region.id];
      const isHovered = hoveredRegionId === region.id;
      const isFlashCorrect = flashRegion?.id === region.id && flashRegion.status === "correct";
      const isFlashWrong = flashRegion?.id === region.id && flashRegion.status === "wrong";
      const isSelected = selectedCard && selectedCard.regionId === region.id;

      // 1. Geographical Zone Circle (Penggambaran Daerah Pencocokan)
      let circleColor = "#D4AF37";
      let circleFillColor = "#D4AF37";
      let circleFillOpacity = 0.15;
      let circleWeight = 1.5;

      if (placed || isFlashCorrect) {
        circleColor = "#10B981";
        circleFillColor = "#10B981";
        circleFillOpacity = 0.35;
        circleWeight = 2.5;
      } else if (isFlashWrong) {
        circleColor = "#EF4444";
        circleFillColor = "#EF4444";
        circleFillOpacity = 0.45;
        circleWeight = 3;
      } else if (isHovered || isSelected) {
        circleColor = "#60A5FA";
        circleFillColor = "#60A5FA";
        circleFillOpacity = 0.4;
        circleWeight = 3;
      }

      const circle = L.circle([region.lat, region.lng], {
        radius: region.radiusMeters,
        color: circleColor,
        fillColor: circleFillColor,
        fillOpacity: circleFillOpacity,
        weight: circleWeight,
        dashArray: placed ? undefined : "4, 4",
      }).addTo(map);

      circle.on("click", () => onSelectRegion(region.id));
      circlesRef.current[region.id] = circle;

      // 2. Interactive Custom Marker DivIcon
      const markerHtml = `
        <div class="relative flex flex-col items-center group cursor-pointer" style="transform: translate(-50%, -100%);">
          ${
            isHovered || isSelected
              ? '<span class="absolute -inset-2.5 rounded-full bg-blue-400/40 animate-ping pointer-events-none"></span>'
              : ""
          }
          <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-xl transition-all duration-200 ${
            placed || isFlashCorrect
              ? "bg-emerald-500 border-white text-white shadow-emerald-500/50 scale-110"
              : isFlashWrong
              ? "bg-red-500 border-white text-white shadow-red-500/50 scale-95"
              : isHovered
              ? "bg-[#D4AF37] border-white text-[#1A1614] shadow-[#D4AF37]/50 scale-125"
              : isSelected
              ? "bg-blue-500 border-white text-white animate-pulse scale-115"
              : "bg-[#0F172A]/90 border-white/60 text-blue-300 hover:scale-110 hover:border-white"
          }">
            ${
              placed
                ? `<img src="${placed.cardImage}" alt="${placed.cardName}" class="w-full h-full object-cover rounded-full" />`
                : isFlashCorrect
                ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>'
                : '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>'
            }
          </div>
          <div class="w-1 h-2 -mt-0.5 ${
            placed || isFlashCorrect
              ? "bg-emerald-400"
              : isHovered
              ? "bg-[#D4AF37]"
              : "bg-white/50"
          }"></div>
          <div class="mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap shadow-md border ${
            placed
              ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/40"
              : isHovered
              ? "bg-[#D4AF37] text-[#1A1614] border-white font-extrabold"
              : isSelected
              ? "bg-blue-900/90 text-blue-200 border-blue-400/60"
              : "bg-[#0F172A]/90 text-white/90 border-white/20"
          }">
            ${region.shortName}
            ${placed ? `<span class="ml-1 text-[9px] text-emerald-300">(${placed.cardName})</span>` : ""}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: "custom-leaflet-pin",
        iconSize: [0, 0],
      });

      const marker = L.marker([region.lat, region.lng], { icon: customIcon }).addTo(map);
      marker.on("click", () => onSelectRegion(region.id));
      marker.on("mouseover", () => {
        setHoveredRegionId(region.id);
        onHoverRegionChange(region.id);
      });
      marker.on("mouseout", () => {
        setHoveredRegionId(null);
        onHoverRegionChange(null);
      });

      markersRef.current[region.id] = marker;
    });
  }, [regions, placedItems, hoveredRegionId, flashRegion, selectedCard, onSelectRegion, onHoverRegionChange]);

  // Drag Hit Detection: When dragging card across the basemap, detect region underneath pointer
  useEffect(() => {
    if (!isDraggingCard || !mapInstanceRef.current || !mapContainerRef.current) {
      if (!isDraggingCard && hoveredRegionId !== null) {
        setHoveredRegionId(null);
        onHoverRegionChange(null);
      }
      return;
    }

    const map = mapInstanceRef.current;
    const containerRect = mapContainerRef.current.getBoundingClientRect();

    // Check if drag pointer is within the map container bounds
    if (
      dragPos.x < containerRect.left ||
      dragPos.x > containerRect.right ||
      dragPos.y < containerRect.top ||
      dragPos.y > containerRect.bottom
    ) {
      if (hoveredRegionId !== null) {
        setHoveredRegionId(null);
        onHoverRegionChange(null);
      }
      return;
    }

    // Convert screen coordinates to Leaflet LatLng
    const containerPoint = L.point(dragPos.x - containerRect.left, dragPos.y - containerRect.top);
    const pointerLatLng = map.containerPointToLatLng(containerPoint);

    // Find nearest region within its geographical radius or threshold
    let nearestId: string | null = null;
    let minDistance = Infinity;

    regions.forEach((region) => {
      const regionLatLng = L.latLng(region.lat, region.lng);
      const distMeters = pointerLatLng.distanceTo(regionLatLng);
      const pixelDist = containerPoint.distanceTo(map.latLngToContainerPoint(regionLatLng));

      // Snapping criteria: within geographical radius OR within 50px of pin on screen
      if ((distMeters <= region.radiusMeters || pixelDist < 52) && distMeters < minDistance) {
        minDistance = distMeters;
        nearestId = region.id;
      }
    });

    if (nearestId !== hoveredRegionId) {
      setHoveredRegionId(nearestId);
      onHoverRegionChange(nearestId);
    }
  }, [isDraggingCard, dragPos, regions, hoveredRegionId, onHoverRegionChange]);

  // Camera FlyTo Helpers
  const flyToPreset = (preset: "all" | "java" | "coast" | "outer") => {
    const map = mapInstanceRef.current;
    if (!map) return;

    switch (preset) {
      case "all":
        map.flyTo([-4.5, 116], 5, { duration: 1.2 });
        break;
      case "java":
        map.flyTo([-7.3, 110.2], 8, { duration: 1.2 });
        break;
      case "coast":
        map.flyTo([-6.8, 109.8], 8, { duration: 1.2 });
        break;
      case "outer":
        map.flyTo([-4.8, 114.5], 6, { duration: 1.2 });
        break;
    }
  };

  const zoomIn = () => mapInstanceRef.current?.zoomIn();
  const zoomOut = () => mapInstanceRef.current?.zoomOut();
  const resetCamera = () => mapInstanceRef.current?.flyTo([-4.5, 116], 5, { duration: 1 });

  return (
    <div className="relative w-full h-[400px] sm:h-[480px] md:h-[540px] rounded-3xl overflow-hidden border border-[#D4AF37]/30 shadow-2xl bg-[#0F172A]">
      {/* Real Basemap Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Top Quick Focus Chips */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-1.5 bg-[#0F172A]/85 backdrop-blur-md border border-white/15 p-1.5 rounded-2xl shadow-xl">
        <span className="text-[10px] font-display font-extrabold text-[#D4AF37] uppercase tracking-wider px-2 flex items-center gap-1">
          <Navigation className="w-3 h-3 text-[#D4AF37]" /> Fokus:
        </span>
        <button
          type="button"
          onClick={() => flyToPreset("all")}
          className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-white/90 text-xs font-display font-bold transition-colors"
        >
          Nusantara
        </button>
        <button
          type="button"
          onClick={() => flyToPreset("java")}
          className="px-2.5 py-1 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-display font-bold border border-blue-500/40 transition-colors"
        >
          Pulau Jawa
        </button>
        <button
          type="button"
          onClick={() => flyToPreset("coast")}
          className="px-2.5 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-display font-bold border border-emerald-500/40 transition-colors"
        >
          Pesisir Utara
        </button>
        <button
          type="button"
          onClick={() => flyToPreset("outer")}
          className="px-2.5 py-1 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-display font-bold border border-purple-500/40 transition-colors"
        >
          Luar Jawa (Kalimantan & Bali)
        </button>
      </div>

      {/* Basemap Style Switcher */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-[#0F172A]/85 backdrop-blur-md border border-white/15 p-1 rounded-2xl shadow-xl text-xs font-display font-bold">
        <span className="text-[10px] text-white/50 px-1.5 flex items-center gap-1">
          <Layers className="w-3 h-3 text-blue-400" /> Tema:
        </span>
        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={`px-2 py-1 rounded-xl transition-colors ${
            theme === "dark"
              ? "bg-[#D4AF37] text-[#1A1614] shadow-sm"
              : "text-white/70 hover:text-white"
          }`}
        >
          Malam
        </button>
        <button
          type="button"
          onClick={() => setTheme("voyager")}
          className={`px-2 py-1 rounded-xl transition-colors ${
            theme === "voyager"
              ? "bg-[#D4AF37] text-[#1A1614] shadow-sm"
              : "text-white/70 hover:text-white"
          }`}
        >
          Antik
        </button>
        <button
          type="button"
          onClick={() => setTheme("satellite")}
          className={`px-2 py-1 rounded-xl transition-colors ${
            theme === "satellite"
              ? "bg-[#D4AF37] text-[#1A1614] shadow-sm"
              : "text-white/70 hover:text-white"
          }`}
        >
          Satelit
        </button>
      </div>

      {/* Floating Zoom Controls */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1.5 bg-[#0F172A]/85 backdrop-blur-md border border-white/15 p-1.5 rounded-2xl shadow-xl">
        <button
          type="button"
          onClick={zoomIn}
          className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={zoomOut}
          className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={resetCamera}
          className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#D4AF37] transition-colors"
          title="Reset Kamera"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Active Region Hover Banner */}
      {hoveredRegionId && (
        <div className="absolute bottom-4 left-4 z-10 bg-[#0F172A]/90 backdrop-blur-md border border-[#D4AF37]/50 px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2 max-w-sm pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <div>
            <p className="text-xs font-display font-extrabold text-white">
              {regions.find((r) => r.id === hoveredRegionId)?.name}
            </p>
            <p className="text-[10px] font-body text-white/70">
              {regions.find((r) => r.id === hoveredRegionId)?.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
