export interface QuestionOption {
  text: string;
  value: "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";
}

export interface TargetQuestion {
  id: number;
  text: string;
  optionA: QuestionOption;
  optionB: QuestionOption;
}

export const TARGET_QUESTIONS: TargetQuestion[] = [
  // --- E/I (外向 vs 内向) 判定 ---
  {
    id: 1,
    text: "あの人の、サークルや遊びの誘いに対するスタンスは？",
    optionA: { text: "基本的にフッカル。「次どこ行く〜？」ってあっちから誘ってくる", value: "E" },
    optionB: { text: "気分による。ぶっちゃけ大人数はダルいし帰りたそうにしてる", value: "I" }
  },
  {
    id: 2,
    text: "あの人のインスタのストーリーの使い方は？",
    optionA: { text: "息をするように更新する。誰が見てるか気にしてなさそう", value: "E" },
    optionB: { text: "基本見る専。投稿しても「親しい友達」限定でひっそりやってる", value: "I" }
  },
  {
    id: 3,
    text: "バイト先や初対面のコミュニティでのあの人の態度は？",
    optionA: { text: "人見知りゼロ。自分から話しかけて一瞬で打ち解けてる", value: "E" },
    optionB: { text: "探り探り。話しかけられたら返すけど基本は省エネモード", value: "I" }
  },
  {
    id: 4,
    text: "あの人の休日はどんな感じだと思う？",
    optionA: { text: "暇になるとすぐ誰かにLINEして予定を埋めようとする", value: "E" },
    optionB: { text: "一歩も外に出ずベッドでネトフリ見てHP回復してそう", value: "I" }
  },
  {
    id: 5,
    text: "リアルの会話のテンポはどんな感じ？",
    optionA: { text: "秒でレスが飛んでくるし、話がコロコロ変わる", value: "E" },
    optionB: { text: "ちょっと間がある。頭で整理してから喋ってそう", value: "I" }
  },

  // --- S/N (感覚 vs 直観) 判定 ---
  {
    id: 6,
    text: "LINEやリアルでの雑談、どっちの話題が多い？",
    optionA: { text: "「今日〇〇でウザかった〜」みたいな日常や事実の近況報告ばっかり", value: "S" },
    optionB: { text: "「もし明日世界が終わるなら」的なよくわからない抽象的な話をしてくる", value: "N" }
  },
  {
    id: 7,
    text: "トラブルが起きたとき、あの人はどう動く？",
    optionA: { text: "「じゃあこうするわ」って目の前の現状をサクッと処理する", value: "S" },
    optionB: { text: "「そもそもその仕組みに問題がある」って根本原因を語り出す", value: "N" }
  },
  {
    id: 8,
    text: "ドラマや映画を見たあとのあの人の感想は？",
    optionA: { text: "「あのシーン超笑った」「ビジュ良い」と素直な感想ばかり", value: "S" },
    optionB: { text: "「あれは伏線だよね」「あのキャラの心情エモい」と考察気味", value: "N" }
  },
  {
    id: 9,
    text: "あの人のメッセージや言葉選びの特徴は？",
    optionA: { text: "要件や事実を簡潔に、そのまま伝えてくる", value: "S" },
    optionB: { text: "ちょっとポエマー。独特の言い回しや比喩をよく使う", value: "N" }
  },
  {
    id: 10,
    text: "新しいカフェやスポットに行くときの決め手は？",
    optionA: { text: "TikTokのバズり度や、リアルな口コミを気にして選んでる", value: "S" },
    optionB: { text: "「なんか直感」「コンセプトが尖ってて面白そう」で決めてる", value: "N" }
  },

  // --- T/F (思考 vs 感情) 判定 ---
  {
    id: 11,
    text: "あなたがメンタル崩壊LINEを送った時、あの人の返信は？",
    optionA: { text: "「こうやって対処しな」って淡々と解決策を提示してくる", value: "T" },
    optionB: { text: "「わかる、それめっちゃしんどいね…」とまずは全肯定してくれる", value: "F" }
  },
  {
    id: 12,
    text: "あなたと気まずい雰囲気・喧嘩になったときの対応は？",
    optionA: { text: "「なぜそうなったのか」原因を論理で詰めてこようとする", value: "T" },
    optionB: { text: "すぐ感情的になるか、嫌われるのが怖くてだんまりを決め込む", value: "F" }
  },
  {
    id: 13,
    text: "あの人の「他人への褒め言葉」はどっち寄り？",
    optionA: { text: "「あいつ仕事できる」「頭いい」など能力やスペック重視", value: "T" },
    optionB: { text: "「めっちゃ優しい」「性格が好き」など人柄や気遣い重視", value: "F" }
  },
  {
    id: 14,
    text: "バイト先やグループで「何かを決める」ときの基準は？",
    optionA: { text: "「コスパ」「効率」「自分へのメリットがあるか」を気にする", value: "T" },
    optionB: { text: "「みんながどう思うか」「面白そうかどうか」で動く", value: "F" }
  },
  {
    id: 15,
    text: "あの人の中で「蛙化現象」が起きる一番のトリガーはどっちっぽい？",
    optionA: { text: "相手の無能なミスやダサい行動を見たときに「冷めた…」ってなりそう", value: "T" },
    optionB: { text: "相手の人間性（店員への態度など）が悪かったときに「無理…」ってなりそう", value: "F" }
  },

  // --- J/P (判断 vs 知覚) 判定 ---
  {
    id: 16,
    text: "旅行や遊びの計画性はどんなレベル？",
    optionA: { text: "「10時に〇〇集合で、ご飯はここ」って事前に全部決めたがる", value: "J" },
    optionB: { text: "「とりあえず〇〇駅集合ね！あとは適当にぶらつこ〜」って言ってくる", value: "P" }
  },
  {
    id: 17,
    text: "既読スルー・未読無視の感覚は？",
    optionA: { text: "レスが早い。LINEを溜めるのが嫌いで基本すぐ返してくる", value: "J" },
    optionB: { text: "基本マイペース。数時間〜数日未読無視で放置されるのもザラ", value: "P" }
  },
  {
    id: 18,
    text: "待ち合わせ時間のルーズさは？",
    optionA: { text: "5分前行動のタイプ。遅刻してくるやつには厳しい", value: "J" },
    optionB: { text: "ギリギリ到着がデフォ。たまに悪びれもなく遅れてくる", value: "P" }
  },
  {
    id: 19,
    text: "あの人のカバンの中や部屋の綺麗さ（想像含む）は？",
    optionA: { text: "ちゃんと整理されてて、物のポジションが決まっていそう", value: "J" },
    optionB: { text: "絶対散らかってる。その日によってカバンの中身がカオス", value: "P" }
  },
  {
    id: 20,
    text: "大学の課題やめんどくさいタスクへの向き合い方は？",
    optionA: { text: "期限より前に計画的に終わらせていそう。ギリギリだとパニックになるタイプ", value: "J" },
    optionB: { text: "当日まで放置して、謎の爆発力でギリギリ乗り切ってそう", value: "P" }
  }
];
