export interface TypeInfo {
  name: string;
  tagline: string;
  description: string;
  emoji: string;
  imageUrl?: string;
  gradient: string; // Tailwind gradient classes
  colorFrom: string;
  colorTo: string;
}

export const TYPE_INFO: Record<string, TypeInfo> = {
  INTJ: {
    name: "通知全オフのガチ勢スマホ",
    tagline: "全てを一人で完結させる最強の裏アカ",
    description: "周りのノイズを遮断し、自分だけの世界で完璧な予定を組み立てるタイプ。無駄な通知は全部切ってるから冷たく見えがちだけど、頭の中では誰よりも先のことまで考えてる。まさにパスコードを知る人にしか見せない最強の裏アカ。",
    emoji: "🏛️", imageUrl: "/characters/INTJ.png", gradient: "from-slate-500 to-violet-500", colorFrom: "#64748b", colorTo: "#8b5cf6"
  },
  INTP: {
    name: "検索履歴ヤバい系ブラウザ",
    tagline: "常識を疑う歩くWiki",
    description: "気になることがあると納得いくまで検索し続ける好奇心オバケ。現実のLINEは放置するのに、脳内では常に宇宙の真理について考えてる。常識に縛られないその発想力は、マジで歩くWikipediaレベル。",
    emoji: "🔬", imageUrl: "/characters/INTP.png", gradient: "from-sky-400 to-teal-500", colorFrom: "#38bdf8", colorTo: "#14b8a6"
  },
  ENTJ: {
    name: "グループLINEの絶対的管理者",
    tagline: "みんなを動かす全自動スケジュール",
    description: "目標達成のためなら、どんなカオスな状況でも一瞬で仕切って結果を出すカリスマ。効率重視すぎてたまに圧が強いけど、この人がいれば絶対にプロジェクトが成功するっていう安心感はガチでヤバい。",
    emoji: "⚡", imageUrl: "/characters/ENTJ.png", gradient: "from-amber-500 to-orange-500", colorFrom: "#f59e0b", colorTo: "#f97316"
  },
  ENTP: {
    name: "常に新しいタブを開き続けるブラウザ",
    tagline: "世界を遊び場に変える歩くバズ製造機",
    description: "一つのことが終わる前に次の面白いことを見つけて飛びつく、超スピード型の思考の持ち主。ちょっとウザ絡みしてくることもあるけど、その予測不能な発想力でいつも周りに新しい刺激（アプデ）をくれる。",
    emoji: "💬", imageUrl: "/characters/ENTP.png", gradient: "from-teal-400 to-cyan-500", colorFrom: "#2dd4bf", colorTo: "#06b6d4"
  },
  INFJ: {
    name: "パスコード長すぎる鍵アカ",
    tagline: "本音を隠したエモいポエムBOT",
    description: "人の気持ちを読み取るのは得意なのに、自分の本音は超強固なセキュリティで守ってるタイプ。本当に信頼した人にしか心を開かないけど、一度打ち解けると海より深い優しさを見せてくれる、神秘的な存在。",
    emoji: "🌸", imageUrl: "/characters/INFJ.png", gradient: "from-violet-400 to-purple-500", colorFrom: "#a78bfa", colorTo: "#a855f7"
  },
  INFP: {
    name: "下書きにポエム溜めまくるメモ帳",
    tagline: "世界を彩るエモいフィルター",
    description: "頭の中にまだ誰にも見せていない壮大な理想（下書き）をいっぱい抱えてる。現実の厳しさに傷つきやすいけど、その繊細な感性で世界を美しく切り取る力は、他の誰にも真似できない芸術的な才能なんだよね。",
    emoji: "🌿", imageUrl: "/characters/INFP.png", gradient: "from-rose-400 to-pink-500", colorFrom: "#fb7185", colorTo: "#ec4899"
  },
  ENFJ: {
    name: "全自動でいいね押す神フォロワー",
    tagline: "みんなを笑顔にするインフルエンサー",
    description: "周りの人が求めていることを一瞬で察知して、全力でサポートしてくれる優しさの塊。みんなを励まして前に進ませるそのコミュ力は、マジで周りの人生をポジティブにアプデする最強のインフルエンサー。",
    emoji: "✨", imageUrl: "/characters/ENFJ.png", gradient: "from-orange-400 to-rose-500", colorFrom: "#fb923c", colorTo: "#f43f5e"
  },
  ENFP: {
    name: "通知鳴り止まないパリピSNS",
    tagline: "すべてを巻き込む最強のコミュ力",
    description: "思いついたら即行動！周りの人をどんどん巻き込んで楽しいこと（イベント）を立ち上げる天才。たまに約束を忘れてバグることもあるけど、その圧倒的な明るさとノリで全部許されちゃう愛されキャラ。",
    emoji: "🎨", imageUrl: "/characters/ENFP.png", gradient: "from-yellow-400 to-amber-500", colorFrom: "#facc15", colorTo: "#f59e0b"
  },
  ISTJ: {
    name: "アラーム絶対1回で起きる時計アプリ",
    tagline: "規律と正確さの歩くカレンダー",
    description: "決めたルールや予定は絶対に守る、超絶マジメで信頼できるタイプ。派手さはないかもしれないけど、この人がいないと現実世界（システム）が回らなくなるレベルで重要な、社会の最強インフラ。",
    emoji: "🏗️", imageUrl: "/characters/ISTJ.png", gradient: "from-stone-400 to-slate-500", colorFrom: "#a8a29e", colorTo: "#64748b"
  },
  ISFJ: {
    name: "みんなの思い出全部保存してる写真フォルダ",
    tagline: "世界を支える見えない気遣いアプリ",
    description: "誰かのためになることを、見えないところでひっそりとやり続ける縁の下の力持ち。相手の好きなものや何気ない言葉を全部記憶していて、絶妙なタイミングで優しさを出力してくる神みたいな存在。",
    emoji: "🌱", imageUrl: "/characters/ISFJ.png", gradient: "from-green-400 to-emerald-500", colorFrom: "#4ade80", colorTo: "#10b981"
  },
  ESTJ: {
    name: "グループLINEの仕切り屋",
    tagline: "秩序をもたらす絶対的タスク管理",
    description: "現実的でムダが嫌い。目標に向かって最短距離で進むための計画を立てて、周りもグイグイ引っ張っていく。ちょっとルールに厳しいオカンみたいなとこもあるけど、有言実行で結果を出す姿はマジで頼りになる。",
    emoji: "📋", imageUrl: "/characters/ESTJ.png", gradient: "from-blue-400 to-sky-500", colorFrom: "#60a5fa", colorTo: "#0ea5e9"
  },
  ESFJ: {
    name: "位置情報常に共有してる神友",
    tagline: "愛と調和の歩く掲示板",
    description: "コミュニティの空気を常に読んで、みんなが仲良く過ごせるように気を配りまくるムードメーカー。友達のピンチには秒で駆けつけるし、この人がいるだけでその場の雰囲気が一気にあったかくなる。",
    emoji: "🫶", imageUrl: "/characters/ESFJ.png", gradient: "from-pink-400 to-rose-400", colorFrom: "#f472b6", colorTo: "#fb7185"
  },
  ISTP: {
    name: "Siriより頼りになる便利ツール",
    tagline: "無口だけど一瞬で解決する神ガジェット",
    description: "普段は省エネモードでダラダラしてるけど、いざトラブルが起きると誰よりも冷静にパパッと解決しちゃう職人肌。口数は少ないけど行動で示すタイプで、そのドライなかっこよさに沼る人が後を絶たない。",
    emoji: "🔧", imageUrl: "/characters/ISTP.png", gradient: "from-cyan-400 to-teal-500", colorFrom: "#22d3ee", colorTo: "#14b8a6"
  },
  ISFP: {
    name: "フィルター加工の天才カメラアプリ",
    tagline: "独自の美学を貫くエモい写真フォルダ",
    description: "自分のペースと感覚を何よりも大事にしてる、マイペースなアーティスト。言葉で伝えるのは苦手だけど、その人だけの独特な視点やセンスがあって、一緒にいると日常がちょっとエモい感じに変わるんだよね。",
    emoji: "🎭", imageUrl: "/characters/ISFP.png", gradient: "from-lime-400 to-green-500", colorFrom: "#a3e635", colorTo: "#22c55e"
  },
  ESTP: {
    name: "バッテリー消費エグい最強のゲーム機",
    tagline: "今この瞬間を楽しむ歩く動画配信",
    description: "後先考えずに「とりあえずやってみよ！」で突っ走る、超アクティブなメンタル強者。ピンチになっても持ち前の瞬発力でなんか乗り切っちゃう。一緒にいると退屈な日常がジェットコースターみたいになるよ。",
    emoji: "🚀", imageUrl: "/characters/ESTP.png", gradient: "from-red-400 to-rose-500", colorFrom: "#f87171", colorTo: "#f43f5e"
  },
  ESFP: {
    name: "いいねとDM止まらないバズりSNS",
    tagline: "世界を沸かせる最強のエンターテイナー",
    description: "いつでもテンションMAXで、その場にいる全員を笑顔にする天才。寂しがり屋で常に誰かと繋がっていたいタイプだけど、その圧倒的な陽キャオーラで、どんな空気も一瞬でお祭り騒ぎに変えちゃう。",
    emoji: "🎉", imageUrl: "/characters/ESFP.png", gradient: "from-yellow-300 to-amber-400", colorFrom: "#fde047", colorTo: "#fbbf24"
  }
};

export const DEFAULT_TYPE: TypeInfo = {
  name: "分析中",
  tagline: "あなたの性格のクセを解読中",
  description: "しばらくお待ちください。",
  emoji: "🔍",
  gradient: "from-teal-400 to-teal-600",
  colorFrom: "#2dd4bf",
  colorTo: "#0d9488",
};
