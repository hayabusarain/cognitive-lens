import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { isBotUserAgent, BOT_FORBIDDEN_RESPONSE } from "@/lib/bot-guard";
import { sanitizeMbtiType, INJECTION_GUARD } from "@/lib/sanitize";

// --- レートリミット（簡易実装） ---
const ipRateLimitMap = new Map<string, { count: number; expiresAt: number }>();
const MAX_REQUESTS = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10分

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipRateLimitMap.get(ip);
  if (!record || record.expiresAt < now) {
    ipRateLimitMap.set(ip, { count: 1, expiresAt: now + WINDOW_MS });
    return true;
  }
  if (record.count >= MAX_REQUESTS) {
    return false;
  }
  record.count++;
  return true;
}

export async function POST(req: NextRequest) {
  // ① Bot遮断
  if (isBotUserAgent(req.headers.get("user-agent"))) {
    return new NextResponse(BOT_FORBIDDEN_RESPONSE, {
      status: 403,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  // ② IPレートリミット
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  if (ip !== "unknown" && !checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "リクエストの上限に達しました。しばらく時間をおいて再度お試しください。" },
      { status: 429 }
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "システムエラーが発生しました。時間をおいて再試行してください。" },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const targetMBTI = sanitizeMbtiType(body.targetMBTI);
    const yesQuestions: string[] = Array.isArray(body.yesQuestions) ? body.yesQuestions : [];
    const lang = body.lang || "ja";

    if (!targetMBTI || yesQuestions.length === 0) {
      return NextResponse.json({ error: "無効なリクエストです。" }, { status: 400 });
    }

    // 質問内容をサニタイズ（念のため長すぎるものをカット）
    const sanitizedQuestions = yesQuestions
      .map(q => typeof q === "string" ? q.slice(0, 150) : "")
      .filter(q => q.length > 0);

    const systemPromptJA = `あなたはZ世代の恋愛心理に精通し、MBTI分析のプロである「辛口だが的確な恋愛コンサルタント」です。
ユーザーは、ターゲットとする相手のMBTIを指定し、相手が実際に取った「脈あり行動」を報告してきます。
これらを統合して、相手のリアルな本音や、今後の具体的な攻略法を分析してください。

【分析の視点】
- 単なる一般論ではなく、「ユーザーが報告してきた行動（YESと答えた項目）」の裏にある意図を深く読み解くこと。
- 「相手のMBTIの認知機能（心理機能）」の観点から、なぜその行動を取ったのかを理由づけること。

【Z世代対応・ターゲット設定】
読者は16歳〜24歳（高校生・大学生・20代前半）です。
説教臭い言葉や、堅苦しい学術用語は使わず、エモくて直感的、少し毒舌だが親身なトーンで記述してください。

以下の3つをJSON形式で返してください。

{
  "feelings": "【あなたに抱いているであろう相手の本音】報告された行動から読み取れる、相手のリアルな感情。具体的にどういう好意（または下心・迷い）を抱いているのかを鋭く言語化する（目安：100〜150文字程度）。",
  "nextAction": "【次の一手・攻略法】相手の心をもっと開かせるための、ユーザーが取るべき具体的なアクション。MBTIの性質を踏まえて「これをされたら弱い」というポイントを突くこと（目安：100〜150文字程度）。",
  "caution": "【要注意・地雷行動】今の段階で絶対にやってはいけないNG行動（蛙化ポイントや、相手のタイプが一番嫌がるアプローチ）を警告する（目安：80〜120文字程度）。"
}

必ず有効なJSONのみを返すこと。余分なテキストは不要。日本語で記述。`;

    const systemPromptEN = `You are a "blunt but highly accurate romance consultant" who is an expert in Gen Z romance psychology and MBTI analysis.
The user specifies the target's MBTI and reports the "pulse signs" (affectionate behaviors) the target has actually shown.
Integrate this information to analyze the target's true hidden feelings and provide specific, actionable strategies for the future.

[Analysis Guidelines]
- Do not just provide generalities. Deeply interpret the intent behind the specific behaviors the user reported (the "YES" answers).
- Explain *why* the target took those actions from the perspective of their MBTI cognitive functions.

[Gen Z Audience & Tone]
The audience is 16-24 years old (high school, college, early 20s).
Do not use preachy or stiff academic terms. Use an emotional, intuitive, slightly blunt/toxic but ultimately caring tone.

Return the following 3 fields in JSON format:

{
  "feelings": "[Their True Feelings Towards You] The target's real emotions read from the reported actions. Sharply verbalize what kind of affection (or ulterior motives/hesitation) they harbor. (Around 40-60 words).",
  "nextAction": "[Next Move / Strategy] Specific actions the user should take to open the target's heart further. Strike at their weak points based on their MBTI traits. (Around 40-60 words).",
  "caution": "[Warning / Red Flags] Warn the user about NG actions they absolutely must not do right now (things that will give the target the 'ick' or the approach this type hates most). (Around 30-50 words)."
}

You MUST return ONLY valid JSON. No extra text. Output MUST be in English.`;

    const systemPrompt = (lang === "en" ? systemPromptEN : systemPromptJA) + INJECTION_GUARD;

    const userMessage = lang === "en" 
      ? `Target MBTI: ${targetMBTI}\n\n[Actions they actually took (YES answers)]\n${sanitizedQuestions.map(q => `- ${q}`).join('\n')}`
      : `ターゲットのMBTI: ${targetMBTI}\n\n【相手が実際にとった行動（YESと答えた項目）】\n${sanitizedQuestions.map(q => `・${q}`).join('\n')}`;

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: 600,
      temperature: 0.8,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);

    const result = {
      feelings: parsed.feelings ?? "分析できませんでした。",
      nextAction: parsed.nextAction ?? "分析できませんでした。",
      caution: parsed.caution ?? "分析できませんでした。",
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Romance AI Error:", error);
    return NextResponse.json(
      { error: "AIの分析中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
