"use client";

import React, { useMemo, useState, useRef, useCallback } from "react";
import Map, { Source, Layer, Marker, NavigationControl, MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import Image from "next/image";
import { Check, Layers } from "lucide-react";
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
  const [theme, setTheme] = useState<TileTheme>("dark");
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);

  const currentMapStyle = useMemo(() => BASEMAP_STYLES[theme], [theme]);

  // Prepare dynamic GeoJSON mapping properties for regions (color, opacity) based on state
  const interactiveGeoJson = useMemo(() => {
    const featureCollection = { ...(regionsGeoData as any) };
    featureCollection.features = featureCollection.features.map((feature: any) => {
      const regionId = feature.properties.id;
      const placed = !!placedItems[regionId];
      const isHovered = hoveredRegionId === regionId;
      const isSelected = selectedCard?.regionId === regionId;
      const isFlashCorrect = flashRegion?.id === regionId && flashRegion?.status === "correct";
      const isFlashWrong = flashRegion?.id === regionId && flashRegion?.status === "wrong";

      let fillColor = "#D4AF37";
      let fillOpacity = 0.2;
      let lineColor = "#D4AF37";
      let lineWidth = 2;

      if (placed || isFlashCorrect) {
        fillColor = "#10B981";
        fillOpacity = 0.45;
        lineColor = "#34D399";
        lineWidth = 3;
      } else if (isFlashWrong) {
        fillColor = "#EF4444";
        fillOpacity = 0.55;
        lineColor = "#F87171";
        lineWidth = 3.5;
      } else if (isHovered || isSelected) {
        fillColor = "#3B82F6";
        fillOpacity = 0.5;
        lineColor = "#60A5FA";
        lineWidth = 3.5;
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

  const handleRegionHover = useCallback(
    (id: string | null) => {
      setHoveredRegionId(id);
      onHoverRegionChange(id);
    },
    [onHoverRegionChange]
  );

  return (
    <div className="w-full h-[460px] sm:h-[520px] md:h-[580px] relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#D4AF37]/30 bg-[#141211]">
      {/* Map Tile Switcher */}
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

      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 114.5,
          latitude: -4.5,
          zoom: 4.3,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={currentMapStyle}
        interactiveLayerIds={["regions-fill"]}
        onMouseMove={(e: any) => {
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
          handleRegionHover(null);
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

        {/* Polygons */}
        <Source id="regions-source" type="geojson" data={interactiveGeoJson}>
          <Layer
            id="regions-fill"
            type="fill"
            paint={{
              "fill-color": ["get", "fillColor"],
              "fill-opacity": ["get", "fillOpacity"],
            }}
          />
          <Layer
            id="regions-line"
            type="line"
            paint={{
              "line-color": ["get", "lineColor"],
              "line-width": ["get", "lineWidth"],
              "line-opacity": 0.9,
            }}
          />
        </Source>

        {/* Markers */}
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
              }}
            >
              <div
                className="relative flex flex-col items-center group cursor-pointer"
                onMouseEnter={() => handleRegionHover(region.id)}
                onMouseLeave={() => handleRegionHover(null)}
              >
                {isHovered || isSelected ? (
                  <span className="absolute -inset-2.5 rounded-full bg-blue-400/40 animate-ping pointer-events-none" />
                ) : null}
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-xl transition-all duration-200 ${
                    placed || isFlashCorrect
                      ? "bg-emerald-500 border-white text-white shadow-emerald-500/50 scale-110"
                      : isFlashWrong
                      ? "bg-red-500 border-white text-white shadow-red-500/50 scale-95"
                      : isHovered
                      ? "bg-blue-500 border-white text-white shadow-blue-500/50 scale-110"
                      : "bg-[#1E293B] border-[#D4AF37] text-[#D4AF37] shadow-black/50"
                  }`}
                >
                  {placed || isFlashCorrect ? (
                    <Check className="w-4 h-4" strokeWidth={3} />
                  ) : (
                    <span className="font-display font-bold text-xs">
                      {region.shortName.charAt(0)}
                    </span>
                  )}
                </div>
                <div
                  className={`absolute top-full mt-2 flex flex-col items-center pointer-events-none transition-all duration-200 ${
                    isHovered || isSelected || placed ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                  }`}
                >
                  <div
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shadow-xl border backdrop-blur-md ${
                      placed || isFlashCorrect
                        ? "bg-emerald-900/90 border-emerald-500/50 text-emerald-300"
                        : "bg-[#0F172A]/90 border-[#D4AF37]/30 text-[#D4AF37]"
                    }`}
                  >
                    {region.shortName}
                  </div>
                  {placed && (
                    <div className="mt-1 flex items-center gap-2 bg-[#0F172A]/90 border border-emerald-500/30 px-2 py-1 rounded-md shadow-xl backdrop-blur-md animate-in slide-in-from-top-2">
                      <Image
                        src={placed.cardImage}
                        alt={placed.cardName}
                        width={24}
                        height={24}
                        className="rounded-sm object-cover"
                      />
                      <span className="text-[10px] font-medium text-emerald-200">
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

