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
    text: "サークルや飲み会、遊びの誘いに対するスタンスは？",
    optionA: { text: "基本的にフッカル。「次どこ行く〜？」って自分から誘う", value: "E" },
    optionB: { text: "気分による。ぶっちゃけ大人数はダルいし帰りたい", value: "I" }
  },
  {
    id: 2,
    text: "インスタのストーリーの使い方は？",
    optionA: { text: "息をするように更新する。誰が見てるか気にしてない", value: "E" },
    optionB: { text: "見る専。投稿しても「親しい友達」限定でひっそり", value: "I" }
  },
  {
    id: 3,
    text: "バイト先や初対面のコミュニティでのコミュ力は？",
    optionA: { text: "人見知りゼロ。自分から話しかけて一瞬で打ち解ける", value: "E" },
    optionB: { text: "探り探り。話しかけられたら返すけど、基本は省エネ", value: "I" }
  },
  {
    id: 4,
    text: "休日に予定がないときの過ごし方は？",
    optionA: { text: "暇すぎるからとりあえず誰かにLINEして予定埋める", value: "E" },
    optionB: { text: "最高。一歩も外に出ずベッドでネトフリ見てHP回復", value: "I" }
  },
  {
    id: 5,
    text: "リアルの会話のテンポはどんな感じ？",
    optionA: { text: "秒でレスが飛んでくる。話がコロコロ変わる", value: "E" },
    optionB: { text: "ちょっと間がある。自分の頭で整理してから喋るタイプ", value: "I" }
  },

  // --- S/N (感覚 vs 直観) 判定 ---
  {
    id: 6,
    text: "LINEやリアルでの雑談、どっちの話題が多い？",
    optionA: { text: "「今日〇〇でウザかった〜」みたいな日常や事実の近況報告", value: "S" },
    optionB: { text: "「もし明日世界が終わるなら」的な唐突な妄想や抽象的な話", value: "N" }
  },
  {
    id: 7,
    text: "課題やバイトでトラブルが起きたときの挙動は？",
    optionA: { text: "「じゃあこうするわ」って目の前の現状をすぐ処理する", value: "S" },
    optionB: { text: "「そもそもその仕組みに問題がある」って根本原因を語り出す", value: "N" }
  },
  {
    id: 8,
    text: "面白かったTikTokやドラマを見たあとの感想は？",
    optionA: { text: "「あのシーン超笑った」「あの俳優めっちゃビジュ良い」", value: "S" },
    optionB: { text: "「あれは現代社会の伏線だよね」「あのキャラの心情エモい」", value: "N" }
  },
  {
    id: 9,
    text: "メッセージや言葉選びのニュアンスは？",
    optionA: { text: "要件だけを簡潔に。事実をそのまま伝える", value: "S" },
    optionB: { text: "ちょっとポエマー。独特の言い回しや比喩を使う", value: "N" }
  },
  {
    id: 10,
    text: "新しいカフェやスポットに行くときの決め手は？",
    optionA: { text: "TikTokや食べログのバズり度、リアルな口コミをチェック", value: "S" },
    optionB: { text: "なんか直感。「コンセプトが尖ってて面白そう」だから", value: "N" }
  },

  // --- T/F (思考 vs 感情) 判定 ---
  {
    id: 11,
    text: "あなたが人間関係の病みLINEを送った時の返信は？",
    optionA: { text: "「それは〇〇が悪いね。こうやって対処しな」って解決策を提示", value: "T" },
    optionB: { text: "「わかる、それめっちゃしんどいね…」ってまずは全肯定", value: "F" }
  },
  {
    id: 12,
    text: "気まずい雰囲気や喧嘩になったときの対応は？",
    optionA: { text: "「なぜそうなったのか」原因を論理で詰めてこようとする", value: "T" },
    optionB: { text: "すぐ感情的になるか、嫌われるのが怖くてだんまりを決め込む", value: "F" }
  },
  {
    id: 13,
    text: "あの人の「他人への褒め方」はどっち寄り？",
    optionA: { text: "「あいつ仕事できる」「頭いい」など能力やスペック重視", value: "T" },
    optionB: { text: "「めっちゃ優しい」「性格が好き」など人柄や気遣い重視", value: "F" }
  },
  {
    id: 14,
    text: "バイト先等で「何かを決める」ときの基準は？",
    optionA: { text: "「コスパ」「効率」「それって自分にメリットある？」", value: "T" },
    optionB: { text: "「みんながどう思うか」「自分がそれをやりたいかどうか」", value: "F" }
  },
  {
    id: 15,
    text: "相手の中で「蛙化現象」が起きる一番のトリガーはどっちっぽい？",
    optionA: { text: "無能な行動やダサいミスを見たとき「冷めた…」ってなる", value: "T" },
    optionB: { text: "店員への態度が悪い等、人間性が見えた瞬間に「無理…」ってなる", value: "F" }
  },

  // --- J/P (判断 vs 知覚) 判定 ---
  {
    id: 16,
    text: "旅行や遊びの計画性はどんなレベル？",
    optionA: { text: "「10時に〇〇集合で、ご飯はここ」って事前に全部決めたい", value: "J" },
    optionB: { text: "「とりあえず〇〇駅集合ね！あとは適当にぶらつこ〜」", value: "P" }
  },
  {
    id: 17,
    text: "既読スルー・未読無視の感覚は？",
    optionA: { text: "用事があれば基本すぐ返す。LINE溜めるのが気持ち悪い", value: "J" },
    optionB: { text: "基本マイペース。数時間〜数日放置もザラ（悪気はない）", value: "P" }
  },
  {
    id: 18,
    text: "待ち合わせ時間のルーズさは？",
    optionA: { text: "5分前行動。遅刻してくるやつにはブチギレる", value: "J" },
    optionB: { text: "ギリギリ到着がデフォ。たまに悪びれもなく遅れてくる", value: "P" }
  },
  {
    id: 19,
    text: "その人のカバンの中身や部屋の綺麗さ（想像含む）は？",
    optionA: { text: "ちゃんと整理されてて、物のポジションが決まってる", value: "J" },
    optionB: { text: "絶対散らかってる。その日によってカバンの中身がカオス", value: "P" }
  },
  {
    id: 20,
    text: "大学の課題やめんどくさいタスクへの向き合い方は？",
    optionA: { text: "期限より前に計画的に終わらせる。ギリギリだと病む", value: "J" },
    optionB: { text: "提出日当日まで放置。開始3時間前からの謎の爆発力で乗り切る", value: "P" }
  }
];
