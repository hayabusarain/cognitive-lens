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
      reason: "バチバチに頭の回転が速いINTJと、思いつきで暴走する陽キャのENFP。一見カオスだけど、INTJのガチガチの計画にENFPが「エモさ」と「楽しさ」を吹き込む最強のバディ。お互いの欠点を神レベルでカバーし合える運命のペア！",
    },
    hardestMatch: {
      type: "ESFJ",
      advice: "ESFJの「みんなの空気を読もうよ！」という同調圧力と、INTJの「非効率な群れは無駄」という価値観がマジで一生噛み合わない。INTJ側が「感情的配慮もシステムの一部」だと割り切って大人にならないと、即レスバ発生の危険度MAX。",
    },
  },
  INTP: {
    bestPartner: {
      type: "ENTJ",
      reason: "頭の中で宇宙の真理を考えてるだけのINTPに、ENTJが「で、それどうやって金（結果）にするの？」と現実的な着地点を与えてくれる。INTPのチート級のアイデアをENTJが世に放つ、最強のビジネス＆恋愛パートナー。",
    },
    hardestMatch: {
      type: "ESFJ",
      advice: "ESFJの「共感して！」という圧に、INTPが「いや、論理的に破綻してるよね」とマジレスして即終了する。「正論」より「その場の空気」が大事な世界線もあることをINTPが理解しないと一生平行線。",
    },
  },
  ENTJ: {
    bestPartner: {
      type: "INTP",
      reason: "ENTJの圧倒的な行動力を、INTPの異常なまでの分析力が裏で完璧にバックアップ。ENTJが「これやるぞ！」と言えば、INTPが「じゃあ一番効率のいいシステム組むわ」と即座に動く。互いの有能さに惚れ込む無双コンビ。",
    },
    hardestMatch: {
      type: "ISFP",
      advice: "ISFPの「自分のペースで平和に生きたい」というチルな価値観を、ENTJの「結果を出せ！動け！」という圧が完全にぶっ壊す。ISFPを「マイペースな専門家」として尊重しないと、相手はメンブレして逃げ出します。",
    },
  },
  ENTP: {
    bestPartner: {
      type: "INFJ",
      reason: "ENTPの暴走気味なアイデアとウザ絡みを、INFJだけが「また変なこと言ってるw」と海のような広い心で受け止めてくれる。INFJのミステリアスな深みが、飽き性のENTPを一生沼らせる奇跡の組み合わせ。",
    },
    hardestMatch: {
      type: "ISFJ",
      advice: "「前例がないからダメ」と言うISFJと、「ルールは破るためにあるっしょw」と言うENTP。ENTPがISFJの守ってきた伝統を面白半分で解体しようとするため、ガチで修羅場になりやすい。相手の地道な努力へのリスペクトが必須。",
    },
  },
  INFJ: {
    bestPartner: {
      type: "ENTP",
      reason: "INFJの内面にあるドス黒い闇や複雑な思考を、ENTPだけが偏見なしに面白がって引き出してくれる。優等生を演じて疲れているINFJにとって、ENTPの自由さは最高のデトックスになる。",
    },
    hardestMatch: {
      type: "ESTJ",
      advice: "INFJのフワッとした「直感」や「理想」を、ESTJが「で、エビデンス（証拠）は？」と冷酷に切り捨てる。INFJが自分の感情を論理的に言語化してプレゼンするスキルを身につけないと、一切話が通じない相手。",
    },
  },
  INFP: {
    bestPartner: {
      type: "ENFJ",
      reason: "メンブレしがちなINFPの複雑な心を、コミュ力お化けのENFJが圧倒的な肯定力で全受容してくれる。INFPの理想のロマンスを現実のものにしてくれる、まさに「スパダリ（スーパーダーリン）」と「ヒロイン」の王道ペア。",
    },
    hardestMatch: {
      type: "ESTJ",
      advice: "INFPの「自分らしさ」を、ESTJが「常識がない」「効率が悪い」と正論でフルボッコにしてしまう。ESTJの言葉に悪意はないとINFPが頭で理解し、ESTJ側もオカンみたいな小言を控えないと、INFPは泣いて逃亡する。",
    },
  },
  ENFJ: {
    bestPartner: {
      type: "INFP",
      reason: "他人の世話ばかり焼いて疲弊しがちなENFJを、INFPの純粋な優しさが裏で癒やしてくれる。ENFJが「私が引っ張らなきゃ！」と無理をしている時、INFPだけが「そのままで十分だよ」と本当の弱さを受け入れてくれる尊い関係。",
    },
    hardestMatch: {
      type: "ISTP",
      advice: "ENFJの「みんなで一緒に頑張ろう！」という熱いパッションを、ISTPが「めんどくさ。俺一人でやるわ」と秒でスルーする。ISTPのドライさを「嫌われている」と誤解せず、「そういう生態の生き物」だと割り切るスルースキルが必要。",
    },
  },
  ENFP: {
    bestPartner: {
      type: "INTJ",
      reason: "ENFPの突発的なアホみたいな誘いに、INTJが呆れながらも完璧なスケジュールを作って付き合ってくれる。ENFPの「楽しさ」とINTJの「計画性」が合わさることで、お互いの人生の充実度がカンストする最強タッグ。",
    },
    hardestMatch: {
      type: "ISTJ",
      advice: "「とりあえずやってみよう！」のENFPと、「計画書を出せ」のISTJ。ENFPの無計画さにISTJがガチギレする展開がデフォ。ENFPが「ISTJの堅実さのおかげで自分が自由にできている」と感謝を伝えないと、関係は一瞬で氷点下に。",
    },
  },
  ISTJ: {
    bestPartner: {
      type: "ESFP",
      reason: "ルーティンに縛られがちなISTJの堅物な日常を、ESFPが「今から遊ぼうぜ！」と強引にぶっ壊して楽しい世界に連れ出してくれる。ISTJが財布と予定を管理し、ESFPがエンタメを担当する、役割分担が神がかったペア。",
    },
    hardestMatch: {
      type: "ENFP",
      advice: "ENFPの「約束忘れてた！テヘペロ！」という態度に、ルール至上主義のISTJの堪忍袋の緒がブチ切れる。ENFPの行動を「悪意のある裏切り」ではなく「ただのポンコツ」と見なして、スケジュール管理を代行する仏の心が必要。",
    },
  },
  ISFJ: {
    bestPartner: {
      type: "ESTP",
      reason: "気遣いしすぎて疲れるISFJを、ESTPの「細かいこと気にすんな！」という脳天気な明るさが救ってくれる。ESTPが外で暴れ回り、ISFJが家（ホーム）を完璧に守るという、昭和の夫婦のような謎の安定感を誇る。",
    },
    hardestMatch: {
      type: "ENTP",
      advice: "ISFJが大切にしている「平和な日常」を、ENTPが「あえて逆張りしてみたw」と荒らしに来るためストレスがマッハ。ENTPのウザ絡みを「いつもの発作」として右から左へ受け流すスルー力（りょく）がISFJには不可欠。",
    },
  },
  ESTJ: {
    bestPartner: {
      type: "ISFP",
      reason: "仕事も恋愛もゴリゴリ仕切りたいESTJにとって、「全部お任せしまーす」とニコニコついてきてくれるISFPは最高に居心地が良い。ESTJが安心感を与え、ISFPが生活に彩りを与える、完璧な補完関係。",
    },
    hardestMatch: {
      type: "INFJ",
      advice: "ESTJの「目に見える結果が全て」というゴリ押しに対して、INFJの「心の繋がりが大事」というスピリチュアル寄りの主張が全く噛み合わない。INFJの直感を「根拠のないポエム」と切り捨てず、一度立ち止まって聞く耳を持つことが必須。",
    },
  },
  ESFJ: {
    bestPartner: {
      type: "ISTP",
      reason: "空気を読みすぎて消耗するESFJにとって、一切空気を読まずに「自分は自分」を貫くISTPのブレなさが逆に最高の安心感になる。お互いに過度な干渉をせず、心地よい距離感を保てる大人なペア。",
    },
    hardestMatch: {
      type: "INTJ",
      advice: "ESFJの「みんなでワイワイしよう！」という愛の押し売りを、INTJが「一人になりたい」と冷酷にシャットアウトする。INTJの塩対応を「自分への拒絶」と受け取らず、「充電モードに入った」と放置プレイする余裕がESFJには必要。",
    },
  },
  ISTP: {
    bestPartner: {
      type: "ESFJ",
      reason: "「俺は喋るのダルいからお前が喋って」というISTPのコミュ障ぶりを、ESFJの圧倒的な社交性が全てカバーしてくれる。ISTPが物理的なトラブル（DIYやPC修理）を解決し、ESFJが人間関係を回す最強の分業制。",
    },
    hardestMatch: {
      type: "ENFJ",
      advice: "ENFJの「私のことどれくらい好き？ちゃんと向き合って！」という重すぎる愛情確認作業に、ISTPの省エネメンタルが耐えきれず逃亡する。ISTP側がたまには言葉で「好き」と伝えないと、ENFJが勝手に闇落ちして自爆する。",
    },
  },
  ISFP: {
    bestPartner: {
      type: "ESTJ",
      reason: "自分で決断するのが苦手なISFPにとって、「私が全部決めてやる」とグイグイ引っ張ってくれるESTJは究極のスパダリ（スーパーダーリン）。ISFPはただニコニコ横にいるだけで、面倒な手続きや予約は全て完了している。",
    },
    hardestMatch: {
      type: "ENTJ",
      advice: "ENTJの「で、5年後のキャリアプランは？」という詰めに対して、ISFPが「今が楽しければ良くない？」と答えて秒でフラグが折れる。ENTJのプレッシャーにISFPが押し潰される前に、「私は私のペースで生きる」と線引きすることが重要。",
    },
  },
  ESTP: {
    bestPartner: {
      type: "ISFJ",
      reason: "後先考えずに突っ走るESTPの尻拭いを、ISFJが裏で完璧にこなしてくれる。ESTPが「俺スゲーだろ！」と自慢し、ISFJが「すごいね」と優しく見守る。ESTPにとって、絶対に帰るべき「港」のような存在になる。",
    },
    hardestMatch: {
      type: "INFJ",
      advice: "ESTPの「今さえ良ければOK」というノリを、INFJが「人間として浅い」と心の底で見下してしまう危険がある。ESTPの行動力を「浅はか」ではなく「自分にはない実行力」としてINFJがリスペクトできないと、関係は即終了する。",
    },
  },
  ESFP: {
    bestPartner: {
      type: "ISTJ",
      reason: "常にテンションMAXで暴走するESFPの手綱を、ISTJが冷静に握ってくれる。ESFPが金欠になってもISTJが家計を管理し、ISTJの退屈な休日はESFPがテーマパークに変える。お互いが絶対に必要な最高の凸凹コンビ。",
    },
    hardestMatch: {
      type: "INTJ",
      advice: "ESFPの「イェーイ！」というノリに、INTJが無表情で「うるさい」と言い放つ地獄絵図。ESFPが「この人マジでノリ悪い」と見限る前に、INTJの「静かな愛情（行動で示す優しさ）」に気づけるかが勝負の分かれ目。",
    },
  },
};
