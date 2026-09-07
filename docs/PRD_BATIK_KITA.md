# 📄 Product Requirements Document (PRD)
## Batik Kita — Platform Edukasi Warisan Batik Nusantara
**Versi:** 2.0 Final  
**Tanggal:** September 2026  
**Kompetisi:** HOLOGY 9.0 — HOLODev Web Development  
**Tim:** Rkaaaa404  

---

## 1. Ringkasan Eksekutif

**Batik Kita** adalah platform edukasi interaktif berbasis web yang menggabungkan teknologi Artificial Intelligence (AI), gamifikasi, dan desain *heritage modern* untuk mendekatkan generasi muda Indonesia dengan warisan budaya batik nusantara. Platform ini hadir sebagai respons terhadap semakin memudarnya literasi budaya tekstil di kalangan digital native.

Dengan tagline **"Warisan Luhur dalam Sentuhan Digital"**, Batik Kita mengubah pengalaman belajar batik yang konvensional menjadi perjalanan budaya yang menarik, interaktif, dan terukur melalui empat mini-game, asisten AI berbasis LLM, klasifikasi motif berbasis computer vision, dan ensiklopedia batik yang komprehensif.

---

## 2. Latar Belakang & Permasalahan

| Masalah | Dampak |
|---|---|
| Rendahnya literasi batik di kalangan Generasi Z | Keterancaman keberlangsungan warisan budaya |
| Konten edukasi batik yang monoton & tidak interaktif | Rendahnya engagement dan retensi pengguna |
| Tidak adanya medium digital terintegrasi yang menggabungkan edukasi + hiburan | Kehilangan momentum digital untuk pelestarian budaya |
| Akses pengetahuan motif yang tersebar dan tidak terstruktur | Sulit mencari referensi filosofi dan asal-usul motif secara cepat |

---

## 3. Tujuan Produk

1. **Meningkatkan literasi budaya batik** melalui pendekatan *edutainment* berbasis game
2. **Mendemokan penerapan AI** (LLM + Computer Vision) dalam konteks pelestarian budaya
3. **Membangun arsip digital** motif batik nusantara yang terstruktur dan dapat diakses secara bebas
4. **Menciptakan engagement jangka panjang** melalui sistem gamifikasi XP dan peringkat budaya

---

## 4. Target Pengguna

| Segmen | Profil |
|---|---|
| **Primer** | Pelajar & mahasiswa usia 15–25 tahun yang aktif di platform digital |
| **Sekunder** | Guru dan pendidik yang membutuhkan media ajar interaktif |
| **Tersier** | Pecinta budaya, kolektor batik, dan komunitas pelestari budaya nusantara |

---

## 5. Arsitektur Teknis

### 5.1 Technology Stack

| Layer | Teknologi |
|---|---|
| **Framework** | Next.js 16.3.4 (App Router) |
| **UI Runtime** | React 19.2 |
| **Styling** | Tailwind CSS v4 |
| **Animasi** | Motion (Framer Motion) v13 |
| **AI / LLM** | Google Gemini 2.5 Flash API |
| **Computer Vision** | ONNX Runtime Web v1.29 (EfficientNet B0 — *on-device inference*) |
| **Peta Interaktif** | MapLibre GL v6.7 + react-map-gl |
| **3D Graphics** | Three.js + React Three Fiber + Drei |
| **Fuzzy Search** | Fuse.js v7.5 |
| **Konfeti Animasi** | canvas-confetti |
| **Ikon** | Lucide React |

### 5.2 Pola Arsitektur

- **Next.js App Router** dengan SSR selektif; semua halaman game menggunakan `"use client"` untuk interaktivitas penuh
- **ONNX Model** di-load sekali sebagai singleton session dan dieksekusi melalui serialized queue untuk menghindari *WebAssembly concurrency errors*
- **Gemini API** dipanggil melalui Next.js Route Handler (`/api/chat`) — kunci API tidak pernah terekspos ke client
- **State gamifikasi** (XP, rank, koleksi kartu) disimpan di `localStorage` dan dikelola via custom hook `useXp`

---

