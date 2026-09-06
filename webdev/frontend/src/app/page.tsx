"use client";

import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { ArcadePreview } from "@/components/landing/ArcadePreview";
import { InteractivePreview } from "@/components/landing/InteractivePreview";
import { BatikpediaTeaser } from "@/components/landing/BatikpediaTeaser";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#faf8f4]">
      {/* 1. Global Navigation Bar */}
      <Navbar />

      {/* 2. Hero Section: full editorial layout */}
      <HeroSection />

      {/* 3. The 3 Pillars Feature Cards */}
      <FeatureGrid />

      {/* 4. Edu-Games Arcade Interactive Preview */}
      <ArcadePreview />

      {/* 5. Batik Ask + AI Scanner Interactive Preview */}
      <InteractivePreview />

      {/* 5. Batikpedia Heritage Cards Collection */}
      <BatikpediaTeaser />

      {/* 6. Footer */}
      <Footer />
    </main>
  );
}
