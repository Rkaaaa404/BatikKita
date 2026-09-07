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
  BookOpen,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  time: string;
}

function formatInlineMarkdown(text: string, isUser: boolean): React.ReactNode[] {
  const regex = /(\*\*\*([^*]+)\*\*\*|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      // ***bold italic***
      elements.push(
        <strong
          key={`bi-${match.index}`}
          className={`font-bold italic ${isUser ? "text-amber-200" : "text-[#713f2c]"}`}
        >
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // **bold**
      elements.push(
        <strong
          key={`b-${match.index}`}
          className={`font-bold ${isUser ? "text-amber-100" : "text-[#713f2c]"}`}
        >
          {match[3]}
        </strong>
      );
    } else if (match[4]) {
      // *italic*
      elements.push(
        <em
          key={`i-${match.index}`}
          className={`italic ${isUser ? "text-amber-100/90" : "text-[#4a4039]"}`}
        >
          {match[4]}
        </em>
      );
    } else if (match[5]) {
      // `code`
      elements.push(
        <code
          key={`c-${match.index}`}
          className={`px-1.5 py-0.5 rounded text-xs font-mono ${
            isUser ? "bg-white/20 text-white" : "bg-[#713f2c]/10 text-[#713f2c]"
          }`}
        >
          {match[5]}
        </code>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements.length > 0 ? elements : [text];
}

function FormattedMessage({ content, isUser }: { content: string; isUser: boolean }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-2 font-narrative text-sm sm:text-[15px] leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={`spacer-${idx}`} className="h-1.5" />;
        }

        // Bullet point: •, -, or *
        if (/^([•\-\*])\s+/.test(trimmed)) {
          const bulletContent = trimmed.replace(/^([•\-\*])\s+/, "");
          return (
            <div key={`bullet-${idx}`} className="flex items-start gap-2.5 pl-1.5 my-1">
              <span
                className={`inline-block mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${
                  isUser ? "bg-amber-300" : "bg-[#713f2c]"
                }`}
              />
              <div className="flex-1 leading-relaxed">
                {formatInlineMarkdown(bulletContent, isUser)}
              </div>
            </div>
          );
        }

        // Numbered list: 1., 2., etc.
        const numMatch = trimmed.match(/^(\d+[\.\)])\s+(.*)/);
        if (numMatch) {
          return (
            <div key={`num-${idx}`} className="flex items-start gap-2.5 pl-1.5 my-1">
              <span
                className={`font-display font-bold text-xs mt-0.5 shrink-0 ${
                  isUser ? "text-amber-200" : "text-[#713f2c]"
                }`}
              >
                {numMatch[1]}
              </span>
              <div className="flex-1 leading-relaxed">
                {formatInlineMarkdown(numMatch[2], isUser)}
              </div>
            </div>
          );
        }

        // Heading: ### or ##
        if (/^#{1,4}\s+/.test(trimmed)) {
          const headingContent = trimmed.replace(/^#{1,4}\s+/, "");
          return (
            <div
              key={`head-${idx}`}
              className={`font-display font-bold text-base mt-2.5 mb-1 ${
                isUser ? "text-white" : "text-[#713f2c]"
              }`}
            >
              {formatInlineMarkdown(headingContent, isUser)}
            </div>
          );
        }

        return (
          <p key={`p-${idx}`} className="m-0 leading-relaxed">
            {formatInlineMarkdown(line, isUser)}
          </p>
        );
      })}
    </div>
  );
}

