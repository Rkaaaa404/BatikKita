"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  MessageSquare,
  Compass,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
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
  "Batik apa yang tepat untuk upacara tujuh bulanan (Mitoni)?",
];

const PRESET_ANSWERS: Record<string, string> = {
  "Apa bedanya batik Solo dan Yogya?":
    "Sugeng rawuh, Ananda. Perbedaan mendasarnya terletak pada warna latar (wedhokan) dan karakter ornamen:\n\n• Batik Solo (Surakarta) cenderung berlatar kuning kecokelatan (sogan hangat) dengan garis motif yang gemulai, anggun, dan luwes.\n• Batik Yogyakarta berlatar putih bersih (pethak) dengan sogan kehitaman yang tegas, berani, dan berwibawa.\n\nKeduanya lahir dari satu akar budaya luhur Keraton Mataram, namun mengekspresikan karakter keindahan yang saling melengkapi.",

  "Motif apa yang cocok untuk resepsi pernikahan?":
    "Dalam pakem adat pernikahan Jawa, ada tiga motif utama yang membawa doa restu suci:\n\n1. Sidomukti: Bermakna pengharapan agar kedua mempelai selalu berada dalam kemuliaan (mukti) lahir dan batin.\n2. Truntum: Diciptakan oleh Kanjeng Ratu Beruk, bermakna cinta yang selalu bersemi kembali (tumaruntum) dan abadi tanpa syarat.\n3. Sido Asih: Doa agar bahtera rumah tangga senantiasa dipenuhi rasa welas asih dan keharmonisan hidup.",

  "Kenapa motif Parang dulu dilarang untuk rakyat biasa?":
    "Parang Rusak dan Parang Barong merupakan kelompok 'Batik Larangan' (Awisan Ndalem) di Keraton Mataram.\n\nMotif ini melambangkan ombak samudra bergelora yang tak kenal lelah memecah karang, simbol keteguhan jiwa, keberanian ksatria, dan kepemimpinan spiritual yang hanya boleh dikenakan oleh Raja, Pangeran, dan keturunan langsung. Mengenakannya tanpa hak di masa lalu dianggap melanggar tatanan adiluhung keraton.",

  "Apa makna motif Kawung bagi kepemimpinan?":
    "Motif Kawung terinspirasi dari empat kelopak bunga aren atau buah kolang-kaling yang tersusun simetris membentuk persilangan.\n\nDalam falsafah Jawa, ini melambangkan 'Sedulur Papat Lima Pancer', empat penjuru mata angin yang bermuara pada satu pusat kesadaran Ilahi. Bagi seorang pemimpin, Kawung mengajarkan kesucian hati, keadilan tanpa pandang bulu, serta kemampuan mengendalikan hawa nafsu demi kesejahteraan rakyat.",

  "Batik apa yang tepat untuk upacara tujuh bulanan (Mitoni)?":
    "Dalam upacara tingkeban atau mitoni (kehamilan tujuh bulan), calon ibu berganti kain hingga tujuh kali. Motif yang digunakan sarat akan doa keselamatan:\n\n1. Sidoluhur: Harapan agar si jabang bayi berbudi pekerti luhur dan mulia.\n2. Wahyu Tumurun: Memohon keberkahan dan anugerah petunjuk dari Tuhan Yang Maha Esa.\n3. Semen Rama: Melambangkan ajaran kepemimpinan Hasta Brata (delapan laku alam).\n\nUpacara diakhiri dengan kain lurik bermotif Lasem atau Yuyu Sekandang yang melambangkan kesetiaan.",
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
  const chatSectionRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const scrollToChat = () => {
    chatSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
    <div className="min-h-screen bg-[#faf8f4] font-body text-[#2d2b38] flex flex-col">
      {/* Global Navbar */}
      <Navbar variant="transparent" />

      <main className="flex-1">
        {/* ─── Hero Section with Dedicated Batik_Tab_Sang Empu.jpg to Highlight the Title ─── */}
        <section className="relative w-full overflow-hidden bg-[#1A1614] pt-32 pb-24 px-6 lg:px-16 min-h-[580px] lg:min-h-[640px] flex items-center">
          {/* Background Image: Batik_Tab_Sang Empu.jpg */}
          <Image
            src="/images/Batik_Tab_Sang Empu.jpg"
            alt="Suasana Canting Sang Empu Batik Nusantara"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />

          {/* Contrast overlays to prominently highlight the title & text */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/40 z-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1614] via-transparent to-black/50 z-0" />

          {/* Golden glow accents */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none z-0" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#713f2c]/25 rounded-full blur-3xl pointer-events-none z-0" />

          <div className="max-w-[1280px] mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left column: Editorial copy highlighting the title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 text-left"
            >
              <div className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-display font-bold px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm shadow-sm">
                <Sparkles className="w-4 h-4" />
                <span>AI BUDAYAWAN • DIALOG KEARIFAN BATIK</span>
              </div>

              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-[54px] text-white leading-[1.08] tracking-tight mb-5 drop-shadow-md">
                <span className="font-philosopher tracking-wide">Tanya Sang Empu</span>:{" "}
                <span
                  style={{
                    color: "#D4AF37",
                    textShadow: "0 2px 24px rgba(212,175,55,0.45)",
                  }}
                >
                  Falsafah & Makna
                </span>{" "}
                <br />
                Wastra Nusantara.
              </h1>

              <p className="font-narrative text-base sm:text-lg text-white/85 leading-relaxed mb-8 max-w-xl drop-shadow-sm">
                Selami rahasia di balik setiap cantingan lilin malam. Tanyakan filosofi pakem keraton, sejarah ragam pesisiran, hingga tata krama busana adat bersama asisten AI budayawan penjaga warisan leluhur.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-display text-white/80">
                <span className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Sang Empu Siap Berdialog
                </span>
                <span className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 shadow-xs">
                  <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" /> Berbasis Serat Klasik Mataram
                </span>
                <span className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verifikasi Falsafah Pakem
                </span>
              </div>
            </motion.div>

            {/* Right column: Sang Empu Persona Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="lg:col-span-5"
            >
              <div className="bg-[#231e1c]/90 border border-[#D4AF37]/35 backdrop-blur-md rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden group hover:border-[#D4AF37]/60 transition-all">
                {/* Subtle watermark corner ornament */}
                <div className="absolute -right-8 -bottom-8 w-40 h-40 opacity-10 pointer-events-none">
                  <Image
                    src="/images/logo-batik-kita.png"
                    alt="Ornament"
                    width={160}
                    height={160}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
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
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-bold text-lg text-white">
                          Sang Empu Batik
                        </h3>
                        <span className="bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-display font-bold px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                          Budayawan AI
                        </span>
                      </div>
                      <span className="text-xs font-narrative text-white/70 block">
                        Pakar Filosofi & Tata Krama Wastra
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cultural Quote */}
                <div className="bg-black/30 border border-[#D4AF37]/20 rounded-xl p-4 mb-5">
                  <p className="font-narrative text-xs text-white/80 italic leading-relaxed">
                    &ldquo;Saben lumping kain mori dadi papan donga, saben cantingan dadi sujud syukur. Takonana apa wae, ayo padha nguri-uri kabudayan luhur.&rdquo;
                  </p>
                  <span className="block text-[10px] text-[#D4AF37] font-display font-bold mt-2 text-right">
                    — Petuah Sang Empu
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
                    <span className="block text-[10px] font-display text-white/50 uppercase">
                      Cakupan Pakem
                    </span>
                    <span className="text-xs font-display font-bold text-[#D4AF37]">
                      Solo, Yogya & Pesisir
                    </span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
                    <span className="block text-[10px] font-display text-white/50 uppercase">
                      Ketersediaan
                    </span>
                    <span className="text-xs font-display font-bold text-emerald-400">
                      24 Jam Siap Menjawab
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={scrollToChat}
                  className="w-full flex items-center justify-center gap-2 bg-[#713f2c] hover:bg-[#583122] text-[#D4AF37] hover:text-white font-display font-bold text-sm py-3 px-4 rounded-xl border border-[#D4AF37]/40 shadow-lg transition-all cursor-pointer group"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Buka Ruang Dialog Budaya</span>
                  <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Interactive Chat Workspace Section ─── */}
        <section
          ref={chatSectionRef}
          id="ruang-dialog"
          className="max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full"
        >
          {/* Section Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-display font-bold text-[#713f2c] uppercase tracking-wider">
                  Ruang Konsultasi Aktif
                </span>
              </div>
              <h2 className="font-display font-bold text-2xl text-[#2d2b38] mt-1">
                Dialog Bersama Sang Empu
              </h2>
              <p className="font-narrative text-xs sm:text-sm text-[#8d786a]">
                Ketik pertanyaan Anda atau klik salah satu topik populer di bawah ini untuk memulai percakapan:
              </p>
            </div>

            <Link
              href="/play"
              className="inline-flex items-center gap-1.5 text-xs font-display font-semibold text-[#713f2c] hover:text-white bg-[#faf8f4] hover:bg-[#713f2c] border border-[#713f2c]/30 px-3.5 py-2 rounded-xl transition-all shadow-xs shrink-0 self-start sm:self-auto"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Jelajah Arena Arcade</span>
            </Link>
          </div>

          {/* Quick Question Chips */}
          <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-[11px] font-display font-bold text-[#713f2c] shrink-0 uppercase tracking-wider pl-1">
              Topik Pilihan:
            </span>
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => {
                  handleSend(prompt);
                  scrollToChat();
                }}
                className="text-xs bg-white hover:bg-[#713f2c] text-[#2d2b38] hover:text-white border border-[#d3ccc2] hover:border-[#713f2c] px-3.5 py-2 rounded-full transition-all shrink-0 font-body shadow-xs cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Container Card */}
          <div className="bg-white border border-[#d3ccc2] rounded-2xl shadow-md overflow-hidden flex flex-col">
            {/* Header of Chat Card */}
            <div className="bg-[#faf8f4] border-b border-[#d3ccc2] px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#713f2c] text-[#D4AF37] flex items-center justify-center font-display font-bold text-xs shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-display font-bold text-sm text-[#2d2b38] block leading-tight">
                    Sang Empu Batik Nusantara
                  </span>
                  <span className="text-[11px] text-[#8d786a] font-narrative">
                    Menjawab dengan bahasa santun & rujukan serat
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-display font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Terhubung
              </span>
            </div>

            {/* Chat Messages Log */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto space-y-5 p-5 sm:p-6 bg-[#fcfbf9] min-h-[380px] max-h-[520px] scrollbar-thin scrollbar-thumb-[#d3ccc2] scrollbar-track-transparent"
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
                          ? "bg-[#2d2b38] text-white border-[#2d2b38]"
                          : "bg-[#713f2c] text-[#D4AF37] border-[#D4AF37]/40 shadow-xs"
                      }`}
                    >
                      {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-5 py-4 shadow-xs ${
                        msg.role === "user"
                          ? "bg-[#713f2c] text-white rounded-tr-none"
                          : "bg-white text-[#2d2b38] border border-[#d3ccc2]/80 rounded-tl-none"
                      }`}
                    >
                      <p className="font-narrative text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                      <span
                        className={`block text-[10px] mt-2 text-right font-display ${
                          msg.role === "user" ? "text-white/60" : "text-[#8d786a]"
                        }`}
                      >
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
                  <div className="w-9 h-9 rounded-xl bg-[#713f2c] text-[#D4AF37] border border-[#D4AF37]/40 flex items-center justify-center shrink-0 shadow-xs">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-white border border-[#d3ccc2]/80 rounded-2xl rounded-tl-none px-5 py-4 flex items-center gap-2.5 shadow-xs">
                    <span className="text-xs text-[#8d786a] font-narrative">
                      Sang Empu sedang menimbang petuah...
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#713f2c] animate-ping" />
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
              className="p-3 bg-white border-t border-[#d3ccc2] flex items-center gap-3 focus-within:ring-2 focus-within:ring-[#713f2c]/20 transition-all"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanyakan makna motif, pakem busana adat, atau sejarah wastra Anda..."
                className="flex-1 bg-[#faf8f4] border border-[#d3ccc2] px-4 py-3 rounded-xl text-sm text-[#2d2b38] placeholder-[#8d786a] focus:outline-hidden focus:border-[#713f2c] font-body"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="bg-[#713f2c] hover:bg-[#583122] disabled:opacity-40 text-[#D4AF37] px-5 py-3 rounded-xl transition-all shadow-md shrink-0 flex items-center gap-2 font-display font-bold text-xs cursor-pointer disabled:cursor-not-allowed"
                title="Kirim Pertanyaan"
              >
                <span className="hidden sm:inline">Kirim</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Helpful cultural guidance note */}
          <div className="mt-4 flex items-start gap-2.5 text-xs text-[#8d786a] bg-amber-50/60 border border-amber-200/60 rounded-xl p-3.5">
            <HelpCircle className="w-4 h-4 text-[#713f2c] shrink-0 mt-0.5" />
            <p className="font-narrative leading-relaxed">
              <strong>Tips Konsultasi:</strong> Anda dapat menanyakan filosofi motif tertentu (misal: <em>&quot;Apa makna motif Parang Rusak?&quot;</em>), kecocokan busana untuk momen adat (misal: <em>&quot;Batik apa yang tepat untuk lamaran?&quot;</em>), atau perbedaan teknik cap dan tulis.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
