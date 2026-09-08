"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Camera,
  Upload,
  Scan,
  RefreshCw,
  X,
  FileImage,
  Sparkles,
  MapPin,
  Search,
  ArrowRight,
  MessageSquare,
  FlipHorizontal,
  AlertCircle,
  Cpu,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { AudioNarratorButton } from "@/components/shared/AudioNarratorButton";
import {
  classifyBatikImage,
  preloadClassifier,
  ClassificationResult,
} from "@/lib/onnxClassifier";

interface MotifData {
  name: string;
  accuracy: number;
  region: string;
  category: string;
  philosophy: string;
  usage: string;
  image: string;
}

const SAMPLE_PRESETS: MotifData[] = [
  {
    name: "Mega Mendung",
    accuracy: 96,
    region: "Cirebon, Jawa Barat",
    category: "Batik Pesisiran",
    philosophy:
      "Melambangkan kesabaran, kesejukan hati, dan ketenangan jiwa laksana awan penyejuk di tengah terik matahari. Motif ini banyak dipengaruhi oleh budaya Tiongkok yang berbaur dengan tradisi Cirebon.",
    usage: "Sangat luwes, pantas untuk busana kerja, santai, maupun perhelatan resmi kontemporer.",
    image: "/images/motifs/batik_mega_mendung_v2.webp",
  },
  {
    name: "Parang Rusak Barong",
    accuracy: 98,
    region: "D.I. Yogyakarta",
    category: "Batik Keraton (Batik Larangan)",
    philosophy:
      "Garis diagonal ombak tak terputus yang melambangkan semangat pantang menyerah, keteguhan ksatria, serta kesinambungan budi pekerti luhur pemimpin.",
    usage: "Sangat elok untuk upacara kenegaraan, perhelatan pernikahan sakral, dan wisuda.",
    image: "/images/motifs/batik_parang.webp",
  },
  {
    name: "Kawung Picis",
    accuracy: 95,
    region: "D.I. Yogyakarta",
    category: "Batik Keraton",
    philosophy:
      "Empat kelopak buah aren yang merefleksikan empat penjuru mata angin (sedulur papat lima pancer), melambangkan kesucian niat, pengendalian hawa nafsu, dan kemurnian hati.",
    usage: "Serasi dikenakan dalam upacara adat formal, pertemuan dinas, dan silaturahmi budaya.",
    image: "/images/motifs/batik_kawung.webp",
  },
];