## 6. Desain Sistem

### 6.1 Tema Visual: Modern Heritage

Platform menggunakan estetika **"Modern Heritage"** — perpaduan antara:
- **Palet warna batik klasik:** Soga coklat (`#713f2c`), indigo (`#2d2b38`), emas (`#D4AF37`), perunggu (`#B87333`)
- **Tipografi:** Philosopher (serif heritage), Plus Jakarta Sans (display modern), sistem *font-narrative* untuk paragraf
- **Latar halaman:** Krem hangat `#faf8f4` (light mode) dan `#1A1614` (dark hero sections)
- **Micro-animations:** Framer Motion untuk transisi halaman, hover effect, dan particle system emas di hero

### 6.2 Struktur Navigasi Global

```
Navbar Transparan
├── Beranda        → /
├── Batik Arcade   → /play
├── Batik Lens     → /scan
├── Batik Ask      → /chat
├── Batik Pedia    → /batikpedia
└── Koleksi        → /collection
```

---

## 7. Fitur & Spesifikasi Detail

### 7.1 Halaman Beranda (`/`)

**Tujuan:** Titik masuk dan pengenalan platform  
**Komponen utama:**

| Seksi | Deskripsi |
|---|---|
| **Hero Section** | Full-bleed background foto pengrajin batik, copywriting editorial "Batik Kita: / Warisan Luhur / dalam Sentuhan Digital", 3D golden particle animation (Three.js/Fiber), CTA "Mulai Jelajahi" |
| **Feature Grid** | Tiga pilar fitur: Edu-Games Arcade, AI Batik Lens, Batik Ask |
| **Arcade Preview** | Preview interaktif 4 game dengan tile card motif dan quick stats |
| **Interactive Preview** | Demonstrasi Batik Ask chat + Batik Lens scanner secara inline |
| **BatikPedia Teaser** | Kartu motif pilihan sebagai teaser ensiklopedia |
| **Footer** | Link navigasi, kredit, dan info platform |

---

### 7.2 Batik Arcade (`/play`)

**Tujuan:** Hub navigasi ke empat mini-game edukasi budaya  
**Komponen utama:**
- Hero section dengan info XP live (Paspor Budaya Digital card)
- Grid 4 game card (Batik Cap, Batik Guess, Batik Map, Batik Zoom)
- Banner promo Album Koleksi dengan status koleksi real-time
- Tangga Peringkat Budaya (4 tingkat)

---

### 7.3 Game 1: Batik Cap (`/play/cap`)

**Tagline:** Presisi Canting Cap Tembaga  
**Deskripsi:** Permainan puzzle *polyomino* di mana pengguna menyusun kepingan cap tembaga ke kanvas kain mori.

**Spesifikasi:**

| Parameter | Detail |
|---|---|
| **Dataset** | 20 motif batik resmi (BATIK_DATASET_20) |
| **Tingkat Kesulitan** | Mudah / Menengah / Sulit (pilihan pengguna) |
| **Algoritma** | Polyomino partition acak (`src/lib/polyominoPartition.ts`) |
| **Reward XP** | Mudah: +100 XP, Menengah: +150 XP, Sulit: +200 XP |
| **Unlock Koleksi** | Ya — berdasarkan motif yang diselesaikan & tingkat kesulitan |
| **Mekanisme** | Drag & snap potongan ke slot kanvas; timer berjalan sejak motif dipilih |
| **Feedback** | WinModal dengan konfeti + level-up modal jika XP threshold tercapai |

---

### 7.4 Game 2: Batik Guess (`/play/guess`)

**Tagline:** Deduksi Budaya Berjenjang  
**Deskripsi:** Permainan tebak motif melalui sistem petunjuk progresif berbasis 4 segel rahasia.

**Spesifikasi:**

