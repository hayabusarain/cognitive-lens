export type MbtiType =
  | "INTJ" | "INTP" | "ENTJ" | "ENTP"
  | "INFJ" | "INFP" | "ENFJ" | "ENFP"
  | "ISTJ" | "ISFJ" | "ESTJ" | "ESFJ"
  | "ISTP" | "ISFP" | "ESTP" | "ESFP";

export interface CompatibilityEntry {
  bestPartner: {
    type: MbtiType;
    reason: string;
  };
  hardestMatch: {
    type: MbtiType;
    advice: string;
  };
}

export const COMPATIBILITY: Record<MbtiType, CompatibilityEntry> = {
  INTJ: {
    bestPartner: {
      type: "ENFP",
      reason: "脳内処理が速すぎて周りが引くレベルのINTJと、予測不能なアクションを起こし続けるENFP。一見カオスだけど、INTJのガチガチの予定にENFPが良い刺激を入れてくる最強のペア。お互いの足りない部分を補完し合ってる運命の二人！",
    },
    hardestMatch: {
      type: "ESFJ",
      advice: "ESFJの「みんなで位置情報共有しよう！」みたいなプレッシャーと、INTJの「非効率なものは避ける」っていうスタンスがなかなか噛み合わない。INTJ側が「感情のケアも大事なタスク」と割り切らないと、関係が崩れやすい。",
    },
  },
  INTP: {
    bestPartner: {
      type: "ENTJ",
      reason: "一人で情報を読み漁ってるだけのINTPに、ENTJが「で、それどうやって結果にするの？」と現実的なアドバイスを入れてくれる。INTPの規格外の頭脳をENTJが世に放つ、最強のプロデュース枠。",
    },
    hardestMatch: {
      type: "ESFJ",
      advice: "ESFJの「共感して！」っていう圧に、INTPが「いや、それ論理的に破綻してるよね」と正論で返して終わる。「正論」より「その場の空気」が大事な界隈もあることをINTPが理解しないとすれ違いが起きる。",
    },
  },
  ENTJ: {
    bestPartner: {
      type: "INTP",
      reason: "ENTJの圧倒的な行動力を、INTPの異常なまでの分析力が裏で完璧にバックアップ。ENTJが「これ話題にするぞ！」と言えば、INTPが「じゃあ一番効率いい仕組み作るわ」と即座に動く無双コンビ。",
    },
    hardestMatch: {
      type: "ISFP",
      advice: "ISFPの「平和に自分のペースで生きたい」っていうマイペースさを、ENTJの「もっと上目指せよ！」という圧がキャパオーバーさせてしまう。ISFPを「マイペースな職人」として尊重しないと、相手は逃げ出します。",
    },
  },
  ENTP: {
    bestPartner: {
      type: "INFJ",
      reason: "ENTPのちょっかいと暴走を、INFJだけが「また変わったことやってる」と広い心で受け止めてくれる。INFJのミステリアスな領域が、飽き性のENTPを惹きつける奇跡の組み合わせ。",
    },
    hardestMatch: {
      type: "ISFJ",
      advice: "「過去のルール（伝統）は守るべき」と言うISFJと、「ルールは変えるためにある」と言うENTP。ENTPがISFJの守ってきた大切な居場所を面白半分で荒らそうとするから修羅場になる。相手の平和へのリスペクトが必須。",
    },
  },
  INFJ: {
    bestPartner: {
      type: "ENTP",
      reason: "INFJの見せたくない本音や複雑な感情を、ENTPだけが偏見なしに面白がって読んでくれる。心に鍵をかけて疲れてるINFJにとって、ENTPのオープンなノリは最高のデトックスになる。",
    },
    hardestMatch: {
      type: "ESTJ",
      advice: "INFJのフワッとした「理想」を、ESTJが「で、具体的なエビデンスは？」と冷酷に切り捨てる。INFJが自分の感情を論理的に言語化するスキルを身につけないと、一切会話が成立しない相手。",
    },
  },
  INFP: {
    bestPartner: {
      type: "ENFJ",
      reason: "気持ちが沈みがちなINFPの複雑な感情を、圧倒的なコミュニケーション力を持つENFJが包容力で全肯定してくれる。INFPの理想の世界を現実に引き出してくれる、まさに王道ペア。",
    },
    hardestMatch: {
      type: "ESTJ",
      advice: "INFPの「自分らしさ」を、ESTJが「世間の常識からズレてる」と厳しい言葉で評価してしまう。ESTJのダメ出しに悪意はないとINFPが理解して、ESTJ側も小言を控えないと、INFPはすぐに逃亡する。",
    },
  },
  ENFJ: {
    bestPartner: {
      type: "INFP",
      reason: "みんなのお世話ばっかりして疲弊しがちなENFJを、INFPの純粋な優しさが裏で癒やしてくれる。ENFJが「私が頑張らなきゃ！」とキャパオーバーになってる時、INFPだけが「そのままで十分だよ」と限界を受け入れてくれる関係。",
    },
    hardestMatch: {
      type: "ISTP",
      advice: "ENFJの「みんなで一緒にやろう！」という熱いパッションを、ISTPが「一人でやるわ」と素っ気なく返す。ISTPのドライさを「嫌われた」と誤解せず、「そういう一人好きの仕様」だと割り切る心の広さが必要。",
    },
  },
  ENFP: {
    bestPartner: {
      type: "INTJ",
      reason: "ENFPの急な誘いに、INTJが呆れながらも完璧なスケジュール組んで付き合ってくれる。ENFPの「圧倒的な行動力」とINTJの「完璧な計画性」が合わさることで、お互いの人生の充実度が最大になる最強タッグ。",
    },
    hardestMatch: {
      type: "ISTJ",
      advice: "「とりあえずやってみよう！（無計画）」のENFPと、「まずはルールと計画を」のISTJ。ENFPの無計画な行動にISTJが怒る展開が起きやすい。ENFPが「ISTJの真面目さのおかげで自分が自由に行動できてる」と感謝しないと、速攻でフラれる。",
    },
  },
  ISTJ: {
    bestPartner: {
      type: "ESFP",
      reason: "ルーティンに縛られがちなISTJの真面目すぎる毎日に、ESFPが「今から遊ぼう！」と強引に連れ出して彩りを与えてくれる。ISTJがお金の管理をして、ESFPが遊びのプランを立てる、役割分担が素晴らしいペア。",
    },
    hardestMatch: {
      type: "ENFP",
      advice: "ENFPの「約束忘れてた！ごめん！」に、ルール至上主義のISTJが本気で怒る。ENFPのルーズさを「悪意」じゃなくて「少し抜けている」と見なして、スケジュール管理を代行してあげる寛大な心が必要。",
    },
  },
  ISFJ: {
    bestPartner: {
      type: "ESTP",
      reason: "常に周りの空気を読んで疲弊してるISFJを、ESTPの「細かいこと気にすんな！」という前向きなノリが救ってくれる。ESTPが外で活動して、ISFJが家（ホーム）を完璧に守る、安定感のあるペア。",
    },
    hardestMatch: {
      type: "ENTP",
      advice: "ISFJが死守してる「平和な日常」を、ENTPが「ちょっと変えてみた（笑）」とちょっかいを出してくるためストレスになる。ENTPのちょっかいを「いつものこと」として受け流すスキルがISFJには不可欠。",
    },
  },
  ESTJ: {
    bestPartner: {
      type: "ISFP",
      reason: "全部自分で仕切りたいESTJにとって、「決めるの苦手だからお任せしまーす」と大人しくついてきてくれるISFPは最高に互換性が良い。ESTJが安定を与えて、ISFPが忙しい日常に癒やしを与える完璧な関係。",
    },
    hardestMatch: {
      type: "INFJ",
      advice: "ESTJの「結果と効率が全て」というゴリ押しに対して、INFJの「目に見えない感情とか思想が大事」という価値観が全く噛み合わない。INFJの感情論を「めんどくさい」と切り捨てず、一度受け止める余裕が必須。",
    },
  },
  ESFJ: {
    bestPartner: {
      type: "ISTP",
      reason: "みんなの空気を読みすぎて気を使いまくるESFJにとって、周りを気にせず「我が道を行く」ISTPのブレなさが逆に最高の安心感になる。お互いに無理に合わせず、心地よい距離感を保てるペア。",
    },
    hardestMatch: {
      type: "INTJ",
      advice: "ESFJの「みんなでワイワイしよう！」という過剰な優しさを、INTJが「一人になりたいから連絡しないで」と遮断する。INTJの塩対応を「嫌われた」と受け取らず、「省エネモードに入っただけ」と放置するスキルが必要。",
    },
  },
  ISTP: {
    bestPartner: {
      type: "ESFJ",
      reason: "「連絡めんどいからお前が連絡しといて」というISTPの連絡不精なところを、ESFJの圧倒的なコミュニケーション力が全てカバーしてくれる。ISTPが物理的なトラブルを解決して、ESFJが人間関係を回す最強のコンビ。",
    },
    hardestMatch: {
      type: "ENFJ",
      advice: "ENFJの「私のことどう思ってる？ちゃんと愛情表現して！」というプレッシャーに、ISTPの省エネメンタルが耐えきれず逃亡する。ISTP側がたまには「好きだよ」と言葉で伝えないと、ENFJが不安になって自爆する。",
    },
  },
  ISFP: {
    bestPartner: {
      type: "ESTJ",
      reason: "自分で決断するのが苦手なISFPにとって、「私が全部予約しとくね」と引っ張ってくれるESTJは非常に頼りになる。ISFPはただニコニコついていくだけで、面倒な手配とかお金の管理は全部終わってる。",
    },
    hardestMatch: {
      type: "ENTJ",
      advice: "ENTJの「で、5年後のキャリアプランは？」という詰めに対して、ISFPが「今が楽しければ良くない？」と答えてすぐに関係が冷める。ENTJの意識の高さにISFPが限界を迎える前に、「私は私のペースで生きる」と線引きすることが重要。",
    },
  },
  ESTP: {
    bestPartner: {
      type: "ISFJ",
      reason: "後先考えずに行動するESTPのフォローを、ISFJが裏で完璧にこなしてくれる。ESTPが「俺すごいだろ！」と自慢して、ISFJが「すごいね」と優しく聞いてあげる。ESTPにとって、絶対に帰るべき「実家」のような存在になる。",
    },
    hardestMatch: {
      type: "INFJ",
      advice: "ESTPの「今さえ楽しければOK」というノリを、INFJが「人間として浅い」と心の底で見下してしまう危険がある。ESTPの行動力を「場当たり的」じゃなくて「自分にはない瞬発力」としてINFJがリスペクトできないと、関係は即終了する。",
    },
  },
  ESFP: {
    bestPartner: {
      type: "ISTJ",
      reason: "常にテンション高くて暴走するESFPを、ISTJが冷静に止めて管理してくれる。ESFPがお金を使いすぎてもISTJが貯金して、ISTJの退屈な日常はESFPが楽しくする。お互いの足りない部分を完璧に埋め合う最高のコンビ。",
    },
    hardestMatch: {
      type: "INTJ",
      advice: "ESFPの「超楽しい！！」というノリに、INTJが無表情で「何が面白いの？」と冷たい対応をする。ESFPが「この人マジでノリ悪い」と離れる前に、INTJの「口には出さないけど行動で示す優しさ」に気づけるかが勝負。",
    },
  },
};
