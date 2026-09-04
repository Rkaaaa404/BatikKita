# PRD Teknis — Arena Games MembatikKita (Revisi)
**Menggantikan: Batik Jigsaw Puzzle & Detektif Isen-Isen**

> Dokumen ini adalah revisi khusus bagian Arena Games dari PRD utama MembatikKita. Dua game sebelumnya (Jigsaw Puzzle, Detektif Isen-Isen) digantikan tiga game baru di bawah. **Quick Draw & Tracing Canvas tetap dipertahankan** dan tidak berubah dari PRD sebelumnya.

---

## 1. Ringkasan Perubahan

| Sebelumnya | Status | Digantikan Oleh |
|---|---|---|
| Batik Jigsaw & Tangram Puzzle | ❌ Dihapus | Tebak Motif Berjenjang |
| Detektif Isen-Isen | ❌ Dihapus | Sortir Motif ke Peta |
| Quick Draw & Tracing Canvas | ✅ Tetap | — |
| — | ➕ Baru (Stretch) | Simulasi Membatik Canting (Wax-Resist) |

**Susunan Arena Games baru:**
1. Tebak Motif Berjenjang *(MVP — Wajib)*
2. Sortir Motif ke Peta *(MVP — Wajib)*
3. Quick Draw & Tracing Canvas *(MVP — Wajib, tidak berubah)*
4. Simulasi Membatik Canting *(Stretch Goal — jika waktu memungkinkan)*

**Alasan penggantian:** Tebak Motif Berjenjang dan Sortir Motif ke Peta lebih murah dibangun secara teknis (tidak perlu engine drag-and-drop kompleks seperti Jigsaw, atau deteksi koordinat presisi seperti Isen-Isen), sekaligus mengaitkan fitur Kuis dan Peta Interaktif yang sebelumnya berdiri sendiri-sendiri ke dalam sistem Arena Games — sehingga XP dan progres pengguna lebih terpusat.

---

## 2. Game 1 — Tebak Motif Berjenjang

### 2.1 Konsep
Kuis tebak-motif dengan hint progresif (mirip mekanik Wordle/Akinator versi budaya). Sistem memberi petunjuk bertahap dari yang paling samar ke paling spesifik; skor lebih tinggi jika pengguna menebak benar dengan hint lebih sedikit.

### 2.2 Alur Permainan (Game Loop)
1. Sistem memilih satu motif secara acak dari tabel `motifs` (sesuai level kesulitan yang dipilih).
2. Hint #1 ditampilkan otomatis (paling samar, mis. kategori umum: "Motif ini terinspirasi dari alam").
3. Pengguna dapat langsung menjawab lewat search/autocomplete nama motif, ATAU menekan tombol "Petunjuk Berikutnya" untuk membuka hint lebih spesifik (dengan konsekuensi pengurangan potensi skor).
4. Maksimal 4 hint per ronde. Setelah hint ke-4, jika belum terjawab, sistem mengungkap jawaban otomatis (ronde dianggap tidak sempurna, XP minimal tetap diberikan untuk partisipasi).
5. Setelah jawaban benar/terungkap: modal hasil menampilkan info lengkap motif (sama seperti hasil AI Lens) + jumlah XP yang diperoleh.
6. Tombol "Motif Berikutnya" untuk lanjut ke ronde baru, atau "Selesai" untuk kembali ke Arena.

### 2.3 Struktur Hint (per motif, disiapkan di data)
| Level Hint | Isi | Contoh (Motif Parang) |
|---|---|---|
| Hint 1 (paling samar) | Inspirasi/filosofi umum | "Motif ini terinspirasi oleh kekuatan alam yang tak pernah berhenti." |
| Hint 2 | Kategori/rumpun gaya | "Motif ini termasuk rumpun batik Keraton/Pedalaman." |
| Hint 3 | Asal daerah | "Motif ini erat kaitannya dengan wilayah Yogyakarta dan Surakarta." |
| Hint 4 (paling spesifik) | Ciri visual/bentuk khas | "Motif ini berbentuk garis diagonal berulang menyerupai huruf S." |

### 2.4 UI & Komponen
- **Header:** nama game, level kesulitan (Dasar/Menengah/Lanjutan), progress ronde (mis. "Ronde 2 dari 5").
- **Kartu Hint:** area tengah menampilkan hint aktif dengan animasi fade-in setiap hint baru terbuka; hint sebelumnya tetap terlihat (list bertumpuk, hint terbaru di-highlight).
- **Search/autocomplete input:** pengguna mengetik nama motif, sistem menampilkan saran dari daftar motif yang tersedia (mencegah typo menggagalkan jawaban benar).
- **Tombol "Petunjuk Berikutnya"** dengan indikator pengurangan skor (mis. "-20 poin potensi").
- **Progress bar skor potensial** yang berkurang setiap hint dibuka.
- **State:** idle (menunggu input), hint-revealed (animasi), correct (confetti/efek mekar + modal sukses), incorrect-attempt (shake input + tetap di ronde yang sama, tidak mengurangi nyawa — cukup mendorong buka hint berikutnya), round-complete (modal info motif).

