import { NextResponse } from "next/server";
import OpenAI from "openai";

// OpenAI APIをセットアップ
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "お題（topic）が必要です" }, { status: 400 });
    }

    const prompt = `
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
      "mbtiType": "ENTP", // 必ず以下の16タイプのいずれかを使用すること: INTJ, INTP, ENTJ, ENTP, INFJ, INFP, ENFJ, ENFP, ISTJ, ISFJ, ESTJ, ESFJ, ISTP, ISFP, ESTP, ESFP
      "tier": "S",
      "comment": "息をするように嘘をついて相手を論破してくる真性の狂人"
    },
    // ... 合計16タイプすべてを出力（DからSの順に、つまり下位から発表する順序で並べること）
  ]
}
\`\`\`
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // コストと速度を考慮してminiを使用
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
