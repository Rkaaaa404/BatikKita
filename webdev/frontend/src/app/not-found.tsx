import React from "react";
import Link from "next/link";
import { Compass, BookOpen, Scan, Gamepad2, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#1A1614] flex items-center justify-center p-4 sm:p-6 font-body text-white selection:bg-[#D4AF37] selection:text-[#1A1614]">
      <div className="max-w-lg w-full bg-[#241F1C] border border-[#D4AF37]/30 rounded-3xl p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden">
        {/* Glow accents */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#D4AF37]/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#713f2c]/30 rounded-full blur-2xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-[#D4AF37]/40 flex items-center justify-center mx-auto mb-4 text-[#D4AF37] shadow-inner">
          <Compass className="w-8 h-8" />
        </div>

        <span className="text-xs font-display font-bold uppercase tracking-wider text-[#D4AF37] bg-white/5 border border-white/10 px-3 py-1 rounded-full inline-block mb-3">
          Galat 404 • Halaman Tidak Ditemukan
        </span>

        <h1 className="font-display font-bold text-2xl sm:text-3xl text-white mb-2">
          Lembaran Wastra Tak Ditemukan
        </h1>

        <p className="font-narrative text-xs sm:text-sm text-white/70 leading-relaxed mb-6">
          Halaman atau serat motif yang Anda tuju mungkin telah dipindahkan atau belum terpatri di pustaka wastra Batik Kita.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6 text-left">
          <Link
            href="/batikpedia"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
          >
            <BookOpen className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span className="text-xs font-display font-medium text-white/90">Batik Pedia</span>
          </Link>

          <Link
            href="/scan"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
          >
            <Scan className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span className="text-xs font-display font-medium text-white/90">Batik Lens AI</span>
          </Link>

          <Link
            href="/play"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
          >
            <Gamepad2 className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span className="text-xs font-display font-medium text-white/90">Edu-Arcade</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
          >
            <Home className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span className="text-xs font-display font-medium text-white/90">Beranda Utama</span>
          </Link>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#c59f2e] text-[#1A1614] font-display font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-all"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
