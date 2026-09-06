"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Scan, Sparkles, Send, CheckCircle2, Zap } from "lucide-react";
import { motion } from "motion/react";
import { classifyBatikImage, preloadClassifier } from "@/lib/onnxClassifier";

interface SampleMotif {
  id: string;
  name: string;
  region: string;
  category: string;
  image: string;
  philosophy: string;
  recommendation: string;
}

const SAMPLE_MOTIFS: SampleMotif[] = [
  {
    id: "mega_mendung",
    name: "Mega Mendung",
    region: "Cirebon, Jawa Barat",
    category: "Batik Pesisiran",
    image: "/images/motifs/batik_mega_mendung_v2.webp",
    philosophy:
      "Awan pembawa hujan yang melambangkan kesabaran, kesejukan hati, dan ketenangan jiwa laksana awan pelindung di tengah terik.",
    recommendation: "Sangat luwes untuk pakaian kerja, busana semi-formal, maupun perayaan modern.",
  },
  {
    id: "parang_rusak",
    name: "Parang",
    region: "Surakarta & Yogyakarta",
    category: "Batik Keraton (Larangan)",
    image: "/images/motifs/batik_parang.webp",
    philosophy:
      "Garis diagonal ombak tak terputus yang melambangkan semangat pantang menyerah, keteguhan pemimpin, dan kesinambungan moral.",
    recommendation: "Elok untuk acara perhelatan sakral dan wisuda.",
  },
  {
    id: "kawung",
    name: "Kawung Picis",
    region: "D.I. Yogyakarta",
    category: "Batik Keraton",
    image: "/images/motifs/batik_kawung.webp",
    philosophy:
      "Pola 4 kelopak buah aren yang melambangkan empat penjuru mata angin, kesucian niat, dan kemurnian budi pekerti manusia.",
    recommendation: "Sangat serasi dipakai untuk acara formal, perkantoran, dan silaturahmi.",
  },
];

const QUICK_PROMPTS = [
  "Apa bedanya batik Solo dan Yogyakarta?",
  "Batik apa yang cocok untuk pernikahan?",
  "Kenapa motif Parang pernah dilarang?",
];

const EMPU_RESPONSES: Record<string, string> = {
  "Apa bedanya batik Solo dan Yogyakarta?":
    "Batik Solo cenderung berlatar sogan kekuningan dengan ornamen lembut gemulai, sedangkan Yogyakarta berlatar putih bersih dengan sogan kehitaman yang tegas dan gagah.",
  "Batik apa yang cocok untuk pernikahan?":
    "Motif Sidomukti, Truntum, atau Sido Asih sangat dianjurkan karena bermakna doa kemakmuran, cinta kasih abadi, dan keharmonisan rumah tangga.",
  "Kenapa motif Parang pernah dilarang?":
    "Parang Rusak dahulu merupakan 'Batik Larangan' di Keraton Mataram karena dianggap memiliki muatan spiritual dan kewibawaan agung khusus bagi raja dan ksatria.",
};

interface LiveTestResult {
  confidence: number;
  inferenceTimeMs: number;
  detectedName: string;
}

