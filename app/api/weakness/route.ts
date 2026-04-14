import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { sanitizeMbtiType, INJECTION_GUARD } from "@/lib/sanitize";
import { isBotUserAgent, BOT_FORBIDDEN_RESPONSE } from "@/lib/bot-guard";

export async function POST(req: NextRequest) {
  if (isBotUserAgent(req.headers.get("user-agent"))) {
    return new NextResponse(BOT_FORBIDDEN_RESPONSE, {
      status: 403,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "システムエラーが発生しました。" },
      { status: 503 }
    );
  }

  const body = await req.json();
  const type = sanitizeMbtiType(body.type);

  if (!type) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `あなたはMBTIの認知機能に精通した心理分析AIです。
タイプ「${type}」の**絶対的弱点**を、以下の5項目でそれぞれ0〜100のスコアで評価してください。

【5項目】
1. 非論理性（irrationality）: 感情や直感に振り回され、論理的思考が破綻しやすい度合い
2. 社会不適合（antisocial）: 社会の暗黙のルールや空気を読めない・無視する度合い
3. 傲慢（arrogance）: 自分の能力や視点を過信し、他者を見下す傾向の度合い
4. 感情過多（emotional）: 感情に支配されやすく、冷静な判断ができなくなる度合い
5. 猜疑心（suspicion）: 他者の意図を疑い、信頼を築くことが困難な度合い

【ルール】
- スコアは${type}の認知機能スタック（主機能〜劣等機能）に基づいて論理的に算出すること
- 全項目が均等にならないようにすること。${type}らしい偏りを明確に出すこと
- 最も高いスコアの項目について、1行で鋭いコメントを付けること（comment フィールド）

以下のJSONのみを返すこと:
{
  "scores": {
    "irrationality": 数値,
    "antisocial": 数値,
    "arrogance": 数値,
    "emotional": 数値,
    "suspicion": 数値
  },
  "comment": "最も高い弱点に対する鋭い一言"
}` + INJECTION_GUARD;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.8,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);

    return NextResponse.json({
      scores: parsed.scores ?? { irrationality: 50, antisocial: 50, arrogance: 50, emotional: 50, suspicion: 50 },
      comment: parsed.comment ?? "",
      type,
    });
  } catch {
    return NextResponse.json(
      { error: "スコアリングに失敗しました。" },
      { status: 500 }
    );
  }
}
