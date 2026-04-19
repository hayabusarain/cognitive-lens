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
    content: "完璧なプランができるまで動かない癖、今日で終わりにしよう。ぶっちゃけ『未完成のままとりあえず走らせる』方が、完成したプランを温存するより100倍価値がある。",
  },
  {
    target_type: "INTJ", category: "長期",
    content: "『自分より頭のいいヤツは少ない』って無意識で見下してない？見た目やステータスで他人をナメてると、いつか思わぬところでマジで足元すくわれるから注意。",
  },
  {
    target_type: "INTJ", category: "学習最適化",
    content: "情報をそのまま受け取るんじゃなくて、自分の言葉で『要するにこういうこと』って嚙み砕くのが最強のチート技。ダラダラ動画見るのはマジでコスパ悪い。",
  },
  { target_type: "INTJ", category: "NGワード", content: "もっと協調性を持って" },

  // ── INTP ────────────────────────────────────────────────
  {
    target_type: "INTP", category: "短期",
    content: "頭の中でずっとダラダラ考え事ループしてない？一旦ストップ。5分でいいから適当に外に吐き出そう。3時間悩むより、テキトーでも形にする方が全然マシ。",
  },
  {
    target_type: "INTP", category: "長期",
    content: "『調べてる時間』が一番楽しいのはわかるけど、一生完成しないのはさすがにヤバい。不完全でも世に出してみるだけで、頭のモヤモヤが一気に晴れるよ。",
  },
  {
    target_type: "INTP", category: "学習最適化",
    content: "誰かに教えるつもりで理解するのが一番スッと入る。なんとなく目で追うだけじゃなくて、『つまりこれって〜』って声に出すだけで記憶にガッツリ定着する。",
  },
  { target_type: "INTP", category: "NGワード", content: "考えすぎだよ" },

  // ── ENTJ ────────────────────────────────────────────────
  {
    target_type: "ENTJ", category: "短期",
    content: "全部自分でやろうとすな。他人に任せられるタスクを一つ見つけて速攻で振る。空いた時間で、自分にしかできない一番大事な決断にフルコミットして。",
  },
  {
    target_type: "ENTJ", category: "長期",
    content: "推進力バツグンだけど、ついてこれない人を『使えない』って切り捨てまくると後で誰もいなくなる。人の感情を無視し続けると、いつか自分の首を絞めるよ。",
  },
  {
    target_type: "ENTJ", category: "学習最適化",
    content: "とにかく実戦から学ぶのが最強のタイプ。ただ、たまには自分の専門外のジャンルもつまみ食いしないと、視野が狭くなってワンパターンになるから注意。",
  },
  { target_type: "ENTJ", category: "NGワード", content: "それって意味あるの？" },

  // ── ENTP ────────────────────────────────────────────────
  {
    target_type: "ENTP", category: "短期",
    content: "新しいことに手を出したくなる衝動を一回抑えて。昨日やりっぱなしにしたアレをまずは終わらせること。飽きたんじゃなくて、終わらせるのが面倒なだけ。",
  },
  {
    target_type: "ENTP", category: "長期",
    content: "口だけは達者でアイデアも無限に出るけど、やり切る力が壊滅的。論破して気持ちよくなるより、クソゲーでも一つのことを完走した経験の方が、人生の武器になる。",
  },
  {
    target_type: "ENTP", category: "学習最適化",
    content: "人に教えることを前提にインプットするのが一番伸びる。『来週プレゼンするわ』って先に予定を組んじゃうことで、自分を追い込むのがベストなハック。",
  },
  { target_type: "ENTP", category: "NGワード", content: "前回も同じことを言っていた" },

  // ── INFJ ────────────────────────────────────────────────
  {
    target_type: "INFJ", category: "短期",
    content: "他人の顔色や感情のゴミを拾いすぎ。今日一日だけ、わざと他人の機嫌をスルーして自分のためだけに息を吸ってみて。自己ギュッとする時間が絶対必要。",
  },
  {
    target_type: "INFJ", category: "長期",
    content: "めっちゃ鋭いこと考えてるのに、心の中に鍵かけて隠してるのもったいない。言語化して外に出さないと、この世に存在しないのと同じ。発信してもあなたの価値は減らない。",
  },
  {
    target_type: "INFJ", category: "学習最適化",
    content: "ひとりで深く潜り込む勉強が得意だけど、インプットで満足しがち。最後に『誰かに話す・ブログに書く』っていうアウトプットの工程を必ずセットにして。",
  },
  { target_type: "INFJ", category: "NGワード", content: "気にしすぎだよ" },

  // ── INFP ────────────────────────────────────────────────
  {
    target_type: "INFP", category: "短期",
    content: "行動するまでのハードル高すぎ問題。クオリティはどうでもいいから、とりあえず15分だけタイマーかけて手をつけてみて。やり始めれば意外と進むから。",
  },
  {
    target_type: "INFP", category: "長期",
    content: "『本当の自分探し』をしがちだけど、それってゴールじゃなくて過程だからね。今のイマイチな自分を認めて、ひたすらアウトプットし続けるのが一番の特効薬。",
  },
  {
    target_type: "INFP", category: "学習最適化",
    content: "『これが私の人生にどう繋がるか』って意味を見出せないと1ミリも頭に入らないタイプ。「推し」「趣味」「感情」と絡めてパーソナルな形に繋げるのが最強。",
  },
  { target_type: "INFP", category: "NGワード", content: "普通はそうじゃない" },

  // ── ENFJ ────────────────────────────────────────────────
  {
    target_type: "ENFJ", category: "短期",
    content: "『誰かのため』じゃなくて、『完全に自分のエゴ』のためだけに予定を一つ入れること。そうしないと、どんどん他人のための人生になっちゃうよ。",
  },
  {
    target_type: "ENFJ", category: "長期",
    content: "みんなのために頑張れるのはガチですごい才能だけど、自己犠牲がベースだと身が持たない。たまにはキッパリ断ることも、相手への誠実さだって気づいて。",
  },
  {
    target_type: "ENFJ", category: "学習最適化",
    content: "ひとりで黙々やるより、誰かと一緒にワイワイ学ぶ環境で爆発的に伸びる。ただ『教える側』になりがちだから、素直に『教えて！』って言う謙虚さも忘れずに。",
  },
  { target_type: "ENFJ", category: "NGワード", content: "いい人ぶってるだけでしょ" },

  // ── ENFP ────────────────────────────────────────────────
  {
    target_type: "ENFP", category: "短期",
    content: "次から次へと新しいアイデアが出るのはわかるけど、今日は絶対新しいこと始めないで。昨日放置した作業をちょっとでも進めることだけを今日のミッションにして。",
  },
  {
    target_type: "ENFP", category: "長期",
    content: "最初の熱量だけは世界一だけど冷めるのも秒速。どんなにつまんなくても『最後までやり遂げた』っていう経験が、あなたにとっての最強レアアイテムになる。",
  },
  {
    target_type: "ENFP", category: "学習最適化",
    content: "誰かと一緒に学ぶことと、すぐ褒めてもらう環境が必須。孤独にコツコツ暗記するとか、構造的にマジで向いてないから最初からやめといた方がいい。",
  },
  { target_type: "ENFP", category: "NGワード", content: "飽き性だよね" },

  // ── ISTJ ────────────────────────────────────────────────
  {
    target_type: "ISTJ", category: "短期",
    content: "100点取ろうとする完璧主義、一旦やめよ。『70点できたらとりあえず出す』をルール化してみて。残りの30点は後からいくらでも修正効くから大丈夫。",
  },
  {
    target_type: "ISTJ", category: "長期",
    content: "『今まで通り』を信じるのは強いけど、『前例がないからやらない』を言い訳にしてると時代に取り残される。変化を受け入れる練習をしないとメンタル硬直するよ。",
  },
  {
    target_type: "ISTJ", category: "学習最適化",
    content: "手順通りにコツコツやるのが超得意で定着率もバツグン。ただ、基礎ばっかりやって応用に進むのをビビり引き伸ばす癖があるから、早めに実戦に飛び込んで。",
  },
  { target_type: "ISTJ", category: "NGワード", content: "もう少し柔軟になれないの？" },

  // ── ISFJ ────────────────────────────────────────────────
  {
    target_type: "ISFJ", category: "短期",
    content: "今日決めることのうち一つくらい、みんなの意見を完全にシカトして『自分がやりたいから』だけで決めてみて。わがままになる練習も必要。",
  },
  {
    target_type: "ISFJ", category: "長期",
    content: "他人に気を配りすぎ＆空気を読みすぎ。自分の欲求を後回しにし続けると、いつか突然電池が切れて鬱っぽくなるよ。『自分はどうしたいの？』って自問自答して。",
  },
  {
    target_type: "ISFJ", category: "学習最適化",
    content: "静かな場所でひとりでコツコツやるのが一番頭に入る。でもずっと篭ってるとモチベが消滅するから、誰かに進捗だけは報告する仕組みを作っとこう。",
  },
  { target_type: "ISFJ", category: "NGワード", content: "もっと自分の意見を言いなよ" },

  // ── ESTJ ────────────────────────────────────────────────
  {
    target_type: "ESTJ", category: "短期",
    content: "あえて『何の生産性もない無駄な時間』を10分作ってみて。この無駄っぽく見える時間が、周りの人とのクッション材になって人間関係を円滑にするから。",
  },
  {
    target_type: "ESTJ", category: "長期",
    content: "『お前が正論なのはわかってるけど、ムカつく』って言われがち。感情を論理の邪魔モノ扱いしてると、最終的に誰も言うこと聞いてくれなくなるよ。",
  },
  {
    target_type: "ESTJ", category: "学習最適化",
    content: "『なんのためにこれをやるのか（ゴール）』をハッキリさせないと、単なる作業ゲー化して一気に萎える。『ゴールとそこまでの最短ルート』を先に決めるのがキモ。",
  },
  { target_type: "ESTJ", category: "NGワード", content: "頭が固いですね" },

  // ── ESFJ ────────────────────────────────────────────────
  {
    target_type: "ESFJ", category: "短期",
    content: "今日ひとつだけでいいから、周りにどう思われるかを1ミリも気にせずに自分の直感だけで行動・発言してみて。意外と誰も怒らないから。",
  },
  {
    target_type: "ESFJ", category: "長期",
    content: "全員に好かれようとしすぎて、いざって時にハッキリ言えないのが最大の弱点。嫌われる勇気を持って摩擦を起こさないと、結果的に自分も他人も不幸にするよ。",
  },
  {
    target_type: "ESFJ", category: "学習最適化",
    content: "仲間と一緒に乗り越える感がモチベの源泉。ただ、おしゃべりして満足しちゃうリスクが高いから、『今日どこまで覚えるか』のラインだけは超シビアに設定して。",
  },
  { target_type: "ESFJ", category: "NGワード", content: "八方美人だよね" },

  // ── ISTP ────────────────────────────────────────────────
  {
    target_type: "ISTP", category: "短期",
    content: "アレコレ頭で分析してる暇があったら、とりあえず物理的に手を動かして触ってみよう。どうせいじくり回さないと納得できない仕組みになってるから。",
  },
  {
    target_type: "ISTP", category: "長期",
    content: "『言わなくてもわかるだろ』精神で言葉を省きすぎ。他人はエスパーじゃない。自分の考えてることやノウハウを言葉にして伝えるだけで、評価バク上がりするよ。",
  },
  {
    target_type: "ISTP", category: "学習最適化",
    content: "とりあえずバラす、とりあえず動かす。この『ハンズオン』での習得スピードは神レベル。教科書を読む時間は極限まで削って、すぐ実物に触るのが正解。",
  },
  { target_type: "ISTP", category: "NGワード", content: "もう少し丁寧に説明してほしい" },

  // ── ISFP ────────────────────────────────────────────────
  {
    target_type: "ISFP", category: "短期",
    content: "今日は結果を出そうとしなくてOK。直感で『いいな』と思ったものだけにダラダラ時間を使うだけで、心のゲージがめっちゃ回復するから。",
  },
  {
    target_type: "ISFP", category: "長期",
    content: "感性が天才的なのに、『どうせ分かってもらえない』って殻に閉じこもるのガチでもったいない。完璧じゃなくていいから、1人にでも見せるだけで世界が変わるよ。",
  },
  {
    target_type: "ISFP", category: "学習最適化",
    content: "理論とか理屈から入ると秒で寝るタイプ。とりあえず『体験』するところから入って、上手い人の『真似』をするのが一番才能を伸ばすコツ。",
  },
  { target_type: "ISFP", category: "NGワード", content: "もっと積極的になりなよ" },

  // ── ESTP ────────────────────────────────────────────────
  {
    target_type: "ESTP", category: "短期",
    content: "アレコレ悩んで精度上げるより、とりあえずやってみてダメ出し食らうスピードを上げよ。今すぐ手と足を動かしたほうが結果的に早い。",
  },
  {
    target_type: "ESTP", category: "長期",
    content: "フットワークの軽さとノリの良さは最高だけど、長期的なガチの目標がないままフラフラしがち。『半年後にどうなっていたいか』をスマホの壁紙にするレベルで意識して。",
  },
  {
    target_type: "ESTP", category: "学習最適化",
    content: "『とりあえずやってみて、失敗して、やり直す』のループが世界一似合うタイプ。机に座って座学とか、マジで時間の無駄だから即実践に飛び込んで。",
  },
  { target_type: "ESTP", category: "NGワード", content: "計画性がないよね" },

  // ── ESFP ────────────────────────────────────────────────
  {
    target_type: "ESFP", category: "短期",
    content: "気分が落ちてたりモヤモヤしてる時は、だいたい『一人で部屋にいる時間』が長すぎた証拠。今すぐ仲いいヤツに連絡してくだらない話するだけで全回復するよ。",
  },
  {
    target_type: "ESFP", category: "長期",
    content: "『楽しいかどうか』だけで生きてると、いざという時の大事な決断でミスる。地味でクソつまんない努力に耐える期間を作らないと、ずっと今のままだよ。",
  },
  {
    target_type: "ESFP", category: "学習最適化",
    content: "ライバルがいる、ご褒美がある、仲間がいる。この条件が揃わないと1ミリもやる気出ないタイプ。一人で黙々勉強するのは諦めて、環境を整備することに全振りして。",
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
