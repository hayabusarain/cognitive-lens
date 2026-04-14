import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// .env.local を手動で読む
const __dirname = dirname(fileURLToPath(import.meta.url));
const envText = readFileSync(resolve(__dirname, ".env.local"), "utf-8");
const env = Object.fromEntries(
  envText.split("\n")
    .filter(l => l.includes("="))
    .map(l => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const SUPABASE_URL = env["NEXT_PUBLIC_SUPABASE_URL"];
const SUPABASE_KEY = env["SUPABASE_SERVICE_ROLE_KEY"] || env["NEXT_PUBLIC_SUPABASE_ANON_KEY"];

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("環境変数が取得できません");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── 元データ ──────────────────────────────────────────────────
// カテゴリ: 短期 / 長期 / 教育 / NGワード
// 文体規則:
//   - ネットスラング禁止
//   - ライフコーチ的な説教禁止（「〜すべき」形式は使わない）
//   - 弱点への冷徹な指摘と、才能・苦悩への深い理解を両立させる
const RAW = [
  // ── INTJ ────────────────────────────────────────────────
  {
    target_type: "INTJ", category: "短期",
    content: "行動の前にモデルを完成させようとする傾向がある。今日という単位で見れば、未完成の設計図を動かすことが、完成した設計図を動かさないことより常に価値がある。",
  },
  {
    target_type: "INTJ", category: "長期",
    content: "知的卓越性への強いこだわりが、知覚の盲点になることがある。自分より鋭い視点を持つ人間は、見た目や地位とは無関係に存在する。その人物を見落とし続けた代償は、いつか戦略の失敗として現れる。",
  },
  {
    target_type: "INTJ", category: "学習最適化",
    content: "精読と再構成の組み合わせが最も適している。一冊を自分の言語で再記述する作業が、理解の深さを最大化する。動画の受動的な消費は、このタイプの思考回路には著しく不向きな形式である。",
  },
  { target_type: "INTJ", category: "NGワード", content: "もっと協調性を持って" },

  // ── INTP ────────────────────────────────────────────────
  {
    target_type: "INTP", category: "短期",
    content: "思考が再帰的なループに入っている場合、外部への出力が唯一の打開策になる。5分間の粗削りなアウトプットは、3時間の精緻な内省より有益である。",
  },
  {
    target_type: "INTP", category: "長期",
    content: "探求それ自体が目的化する傾向は、このタイプの最大の才能であり最大の停滞要因でもある。完成物を持つことで見える景色がある。未完成であっても、公開という行為が次の思考を解放する。",
  },
  {
    target_type: "INTP", category: "学習最適化",
    content: "一次資料の精読と、他者への説明を学習サイクルに組み込むことが効果的。理解したことを声に出すだけで、記憶の定着率が大きく変わる。",
  },
  { target_type: "INTP", category: "NGワード", content: "考えすぎだよ" },

  // ── ENTJ ────────────────────────────────────────────────
  {
    target_type: "ENTJ", category: "短期",
    content: "委任できるタスクをひとつ特定し、実際に委任する。その分のリソースを、最高レベルの判断が必要な問題に集中させる。",
  },
  {
    target_type: "ENTJ", category: "長期",
    content: "推進力と明晰さは群を抜いているが、その速度についてこれない人間を「能力不足」と分類する傾向が摩擦の根源になる。人心の獲得は戦術の問題であり、感情に対する鈍感さはいずれ組織の天井として跳ね返る。",
  },
  {
    target_type: "ENTJ", category: "学習最適化",
    content: "実践からの学習が主要経路。ただし、隣接領域への定期的な越境がなければ、戦略的視野は確実に狭化する。",
  },
  { target_type: "ENTJ", category: "NGワード", content: "それって意味あるの？" },

  // ── ENTP ────────────────────────────────────────────────
  {
    target_type: "ENTP", category: "短期",
    content: "新規着手の衝動を一時停止し、最後に開始した未完了のものだけに今日の時間を使う。停滞感は飽きではなく、完了への抵抗から生まれていることが多い。",
  },
  {
    target_type: "ENTP", category: "長期",
    content: "構想の生成速度と実装の完走率に致命的な差がある。議論で相手を圧倒することより、一つのものを完成させることの方が、長期的には圧倒的に強い。",
  },
  {
    target_type: "ENTP", category: "学習最適化",
    content: "他者への教授を前提とした学習が最も効果的。先に勉強会の日程を設定してしまうことで、学習の密度が劇的に上がる。",
  },
  { target_type: "ENTP", category: "NGワード", content: "前回も同じことを言っていた" },

  // ── INFJ ────────────────────────────────────────────────
  {
    target_type: "INFJ", category: "短期",
    content: "他者の感情的負荷を引き受けることを一日だけ意識的に保留する。自分の感覚を回復させることは、他者への関与品質を直接高める。",
  },
  {
    target_type: "INFJ", category: "長期",
    content: "深い洞察力を言語化せずに抱え込む傾向は、もったいない沈黙である。見えているものを外に出さなければ、それはないものと等しい。発信という行為は、思考の質を下げない。",
  },
  {
    target_type: "INFJ", category: "学習最適化",
    content: "没入型の集中学習に最も適している。ただし、読む・考えるだけで完結させる傾向があるため、書く・話す工程を意識的に後半に組み込む必要がある。",
  },
  { target_type: "INFJ", category: "NGワード", content: "気にしすぎだよ" },

  // ── INFP ────────────────────────────────────────────────
  {
    target_type: "INFP", category: "短期",
    content: "着手のハードルを下げることが唯一の解。15分のタイマーをセットし、品質を問わず開始することだけを目標にする。",
  },
  {
    target_type: "INFP", category: "長期",
    content: "豊かな感受性は希少な才能であるが、「自己の探求」は目標ではなく過程であることを理解する必要がある。現在の自分の状態でアウトプットを繰り返すことが、探求の深化に直結する。",
  },
  {
    target_type: "INFP", category: "学習最適化",
    content: "学習行動は「なぜそれを学ぶのか」という意味付けに強く依存する。個人的な文脈と接続されていない知識は、定着率が著しく低い。",
  },
  { target_type: "INFP", category: "NGワード", content: "普通はそうじゃない" },

  // ── ENFJ ────────────────────────────────────────────────
  {
    target_type: "ENFJ", category: "短期",
    content: "今日の予定に、他者のニーズに起因しないことを一つ入れる。意識的にそうしなければ、自発的なものは一つも入らない可能性が高い。",
  },
  {
    target_type: "ENFJ", category: "長期",
    content: "他者を支援する能力は本物だが、それが自己犠牲を前提としている場合、持続可能性がない。断ることは拒絶ではなく、関係の誠実な管理である。",
  },
  {
    target_type: "ENFJ", category: "学習最適化",
    content: "他者とともに学ぶ環境で能力が最大化する。ただし、教える側に回ることへの傾倒には注意が必要で、学ぶ側としての謙虚さも保つ必要がある。",
  },
  { target_type: "ENFJ", category: "NGワード", content: "いい人ぶってるだけでしょ" },

  // ── ENFP ────────────────────────────────────────────────
  {
    target_type: "ENFP", category: "短期",
    content: "新しいアイデアへの着手を今日は保留する。昨日開始したものを、わずかでも前進させることだけを今日の達成とする。",
  },
  {
    target_type: "ENFP", category: "長期",
    content: "着火点での熱量は誰よりも高いが、熱が冷めた後の継続が構造的に弱い。一つのことを最後まで完走した経験の積み重ねが、このタイプにとって最も希少で最も価値ある資産になる。",
  },
  {
    target_type: "ENFP", category: "学習最適化",
    content: "他者との共同学習と、即時の成果確認が学習効率を高める。孤独な反復学習には著しく不向きな構造を持っている。",
  },
  { target_type: "ENFP", category: "NGワード", content: "飽き性だよね" },

  // ── ISTJ ────────────────────────────────────────────────
  {
    target_type: "ISTJ", category: "短期",
    content: "完成度70%でのリリースを意識的に実践する。残りは運用の中で改善できる。完璧化は本質的に終わらない工程である。",
  },
  {
    target_type: "ISTJ", category: "長期",
    content: "実績の積み上げによる信頼構築は真の強みだが、「前例がない」を理由とした不作為は、長期的には組織の硬直として現れる。変化への適応は筋力と同じく、意識的な負荷なしには発達しない。",
  },
  {
    target_type: "ISTJ", category: "学習最適化",
    content: "体系的な手順の反復が最も高い定着率をもたらす。ただし、習熟後も基礎段階に留まろうとする傾向があるため、意識的に応用・実践フェーズへ移行する必要がある。",
  },
  { target_type: "ISTJ", category: "NGワード", content: "もう少し柔軟になれないの？" },

  // ── ISFJ ────────────────────────────────────────────────
  {
    target_type: "ISFJ", category: "短期",
    content: "今日の意思決定を一つ、他者への影響を考慮せず自分の好みだけで行う。その規模は問わない。",
  },
  {
    target_type: "ISFJ", category: "長期",
    content: "他者への深い配慮と記憶力の精度は本質的な強みだが、自分の欲求を後回しにし続ける習慣は、蓄積されたのちに慢性的な消耗として現れる。「自分はどうしたいか」という問いは、わがままではなく自己認識の基本である。",
  },
  {
    target_type: "ISFJ", category: "学習最適化",
    content: "静かな単独作業での習得効率が高い。ただし、習得状況を定期的に外部化する仕組みがないと、孤独な停滞に陥りやすい。",
  },
  { target_type: "ISFJ", category: "NGワード", content: "もっと自分の意見を言いなよ" },

  // ── ESTJ ────────────────────────────────────────────────
  {
    target_type: "ESTJ", category: "短期",
    content: "効率化の対象から意図的に外す時間を今日10分作る。非効率に見える時間が、対人的な信頼の基盤になっていることがある。",
  },
  {
    target_type: "ESTJ", category: "長期",
    content: "実行力と構造化能力は高水準にあるが、「正しさ」を根拠に他者に圧力をかけることは、長期的に情報の流通を阻害する。感情を論理の障害物として扱う認知パターンは、マネジメントの上限を決定する。",
  },
  {
    target_type: "ESTJ", category: "学習最適化",
    content: "目標と行程を明確化した状態での学習が最も適している。「なぜ学ぶか」という問いへの回答が曖昧なままだと、習得は作業化し、動機が失われる。",
  },
  { target_type: "ESTJ", category: "NGワード", content: "頭が固いですね" },

  // ── ESFJ ────────────────────────────────────────────────
  {
    target_type: "ESFJ", category: "短期",
    content: "今日の行動のうち、一つだけ他者の評価を完全に無視して決定する。",
  },
  {
    target_type: "ESFJ", category: "長期",
    content: "対人関係の温度感を精密に読む能力は希少だが、全員に好意的に評価されることへの強い動機付けは、重要な局面での決断を鈍らせる。必要な対立を回避し続けることのコストは、長い時間軸でのみ可視化される。",
  },
  {
    target_type: "ESFJ", category: "学習最適化",
    content: "仲間との目標共有が継続率を大きく高める。ただし、学習環境を社交的な場として扱ってしまうリスクがあるため、習得目標を明確に設定することが必要。",
  },
  { target_type: "ESFJ", category: "NGワード", content: "八方美人だよね" },

  // ── ISTP ────────────────────────────────────────────────
  {
    target_type: "ISTP", category: "短期",
    content: "分析に費やす時間を削り、対象に直接触れることを優先する。構造の理解は、操作の中からしか生まれない。",
  },
  {
    target_type: "ISTP", category: "長期",
    content: "技術的な問題解決能力と実装力は本物だが、「言語化の省略」によって他者との連携を断絶するのは、能力の無駄遣いに近い。自分の知識を体系的に伝える練習は、能力の射程を大幅に拡大する。",
  },
  {
    target_type: "ISTP", category: "学習最適化",
    content: "直接的な操作と分解・再構成が最も効率的な習得経路。理論は最小限にとどめ、実物への接触時間を最大化することが原則。",
  },
  { target_type: "ISTP", category: "NGワード", content: "もう少し丁寧に説明してほしい" },

  // ── ISFP ────────────────────────────────────────────────
  {
    target_type: "ISFP", category: "短期",
    content: "今日は成果を求めない。感覚的に引かれるものに対して時間を使うだけで、十分な前進になる。",
  },
  {
    target_type: "ISFP", category: "長期",
    content: "感性の解像度は他のタイプが模倣できないレベルにあるが、それを外部に開放することへの抵抗が、最も大きな制約になっている。一人に見せるだけで十分。表現とは完成物ではなく、対話の開始点である。",
  },
  {
    target_type: "ISFP", category: "学習最適化",
    content: "体験と模倣からの学習が最も自然な経路。理論からではなく、具体的な対象への接触から始めることで、理解が有機的に展開する。",
  },
  { target_type: "ISFP", category: "NGワード", content: "もっと積極的になりなよ" },

  // ── ESTP ────────────────────────────────────────────────
  {
    target_type: "ESTP", category: "短期",
    content: "判断の精度より、フィードバックを得るための速度が、このタイプにとっては常に優先事項である。今すぐ動く。",
  },
  {
    target_type: "ESTP", category: "長期",
    content: "即応力と現実認識の速度は真の強みだが、長期スパンでの目標設定に対する構造的な不得意がある。半年後の状態を明文化し、目に入る場所に置くことは、単純だが有効な対抗手段になる。",
  },
  {
    target_type: "ESTP", category: "学習最適化",
    content: "実行→失敗→修正のサイクルが最速の学習経路。座学から入ることは、このタイプにとって効率が最も低い学習形態である。",
  },
  { target_type: "ESTP", category: "NGワード", content: "計画性がないよね" },

  // ── ESFP ────────────────────────────────────────────────
  {
    target_type: "ESFP", category: "短期",
    content: "今感じている停滞感は、孤立した状態から生まれていることが多い。信頼できる人間と時間を共有することが、最も直接的な回復手段になる。",
  },
  {
    target_type: "ESFP", category: "長期",
    content: "場の空気を変える能力は真の才能だが、「楽しさ」を主要な意思決定基準として使い続けると、重要な選択において一貫性を失う。地道な積み上げに耐える期間を意識的に設けることが、このタイプの能力に持続性を与える。",
  },
  {
    target_type: "ESFP", category: "学習最適化",
    content: "競争・報酬・仲間という三要素が学習モチベーションを支える。一人での反復学習はこのタイプには構造的に不向きであり、環境設計が習得の鍵になる。",
  },
  { target_type: "ESFP", category: "NGワード", content: "もう少し真剣に考えなよ" },
];

// ── カテゴリ変換 & ng_words整理 ──────────────────────────────
const CATEGORY_MAP = { "短期": "短期", "長期": "長期", "学習最適化": "教育" };

const ngWordsByType = {};
for (const row of RAW) {
  if (row.category === "NGワード") {
    if (!ngWordsByType[row.target_type]) ngWordsByType[row.target_type] = [];
    ngWordsByType[row.target_type].push(row.content);
  }
}

const records = RAW
  .filter(r => r.category !== "NGワード")
  .map(r => ({
    target_type: r.target_type,
    category: CATEGORY_MAP[r.category],
    content: r.content,
    ng_words: r.category === "短期" ? (ngWordsByType[r.target_type] ?? []) : [],
  }));

// ── メイン処理 ───────────────────────────────────────────────
async function main() {
  console.log(`生成レコード数: ${records.length} 件`);
  console.log("既存データを削除中...");
  const { error: delErr } = await supabase
    .from("protocols")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (delErr) {
    console.error("削除エラー:", delErr.message);
    process.exit(1);
  }
  console.log("削除完了。新規データをインサート中...");

  const { data, error: insErr } = await supabase
    .from("protocols")
    .insert(records)
    .select("id");
  if (insErr) {
    console.error("インサートエラー:", insErr.message);
    process.exit(1);
  }
  console.log(`インサート成功: ${data.length} 件`);

  // 内訳を表示
  const types = [...new Set(records.map(r => r.target_type))];
  console.log(`対象タイプ: ${types.join(", ")}`);
}

main();
