import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { topic, format } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "お題（topic）が必要です" }, { status: 400 });
    }

    let prompt = "";

    if (format === "smartphone") {
      prompt = `
あなたはTikTokショート動画の構成作家です。「${topic}」というお題でMBTIの8タイプが登場する「スマホ画面（検索履歴）」フォーマットの台本を作成してください。
以下のJSONフォーマットに完全に準拠して返却してください。JSON以外のテキストは絶対に出力しないでください。

【出力JSONルール】
\`\`\`json
{
  "theme": "${topic}",
  "type": "search",
  "sections": [
    {
      "mbtiType": "INTP", // ランダムな8タイプを選ぶこと
      "items": [
        "人間 なぜ 感情的",
        "宇宙の果て どうなってる",
        "猫 かわいい 理由 科学的"
      ] // 各タイプごとに、そのお題に基づいた検索履歴を3つずつ（1つ10〜20文字程度でリアルに）
    }
  ] // 合計8タイプ分のデータを出力すること
}
\`\`\`
`;
    } else if (format === "reaction") {
      prompt = `
あなたはTikTokショート動画の構成作家です。「${topic}」というお題でMBTIの8タイプが登場する「シチュエーション反応」フォーマットの台本を作成してください。
以下のJSONフォーマットに完全に準拠して返却してください。JSON以外のテキストは絶対に出力しないでください。

【出力JSONルール】
\`\`\`json
{
  "theme": "${topic}",
  "reactions": [
    {
      "mbtiType": "ENFP", // ランダムな8タイプを選ぶこと
      "text": "「えっ!? 私なんかしました!?」と焦りまくり、なぜか後ろに並んでる人にペコペコ謝る。" // そのお題に対する反応を30〜50文字で面白く
    }
  ] // 合計8タイプ分のデータを出力すること
}
\`\`\`
`;
    } else if (format === "piechart") {
      prompt = `
あなたはTikTokショート動画の構成作家です。「${topic}」というお題でMBTIの7タイプが登場する「脳内円グラフ」フォーマットの台本を作成してください。
以下のJSONフォーマットに完全に準拠して返却してください。JSON以外のテキストは絶対に出力しないでください。

【出力JSONルール】
\`\`\`json
{
  "theme": "${topic}",
  "charts": [
    {
      "mbtiType": "ESTP", // ランダムな7タイプを選ぶこと
      "slices": [
        { "label": "今夜の予定・遊び", "percentage": 40 }, // 合計100%になるように4つのスライスを作成
        { "label": "スリルと刺激", "percentage": 30 },
        { "label": "謎の自信", "percentage": 20 },
        { "label": "本能", "percentage": 10 }
      ] // 各ラベルはそのお題に基づいた思考内容（10〜20文字程度）
    }
  ] // 合計7タイプ分のデータを出力すること
}
\`\`\`
`;
    } else if (format === "combo") {
      prompt = `
あなたはTikTokショート動画の構成作家です。「${topic}」というお題でMBTIの相性が悪い（または面白い）組み合わせが3組登場する「会話劇コンボ」フォーマットの台本を作成してください。
以下のJSONフォーマットに完全に準拠して返却してください。JSON以外のテキストは絶対に出力しないでください。

【出力JSONルール】
\`\`\`json
{
  "theme": "${topic}",
  "combos": [
    {
      "typeA": "ESTJ", // ペアの1人目
      "typeB": "INFP", // ペアの2人目
      "dialogue": [
        { "speaker": "ESTJ", "text": "よし、10時15分にSAで休憩だ。" }, // typeAとtypeBのどちらかが話す
        { "speaker": "INFP", "text": "あ！あそこのソフトクリーム食べたい！" },
        { "speaker": "ESTJ", "text": "（無言で時計を見る）" },
        { "speaker": "INFP", "text": "（怒らせたかな…）" }
      ] // 1ペアにつき4回のセリフのやり取り（1セリフ20〜40文字程度）
    }
  ] // 合計3ペア（3組の会話劇）を出力すること
}
\`\`\`
`;
    } else {
      prompt = `
あなたはTikTokのショート動画の構成作家です。
「${topic}」というお題で、MBTIの16タイプ全員が登場する「階級表（Tier List）」形式のランキングデータを作成してください。
以下のJSONフォーマットで完全に準拠して返却してください。JSON以外のテキストは絶対に出力しないでください。
Tierは "S" (一番ヤバい/特徴が強い) から、"A", "B", "C", "D" (一番まとも/普通) の5段階に分けてください。
各コメントは20文字〜40文字程度で、TikTokで若者にウケるような少し口語的で煽り気味なキャッチーな表現にしてください。

【出力JSONルール】
\`\`\`json
{
  "title": "${topic} Ranking",
  "entries": [
    {
      "mbtiType": "ENTP",
      "tier": "S",
      "comment": "息をするように嘘をついて相手を論破してくる真性の狂人"
    }
  ] // 合計16タイプすべてを出力（DからSの順に並べる）
}
\`\`\`
`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("AIがコンテンツを返しませんでした");
    }

    const data = JSON.parse(content);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Script generation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
