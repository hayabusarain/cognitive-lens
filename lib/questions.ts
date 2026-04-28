export type Axis = "EI" | "SN" | "TF" | "JP";

export interface Question {
  id: number;
  axis: string;
  axisKey: Axis;
  text: string;
  options: { label: string; value: string; emoji: string }[];
}

export const QUESTIONS: Question[] = [
  // ── E / I ────────────────────────────────────────────────────
  {
    id: 1,
    axis: "E / I",
    axisKey: "EI",
    text: "ヤバいニュースや面白い投稿を見つけた時、あなたはどうする？",
    options: [
      { label: "すぐ誰かに共有（ストーリー、DM）して語り合いたい", value: "E", emoji: "🗣️" },
      { label: "自分の中で「へー」と納得して完結させる", value: "I", emoji: "🤐" },
    ],
  },
  {
    id: 2,
    axis: "E / I",
    axisKey: "EI",
    text: "誰かと話してて、自分が一番アガる瞬間は？",
    options: [
      { label: "テンポよく話題が飛んで、連想ゲームみたいになる時", value: "E", emoji: "⚡" },
      { label: "一つのテーマについて、腰を据えて深く語り合う時", value: "I", emoji: "☕" },
    ],
  },
  {
    id: 3,
    axis: "E / I",
    axisKey: "EI",
    text: "1週間頑張って疲れた休みの日、どうやって回復する？",
    options: [
      { label: "誰かと会って外の刺激を受けることで回復する", value: "E", emoji: "🔋" },
      { label: "一人で引きこもって自分の世界に浸ることで回復する", value: "I", emoji: "🛌" },
    ],
  },
  {
    id: 4,
    axis: "E / I",
    axisKey: "EI",
    text: "初対面が混じる集まり（オフ会、サークル等）でのあなたは？",
    options: [
      { label: "自分から輪に入り、場の空気を回そうとする", value: "E", emoji: "💃" },
      { label: "周りをじっくり観察して、必要最小限で話す", value: "I", emoji: "👀" },
    ],
  },
  {
    id: 5,
    axis: "E / I",
    axisKey: "EI",
    text: "「今から来れる？」という急な誘いへの反応は？",
    options: [
      { label: "面白そうなら即OK。新しい刺激が欲しい", value: "E", emoji: "🏃" },
      { label: "予定や心の準備がないと、暇でも断りがち", value: "I", emoji: "🙅" },
    ],
  },

  // ── S / N ────────────────────────────────────────────────────
  {
    id: 6,
    axis: "S / N",
    axisKey: "SN",
    text: "自分が喋っていて一番楽しい話題は？",
    options: [
      { label: "最近あったリアルな体験や、具体的な事実の話", value: "S", emoji: "🗣️" },
      { label: "「もしも」の話や、将来のビジョン、抽象的な妄想", value: "N", emoji: "💭" },
    ],
  },
  {
    id: 7,
    axis: "S / N",
    axisKey: "SN",
    text: "服やアイテムを買う時の決め手は？",
    options: [
      { label: "実際のレビューや、機能性、着回し力", value: "S", emoji: "🛒" },
      { label: "そのブランドのコンセプトや、他にはない独特の感性", value: "N", emoji: "✨" },
    ],
  },
  {
    id: 8,
    axis: "S / N",
    axisKey: "SN",
    text: "インスタ等に上げる写真の好みは？",
    options: [
      { label: "その場の空気感がリアルに伝わる、綺麗な記録写真", value: "S", emoji: "📸" },
      { label: "構図が独特だったり、何かメッセージ性のある「エモい」写真", value: "N", emoji: "🌌" },
    ],
  },
  {
    id: 9,
    axis: "S / N",
    axisKey: "SN",
    text: "人に何かを説明する時のあなたのクセは？",
    options: [
      { label: "具体的で細かい。順を追って事実を話す", value: "S", emoji: "📋" },
      { label: "比喩や例え話が多く、結論がいきなり飛ぶことがある", value: "N", emoji: "🚀" },
    ],
  },
  {
    id: 10,
    axis: "S / N",
    axisKey: "SN",
    text: "予想外のハプニングが起きた時の第一反応は？",
    options: [
      { label: "「今できること」を冷静に探し、具体的に動き出す", value: "S", emoji: "🔧" },
      { label: "「そもそも何で起きた？」と根本的な原因を考え出す", value: "N", emoji: "🤔" },
    ],
  },

  // ── T / F ────────────────────────────────────────────────────
  {
    id: 11,
    axis: "T / F",
    axisKey: "TF",
    text: "友達から真剣な悩みを相談されたら？",
    options: [
      { label: "最適な解決策や「こうすれば？」というアドバイスを出す", value: "T", emoji: "💡" },
      { label: "「それは辛かったね」と、まず気持ちに共感する", value: "F", emoji: "🫂" },
    ],
  },
  {
    id: 12,
    axis: "T / F",
    axisKey: "TF",
    text: "意見がぶつかった時のあなたの態度は？",
    options: [
      { label: "感情を置いておき、正論やロジックで白黒つけようとする", value: "T", emoji: "⚖️" },
      { label: "気まずさを避けて、納得いかなくても相手に合わせがち", value: "F", emoji: "😮‍💨" },
    ],
  },
  {
    id: 13,
    axis: "T / F",
    axisKey: "TF",
    text: "他人を褒める時、どこに目が行く？",
    options: [
      { label: "実力やスキルの高さ、仕事の早さなどの「能力」", value: "T", emoji: "📈" },
      { label: "性格の良さや、周りへの気遣いなどの「人柄」", value: "F", emoji: "🌸" },
    ],
  },
  {
    id: 14,
    axis: "T / F",
    axisKey: "TF",
    text: "最終的な決め手の口癖は？",
    options: [
      { label: "「どっちが合理的か」「コスパやメリットがあるか」", value: "T", emoji: "💰" },
      { label: "「どっちが好きか」「自分のテンションが上がるか」", value: "F", emoji: "❤️" },
    ],
  },
  {
    id: 15,
    axis: "T / F",
    axisKey: "TF",
    text: "大事な友達が間違ったことをしていたら？",
    options: [
      { label: "相手のためを思って、ダメなものはダメとはっきり言う", value: "T", emoji: "🛑" },
      { label: "まず相手の事情を聞いて、味方でいようとする", value: "F", emoji: "🛡️" },
    ],
  },

  // ── J / P ────────────────────────────────────────────────────
  {
    id: 16,
    axis: "J / P",
    axisKey: "JP",
    text: "旅行や遊びの計画を立てる時のスタンスは？",
    options: [
      { label: "行き先や時間をガチガチに決め、予約も済ませたい", value: "J", emoji: "🗓️" },
      { label: "その場で決めたいから、予約は最小限でいい", value: "P", emoji: "🎲" },
    ],
  },
  {
    id: 17,
    axis: "J / P",
    axisKey: "JP",
    text: "締め切りがある時のあなたの行動は？",
    options: [
      { label: "余裕を持って終わらせるよう、計画的にコツコツやる", value: "J", emoji: "✅" },
      { label: "ギリギリまで放置して、最後に爆発的な集中力を出す", value: "P", emoji: "🔥" },
    ],
  },
  {
    id: 18,
    axis: "J / P",
    axisKey: "JP",
    text: "普段のメッセージのやり取りの感じは？",
    options: [
      { label: "割とすぐ返す。既読スルーや未読放置はあまりしない", value: "J", emoji: "⚡" },
      { label: "マイペース。頭の中で返信して満足し、忘れがち", value: "P", emoji: "🐢" },
    ],
  },
  {
    id: 19,
    axis: "J / P",
    axisKey: "JP",
    text: "自分の身の回りの整理整頓具合は？",
    options: [
      { label: "定位置が決まっていて、いつ見てもスッキリしている", value: "J", emoji: "📐" },
      { label: "散らかっているが、どこに何があるか自分では把握している", value: "P", emoji: "🌪️" },
    ],
  },
  {
    id: 20,
    axis: "J / P",
    axisKey: "JP",
    text: "急に予定がキャンセルや変更になった時、どう感じる？",
    options: [
      { label: "計画が崩れることを嫌がり、少しイラッとする", value: "J", emoji: "😠" },
      { label: "「まあいっか」で、すぐに別の楽しいことを探し始める", value: "P", emoji: "🎈" },
    ],
  },
];
