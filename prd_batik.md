# Product Requirement Document (PRD)
# MembatikKita — Interactive Batik Education & AI Cultural Experience Platform

| Metadata | Detail |
|---|---|
| **Product Name** | **MembatikKita** |
| **Document Version** | v1.0.0 (MVP Release) |
| **Status** | Approved for Development |
| **Target Competition** | HoloDev — HOLOGY 9.0 (Universitas Brawijaya) |
| **Target Subtheme** | **Pendidikan** (Transformasi Pendidikan Digital & Pembelajaran Sepanjang Hayat) |
| **Team Composition** | **Rayka** (Tech Lead & Fullstack), **Rayhan** (UI/UX & Multimedia), **Haekal** (Business & Proposal) |
| **Created Date** | September 2026 |

---

## 1. Executive Summary & Vision

### 1.1 Product Vision
**MembatikKita** adalah platform edukasi budaya digital interaktif yang mentransformasi cara generasi muda mempelajari, mengapresiasi, dan mengeksplorasi seni batik nusantara. Dengan memadukan **Edu-Games Arcade**, **AI Vision Motif Scanner**, **Asisten Budaya Cerdas (Tanya Sang Empu)**, dan **Peta Geografis Interaktif**, platform ini mengubah pembelajaran sejarah dan filosofi batik dari konsumsi teks pasif menjadi petualangan visual yang menyenangkan, terukur, dan bermakna.

### 1.2 Problem Statement
1. **Rendahnya Keterlibatan Generasi Muda (*Low Cultural Engagement*)**: Apresiasi batik saat ini mayoritas hanya sebatas pemakaian pakaian jadi (*passive wearing*) tanpa pemahaman makna simbolis di balik ragam hiasnya.
2. **Media Edukasi Monoton & Ketinggalan Zaman**: Sumber literasi batik daring didominasi oleh teks panjang atau video satu arah tanpa interaksi aktif.
3. **Ketidaktahuan Makna & Etika Pemakaian**: Banyak masyarakat awam tidak memahami filosofi motif, asal daerah, maupun aturan etika pemakaian (seperti motif larangan keraton vs. motif perayaan).
4. **Ketiadaan Alat Bantu Ajar yang Menyenangkan bagi Guru**: Guru seni budaya dan muatan lokal di sekolah kekurangan media digital interaktif untuk memperkenalkan batik kepada siswa.

### 1.3 Value Proposition
- **Play & Learn (Belajar Lewat Bermain)**: Memahami geometri dan isen-isen batik melalui mini-games *Jigsaw Puzzle* dan *Detektif Isen-Isen*.
- **Instant Cultural Discovery**: Memindai pakaian batik pengguna sendiri menggunakan AI untuk langsung mengetahui motif, daerah asal, dan filosofinya.
- **Interactive Storytelling**: Berdialog langsung dengan representasi budayawan batik melalui AI chatbot interaktif (*Tanya Sang Empu*).
- **Gamified Cultural Collection**: Mengumpulkan kartu digital *Batikpedia* berpenampilan mewah yang memotivasi pengguna untuk terus belajar.

---

## 2. Target Audience & User Personas

### Persona 1: "Arka" — Mahasiswa / Gen Z Casual Learner (Primary)
- **Profil**: Umur 19 tahun, melek digital, suka bermain game kasual di web/smartphone, sering memakai kemeja batik saat kuliah/acara formal namun tidak tahu nama dan makna motifnya.
- **Kebutuhan**: Media interaktif yang cepat, visual, seru, dan tidak terasa seperti membaca buku pelajaran tebal.
- **Tujuan**: Mengetahui motif batik yang dimilikinya dan menyelesaikan tantangan game puzzle batik.

### Persona 2: "Ibu Ratna" — Guru Seni Budaya / Muatan Lokal (Secondary)
- **Profil**: Umur 36 tahun, mengajar pelajaran Seni Budaya di SMP/SMA, mencari materi ajar digital untuk demonstrasi di kelas.
- **Kebutuhan**: Media interaktif berbasis web yang bisa diakses siswa di lab komputer atau gawai tanpa perlu instalasi rumit.
- **Tujuan**: Menjelaskan konsep ragam hias, isen-isen, dan perbedaan batik keraton vs. pesisiran secara visual dan interaktif.

