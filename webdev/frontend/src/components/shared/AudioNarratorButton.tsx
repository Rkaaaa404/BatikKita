"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Pause, Play, Sparkles, Loader2 } from "lucide-react";

interface AudioNarratorButtonProps {
  text: string;
  title?: string;
  className?: string;
  variant?: "primary" | "secondary" | "compact";
}

export function AudioNarratorButton({
  text,
  title,
  className = "",
  variant = "primary",
}: AudioNarratorButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isUnmountedRef = useRef(false);

  // Helper untuk membersihkan instance audio secara aman tanpa memicu onerror
  const cleanupAudio = () => {
    if (audioRef.current) {
      const el = audioRef.current;
      el.oncanplay = null;
      el.onplay = null;
      el.onpause = null;
      el.onended = null;
      el.onerror = null;
      el.pause();
      el.removeAttribute("src");
      el.load(); // Reset internal state
      audioRef.current = null;
    }
  };

  useEffect(() => {
    isUnmountedRef.current = false;

    return () => {
      isUnmountedRef.current = true;
      cleanupAudio();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleSpeak = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // 1. Jika sedang memutar audio
    if (audioRef.current && isPlaying) {
      if (isPaused) {
        audioRef.current.play();
        setIsPaused(false);
      } else {
        audioRef.current.pause();
        setIsPaused(true);
      }
      return;
    }

    // 2. Siapkan teks yang akan dibaca
    const cleanedText = (title ? `${title}. ` : "") + text.replace(/[*_#`[\]()]/g, " ").trim();
    if (!cleanedText) return;

    // Bersihkan audio sebelumnya jika ada
    cleanupAudio();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setIsLoading(true);

    try {
      // Gunakan audio stream Bahasa Indonesia asli dari /api/tts
      const audioUrl = `/api/tts?text=${encodeURIComponent(cleanedText)}`;
      const audio = new Audio(audioUrl);

      audio.oncanplay = () => {
        if (!isUnmountedRef.current) {
          setIsLoading(false);
        }
      };

      audio.onplay = () => {
        if (!isUnmountedRef.current) {
          setIsPlaying(true);
          setIsPaused(false);
          setIsLoading(false);
        }
      };

      audio.onpause = () => {
        if (!isUnmountedRef.current) {
          setIsPaused(true);
        }
      };

      audio.onended = () => {
        if (!isUnmountedRef.current) {
          setIsPlaying(false);
          setIsPaused(false);
          setIsLoading(false);
        }
      };

      audio.onerror = () => {
        // Jangan pernah beralih jika komponen sedang ditutup/di-unmount
        if (isUnmountedRef.current) return;
        console.warn("Audio stream error pada /api/tts.");
        fallbackWebSpeech(cleanedText);
      };

      audioRef.current = audio;
      await audio.play();
    } catch (err: unknown) {
      // Abaikan jika error disebabkan oleh pause/abort saat komponen ditutup
      if (isUnmountedRef.current) return;
      if (err instanceof DOMException && err.name === "AbortError") return;

      console.warn("Gagal memutar audio /api/tts:", err);
      fallbackWebSpeech(cleanedText);
    }
  };

  const fallbackWebSpeech = (speechText: string) => {
    if (isUnmountedRef.current) return;
    setIsLoading(false);
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const synth = window.speechSynthesis;
    synth.cancel();

    // Hanya gunakan fallback jika OS memiliki suara Bahasa Indonesia
    // Jangan izinkan suara default bahasa Inggris membaca teks Indonesia
    const voices = synth.getVoices();
    const idVoice = voices.find(
      (v) =>
        v.lang === "id-ID" ||
        v.lang === "id_ID" ||
        v.lang.toLowerCase().startsWith("id") ||
        v.name.toLowerCase().includes("indonesia")
    );

    if (!idVoice) {
      console.warn("Tidak ada paket suara Bahasa Indonesia di OS. Pembacaan dibatalkan agar tidak berlogat aneh.");
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.voice = idVoice;
    utterance.lang = idVoice.lang;
    utterance.rate = 0.95;

    utterance.onstart = () => {
      if (!isUnmountedRef.current) {
        setIsPlaying(true);
        setIsPaused(false);
      }
    };
    utterance.onend = () => {
      if (!isUnmountedRef.current) {
        setIsPlaying(false);
        setIsPaused(false);
      }
    };
    utterance.onerror = () => {
      if (!isUnmountedRef.current) {
        setIsPlaying(false);
        setIsPaused(false);
      }
    };

    synth.speak(utterance);
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();

    cleanupAudio();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setIsPlaying(false);
    setIsPaused(false);
    setIsLoading(false);
  };

  if (variant === "compact") {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <button
          type="button"
          onClick={handleToggleSpeak}
          disabled={isLoading}
          className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-display font-semibold disabled:opacity-60 ${
            isPlaying
              ? "bg-[#D4AF37] text-[#1A1614] border-[#D4AF37] shadow-md animate-pulse"
              : "bg-[#FAF8F4] text-stone-700 border-[#d3ccc2] hover:border-[#713f2c]/50"
          }`}
          title={isPlaying ? (isPaused ? "Lanjutkan Narasi" : "Jeda Narasi") : "Dengarkan Narasi Bahasa Indonesia"}
          aria-label="Dengarkan Narasi Filosofi Budaya"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#713f2c]" />
          ) : isPlaying ? (
            isPaused ? (
              <Play className="w-3.5 h-3.5" />
            ) : (
              <Pause className="w-3.5 h-3.5" />
            )
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-[#713f2c]" />
          )}
          <span className="hidden xs:inline">
            {isLoading ? "Memuat..." : isPlaying ? (isPaused ? "Lanjut" : "Jeda") : "Dengarkan"}
          </span>
        </button>

        {isPlaying && (
          <button
            type="button"
            onClick={handleStop}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-200 text-xs transition-colors cursor-pointer"
            title="Hentikan Narasi"
            aria-label="Hentikan Narasi"
          >
            <VolumeX className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={handleToggleSpeak}
        disabled={isLoading}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border font-display font-bold text-xs transition-all cursor-pointer disabled:opacity-60 ${
          isPlaying
            ? isPaused
              ? "bg-amber-100 text-amber-900 border-amber-300"
              : "bg-[#D4AF37] text-[#1A1614] border-[#D4AF37] shadow-md shadow-[#D4AF37]/20"
            : "bg-[#FAF8F4] hover:bg-white text-stone-800 border-[#d3ccc2] hover:border-[#713f2c]/40 shadow-sm"
        }`}
        aria-label="Dengarkan Narasi Filosofi Bahasa Indonesia"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-[#713f2c]" />
            <span>Memuat Suara...</span>
          </>
        ) : isPlaying ? (
          isPaused ? (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Lanjutkan Narasi</span>
            </>
          ) : (
            <>
              <div className="flex items-center gap-0.5">
                <span className="w-1 h-3 bg-[#1A1614] rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1 h-4 bg-[#1A1614] rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1 h-2 bg-[#1A1614] rounded-full animate-bounce" />
              </div>
              <span>Sedang Bertutur... (Klik Jeda)</span>
            </>
          )
        ) : (
          <>
            <Volume2 className="w-4 h-4 text-[#713f2c]" />
            <span className="flex items-center gap-1">
              Dengarkan Kisah
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            </span>
          </>
        )}
      </button>

      {isPlaying && (
        <button
          type="button"
          onClick={handleStop}
          className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-300 text-xs transition-colors cursor-pointer"
          title="Hentikan Narasi Suara"
          aria-label="Hentikan Narasi Suara"
        >
          <VolumeX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
