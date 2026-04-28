/**
 * /api/result — ショートカット・プロファイリング API
 *
 * 診断フォームを経ずに「MBTIタイプ + 繰り返す失敗パターン」から
 * 深層心理分析を生成する。ストリーミングレスポンス。
 *
 * セキュリティ層:
 *   ① Bot遮断（User-Agent検査）
 *   ② IPレートリミット（10分間3回）
 *   ③ 入力サニタイズ（sanitizeUserText / sanitizeMbtiType）
 *   ④ プロンプト・インジェクション防御ラッパー（INJECTION_GUARD）
 *   ⑤ インメモリキャッシュ（同一入力→再生成なし、TTL 1時間）
 */

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { sanitizeUserText, sanitizeMbtiType, INJECTION_GUARD } from "@/lib/sanitize";
import { isBotUserAgent, BOT_FORBIDDEN_RESPONSE } from "@/lib/bot-guard";
import { getDomInf } from "@/lib/cognitive-functions";
import { getClientIp } from "@/lib/get-client-ip";
import {
  resultCacheKey,
  getResultCacheEntry,
  setResultCacheEntry,
} from "@/lib/result-cache";

// ── IPレートリミット（OpenAI呼び出しコスト保護：10分間3回） ─────
const requestLog = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 3;

function checkRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const prev = (requestLog.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (prev.length >= MAX_REQUESTS) {
    const oldest = Math.min(...prev);
    requestLog.set(ip, prev);
    return { allowed: false, retryAfter: Math.ceil((oldest + WINDOW_MS - now) / 1000) };
  }
  requestLog.set(ip, [...prev, now]);
  return { allowed: true, retryAfter: 0 };
}

// ── 認知機能の日本語名マップ ──────────────────────────────────
const FN_LABELS: Record<string, string> = {
  Ni: "内向的直観（Ni）— 未来・パターン・確信",
  Ne: "外向的直観（Ne）— 可能性・アイデア・発散",
  Si: "内向的感覚（Si）— 記憶・安定・習慣",
  Se: "外向的感覚（Se）— 現在・刺激・即興",
  Fi: "内向的感情（Fi）— 個人的価値観・真正性",
  Fe: "外向的感情（Fe）— 調和・共感・場の空気",
  Ti: "内向的思考（Ti）— 論理構造・一貫性・分析",
  Te: "外向的思考（Te）— 効率・実績・システム化",
};

