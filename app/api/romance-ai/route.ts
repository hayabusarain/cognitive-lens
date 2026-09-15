/**
 * 脈あり度チェックの AI 文（仕様書 2-4、ステップ 2-8）
 *
 * 入力：POST { type: TypeCode, answers: boolean[] }
 *   answers は lib/romance/items.ts の ROMANCE[type].questions と同じ順・同じ数の「はい（true）／いいえ（false）」。
 * 出力：{ feelings, nextAction, caution }（どれも日本語の文）
 *
 * 利用者の自由文は受け取らない。プロンプトに入るのは、サーバーにある設問文と、サーバーで計算した脈あり度だけにする。
 * 以前は「はい」と答えた設問文を利用者から受け取っていて、任意の文を AI への指示に混ぜられた（プロンプトインジェクション）。
 */
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { isBotUserAgent, BOT_FORBIDDEN_RESPONSE } from "@/lib/bot-guard";
import { getClientIp } from "@/lib/get-client-ip";
import { isTypeCode } from "@/lib/type-codes";
import { TYPE_NAMES } from "@/lib/type-names";
import { ROMANCE, ROMANCE_STAGES, romanceScore, stageIndex } from "@/lib/romance/items";

// ── ルート内のレートリミット（IP ごとに10分5回）。proxy.ts の1分10回とは別に数える ──
const ipRateLimitMap = new Map<string, { count: number; expiresAt: number }>();
const MAX_REQUESTS = 5;
const WINDOW_MS = 10 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  if (process.env.NODE_ENV === "development") return true;
  const now = Date.now();
  const record = ipRateLimitMap.get(ip);
  if (!record || record.expiresAt < now) {
    ipRateLimitMap.set(ip, { count: 1, expiresAt: now + WINDOW_MS });
    return true;
  }
  if (record.count >= MAX_REQUESTS) return false;
  record.count++;
  return true;
}

const SYSTEM_PROMPT = `あなたは、16タイプの性格傾向に詳しい恋愛相談の書き手です。
利用者は、気になる相手のタイプと、相手に当てはまった行動（「はい」と答えた設問）を送ってきます。
その行動から読み取れる相手の気持ちと、利用者が次にできることを書いてください。

【書き方】
- 読者は16〜24歳。利用者本人に向けて、です・ます調を基本にし、体言止めを少し混ぜる
- 相手は、送られてきたタイプの呼称（例：スフィンクス）で呼ぶ。「MBTI」という語と、心理機能の略語（Ni、Te など）は書かない
- 1文は45字以内。同じ語尾を2文続けない。「つまり」「そのため」でつながない
- 「かもしれません」「可能性があります」「〜ようです」でぼかさない。行動から言えることは言い切り、言えないことは書かない
- 「共通の趣味を見つける」「感謝を伝える」のような、どのタイプにも言える一般論を書かない。報告された行動のどれかを具体的に取り上げ、そのタイプらしい理由と結びつける
- 流行語・若者言葉（ヤバい、エモい、沼る、蛙化など）、誇張語（最強、天才、神、完璧）、ネットスラングは使わない
- 脈あり度は目安として扱い、「絶対に脈あり」「確実に両思い」のように断定しない。告白を急かしたり、不安を煽ったりしない
- 相手の SNS や居場所を調べる、わざと嫉妬させる、気持ちを試すなど、相手を監視・操作する行動は勧めない
- 性別や、学生か社会人かを決めつけない。「彼」「彼女」と書かず、呼称で呼ぶ

【書き方の見本】（相手がケルベロスで、「あなたと会う時間に、毎回少し早めに着いて待っている」「忙しい時期でも、あなたとの約束の日はずらさない」が当てはまった場合）
{
  "feelings": "ケルベロスにとって、約束を守るのは信頼の表し方そのもの。忙しい時期にも予定をずらさないのは、あなたとの時間を優先順位の上に置いている証拠です。",
  "nextAction": "次は、あなたから日時と場所まで決めて誘ってみてください。段取りが見える誘いは、ケルベロスが一番乗りやすい形。",
  "caution": "当日の思いつきで予定を変えるのは控えたいところ。守ってきた約束を軽く扱われたと受け取られます。"
}

以下の3つを JSON で返してください。ほかの文字は出力しないこと。
{
  "feelings": "相手が抱いていそうな気持ち。報告された行動の具体的な中身に触れる（2〜3文、100字以内）",
  "nextAction": "利用者が次にできる、具体的で無理のない行動を1つ（2〜3文、100字以内）",
  "caution": "今の段階で避けたい行動を1つと、その理由（1〜2文、80字以内）"
}`;

const FALLBACK = "分析できませんでした。";
const badRequest = () => NextResponse.json({ error: "無効なリクエストです。" }, { status: 400 });

export async function POST(req: NextRequest) {
  // ① Bot 遮断
  if (isBotUserAgent(req.headers.get("user-agent"))) {
    return new NextResponse(BOT_FORBIDDEN_RESPONSE, {
      status: 403,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  // ② IP ごとのレートリミット（Vercel が上書きするヘッダーだけを信用する。lib/get-client-ip.ts）
  if (!checkRateLimit(getClientIp(req.headers))) {
    return NextResponse.json(
      { error: "リクエストの上限に達しました。しばらく時間をおいて再度お試しください。" },
      { status: 429 },
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "システムエラーが発生しました。時間をおいて再試行してください。" }, { status: 503 });
  }

  // ③ 入力の検証
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest();
  }
  const { type, answers } = (body ?? {}) as { type?: unknown; answers?: unknown };
  if (typeof type !== "string" || !isTypeCode(type)) return badRequest();
  const questions = ROMANCE[type].questions;
  if (!Array.isArray(answers) || answers.length !== questions.length || !answers.every((a) => typeof a === "boolean")) {
    return badRequest();
  }
  const yesQuestions = questions.filter((_, i) => answers[i]);
  // 「はい」が0件なら読み取れる行動がないので、AI を呼ばない。画面側は段階の説明だけを出す
  if (yesQuestions.length === 0) return badRequest();

  const score = romanceScore(yesQuestions.length, questions.length);
  const stage = ROMANCE_STAGES[stageIndex(score)];
  const userMessage = [
    `相手のタイプ：${type}（${TYPE_NAMES[type]}）`,
    `脈あり度：${score}%（段階「${stage.title}」）`,
    "",
    "相手に当てはまった行動：",
    ...yesQuestions.map((q) => `・${q}`),
  ].join("\n");

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      max_tokens: 600,
      temperature: 0.7,
      response_format: { type: "json_object" },
    });
    const parsed = JSON.parse(completion.choices[0]?.message?.content ?? "{}");
    const text = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : FALLBACK);
    return NextResponse.json({
      feelings: text(parsed.feelings),
      nextAction: text(parsed.nextAction),
      caution: text(parsed.caution),
    });
  } catch (error) {
    console.error("Romance AI Error:", error);
    return NextResponse.json({ error: "AIの分析中にエラーが発生しました。" }, { status: 500 });
  }
}
