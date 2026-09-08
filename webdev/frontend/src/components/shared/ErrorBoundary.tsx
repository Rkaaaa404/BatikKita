"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] w-full flex items-center justify-center p-6 bg-[#faf8f4]">
          <div className="max-w-md w-full bg-white rounded-2xl border-2 border-[#713f2c]/30 shadow-xl p-6 sm:p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-50 border border-[#D4AF37] flex items-center justify-center mx-auto mb-4 text-[#713f2c] shadow-inner">
              <AlertTriangle className="w-8 h-8 text-[#D4AF37]" />
            </div>

            <span className="text-xs font-display font-bold uppercase tracking-wider text-[#713f2c] bg-amber-100/60 px-3 py-1 rounded-full inline-block mb-3">
              Kearifan Digital Mengalami Gangguan
            </span>

            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#2d2b38] mb-2">
              Nyuwun Sewu, Terjadi Kendala Tampilan
            </h2>

            <p className="font-narrative text-xs sm:text-sm text-[#8d786a] leading-relaxed mb-6">
              Sistem visual wastra mengalami hambatan sementara. Jangan khawatir, progres dan catatan budaya Anda tetap aman.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 bg-[#713f2c] hover:bg-[#583122] text-[#D4AF37] px-4 py-2.5 rounded-xl font-display font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Muat Ulang Halaman</span>
              </button>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-[#FAF8F4] hover:bg-stone-100 text-stone-700 border border-[#d3ccc2] px-4 py-2.5 rounded-xl font-display font-bold text-xs transition-all"
              >
                <Home className="w-4 h-4 text-[#713f2c]" />
                <span>Kembali ke Beranda</span>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