| Parameter | Detail |
|---|---|
| **Dataset** | 20 motif (BATIK_DATASET_20 `.hints[4]` field) |
| **Sistem Petunjuk** | 4 segel bertahap: Sentra Asal → Rumpun Filosofis → Ornamen Visual → Makna Simbolik |
| **Poin Sistem** | Segel 1 = 100 XP, turun 20 XP setiap segel dibuka (min. 25 XP) |
| **Mekanisme** | Pilihan ganda + input teks bebas dengan fuzzy matching |
| **Sound Effects** | Web Audio API synthesizer (chime/error/level-up) — tanpa aset audio eksternal |
| **Streak Bonus** | Jawaban benar berturut meningkatkan multiplier visual (Flame indicator) |

---

### 7.5 Game 3: Batik Map (`/play/map`)

**Tagline:** Geografi Budaya Nusantara  
**Deskripsi:** Permainan drag-and-drop motif batik ke pin sentra asal di peta interaktif Nusantara.

**Spesifikasi:**

| Parameter | Detail |
|---|---|
| **Peta** | MapLibre GL 6.7 (dinamis, SSR disabled) berbasis GeoJSON `regionsGeo.json` |
| **Sentra** | 7 pin lokasi resmi batik nusantara |
| **Mekanisme** | Kartu motif diseret ke wilayah peta; sistem validasi koordinat |
| **Timer** | 90 detik countdown |
| **Reward XP** | +40 – 50 XP per motif berhasil ditempatkan |
| **Unlock Koleksi** | Ya |

---

### 7.6 Game 4: Batik Zoom (`/play/zoom`)

**Tagline:** Observasi Visual Makro  
**Deskripsi:** Permainan tebak motif dari gambar yang di-zoom dari 800% → 100% secara progresif.

**Spesifikasi:**

| Parameter | Detail |
|---|---|
| **Dataset** | `tikaCatalog.ts` (TIKA_CATALOG — set motif berbeda, mencakup deskripsi & `focus_point`) |
| **Mode** | Tantangan Harian (seeded by date) + Mode Bebas (random) |
| **Zoom Progresif** | Mulai dari 800% detail ekstrim, setiap *Skip* zoom out bertahap ke 100% |
| **Mekanisme Jawab** | Input teks bebas dengan Fuse.js fuzzy matching + normalisasi alias nama |
| **Reward XP** | Maks. +100 XP, berkurang proporsional dengan jumlah *Skip* |
| **Sound Effects** | Web Audio API synthesizer |

---

### 7.7 Batik Lens (`/scan`)

**Tagline:** Edge AI Classifier — On-Device Inference  
**Deskripsi:** Fitur klasifikasi motif batik menggunakan computer vision yang berjalan sepenuhnya di sisi klien (tanpa mengirim data ke server eksternal).

**Spesifikasi:**

| Parameter | Detail |
|---|---|
| **Model AI** | EfficientNet B0 — `batik_efficientnet.onnx` |
| **Runtime** | ONNX Runtime Web 1.29 (WebAssembly, single-threaded) |
| **Input** | Upload foto ATAU akses kamera perangkat (webcam/smartphone) |
| **Preprocessing** | Resize + normalisasi tensor — seluruhnya di client-side canvas |
| **Output** | Top-1 & Top-3 prediksi dengan confidence score (%), inferensi time (ms) |
| **Mapping** | `class_mapping.json` → dikroscek ke `BATIK_DATASET_20` untuk data lengkap |
| **Concurrency** | Serialized run queue untuk menghindari WebAssembly session conflict |
| **Privasi** | **Zero upload** — foto tidak meninggalkan perangkat pengguna |

---

### 7.8 Batik Ask (`/chat`)

**Tagline:** Tanya Sang Empu  
**Deskripsi:** Asisten AI berkarakter "Sang Empu" — begawan batik nusantara yang menjawab pertanyaan seputar batik dengan bahasa Indonesia yang luhur dan penuh kearifan.

**Spesifikasi:**

| Parameter | Detail |
|---|---|
| **LLM** | Google Gemini 2.5 Flash via `/api/chat` Route Handler |
| **Persona** | "Sang Empu" — budayawan keraton Jawa, arif, berwibawa, santun |
| **Knowledge Base** | System instruction + grounding 20 motif dari `BATIK_DATASET_20` |
| **Guardrail** | Hard-coded boundary — menolak pertanyaan di luar topik wastra/budaya Indonesia |
| **Temperature** | 0.7 — kreatif tapi terkontrol |
| **Max Tokens** | 1000 token per respons |
| **Riwayat Chat** | Multi-turn conversation dengan normalisasi role Gemini (user/model) |

