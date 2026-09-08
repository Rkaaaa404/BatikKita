import { NextRequest, NextResponse } from "next/server";
import { SANG_EMPU_SYSTEM_INSTRUCTION } from "@/lib/geminiKnowledge";
import { synthesizeOfflineEmpuResponse } from "@/lib/offlineEmpuKnowledge";

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
  let lastUserMsgContent = "";

  try {
    const body = await req.json();
    const incomingMessages: IncomingMessage[] = body.messages || [];

    if (!incomingMessages.length) {
      return NextResponse.json(
        { error: "Pesan tidak boleh kosong." },
        { status: 400 }
      );
    }

    const lastUserMsg = incomingMessages.filter((m) => m.role === "user").pop();
    lastUserMsgContent = lastUserMsg?.content || "";

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    // Jika API Key tidak terpasang, beralih mulus ke Mode Empu Luring (Offline Heritage Synthesizer)
    if (!apiKey) {
      console.warn("GEMINI_API_KEY tidak terpasang. Mengaktifkan Mode Empu Luring.");
      const fallbackResponse = synthesizeOfflineEmpuResponse(lastUserMsgContent);
      return NextResponse.json(
        {
          role: "bot",
          content: fallbackResponse,
        },
        { status: 200 }
      );
    }

    // Format riwayat chat ke struktur Gemini API
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
    if (!formattedContents.length && lastUserMsgContent) {
      formattedContents.push({
        role: "user",
        parts: [{ text: lastUserMsgContent }],
      });
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

      // Fallback otomatis ke mesin pengetahuan Empu luring jika kuota habis / error 429
      const fallbackResponse = synthesizeOfflineEmpuResponse(lastUserMsgContent);
      return NextResponse.json(
        {
          role: "bot",
          content: fallbackResponse,
        },
        { status: 200 }
      );
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const generatedText =
      candidate?.content?.parts?.[0]?.text?.trim() ||
      synthesizeOfflineEmpuResponse(lastUserMsgContent);

    return NextResponse.json({
      role: "bot",
      content: generatedText,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Chat API Route Internal Error:", message);

    const fallbackResponse = synthesizeOfflineEmpuResponse(lastUserMsgContent);
    return NextResponse.json(
      {
        role: "bot",
        content: fallbackResponse,
      },
      { status: 200 }
    );
  }
}
