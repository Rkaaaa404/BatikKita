# Batik Kita — Frontend Web Application

Frontend aplikasi web **Batik Kita** dibangun menggunakan **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, dan **onnxruntime-web** untuk pengalaman edukasi budaya Nusantara berstandar Modern Heritage.

## Menjalankan Frontend

```bash
# Install dependencies
npm install

# Jalankan dev server
npm run dev

# Build produksi
npm run build

# Start server produksi lokal
npm start
```

## Fitur & Routing

- `/` — Beranda interaktif & showcase ekosistem
- `/scan` — Scanner AI Batik Lens (Edge AI ONNX EfficientNet-B0)
- `/play` — Hub Edu-Games Arcade
  - `/play/tebak-motif` — Game kuis berjenjang
  - `/play/sortir-peta` — Game pemetaan geografis
  - `/play/cap-stamping` — Canvas stamping kreatif
  - `/play/tika` — Simulasi membatik canting
- `/batikpedia` — Ensiklopedia 20 ragam hias motif batik
- `/chat` — Tanya Sang Empu (Asisten Budaya Cerdas)
- `/collection` — Galeri kartu koleksi batik pengguna

## Standalone Docker Build

Aplikasi ini telah dikonfigurasi dengan `output: "standalone"` pada `next.config.ts`. Untuk menjalankan via Docker Compose dari root proyek:

```bash
docker compose up --build
```