---

### 7.9 Batik Pedia (`/batikpedia`)

**Tagline:** Peta Sentra & Filosofi Batik Nusantara  
**Deskripsi:** Ensiklopedia motif batik nusantara yang komprehensif dan dapat dicari.

**Spesifikasi:**

| Parameter | Detail |
|---|---|
| **Dataset** | 20 motif (`BATIK_DATASET_20`) |
| **Atribut per Motif** | Nama, asal sentra, provinsi, pulau, kategori, filosofi, penggunaan pakem, ciri visual, varian |
| **Fitur Pencarian** | Filter berdasarkan kategori & pencarian nama |
| **Tampilan** | Card grid motif dengan gambar `.webp` versi 2 |
| **Kategori** | Batik Keraton, Batik Pesisiran, Batik Larangan, Batik Nusantara |

---

### 7.10 Album Koleksi (`/collection`)

**Tagline:** Album Koleksi Wastra Nusantara  
**Deskripsi:** Halaman galeri kartu koleksi motif yang terbuka seiring kemajuan pengguna dalam game.

**Spesifikasi:**

| Parameter | Detail |
|---|---|
| **Dataset** | 20 motif — kartu terbuka/terkunci berdasarkan `useXp` state |
| **Mastery Tiers** | Unlocked → Mudah (Perunggu) → Menengah (Perak) → Sulit (Emas) |
| **Default Unlock** | 6 kartu starter otomatis terbuka tanpa perlu bermain |
| **Bingkai Dinamis** | Bingkai kartu berubah warna & efek sesuai tier mastery |
| **Progress Bar** | Visualisasi persentase koleksi terbuka secara real-time |
| **Detail Modal** | Klik kartu terbuka → popup detail motif (filosofi, asal, varian, dll.) |

---

## 8. Sistem Gamifikasi

### 8.1 Struktur XP

| Aksi | XP |
|---|---|
| Batik Cap — Mudah | +100 XP |
| Batik Cap — Menengah | +150 XP |
| Batik Cap — Sulit | +200 XP |
| Batik Guess — Benar di Segel 1 | +100 XP |
| Batik Guess — Benar di Segel 4 | +25 XP |
| Batik Map — Per Motif Benar | +40–50 XP |
| Batik Zoom — Tanpa Skip | +100 XP |

### 8.2 Tangga Peringkat Budaya

| Peringkat | Range XP | Deskripsi |
|---|---|---|
| 🌿 Pelajar Budaya | 0 – 250 XP | Mengenal dasar ornamen geometris dan keindahan visual wastra |
| 🧭 Penjelajah Ragam Hias | 251 – 600 XP | Memahami ragam motif pesisiran, keraton, dan filosofi maknanya |
| 📖 Kolektor Batik Nusantara | 601 – 1.200 XP | Menguasai peta sentra budaya, observasi mikro, dan teknik cap |
| 👑 Empu Batik Digital | 1.201+ XP | Pakar sejati pelestari warisan adiluhung batik Indonesia |

### 8.3 Mekanisme Level-Up

- Deteksi perubahan rank terjadi di `useXp.addXp()` secara real-time
- Menampilkan `LevelUpModal` dengan animasi konfeti + pesan apresiasi budaya
- State tersimpan persisten di `localStorage` (key: `batikkita_xp`, `batik_mastery_cards`, `batik_unlocked_cards`)

---

## 9. Dataset Konten

### 9.1 Daftar 20 Motif Resmi Batik Kita