### Persona 3: "Dimas" — Penggemar Kriya & Wisatawan Nusantara (Tertiary)
- **Profil**: Umur 27 tahun, suka jalan-jalan dan membeli kain wastra lokal saat berkunjung ke daerah-daerah Indonesia.
- **Kebutuhan**: Direktori peta batik yang menjelaskan kekhasan motif tiap kota serta AI scanner untuk mengidentifikasi kain yang ditemuinya.

---

## 3. Product Scope & MVP Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          MEMBATIKKITA MVP SCOPE                        │
├───────────────────────────────────┬────────────────────────────────────┤
│           IN-SCOPE (MVP)          │         OUT-OF-SCOPE (Post-MVP)    │
├───────────────────────────────────┼────────────────────────────────────┤
│ • Batik Jigsaw Puzzle Engine      │ • E-Commerce Marketplace UMKM      │
│ • Detektif Isen-Isen Spotting     │ • AR Fabric 3D Clothes Projection  │
│ • AI Batik Lens / Image Scanner   │ • Multi-player Realtime Battle     │
│ • Tanya Sang Empu AI Chatbot      │ • Mobile Native App (Flutter/RN)   │
│ • Peta Interaktif 7 Sentra Batik  │ • Cetak Fisik Kain Otomatis        │
│ • Batikpedia Card & XP System     │                                    │
│ • Web Responsive Desktop & Mobile │                                    │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## 4. Detailed Feature Specifications & User Stories

### Epic 1: Interactive Edu-Games Arcade

#### Feature 1.1: Batik Jigsaw & Tangram Puzzle
- **User Story**: *Sebagai pengguna, saya ingin menyusun potongan geometri motif batik agar saya memahami bentuk dasar dan simetri motif tersebut secara visual.*
- **Spesifikasi Alur**:
  1. Pengguna memilih level motif: **Kawung** (Dasar), **Truntum** (Menengah), **Mega Mendung** (Lanjutan), **Parang** (Mahir).
  2. Layar menampilkan area target (*grid board*) dan nampan berisi potongan-potongan motif (*puzzle pieces*).
  3. Pengguna melakukan aksi *drag-and-drop* (atau sentuh pada layar HP). Kepingan puzzle memiliki efek *snap-to-grid* saat diletakkan pada posisi yang benar.
  4. Tersedia tombol **"Petunjuk / Hint"** yang menampilkan siluet transparan pola motif.
  5. Saat seluruh kepingan tersusun sempurna:
     - Muncul animasi *reveal* efek mekar dan partikel emas.
     - Suara instrumen gamelan lembut berbunyi.
     - Menampilkan modal pop-up: **Kartu Filosofi Budaya** + **+100 XP**.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - Puzzle dapat dimainkan mulus dengan mouse (desktop) dan sentuhan jari (mobile).
  - Skor waktu penyelesaian dan jumlah langkah dihitung secara akurat.
  - Kartu motif otomatis terbuka (*unlocked*) di album *Batikpedia*.

#### Feature 1.2: Detektif Isen-Isen (*Spot the Element Challenge*)
- **User Story**: *Sebagai pengguna, saya ingin mencari elemen pengisi (isen-isen) tersembunyi pada sebuah kain batik agar saya bisa mengenali anatomi detail motif batik.*
- **Spesifikasi Alur**:
  1. Pengguna disajikan tampilan kain batik resolusi tinggi dengan narasi misi: *"Temukan 4 Cecek (titik) dan 3 Sawut (garis) pada motif Parang ini!"*.
  2. Pengguna mengklik/mengetuk area kain yang diduga merupakan elemen isen-isen target.
  3. Jika benar: muncul lingkaran hijau beranimasi dan counter misi bertambah ($1/4 \rightarrow 2/4$).
  4. Jika salah: muncul goyangan lembut (*shake animation*) pada pointer dan petunjuk teks: *"Itu ornamen utama, cari elemen titik pengisi!"*.
  5. Selesai misi: mendapatkan skor ketelitian dan lencana *"Detektif Budaya"*.

