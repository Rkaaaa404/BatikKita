"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, ArrowLeft, Bot, User, Sparkles, MessageSquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
}

const QUICK_PROMPTS = [
  "Apa bedanya batik Solo dan Yogya?",
  "Motif apa yang cocok untuk resepsi pernikahan?",
  "Kenapa motif Parang dulu dilarang untuk rakyat?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      role: "bot",
      content: "Sugeng rawuh, Cucu-cucuku. Saya Empu Batik. Ada yang ingin ditanyakan seputar sejarah, makna, atau pakem memakai kain batik nusantara hari ini?",
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

    // Add user message
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Mock bot reply
    setTimeout(() => {
      setIsTyping(false);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: `Matur nuwun atas pertanyaannya. Sebagai informasi, "${text}" adalah salah satu aspek penting dalam budaya batik. Berdasarkan serat keraton, hal tersebut melambangkan keharmonisan dan budi pekerti luhur manusia Jawa.`,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#1A1614] font-body flex flex-col relative overflow-hidden">
      {/* Pendopo Theme Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-[#713f2c]/40 to-transparent" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at center, transparent 0%, #1A1614 100%)' }} />
      </div>

      {/* Header */}
      <header className="bg-[#1A1614]/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-white/10 transition-colors border border-white/10">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full bg-[#713f2c]/40 border border-[#D4AF37]/40 p-1 flex items-center justify-center shrink-0 shadow-sm">
              <Image
                src="/images/logo-batik-kita.png"
                alt="Logo Batik Kita"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-philosopher font-bold text-xl text-white">Batik Kita</span>
                <span className="text-xs text-white/30">/</span>
                <h1 className="font-display font-semibold text-base text-[#D4AF37]">Sang Empu</h1>
              </div>
              <p className="text-xs text-white/60 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Siap Berbincang
              </p>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-xs font-display font-bold text-white/70">Budayawan AI</span>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full relative z-10 p-4">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-6 pb-6 pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === "user" ? "bg-white/10 text-white" : "bg-[#713f2c] text-[#D4AF37]"
                }`}>
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 shadow-md ${
                  msg.role === "user" 
                    ? "bg-[#D4AF37] text-[#1A1614] rounded-tr-none" 
                    : "bg-white/10 text-white border border-white/10 rounded-tl-none"
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 flex-row"
            >
              <div className="w-8 h-8 rounded-full bg-[#713f2c] text-[#D4AF37] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white/10 border border-white/10 rounded-2xl rounded-tl-none px-5 py-4 flex items-center gap-1.5">
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="pt-4">
          {/* Quick Prompts */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                disabled={isTyping}
                className="shrink-0 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-xs px-4 py-2 rounded-full transition-colors whitespace-nowrap flex items-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                {prompt}
              </button>
            ))}
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanyakan sesuatu pada Sang Empu..."
              disabled={isTyping}
              className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-full pl-6 pr-14 py-4 focus:outline-none focus:border-[#D4AF37]/50 focus:bg-white/15 transition-all text-sm"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-2 bottom-2 aspect-square rounded-full bg-[#D4AF37] text-[#1A1614] flex items-center justify-center hover:bg-[#c9a52f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-center text-[10px] text-white/30 mt-3">
            AI dapat melakukan kesalahan. Harap maklum jika ada kekeliruan sejarah.
          </p>
        </div>
      </main>
    </div>
  );
}