export default function ScannerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<string>("Menganalisis Geometri & Isen-isen...");
  const [result, setResult] = useState<MotifData | null>(null);
  const [aiResult, setAiResult] = useState<ClassificationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preload EfficientNet-B0 ONNX model in browser background
  useEffect(() => {
    preloadClassifier();
  }, []);

  // ─── Camera States ───
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mobileCameraInputRef = useRef<HTMLInputElement | null>(null);

  // Effect to manage live media stream with device enumeration
  useEffect(() => {
    if (!isCameraOpen) return;

    let active = true;
    let currentStream: MediaStream | null = null;

    async function initCamera() {
      setCameraError(null);
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Peramban Anda tidak mendukung akses kamera langsung.");
        }

        // Build soft video constraint that never crashes on laptop
        let videoConstraint: MediaTrackConstraints | boolean = true;
        if (selectedDeviceId) {
          videoConstraint = { deviceId: { exact: selectedDeviceId } };
        } else {
          // Use 'ideal' facingMode so laptop front camera or phone rear camera works automatically
          videoConstraint = {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          };
        }

        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: videoConstraint,
            audio: false,
          });
        } catch (constraintErr) {
          console.warn("Soft constraint failed, trying basic video: true", constraintErr);
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }

        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        currentStream = stream;
        streamRef.current = stream;

        // Enumerate video devices so user can pick between laptop webcam and external/phone camera
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInputs = devices.filter((d) => d.kind === "videoinput");
          if (active) {
            setAvailableDevices(videoInputs);
            const activeTrack = stream.getVideoTracks()[0];
            if (activeTrack) {
              const activeId = activeTrack.getSettings().deviceId;
              if (activeId && !selectedDeviceId) {
                setSelectedDeviceId(activeId);
              }
            }
          }
        } catch (enumErr) {
          console.warn("Could not enumerate devices:", enumErr);
        }

        // Attach stream and play safely
        if (videoRef.current) {
          const video = videoRef.current;
          video.muted = true;
          video.defaultMuted = true;
          video.setAttribute("playsinline", "true");
          video.setAttribute("muted", "true");
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            if (active) {
              video.play().catch((err) => console.warn("Video play error:", err));
            }
          };
        }
      } catch (err: unknown) {
        if (!active) return;
        console.error("Camera access error:", err);
        const errObj = err as Error;
        if (errObj.name === "NotAllowedError" || errObj.name === "PermissionDeniedError") {
          setCameraError("Izin kamera ditolak. Silakan klik ikon gembok/kamera di address bar peramban untuk mengizinkan akses kamera.");
        } else if (errObj.name === "NotFoundError" || errObj.name === "DevicesNotFoundError") {
          setCameraError("Perangkat kamera tidak ditemukan. Pastikan webcam laptop aktif atau tidak sedang ditutup penutup privasi (privacy shutter).");
        } else if (errObj.name === "NotReadableError" || errObj.name === "TrackStartError") {
          setCameraError("Kamera sedang digunakan oleh aplikasi lain (seperti Zoom/Teams/Kamera Windows). Harap tutup aplikasi tersebut lalu coba lagi.");
        } else {
          setCameraError(`Tidak dapat mengakses kamera (${errObj.message || "Error"}). Silakan gunakan opsi Kamera HP atau unggah foto.`);
        }
      }
    }

    initCamera();

    return () => {
      active = false;
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isCameraOpen, facingMode, selectedDeviceId]);

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);

    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      setIsCameraOpen(false);
      setPreview(dataUrl);
      setResult(null);
      setAiResult(null);

      fetch(dataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const capturedFile = new File([blob], "foto-batik-kamera.jpg", {
            type: "image/jpeg",
          });
          setFile(capturedFile);
          triggerScan(capturedFile);
        })
        .catch((e) => {
          console.warn("Blob conversion error:", e);
          triggerScan(dataUrl);
        });
    }, 200);
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
    setCameraError(null);
  };

  const switchCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  const openCamera = () => {
    // If device/browser has no getUserMedia support, trigger camera input directly
    if (typeof navigator !== "undefined" && (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)) {
      mobileCameraInputRef.current?.click();
      return;
    }
    setIsCameraOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setPreview(url);
      setResult(null);
      setAiResult(null);
      triggerScan(selected);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setPreview(url);
      setResult(null);
      setAiResult(null);
      triggerScan(selected);
    }
  };

  const handleSelectPreset = (preset: MotifData) => {
    setFile(null);
    setPreview(preset.image);
    setResult(null);
    setAiResult(null);
    triggerScan(preset.image, preset);
  };

  const triggerScan = async (
    sourceImage?: string | File | Blob | null,
    predefinedResult?: MotifData
  ) => {
    setIsScanning(true);
    setScanStatus("Menyiapkan Neural Network EfficientNet-B0...");

    try {
      const target = sourceImage || file || preview;
      if (target) {
        setScanStatus("Menganalisis Geometri, Kontur & Isen-isen (ONNX)...");
        const classification = await classifyBatikImage(target);
        setAiResult(classification);

        const top = classification.top1;
        const motifInfo = top.motif;

        const detectedData: MotifData = {
          name: motifInfo ? motifInfo.fullName : top.name,
          accuracy: Math.max(1, Math.min(99, Math.round(top.confidence))),
          region: motifInfo?.region || "Nusantara",
          category: motifInfo?.category || "Batik Nusantara",
          philosophy:
            motifInfo?.philosophy ||
            "Kain batik bernilai luhur yang merefleksikan keanggunan dan kearifan budaya Nusantara.",
          usage:
            motifInfo?.usage ||
            "Sangat luwes dikenakan untuk upacara resmi kenegaraan, perhelatan adat sakral, maupun busana etnik modern.",
          image: preview || motifInfo?.image || "/images/motifs/batik_mega_mendung_v2.webp",
        };

        setResult(detectedData);
      } else if (predefinedResult) {
        setResult(predefinedResult);
      } else {
        setResult(SAMPLE_PRESETS[0]);
      }
    } catch (err) {
      console.warn("ONNX inference fallback to preset:", err);
      if (predefinedResult) {
        setResult(predefinedResult);
      } else {
        setResult(SAMPLE_PRESETS[0]);
      }
    } finally {
      setIsScanning(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setAiResult(null);
    setIsScanning(false);
  };

  return (
    <div className="min-h-screen bg-[#faf8f4] font-body text-[#2d2b38] flex flex-col">
      {/* Global Navbar */}
      <Navbar variant="transparent" />

      <main className="flex-1">
        {/* ─── Hero Section with Dedicated Batik Tab Scanner.webp ─── */}
        <section className="relative w-full overflow-hidden bg-[#1A1614] pt-24 pb-12 sm:pt-32 sm:pb-20 px-4 sm:px-6 lg:px-16 min-h-0 lg:min-h-[520px] flex items-center">
          {/* Background Image: batik-tab-batik-lens.webp */}
          <Image
            src="/images/batik-tab-batik-lens.webp"
            alt="AI Batik Lens Scanner"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          {/* Contrast overlays for text legibility & smooth page transition */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/85 z-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1614] via-transparent to-black/60 z-0" />

          {/* Golden glow */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none z-0" />

          <div className="max-w-[1280px] mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 text-left">
              <div className="flex items-center gap-2 sm:gap-2.5 mb-3 sm:mb-5">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
              <span className="text-white/90 font-display text-xs sm:text-sm font-medium tracking-wide">
                Edge AI Classifier • On-Device Inference
              </span>
            </div>

            <h1 className="font-display font-bold text-2xl xs:text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-3 sm:mb-4">
              <span className="font-philosopher tracking-wide">Batik Lens:</span>
              <br />
              <span
                style={{
                  color: "#D4AF37",
                  textShadow: "0 2px 20px rgba(212,175,55,0.4)",
                }}
              >
                Identifikasi Motif
              </span>{" "}
              Instan
            </h1>

            <p className="font-narrative text-sm sm:text-base lg:text-lg text-white/80 max-w-xl leading-relaxed mb-4 sm:mb-6">
              Arahkan kamera atau unggah foto kain batik Anda. Model Edge AI memproses citra langsung di perangkat Anda tanpa mengunggah foto ke server luar.
            </p>
            </div>
          </div>
        </section>

        {/* ─── Scanner Workspace ─── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-24 md:pb-12">
          {/* Preset Sample Motifs Bar */}
          <div className="mb-6 sm:mb-10 bg-white border border-[#d3ccc2]/80 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
              <div>
                <span className="text-xs font-display font-bold text-[#713f2c] uppercase tracking-wider block">
                  Uji Coba Cepat
                </span>
                <p className="font-narrative text-xs text-[#8d786a]">
                  Pilih salah satu sampel motif batik nusantara di bawah untuk langsung menguji scanner:
                </p>
              </div>
              <span className="text-[10px] sm:text-[11px] font-display text-[#8d786a] bg-[#faf8f4] border border-[#d3ccc2] px-3 py-1 rounded-full self-start sm:self-auto shrink-0">
                3 Sampel Terverifikasi
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {SAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="flex items-center gap-3 p-2 sm:p-2.5 rounded-xl border border-[#d3ccc2]/70 hover:border-[#713f2c] hover:bg-[#faf8f4] transition-all text-left group bg-white shadow-xs active:scale-98"
                >
                  <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-lg overflow-hidden shrink-0 border border-[#d3ccc2]">
                    <Image
                      src={preset.image}
                      alt={preset.name}
                      fill
                      sizes="48px"
                      className="object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-display font-bold text-xs text-[#2d2b38] group-hover:text-[#713f2c] truncate">
                      {preset.name}
                    </h4>
                    <p className="font-narrative text-[11px] text-[#8d786a] truncate">
                      {preset.region}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Upload or Result Container */}
          <AnimatePresence mode="wait">
            {!preview ? (
              /* ─── UPLOAD STATE ─── */
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full"
              >
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#713f2c]/30 hover:border-[#D4AF37] rounded-2xl sm:rounded-3xl bg-white p-6 sm:p-12 text-center hover:bg-[#FFF8E7]/30 transition-all cursor-pointer shadow-md group relative overflow-hidden"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#713f2c]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 group-hover:bg-[#713f2c] group-hover:text-[#D4AF37] text-[#713f2c] transition-all duration-300 shadow-sm">
                    <Scan className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>

                  <h2 className="font-display font-bold text-xl sm:text-2xl sm:text-3xl text-[#2d2b38] mb-2 sm:mb-3">
                    Unggah atau Foto Kain Batik
                  </h2>
                  <p className="font-narrative text-xs sm:text-sm sm:text-base text-[#8d786a] mb-6 sm:mb-8 max-w-md mx-auto leading-relaxed">
                    Mendukung format JPG, PNG, atau WEBP. Pastikan pencahayaan cukup dan pola kain terlihat jelas.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-3.5 max-w-xl mx-auto w-full">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openCamera();
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#713f2c] text-[#D4AF37] border border-[#D4AF37]/50 px-6 py-3.5 rounded-xl font-display font-bold text-sm hover:bg-[#583122] transition-all shadow-md cursor-pointer group active:scale-98"
                    >
                      <Camera className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                      <span>Buka Kamera</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#713f2c] border border-[#d3ccc2] px-6 py-3.5 rounded-xl font-display font-bold text-sm hover:bg-[#faf8f4] transition-colors shadow-xs cursor-pointer hover:border-[#713f2c] active:scale-98"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Pilih dari Perangkat</span>
                    </button>
                  </div>

                  {/* Standard file picker input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                  {/* Native mobile camera capture input (Directly opens camera app on phone/tablet) */}
                  <input
                    type="file"
                    ref={mobileCameraInputRef}
                    className="hidden"
                    accept="image/*"
                    capture="environment"
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
                className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                {/* Image Column */}
                <div className="lg:col-span-5 relative rounded-3xl overflow-hidden bg-black/5 aspect-square border border-[#d3ccc2] shadow-lg">
                  <Image
                    src={preview}
                    alt="Batik Preview"
                    fill
                    sizes="(max-width: 1024px) 100vw, 420px"
                    className="object-cover"
                  />

                  {/* Scanner Animation Overlay */}
                  {isScanning && (
                    <>
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                      <motion.div
                        className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent shadow-[0_0_20px_rgba(212,175,55,1)] z-10"
                        initial={{ top: "0%" }}
                        animate={{ top: "100%" }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="bg-black/85 text-white font-display font-bold px-6 py-3.5 rounded-full flex items-center gap-3 backdrop-blur-md border border-[#D4AF37]/40 shadow-2xl">
                          <RefreshCw className="w-5 h-5 animate-spin text-[#D4AF37]" />
                          <span>{scanStatus}</span>
                        </div>
                      </div>
                    </>
                  )}

                  {!isScanning && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                      <button
                        type="button"
                        onClick={() => setIsCameraOpen(true)}
                        className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-colors shadow-md cursor-pointer"
                        title="Buka Kamera Lagi"
                      >
                        <Camera className="w-5 h-5 text-[#D4AF37]" />
                      </button>
                      <button
                        type="button"
                        onClick={reset}
                        className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-colors shadow-md cursor-pointer"
                        title="Ganti Foto"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Result Column */}
                <div className="lg:col-span-7 flex flex-col">
                  {!isScanning && !result ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-3xl border border-[#d3ccc2] shadow-sm min-h-[420px]">
                      <div className="w-16 h-16 rounded-2xl bg-[#713f2c]/10 flex items-center justify-center text-[#713f2c] mb-5">
                        <FileImage className="w-8 h-8" />
                      </div>
                      <h3 className="font-display font-bold text-2xl text-[#2d2b38] mb-2">
                        Foto Siap Dianalisis
                      </h3>
                      <p className="font-narrative text-[#8d786a] mb-8 max-w-sm text-sm leading-relaxed">
                        Algoritma Multimodal Vision kami akan mencocokkan kontur visual dengan database ragam hias budaya Nusantara.
                      </p>
                      <button
                        type="button"
                        onClick={() => triggerScan()}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#713f2c] text-[#D4AF37] px-8 py-4 rounded-xl font-display font-bold text-base hover:bg-[#583122] transition-colors shadow-md group"
                      >
                        <Scan className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Mulai Analisis Batik Lens
                      </button>
                    </div>
                  ) : result ? (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white rounded-3xl border border-[#d3ccc2] shadow-xl overflow-hidden"
                    >
                      {/* Result Header */}
                      <div className="bg-[#713f2c] p-6 sm:p-7 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                          <Sparkles className="w-32 h-32" />
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-[#D4AF37] text-[#2d2b38] text-[10px] font-display font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                            Akurasi AI: {result.accuracy}%
                          </span>
                          <span className="bg-white/20 text-white text-[10px] font-display font-bold px-3 py-1 rounded-full">
                            {result.category}
                          </span>
                        </div>

                        <h2 className="font-display font-bold text-3xl sm:text-4xl mb-2 text-white">
                          {result.name}
                        </h2>
                        <div className="flex items-center gap-1.5 text-white/80 text-sm font-body">
                          <MapPin className="w-4 h-4 text-[#D4AF37]" />
                          <span>Sentra Asal: <strong>{result.region}</strong></span>
                        </div>
                      </div>

                      {/* Result Body */}
                      <div className="p-6 sm:p-7 space-y-6">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <h4 className="font-display font-bold text-[#713f2c] text-xs uppercase tracking-wider flex items-center gap-2">
                              <Search className="w-4 h-4 text-[#D4AF37]" />
                              Filosofi & Makna Kultural
                            </h4>
                            <AudioNarratorButton
                              text={result.philosophy}
                              title={result.name}
                              variant="compact"
                            />
                          </div>
                          <p className="font-narrative text-[#2d2b38] text-sm sm:text-base leading-relaxed">
                            {result.philosophy}
                          </p>
                        </div>

                        <div className="h-px bg-[#d3ccc2]/60" />

                        <div>
                          <h4 className="font-display font-bold text-[#713f2c] text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                            Konteks & Rekomendasi Pemakaian
                          </h4>
                          <p className="font-narrative text-[#2d2b38] text-sm leading-relaxed">
                            {result.usage}
                          </p>
                        </div>

                        {/* AI Top-3 Probabilities & Model Telemetry */}
                        {aiResult && (
                          <div className="bg-[#FAF8F4] border border-[#d3ccc2]/80 rounded-2xl p-5 space-y-3.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Cpu className="w-4 h-4 text-[#713f2c]" />
                                <span className="text-xs font-display font-bold text-[#2d2b38] uppercase tracking-wider">
                                  Top-3 Analisis Probabilitas Motif
                                </span>
                              </div>
                              <span
                                className="text-[11px] font-mono text-[#713f2c] bg-[#713f2c]/10 px-2.5 py-0.5 rounded-md font-semibold flex items-center gap-1 cursor-help"
                                title={`Inferensi Model Murni (Forward Pass): ${aiResult.inferenceTimeMs}ms | Pra-pemrosesan Citra: ${aiResult.preprocessTimeMs}ms | Total Latensi: ${aiResult.totalTimeMs}ms`}
                              >
                                <Zap className="w-3 h-3 text-[#D4AF37]" />
                                {aiResult.inferenceTimeMs}ms • Inferensi On-Device
                              </span>
                            </div>

                            <div className="space-y-2.5">
                              {aiResult.top3.map((pred, idx) => {
                                const isPrimary = idx === 0;
                                return (
                                  <div key={pred.classId} className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                      <span className={`font-display ${isPrimary ? "font-bold text-[#713f2c]" : "font-medium text-[#5c544d]"}`}>
                                        {idx + 1}. {pred.name} {isPrimary && <span className="text-[10px] text-[#D4AF37] font-semibold ml-1">(Prediksi Utama)</span>}
                                      </span>
                                      <span className={`font-mono text-xs ${isPrimary ? "font-bold text-[#713f2c]" : "text-[#8d786a]"}`}>
                                        {pred.confidence.toFixed(1)}%
                                      </span>
                                    </div>
                                    <div className="h-2 w-full bg-[#e8e4dc] rounded-full overflow-hidden">
                                      <div
                                        className={`h-full rounded-full transition-all duration-500 ${
                                          isPrimary
                                            ? "bg-gradient-to-r from-[#D4AF37] to-[#713f2c]"
                                            : "bg-[#b8aba0]"
                                        }`}
                                        style={{ width: `${Math.max(4, Math.min(100, pred.confidence))}%` }}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                          <Link
                            href="/chat"
                            className="w-full sm:flex-1 text-center inline-flex items-center justify-center gap-2 bg-[#713f2c] text-[#D4AF37] font-display font-bold text-sm py-3.5 px-4 rounded-xl hover:bg-[#583122] transition-colors shadow-sm"
                          >
                            <MessageSquare className="w-4 h-4" />
                            Batik Ask - Tanya Lebih Lanjut
                          </Link>
                          <Link
                            href="/play"
                            className="w-full sm:flex-1 text-center inline-flex items-center justify-center gap-2 bg-[#f5f3ef] text-[#713f2c] font-display font-bold text-sm py-3.5 px-4 rounded-xl hover:bg-[#e8e5df] transition-colors border border-[#d3ccc2]"
                          >
                            Mainkan di Arcade
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* ─── LIVE CAMERA MODAL / VIEWFINDER ─── */}
      <AnimatePresence>
        {isCameraOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={closeCamera}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#1A1614] border-2 border-[#D4AF37]/40 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Camera Header */}
              <div className="px-5 py-3.5 bg-black/50 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-white">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-display font-bold uppercase tracking-wider text-[#D4AF37]">
                    Kamera Batik Lens
                  </span>
                </div>

                {/* Device Selector & Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Select device dropdown if multiple cameras detected */}
                  {availableDevices.length > 1 && (
                    <select
                      value={selectedDeviceId}
                      onChange={(e) => setSelectedDeviceId(e.target.value)}
                      className="bg-white/10 text-white text-[11px] font-display rounded-lg px-2 py-1 border border-white/20 focus:outline-none focus:border-[#D4AF37] max-w-[140px] truncate"
                    >
                      {availableDevices.map((dev, idx) => (
                        <option
                          key={dev.deviceId || idx}
                          value={dev.deviceId}
                          className="bg-[#1A1614] text-white"
                        >
                          {dev.label || `Kamera ${idx + 1}`}
                        </option>
                      ))}
                    </select>
                  )}

                  <button
                    type="button"
                    onClick={switchCamera}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-display font-semibold transition-colors cursor-pointer text-white/90"
                    title="Beralih Kamera"
                  >
                    <FlipHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="hidden sm:inline">Beralih Kamera</span>
                  </button>

                  <button
                    type="button"
                    onClick={closeCamera}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                    title="Tutup Kamera"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Viewfinder Display */}
              <div className="relative aspect-[4/3] bg-black overflow-hidden flex items-center justify-center">
                {cameraError ? (
                  <div className="p-6 text-center max-w-md">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-3">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <h4 className="font-display font-bold text-white text-base mb-1.5">
                      Akses Kamera Belum Siap
                    </h4>
                    <p className="font-narrative text-xs text-white/70 leading-relaxed mb-5">
                      {cameraError}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setCameraError(null);
                          setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
                        }}
                        className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#1A1614] text-xs font-display font-bold hover:brightness-105 transition-all cursor-pointer"
                      >
                        Coba Lagi
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          closeCamera();
                          mobileCameraInputRef.current?.click();
                        }}
                        className="px-4 py-2 rounded-xl bg-[#713f2c] text-[#D4AF37] text-xs font-display font-bold hover:bg-[#583122] transition-all cursor-pointer"
                      >
                        Ambil Foto
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          closeCamera();
                          fileInputRef.current?.click();
                        }}
                        className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-display font-semibold hover:bg-white/20 transition-all cursor-pointer"
                      >
                        Pilih dari Perangkat
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      autoPlay
                      className={`w-full h-full object-cover ${
                        facingMode === "user" ? "-scale-x-100" : ""
                      }`}
                    />

                    {/* Shutter flash animation */}
                    {isCapturing && (
                      <div className="absolute inset-0 bg-white z-30 animate-out fade-out duration-200" />
                    )}

                    {/* Viewfinder Target Framing / Reticle */}
                    <div className="absolute inset-8 sm:inset-10 pointer-events-none flex items-center justify-center">
                      {/* 4 Corner brackets */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-3 border-l-3 border-[#D4AF37] rounded-tl-xl shadow-sm" />
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-3 border-r-3 border-[#D4AF37] rounded-tr-xl shadow-sm" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-3 border-l-3 border-[#D4AF37] rounded-bl-xl shadow-sm" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-3 border-r-3 border-[#D4AF37] rounded-br-xl shadow-sm" />

                      {/* Center Crosshair */}
                      <div className="w-16 h-16 rounded-full border border-[#D4AF37]/40 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                      </div>
                    </div>

                    {/* Hint Banner */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/15 pointer-events-none">
                      <p className="text-[11px] font-display text-white/90">
                        Arahkan kamera tegak lurus ke permukaan kain batik
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Shutter Control Footer */}
              {!cameraError && (
                <div className="p-4 bg-black/50 border-t border-white/10 flex flex-col items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#fde68a] p-1 shadow-lg shadow-[#D4AF37]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center group"
                    title="Ambil Foto"
                  >
                    <div className="w-full h-full rounded-full border-2 border-[#1A1614] bg-white flex items-center justify-center text-[#713f2c] group-hover:bg-[#FFF8E7] transition-colors">
                      <Camera className="w-6 h-6 stroke-[2.5]" />
                    </div>
                  </button>
                  <span className="text-[11px] font-display text-white/60">
                    Ketuk tombol di atas untuk memotret kain batik
                  </span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Landing Page Footer */}
      <Footer />
    </div>
  );
}