#### Feature 1.3: Quick Draw & Tracing Canvas
- **User Story**: *Sebagai pengguna, saya ingin mencoba menjiplak atau menggambar bentuk dasar motif batik dengan kuas digital santai.*
- **Spesifikasi Alur**:
  1. Kanvas HTML5 interaktif dengan pilihan kuas malam, penghapus, dan ketebalan goresan.
  2. Terdapat panduan garis bantu (*outline tracing*) yang memudar perlahan.
  3. Tombol **"Cek Kemiripan"** menghitung skor kemiripan goresan pengguna terhadap pola referensi.

---

### Epic 2: AI Intelligence Suite

#### Feature 2.1: AI Batik Lens / Scanner
- **User Story**: *Sebagai pengguna, saya ingin mengunggah foto kain batik saya agar saya dapat mengetahui nama motif, asal daerah, dan filosofinya secara instan.*
- **Spesifikasi Alur**:
  1. Pengguna memilih opsi: **Unggah Foto (PNG/JPG)** atau **Buka Kamera**.
  2. Sistem memproses citra melalui AI Vision Engine (Next.js API Route terenkripsi).
  3. Layar menampilkan hasil analisis instan:
     - **Nama Motif**: (Contoh: *Mega Mendung*)
     - **Confidence Score**: (Contoh: *Akurasi 94%*)
     - **Asal Daerah**: (Contoh: *Cirebon, Jawa Barat*)
     - **Rumpun Gaya**: (Contoh: *Batik Pesisiran*)
     - **Makna Filosofis**: (Contoh: *Melambangkan kesabaran, ketenangan jiwa laksana awan penyejuk di tengah terik matahari*).
     - **Rekomendasi Pemakaian**: (Contoh: *Sangat luwes, pantas untuk busana kerja, santai, maupun pesta*).
  4. Tombol **"Simpan ke Koleksi Saya"** atau **"Tanya Lebih Lanjut ke Empu"**.

#### Feature 2.2: "Tanya Sang Empu" (AI Conversational Agent)
- **User Story**: *Sebagai pengguna, saya ingin bertanya apa saja mengenai sejarah dan etika batik kepada asisten AI yang berwawasan budaya luas.*
- **Spesifikasi Alur**:
  1. Antarmuka chat interaktif bertema pendopo Jawa klasik yang elegan.
  2. Bot memiliki *system prompt persona*: **Empu Budayawan Batik** yang bijak, ramah, tutur kata santun, dan kaya wawasan sejarah nusantara.
  3. Tersedia *Quick Prompt Chips* untuk pemula:
     - *"Apa bedanya batik Solo dan Yogyakarta?"*
     - *"Batik apa yang cocok untuk menghadiri resepsi pernikahan?"*
     - *"Kenapa motif Parang Rusak dulu dilarang untuk rakyat biasa?"*
  4. Respon dihasilkan dalam format teks terstruktur dengan gaya tutur hangat dan informatif.

---

### Epic 3: Cultural Exploration & Geography

#### Feature 3.1: Peta Interaktif Batik Nusantara
- **User Story**: *Sebagai pengguna, saya ingin mengeksplorasi peta Indonesia untuk melihat ragam motif khas dari setiap sentra batik.*
- **Spesifikasi Alur**:
  1. Peta visual interaktif kepulauan Indonesia dengan titik sentra batik utama:
     - **Yogyakarta**: Kawung, Parang, Nitik (Batik Keraton Mataram).
     - **Surakarta (Solo)**: Sidomukti, Truntum, Sawat (Karakteristik Sogan Cokelat).
     - **Pekalongan**: Batik Jlamprang, Buketan (Pesisiran multi-warna flora).
     - **Cirebon**: Mega Mendung, Singa Barong (Pengaruh budaya Tiongkok & Timur Tengah).
     - **Madura**: Batik Gentongan (Warna tegas merah/biru, motif flora-fauna berani).
     - **Lasem**: Batik Tiga Negeri (Perpaduan harmonis Jawa, Tionghoa, dan Belanda).
     - **Papua**: Motif Cenderawasih & Asmat (Corak modern etnik khas timur).
  2. Mengklik titik daerah akan membuka *drawer panel* berisi sejarah daerah, ciri khas warna, galeri motif, dan tautan langsung ke game puzzle motif terkait.

---

### Epic 4: Gamified Collection & Progression (Batikpedia)