### 2.5 Sistem Skor & XP
- Jawaban benar di Hint 1: **100 XP**
- Jawaban benar di Hint 2: **75 XP**
- Jawaban benar di Hint 3: **50 XP**
- Jawaban benar di Hint 4 / terungkap otomatis: **25 XP** (tetap membuka kartu Batikpedia untuk motif tsb).

### 2.6 Kebutuhan Data
- Field tambahan pada tabel `motifs`: `hint_1`, `hint_2`, `hint_3`, `hint_4` (teks pendek per motif).
- Tidak perlu tabel baru — cukup ekstensi tabel `motifs` yang sudah ada di PRD utama.

---

## 3. Game 2 — Sortir Motif ke Peta

### 3.1 Konsep
Tantangan cepat (timed-challenge) yang menghubungkan gameplay dengan Peta Interaktif Nusantara: motif ditampilkan satu per satu, pengguna men-drag kartu motif ke pin daerah asal yang benar di peta sebelum waktu habis.

### 3.2 Alur Permainan (Game Loop)
1. Sistem menampilkan peta Indonesia stilasi dengan pin-pin daerah sentra batik (sama seperti di halaman Peta Interaktif) sebagai target drop zone.
2. Satu kartu motif muncul di area "tray" (bawah/samping layar) lengkap dengan thumbnail gambar motif (tanpa nama daerah).
3. Pengguna men-drag kartu ke pin daerah yang menurutnya benar.
4. Timer global berjalan mundur (mis. 90 detik per sesi) untuk keseluruhan ronde berisi 6–8 motif.
5. Drop benar → pin berkedip hijau + kartu motif "menempel" di pin sebagai penanda + skor bertambah. Drop salah → kartu memantul kembali ke tray (bounce-back animation) + indikator merah singkat di pin yang salah, tanpa mengurangi waktu (agar tidak terlalu punitif).
6. Sesi berakhir saat semua kartu terjawab benar ATAU waktu habis.
7. Modal hasil akhir: jumlah motif benar dari total, XP diperoleh, opsi "Main Lagi" (set motif berbeda) atau "Selesai".

### 3.3 UI & Komponen
- **Peta:** reuse komponen peta dari halaman Peta Interaktif Nusantara (styling sama, tapi dalam mode "game" — pin tidak bisa diklik untuk info, hanya jadi target drop).
- **Timer bar** di bagian atas, berubah warna (hijau → kuning → merah) mendekati waktu habis.
- **Tray kartu motif:** menampilkan 1 kartu aktif (drag source) + preview antrian kartu berikutnya (kecil, di belakang).
- **Skor live counter** di pojok (mis. "5/8 benar").
- **State:** idle, dragging (kartu mengikuti kursor/jari dengan sedikit rotasi untuk kesan fisik), drop-correct (animasi + suara positif), drop-incorrect (bounce + shake), timeout (modal "Waktu Habis"), session-complete (modal hasil).
- **Mobile:** drag diganti opsi tap-to-select kartu → tap pin tujuan, mengingat drag-and-drop presisi tinggi lebih sulit di layar sentuh kecil.

### 3.4 Sistem Skor & XP
- Per motif benar: **40 XP**, dengan bonus kecepatan (+10 XP jika dijawab dalam <5 detik sejak kartu muncul).
- Total ronde (6–8 motif) berpotensi memberi 240–400+ XP, sebanding dengan game lain.
- Motif yang salah tetap bisa dicoba ulang dalam sesi yang sama (kartu kembali ke akhir antrian tray), sehingga pengguna tetap belajar sebelum sesi berakhir.

### 3.5 Kebutuhan Data
- Menggunakan field yang sudah ada di `motifs`: `origin_region` (daerah asal) dan koordinat pin yang sudah didefinisikan untuk halaman Peta Interaktif — **tidak perlu tabel/field baru**, murni reuse data.

---

## 4. Game 3 (Stretch Goal) — Simulasi Membatik Canting (Wax-Resist Simulator)

> Disarankan dikerjakan hanya jika Game 1 & 2 plus fitur wajib lain (AI Lens, Chatbot, Peta, Batikpedia) sudah stabil terlebih dahulu.

### 4.1 Konsep
Simulasi proses asli membatik (wax-resist dyeing), bukan sekadar mewarnai bebas. Mengajarkan *prinsip* batik: area yang ditutup malam (canting) akan tetap putih/warna dasar setelah kain "dicelup".

