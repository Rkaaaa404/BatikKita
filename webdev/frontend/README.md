# Batik Kita — Frontend Web Application

Aplikasi web edukasi budaya interaktif **Batik Kita** dibangun menggunakan **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, dan **onnxruntime-web** untuk menghadirkan pengalaman pelestarian wastra Nusantara berstandar *Modern Heritage*.

---

## 🛠️ Teknologi & Dependensi Utama

- **Framework:** [Next.js 16.3.4](https://nextjs.org/) (Turbopack, App Router, React Server Components)
- **Library UI:** [React 19.2.8](https://react.dev/) & [Motion (Framer Motion)](https://motion.dev/)
- **Styling:** [Tailwind CSS v4.0](https://tailwindcss.com/) dengan skema tema *Modern Heritage* (Soga Brown & Gold)
- **Edge AI & Computer Vision:** [ONNX Runtime Web](https://onnxruntime.ai/) (WebAssembly backend untuk model EfficientNet-B0 lokal)
- **Peta Interaktif:** [MapLibre GL](https://maplibre.org/) untuk geolokasi 7 sentra batik
- **Audio Streaming:** Chunked Native Indonesian Audio Stream (`/api/tts`) & Web Speech API fallback
- **Ikon & Efek:** [Lucide React](https://lucide.dev/) & [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 🚀 Panduan Menjalankan Frontend

### 1. Instalasi Dependensi
```bash
cd webdev/frontend
npm install
```

### 2. Konfigurasi Variabel Lingkungan
Salin template konfigurasi:
```bash
cp .env.example .env.local
```
*(Opsional)* Tambahkan `GEMINI_API_KEY` di file `.env.local` untuk mengaktifkan mode daring chatbot Batik Ask. Jika tidak diisi, sistem otomatis beralih ke **Mode Empu Luring** (offline fallback).

### 3. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka **http://localhost:3000** pada peramban web.

### 4. Validasi Tipe & Build Produksi
```bash
# Uji konsistensi TypeScript
npx tsc --noEmit

# Build bundel produksi
npm run build

# Menjalankan server produksi lokal
npm start
```

---

## 🏛️ Arsitektur Halaman & Rute Layanan

| Rute | Modul Fitur | Penjelasan Teknis & Perilaku |
| :--- | :--- | :--- |
| `/` | **Beranda** | Showcase ekosistem wastra, hero interaktif, dan navigasi suite. |
| `/scan` | **Batik Lens** | Pemindai corak batik berbasis **Edge AI EfficientNet-B0 ONNX Wasm**. Inferensi 100% lokal di browser, dilengkapi **Audio Guide Museum** narasi filosofi. |
| `/play` | **Batik Arcade Hub** | Hub utama game edukasi wastra dengan sistem akumulasi XP dan kenaikan gelar budaya. |
| `/play/cap` | **Batik Cap** | Block puzzle polyomino bertema canting cap tembaga; algoritma partisi BFS dinamis dengan meja kerja 3 slot (*no pagination*). |
| `/play/guess` | **Batik Guess** | Game detektif budaya berformat **1 kolom terpusat** dengan 4 jenjang petunjuk filosofis bertahap, mode Pilihan Kartu, Ketik Bebas, serta bantuan 50:50 & Hint. |
| `/play/map` | **Batik Map** | Eksplorasi drag-and-drop kartu motif ke 7 Sentra Batik Nusantara di atas peta interaktif MapLibre GL. |
| `/play/zoom` | **Batik Zoom** | Observasi makro pola batik; gambar diperbesar ekstrem (800%) dan pemain menebak sebelum gambar perlahan zoom out. |
| `/batikpedia` | **Batik Pedia** | Ensiklopedia 20 motif resmi terverifikasi sejarawan, filter 7 sentra, 3 varian visual per motif, serta tombol **Audio Storytelling**. |
| `/collection` | **Album Koleksi** | Galeri kartu wastra dengan bingkai kemahiran dinamis (*Locked, Emerald, Bronze, Silver, Gold Shimmer*). |
| `/chat` | **Batik Ask** | Chatbot dialog budaya dual-engine (daring via Gemini 2.5 Flash + luring via Pustaka Kearifan Empu lokal). |

---

## 🔌 Rute Backend API (Next.js Serverless)

- **`POST /api/chat`**  
  Menghubungkan pesan pengguna ke Google Gemini 2.5 Flash. Jika kuota API habis (Error 429), API key tidak disetel, atau terjadi gangguan jaringan, endpoint otomatis merespons menggunakan **Mesin Pengetahuan Empu Luring** (`synthesizeOfflineEmpuResponse`) dengan status 200 OK.
- **`GET /api/tts`**  
  Menyediakan audio streaming narasi berbahasa Indonesia alami (`audio/mpeg`) menggunakan mekanisme chunked speech stream, bebas dari latensi sintetis robotik.

---

## 🛡️ Stabilitas & Fault-Tolerance

1. **Global ErrorBoundary:** Membungkus seluruh aplikasi di `src/app/layout.tsx` untuk mencegah crash tak terduga (*white screen*), khususnya pada kegagalan rendering konteks WebGL/Canvas di perangkat tertentu.
2. **Modern Heritage Error & 404 Pages:** Rute `error.tsx` dan `not-found.tsx` didesain konsisten dengan estetika warisan budaya, dilengkapi tombol pemulihan instan ke beranda.
3. **Lifecycle-Safe Audio:** Komponen `AudioNarratorButton` dilengkapi pembatalan pemutaran instan (*unmount cancellation*) saat modal ditutup, menghindari kebocoran memori atau suara yang saling tumpang-tindih.
4. **Client-Side Network Fallback:** Jika jaringan internet perangkat pengguna terputus saat berada di halaman `/chat`, penangan galat peramban langsung mengeksekusi logika nalar Sang Empu secara lokal di browser.

---

## 🐳 Opsi Deployment (Docker & Vercel)

- **Vercel Deployment:**  
  Proyek ini siap dideploy langsung di Vercel. Output serverless ditangani secara bawaan oleh Vercel tanpa konfigurasi tambahan.
- **Docker Standalone Build:**  
  Jika ingin menjalankan via Docker, `next.config.ts` mengaktifkan `output: "standalone"` saat variabel lingkungan `BUILD_STANDALONE=true` disetel.
  ```bash
  # Dari root direktori proyek
  docker compose up --build
  ```
