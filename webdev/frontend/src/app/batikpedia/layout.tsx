import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Batik Pedia: Peta Sentra Kebudayaan & 20 Motif Wastra | Batik Kita",
  description:
    "Ensiklopedia lengkap persebaran geografis sentra batik nusantara dari keraton Jawa hingga pesisiran dan Dayak Kalimantan, dilengkapi eksplorasi ragam warna dan makna filosofis.",
  keywords: ["Batik Pedia", "Ensiklopedia Batik", "Sentra Batik", "Peta Budaya", "Batik Kita"],
};

export default function BatikpediaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
