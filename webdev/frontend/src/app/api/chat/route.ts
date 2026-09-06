import { NextRequest, NextResponse } from "next/server";
import { SANG_EMPU_SYSTEM_INSTRUCTION } from "@/lib/geminiKnowledge";

interface IncomingMessage {
  role: "user" | "bot" | "assistant" | "model";
  content: string;
}

interface GeminiContentPart {
  text: string;
}

interface GeminiContent {
  role: "user" | "model";
  parts: GeminiContentPart[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const incomingMessages: IncomingMessage[] = body.messages || [];

    if (!incomingMessages.length) {
      return NextResponse.json(
        { error: "Pesan tidak boleh kosong." },
        { status: 400 }
      );
    }

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("GEMINI_API_KEY tidak ditemukan di environment variable.");
      return NextResponse.json(
        {
          role: "bot",
          content:
            "Sugeng rawuh, Ananda. Kunci gerbang pengetahuan digital belum terpasang di sistem. Silakan periksa konfigurasi GEMINI_API_KEY pada berkas .env Anda.",
        },
        { status: 200 }
      );
    }

    // Format riwayat chat ke struktur Gemini API
    // Aturan Gemini API:
    // 1. Role harus "user" atau "model"
    // 2. Tidak boleh diawali pesan "model" tanpa user terlebih dahulu
    // 3. Pesan berturut-turut dengan role sama sebaiknya digabung
    const formattedContents: GeminiContent[] = [];

    for (const msg of incomingMessages) {
      const geminiRole = msg.role === "user" ? "user" : "model";

      // Abaikan jika pesan pertama adalah bot greeting awal
      if (formattedContents.length === 0 && geminiRole === "model") {
        continue;
      }

      const lastContent = formattedContents[formattedContents.length - 1];
      if (lastContent && lastContent.role === geminiRole) {
        lastContent.parts[0].text += `\n${msg.content}`;
      } else {
        formattedContents.push({
          role: geminiRole,
          parts: [{ text: msg.content }],
        });
      }
    }

    // Pastikan minimal ada 1 pesan user
    if (!formattedContents.length) {
      const lastUserMsg = incomingMessages.filter((m) => m.role === "user").pop();
      if (lastUserMsg) {
        formattedContents.push({
          role: "user",
          parts: [{ text: lastUserMsg.content }],
        });
      }
    }

    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const requestPayload = {
      systemInstruction: {
        parts: [{ text: SANG_EMPU_SYSTEM_INSTRUCTION }],
      },
      contents: formattedContents,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 1000,
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    };

    const response = await fetch(geminiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API Error Response:", response.status, errText);

      return NextResponse.json(
        {
          role: "bot",
          content:
            "Sugeng rawuh, Ananda. Nampaknya bilik kearifan kami sedang mengalami lonjakan pengunjung sejenak. Namun ketahuilah, setiap helai wastra nusantara senantiasa memancarkan doa luhur para leluhur. Sudilah kiranya Ananda mengulang pertanyaan sejenak lagi.",
        },
        { status: 200 }
      );
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const generatedText =
      candidate?.content?.parts?.[0]?.text?.trim() ||
      "Sugeng rawuh, Ananda. Jawaban bijak telah terpatri, namun belum tertangkap sempurna oleh layar. Silakan utarakan kembali rasa penasaranmu tentang batik nusantara.";

    return NextResponse.json({
      role: "bot",
      content: generatedText,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Chat API Route Internal Error:", message);

    return NextResponse.json(
      {
        role: "bot",
        content:
          "Nyuwun sewu, Ananda. Terjadi sedikit kendala teknis dalam membaca serat pustaka wastra. Silakan coba kembali dalam beberapa saat.",
      },
      { status: 200 }
    );
  }
}
