import fs from "fs";
import OpenAI from "openai";

export class VisionOCR {
  private openai: OpenAI;

  constructor(apiKey?: string) {
    this.openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
  }

  /**
   * 画像ファイルをBase64エンコードする
   */
  private encodeImage(imagePath: string): string {
    const bitmap = fs.readFileSync(imagePath);
    return Buffer.from(bitmap).toString('base64');
  }

  /**
   * 複数のフレーム画像から画面内のテキストを抽出する
   * トークン節約のため、最大10〜20フレームずつバッチ処理を推奨
   */
  async extractTextFromFrames(framePaths: string[]): Promise<string[]> {
    if (framePaths.length === 0) return [];

    console.log(`Extracting text from ${framePaths.length} frames using Vision...`);
    
    // 最大20枚程度に制限して投げる（多すぎるとエラーやタイムアウトになる）
    const maxFrames = 20;
    const sampledFrames = framePaths.filter((_, i) => i % Math.ceil(framePaths.length / maxFrames) === 0).slice(0, maxFrames);

    const imageContents: OpenAI.Chat.Completions.ChatCompletionContentPartImage[] = sampledFrames.map(path => ({
      type: "image_url",
      image_url: {
        url: `data:image/jpeg;base64,${this.encodeImage(path)}`,
        detail: "low" // Token節約のためlow解像度モード
      }
    }));

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini", // Use 4o-mini for fast & cheap vision
        messages: [
          {
            role: "system",
            content: "You are an OCR and video analysis assistant. Read all text visible in the provided video frames. Group the text in chronological order, ignoring duplicate texts across consecutive frames. Only output the extracted text."
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Please extract all on-screen text from these chronological video frames." },
              ...imageContents
            ]
          }
        ],
        max_tokens: 1000,
      });

      const resultText = response.choices[0].message.content || "";
      // Split by lines and clean up
      return resultText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    } catch (error) {
      console.error("Error in Vision OCR:", error);
      return [];
    }
  }
}
