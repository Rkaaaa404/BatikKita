"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Upload, ArrowLeft, Scan, RefreshCw, X, FileImage, Sparkles, MapPin, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ScannerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const startScan = () => {
    setIsScanning(true);
    // Mock processing delay
    setTimeout(() => {
      setIsScanning(false);
      setResult({
        name: "Mega Mendung",
        accuracy: 94,
        region: "Cirebon, Jawa Barat",
        category: "Pesisiran",
        philosophy: "Melambangkan kesabaran, ketenangan jiwa laksana awan penyejuk di tengah terik matahari. Motif ini banyak dipengaruhi oleh budaya Tiongkok yang masuk ke Cirebon.",
        usage: "Sangat luwes, pantas untuk busana kerja, santai, maupun pesta.",
      });
    }, 3000);
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setIsScanning(false);
  };

  return (
    <div className="min-h-screen bg-[#faf8f4] font-body text-[#2d2b38] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#d3ccc2] px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/" className="w-10 h-10 rounded-full bg-[#f5f3ef] flex items-center justify-center text-[#713f2c] hover:bg-[#e8e5df] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-display font-bold text-xl text-[#713f2c]">AI Batik Lens</h1>
            <p className="text-xs text-[#8d786a]">Pemindai Motif Instan</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-[#D4AF37]/10 px-3 py-1.5 rounded-full border border-[#D4AF37]/30">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-xs font-display font-bold text-[#713f2c]">Powered by Gemini 1.5</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {!preview ? (
            /* ─── UPLOAD STATE ─── */
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl"
            >
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-[#d3ccc2] rounded-3xl bg-white p-12 text-center hover:bg-[#f5f3ef]/50 hover:border-[#713f2c]/40 transition-all cursor-pointer shadow-sm group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-20 h-20 bg-[#713f2c]/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Scan className="w-10 h-10 text-[#713f2c]" />
                </div>
                <h2 className="font-display font-bold text-2xl text-[#2d2b38] mb-2">Unggah Foto Batik</h2>
                <p className="text-[#8d786a] mb-8 max-w-sm mx-auto">
                  Tarik dan lepas gambar kain batik ke area ini, atau klik tombol di bawah untuk memilih file.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button className="flex items-center gap-2 bg-[#713f2c] text-[#faf8f4] px-6 py-3 rounded-xl font-display font-bold text-sm hover:bg-[#583122] transition-colors shadow-md">
                    <Upload className="w-4 h-4" />
                    Pilih File Foto
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); /* mock open camera */ }}
                    className="flex items-center gap-2 bg-white text-[#713f2c] border border-[#d3ccc2] px-6 py-3 rounded-xl font-display font-bold text-sm hover:bg-[#f5f3ef] transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    Buka Kamera
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </motion.div>
          ) : (
            /* ─── SCANNING & RESULT STATE ─── */
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
            >
              {/* Image Column */}
              <div className="relative rounded-3xl overflow-hidden bg-black/5 aspect-square border border-[#d3ccc2] shadow-sm">
                <Image src={preview} alt="Batik Preview" fill className="object-cover" />
                
                {/* Scanner Animation Overlay */}
                {isScanning && (
                  <>
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
                    <motion.div
                      className="absolute left-0 right-0 h-1 bg-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,1)] z-10"
                      initial={{ top: "0%" }}
                      animate={{ top: "100%" }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="bg-black/60 text-white font-display font-bold px-6 py-3 rounded-full flex items-center gap-3 backdrop-blur-md">
                        <RefreshCw className="w-5 h-5 animate-spin text-[#D4AF37]" />
                        Menganalisis Pola...
                      </div>
                    </div>
                  </>
                )}

                {!isScanning && (
                  <button
                    onClick={reset}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-colors z-20"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Result Column */}
              <div className="flex flex-col">
                {!isScanning && !result ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border border-[#d3ccc2] shadow-sm min-h-[400px]">
                    <FileImage className="w-12 h-12 text-[#8d786a] mb-4 opacity-50" />
                    <h3 className="font-display font-bold text-xl text-[#2d2b38] mb-2">Foto Siap Dipindai</h3>
                    <p className="text-[#8d786a] mb-6 text-sm">
                      AI kami akan mendeteksi geometri, pola isen-isen, dan mencocokkannya dengan database motif nusantara.
                    </p>
                    <button
                      onClick={startScan}
                      className="w-full flex items-center justify-center gap-2 bg-[#713f2c] text-[#D4AF37] px-6 py-4 rounded-xl font-display font-bold text-base hover:bg-[#583122] transition-colors shadow-md group"
                    >
                      <Scan className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Pindai Sekarang
                    </button>
                  </div>
                ) : result ? (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-3xl border border-[#d3ccc2] shadow-sm overflow-hidden"
                  >
                    {/* Result Header */}
                    <div className="bg-[#713f2c] p-6 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Sparkles className="w-24 h-24" />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-[#D4AF37] text-[#2d2b38] text-[10px] font-display font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Confidence: {result.accuracy}%
                        </span>
                        <span className="bg-white/20 text-white text-[10px] font-display font-bold px-2 py-0.5 rounded-full">
                          {result.category}
                        </span>
                      </div>
                      <h2 className="font-display font-bold text-3xl mb-1">{result.name}</h2>
                      <div className="flex items-center gap-1.5 text-white/80 text-sm">
                        <MapPin className="w-4 h-4" />
                        {result.region}
                      </div>
                    </div>

                    {/* Result Body */}
                    <div className="p-6 space-y-6">
                      <div>
                        <h4 className="font-display font-bold text-[#713f2c] text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                          <Search className="w-4 h-4" />
                          Filosofi & Makna
                        </h4>
                        <p className="text-[#2d2b38] text-sm leading-relaxed">
                          {result.philosophy}
                        </p>
                      </div>
                      <div className="h-px bg-[#d3ccc2]/50" />
                      <div>
                        <h4 className="font-display font-bold text-[#713f2c] text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          Konteks Pemakaian
                        </h4>
                        <p className="text-[#2d2b38] text-sm leading-relaxed">
                          {result.usage}
                        </p>
                      </div>

                      <div className="pt-4 flex items-center gap-3">
                        <button className="flex-1 bg-[#f5f3ef] text-[#713f2c] font-display font-bold text-sm py-3 rounded-xl hover:bg-[#e8e5df] transition-colors border border-[#d3ccc2]">
                          Simpan ke Koleksi
                        </button>
                        <Link href="/chat" className="flex-1 text-center bg-[#713f2c] text-[#D4AF37] font-display font-bold text-sm py-3 rounded-xl hover:bg-[#583122] transition-colors shadow-sm">
                          Tanya Sang Empu
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