#### Feature 4.1: Batikpedia Collection Album
- **User Story**: *Sebagai pengguna, saya ingin melihat koleksi kartu motif batik yang telah saya buka selama bermain.*
- **Spesifikasi Alur**:
  1. Halaman galeri kartu bertema *Heritage Collector's Album*.
  2. Kartu yang belum terbuka berstatus terkunci (*locked with silhouette*).
  3. Kartu yang sudah terbuka memiliki efek visual *hologram shimmer* saat di-hover, menampilkan foto motif, nama, asal daerah, dan audio narasi.
  4. Pengguna dapat membagikan (*share*) kartu pencapaian ke media sosial.

#### Feature 4.2: XP & Tingkatan Gelar Budaya
- Pengguna mengumpulkan *Experience Points (XP)* dari setiap aktivitas:
  - Menyelesaikan Jigsaw Puzzle: **+100 XP**
  - Menyelesaikan Detektif Isen: **+80 XP**
  - Melakukan Scan AI Batik: **+50 XP**
  - Bertanya ke Tanya Sang Empu: **+30 XP**
- **Tingkatan Gelar**:
  1. *Pelajar Budaya* (0 – 250 XP)
  2. *Penjelajah Ragam Hias* (251 – 600 XP)
  3. *Kolektor Batik Nusantara* (601 – 1200 XP)
  4. *Empu Batik Digital* (1201+ XP)

---

## 5. Technical Architecture & Data Schema

### 5.1 Technology Stack

| Layer | Pilihan Teknologi | Alasan Pemilihan |
|---|---|---|
| **Frontend Web** | **Next.js 14/15 (App Router, React 18/19, TypeScript)** | Performa tinggi, SSR/SSG untuk konten budaya yang SEO-friendly, dan arsitektur modular. |
| **Styling & UI** | **Tailwind CSS + Shadcn UI** | Komponen UI modern, clean, mudah dikustomisasi tema *Modern Heritage*. |
| **Motion & Interactivity** | **Framer Motion + HTML5 Canvas API** | Animasi drag-and-drop puzzle mulus 60 FPS dan kanvas menggambar interaktif. |
| **AI LLM Service** | **Google Gemini API (`gemini-1.5-flash` / `gemini-pro`)** | Waktu inferensi sangat cepat (<1s), hemat token, pemahaman konteks budaya Indonesia sangat baik. |
| **AI Vision / Classifier** | **Gemini Multimodal Vision API / Teachable Machine / Custom CNN** | Mendeteksi motif batik dari foto pengguna secara akurat dan mengembalikan penjelasan terstruktur. |
| **Database & Auth** | **Supabase (PostgreSQL 16)** | Backend-as-a-Service cepat dengan PostgreSQL, penyimpanan sesi login, progres XP, dan kartu koleksi. |
| **Deployment** | **Vercel** | Deployment otomatis zero-config dengan edge network global. |

### 5.2 Database Entity Schema (Supabase PostgreSQL)

