import { NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text, type, mbtiType } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "読み上げるテキスト（text）が必要です" }, { status: 400 });
    }

    // TTSディレクトリの確認と作成
    const ttsDir = path.join(process.cwd(), "public", "tts");
    if (!fs.existsSync(ttsDir)) {
      fs.mkdirSync(ttsDir, { recursive: true });
    }

    // 音声の生成 (novaを使用。一番TikTokっぽい若々しい声)
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // 一意のファイル名を生成
    const filename = `${type || "comment"}_${mbtiType || "audio"}_${Date.now()}.mp3`;
    const filePath = path.join(ttsDir, filename);

    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      success: true,
      audioUrl: `/tts/${filename}`,
    });
  } catch (error: any) {
    console.error("TTS generation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