| # | Motif | Kategori | Asal |
|---|---|---|---|
| 1 | Batik Betawi | Pesisiran | DKI Jakarta |
| 2 | Batik Bokor Kencono | Keraton | D.I. Yogyakarta |
| 3 | Batik Buketan | Pesisiran | Pekalongan, Jawa Tengah |
| 4 | Batik Dayak | Nusantara | Kalimantan Tengah & Timur |
| 5 | Batik Jlamprang | Pesisiran | Pekalongan, Jawa Tengah |
| 6 | Batik Kawung | Keraton | D.I. Yogyakarta |
| 7 | Batik Liong | Pesisiran | Lasem, Jawa Tengah |
| 8 | Batik Mega Mendung | Pesisiran | Cirebon, Jawa Barat |
| 9 | Batik Parang | Larangan | D.I. Yogyakarta |
| 10 | Batik Sekar Jagad | Keraton | D.I. Yogyakarta |
| 11 | Batik Sido Luhur | Keraton | Surakarta, Jawa Tengah |
| 12 | Batik Sido Mukti | Keraton | Surakarta, Jawa Tengah |
| 13 | Batik Sido Mulyo | Keraton | D.I. Yogyakarta |
| 14 | Batik Singa Barong | Pesisiran | Cirebon, Jawa Barat |
| 15 | Batik Srikaton | Keraton | D.I. Yogyakarta |
| 16 | Batik Tribusono | Keraton | Surakarta, Jawa Tengah |
| 17 | Batik Truntum | Keraton | Surakarta, Jawa Tengah |
| 18 | Batik Tujuh Rupa | Pesisiran | Pekalongan, Jawa Tengah |
| 19 | Batik Wahyu Tumurun | Keraton | Surakarta, Jawa Tengah |
| 20 | Batik Wirasat | Keraton | Surakarta, Jawa Tengah |

### 9.2 Struktur Data per Motif (`BatikMotif`)

```typescript
interface BatikMotif {
  id: string;              // unique identifier
  name: string;            // Nama pendek
  fullName: string;        // "Batik Kawung"
  region: string;          // Sentra asal
  province: string;
  island: string;
  category: "Batik Keraton" | "Batik Pesisiran" | "Batik Larangan" | "Batik Nusantara";
  philosophy: string;      // Makna filosofis panjang
  usage: string;           // Konteks pemakaian & pakem
  visualTraits: string;    // Ciri visual & ornamen
  image: string;           // Primary .webp image path
  variants: BatikVariant[]; // 2+ varian per motif
  hints: [string, string, string, string]; // 4 petunjuk progresif (Batik Guess)
}
```

---

## 10. Komponen Shared & Reusable

| Komponen | Lokasi | Fungsi |
|---|---|---|
| `Navbar` | `components/landing/Navbar.tsx` | Navigasi global transparan / solid |
| `Footer` | `components/landing/Footer.tsx` | Footer landing page |
| `GameNavbar` | `components/shared/GameNavbar.tsx` | Navbar khusus halaman game |
| `XpBar` | `components/shared/XpBar.tsx` | Progress bar XP animatif |
| `LevelUpModal` | `components/shared/LevelUpModal.tsx` | Popup level up dengan konfeti |
| `WinModal` | `components/games/WinModal.tsx` | Popup kemenangan game |
| `CapStampingBoard` | `components/games/CapStampingBoard.tsx` | Engine puzzle polyomino cap |
| `HeroParticles` | `components/landing/HeroParticles.tsx` | 3D golden particles (Three.js) |

---

## 11. Peta Halaman & Rute

```
/                   → Landing Page (Beranda)
/play               → Batik Arcade Hub
/play/cap           → Game: Batik Cap (Polyomino Puzzle)
/play/guess         → Game: Batik Guess (Progressive Hint Quiz)
/play/map           → Game: Batik Map (Interactive Map Drag-and-Drop)
/play/zoom          → Game: Batik Zoom (Macro Zoom Challenge)
/scan               → Batik Lens (Edge AI Classifier)
/chat               → Batik Ask (AI Chatbot "Sang Empu")
/batikpedia         → Batik Pedia (Encyclopedia)
/collection         → Album Koleksi (Achievement Gallery)
/api/chat           → Route Handler: Gemini API Proxy
```

---

## 12. Keunggulan Kompetitif & Nilai Jual