```sql
-- 1. Users Profile & Progression Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT NOT NULL,
  avatar_url TEXT,
  total_xp INTEGER DEFAULT 0,
  current_rank TEXT DEFAULT 'Pelajar Budaya',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Motifs Master Knowledge Base
CREATE TABLE motifs (
  id TEXT PRIMARY KEY, -- e.g., 'kawung', 'mega_mendung', 'parang'
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Keraton', 'Pesisiran', 'Modern'
  philosophy TEXT NOT NULL,
  usage_context TEXT NOT NULL,
  image_url TEXT NOT NULL,
  audio_url TEXT,
  puzzle_difficulty TEXT NOT NULL -- 'easy', 'medium', 'hard'
);

-- 3. User Unlocked Cards (Collection)
CREATE TABLE user_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  motif_id TEXT REFERENCES motifs(id),
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  best_puzzle_time INTEGER, -- in seconds
  UNIQUE(user_id, motif_id)
);

-- 4. Game Activity Logs (Leaderboards & Analytics)
CREATE TABLE game_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL, -- 'jigsaw', 'spotting', 'draw'
  score INTEGER NOT NULL,
  xp_earned INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

### 5.3 API Endpoints Specification (Next.js App Router)

1. `POST /api/ai/chat`
   - **Payload**: `{ "messages": [{ "role": "user", "content": "..." }] }`
   - **Action**: Memanggil Google Gemini API dengan *system prompt* budayawan batik.
   - **Response**: `{ "reply": "Sugeng rawuh! ..." }`
2. `POST /api/ai/scan`
   - **Payload**: `{ "imageBase64": "data:image/jpeg;base64,..." }`
   - **Action**: Menganalisis citra kain batik dan mencocokkan dengan basis data motif.
   - **Response**: `{ "motifId": "mega_mendung", "name": "Mega Mendung", "confidence": 0.94, "region": "Cirebon", "philosophy": "..." }`
3. `POST /api/game/complete`
   - **Payload**: `{ "gameType": "jigsaw", "motifId": "kawung", "timeSeconds": 45 }`
   - **Action**: Memperbarui total XP pengguna dan membuka kartu *Batikpedia*.
   - **Response**: `{ "success": true, "xpEarned": 100, "newRank": "Penjelajah Ragam Hias", "cardUnlocked": true }`

---

## 6. UI/UX Design System Guidelines

### 6.1 Color Palette (*Modern Heritage Theme*)
- **Primary (Royal Sogan Brown)**: `#7A3E1D` / `#4A2511` (Nuansa warna pewarna alam soga klasik keraton).
- **Accent (Heritage Gold / Kuningan)**: `#D4AF37` / `#F59E0B` (Aksen mewah untuk kartu koleksi dan lencana XP).
- **Secondary (Indigofera Blue)**: `#1E3A8A` / `#2563EB` (Nuansa biru wedelan pesisiran Cirebon/Pekalongan).
- **Background (Mori Fabric Cream)**: `#FDFBF7` / Dark Mode: `#18130E` (Tekstur lembut kain mori putih gading).
- **Status Colors**: Success `#10B981`, Warning `#F59E0B`, Danger `#EF4444`.

### 6.2 Typography
- **Headings & Display**: `Plus Jakarta Sans` / `Outfit` (Bold, modern, elegan, mudah dibaca).
- **Body & Story Text**: `Inter` / `Source Serif 4` (Memberikan kesan klasik budaya saat membaca filosofi dan narasi empu).

---

## 7. Quality Assurance, Security & Ethical Guidelines

1. **Non-Copyright Infringement & Asset Integrity**:
   - Seluruh ilustrasi dan potongan geometri motif dibuat secara orisinal oleh tim / bersumber dari domain publik kebudayaan nasional yang bebas lisensi komersial.
2. **Keamanan Kunci API**:
   - Semua panggilan ke Gemini API dan Supabase Service Key berada di sisi server (*Server Actions / API Route*), tidak pernah terekspos di browser client.
3. **Etika Representasi Budaya**:
   - Konten sejarah dan filosofi dikurasi dari sumber terpercaya (BBSPJIKB & literatur budayawan resmi) untuk menghindari disinformasi makna motif sakral.

---

## 8. Hackathon Execution Plan (Sprint Timeline)

| Hari | Target Pekerjaan | Penanggung Jawab |
|:---:|---|:---:|
| **Hari 1–2** | Inisialisasi Next.js, Setup Tailwind & Shadcn UI, Implementasi Engine Jigsaw Drag-and-Drop + Game Detektif Isen. | **Rayka & Rayhan** |
| **Hari 3–4** | Integrasi API Google Gemini ("Tanya Sang Empu") & Modul Pemindai AI Batik Lens, kurasi 7 motif utama. | **Rayka & Haekal** |
| **Hari 5–6** | Pembuatan Peta Interaktif Nusantara, Halaman Batikpedia Card Album, dan integrasi database Supabase XP/Leaderboard. | **Rayka & Rayhan** |
| **Hari 7** | Finishing UI/UX, uji coba responsivitas perangkat, QA testing bug-free, deployment ke Vercel. | **Seluruh Tim** |
| **Hari 8** | Finalisasi naskah proposal PDF 30 halaman (Haekal) & pembuatan slide Pitch Deck (Rayhan/Haekal). | **Haekal & Rayhan** |
| **Hari 9** | Perekaman dan editing video demonstrasi fitur 10 menit, pengecekan akhir berkas, final submission HOLOGY 9.0. | **Seluruh Tim** |

---

## 9. Penutup

PRD ini menjadi rujukan tunggal bagi seluruh anggota tim dalam merancang antarmuka, menulis kode program, menyusun proposal, serta memproduksi materi video demo untuk cabang lomba **HoloDev HOLOGY 9.0**.
