---
name: batikkita-frontend-ui
description: "Panduan UI/UX Engineering untuk platform Batik Kita. Berisi panduan struktur komponen Next.js App Router, styling menggunakan Tailwind CSS & Shadcn UI (tema Modern Heritage), integrasi Framer Motion untuk animasi dan Jigsaw Puzzle engine."
---

# Frontend UI Engineering (Batik Kita)

Dokumen ini adalah panduan standar pengembangan antarmuka (UI/UX) untuk **Batik Kita** — platform edukasi interaktif seni batik nusantara (HoloDev - HOLOGY 9.0). 

## 1. Arsitektur Proyek (Next.js 14/15 App Router)

```text
src/
├── app/
│   ├── layout.tsx            # Root layout, Fonts (Plus Jakarta Sans/Inter)
│   ├── page.tsx              # Landing page
│   ├── play/
│   │   ├── jigsaw/page.tsx   # Edu-Game: Jigsaw Puzzle
│   │   └── detektif/page.tsx # Edu-Game: Detektif Isen-Isen
│   ├── scanner/page.tsx      # Fitur AI Batik Lens / Scanner
│   ├── empu/page.tsx         # Fitur "Tanya Sang Empu" AI Chat
│   └── peta/page.tsx         # Peta Geografis Interaktif Sentra Batik
├── components/
│   ├── ui/                   # Komponen base (Shadcn UI: button, card, dialog, dll)
│   ├── games/                # Komponen interaktif game (PuzzleBoard, PuzzlePiece)
│   ├── ai/                   # Komponen terkait AI (ScannerCamera, EmpuChatBubble)
│   └── shared/               # Komponen global (Navbar, Footer, BatikCard)
```

## 2. Design System: Tema "Modern Heritage"

Gunakan palet warna Tailwind kustom berikut pada komponen:

- **Primary (Royal Sogan Brown)**: Untuk tombol utama, header. 
  - Gunakan class `bg-amber-900` atau warna hex setara `#7A3E1D`.
- **Accent (Heritage Gold)**: Untuk xp badges, highlights, efek kemenangan.
  - Gunakan class `text-amber-500` / `bg-amber-500`.
- **Secondary (Indigofera Blue)**: Untuk elemen interaktif sekunder (mengacu pada batik pesisiran).
  - Gunakan class `bg-blue-800`.
- **Background (Mori Fabric Cream)**: Untuk latar belakang halaman utama.
  - Gunakan warna off-white/cream yang lembut (`bg-stone-50`).

### Tipografi
- **Heading**: Menggunakan font modern tanpa serif (misal: `Plus Jakarta Sans` atau `Outfit`).
- **Body/Narasi**: Menggunakan font serif atau sans yang sangat *readable* (`Inter` atau `Source Serif 4`) untuk menjelaskan filosofi batik.

## 3. Panduan Interaktivitas & Animasi (Framer Motion)

Semua interaksi harus terasa *fluid* dan responsif (Target 60 FPS).
- **Page Transitions**: Gunakan efek *fade in* lembut saat pindah antar halaman (mis. masuk ke halaman game).
- **Puzzle Snap Effect**: Saat user melakukan *drag-and-drop* komponen puzzle, berikan animasi snap (magnetik) dan *glow* ketika posisi benar.
- **Micro-interactions**: 
  - Tombol hover: Efek skala kecil (`scale: 1.05`).
  - Unlocking Card: Hologram shimmer effect (CSS gradient animasi).

## 4. Aksesibilitas & Responsivitas Mobile

- **Mobile-First**: Edu-game Jigsaw dan Scanner akan sangat sering diakses melalui *smartphone*. 
- **Touch Targets**: Pastikan potongan puzzle dan tombol "Cek Motif" memiliki area sentuh minimal `48x48px`.
- **Bottom Sheet**: Untuk UI Chat AI atau detail peta di mobile, gunakan pola *bottom sheet* (drawer yang muncul dari bawah) daripada modal biasa.

## 5. Implementasi HTML5 Canvas (Quick Draw)
Untuk fitur menggambar atau menjiplak motif batik, gunakan komponen berbasis `<canvas>` murni yang dibungkus di dalam React component dengan `useRef`. Hindari re-render React berlebihan pada *mouse/touch events* di canvas.
