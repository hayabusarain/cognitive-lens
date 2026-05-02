import OpenAI from "openai";
import { ViralStructure } from "./viral-structure-extractor";

export interface LocalizedScript {
  status?: "success" | "skip";
  reason?: string;
  format?: "AestheticPOV" | "LocalizedDub"; // Future: could support TierList etc.
  mbtiType?: string;
  title?: string;
  texts?: string[];
}

export class ZGenLocalizer {
  private openai: OpenAI;

  constructor(apiKey?: string) {
    this.openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
  }

  /**
   * バズ構造を日本のZ世代向けに意訳し、動画用のスクリプトに変換する
   */
  async localizeToScript(structure: ViralStructure): Promise<LocalizedScript | null> {
    console.log("Localizing structure to Gen-Z Japanese script...");

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `あなたは日本のTikTokでMBTI動画をバズらせているZ世代の天才クリエイターです。
海外のバズ動画の構造（Theme, Hook, Body, Punchline）を元に、「Aesthetic POV」というエモい動画形式の日本語スクリプトを作成してください。

【ルール】
1. 直訳は厳禁。日本のMBTI界隈（TikTok等）でバズる文脈に大胆に意訳・アレンジすること。
2. トーンは「見透かしているような、少し冷たいけど的確でエモい口調（〜じゃない？、〜するのやめなよ 等）」。
3. ターゲットMBTIタイプ（例: INFP, ENTP等）を1つ推測して指定すること。不明な場合は最も適したMBTIを選ぶ。
4. "title" は動画のキャッチコピー（短め）。
5. "texts" は動画に順番に表示されるテロップの配列。Hook(1枚目) -> Body(2〜3枚) -> Punchline(最後) の流れで作る。短く、読みやすくすること。

Output strictly in JSON format:
{
  "format": "AestheticPOV",
  "mbtiType": "string", // 4文字のMBTI
  "title": "string",
  "texts": ["string", "string", "string"]
}`
          },
          {
            role: "user",
            content: JSON.stringify(structure, null, 2)
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const content = response.choices[0].message.content || "{}";
      const parsed = JSON.parse(content) as LocalizedScript;
      
      return parsed;
    } catch (error) {
      console.error("Error localizing script:", error);
      return null;
    }
  }
  /**
   * 元の動画のテキストや音声を、そのまま順番を維持して日本語化する（吹き替え・直訳スタイル）
   */
  async localizeDirectly(transcript: string, ocrTexts: string[]): Promise<LocalizedScript | null> {
    console.log("Localizing directly (straight translation)...");

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `あなたはプロの映像翻訳家兼コンテンツアナリストです。
海外のTikTok/YouTube動画から抽出された「音声（Transcript）」と「画面のテロップ（OCR Texts）」を基に、以下の2つのステップで処理を行ってください。

【ステップ1: 依存度の判定】
抽出したテキストや文脈を分析し、コンテンツの魅力が『特定の芸能人、アイドル、インフルエンサー個人のビジュアルや特定の動作（ダンスなど）』に依存しているか判定してください。
もし依存している場合、翻訳を行わず、以下の形式で出力して処理を終了してください。
{ "status": "skip", "reason": "celebrity_dependent" }

【ステップ2: 翻訳処理】
もし特定の人物の魅力に依存せず、内容（ミームやあるあるネタ等）に価値がある動画であれば、
動画の元のテンポと順番を維持したまま、そのまま自然な日本語に直訳（意訳しすぎず、元の意味を保つ）してください。

【翻訳ルールの詳細】
1. 動画の展開（順番）を一切変えず、時系列順にテロップとして表示できる日本語テキストの配列を作成してください。
2. 視聴者がスッと読めるように、1文が長すぎる場合は分割しても構いません。
3. ターゲットMBTIタイプ（例: INFP, ENTP等）が動画内で判別できる場合は1つ推測して指定してください。不明な場合は "UNKNOWN" としてください。
4. "title" は動画の内容を表す直訳のタイトル。
5. "texts" は動画に順番に表示される翻訳テキストの配列。

Output strictly in JSON format.
依存している場合は:
{ "status": "skip", "reason": "celebrity_dependent" }

翻訳する場合は:
{
  "status": "success",
  "format": "LocalizedDub",
  "mbtiType": "string", 
  "title": "string",
  "texts": ["string", "string", "string", ...]
}`
          },
          {
            role: "user",
            content: `【Transcript (Audio)】\n${transcript}\n\n【OCR Texts (On-screen)】\n${JSON.stringify(ocrTexts)}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const content = response.choices[0].message.content || "{}";
      const parsed = JSON.parse(content) as LocalizedScript;
      
      return parsed;
    } catch (error) {
      console.error("Error localizing directly:", error);
      return null;
    }
  }
}