const QUICK_PROMPTS = [
  "Apa bedanya batik Solo dan Yogya?",
  "Motif apa yang cocok untuk resepsi pernikahan?",
  "Kenapa motif Parang dulu dilarang untuk rakyat biasa?",
  "Apa makna motif Kawung bagi kepemimpinan?",
  "Batik apa yang tepat untuk upacara tujuh bulanan (Mitoni)?",
  "Apa filosofi motif Mega Mendung dari Cirebon?",
  "Bagaimana cara merawat kain batik tulis agar awet?",
  "Apa makna motif Truntum bagi orang tua pengantin?",
  "Kapan motif Sekar Jagad pertama kali diciptakan?",
  "Bolehkah memakai batik motif Parang saat melayat?",
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

  "Apa filosofi motif Mega Mendung dari Cirebon?":
    "Motif Mega Mendung lahir dari akulturasi budaya Keraton Cirebon dengan kebudayaan Tiongkok melalui Sunan Gunung Jati dan Putri Ong Tien.\n\nGradasi tujuh lapis awan melambangkan tingkatan langit dan ajaran bahwa seorang manusia harus memiliki sifat penyabar, teduh, dan mampu mendinginkan suasana laksana mendung yang membawa berkah hujan tanpa menghancurkan.",

  "Bagaimana cara merawat kain batik tulis agar awet?":
    "Untuk menjaga zat warna alami (soga) dan serat kain mori tetap awet:\n\n1. Cuci menggunakan sari buah lerak atau sabun herbal khusus batik, hindari detergen keras berklorin.\n2. Cukup kucek perlahan, jangan diperas kencang atau diputar di mesin cuci.\n3. Jemur di tempat teduh berangin tanpa paparan sinar matahari terik langsung.\n4. Simpan bersama akar wangi atau biji merica untuk menangkal serangga, hindari menempelkan kapur barus langsung ke kain.",

  "Apa makna motif Truntum bagi orang tua pengantin?":
    "Truntum berasal dari kata 'tumaruntum' yang berarti tumbuh dan bersemi kembali. Motif ini diciptakan oleh Kanjeng Ratu Kencana saat berduka, hingga kasih cintanya pada Sunan Pakubuwana III bersemi kembali.\n\nDalam upacara panggih pengantin, motif ini wajib dikenakan oleh orang tua kedua mempelai sebagai lambang doa dan restu agar cinta sang anak senantiasa bertumbuh subur dan langgeng sepanjang hayat.",

  "Kapan motif Sekar Jagad pertama kali diciptakan?":
    "Motif Sekar Jagad berasal dari kata 'kar' (peta dalam bahasa Belanda) dan 'jagad' (dunia dalam bahasa Jawa), yang bermakna bunga keindahan seluruh dunia.\n\nMotif ini berkembang sejak abad ke-18 di pesisir Jawa Tengah dan Yogyakarta, menggambarkan keragaman pulau dan keindahan ragam hias nusantara yang bersatu dalam satu kesatuan yang harmonis.",

  "Bolehkah memakai batik motif Parang saat melayat?":
    "Dalam pakem adat keraton Jawa, motif Parang (terutama Parang Rusak dan Parang Barong) dihindari saat melayat atau takziah.\n\nMotif Parang membawa getaran energi satria yang membara, optimisme ksatria, dan kemenangan. Untuk momen duka cita, pakem yang dianjurkan adalah motif berlatar gelap atau motif yang bernuansa hening dan sarat doa seperti Slobok atau motif sederhana tanpa ornamen megah.",
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatSectionRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDraggingChips, setIsDraggingChips] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragScrollLeft, setDragScrollLeft] = useState(0);
  const [hasDraggedChips, setHasDraggedChips] = useState(false);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Check scroll position of chips container
  const checkChipsScroll = () => {
    if (chipsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = chipsRef.current;
      setCanScrollLeft(scrollLeft > 6);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
    }
  };

  useEffect(() => {
    checkChipsScroll();
    const el = chipsRef.current;
    if (el) {
      el.addEventListener("scroll", checkChipsScroll, { passive: true });
      window.addEventListener("resize", checkChipsScroll);
      return () => {
        el.removeEventListener("scroll", checkChipsScroll);
        window.removeEventListener("resize", checkChipsScroll);
      };
    }
  }, []);

  const scrollChips = (direction: "left" | "right") => {
    if (chipsRef.current) {
      const amount = 280;
      chipsRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  // Mouse wheel horizontal scrolling
  const handleChipsWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (chipsRef.current && e.deltaY !== 0) {
      chipsRef.current.scrollLeft += e.deltaY * 0.8;
      checkChipsScroll();
    }
  };

  // Mouse drag-to-scroll handlers
  const handleChipsMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!chipsRef.current) return;
    setIsDraggingChips(true);
    setHasDraggedChips(false);
    setDragStartX(e.pageX - chipsRef.current.offsetLeft);
    setDragScrollLeft(chipsRef.current.scrollLeft);
  };

  const handleChipsMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingChips || !chipsRef.current) return;
    e.preventDefault();
    const x = e.pageX - chipsRef.current.offsetLeft;
    const distance = x - dragStartX;
    if (Math.abs(distance) > 4) {
      setHasDraggedChips(true);
    }
    chipsRef.current.scrollLeft = dragScrollLeft - distance;
    checkChipsScroll();
  };

  const handleChipsMouseUp = () => {
    setIsDraggingChips(false);
  };

  const scrollToChat = () => {
    chatSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal terhubung ke bilik kearifan Batik Ask");
      }

      const data = await response.json();
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content:
          data.content ||
          PRESET_ANSWERS[text.trim()] ||
          "Sugeng rawuh, Ananda. Silakan ajukan pertanyaan seputar batik nusantara.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const fallbackAnswer =
        PRESET_ANSWERS[text.trim()] ||
        `Matur nuwun atas pertanyaan luhur Ananda mengenai "${text.trim()}". Berdasarkan serat babad dan kearifan para empu, setiap guratan canting batik bukan sekadar hiasan ragam visual, melainkan doa yang terpatri pada kain mori. Teruslah mencintai dan melestarikan warisan leluhur kita.`;

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: fallbackAnswer,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f4] font-body text-[#2d2b38] flex flex-col">
      {/* Global Navbar */}
      <Navbar variant="transparent" />

      <main className="flex-1">
        {/* ─── Hero Section with Dedicated Batik_Tab_Sang Empu.jpg to Highlight the Title ─── */}
        <section className="relative w-full overflow-hidden bg-[#1A1614] pt-24 pb-14 sm:pt-32 sm:pb-24 px-4 sm:px-6 lg:px-16 min-h-[480px] lg:min-h-[640px] flex items-center">
          {/* Background Image: batik-tab-sang-empu.webp */}
          <Image
            src="/images/batik-tab-sang-empu.webp"
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

          <div className="max-w-[1280px] mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left column: Editorial copy highlighting the title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 text-left"
            >
              <div className="flex items-center gap-2.5 mb-4 sm:mb-5">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
                <span className="text-white/90 font-display text-xs sm:text-sm font-medium tracking-wide">
                  AI Budayawan • Dialog Kearifan Batik
                </span>
              </div>

              <h1 className="font-display font-bold text-3xl xs:text-4xl sm:text-5xl lg:text-[54px] text-white leading-[1.12] sm:leading-[1.08] tracking-tight mb-4 sm:mb-5 drop-shadow-md">
                <span className="font-philosopher tracking-wide">Batik Ask:</span>
                <br />
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

              <p className="font-narrative text-sm sm:text-base lg:text-lg text-white/85 leading-relaxed mb-6 sm:mb-8 max-w-xl drop-shadow-sm">
                Selami rahasia di balik setiap cantingan lilin malam. Tanyakan filosofi pakem keraton, sejarah ragam pesisiran, hingga tata krama busana adat bersama asisten AI budayawan penjaga warisan leluhur.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-display text-white/80">
                <span className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Batik Ask Siap Berdialog
                </span>
                <span className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 shadow-xs">
                  <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" /> Berbasis Serat Klasik Mataram
                </span>
                <span className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verifikasi Falsafah Pakem
                </span>
              </div>
            </motion.div>

            {/* Right column: Batik Ask Persona Card */}
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
                        src="/images/Logo Tanya Sang Empu.png"
                        alt="Logo Sang Empu"
                        width={48}
                        height={48}
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#1A1614]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-bold text-lg text-white">
                          Batik Ask
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
                <div className="bg-black/30 border border-[#D4AF37]/20 rounded-xl p-4 mb-5 relative">
                  <p className="font-narrative text-xs text-white/85 italic leading-relaxed relative z-10">
                    &ldquo;Batik bukan sekadar gambar pada kain. Ia adalah perlambang kehidupan, doa yang digoreskan dengan canting dan malam.&rdquo;
                  </p>
                  <span className="block text-[10px] text-[#D4AF37] font-display font-bold mt-3 text-right relative z-10">
                    - Go Tik Swan (Panembahan Hardjonagoro)
                  </span>
                </div>

                <div className="mb-5">
                  <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-3 flex items-center justify-center gap-2.5 shadow-inner backdrop-blur-sm">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-[11px] font-display font-bold text-emerald-400 tracking-wider uppercase">
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
          className={
            isFullscreen
              ? "fixed inset-0 z-[100] bg-[#faf8f4] p-3 sm:p-6 lg:p-8 flex flex-col h-screen overflow-hidden"
              : "max-w-5xl mx-auto px-3.5 sm:px-6 py-8 sm:py-12 pb-28 md:pb-12 w-full"
          }
        >
          {/* Section Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-display font-bold text-[#713f2c] uppercase tracking-wider">
                  Ruang Konsultasi Aktif
                </span>
              </div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-[#2d2b38] mt-1">
                Dialog Bersama Batik Ask
              </h2>
              <p className="font-narrative text-xs sm:text-sm text-[#8d786a]">
                Ketik pertanyaan Anda atau klik salah satu topik populer di bawah ini untuk memulai percakapan:
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="inline-flex items-center gap-1.5 text-xs font-display font-semibold text-[#713f2c] hover:text-white bg-[#faf8f4] hover:bg-[#713f2c] border border-[#713f2c]/30 px-3.5 py-2 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
              >
                {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isFullscreen ? "Tutup Layar Penuh" : "Layar Penuh"}</span>
              </button>
              <Link
                href="/play"
                className="inline-flex items-center gap-1.5 text-xs font-display font-semibold text-[#713f2c] hover:text-white bg-[#faf8f4] hover:bg-[#713f2c] border border-[#713f2c]/30 px-3.5 py-2 rounded-xl transition-all shadow-xs shrink-0"
              >
                <Compass className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Jelajah Arena</span>
              </Link>
            </div>
          </div>

          {/* Quick Question Chips with Left/Right Scroll Controls */}
          <div className="mb-6 relative flex items-center gap-2">
            {/* Left Scroll Button */}
            <button
              type="button"
              onClick={() => scrollChips("left")}
              disabled={!canScrollLeft}
              className={`w-8 h-8 rounded-full bg-white border border-[#d3ccc2] shadow-xs flex items-center justify-center text-[#713f2c] hover:bg-[#713f2c] hover:text-white hover:border-[#713f2c] transition-all shrink-0 cursor-pointer ${
                !canScrollLeft ? "opacity-30 cursor-not-allowed" : "hover:scale-105 active:scale-95"
              }`}
              title="Geser topik ke kiri"
              aria-label="Geser topik ke kiri"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Scrollable Chips Container */}
            <div className="relative flex-1 overflow-hidden">
              {/* Left Gradient Fade */}
              {canScrollLeft && (
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#faf8f4] to-transparent z-10 pointer-events-none" />
              )}

              <div
                ref={chipsRef}
                onWheel={handleChipsWheel}
                onMouseDown={handleChipsMouseDown}
                onMouseMove={handleChipsMouseMove}
                onMouseUp={handleChipsMouseUp}
                onMouseLeave={handleChipsMouseUp}
                className={`flex items-center gap-2 overflow-x-auto py-1 no-scrollbar scroll-smooth touch-pan-x ${
                  isDraggingChips ? "cursor-grabbing select-none" : "cursor-grab"
                }`}
              >
                <span className="text-[11px] font-display font-bold text-[#713f2c] shrink-0 uppercase tracking-wider pl-1">
                  Topik Pilihan:
                </span>
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => {
                      if (!hasDraggedChips) {
                        handleSend(prompt);
                        scrollToChat();
                      }
                    }}
                    className="text-xs bg-white hover:bg-[#713f2c] text-[#2d2b38] hover:text-white border border-[#d3ccc2] hover:border-[#713f2c] px-3.5 py-2 rounded-full transition-all shrink-0 font-body shadow-xs cursor-pointer whitespace-nowrap active:scale-95"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Right Gradient Fade */}
              {canScrollRight && (
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#faf8f4] to-transparent z-10 pointer-events-none" />
              )}
            </div>

            {/* Right Scroll Button */}
            <button
              type="button"
              onClick={() => scrollChips("right")}
              disabled={!canScrollRight}
              className={`w-8 h-8 rounded-full bg-white border border-[#d3ccc2] shadow-xs flex items-center justify-center text-[#713f2c] hover:bg-[#713f2c] hover:text-white hover:border-[#713f2c] transition-all shrink-0 cursor-pointer ${
                !canScrollRight ? "opacity-30 cursor-not-allowed" : "hover:scale-105 active:scale-95"
              }`}
              title="Geser topik ke kanan"
              aria-label="Geser topik ke kanan"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Container Card */}
          <div className={`bg-white border border-[#d3ccc2] rounded-2xl shadow-md overflow-hidden flex flex-col ${isFullscreen ? 'flex-1 min-h-0' : ''}`}>
            {/* Header of Chat Card */}
            <div className="bg-[#faf8f4] border-b border-[#d3ccc2] px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#713f2c] text-[#D4AF37] flex items-center justify-center font-display font-bold text-xs shadow-xs relative overflow-hidden shrink-0">
                  <Image src="/images/Logo Tanya Sang Empu.png" alt="Sang Empu" fill sizes="32px" className="object-cover" />
                </div>
                <div>
                  <span className="font-display font-bold text-xs sm:text-sm text-[#2d2b38] block leading-tight">
                    Batik Ask - Sang Empu Nusantara
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-[#8d786a] font-narrative">
                    Menjawab dengan rujukan serat filosofis
                  </span>
                </div>
              </div>

              <span className="text-[10px] sm:text-[11px] font-display font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full flex items-center gap-1.5 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Terhubung
              </span>
            </div>

            {/* Chat Messages Log */}
            <div
              ref={scrollRef}
              className={`flex-1 overflow-y-auto space-y-4 sm:space-y-5 p-3.5 sm:p-6 bg-[#fcfbf9] min-h-[300px] sm:min-h-[380px] scrollbar-thin scrollbar-thumb-[#d3ccc2] scrollbar-track-transparent ${isFullscreen ? '' : 'max-h-[520px]'}`}
            >
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex gap-2.5 sm:gap-3.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 border relative overflow-hidden ${
                        msg.role === "user"
                           ? "bg-[#2d2b38] text-white border-[#2d2b38]"
                          : "bg-[#713f2c] text-[#D4AF37] border-[#D4AF37]/40 shadow-xs"
                      }`}
                    >
                      {msg.role === "user" ? <User className="w-4 h-4" /> : <Image src="/images/Logo Tanya Sang Empu.png" alt="Sang Empu" fill sizes="36px" className="object-cover" />}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`max-w-[88%] sm:max-w-[80%] rounded-2xl px-3.5 py-3 sm:px-5 sm:py-4 shadow-xs ${
                        msg.role === "user"
                          ? "bg-[#713f2c] text-white rounded-tr-none"
                          : "bg-white text-[#2d2b38] border border-[#d3ccc2]/80 rounded-tl-none"
                      }`}
                    >
                      <FormattedMessage content={msg.content} isUser={msg.role === "user"} />
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
                  className="flex gap-2.5 sm:gap-3.5 flex-row"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#713f2c] text-[#D4AF37] border border-[#D4AF37]/40 flex items-center justify-center shrink-0 shadow-xs relative overflow-hidden">
                    <Image src="/images/Logo Tanya Sang Empu.png" alt="Sang Empu" fill sizes="36px" className="object-cover" />
                  </div>
                  <div className="bg-white border border-[#d3ccc2]/80 rounded-2xl rounded-tl-none px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-2.5 shadow-xs">
                    <span className="text-xs text-[#8d786a] font-narrative">
                      Batik Ask sedang menimbang petuah...
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
              className="p-2.5 sm:p-3 bg-white border-t border-[#d3ccc2] flex items-center gap-2 sm:gap-3 focus-within:ring-2 focus-within:ring-[#713f2c]/20 transition-all"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanyakan makna motif, filosofi, atau sejarah wastra..."
                className="flex-1 bg-[#faf8f4] border border-[#d3ccc2] px-3.5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm text-[#2d2b38] placeholder-[#8d786a] focus:outline-hidden focus:border-[#713f2c] font-body"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="bg-[#713f2c] hover:bg-[#583122] disabled:opacity-40 text-[#D4AF37] px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl transition-all shadow-md shrink-0 flex items-center gap-2 font-display font-bold text-xs cursor-pointer disabled:cursor-not-allowed"
                title="Kirim Pertanyaan"
              >
                <span className="hidden sm:inline">Kirim</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Helpful cultural guidance note */}
          <div className="mt-4 flex items-start gap-2.5 text-xs text-[#8d786a] bg-amber-50/60 border border-amber-200/60 rounded-xl p-3 sm:p-3.5">
            <HelpCircle className="w-4 h-4 text-[#713f2c] shrink-0 mt-0.5" />
            <p className="font-narrative leading-relaxed">
              <strong>Tips Konsultasi:</strong> Anda dapat menanyakan filosofi motif tertentu (misal: <em>&quot;Apa makna motif Parang Rusak?&quot;</em>), kecocokan busana untuk momen adat (misal: <em>&quot;Batik apa yang tepat untuk lamaran?&quot;</em>), atau perbedaan teknik cap dan tulis.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
