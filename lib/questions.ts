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
    text: "話題のニュースや人気のある投稿を見つけたとき、どうする？",
    options: [
      { label: "すぐに誰かに送ったり、SNSで共有して盛り上がりたい！", value: "E", emoji: "🗣️" },
      { label: "自分の中で「へー、そうなんだ」と納得して、自己完結する。", value: "I", emoji: "🤐" },
    ],
  },
  {
    id: 2,
    axis: "E / I",
    axisKey: "EI",
    text: "誰かと話していて、「今の会話楽しい！」と気分が上がる瞬間は？",
    options: [
      { label: "話題がコロコロ変わって、テンポよく連想ゲームみたいに話が進むとき！", value: "E", emoji: "⚡" },
      { label: "一つのテーマについて、誰にも邪魔されずに深く語り合っているとき。", value: "I", emoji: "☕" },
    ],
  },
  {
    id: 3,
    axis: "E / I",
    axisKey: "EI",
    text: "1週間しっかり頑張って、疲れが溜まった休日はどう過ごす？",
    options: [
      { label: "とりあえず外に出て友達と遊ぶ！人と会って楽しく過ごした方が元気が出る！", value: "E", emoji: "🔋" },
      { label: "スマホも通知オフにして、家でゆっくり休んで回復する。", value: "I", emoji: "🛌" },
    ],
  },
  {
    id: 4,
    axis: "E / I",
    axisKey: "EI",
    text: "初対面の人もいる集まりでのあなたの立ち位置は？",
    options: [
      { label: "とりあえず自分から話しかけて、その場の空気を回そうとする。", value: "E", emoji: "💃" },
      { label: "まずは周りを観察して、自分に話が振られるまで様子を見る。", value: "I", emoji: "👀" },
    ],
  },
  {
    id: 5,
    axis: "E / I",
    axisKey: "EI",
    text: "突然「今から遊ぼう！」と急な連絡が来たらどう思う？",
    options: [
      { label: "面白そうならすぐに合流！急な予定はむしろ気分が上がる！", value: "E", emoji: "🏃" },
      { label: "心の準備ができていないから、暇でも「ごめん今日無理」と断りがち。", value: "I", emoji: "🙅" },
    ],
  },

  // ── S / N ────────────────────────────────────────────────────
  {
    id: 6,
    axis: "S / N",
    axisKey: "SN",
    text: "自分が話していて一番「話しやすいな」と思う話題は？",
    options: [
      { label: "「今日〇〇でこんなことがあってさ〜」みたいな、リアルな体験談や近況報告。", value: "S", emoji: "🗣️" },
      { label: "「もし明日世界が終わるなら何する？」みたいな、現実離れした想像やもしもの話。", value: "N", emoji: "💭" },
    ],
  },
  {
    id: 7,
    axis: "S / N",
    axisKey: "SN",
    text: "服や家電を買うとき、最終的に何で決める？",
    options: [
      { label: "レビューの評価や、実際の機能性、実用性が高いかどうか。", value: "S", emoji: "🛒" },
      { label: "そのブランドの世界観や「なんか良いな」という直感とインスピレーション。", value: "N", emoji: "✨" },
    ],
  },
  {
    id: 8,
    axis: "S / N",
    axisKey: "SN",
    text: "SNSに上げる写真、どっちの系統が好き？",
    options: [
      { label: "その場の楽しさや美味しさがそのまま伝わる、見栄えの良いリアルな写真。", value: "S", emoji: "📸" },
      { label: "少し構図が個性的だったり、風景メインの雰囲気のある写真。", value: "N", emoji: "🌌" },
    ],
  },
  {
    id: 9,
    axis: "S / N",
    axisKey: "SN",
    text: "人に何かを説明するとき、よくやってしまう話し方は？",
    options: [
      { label: "時系列順に「あれがあって、次にこれがあって…」と順序立てて話す。", value: "S", emoji: "📋" },
      { label: "「例えるなら〇〇みたいな感じ！」と比喩を使って、結論に飛んだりする。", value: "N", emoji: "🚀" },
    ],
  },
  {
    id: 10,
    axis: "S / N",
    axisKey: "SN",
    text: "予想外のトラブルが起きたとき、頭の中で最初に考えることは？",
    options: [
      { label: "「とりあえず今どう動けば状況が良くなるか」と現実的な対処法を探す。", value: "S", emoji: "🔧" },
      { label: "「そもそも何でこれが起きたんだろう」と根本的な原因や背景を考え出す。", value: "N", emoji: "🤔" },
    ],
  },

  // ── T / F ────────────────────────────────────────────────────
  {
    id: 11,
    axis: "T / F",
    axisKey: "TF",
    text: "友達から「本当にしんどい…」と長文の悩み相談が来たら？",
    options: [
      { label: "「それならこうすれば解決するよ」と、具体的なアドバイスや解決策を送る。", value: "T", emoji: "💡" },
      { label: "「わかる、それは本当にしんどいね…」と、まずは全力で共感して寄り添う。", value: "F", emoji: "🫂" },
    ],
  },
  {
    id: 12,
    axis: "T / F",
    axisKey: "TF",
    text: "誰かと意見がぶつかって気まずくなったとき、どう対応する？",
    options: [
      { label: "感情はいったん置いて、「どちらが正しいか」を論理的にハッキリさせようとする。", value: "T", emoji: "⚖️" },
      { label: "空気が悪くなるのが嫌で、内心納得していなくてもとりあえず相手に合わせて謝る。", value: "F", emoji: "😮‍💨" },
    ],
  },
  {
    id: 13,
    axis: "T / F",
    axisKey: "TF",
    text: "「この人すごいな」と思うポイントはどっち？",
    options: [
      { label: "仕事が早い、頭の回転が速いなど、能力の高さ。", value: "T", emoji: "📈" },
      { label: "周りへの気遣いが素晴らしい、誰にでも優しいなど、人柄の良さ。", value: "F", emoji: "🌸" },
    ],
  },
  {
    id: 14,
    axis: "T / F",
    axisKey: "TF",
    text: "迷ったとき、最終的に決断する基準は？",
    options: [
      { label: "「こっちの方が合理的だし、効率が良い」", value: "T", emoji: "💰" },
      { label: "「こっちの方がなんか好きだし、気分が上がる！」", value: "F", emoji: "❤️" },
    ],
  },
  {
    id: 15,
    axis: "T / F",
    axisKey: "TF",
    text: "大事な友達が明らかに間違った行動をしていたら？",
    options: [
      { label: "友達だからこそ、「それやめた方がいいよ」とハッキリ言う。", value: "T", emoji: "🛑" },
      { label: "「何か理由があったのかな…」とまずは事情を聞いて、味方でいようとする。", value: "F", emoji: "🛡️" },
    ],
  },

  // ── J / P ────────────────────────────────────────────────────
  {
    id: 16,
    axis: "J / P",
    axisKey: "JP",
    text: "友達と旅行に行くことになったら、計画はどう立てる？",
    options: [
      { label: "「何時の電車で、お昼はここ！」と事前に決めて予約も済ませたい。", value: "J", emoji: "🗓️" },
      { label: "「とりあえず〇〇駅集合ね！」とだけ決めて、あとはその場のノリで動きたい。", value: "P", emoji: "🎲" },
    ],
  },
  {
    id: 17,
    axis: "J / P",
    axisKey: "JP",
    text: "絶対やらなきゃいけないタスクの期限が迫っているときは？",
    options: [
      { label: "ギリギリになって焦るのが嫌だから、前もって終わらせておく。", value: "J", emoji: "✅" },
      { label: "ギリギリまで放置して、直前になってすごい集中力で終わらせる。", value: "P", emoji: "🔥" },
    ],
  },
  {
    id: 18,
    axis: "J / P",
    axisKey: "JP",
    text: "連絡の返信ペースの感覚は？",
    options: [
      { label: "未読が溜まるのが気になって、割とすぐに返信する方。", value: "J", emoji: "⚡" },
      { label: "頭の中で「こう返そう」と思って満足してしまい、返信が遅れることが多い。", value: "P", emoji: "🐢" },
    ],
  },
  {
    id: 19,
    axis: "J / P",
    axisKey: "JP",
    text: "自分の部屋やスマホの整理具合は？",
    options: [
      { label: "どこに何があるか定位置が決まっていて、スッキリ整理されている。", value: "J", emoji: "📐" },
      { label: "少し散らかっているけど、「どこに何があるか」は自分では把握している。", value: "P", emoji: "🌪️" },
    ],
  },
  {
    id: 20,
    axis: "J / P",
    axisKey: "JP",
    text: "予定が急に変更になったとき、どう思う？",
    options: [
      { label: "せっかく立てた予定が崩れるのが嫌で、少しストレスを感じる。", value: "J", emoji: "😠" },
      { label: "「まあいっか、時間が空いたし別のことしよう」とすぐ切り替える。", value: "P", emoji: "🎈" },
    ],
  },
];
