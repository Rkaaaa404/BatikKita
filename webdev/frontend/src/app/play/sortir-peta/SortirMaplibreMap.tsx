"use client";

import React, { useMemo, useState, useRef, useCallback, useEffect } from "react";
import Map, { Source, Layer, Marker, NavigationControl, MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import Image from "next/image";
import { Check, Layers, ZoomIn } from "lucide-react";
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
const BASEMAP_STYLES: Record<TileTheme, any> = {
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
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
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

export default function SortirMaplibreMap({
  regions,
  placedItems,
  activeCard,
  selectedCard,
  flashRegion,
  onSelectRegion,
  isDraggingCard,
  dragPos,
  onHoverRegionChange,
}: SortirMaplibreMapProps) {
  const mapRef = useRef<MapRef | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [theme, setTheme] = useState<TileTheme>("dark");
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
            const fid = features[0].properties?.id;
            if (fid) {
              handleRegionHover(fid);
              return;
            }
          }
        } catch {
          // ignore
        }

        // 2. Proximity check to region centers / markers (snap radius 55px)
        for (const reg of regions) {
          try {
            const pt = map.project([reg.lng, reg.lat]);
            const dist = Math.hypot(pt.x - x, pt.y - y);
            if (dist < 55) {
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

  // Camera preset navigation
  const flyToPreset = (preset: "all" | "java" | "kalimantan") => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    if (preset === "all") {
      map.flyTo({ center: [114.5, -4.2], zoom: 4.3, duration: 1000 });
    } else if (preset === "java") {
      map.flyTo({ center: [110.6, -7.3], zoom: 6.8, duration: 1000 });
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

  // Prepare dynamic GeoJSON mapping properties for regions (bold red boundary like in the uploaded image)
  const interactiveGeoJson = useMemo(() => {
    const featureCollection = { ...(regionsGeoData as any) };
    featureCollection.features = featureCollection.features.map((feature: any) => {
      const regionId = feature.properties.id;
      const placed = !!placedItems[regionId];
      const isHovered = hoveredRegionId === regionId;
      const isSelected = selectedCard?.regionId === regionId;
      const isFlashCorrect = flashRegion?.id === regionId && flashRegion?.status === "correct";
      const isFlashWrong = flashRegion?.id === regionId && flashRegion?.status === "wrong";

      // Default: BOLD VIBRANT RED BOUNDARY LINE (like the user's reference image)
      let fillColor = "#EF4444";
      let fillOpacity = 0.22;
      let lineColor = "#EF4444";
      let lineWidth = 3.5;

      if (placed || isFlashCorrect) {
        fillColor = "#10B981";
        fillOpacity = 0.45;
        lineColor = "#10B981";
        lineWidth = 4;
      } else if (isFlashWrong) {
        fillColor = "#DC2626";
        fillOpacity = 0.65;
        lineColor = "#EF4444";
        lineWidth = 5;
      } else if (isHovered) {
        fillColor = "#3B82F6";
        fillOpacity = 0.45;
        lineColor = "#60A5FA";
        lineWidth = 5;
      } else if (isSelected) {
        fillColor = "#F59E0B";
        fillOpacity = 0.4;
        lineColor = "#D4AF37";
        lineWidth = 4.5;
      }

      return {
        ...feature,
        properties: {
          ...feature.properties,
          fillColor,
          fillOpacity,
          lineColor,
          lineWidth,
        },
      };
    });
    return featureCollection;
  }, [placedItems, hoveredRegionId, selectedCard, flashRegion]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[460px] sm:h-[520px] md:h-[580px] relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#D4AF37]/30 bg-[#141211]"
    >
      {/* Top Left: Map Tile Switcher */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-[#0F172A]/90 backdrop-blur-md border border-white/20 p-1 rounded-xl shadow-lg">
        <span className="text-white/50 px-1 text-[11px] flex items-center gap-1">
          <Layers className="w-3 h-3 text-[#D4AF37]" />
        </span>
        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={`text-[11px] font-display font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
            theme === "dark"
              ? "bg-[#D4AF37] text-[#1A1614] shadow-md"
              : "text-white/70 hover:text-white"
          }`}
        >
          🌙 Dark Basemap
        </button>
        <button
          type="button"
          onClick={() => setTheme("satellite")}
          className={`text-[11px] font-display font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
            theme === "satellite"
              ? "bg-[#D4AF37] text-[#1A1614] shadow-md"
              : "text-white/70 hover:text-white"
          }`}
        >
          🛰️ Satelit
        </button>
        <button
          type="button"
          onClick={() => setTheme("osm")}
          className={`text-[11px] font-display font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
            theme === "osm"
              ? "bg-[#D4AF37] text-[#1A1614] shadow-md"
              : "text-white/70 hover:text-white"
          }`}
        >
          🗺️ Terang (OSM)
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
          className="text-[11px] font-display font-bold px-2 py-0.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          🇮🇩 Nusantara
        </button>
        <button
          type="button"
          onClick={() => flyToPreset("java")}
          className="text-[11px] font-display font-bold px-2 py-0.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          🏝️ Jawa & Bali
        </button>
        <button
          type="button"
          onClick={() => flyToPreset("kalimantan")}
          className="text-[11px] font-display font-bold px-2 py-0.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          🌲 Kalimantan
        </button>
      </div>

      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 112.5,
          latitude: -6.5,
          zoom: 5.6,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={currentMapStyle}
        interactiveLayerIds={["regions-fill"]}
        onMouseMove={(e: any) => {
          if (isDraggingCard) return;
          if (e.features && e.features.length > 0) {
            const featureId = e.features[0].properties?.id;
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
        onClick={(e: any) => {
          if (e.features && e.features.length > 0) {
            const featureId = e.features[0].properties?.id;
            if (featureId) onSelectRegion(featureId);
          }
        }}
        cursor={hoveredRegionId ? "pointer" : "grab"}
      >
        <NavigationControl position="bottom-right" />

        {/* Polygons with Bold Red Outlines like the uploaded image */}
        <Source id="regions-source" type="geojson" data={interactiveGeoJson}>
          {/* Inner Fill */}
          <Layer
            id="regions-fill"
            type="fill"
            paint={{
              "fill-color": ["get", "fillColor"],
              "fill-opacity": ["get", "fillOpacity"],
            }}
          />
          {/* Outer Glow Boundary Line */}
          <Layer
            id="regions-line-glow"
            type="line"
            layout={{
              "line-join": "round",
              "line-cap": "round",
            }}
            paint={{
              "line-color": ["get", "lineColor"],
              "line-width": ["+", ["get", "lineWidth"], 3],
              "line-opacity": 0.35,
            }}
          />
          {/* Solid Perimeter Boundary Line */}
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
        </Source>

        {/* Markers & Area Badges */}
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
              anchor="bottom"
              onClick={(e: any) => {
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
                {isHovered || isSelected ? (
                  <span className="absolute -inset-3 rounded-full bg-blue-400/50 animate-ping pointer-events-none" />
                ) : null}

                {/* Circle Marker Icon */}
                <div
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center shadow-2xl transition-all duration-200 ${
                    placed || isFlashCorrect
                      ? "bg-emerald-500 border-white text-white shadow-emerald-500/60 scale-110"
                      : isFlashWrong
                      ? "bg-red-500 border-white text-white shadow-red-500/60 scale-95"
                      : isHovered
                      ? "bg-blue-500 border-white text-white shadow-blue-500/60 scale-115"
                      : "bg-[#1E293B] border-[#EF4444] text-white shadow-black/60"
                  }`}
                >
                  {placed || isFlashCorrect ? (
                    <Check className="w-4 h-4" strokeWidth={3} />
                  ) : (
                    <span className="font-display font-extrabold text-xs">
                      {region.shortName.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Area Name Badge */}
                <div
                  className={`absolute top-full mt-1.5 flex flex-col items-center pointer-events-none transition-all duration-200 ${
                    isHovered || isSelected || placed ? "opacity-100 translate-y-0" : "opacity-85"
                  }`}
                >
                  <div
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap shadow-xl border backdrop-blur-md ${
                      placed || isFlashCorrect
                        ? "bg-emerald-950/90 border-emerald-500/60 text-emerald-300"
                        : isHovered
                        ? "bg-blue-950/90 border-blue-400/70 text-blue-200 scale-105"
                        : "bg-[#0F172A]/90 border-[#EF4444]/60 text-white"
                    }`}
                  >
                    📍 {region.shortName}
                  </div>
                  {placed && (
                    <div className="mt-1 flex items-center gap-1.5 bg-[#0F172A]/95 border border-emerald-500/40 px-2 py-0.5 rounded-md shadow-xl backdrop-blur-md">
                      <Image
                        src={placed.cardImage}
                        alt={placed.cardName}
                        width={20}
                        height={20}
                        className="rounded-xs object-cover"
                      />
                      <span className="text-[10px] font-semibold text-emerald-200">
                        {placed.cardName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Marker>
          );
        })}
      </Map>
    </div>
  );
}

