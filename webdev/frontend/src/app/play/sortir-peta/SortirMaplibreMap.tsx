"use client";

import React, { useMemo, useState } from "react";
import Map, { Source, Layer, Marker, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import Image from "next/image";
import { Check } from "lucide-react";
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

type TileTheme = "dark" | "voyager" | "satellite";

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
  const [theme] = useState<TileTheme>("dark");
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);

  // Use Carto Raster tiles for Maplibre Map Style
  const mapStyle = useMemo(() => {
    return {
      version: 8,
      sources: {
        "carto-dark": {
          type: "raster",
          tiles: [
            "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
            "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
            "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
            "https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
          ],
          tileSize: 256,
          attribution: "&copy; OpenStreetMap, &copy; CARTO",
        },
      },
      layers: [
        {
          id: "carto-dark-layer",
          type: "raster",
          source: "carto-dark",
          minzoom: 0,
          maxzoom: 22,
        },
      ],
    };
  }, []);

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
      let fillOpacity = 0.15;
      let lineColor = "#D4AF37";
      let lineWidth = 1.5;

      if (placed || isFlashCorrect) {
        fillColor = "#10B981";
        fillOpacity = 0.35;
        lineColor = "#10B981";
        lineWidth = 2.5;
      } else if (isFlashWrong) {
        fillColor = "#EF4444";
        fillOpacity = 0.45;
        lineColor = "#EF4444";
        lineWidth = 3;
      } else if (isHovered || isSelected) {
        fillColor = "#60A5FA";
        fillOpacity = 0.4;
        lineColor = "#60A5FA";
        lineWidth = 3;
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
    <div className="w-full h-full relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#D4AF37]/20">
      <Map
        initialViewState={{
          longitude: 114.5,
          latitude: -4.5,
          zoom: 4,
        }}
        mapStyle={mapStyle as any}
        interactiveLayerIds={["regions-fill"]}
        onMouseMove={(e: any) => {
          if (e.features && e.features.length > 0) {
            const featureId = e.features[0].properties?.id;
            if (featureId && featureId !== hoveredRegionId) {
              setHoveredRegionId(featureId);
              onHoverRegionChange(featureId);
            }
          } else if (hoveredRegionId) {
            setHoveredRegionId(null);
            onHoverRegionChange(null);
          }
        }}
        onMouseLeave={() => {
          setHoveredRegionId(null);
          onHoverRegionChange(null);
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
        <Source type="geojson" data={interactiveGeoJson}>
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
                onMouseEnter={() => {
                  setHoveredRegionId(region.id);
                  onHoverRegionChange(region.id);
                }}
                onMouseLeave={() => {
                  setHoveredRegionId(null);
                  onHoverRegionChange(null);
                }}
              >
                {isHovered || isSelected ? (
                  <span className="absolute -inset-2.5 rounded-full bg-blue-400/40 animate-ping pointer-events-none"></span>
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