### 12.1 Aspek Teknologi
| Keunggulan | Detail |
|---|---|
| **On-Device AI** | Klasifikasi motif berjalan di browser tanpa server inference — zero data leak |
| **Generative AI** | Persona "Sang Empu" berbasis Gemini 2.5 Flash dengan hard-boundary guardrail |
| **Peta Interaktif** | MapLibre GL sebagai alternatif open-source Mapbox — lebih ringan & bebas biaya |
| **Fuzzy Search** | Fuse.js memungkinkan pengguna mengetik nama motif dengan typo tetap terdeteksi |
| **3D Particles** | Hero section bertenaga Three.js — visual premium tanpa library berat tambahan |

### 12.2 Aspek Budaya & Edukasi
| Keunggulan | Detail |
|---|---|
| **Dataset Autentik** | 20 motif dengan deskripsi filosofi, pakem pemakaian, dan ciri visual yang akurat |
| **Gamifikasi Bermakna** | XP dan rank menggunakan terminologi budaya Jawa (Empu, Pelajar Budaya, dst.) |
| **Aksesibilitas** | Berbasis web — tidak perlu install aplikasi, dapat diakses dari PC/HP |
| **Zero Knowledge Barrier** | Bisa langsung bermain tanpa mendaftar akun |

---

## 13. Batasan & Lingkup yang Tidak Dicakup (Out of Scope)

| Item | Alasan |
|---|---|
| Autentikasi pengguna (login/register) | Di luar scope kompetisi; localStorage cukup untuk demo |
| Multiplayer / leaderboard online | Memerlukan backend tambahan |
| Konten di luar 20 motif resmi | Membutuhkan validasi konten budaya lebih lanjut |
| PWA / offline mode | Potensial untuk versi lanjutan |
| Konten audio narasi (suara pengrajin) | Keterbatasan aset & bandwidth |

---

## 14. Metrik Keberhasilan

| Metrik | Target |
|---|---|
| Jumlah game yang dapat dimainkan | 4 game penuh dan dapat diselesaikan |
| Klasifikasi motif (Batik Lens) | Top-1 accuracy ≥ 70% pada 20 kelas |
| Chatbot Batik Ask | Merespons setiap pertanyaan dalam ≤ 5 detik |
| Performa halaman | Lighthouse Performance Score ≥ 85 |
| Kelengkapan konten | 20 motif × data lengkap (filosofi, visual, hints, varian) |
| Responsivitas | Berfungsi di viewport ≥ 375px (mobile) hingga desktop 1920px |

---

## 15. Roadmap & Status Implementasi

| Fitur | Status |
|---|---|
| Landing Page (Beranda) | ✅ Selesai |
| Batik Arcade Hub | ✅ Selesai |
| Batik Cap (Polyomino) | ✅ Selesai |
| Batik Guess (Progressive Hints) | ✅ Selesai |
| Batik Map (MapLibre) | ✅ Selesai |
| Batik Zoom (Macro Challenge) | ✅ Selesai |
| Batik Lens (ONNX Classifier) | ✅ Selesai |
| Batik Ask (Gemini Chatbot) | ✅ Selesai |
| Batik Pedia (Encyclopedia) | ✅ Selesai |
| Album Koleksi (Achievement) | ✅ Selesai |
| Sistem Gamifikasi XP + Rank | ✅ Selesai |
| Desain Modern Heritage (konsisten) | ✅ Selesai |
| Dataset 20 Motif Resmi | ✅ Selesai |
| Aset Gambar (.webp v2) | ✅ Selesai |

---

## 16. Referensi Teknis

- [Next.js App Router Docs](https://nextjs.org/docs)
- [ONNX Runtime Web](https://onnxruntime.ai/docs/get-started/with-javascript/web.html)
- [Google Gemini API — Generative Language](https://ai.google.dev/gemini-api/docs)
- [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/)
- UNESCO. (2009). *Batik inscribed on UNESCO Intangible Cultural Heritage of Humanity.*

---

*Dokumen ini merupakan PRD resmi dan referensi teknis untuk Batik Kita v2.0 dalam rangka kompetisi HOLOGY 9.0 — HOLODev.*
