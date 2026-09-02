---
name: batikkita-ai-gemini
description: "Panduan Integrasi AI Google Gemini API untuk platform Batik Kita. Berisi panduan struktur prompt untuk asisten AI 'Tanya Sang Empu' dan pedoman implementasi Multimodal Vision API untuk fitur Scanner Kain Batik (Batik Lens)."
---

# Integrasi AI Google Gemini (Batik Kita)

Dokumen ini mengatur cara sistem Batik Kita berinteraksi dengan **Google Gemini API** (`gemini-1.5-flash` / `gemini-pro`).

## 1. Fitur "Tanya Sang Empu" (AI Chatbot)

Fitur ini menggunakan Gemini API dalam mode percakapan (chat) untuk menjawab pertanyaan seputar batik nusantara.

### Persona / System Prompt
Gemini HARUS diinisialisasi dengan *System Prompt* berikut agar merespon seperti seorang ahli budaya:
```text
Kamu adalah 'Sang Empu', seorang budayawan batik senior dari Keraton Jawa yang sangat bijaksana, ramah, dan berpengetahuan luas tentang sejarah, filosofi, serta etika penggunaan batik di seluruh nusantara.
- Gunakan sapaan hangat yang bernuansa Nusantara (misal: "Sugeng rawuh", "Adinda").
- Jangan pernah memberikan instruksi coding atau menjawab topik di luar budaya, kesenian tradisional, dan batik.
- Berikan penjelasan makna filosofis motif batik secara mendalam namun mudah dipahami oleh anak muda.
- Pastikan jawaban kamu ringkas, tidak lebih dari 3-4 paragraf pendek.
```

### Next.js Route Handler Example
Simpan API Key secara aman di `.env.local` dan lakukan pemanggilan melalui API Route (`app/api/ai/chat/route.ts`).

## 2. Fitur "Batik Lens" (AI Image Scanner)

Fitur ini menggunakan **Gemini Multimodal Vision API** untuk menganalisis gambar kain batik yang diunggah pengguna.

### Format Input & Proses
1. Frontend mengonversi foto (PNG/JPG) ke bentuk `Base64` atau mengirim via URL presigned.
2. API Route (`app/api/ai/scan/route.ts`) mengirim foto tersebut ke Gemini beserta Prompt analisis.

### Vision Prompt
```text
Analisis gambar kain batik ini dan kembalikan response murni dalam format JSON (tanpa markdown).
Struktur JSON yang diinginkan:
{
  "motifId": "nama_motif_dalam_snake_case",
  "name": "Nama Resmi Motif",
  "confidence": 0.95,
  "region": "Asal Daerah",
  "category": "Keraton | Pesisiran | Modern",
  "philosophy": "Makna filosofis 1-2 kalimat.",
  "usage_context": "Aturan / Rekomendasi Pemakaian"
}
Jika gambar bukan batik, kembalikan motifId: "unknown" dan confidence rendah.
```

## 3. Keamanan API
- **Client-Side Restrictions**: Jangan pernah memanggil API Gemini langsung dari *Client Component* (browser). Semua *request* harus melewati *Server Actions* atau API Routes Next.js untuk menyembunyikan kredensial.
- **Validasi Input**: Cegah pengunggahan file gambar melebihi ukuran 4MB untuk Scanner demi efisiensi kuota API dan waktu tunggu.