### 4.2 Alur Permainan
1. Pengguna memilih pola outline motif sederhana sebagai panduan (reuse aset dari Quick Draw Canvas).
2. Mode "Menorehkan Malam": pengguna menggambar garis di atas kanvas menggunakan alat "canting virtual" mengikuti outline — garis ini disimpan sebagai **mask layer** terpisah dari layer warna.
3. Tombol "Celupkan ke Pewarna" — pengguna memilih satu warna dari palet terbatas (mis. 4-5 warna klasik: sogan, indigo, merah bata, hitam). Sistem menerapkan warna ke seluruh kanvas **kecuali** area yang tertutup mask malam (area mask tetap warna dasar kain).
4. Pengguna dapat mengulang siklus torehan-malam → celup warna beberapa kali (mis. maksimal 2-3 lapis) untuk mensimulasikan proses batik multi-warna sederhana.
5. Tombol "Selesai" → hasil akhir disimpan sebagai gambar, dibandingkan skor kerapian garis (opsional) terhadap outline asli.

### 4.3 UI & Komponen
- Kanvas dua-layer (mask malam di atas, warna di bawah, digabung secara visual real-time).
- Toolbar: alat canting (ukuran garis tetap kecil-sedang, mensimulasikan ujung canting), tombol "Celupkan Warna" dengan palet warna terbatas, tombol reset lapisan.
- Indikator lapisan saat ini (mis. "Lapisan Warna 1 dari 3").
- State: menggambar-malam, mencelup-warna (animasi transisi warna menyebar), hasil-akhir (galeri simpan).

### 4.4 Sistem Skor & XP
- **60 XP** untuk menyelesaikan minimal 1 siklus torehan-celup.
- Bonus **+20 XP** jika menyelesaikan hingga 2-3 lapis warna (proses lebih kompleks/mendekati teknik asli).

### 4.5 Catatan Teknis
- Implementasi paling realistis dengan dua `<canvas>` bertumpuk: canvas mask (grayscale, area tertoreh = transparan) di-composite dengan canvas warna menggunakan `globalCompositeOperation` (mis. `destination-out` untuk area resist).
- Kompleksitas lebih tinggi dari dua game lain — estimasi 1.5–2x waktu development Game 1/2. Rekomendasikan dikerjakan Rayka setelah AI integrations (Gemini, Vision) selesai dan stabil.

---

## 5. Dampak ke Sistem Existing

### 5.1 Update Tabel FR (menggantikan FR-01 dan FR-02 di PRD utama)
| ID | Kebutuhan | Prioritas | Deskripsi |
|---|---|---|---|
| FR-01 | Tebak Motif Berjenjang | Wajib | Kuis hint-progresif berbasis data motif, dengan sistem skor bertingkat sesuai jumlah hint terpakai. |
| FR-02 | Sortir Motif ke Peta | Wajib | Drag/tap kartu motif ke pin daerah asal yang benar pada peta, dengan timer dan skor kecepatan. |
| FR-03 | Quick Draw & Tracing Canvas | Wajib | *(tidak berubah dari PRD utama)* |
| FR-08 | Simulasi Membatik Canting | Stretch | Simulasi wax-resist dua-layer (malam + warna) untuk mengajarkan prinsip proses batik. |

### 5.2 Perubahan Skema Data
- Tabel `motifs`: tambah kolom `hint_1`–`hint_4` (teks).
- Tidak ada tabel baru yang diperlukan untuk Game 1 & 2 — keduanya reuse struktur `motifs` dan koordinat peta yang sudah ada di PRD utama.
- Game 3 (jika dikerjakan) tidak butuh tabel baru, cukup menyimpan hasil akhir (gambar) ke `game_logs` seperti game lain.

### 5.3 Perubahan Dokumen Terkait
Perubahan ini perlu disinkronkan ke dua dokumen yang sudah dibuat sebelumnya:
- **Draft Proposal (docx)** — bagian e (Fitur Aplikasi), g.1 (FR table), dan i (Mockup) perlu memakai nama & deskripsi game baru.
- **PRD Teknis Google Stitch (md)** — bagian 5.4 dan 5.5 (spesifikasi layar Jigsaw & Detektif Isen-Isen) perlu diganti dengan layar Tebak Motif Berjenjang dan Sortir Motif ke Peta.

---

## 6. Estimasi Kompleksitas Development (untuk Rayka)

| Game | Kompleksitas Relatif | Alasan |
|---|---|---|
| Tebak Motif Berjenjang | Rendah | State machine sederhana, tidak ada drag/canvas — murni UI + data-driven logic. |
| Sortir Motif ke Peta | Menengah | Reuse komponen peta yang sudah ada + drag-and-drop dengan drop-zone detection. |
| Quick Draw & Tracing Canvas | Menengah *(tidak berubah)* | Canvas API dasar, sudah direncanakan dari PRD utama. |
| Simulasi Membatik Canting | Tinggi | Dua-layer canvas compositing, logic multi-lapis warna. |

**Rekomendasi urutan pengerjaan:** Tebak Motif Berjenjang → Sortir Motif ke Peta → Quick Draw → (jika waktu tersisa) Simulasi Membatik Canting.
