"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function GlobalRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route Error caught by Next.js error.tsx:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center p-4 sm:p-6 font-body text-[#2d2b38]">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#713f2c]/20 shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-amber-50 border border-[#D4AF37] flex items-center justify-center mx-auto mb-4 shadow-sm">
          <AlertCircle className="w-8 h-8 text-[#713f2c]" />
        </div>

        <span className="text-xs font-display font-bold uppercase tracking-wider text-[#713f2c] bg-amber-100/70 px-3 py-1 rounded-full inline-block mb-3">
          Galat Sistem Budaya
        </span>

        <h1 className="font-display font-bold text-2xl text-[#2d2b38] mb-2">
          Terjadi Gangguan Penyelaman Wastra
        </h1>

        <p className="font-narrative text-xs sm:text-sm text-[#8d786a] leading-relaxed mb-6">
          Maaf atas ketidaknyamanan ini. Terjadi kesalahan pada alur data. Anda dapat mencoba memulihkan kondisi saat ini atau kembali ke beranda.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 bg-[#713f2c] hover:bg-[#583122] text-[#D4AF37] px-4 py-2.5 rounded-xl font-display font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Coba Lagi</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#FAF8F4] hover:bg-stone-100 text-stone-700 border border-[#d3ccc2] px-4 py-2.5 rounded-xl font-display font-bold text-xs transition-all"
          >
            <Home className="w-4 h-4 text-[#713f2c]" />
            <span>Beranda Batik Kita</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
