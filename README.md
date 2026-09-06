# 🎨 Batik Kita — Platform Edukasi Budaya & AI Cultural Experience

> **Kompetisi:** HoloDev — HOLOGY 9.0 (Universitas Brawijaya)  
> **Subtema:** Transformasi Pendidikan Digital & Pembelajaran Sepanjang Hayat  
> **Stack:** Next.js 16 (Turbopack) • React 19 • Tailwind CSS v4 • EfficientNet-B0 (ONNX Edge AI) • Docker

---

## 🌟 Tentang Batik Kita

**Batik Kita** adalah platform edukasi budaya digital interaktif yang mentransformasi cara generasi muda mempelajari, mengapresiasi, dan mengeksplorasi seni batik nusantara. Memadukan **Edge AI Computer Vision**, **Edu-Games Arcade**, **Ensiklopedia Interaktif Batikpedia**, dan dialog budaya bersama **Tanya Sang Empu**, platform ini mengubah pembelajaran filosofi batik dari konsumsi teks pasif menjadi petualangan visual yang seru, terukur, dan bermakna.

---

## 🚀 Fitur Utama

| Fitur | Deskripsi | Route |
|---|---|---|
| 🔍 **Batik Lens** | Scanner AI kamera/upload foto kain batik secara *real-time* via **ONNX WebAssembly** di sisi browser (privat, tanpa latensi server). Menampilkan Top-1 motif, Top-3 probabilitas, dan filosofi luhur. | `/scan` |
| 🎮 **Arena Edu-Games** | 4 mini-game interaktif: *Tebak Motif Berjenjang*, *Sortir Motif ke Peta*, *Cap Stamping Canvas*, dan *Tika Studio*. | `/play` |
| 📖 **Batikpedia** | Ensiklopedia 20 motif batik nusantara lengkap dengan sentra asal, klasifikasi (Keraton, Pesisiran, Larangan), ornamen isen-isen, serta etika pemakaian. | `/batikpedia` |
| 💬 **Tanya Sang Empu** | Asisten AI kultural cerdas untuk berdiskusi mengenai makna filosofis dan sejarah kain batik. | `/chat` |
| 🗺️ **Peta Geografis** | Eksplorasi sebaran motif batik antarpulau dan sentra perajin di Indonesia. | `/play/sortir-peta` |

---

## 🤖 Performa Model AI (Batik Lens)

* **Backbone Architecture:** EfficientNet-B0 (Transfer Learning)
* **Format:** Open Neural Network Exchange (ONNX) v14 Opset
* **Ukuran Bobot:** ~15.38 MB (Sangat ringan untuk Edge WebAssembly)
* **Dataset:** 20 Kelas Motif Batik Nusantara (9.240 citra terkurasi)
* **Hasil Pengujian (Unseen Test Set):**
  * 🎯 **Top-1 Accuracy:** **97.33%** (292 / 300 benar)
  * 🏆 **Top-3 Accuracy:** **99.00%** (297 / 300 benar)
  * ⚡ **Latensi Inferensi:** ~50–120 ms langsung di peramban pengguna

---

## 🐳 Menjalankan dengan Docker (Rekomendasi)

Platform ini telah dilengkapi dengan konfigurasi **Docker Multi-Stage Build** yang mengoptimalkan ukuran image menjadi sangat ramping menggunakan mode `output: "standalone"` Next.js.

### Prasyarat
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Docker Compose v2+)

### Langkah Menjalankan
Cukup jalankan perintah berikut dari direktori root:

```bash
# Build dan jalankan container
docker compose up --build
```

Aplikasi akan otomatis dapat diakses di:
👉 **[http://localhost:3000](http://localhost:3000)**

Untuk menghentikan container:
```bash
docker compose down
```

---

## 💻 Menjalankan Secara Lokal (Node.js)

### Prasyarat
- Node.js v20+ atau v22+
- npm v10+

### Langkah Menjalankan
```bash
# Masuk ke folder frontend
cd webdev/frontend

# Install dependensi
npm install

# Jalankan development server
npm run dev
```

Buka **[http://localhost:3000](http://localhost:3000)** di browser Anda.

---

## 📁 Struktur Direktori Workspace

```text
├── docs/                             # Dokumentasi & Spesifikasi Produk
│   ├── PRD_BATIK_KITA.md             # Product Requirement Document (PRD) Utama
│   ├── PRD_ARENA_GAMES_REVISI.md     # PRD Revisi Edu-Games Arcade
│   ├── IDE_BATIK.md                  # Brainstorming & Riset Ide Kultural
│   └── LAPORAN_QA_QC.md              # Laporan Audit Kualitas & Pengujian Halaman
├── ml/                               # Machine Learning & AI Pipeline
│   ├── batik_classifier_pipeline.py  # Skrip training PyTorch (Kaggle T4)
│   ├── batik_classifier_pipeline.ipynb # Notebook visualisasi & EDA
│   ├── batik_efficientnet.onnx       # Bobot model biner ONNX (15.4 MB)
│   └── class_mapping.json            # Mapping index 0-19 ke metadata motif
├── webdev/
│   └── frontend/                     # Next.js 16 Web Application
│       ├── public/
│       │   ├── models/               # Model ONNX & mapping untuk browser
│       │   ├── wasm/                 # Runtime WebAssembly onnxruntime-web
│       │   └── images/               # Asset grafis & foto batik teroptimasi
│       ├── src/
│       │   ├── app/                  # Next.js App Router pages
│       │   ├── components/           # UI Components (Modern Heritage theme)
│       │   ├── data/                 # Datasets batik 20 kelas & katalog
│       │   └── lib/                  # onnxClassifier.ts inference engine
│       ├── Dockerfile                # Multi-stage Docker build
│       └── next.config.ts            # Standalone output configuration
├── docker-compose.yml                # Orkestrasi container Docker root
├── .env.example                      # Template environment variables
├── .gitignore                        # Git ignore terstandar
└── README.md                         # Dokumentasi utama proyek
```

---

## 👥 Tim Pengembang (Batik Kita)

* **Rayka** — *Tech Lead, Fullstack & Machine Learning Engineering*
* **Rayhan** — *UI/UX Design & Multimedia*
* **Haekal** — *Business Analyst & Proposal*