// ── Route handler ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // ① Bot遮断
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

  // ② IPレートリミット（偽造対策: cf-connecting-ip → x-real-ip → xff末尾 の優先順位）
  const ip = getClientIp(req.headers);
  const { allowed, retryAfter } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      {
        error: "RATE_LIMITED",
        message:
          "アクセスが集中しています。しばらく経ってから再度お試しください。",
        retryAfter,
      },
      { status: 429 }
    );
  }

  const body = await req.json();
  const rawType = typeof body.type === "string" ? body.type : "";
  const rawPattern = typeof body.failurePattern === "string" ? body.failurePattern : "";
  const lang = body.lang === "en" ? "en" : "ja";

  // ③ サニタイズ
  const type = sanitizeMbtiType(rawType);
  // 失敗パターンは最大400文字
  const failurePattern = sanitizeUserText(rawPattern, 400);

  if (!type) {
    return NextResponse.json({ error: "MBTIタイプが無効です" }, { status: 400 });
  }
  if (failurePattern.length < 5) {
    return NextResponse.json(
      { error: "失敗パターンを5文字以上入力してください" },
      { status: 400 }
    );
  }

  // ④ キャッシュヒット確認
  const cacheKey = resultCacheKey(type, failurePattern) + `_lang_${lang}`;
  const cached = getResultCacheEntry(cacheKey);

  if (cached) {
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(cached));
        controller.close();
      },
    });
    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Cache": "HIT",
      },
    });
  }

  // ⑤ 認知機能スタックを取得してプロンプトに埋め込む
  const { dom, inf } = getDomInf(type);
  const domLabel = dom ? (FN_LABELS[dom] ?? dom) : "不明";
  const infLabel = inf ? (FN_LABELS[inf] ?? inf) : "不明";

  // ⑥ プロンプト構築
  const systemPromptEn = `You are a sharp but deeply loving profiler who strips away the target's facade.
The target is an "${type}" type, who self-reported the following "recurring failure pattern".

Cognitive function stack for this type:
▶ Dominant (Dom): ${domLabel}
▶ Inferior (Inf): ${infLabel}

Analyze "why ${type} keeps repeating this failure" from the perspective of their dominant function overworking and inferior function collapsing.
Provide the ultimate instruction manual in 4 sections.

【Output Requirements & Tone】
- Avoid stiff academic terms. Use warm, relatable language that 16-24 year olds will instantly vibe with. 
- Maintain a "stab and save (carrot and stick)" structure. Make the writing emotional, punchy, and highly shareable on social media.
- Keep it around 300-400 words. Fast-paced and easy to read.
- The entire output MUST be in English.

【Gen Z Target & Slang】
Target audience: 16-24 years old. Use modern Gen Z English dating slang (e.g., leaving on read, soft launching on IG story, catching the ick, situationship, ghosting).
- Contexts: Different texting speeds, differences in planning trips (J vs P), social battery limits.

【Structure】
1. God-tier Talents and Unconscious Toxiticy (Hitting the Bullseye)
Praise the overwhelming strengths of their Dom (${domLabel}), then sharply point out the moment it "overworks"—when their strength backfires and hurts others.

2. The Flaw They Will Never Admit (Analyzing the failure with cognitive functions)
Analyze their self-reported failure as a runaway cognitive function. What happens when their Inf (${infLabel}) loses control?
Corner them with: "You use X as an excuse, but really you're just running away from Y." Explain structurally why they repeat it. Block their escapes.

3. Cheat Codes for an Easier Life (Using functions consciously)
Provide sly, highly practical, non-sugarcoated advice to prevent Inf collapse and use Dom consciously. Must include at least 1 immediate technique with specific seconds/locations (e.g., "count to 6 when emotional"). No pure mental advice.

4. But Honestly, You Are... (Words from Their Biggest Supporter)
End with a gentle tone. Affirm the "pure kindness" or "fragility" behind why ${type} takes such awkward attitudes.

【Output Format】
Return ONLY plain text. No JSON, no markdown symbols (like **).

【God-tier Talents & Unconscious Toxicity】
content here

【The Flaw You Will Never Admit】
content here

【Cheat Codes for an Easier Life】
content here

【But Honestly, You Are...】
content here` + INJECTION_GUARD;

  // ユーザーメッセージに推測不能なUUIDデリミタを使用（プロンプトインジェクション防止）
  // デリミタはリクエストごとに生成し、ユーザー入力から再現不可能にする
  const delimId = crypto.randomUUID();
  const DELIM_START = `DATA_START_${delimId}`;
  const DELIM_END   = `DATA_END_${delimId}`;

  const systemPromptJa = `あなたはターゲットの深層心理を丸裸にする、鋭くも愛情深いプロファイラーです。
ターゲットは「${type}」タイプで、以下の「繰り返す失敗パターン」を自己申告しました。

このタイプの認知機能スタック:
▶ 主機能（Dom） : ${domLabel}
▶ 劣等機能（Inf）: ${infLabel}

「なぜ${type}はその失敗を何度も繰り返してしまうのか」を、
主機能の過剰作動と劣等機能の崩壊という観点から分析し、
完全な取扱説明書を4段構成で出力してください。

【出力要件とトーン】
- 学術用語や堅苦しい漢語は避けつつ、高校生〜大学生が「あー、わかる」と即共感できる体温のある言葉を使うこと。幼すぎる表現も禁止。
- 「刺して、救う（アメとムチ）」の構成を維持し、思わずSNSでスクショしてシェアしたくなるような、エモーショナルでパンチの効いた文体にすること。
- 文字数は800字〜1000字程度。短文でテンポよく読ませること。

【セーフティガイドライン（絶対遵守）】
- 差別・暴力・過度な誹謗中傷・自傷行為の助長は厳禁。
- 直接的な罵倒・侮辱的表現を使わず、「知的な皮肉」と「鋭い比喩」で図星を突くこと。
- OpenAIのコンテンツポリシーに完全準拠した表現を徹底すること。

【構成要素】
1. ズバ抜けた才能と、無意識のトゲ（図星を突く）
${type}の主機能（${domLabel}）がもたらす圧倒的な強みを褒めた後、
それが「過剰作動」したとき——つまり強みが裏目に出て他者を傷つける瞬間——を鋭く指摘し、ハッとさせること。

2. 絶対に認めたくない弱点（自己申告の失敗を認知機能で解剖する）
自己申告の失敗パターンを認知機能の暴走として解析せよ。
劣等機能（${infLabel}）がコントロールを失った瞬間に何が起きるかを、
「あなたは〇〇を言い訳にして、本当は〇〇から逃げているだけだ」という形式で追い詰めること。
なぜその失敗が繰り返されるのか、認知の構造的必然として説明せよ。逃げ道を封鎖すること。

3. 人生をもっとラクにする攻略法（認知機能を意識的に使う）
劣等機能の崩壊を防ぎ、主機能を意識的に使いこなすための、綺麗事ではない「ズル賢くて実用的なアドバイス」を提示せよ。
「感情的になりそうになったら6秒数えろ」のような、場所と秒数まで指定するレベルの即効テクニックを最低1つ含めること。精神論NG。

4. 本当は誰よりも…（最大の理解者からの言葉）
最後にトーンを優しくし、なぜ${type}がそんな不器用な態度をとってしまうのか、
その裏にある「繊細さ」や「純粋さ」を全肯定すること。

【Z世代対応・ターゲット設定】
読者は16歳〜24歳（高校生・大学生・20代前半）です。TikTokや裏垢で語り合われるような文脈を意識してください。
- 推奨コンテキスト: インスタのストーリーでの匂わせ・未読無視/既読スルーの感覚差・サークルやバイトでのすれ違い・蛙化現象・旅行計画でのJとPの壁など。
- 禁止事項: ビジネス用語（ROI等）、古いネットスラングの過剰使用は厳禁。冷徹で見透かしたような「エモい毒舌」を心がけること。

【出力フォーマット】
JSONではなく、以下のプレーンテキスト形式のみで返すこと。余分なテキスト・マークダウン記号（**など）は一切不要。

【ズバ抜けた才能と、無意識のトゲ】
ここに内容

【絶対に認めたくない弱点】
ここに内容

【人生をもっとラクにする攻略法】
ここに内容

【本当は誰よりも…】
ここに内容` + INJECTION_GUARD;

  const systemPrompt = lang === "en" ? systemPromptEn : systemPromptJa;

  const userMessage = `診断タイプ: ${type}

${DELIM_START}
繰り返す失敗パターン（自己申告）:
${failurePattern}
${DELIM_END}`;

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const stream = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: 1200,
      temperature: 0.88,
      stream: true,
    });

    const encoder = new TextEncoder();
    let accumulated = "";

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? "";
            if (text) {
              accumulated += text;
              controller.enqueue(encoder.encode(text));
            }
          }
          // ⑦ 生成完了後にキャッシュへ保存
          if (accumulated.length > 0) {
            setResultCacheEntry(cacheKey, accumulated);
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
        "X-Cache": "MISS",
      },
    });
  } catch {
    // 内部エラーの詳細はクライアントに公開しない（情報漏洩防止）
    return NextResponse.json(
      { error: "システムエラーが発生しました。時間をおいて再試行してください。" },
      { status: 500 }
    );
  }
}
