---
name: code-review-and-quality
description: "Multi-axis code review and quality gate for Batik Kita (HOLOGY 9.0). Covers five-axis review (correctness, readability, architecture, security, performance), Next.js 16 App Router, React 19, Tailwind CSS, Framer Motion, HTML5 Canvas, and cultural fidelity."
---

# Code Review and Quality (Batik Kita — HOLOGY 9.0)

Panduan review kode multi-dimensi untuk platform **Batik Kita** — dirancang untuk memastikan performa tinggi (60 FPS interaksi/game), akurasi budaya batik, keamanan API AI, dan keterawatan kode jangka panjang.

---

## 1. Standar Approval

> **Approve perubahan yang meningkatkan kualitas kode dan pengalaman pengguna secara nyata.** Fokus pada kesederhanaan, performa rendering, dan akurasi logika interaksi budaya/game. Hindari abstraksi spekulatif yang tidak diperlukan.

---

## 2. Five-Axis Review

Setiap review mengevaluasi kode di 5 dimensi utama:

### Axis 1: Correctness & Interaction Precision

- **Edu-Game Logic**:
  - Apakah state drag-and-drop potongan puzzle akurat (1:1 visual scale saat di-drag)?
  - Apakah click-to-place dan deteksi tabrakan slot memiliki toleransi klik yang wajar (40–50px)?
  - Apakah koordinat target di *Detektif Isen-Isen* selaras dengan rasio aspek gambar motif asli?
  - Apakah sistem skor dan penambahan XP terekam konsisten ke penyimpanan (lokal/Supabase)?
- **Cultural Accuracy**:
  - Apakah nama motif, asal daerah, dan filosofi batik akurat sesuai literatur budaya nusantara?
  - Apakah kategori batik (Keraton vs Pesisiran vs Kontemporer) terklasifikasi dengan benar?

### Axis 2: Readability & Simplicity (Ponytail & Karpathy Rules)

- **Surgical Changes**: Apakah perubahan hanya menyentuh bagian yang dibutuhkan tanpa mengacak-acak kode sekitarnya?
- **Minimal Complexity**: Apakah ada utilitas atau komponen yang sebenarnya sudah ada di codebase dan bisa di-*reuse* daripada membuat baru?
- **No Over-Engineering**: Hindari factory/wrapper berlebihan untuk logika yang cukup diselesaikan dalam beberapa baris kode standar.
- **Nama Jelas**: Komponen, fungsi, dan state dinamai secara intuitif (`currentPiece`, `targetCoord`, `xpLevel`).

### Axis 3: Architecture & Next.js 16 Standards

- **Server vs Client Boundary**:
  - Apakah komponen yang membutuhkan interaktivitas (`useState`, `framer-motion`, event listeners) ditandai dengan `"use client"`?
  - Apakah komponen statis tetap berupa React Server Components (RSC) untuk efisiensi bundle?
- **Next.js 16 App Router**:
  - Hindari impor dependensi Node.js di browser bundle.
  - Gunakan `next/image` dengan `priority` untuk banner/logo utama dan responsive `sizes` untuk kartu motif.
  - Pisahkan layout shared di `src/components/shared/` dan komponen game di `src/components/games/`.

### Axis 4: Security & Sensitive Secrets

- **AI API Keys**:
  - Kredensial rahasia (Gemini API Key, Supabase Service Role) **TIDAK BOLEH PERNAH** berada di *Client Component* atau diekspos via `NEXT_PUBLIC_`.
  - Semua inferensi AI (Batik Lens & Chat Sang Empu) harus melewati Route Handler / Server Action di backend.
- **Input Validation**:
  - Validasi ukuran file gambar kamera/scanner (maksimal 4MB).
  - Sanitasi pesan prompt chat pengguna sebelum dikirim ke model AI.

### Axis 5: Performance & Mobile Responsiveness

- **Fluid 60 FPS Animations**:
  - Animasi Framer Motion dan partikel kanvas tidak boleh memicu layout thrashing atau re-render React berlebihan pada *mouse/touch move*.
  - Gunakan CSS transform / opacity daripada menganimasikan `width`, `height`, atau `top`/`left`.
- **Touch Targets**:
  - Seluruh tombol interaktif, slot puzzle, dan chip navigasi wajib memiliki area sentuh minimal **48x48px** untuk kenyamanan pengguna mobile.
- **Optical Balance**:
  - Periksa hierarki visual, kontras warna teks (terutama terhadap gambar latar kain batik), dan perataan vertikal agar tidak timpang.

---

## 3. Quality Gate Checklist Sebelum Merge / Commit

- [ ] Kode lulus build `npm run build` / TypeScript type check tanpa error.
- [ ] Tidak ada warning ESLint kritis atau import yang tidak terpakai (*dead code*).
- [ ] Perubahan diff bersih, fokus, dan dapat ditelusuri langsung ke kebutuhan task.
