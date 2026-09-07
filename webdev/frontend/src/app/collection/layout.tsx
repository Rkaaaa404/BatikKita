import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Album Koleksi & Tingkat Kemahiran Wastra | Batik Kita",
  description:
    "Pantau progres eksplorasi 20 kartu budaya wastra nusantara dan tingkat kemahiran bingkai emas dari tantangan Batik Cap.",
  keywords: ["Koleksi Wastra", "Tingkat Kemahiran", "Gamifikasi Batik", "Batik Kita"],
};

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
