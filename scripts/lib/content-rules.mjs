// コンテンツ検査の共通ルール（仕様書 docs/redesign-spec.md 5-3、decisions N4）

export const LIMITS = {
  sentence: 45, // 1文の文字数
  paragraph: 120, // 1段落の文字数
  sentencesPerParagraph: 3, // 1段落の文の数
  tagline: 24,
  ogCatch: 24,
  question: 45,
  romanceQuestionsMax: 12,
};

/** 文字数（サロゲートペアを1字として数える） */
export const length = (text) => [...text].length;

export const splitParagraphs = (text) => text.split(/\n+/).map((s) => s.trim()).filter(Boolean);

/** 「。」「！」「？」で文に分ける。かぎ括弧の中の句点では分けない */
export function splitSentences(paragraph) {
  const sentences = [];
  let current = "";
  let depth = 0;
  for (const ch of paragraph) {
    current += ch;
    if ("「『（(".includes(ch)) depth++;
    else if ("」』）)".includes(ch)) depth = Math.max(0, depth - 1);
    else if (depth === 0 && "。！？!?".includes(ch)) {
      sentences.push(current.trim());
      current = "";
    }
  }
  if (current.trim()) sentences.push(current.trim());
  return sentences;
}

/** 1段落120字以内かつ3文以内、1文45字以内。違反を配列で返す */
export function checkProse(text) {
  const problems = [];
  for (const paragraph of splitParagraphs(text)) {
    const sentences = splitSentences(paragraph);
    if (length(paragraph) > LIMITS.paragraph) problems.push(`段落が${length(paragraph)}字（上限${LIMITS.paragraph}）：${paragraph.slice(0, 20)}…`);
    if (sentences.length > LIMITS.sentencesPerParagraph) problems.push(`段落が${sentences.length}文（上限${LIMITS.sentencesPerParagraph}）：${paragraph.slice(0, 20)}…`);
    for (const s of sentences) {
      if (length(s) > LIMITS.sentence) problems.push(`文が${length(s)}字（上限${LIMITS.sentence}）：${s.slice(0, 20)}…`);
    }
  }
  return problems;
}

/** オブジェクトの中の文字列を、場所の名前つきで全部取り出す */
export function collectStrings(value, path = "") {
  if (typeof value === "string") return [{ path, value }];
  if (Array.isArray(value)) return value.flatMap((v, i) => collectStrings(v, `${path}[${i}]`));
  if (value && typeof value === "object") return Object.entries(value).flatMap(([k, v]) => collectStrings(v, path ? `${path}.${k}` : k));
  return [];
}

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * 禁止語に当たる語を返す。
 * 英字の語は大文字小文字を問わず単語として、1字の漢字（「神」など）は熟語の一部でないときだけ、ほかは部分一致で数える。
 */
export function findBannedTerms(text, terms) {
  const hits = [];
  for (const term of terms) {
    let re;
    if (/^[A-Za-z][A-Za-z ]*$/.test(term)) re = new RegExp(`\\b${escapeRegExp(term)}\\b`, "i");
    else if (/^\p{Script=Han}$/u.test(term)) re = new RegExp(`(?<!\\p{Script=Han})${escapeRegExp(term)}(?!\\p{Script=Han})`, "u");
    else re = new RegExp(escapeRegExp(term));
    if (re.test(text)) hits.push(term);
  }
  // 16Personalities の「INTJ-A」「INTJ-T」の表記
  if (/\b[EI][SN][TF][JP]-[AT]\b/.test(text)) hits.push("-A・-T の表記");
  return hits;
}