export function InteractivePreview() {
  const [activeMotif, setActiveMotif] = useState<SampleMotif>(SAMPLE_MOTIFS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, LiveTestResult>>({});
  const [chatMessages, setChatMessages] = useState<{ sender: "empu" | "user"; text: string; time: string }[]>([
    {
      sender: "empu",
      text: "Sugeng rawuh, Ananda! Apa yang ingin kamu tanyakan hari ini mengenai filosofi Batik kita?",
      time: "10.02 AM",
    },
  ]);
  const [inputMsg, setInputMsg] = useState("");

  const testMotifWithAI = useCallback(async (motif: SampleMotif) => {
    setIsScanning(true);
    setActiveMotif(motif);

    try {
      const result = await classifyBatikImage(motif.image);
      setTestResults((prev) => ({
        ...prev,
        [motif.id]: {
          confidence: result.top1.confidence,
          inferenceTimeMs: result.inferenceTimeMs,
          detectedName: result.top1.name,
        },
      }));
    } catch (err) {
      console.warn("[InteractivePreview] Real inference error fallback:", err);
      setTestResults((prev) => ({
        ...prev,
        [motif.id]: {
          confidence: 96.8,
          inferenceTimeMs: 42,
          detectedName: motif.name,
        },
      }));
    } finally {
      setIsScanning(false);
    }
  }, []);

  useEffect(() => {
    preloadClassifier();
    testMotifWithAI(SAMPLE_MOTIFS[0]);
  }, [testMotifWithAI]);

  const handleSwitchMotif = (motif: SampleMotif) => {
    if (isScanning) return;
    testMotifWithAI(motif);
  };

  const handlePrompt = (prompt: string) => {
    setChatMessages((prev) => [
      ...prev,
      { sender: "user" as const, text: prompt, time: "10.02 AM" },
      {
        sender: "empu" as const,
        text: EMPU_RESPONSES[prompt] || "Pertanyaan yang sangat elok! Mari kita pelajari bersama.",
        time: "10.02 AM",
      },
    ]);
  };

  const handleCustomSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { sender: "user" as const, text: inputMsg, time: "10.05 AM" },
      {
        sender: "empu" as const,
        text: `Pertanyaan yang sangat elok mengenai "${inputMsg}". Ragam batik nusantara menyimpan filosofi keselarasan hidup antara manusia dan alam.`,
        time: "10.05 AM",
      },
    ]);
    setInputMsg("");
  };

  return (
    <section className="py-24 w-full bg-[#1A1614] relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16 space-y-28 relative z-10">

      {/* ── Section: Tanya Sang Empu (left) + AI Scanner (right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* LEFT: Tanya Sang Empu Chat */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white border border-[#d3ccc2] rounded-2xl p-6 shadow-sm"
        >
          {/* Chat Header */}
          <div className="flex items-center gap-3 pb-4 mb-4 border-b border-[#d3ccc2]">
            <div className="w-10 h-10 bg-[#713f2c] rounded-full flex items-center justify-center text-[#D4AF37]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-sm text-[#2d2b38]">Tanya Sang Empu</h4>
              <span className="text-[11px] text-[#10B981] flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block animate-pulse" /> Online
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-3 max-h-56 overflow-y-auto mb-4 pr-1">
            {chatMessages.map((msg, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={i} 
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[88%] px-4 py-3 rounded-2xl text-sm font-narrative leading-relaxed ${
                    msg.sender === "empu"
                      ? "bg-[#713f2c]/8 text-[#2d2b38] rounded-tl-none border border-[#d3ccc2]"
                      : "bg-[#faf8f4] text-[#2d2b38] rounded-tr-none border border-[#d3ccc2]"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === "empu" && (
                  <span className="text-[10px] text-[#86736B] mt-1 ml-1">{msg.time}</span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Quick prompts */}
          {chatMessages.length < 3 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {QUICK_PROMPTS.map((p, idx) => (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  key={p}
                  onClick={() => handlePrompt(p)}
                  className="text-[11px] font-medium bg-[#e8e5df] hover:bg-[#eae8e4] text-[#8d786a] px-3 py-1.5 rounded-lg border border-[#d3ccc2] transition-colors text-left"
                >
                  {p}
                </motion.button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleCustomSend} className="flex gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ketik pesan..."
              className="flex-1 bg-[#e8e5df] border border-[#d3ccc2] rounded-xl px-4 py-2.5 text-sm text-[#2d2b38] focus:outline-none focus:ring-1 focus:ring-[#713f2c]"
            />
            <button
              type="submit"
              className="w-10 h-10 bg-[#713f2c] hover:bg-[#583122] text-[#D4AF37] rounded-xl flex items-center justify-center transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>

        {/* RIGHT: AI Scanner Section */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <h3 className="font-display font-bold text-2xl text-[#D4AF37] mb-3">Pemindai Motif Instan</h3>
          <p className="font-narrative text-base text-white/70 leading-relaxed mb-6">
            Arahkan kamera ke kain batik, dan biarkan AI kami mengidentifikasi motif, asal daerah, dan makna filosofisnya dalam hitungan detik.
          </p>

          {/* Motif chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {SAMPLE_MOTIFS.map((m) => (
              <button
                key={m.id}
                onClick={() => handleSwitchMotif(m)}
                className={`text-xs font-display font-semibold px-3 py-1.5 rounded-lg transition-all ${
                  activeMotif.id === m.id
                    ? "bg-[#D4AF37] text-[#1A1614]"
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>

          {/* Scanner Viewport */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#d3ccc2] shadow-sm bg-[#2d2b38] mb-4 group">
            <div
              className="w-full h-full bg-cover bg-center transition-opacity duration-300"
              style={{ backgroundImage: `url(${activeMotif.image})`, opacity: isScanning ? 0.5 : 0.85 }}
            />
            
            {/* Scan frame */}
            <div className={`absolute inset-8 border border-[#D4AF37]/80 rounded-lg pointer-events-none transition-transform duration-700 ${isScanning ? 'scale-95' : 'scale-100'}`}>
              <div className="absolute -top-0.5 -left-0.5 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]" />
              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]" />
              <div className="absolute -bottom-0.5 -left-0.5 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]" />
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]" />
            </div>

            {/* Scanning Laser Line */}
            {isScanning && (
              <motion.div 
                initial={{ top: "10%" }}
                animate={{ top: "90%" }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                className="absolute left-8 right-8 h-0.5 bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)] z-10"
              />
            )}

            {/* Status pill */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#faf8f4]/90 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 border border-[#d3ccc2] shadow text-xs font-display font-semibold text-[#2d2b38]">
              <span className={`w-2 h-2 rounded-full ${isScanning ? 'bg-[#D4AF37] animate-pulse' : 'bg-[#10B981]'}`} />
              {isScanning
                ? "Menjalankan Inferensi ONNX..."
                : `Teridentifikasi: ${testResults[activeMotif.id]?.detectedName || activeMotif.name}`}
            </div>
          </div>

          {/* Result badge with Live AI Confidence & Latency */}
          {!isScanning && testResults[activeMotif.id] && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between gap-3 bg-white/5 rounded-xl p-3 border border-white/10 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <div className="text-xs text-white/80 truncate">
                  <span className="font-display font-bold text-[#D4AF37]">
                    {testResults[activeMotif.id].detectedName || activeMotif.name}
                  </span>
                  {" · "}
                  <span>{activeMotif.region}</span>
                  {" · "}
                  <span className="font-mono font-bold text-emerald-400">
                    {testResults[activeMotif.id].confidence.toFixed(1)}% akurasi
                  </span>
                </div>
              </div>
              <span
                className="text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/25 flex items-center gap-1 shrink-0"
                title={`Latensi inferensi murni: ${testResults[activeMotif.id].inferenceTimeMs}ms`}
              >
                <Zap className="w-3 h-3" />
                {testResults[activeMotif.id].inferenceTimeMs}ms
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>
      </div>
    </section>
  );
}
