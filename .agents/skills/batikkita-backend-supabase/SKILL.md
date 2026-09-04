---
name: batikkita-backend-supabase
description: "Panduan Arsitektur Data & Backend Supabase untuk platform Batik Kita. Berisi skema database PostgreSQL (profil pengguna, motif, progres gamifikasi/XP) dan aturan akses data RLS (Row Level Security)."
---

# Panduan Backend & Database Supabase (Batik Kita)

Platform Batik Kita menggunakan **Supabase** (PostgreSQL) sebagai penyimpan data utama, mengelola otentikasi, progres pengguna (XP), koleksi kartu motif, dan data referensi budaya.

## 1. Relasi Entitas Database

Desain database berpusat pada empat tabel utama:

1.  `profiles`: Menyimpan data pengguna (di-sinkronisasi dengan `auth.users`), total XP, dan gelar (*rank*).
2.  `motifs`: Basis data statis referensi motif batik, asal daerah, tingkat kesulitan puzzle, dan penjelasan budayanya.
3.  `user_cards`: Tabel relasi *many-to-many* antara profil dan motif, merepresentasikan "kartu" *Batikpedia* yang sudah berhasil di-unlock oleh pengguna.
4.  `game_logs`: Menyimpan *log* histori permainan, nilai/skor, dan XP yang didapat setiap sesi.

## 2. Pengelolaan Status XP dan Gamifikasi

Ketika pengguna menyelesaikan *Edu-Game* (misal Jigsaw Puzzle) atau melakukan Scan AI, alur pembaruan XP dilakukan via Next.js Server Actions:
- **Server Action `completeGameSession(motifId, score)`**:
  - Insert record ke `game_logs`.
  - Lakukan `UPDATE` pada `profiles.total_xp` (tambahkan nilai XP baru).
  - Evaluasi batas XP (250, 600, 1200) untuk meng-update field `current_rank`.
  - Jika ini adalah puzzle spesifik motif, cek `user_cards`. Jika belum ada relasi antara *user* dan *motif* tersebut, lakukan *insert* ke `user_cards` (membuka kartu).

## 3. Row Level Security (RLS)

- **Tabel `profiles`**: Pengguna hanya bisa melakukan `UPDATE` pada *row* `id` mereka sendiri. Akses `SELECT` bisa publik jika diperlukan untuk *Leaderboard*.
- **Tabel `motifs`**: Bersifat Statis. Set RLS policy `SELECT` untuk *public* (anonim) agar data peta dan ensiklopedia bisa dibaca tanpa login, tetapi `INSERT`/`UPDATE` hanya untuk admin.
- **Tabel `user_cards` dan `game_logs`**: Pengguna hanya dapat mengakses `SELECT` dan `INSERT` untuk `user_id` mereka sendiri.

## 4. Keamanan API Key & SSR Auth

Karena kita menggunakan Next.js App Router, integrasi Supabase Auth harus menggunakan package `@supabase/ssr`.
- Kredensial `@supabase/ssr` (Anon Key & URL) boleh di-ekspos ke klien.
- Sebaliknya, **Supabase Service Role Key** (`SUPABASE_SERVICE_ROLE_KEY`) HANYA boleh digunakan di dalam Server Actions atau Edge Functions (seperti di endpoint Gemini AI handler jika perlu bypass RLS) dan **tidak boleh pernah diekspos ke klien**. 
- Selalu gunakan helper `createClient()` yang dirancang untuk arsitektur App Router saat memanggil database dari Server Components.
