# Batik Kita — Platform Edukasi Budaya & AI Cultural Experience

<div align="center">

![Logo Batik Kita](webdev/frontend/public/images/logo-batik-kita.png)

### *Warisan Luhur Nusantara dalam Sentuhan Inovasi Digital*

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.8-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![ONNX Runtime Web](https://img.shields.io/badge/ONNX_Runtime-WebAssembly-005ced?style=for-the-badge&logo=onnx)](https://onnxruntime.ai/)
[![Docker Ready](https://img.shields.io/badge/Docker-Ready-2496ed?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![Competition](https://img.shields.io/badge/HoloDev-HOLOGY_9.0-D4AF37?style=for-the-badge)](https://hology.ub.ac.id/)

</div>

---

## Tentang Batik Kita

**Batik Kita** adalah platform edukasi budaya digital interaktif yang mentransformasikan cara generasi muda mempelajari, mengapresiasi, dan melestarikan seni batik Nusantara (Warisan Kemanusiaan untuk Budaya Lisan dan Nonbendawi UNESCO). 

Platform ini memadukan **Edge AI Computer Vision (ONNX WebAssembly)**, **Edu-Games Arcade Berbasis Gamifikasi**, **Ensiklopedi Digital Batik Pedia**, asisten dialog interaktif **Batik Ask (Tanya Sang Empu)**, serta **Album Koleksi Wastra** dengan bingkai adaptif tingkat kemahiran (*mastery*).

---

## Arsitektur Ekosistem Fitur (Batik Suite)

Seluruh fitur di dalam Batik Kita dirancang dengan tata nama yang berpola harmonis, modern, dan bernuansa Indonesia:

| Fitur | Endpoint URL | Status Redirect | Deskripsi & Keunggulan Inovasi |
| :--- | :--- | :--- | :--- |
| **Batik Lens** | `/scan` | Utama | Scanner pemindai motif batik berbasis **Edge AI Vision (ONNX)** langsung di peramban web. Privasi 100% aman, tanpa latensi server luar. |
| **Batik Arcade** | `/play` | Utama | Hub edukasi gamifikasi budaya dengan Paspor Budaya, akumulasi XP, dan Tangga Peringkat (*Pelajar Budaya* hingga *Empu Batik Digital*). |
| **Batik Cap** | `/play/cap` | `← /play/cap-stamping` | Permainan presisi canting cap tembaga dengan **Mesin Partisi Polimino Acak (BFS Growth)** pada 3 tingkat kesulitan mandiri (Mudah, Menengah, Sulit). |
| **Batik Guess** | `/play/guess` | `← /play/tebak-motif` | Permainan deduksi budaya 4 jenjang petunjuk tertutup segel lilin malam (*Heritage Wax Seal*). |
| **Batik Map** | `/play/map` | `← /play/sortir-peta` | Eksplorasi geografi budaya Nusantara berbasis peta interaktif MapLibre GL menyusuri 7 sentra otentik batik. |
| **Batik Zoom** | `/play/zoom` | `← /play/tika` | Uji observasi ketajaman visual makro bertahap dari pembesaran 800% hingga 100%. |
| **Batik Pedia** | `/batikpedia` | Utama | Ensiklopedia 20 ragam hias motif batik Nusantara terlengkap beserta nilai filosofi, sentra asal, klasifikasi, dan etika pemakaian. |
| **Batik Ask** | `/chat` | Utama | Asisten dialog kultural AI interaktif (Sang Empu) untuk berdiskusi mengenai sejarah dan makna simbolis kain batik. |
| **Album Koleksi** | `/collection` | Utama | Galeri kartu pencapaian 20 motif resmi dengan **Border Mastery Dinamis** (Perunggu, Perak, dan Emas Berkilau). |

> **Catatan Backward-Compatibility**: Seluruh tautan lama (`/play/tika`, `/play/cap-stamping`, `/play/sortir-peta`, `/play/tebak-motif`) telah dikonfigurasi dengan auto-redirect HTTP 308 di `next.config.ts` sehingga tidak pernah terjadi *broken link*.

---

## Keunggulan Rekayasa & Inovasi Teknologi

### 1. In-Browser Edge AI (Batik Lens)
* **Arsitektur Backbone:** EfficientNet-B0 (Transfer Learning terlatih pada 9.240 citra kurasi).
* **Format:** ONNX (Open Neural Network Exchange) v14 Opset, dikompresi ke ~15.38 MB.
* **Eksekusi:** Dijalankan langsung pada CPU/GPU klien menggunakan WebAssembly (Wasm) via `onnxruntime-web`.
* **Metrik Akurasi (300 Citra Uji Independen):**
  * **Top-1 Accuracy:** **97.33%** (292 / 300 prediksi tepat)
  * **Top-3 Accuracy:** **99.00%** (297 / 300 prediksi tepat)
  * **Latensi Inferensi:** ~50–120 ms tanpa pengiriman gambar ke cloud.

### 2. Algoritma Partisi Polimino Dinamis (Batik Cap)
* Sistem memotong kanvas mori menjadi puzzle kepingan polimino acak menggunakan algoritma **Constrained Breadth-First Search (BFS)** dan penempatan *seed* seimbang (`polyominoPartition.ts`).
* Menghilangkan pola statis/hardcoded; setiap sesi permainan menghadirkan potongan yang unik dan acak.
* Tingkat kesulitan berdiri mandiri tanpa mendikte jenis motif:
  * **Mudah:** Grid 3 × 3, 3–4 kepingan (+100 XP).
  * **Menengah:** Grid 3 × 3, 5–6 kepingan (+150 XP).
  * **Sulit:** Grid 4 × 4, 7–8 kepingan polimino kompleks (+200 XP).

### 3. Sistem Border Mastery Adaptif (Album Koleksi)
* Tingkat kesulitan yang dituntaskan pemain pada Batik Cap secara dinamis mengubah penampilan kartu wastra di `/collection`:
  * **Terkunci:** Tampilan monokrom grayscale redup disertai panduan cara membuka kartu.
  * **Koleksi Dasar:** Border hijau zamrud (`emerald-500`) untuk motif yang dibuka dari Batik Guess, Batik Map, atau Batik Zoom.
  * **Cap Dasar:** Border perunggu solid (`#B87333`) untuk tingkat Mudah.
  * **Cap Terampil:** Border perak metalik halus (`#CBD5E1`) untuk tingkat Menengah.
  * **Mahakarya Empu:** Border emas ganda berkilau (`#D4AF37`) dengan *gold glow shadow* dan animasi kilau hologram (*shimmer*) untuk tingkat Sulit.

### 4. Peta Geografis Sentra Nusantara Sinkron (Batik Map)
* Peta vektor berbasis **MapLibre GL** dan GeoJSON pulau Nusantara diselaraskan secara ketat dengan **7 Sentra Otentik** yang terdaftar pada dataset tim: *DKI Jakarta, Cirebon, Pekalongan, D.I. Yogyakarta, Surakarta, Lasem, dan Kalimantan*.

---

## Panduan Menjalankan dengan Docker (Rekomendasi)

Platform ini telah dilengkapi dengan konfigurasi **Docker Multi-Stage Build** yang menghasilkan image super ramping melalui fitur `output: "standalone"` Next.js 16.

### Prasyarat
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Docker Compose v2+)

### Langkah Menjalankan
Cukup jalankan satu perintah berikut dari direktori root proyek:

```bash
docker compose up --build
```

Setelah proses build selesai, buka peramban Anda di:
**[http://localhost:3000](http://localhost:3000)**

Untuk mematikan container:
```bash
docker compose down
```

---

## Panduan Menjalankan Secara Lokal (Node.js)

### Prasyarat
- **Node.js**: v20.x atau v22.x LTS
- **npm**: v10.x ke atas

### Langkah Instalasi & Menjalankan

```bash
# 1. Masuk ke direktori frontend
cd webdev/frontend

# 2. Salin template environment variables jika diperlukan
cp .env.example .env.local

# 3. Instal dependensi paket
npm install

# 4. Jalankan server pengembang lokal
npm run dev
```

Buka **[http://localhost:3000](http://localhost:3000)** di peramban web Anda.

### Uji Kompilasi & Tipe Data
```bash
# Memeriksa validasi TypeScript bebas error
npx tsc --noEmit

# Membangun bundle produksi
npm run build
```

---

## Struktur Direktori Repositori

```text
.
├── docs/                             # Dokumentasi & Spesifikasi Produk
│   ├── PRD_BATIK_KITA.md             # Product Requirement Document (PRD) Utama
│   ├── PRD_ARENA_GAMES_REVISI.md     # PRD Revisi Edu-Games Arcade
│   ├── IDE_BATIK.md                  # Riset Kultural & Ideasi
│   └── LAPORAN_QA_QC.md              # Laporan Audit Kualitas Perangkat Lunak
├── ml/                               # Machine Learning & AI Pipeline
│   ├── batik_classifier_pipeline.py  # Skrip training PyTorch (Kaggle GPU)
│   ├── batik_classifier_pipeline.ipynb # Notebook evaluasi, confusion matrix, & EDA
│   ├── batik_efficientnet.onnx       # Bobot model biner ONNX (15.38 MB)
│   └── class_mapping.json            # Mapping index 0-19 ke metadata motif resmi
├── webdev/
│   └── frontend/                     # Aplikasi Web Next.js 16
│       ├── public/
│       │   ├── images/               # Aset foto motif batik 20 kelas & banner
│       │   ├── models/               # Model ONNX & metadata untuk peramban
│       │   └── wasm/                 # Binari WebAssembly onnxruntime-web
│       ├── src/
│       │   ├── app/                  # Next.js App Router (Rute Baru Suite Batik)
│       │   │   ├── page.tsx          # Beranda utama
│       │   │   ├── scan/             # Batik Lens (AI Scanner)
│       │   │   ├── chat/             # Batik Ask (Tanya Sang Empu)
│       │   │   ├── batikpedia/       # Batik Pedia (Ensiklopedia Motif)
│       │   │   ├── collection/       # Album Koleksi Wastra (Mastery Cards)
│       │   │   └── play/             # Batik Arcade
│       │   │       ├── cap/          # Batik Cap (Grid Dinamis)
│       │   │       ├── guess/        # Batik Guess (Deduksi 4 Jenjang)
│       │   │       ├── map/          # Batik Map (Peta 7 Sentra)
│       │   │       └── zoom/         # Batik Zoom (Observasi Makro)
│       │   ├── components/           # Komponen UI Modern Heritage
│       │   ├── data/                 # Dataset 20 motif resmi & GeoJSON
│       │   ├── hooks/                # Hook useXp (XP, Rank, & Mastery State)
│       │   └── lib/                  # Engine polyominoPartition & onnxClassifier
│       ├── Dockerfile                # Multi-stage container build
│       └── next.config.ts            # Konfigurasi Next.js & 308 Auto-Redirects
├── docker-compose.yml                # Orkestrasi Docker root
├── .env.example                      # Template variabel lingkungan
├── .gitignore                        # Git ignore terstandar
└── README.md                         # Dokumentasi utama proyek
```

---

## Standar Budaya & 20 Motif Resmi Nusantara

Platform ini berpedoman pada dataset kurasi terstandar yang mencakup 20 motif mahakarya dari berbagai sentra:

1. **DKI Jakarta:** Batik Betawi
2. **Cirebon:** Batik Mega Mendung, Batik Singa Barong
3. **Pekalongan:** Batik Jlamprang, Batik Buketan, Batik Tujuh Rupa
4. **D.I. Yogyakarta:** Batik Kawung, Batik Sekar Jagad, Batik Sido Mulyo, Batik Srikaton, Batik Bokor Kencono
5. **Surakarta (Solo):** Batik Parang, Batik Truntum, Batik Sido Luhur, Batik Sido Mukti, Batik Wahyu Tumurun, Batik Wirasat
6. **Lasem:** Batik Liong
7. **Kalimantan:** Batik Dayak

---

## Tim Pengembang (HoloDev — HOLOGY 9.0)

* **Rayka** — *Tech Lead, Fullstack Architecture & Machine Learning Engineering*
* **Rayhan** — *UI/UX Design, Asset Digital & Multimedia*
* **Haekal** — *Business Analyst, Cultural Research & Proposal*

---

<div align="center">
  <sub>Dibangun dengan kebanggaan untuk pelestarian warisan budaya adiluhung Indonesia</sub><br>
  <sub>HOLOGY 9.0 — Fakultas Ilmu Komputer, Universitas Brawijaya</sub>
</div>
