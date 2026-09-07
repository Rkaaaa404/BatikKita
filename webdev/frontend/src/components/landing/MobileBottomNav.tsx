"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Gamepad2,
  Scan,
  MessageSquare,
  BookOpen,
  Layers,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Beranda", icon: Home, exact: true },
  { href: "/play", label: "Arcade", icon: Gamepad2, exact: true },
  { href: "/scan", label: "Lens", icon: Scan },
  { href: "/chat", label: "Ask", icon: MessageSquare },
  { href: "/batikpedia", label: "Pedia", icon: BookOpen },
  { href: "/collection", label: "Koleksi", icon: Layers },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  // Hide mobile bottom dock inside active mini-game boards so the full screen belongs to the game
  const isPlayingGame =
    pathname?.startsWith("/play/cap") ||
    pathname?.startsWith("/play/zoom") ||
    pathname?.startsWith("/play/guess") ||
    pathname?.startsWith("/play/map");

  if (isPlayingGame) {
    return null;
  }

  const isItemActive = (item: NavItem) => {
    if (!pathname) return false;
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <nav
      aria-label="Navigasi Bawah Mobile"
      className="md:hidden fixed bottom-3 inset-x-3 z-40 transition-all duration-300 pointer-events-auto"
    >
      <div className="max-w-md mx-auto bg-[#1A1614]/92 backdrop-blur-xl border border-[#D4AF37]/35 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.45)] px-2 py-1.5 flex items-center justify-between">
        {NAV_ITEMS.map((item) => {
          const active = isItemActive(item);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 relative ${
                active
                  ? "text-[#D4AF37] font-bold"
                  : "text-white/65 hover:text-white"
              }`}
            >
              {/* Active Golden Glow Pill Indicator */}
              {active && (
                <span className="absolute inset-0 bg-[#D4AF37]/15 rounded-xl border border-[#D4AF37]/30 shadow-[0_0_12px_rgba(212,175,55,0.25)]" />
              )}

              <Icon
                className={`w-4 h-4 mb-0.5 transition-transform duration-200 relative z-10 ${
                  active ? "scale-110 drop-shadow-[0_0_6px_rgba(212,175,55,0.6)]" : ""
                }`}
              />
              <span className="text-[10px] font-display tracking-tight truncate max-w-[50px] text-center relative z-10">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
