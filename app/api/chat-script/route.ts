import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { isBotUserAgent, BOT_FORBIDDEN_RESPONSE } from "@/lib/bot-guard";

export interface ChatMessage {
  speaker: "type1" | "type2";
  message: string;
}

const ALL_TYPES = new Set([
  "INTJ","INTP","ENTJ","ENTP",
  "INFJ","INFP","ENFJ","ENFP",
  "ISTJ","ISFJ","ESTJ","ESFJ",
  "ISTP","ISFP","ESTP","ESFP",
]);

export async function POST(req: NextRequest) {
  // Bot遮断（多層防御）
  if (isBotUserAgent(req.headers.get("user-agent"))) {
    return new NextResponse(BOT_FORBIDDEN_RESPONSE, {
      status: 403,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "システムエラーが発生しました。時間をおいて再試行してください。" },
      { status: 503 }
    );
  }

  const body = await req.json();
  const type1 = (body.type1 ?? "").toUpperCase().slice(0, 4);
  const type2 = (body.type2 ?? "").toUpperCase().slice(0, 4);

  if (!ALL_TYPES.has(type1) || !ALL_TYPES.has(type2)) {
    return NextResponse.json({ error: "Invalid MBTI type" }, { status: 400 });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `あなたは恋愛ドラマの脚本家であり、MBTIの認知機能にも精通しています。
${type1}と${type2}が「付き合っている恋人同士」という設定で、LINEのやり取りを生成してください。

【シチュエーション（以下のどれかをランダムに選ぶ）】
- デートのドタキャン直後のやりとり
- 「最近冷たくない？」から始まる夜中のLINE
- 相手の異性の友達との写真がSNSに上がっていた直後
- 記念日を忘れていた or 祝い方がズレていた
- 「将来の話」をしたら温度差がありすぎた
- 些細な一言がきっかけで過去の不満が爆発した

【絶対に守るルール】
1. **生々しいリアルさ**: まるで本物のカップルのLINEを盗み見しているような臨場感。
   「論理的に〜」「認知機能が〜」のような分析的・説明的な台詞は絶対に禁止。
   実際の恋人が使うような生の言葉（タメ口、感情的な語尾、皮肉、沈黙の「…」）で書くこと。
2. **すれ違いの構造**: ${type1}は自分なりに誠実に向き合っているつもりだが、言い方や態度が${type2}の求めるものとズレている。${type2}も本当は好きなのに、その好意の表現が${type1}には届かない。どちらも悪くない。ただ、愛し方が違う。
3. **感情のエスカレーション**: 最初は穏やかだが、ターンが進むにつれて本音がにじみ出て、最後は「もういいよ」「好きにして」のような、心が折れる瞬間で終わること。ハッピーエンドにはしない。読んだ人が胸がキュッとなるような余韻を残す。
4. **パッシブ・アグレッション**: 直接怒鳴るのではなく、「別にいいけど」「ふーん、そうなんだ」「了解」のような、行間に感情が滲む返答を効果的に使うこと。
5. **各メッセージは45文字以内**の自然な日本語にすること。短く、刺さる言葉で。

ターン数は8〜10ターン（必ず${type1}から始める）。

以下のJSON配列のみを返すこと。余分なテキスト・マークダウンは一切不要。
[
  { "speaker": "type1", "message": "セリフ" },
  { "speaker": "type2", "message": "セリフ" },
  ...
]`;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800,
      temperature: 0.95,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    // GPT might wrap in an object key
    let parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      const obj = parsed as Record<string, unknown>;
      const key = Object.keys(obj).find((k) => Array.isArray(obj[k]));
      parsed = key ? obj[key] : [];
    }

    const messages = (parsed as ChatMessage[]).slice(0, 10);
    return NextResponse.json({ messages, type1, type2 });
  } catch {
    return NextResponse.json(
      { error: "システムエラーが発生しました。時間をおいて再試行してください。" },
      { status: 500 }
    );
  }
}
