"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Bot, User, Sparkles, MessageSquare, Compass, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/landing/Navbar";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  time: string;
}

const QUICK_PROMPTS = [
  "Apa bedanya batik Solo dan Yogya?",
  "Motif apa yang cocok untuk resepsi pernikahan?",
  "Kenapa motif Parang dulu dilarang untuk rakyat biasa?",
  "Apa makna motif Kawung bagi kepemimpinan?",
];

const PRESET_ANSWERS: Record<string, string> = {
  "Apa bedanya batik Solo dan Yogya?":
    "Sugeng rawuh, Ananda. Perbedaan mendasarnya terletak pada warna latar (wedhokan) dan karakter ornamen:\n\n• Batik Solo (Surakarta) cenderung berlatar kuning kecokelatan (sogan hangat) dengan garis motif yang gemulai, anggun, dan luwes.\n• Batik Yogyakarta berlatar putih bersih (pethak) dengan sogan kehitaman yang tegas, berani, dan berwibawa.\n\nKeduanya lahir dari satu akar budaya luhur Keraton Mataram, namun mengekspresikan karakter keindahan yang saling melengkapi.",

  "Motif apa yang cocok untuk resepsi pernikahan?":
    "Dalam pakem adat pernikahan Jawa, ada tiga motif utama yang membawa doa restu suci:\n\n1. Sidomukti: Bermakna pengharapan agar kedua mempelai selalu berada dalam kemuliaan (mukti) lahir dan batin.\n2. Truntum: Diciptakan oleh Kanjeng Ratu Beruk, bermakna cinta yang selalu bersemi kembali (tumaruntum) dan abadi tanpa syarat.\n3. Sido Asih: Doa agar bahtera rumah tangga senantiasa dipenuhi rasa welas asih dan keharmonisan hidup.",

  "Kenapa motif Parang dulu dilarang untuk rakyat biasa?":
    "Parang Rusak dan Parang Barong merupakan kelompok 'Batik Larangan' (Awisan Ndalem) di Keraton Mataram.\n\nMotif ini melambangkan ombak samudra bergelora yang tak kenal lelah memecah karang, simbol keteguhan jiwa, keberanian ksatria, dan kepemimpinan spiritual yang hanya boleh dikenakan oleh Raja, Pangeran, dan keturunan langsung. Mengenakannya tanpa hak di masa lalu dianggap melanggar tatanan adiluhung keraton.",

  "Apa makna motif Kawung bagi kepemimpinan?":
    "Motif Kawung terinspirasi dari empat kelopak bunga aren atau buah kolang-kaling yang tersusun simetris membentuk persilangan.\n\nDalam falsafah Jawa, ini melambangkan 'Sedulur Papat Lima Pancer' — empat penjuru mata angin yang bermuara pada satu pusat kesadaran Ilahi. Bagi seorang pemimpin, Kawung mengajarkan kesucian hati, keadilan tanpa pandang bulu, serta kemampuan mengendalikan hawa nafsu demi kesejahteraan rakyat.",
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      role: "bot",
      content:
        "Sugeng rawuh, Cucu-cucuku para pelestari budaya. Saya Sang Empu Batik Nusantara. Ada yang ingin Ananda tanyakan seputar filosofi ragam hias, pakem busana adat, atau sejarah wastra nusantara hari ini?",
      time: "Baru saja",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Mock bot reply
    setTimeout(() => {
      setIsTyping(false);
      const answer =
        PRESET_ANSWERS[text] ||
        `Matur nuwun atas pertanyaan luhur Ananda mengenai "${text}". Berdasarkan serat babad dan kearifan para empu, setiap guratan canting batik bukan sekadar hiasan ragam visual, melainkan doa yang terpatri pada kain mori. Teruslah mencintai dan melestarikan warisan leluhur kita.`;

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: answer,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#1A1614] font-body flex flex-col relative overflow-hidden">
      {/* Global Navbar */}
      <Navbar variant="transparent" />

      {/* Pendopo Cultural Atmosphere Background */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-0 right-0 h-[480px] bg-gradient-to-b from-[#713f2c]/50 via-[#713f2c]/20 to-transparent" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at center, transparent 0%, #1A1614 90%)",
          }}
        />
      </div>

      {/* Main Chat Layout */}
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full relative z-10 pt-28 pb-6 px-4 sm:px-6">
        {/* Sang Empu Persona Intro Header */}
        <div className="bg-[#231e1c]/90 border border-[#D4AF37]/30 backdrop-blur-md rounded-2xl p-5 mb-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="relative w-14 h-14 rounded-2xl bg-[#713f2c] border-2 border-[#D4AF37]/50 p-1 flex items-center justify-center shrink-0 shadow-lg">
              <Image
                src="/images/logo-batik-kita.png"
                alt="Logo Sang Empu"
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#1A1614]" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="font-display font-bold text-lg text-white">
                  Tanya Sang Empu
                </h1>
                <span className="bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-display font-bold px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                  Budayawan AI
                </span>
              </div>
              <p className="font-narrative text-xs text-white/70 max-w-md">
                Pakar kearifan filosofi motif, pakem keraton, dan etika berbusana batik nusantara.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/play"
              className="inline-flex items-center gap-1.5 text-xs font-display font-semibold text-[#D4AF37] hover:text-white bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 px-3.5 py-1.5 rounded-xl transition-all"
            >
              <Compass className="w-3.5 h-3.5" />
              Arena Arcade
            </Link>
          </div>
        </div>

        {/* Quick Question Chips */}
        <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-display font-bold text-[#D4AF37] shrink-0 uppercase tracking-wider pl-1">
            Topik Populer:
          </span>
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSend(prompt)}
              className="text-xs bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 hover:border-[#D4AF37]/40 px-3 py-1.5 rounded-full transition-all shrink-0 font-body shadow-xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Messages Log */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-5 p-4 rounded-2xl bg-[#1e1917]/70 border border-white/10 backdrop-blur-sm min-h-[380px] max-h-[520px] shadow-inner scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-3.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    msg.role === "user"
                      ? "bg-white/10 text-white border-white/20"
                      : "bg-[#713f2c] text-[#D4AF37] border-[#D4AF37]/40 shadow-sm"
                  }`}
                >
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl px-5 py-4 shadow-md ${
                    msg.role === "user"
                      ? "bg-[#713f2c] text-white border border-[#D4AF37]/30 rounded-tr-none"
                      : "bg-[#28221f] text-white/90 border border-white/10 rounded-tl-none"
                  }`}
                >
                  <p className="font-narrative text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                  <span className="block text-[10px] text-white/40 mt-2 text-right font-display">
                    {msg.time}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3.5 flex-row"
            >
              <div className="w-9 h-9 rounded-xl bg-[#713f2c] text-[#D4AF37] border border-[#D4AF37]/40 flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-[#28221f] border border-white/10 rounded-2xl rounded-tl-none px-5 py-4 flex items-center gap-2 shadow-md">
                <span className="text-xs text-white/60 font-narrative">Sang Empu sedang menimbang petuah...</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="mt-4 flex items-center gap-3 bg-[#231e1c] border border-white/15 p-2 rounded-2xl shadow-xl focus-within:border-[#D4AF37]/70 transition-all"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanyakan makna motif, filosofi, atau padu-padan batik Anda..."
            className="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-hidden font-body"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-[#713f2c] hover:bg-[#583122] disabled:opacity-40 text-[#D4AF37] p-3 rounded-xl transition-all shadow-md shrink-0 flex items-center justify-center"
            title="Kirim Pertanyaan"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </main>
    </div>
  );
}
