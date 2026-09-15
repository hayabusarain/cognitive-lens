import type { Tuple } from "@/lib/tuple";
import type { Axis, Item, Tiebreaker } from "@/lib/diagnosis/types";

/**
 * 自己診断の設問（仕様書 2-1・2-6、ステップ 2-6）
 *
 * 並び：軸を E/I → S/N → T/F → J/P の順に巡回し、1巡目は前の文字（E・S・T・J）、
 * 2巡目は後の文字（I・N・F・P）を述べる設問を置く。これを3回繰り返す。
 * 画面には軸も文字も出さない。件数・向き・並び・文字数は scripts/check-content.mjs が検査する。
 */
export const ITEMS: Tuple<Item, 24> = [
  { id: "q01", axis: "EI", keyed: "E", text: "知らない人が多い集まりでも、自分から話しかけにいく" },
  { id: "q02", axis: "SN", keyed: "S", text: "説明書は、最初から順番に読みながら手を動かす" },
  { id: "q03", axis: "TF", keyed: "T", text: "友達の相談には、気持ちより先に原因と対策を考える" },
  { id: "q04", axis: "JP", keyed: "J", text: "旅行は、行き先と時間を先に決めておきたい" },
  { id: "q05", axis: "EI", keyed: "I", text: "楽しい集まりのあとでも、一人の時間で回復したくなる" },
  { id: "q06", axis: "SN", keyed: "N", text: "人の話を聞きながら、その先の展開を想像している" },
  { id: "q07", axis: "TF", keyed: "F", text: "正しい指摘でも、言い方がきついと受け入れにくい" },
  { id: "q08", axis: "JP", keyed: "P", text: "休日の予定は、当日の気分で決めたい" },
  { id: "q09", axis: "EI", keyed: "E", text: "考えがまとまっていなくても、話しながら整理するほうだ" },
  { id: "q10", axis: "SN", keyed: "S", text: "旅先では、名所の由来より目の前の景色や味をよく覚えている" },
  { id: "q11", axis: "TF", keyed: "T", text: "話し合いでは、場の空気より理屈が通っているかを優先する" },
  { id: "q12", axis: "JP", keyed: "J", text: "締め切りのある作業は、早めに片付けて安心したい" },
  { id: "q13", axis: "EI", keyed: "I", text: "意見を言う前に、頭の中で一度まとめてから話す" },
  { id: "q14", axis: "SN", keyed: "N", text: "一つの出来事から、関係なさそうな別の話を思いつく" },
  { id: "q15", axis: "TF", keyed: "F", text: "何かを決めるとき、関わる人がどう感じるかを先に考える" },
  { id: "q16", axis: "JP", keyed: "P", text: "締め切りの直前のほうが、集中して進められる" },
  { id: "q17", axis: "EI", keyed: "E", text: "予定のない休日は、誰かを誘って出かけたくなる" },
  { id: "q18", axis: "SN", keyed: "S", text: "新しいやり方より、結果が出ているやり方を選ぶ" },
  { id: "q19", axis: "TF", keyed: "T", text: "迷ったときは、損得や効率を並べて比べたくなる" },
  { id: "q20", axis: "JP", keyed: "J", text: "予定が急に変わると、しばらく落ち着かない" },
  { id: "q21", axis: "EI", keyed: "I", text: "大人数で話すより、少人数でじっくり話すほうが楽だ" },
  { id: "q22", axis: "SN", keyed: "N", text: "細かい手順より、全体で何を目指しているのかが気になる" },
  { id: "q23", axis: "TF", keyed: "F", text: "友達の相談には、解決策より先に気持ちを聞きたい" },
  { id: "q24", axis: "JP", keyed: "P", text: "買い物では、決める前にあれこれ見比べる時間も楽しい" },
];

/** 軸スコアが 0 のときに出す2択（中立なし）。first が前の文字、second が後の文字 */
export const TIEBREAKERS: Record<Axis, Tiebreaker> = {
  EI: { prompt: "疲れた日の終わりに、元気が戻るのはどっち？", first: "誰かと話す", second: "一人で過ごす" },
  SN: { prompt: "新しいことを覚えるとき、入りやすいのはどっち？", first: "具体的な例から", second: "全体の考え方から" },
  TF: { prompt: "友達が落ち込んでいるとき、先に口から出るのはどっち？", first: "どうすればいいかの提案", second: "つらかったねという共感" },
  JP: { prompt: "週末の過ごし方で、落ち着くのはどっち？", first: "予定を決めておく", second: "その日の気分で決める" },
};
