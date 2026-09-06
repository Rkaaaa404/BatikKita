# Batik Kita — Platform Edukasi Budaya & AI Cultural Experience

<div align="center">

<img src="webdev/frontend/public/images/logo-batik-kita.png" alt="Logo Batik Kita" width="120" />

### *Warisan Luhur Nusantara dalam Sentuhan Inovasi Digital*

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.4_(Turbopack)-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.8-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![ONNX Runtime Web](https://img.shields.io/badge/ONNX_Runtime-WebAssembly-005ced?style=for-the-badge&logo=onnx)](https://onnxruntime.ai/)
[![Docker Ready](https://img.shields.io/badge/Docker-Ready-2496ed?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![Competition](https://img.shields.io/badge/HoloDev-HOLOGY_9.0-D4AF37?style=for-the-badge)](https://hology.ub.ac.id/)

</div>

---

## 🌟 Sekilas Tentang Batik Kita

**Batik Kita** adalah platform edukasi budaya interaktif berbasis kecerdasan buatan (*Artificial Intelligence*) yang mentransformasikan cara generasi muda mempelajari, mengapresiasi, dan melestarikan seni wastra batik Nusantara (Warisan Budaya Takbenda UNESCO sejak 2009).

Melalui perpaduan harmonis antara **Edge AI Computer Vision langsung di peramban web**, **Edu-Games Arcade Berbasis Gamifikasi Otentik**, **Ensiklopedia Batik Pedia Multiragam**, dialog kultural **Tanya Sang Empu (Batik Ask)**, serta **Album Koleksi Wastra** dengan sistem bingkai kemahiran (*mastery borders*), Batik Kita menghadirkan pengalaman belajar yang imersif, ilmiah, dan berakar pada filosofi luhur bangsa.

---

## 🏛️ Arsitektur Ekosistem Fitur (Batik Suite)

Seluruh layanan di dalam Batik Kita dirancang secara modular dan menggunakan tata nama rute (*clean URL design*) yang intuitif:

| Fitur | Rute URL | Tipe Layanan | Penjelasan & Gameplay |
| :--- | :--- | :--- | :--- |
| **Batik Lens** | `/scan` | Edge AI Vision | Pemindai motif batik berbasis **EfficientNet-B0 ONNX WebAssembly**. Inferensi 100% lokal pada peranti klien tanpa mengirim data foto ke server luar (privasi aman & bebas latensi). |
| **Batik Arcade** | `/play` | Hub Game Edukasi | Hub utama arena game batik dengan sistem akumulasi XP dan 5 tingkatan peringkat (*Pelajar Budaya* hingga *Empu Batik Digital*). |
| **Batik Cap** | `/play/cap` | Block Puzzle | Game puzzle balok polyomino ala *Block Blast*; pemain menyusun potongan balok motif ke kisi kanvas dengan meja kerja 3 balok yang otomatis terisi ulang saat dipasang. |
| **Batik Guess** | `/play/guess` | Tebak Nama Motif | Game tebak nama motif batik ala Wordle dengan 4 petunjuk bertahap (daerah asal, ciri visual corak, filosofi makna, dan kisi tebak huruf). |
| **Batik Map** | `/play/map` | Tebak Sentra Peta | Game mencocokkan kartu motif batik ke daerah asalnya di peta interaktif 7 Sentra Batik Nusantara (MapLibre GL). |
| **Batik Zoom** | `/play/zoom` | Uji Hafalan Pola | Game menguji seberapa hafal pemain dengan pola batik dari gambar yang di-zoom in dekat (800%), lalu ditebak sebelum gambarnya perlahan diperkecil (*zoom out*). |
| **Batik Pedia** | `/batikpedia` | Ensiklopedia Digital | Katalog 20 motif resmi terlengkap yang memuat filosofi mendalam, asal-usul sentra, klasifikasi corak, panduan etika pemakaian, dan 3 ragam visual per motif. |
| **Batik Ask** | `/chat` | Conversational AI | Asisten dialog interaktif "Sang Empu" untuk berdiskusi sejarah, makna filosofis ornamen, hingga tata krama busana batik adat. |
| **Album Koleksi** | `/collection` | Progresi & Mastery | Galeri kartu pencapaian wastra berbingkai adaptif (*Dynamic Mastery Borders*): Zamrud, Perunggu, Perak, dan Emas Berkilau Hologram. |

> **Catatan Kompatibilitas**: Rute warisan terdahulu (`/play/tika`, `/play/cap-stamping`, `/play/sortir-peta`, `/play/tebak-motif`) telah dikonfigurasi menggunakan HTTP 308 Permanent Redirect pada `next.config.ts` untuk memastikan kompatibilitas penuh tanpa *broken link*.

---

## ⚡ Sorotan Rekayasa & Inovasi Teknologi

```mermaid
graph TD
    User([Pengguna / Peramban Web]) --> Landing[Beranda Batik Kita]
    
    subgraph "Edge AI Layer (Client-Side ONNX)"
        Landing --> Lens[Batik Lens /scan]
        Lens --> Queue[Serialized Execution Queue]
        Queue --> WasmEngine[ONNX Runtime WebAssembly]
        WasmEngine --> Model[EfficientNet-B0 Model 15.38 MB]
        Model --> InferenceResult[Prediksi Top-3 Motif & Akurasi]
    end
    
    subgraph "Arcade Gaming Engine (/play)"
        Landing --> ArcadeHub[Hub Batik Arcade]
        ArcadeHub --> Cap[Batik Cap: Puzzle Balok Ala Block Blast]
        ArcadeHub --> Guess[Batik Guess: Tebak Nama Motif Ala Wordle]
        ArcadeHub --> MapGame[Batik Map: Peta Tebak 7 Sentra Batik]
        ArcadeHub --> ZoomGame[Batik Zoom: Tebak Motif Zoom In 800%]
    end
    
    subgraph "Cultural Knowledge & Mastery Layer"
        Landing --> Pedia[Batik Pedia: 20 Motif & 3 Ragam Visual]
        Landing --> Ask[Batik Ask: Tanya Sang Empu]
        Landing --> Collection[Album Koleksi Wastra: Tiered Mastery Borders]
        Cap -.->|Buka Tier Mastery| Collection
        ArcadeHub -.->|Akumulasi XP & Rank| Collection
    end
```

### 1. In-Browser Edge AI Vision dengan Serialized Queue (Batik Lens)
* **Arsitektur Model:** Backbone **EfficientNet-B0** yang dilatih khusus melalui transfer learning pada 9.240 citra kurasi kain batik Nusantara.
* **Format & Ukuran:** ONNX Opset 14 teroptimasi biner sebesar **~15.38 MB**.
* **Eksekusi Lokal:** Dijalankan langsung pada thread WebAssembly CPU/GPU klien melalui `onnxruntime-web`. Foto pengguna tidak pernah keluar dari peranti.
* **Metrik Evaluasi Independen (300 Citra Uji Acak):**
  * **Top-1 Accuracy:** **97.33%** (292 / 300 prediksi tepat)
  * **Top-3 Accuracy:** **99.00%** (297 / 300 prediksi tepat)
  * **Latensi Inferensi:** ~50–120 ms (bebas latensi jaringan).
* **Serialized Execution Queue:** Diterapkan antrean eksekusi sequential di `onnxClassifier.ts` untuk mencegah *race condition* atau crash sesi WebAssembly concurrent (`Session already started / mismatch`).

### 2. Puzzle Balok Polyomino (Batik Cap)
* **Gameplay Block Puzzle:** Terinspirasi dari mekanisme puzzle balok (seperti *Block Blast*), pemain menyusun potongan-potongan balok batik ke kisi kanvas 6 × 6 hingga motif terbentuk utuh.
* **Partisi Balok Dinamis (BFS):** Potongan balok dipotong secara acak menggunakan algoritma partisi polimino (*Breadth-First Search*), sehingga variasi balok di setiap sesi permainan selalu berbeda.
* **Meja Kerja 3 Balok (Anti-Pusing):** Meja kerja hanya menampilkan 3 balok aktif. Begitu 1 balok dipasang, posisi balok tersebut langsung diisi balok baru dari antrean tanpa perlu repot geser halaman (*no pagination*).
* **Sensitivitas Magnetik Presisi:** Ambang batas tarik magnetik diperketat (`0.85` unit grid) agar balok menempel pas pada rongga yang tepat.
* **Skalabilitas Kesulitan:**
  * **Mudah:** 5–6 kepingan balok (+100 XP).
  * **Menengah:** 8–10 kepingan balok (+150 XP).
  * **Sulit:** 12–15 kepingan balok (+200 XP).

### 3. Tebak Nama Motif Ala Wordle (Batik Guess)
* Pemain menebak nama motif batik dengan bantuan 4 petunjuk bertahap: daerah asal motif, karakteristik visual corak, makna filosofisnya, dan kisi tebak huruf ala Wordle.

### 4. Peta Tebak Sentra Nusantara (Batik Map)
* Peta interaktif berbasis **MapLibre GL** yang menantang pemain menyeret kartu motif batik dan menempatkannya ke salah satu dari **7 Sentra Batik Nusantara** (*DKI Jakarta, Cirebon, Pekalongan, D.I. Yogyakarta, Surakarta, Lasem, dan Kalimantan*).

### 5. Uji Hafalan Pola Zoom In (Batik Zoom)
* Menguji seberapa hafal dan teliti pemain terhadap pola batik. Gambar motif diperbesar secara ekstrem (hingga 800%), dan pemain harus menebak nama motifnya secepat mungkin sebelum gambar perlahan diperkecil (*zoom out*).

### 6. Sistem Border Mastery Dinamis (Album Koleksi Wastra)
Tingkat kesulitan yang berhasil dituntaskan pada Batik Cap secara langsung mentransformasikan penampilan visual kartu koleksi wastra di `/collection`:
* 🔒 **Terkunci:** Tampilan siluet monokrom abu-abu redup dengan petunjuk pembukaan.
* 🌿 **Koleksi Terbuka:** Border hijau zamrud (*emerald*) dari kemenangan mode arcade lainnya.
* 🥉 **Cap Dasar:** Border perunggu solid (`#B87333`) untuk keberhasilan tingkat Mudah.
* 🥈 **Cap Terampil:** Border perak metalik halus (`#CBD5E1`) untuk keberhasilan tingkat Menengah.
* 🥇 **Mahakarya Empu:** Border emas ganda (`#D4AF37`) berkilau dengan efek partikel kilau hologram (*holographic gold shimmer*) untuk keberhasilan tingkat Sulit.

### 7. Dukungan Penuh High-Contrast Light Mode & Dark Mode
Seluruh antarmuka—termasuk kanvas mori, palet cap tembaga, papan deduksi Wordle, hingga ensiklopedia—telah diadaptasi dengan palet kontras tinggi:
* **Dark Mode:** Nuansa mewah *Deep Soga Brown* (`#1A1614`) beraksen emas klasik (`#D4AF37`).
* **Light Mode:** Nuansa hangat *Heritage Parchment* (`#FAF8F4`) dengan teks kontras tinggi (`#2D2B38`), bebas dari teks pudar atau sulit dibaca.

### 8. Optimasi Performa & Core Web Vitals
* Semua komponen Next.js `<Image fill>` telah dilengkapi properti `sizes` responsif untuk mengeliminasi pemborosan bandwidth dan meningkatkan skor *Largest Contentful Paint* (LCP).
* Asset gambar web berformat modern **WebP** dengan kompresi optimal.

---

## 📦 Dataset Terstandar 20 Motif Resmi Nusantara

Platform ini berpegang teguh pada kurasi saintifik 20 motif mahakarya dari sentra-sentra bersejarah:

| No | Nama Motif Batik | Sentra Asal | Makna Filosofis & Karakteristik Visual |
| :---: | :--- | :--- | :--- |
| 1 | **Batik Betawi** | DKI Jakarta | Keceriaan dan keterbukaan multikultural masyarakat Betawi dengan ragam hias ikonik Monas dan Ondel-ondel. |
| 2 | **Batik Mega Mendung** | Cirebon | Lambang kesabaran, kesejukan hati, dan ketenangan jiwa melalui bentuk awan bergaya gradasi warna Cina. |
| 3 | **Batik Singa Barong** | Cirebon | Simbol akulturasi empat peradaban dunia: Islam, Hindu, Buddha, dan Tiongkok dalam wujud satwa mitologi. |
| 4 | **Batik Jlamprang** | Pekalongan | Geometris khas Pekalongan berakar dari pola Patola Gujarat India, melambangkan keharmonisan semesta. |
| 5 | **Batik Buketan** | Pekalongan | Pengaruh akulturasi Belanda berbentuk rangkaian bunga mekar semarak dan kepakan sayap kupu-kupu anggun. |
| 6 | **Batik Tujuh Rupa** | Pekalongan | Harmoni flora dan fauna pesisiran yang mencerminkan pluralisme dan keluwesan hubungan antarbangsa. |
| 7 | **Batik Kawung** | D.I. Yogyakarta | Bentuk geometris empat keping kolang-kaling bermakna pengendalian hawa nafsu, kemurnian, dan keadilan. |
| 8 | **Batik Sekar Jagad** | D.I. Yogyakarta | Peta keindahan dunia (*kar jagad*), melambangkan keberagaman suku dan budaya yang berpadu serasi. |
| 9 | **Batik Sido Mulyo** | D.I. Yogyakarta | Doa dan harapan agar pasangan yang mengenakannya mencapai kemuliaan hidup lahir dan batin. |
| 10 | **Batik Srikaton** | D.I. Yogyakarta | Lambang keagungan dan daya tarik kemuliaan budi pekerti yang terpancar laksana istana keraton. |
| 11 | **Batik Bokor Kencono** | D.I. Yogyakarta | Representasi wadah emas penampung berkah, lambang kewibawaan dan kejayaan pemimpin yang amanah. |
| 12 | **Batik Parang** | Surakarta | Gulungan ombak samudra pantang menyerah; lambang kesinambungan perjuangan hidup dan keteguhan moral. |
| 13 | **Batik Truntum** | Surakarta | Bintang bertabur di malam hening karya Ratu Kencana; melambangkan cinta tulus yang bersemi kembali. |
| 14 | **Batik Sido Luhur** | Surakarta | Ajaran keluhuran budi, derajat tinggi, serta harapan agar pemakainya berbudi pekerti luhur bagi sesama. |
| 15 | **Batik Sido Mukti** | Surakarta | Busana sakral pengantin Jawa bermakna harapan hidup makmur, berkecukupan, dan berbahagia selamanya. |
| 16 | **Batik Wahyu Tumurun** | Surakarta | Berkah dan petunjuk luhur dari Yang Maha Kuasa bagi mereka yang berhati bersih dan tawaduk. |
| 17 | **Batik Wirasat** | Surakarta | Pesan dan wejangan leluhur kepada generasi penerus agar teguh mengarungi samudra kehidupan. |
| 18 | **Batik Liong** | Lasem | Perpaduan naga Tionghoa dan ornamen pesisir Jawa, simbol keberanian, perlindungan, dan keselarasan. |
| 19 | **Batik Dayak** | Kalimantan | Guratan sulur tumbuhan hutan tropis dan motif Batang Garing yang melambangkan pohon kehidupan kosmis. |
| 20 | **Batik Pamiluto** | Surakarta | Simbol ikatan tali kasih suci yang mengikat dua insan dalam kesetiaan abadi (*miluto* = memikat hati). |

---

## 🚀 Panduan Menjalankan Proyek

### Opsi A: Menjalankan dengan Docker (Direkomendasikan)

Platform ini mengadopsi **Docker Multi-Stage Build** berbasis fitur `output: "standalone"` Next.js 16 untuk menghasilkan image container yang sangat ramping, cepat, dan terisolasi sempurna.

#### Prasyarat
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Docker Compose v2+)

#### Langkah Eksekusi
Jalankan perintah berikut di direktori root repositori:

```bash
# Membangun dan menyalakan container di background
docker compose up --build -d
```

Buka peramban web dan navigasi ke:
👉 **[http://localhost:3000](http://localhost:3000)**

Untuk menghentikan container:
```bash
docker compose down
```

---

### Opsi B: Menjalankan Lokal (Node.js)

#### Prasyarat
- **Node.js**: v20.x atau v22.x LTS
- **npm**: v10.x ke atas

#### Langkah Instalasi & Pengujian

```bash
# 1. Navigasi ke direktori frontend
cd webdev/frontend

# 2. Siapkan konfigurasi environment
cp .env.example .env.local

# 3. Pasang seluruh dependensi paket
npm install

# 4. Jalankan server pengembang lokal
npm run dev
```

Buka **[http://localhost:3000](http://localhost:3000)** pada peramban web.

#### Verifikasi Kualitas & Kompilasi Kode
```bash
# Validasi tipe TypeScript (Zero Error Guarantee)
npx tsc --noEmit

# Uji build produksi Next.js
npm run build
```

---

## 📂 Struktur Direktori Repositori

```text
.
├── docs/                                 # Dokumentasi Spesifikasi & Panduan Kultural
│   ├── PRD_BATIK_KITA.md                 # Product Requirement Document (PRD) Utama
│   ├── PRD_ARENA_GAMES_REVISI.md         # PRD Teknis Edu-Games Arcade
│   ├── ANTI_AI_COPYWRITING_GUIDE.md      # Panduan Narasi & Tone of Voice Otentik
│   ├── IDE_BATIK.md                      # Riset Kultural & Filosofi Wastra
│   └── LAPORAN_QA_QC.md                  # Dokumentasi Quality Assurance & Audit
├── ml/                                   # Pipeline Machine Learning & Klasifikasi
│   ├── batik_classifier_pipeline.py      # Skrip Training PyTorch EfficientNet
│   ├── batik_classifier_pipeline.ipynb   # Notebook Evaluasi & Analisis Confusion Matrix
│   ├── batik_efficientnet.onnx           # Bobot Model ONNX Biner (15.38 MB)
│   └── class_mapping.json                # Pemetaan Kelas 0-19 ke Metadata Motif
├── webdev/
│   └── frontend/                         # Kode Sumber Aplikasi Web (Next.js 16)
│       ├── public/
│       │   ├── images/                   # Citra 20 Motif Resmi, Varian, & Ornamen
│       │   ├── models/                   # Model ONNX & Class Mapping untuk Web
│       │   └── wasm/                     # Biner WebAssembly onnxruntime-web
│       ├── src/
│       │   ├── app/                      # Next.js App Router (Rute Suite Resmi)
│       │   │   ├── page.tsx              # Beranda Utama & Interactive Hero
│       │   │   ├── scan/                 # Batik Lens (Edge AI Scanner)
│       │   │   ├── chat/                 # Batik Ask (Tanya Sang Empu)
│       │   │   ├── batikpedia/           # Batik Pedia (Ensiklopedia Motif)
│       │   │   ├── collection/           # Album Koleksi Wastra (Mastery Cards)
│       │   │   └── play/                 # Batik Arcade Hub
│       │   │       ├── cap/              # Batik Cap (Simulasi Canting Cap 3 Slot)
│       │   │       ├── guess/            # Batik Guess (Deduksi 4 Jenjang)
│       │   │       ├── map/              # Batik Map (Peta 7 Sentra MapLibre GL)
│       │   │       └── zoom/             # Batik Zoom (Observasi Makro Optik)
│       │   ├── components/               # Komponen Antarmuka Modern Heritage
│       │   │   ├── games/                # Mesin Game: Cap, Guess, Map, Zoom, WinModal
│       │   │   ├── landing/              # Hero, Fitur, Teaser, Navbar, Footer
│       │   │   └── shared/               # XpBar, GameNavbar, ThemeToggle
│       │   ├── data/                     # Dataset 20 Motif, Wilayah, & GeoJSON
│       │   ├── hooks/                    # Hook Kustom: useXp, useGameTheme
│       │   └── lib/                      # onnxClassifier (Queue) & polyominoPartition
│       ├── Dockerfile                    # Container Multi-Stage Production Build
│       └── next.config.ts                # Turbopack & HTTP 308 Auto-Redirects
├── docker-compose.yml                    # Orkestrasi Docker Standalone
├── .env.example                          # Template Variabel Lingkungan
├── .gitignore                            # Aturan Pengabaian Git Terstandar
└── README.md                             # Dokumentasi Utama Proyek
```

---

## 👥 Tim Pengembang (HoloDev — HOLOGY 9.0)

Proyek ini dikembangkan oleh **Tim HoloDev** dalam rangka kompetisi inovasi teknologi **HOLOGY 9.0 (Fakultas Ilmu Komputer, Universitas Brawijaya)**:

* **Rayka** — *Tech Lead, Fullstack Architecture & Machine Learning Engineering*
* **Rayhan** — *UI/UX Design, Asset Digital & Multimedia Engineering*
* **Haekal** — *Business Analyst, Cultural Research & Strategic Proposal*

---

<div align="center">
  <sub>Dibangun dengan kebanggaan untuk pelestarian warisan adiluhung budaya Indonesia</sub><br>
  <sub><strong>HOLO-DEV</strong> • HOLOGY 9.0 • 2026</sub>
</div>
