# Batik Kita — Frontend Web Application

Frontend aplikasi web **Batik Kita** dibangun menggunakan **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, dan **onnxruntime-web** untuk pengalaman edukasi budaya Nusantara berstandar Modern Heritage.

## Menjalankan Frontend

```bash
# 1. Install dependencies
npm install

# 2. Jalankan development server
npm run dev

# 3. Uji type checking
npx tsc --noEmit

# 4. Build produksi
npm run build

# 5. Jalankan server produksi
npm start
```

## Fitur & Routing (Suite Batik)

- `/` — Beranda interaktif & showcase ekosistem
- `/scan` — **Batik Lens** (Edge AI ONNX EfficientNet-B0 Scanner)
- `/play` — **Batik Arcade** (Hub Edu-Games & Cultural XP Pass)
  - `/play/cap` — **Batik Cap** (Presisi canting cap tembaga & grid dinamis)
  - `/play/guess` — **Batik Guess** (Deduksi budaya 4 jenjang petunjuk)
  - `/play/map` — **Batik Map** (Eksplorasi geografi 7 sentra Nusantara)
  - `/play/zoom` — **Batik Zoom** (Observasi visual makro bertahap)
- `/collection` — **Album Koleksi Wastra** (20 kartu motif dengan bingkai adaptif mastery)
- `/batikpedia` — **Batik Pedia** (Ensiklopedia 20 ragam hias motif batik resmi)
- `/chat` — **Batik Ask** (Asisten Budaya Cerdas)

## Standalone Docker Build

Aplikasi ini telah dikonfigurasi dengan `output: "standalone"` pada `next.config.ts`. Untuk menjalankan via Docker Compose dari root proyek:

```bash
docker compose up --build
```
