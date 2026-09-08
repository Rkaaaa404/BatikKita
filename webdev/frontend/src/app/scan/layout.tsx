import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Batik Lens: Scanner AI Pengenal Motif On-Device | Batik Kita",
  description:
    "Pindai dan kenali 20 motif batik tradisional Indonesia secara instan langsung di peramban web Anda tanpa kirim data ke server luar, didukung model EfficientNet-B0 ONNX Runtime WebAssembly.",
  keywords: ["Batik Lens", "AI Scanner Batik", "Edge AI", "ONNX Runtime", "Batik Kita"],
};

export default function ScanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
