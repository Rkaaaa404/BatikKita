import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Source_Serif_4, Inter } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const sourceSerif4 = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Batik Kita — Warisan Luhur dalam Sentuhan Digital",
  description:
    "Platform edukasi budaya digital interaktif yang mentransformasi cara generasi muda mempelajari, mengapresiasi, dan mengeksplorasi seni batik nusantara melalui Edu-Games, AI Vision Scanner, Tanya Sang Empu, dan Peta Interaktif.",
  keywords: [
    "Batik Kita",
    "Edukasi Batik",
    "Batik Nusantara",
    "AI Batik Scanner",
    "Tanya Sang Empu",
    "HOLOGY 9.0",
    "HoloDev",
  ],
  authors: [{ name: "Tim Batik Kita (Rayka, Rayhan, Haekal)" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${sourceSerif4.variable} ${inter.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen bg-mori-fabric text-[#1B1C1A] flex flex-col selection:bg-[#7A3E1D] selection:text-[#FDFBF7]">
        {children}
      </body>
    </html>
  );
}
