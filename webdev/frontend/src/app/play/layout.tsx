import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edu-Arcade Batik: 4 Mini-Game Budaya Interaktif | Batik Kita",
  description:
    "Asah intuisi dan pengetahuan batik nusantara melalui 4 game berbasis kurikulum: Sortir Peta, Tebak Motif, Observasi Mikro Zoom, dan Simulasi Pasang Balok Batik Cap.",
  keywords: ["Game Edukasi Batik", "Batik Cap Game", "Sortir Peta", "Tebak Motif", "Batik Kita"],
};

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
