import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { sanitizeUserText, sanitizeMbtiType, INJECTION_GUARD } from "@/lib/sanitize";
import { isBotUserAgent, BOT_FORBIDDEN_RESPONSE } from "@/lib/bot-guard";
import {
  translateCacheKey,
  getTranslateCacheEntry,
  setTranslateCacheEntry,
} from "@/lib/result-cache";

export async function POST(req: NextRequest) {
  // ① Bot遮断（多層防御）
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
  const rawMessage = typeof body.message === "string" ? body.message : "";

  // ② サニタイズ
  const message = sanitizeUserText(rawMessage, 500);
  const senderType = sanitizeMbtiType(body.senderType);
  const receiverType = sanitizeMbtiType(body.receiverType);

  if (!message || message.length < 2) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // ③ キャッシュヒット確認（同一メッセージ + タイプ組み合わせ → 再利用）
  const cacheKey = translateCacheKey(message, senderType, receiverType);
  const cached = getTranslateCacheEntry(cacheKey);

  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      return NextResponse.json(parsed, {
        headers: { "X-Cache": "HIT" },
      });
    } catch {
      // キャッシュが壊れていたら素通りして再生成
    }
  }

  const typeContext =
    senderType && receiverType
      ? `送信者タイプ: ${senderType} → 受信者タイプ: ${receiverType}`
      : senderType
      ? `送信者タイプ: ${senderType}（受信者不明）`
      : receiverType
      ? `受信者タイプ: ${receiverType}（送信者不明）`
      : "タイプ情報なし";

  const systemPrompt = `あなたは、人の言葉の裏に隠れた本音を読み解く「感情の通訳者」です。
高校生〜大学生が即共感できる、平易でエモーショナルな言葉で分析してください。

【分析の視点】
人間は感情が高ぶると、本当に言いたいことと逆の言葉を選ぶ。
「別にいいよ」は全然よくない。「忙しい？」は寂しいから会いたい。「そういうとこだよ」は傷ついてる。
そのメッセージが生まれた「内側の切実な気持ち」を、批判なく、でも正直に言語化すること。
専門用語や分析っぽい言葉は一切使わないこと。

【Z世代対応・ターゲット設定】
読者は16歳〜24歳（高校生・大学生・20代前半）です。TikTokや裏垢で語り合われるような文脈を意識してください。
- 推奨コンテキスト: インスタのストーリーでの匂わせ・未読無視/既読スルーの感覚差・サークルやバイトでのすれ違い・蛙化現象・旅行計画でのJとPの壁など。
- 禁止事項: ビジネス用語（ROI等）、古いネットスラングの過剰使用は厳禁。冷徹で見透かしたような「エモい毒舌」を心がけること。

以下の3つをJSON形式で返してください。

{
  "trueRequest": "【本当に欲しかったもの】その言葉の奥にある、相手が本当に求めていた安心感や気持ちを、詳細に言語化する。入力されたメッセージの重さや背景に応じて文章量を変え、しっかりと深掘りして解説すること（目安：150〜250文字程度）。「〜って言ってるけど、本当は〜」という文脈を含める。",
  "mineWords": "【やってはいけない返し方】受け取った側がついやりがちな「地雷返し」を具体的に挙げ、なぜそれが逆効果かを分かりやすく説明する。相手の認知機能や性質を踏まえ、どうすれ違うのかを丁寧に解説すること（目安：150〜250文字程度）。",
  "optimalReply": "【魔法の言葉】相手の心がほっと緩む、実際に使える返し方を提示する。「あなたのことを見てる、ちゃんと分かってる、ここにいる」という気持ちが自然に伝わる言葉にすること。タメ口で、句読点少なめで、絵文字なしの自然体。そのままLINEにコピペして送れる文体で。"
}

必ず有効なJSONのみを返すこと。余分なテキストは不要。日本語で記述。` + INJECTION_GUARD;

  const userMessage = `${typeContext}\n\n解読するメッセージ:\n「${message}」`;

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: 600,
      temperature: 0.85,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);

    const result = {
      trueRequest: parsed.trueRequest ?? "",
      mineWords: parsed.mineWords ?? "",
      optimalReply: parsed.optimalReply ?? "",
    };

    // ④ キャッシュに保存（1時間TTL）
    setTranslateCacheEntry(cacheKey, JSON.stringify(result));

    return NextResponse.json(result, {
      headers: { "X-Cache": "MISS" },
    });
  } catch {
    return NextResponse.json(
      { error: "システムエラーが発生しました。時間をおいて再試行してください。" },
      { status: 500 }
    );
  }
}
