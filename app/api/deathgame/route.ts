import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { sanitizeMbtiType, INJECTION_GUARD } from "@/lib/sanitize";
import { isBotUserAgent, BOT_FORBIDDEN_RESPONSE } from "@/lib/bot-guard";
import { deathgameCacheKey, getDeathgameCacheEntry, setDeathgameCacheEntry } from "@/lib/result-cache";

const ALL_TYPES = new Set([
  "INTJ","INTP","ENTJ","ENTP",
  "INFJ","INFP","ENFJ","ENFP",
  "ISTJ","ISFJ","ESTJ","ESFJ",
  "ISTP","ISFP","ESTP","ESFP",
]);

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
  const type1 = sanitizeMbtiType(body.type1);
  const type2 = sanitizeMbtiType(body.type2);
  
  // 性別パラメータの取得とデフォルト文字制限
  const userGender = String(body.userGender ?? "その他/指定しない").slice(0, 15);
  const targetGender = String(body.targetGender ?? "その他/指定しない").slice(0, 15);
  const lang = body.lang === "en" ? "en" : "ja";

  if (!type1 || !type2 || !ALL_TYPES.has(type1) || !ALL_TYPES.has(type2)) {
    return NextResponse.json({ error: "Invalid MBTI type" }, { status: 400 });
  }

  const cacheKey = deathgameCacheKey(type1, type2, userGender, targetGender) + `_lang_${lang}`;
  const cached = getDeathgameCacheEntry(cacheKey);

  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      return NextResponse.json(parsed, {
        headers: {
          "Cache-Control": "no-cache",
          "X-Cache": "HIT"
        }
      });
    } catch (e) {
      // キャッシュパース失敗時はフォールバックして再生成
    }
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const promptJa = `あなたは恋愛心理学とMBTI認知機能の専門家であり、一流のシナリオライターです。

${type1}と${type2}が恋人同士として付き合い始めてから「完全に関係が崩壊する」までの時系列ストーリーを生成してください。

【フォーマット】
5段階の時系列で、それぞれの段階に「フェーズ名」「経過期間」「何が起きたか」「二人の内心のモノローグ（それぞれ1文ずつ）」を含めること。

【絶対ルール】
1. 認知機能の構造的な不一致が、最初は魅力に見えるが徐々に致命傷になっていく過程を描くこと
2. どちらも悪人ではない。ただ「愛し方」が根本的に違うだけ
3. 最終フェーズは必ず「静かな破局」で終わること（怒鳴り合いではなく、諦めの沈黙）
4. リアルで切ない、小説のような文体で書くこと。分析的・説明口調は禁止
5. 各フェーズの描写は80字以内で簡潔に

【Z世代対応・ターゲット設定】
読者は16歳〜24歳（高校生・大学生・20代前半）です。TikTokや裏垢で語り合われるような文脈を意識してください。
- 推奨コンテキスト: インスタのストーリーでの匂わせ・未読無視/既読スルーの感覚差・サークルやバイトでのすれ違い・蛙化現象・旅行計画でのJとPの壁など。
- 破局描写の具体例: LINEの返信頻度の変化、インスタのフォロー外し、共通の友達を巻き込んだ気まずさ、一緒に撮った写真を消すかどうかの葛藤など、日常の些細な崩壊の描写を盛り込むこと。
- 禁止事項: ビジネス用語（ROI等）、古いネットスラングの過剰使用は厳禁。冷徹で見透かしたような「エモい毒舌」を心がけること。

以下のJSONのみを返すこと:
{
  "phases": [
    {
      "name": "フェーズ名",
      "period": "〜1ヶ月",
      "event": "何が起きたかの描写",
      "inner1": "${type1}の内心の声",
      "inner2": "${type2}の内心の声"
    }
  ],
  "epitaph": "この関係を一文で表す墓碑銘（切なく、印象的に）"
}

【重要制約】ユーザーの性別は『${userGender}』、ターゲット（相手）の性別は『${targetGender}』です。
テキスト内の代名詞、一人称、三人称、および2人の関係性の描写をこの性別設定に完全に適合させてください。
『その他/指定しない』の場合はジェンダーニュートラルな表現を使用すること。` + INJECTION_GUARD;

  const promptEn = `You are an expert in romance psychology, MBTI cognitive functions, and a top-tier scenario writer.

Generate a chronological story of how ${type1} and ${type2} start dating and eventually "completely destroy their relationship".

【Format】
Provide a 5-stage timeline. Each stage must include: Phase Name, Time Period, What Happened, and Internal Monologue for both (1 sentence each).

【Strict Rules】
1. Depict how their cognitive function mismatch initially looks attractive but slowly becomes a fatal wound.
2. Neither is a villain. They just have fundamentally different ways of loving.
3. The final phase MUST end in a "quiet breakup" (silent resignation, not a screaming match).
4. Write in a realistic, heartbreaking, novel-like tone. NO analytical or textbook explanations.
5. Keep the description for each phase under 200 characters.
6. The entire output MUST be in English.

【Gen Z Target & Slang】
Target audience: 16-24 years old. Use modern Gen Z English dating slang (e.g., leaving on read, soft launching on IG story, catching the ick, situationship, ghosting).
- Contexts: Different texting speeds, differences in planning trips (J vs P), social battery limits.
- Breakup imagery: Muting IG stories, awkward tension with mutual friends, untagging photos.

Return ONLY the following JSON:
{
  "phases": [
    {
      "name": "Phase Name",
      "period": "~ 1 Month",
      "event": "Description of what happened",
      "inner1": "${type1}'s internal thought",
      "inner2": "${type2}'s internal thought"
    }
  ],
  "epitaph": "A one-sentence heartbreaking epitaph that summarizes the relationship."
}

【Important】User's gender is '${userGender}', target partner's gender is '${targetGender}'. Use pronouns and relationship dynamics that perfectly fit this. If "Unspecified", use gender-neutral they/them.` + INJECTION_GUARD;

  const prompt = lang === "en" ? promptEn : promptJa;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1200,
      temperature: 0.92,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);

    const resultPayload = {
      phases: parsed.phases ?? [],
      epitaph: parsed.epitaph ?? "",
      type1,
      type2,
    };

    setDeathgameCacheEntry(cacheKey, JSON.stringify(resultPayload));

    return NextResponse.json(resultPayload, {
      headers: {
        "Cache-Control": "no-cache",
        "X-Cache": "MISS"
      }
    });
  } catch {
    return NextResponse.json(
      { error: "シミュレーションに失敗しました。" },
      { status: 500 }
    );
  }
}
