import { NextRequest, NextResponse } from "next/server";

function splitTextIntoChunks(text: string, maxLen = 160): string[] {
  // Bersihkan karakter markdown dan spasi berlebih
  const clean = text
    .replace(/[*_#`[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!clean) return [];
  if (clean.length <= maxLen) return [clean];

  // Pisahkan berdasarkan tanda baca kalimat
  const sentenceRegex = /[^.!?]+[.!?]+|[^.!?]+$/g;
  const rawSentences = clean.match(sentenceRegex) || [clean];

  const chunks: string[] = [];
  let current = "";

  for (const raw of rawSentences) {
    const s = raw.trim();
    if (!s) continue;

    if (current.length + s.length + 1 <= maxLen) {
      current = current ? `${current} ${s}` : s;
    } else {
      if (current) chunks.push(current);

      if (s.length <= maxLen) {
        current = s;
      } else {
        // Jika kalimat tunggal melebihi maxLen, pisahkan berdasarkan koma atau kata
        const words = s.split(" ");
        let subChunk = "";
        for (const w of words) {
          if (subChunk.length + w.length + 1 <= maxLen) {
            subChunk = subChunk ? `${subChunk} ${w}` : w;
          } else {
            if (subChunk) chunks.push(subChunk);
            subChunk = w;
          }
        }
        current = subChunk;
      }
    }
  }

  if (current) chunks.push(current);
  return chunks;
}

async function fetchAudioChunk(text: string): Promise<Buffer> {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=id&q=${encodeURIComponent(text)}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  if (!res.ok) {
    throw new Error(`Google TTS returned status ${res.status}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get("text");

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "Parameter 'text' diperlukan." },
        { status: 400 }
      );
    }

    const chunks = splitTextIntoChunks(text, 160);
    if (!chunks.length) {
      return NextResponse.json(
        { error: "Teks tidak valid untuk disintesis." },
        { status: 400 }
      );
    }

    // Ambil seluruh potongan suara Bahasa Indonesia secara paralel/sekuensial
    const audioBuffers: Buffer[] = [];
    for (const chunk of chunks) {
      const buf = await fetchAudioChunk(chunk);
      audioBuffers.push(buf);
    }

    // Gabungkan seluruh frame MP3 menjadi satu berkas audio utuh
    const combinedBuffer = Buffer.concat(audioBuffers);

    return new NextResponse(combinedBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Error pada API TTS:", message);

    return NextResponse.json(
      { error: "Gagal menghasilkan audio Bahasa Indonesia." },
      { status: 500 }
    );
  }
}
