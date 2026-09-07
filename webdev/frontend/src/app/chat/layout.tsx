import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Batik Ask: Tanya Jawab Budaya dengan Sang Empu AI | Batik Kita",
  description:
    "Dialog interaktif mendalam seputar sejarah, filosofi luhur, etika busana adat, dan teknik pembuatan batik nusantara bersama persona Sang Empu yang berwawasan ensiklopedis.",
  keywords: ["Batik Ask", "Sang Empu", "Chatbot Budaya", "Filosofi Batik", "Batik Kita"],
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
