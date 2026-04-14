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
      reason: "ENFPの広大な可能性思考が、INTJの緻密な戦略に生命力を与える。直観と思考を軸に共鳴し合い、互いの認知的盲点を精密に補完する。",
    },
    hardestMatch: {
      type: "ESFJ",
      advice: "ESFJの感情ベースの合意形成と、INTJの論理優先の判断スタイルは根本的に衝突する。相手の「感情的配慮」を非効率なノイズではなく、組織の潤滑剤として再定義することが唯一の緩和策になる。",
    },
  },
  INTP: {
    bestPartner: {
      type: "ENTJ",
      reason: "INTPの深い分析力とENTJの実行力が組み合わさると、思考が具体的な成果に直結する。INTPが見つけた構造をENTJが世界に実装する、という分業が自然に成立する。",
    },
    hardestMatch: {
      type: "ESFJ",
      advice: "ESFJが求める感情的な同調と、INTPの客観的・批判的な思考スタイルは摩擦を生みやすい。「正しさ」より「関係性の維持」が優先される場面があることを、知的に理解するだけで状況は変わる。",
    },
  },
  ENTJ: {
    bestPartner: {
      type: "INTP",
      reason: "INTPの緻密な論理分析が、ENTJの意思決定の質を根本から高める。INTPが構造を提示し、ENTJがそれを組織に実装するという連携は、双方の機能を最大化する。",
    },
    hardestMatch: {
      type: "ISFP",
      advice: "ISFPの価値観優先の行動様式は、ENTJの目標至上主義と衝突する。ISFPを「非効率な行動者」ではなく「異なる最適化基準を持つ専門家」と捉え直すことが、摩擦を減らす唯一の方法になる。",
    },
  },
  ENTP: {
    bestPartner: {
      type: "INFJ",
      reason: "INFJの深い洞察力とENTPの発散的思考が融合すると、現実的な制約の中で最も革新的なアイデアが生まれる。INFJがENTPの思考に意味と方向性を与える。",
    },
    hardestMatch: {
      type: "ISFJ",
      advice: "ISFJが守ろうとする伝統・手順・安定感は、ENTPが本能的に解体しようとするものと同じである。変化の提案を「前例の否定」ではなく「改善の提案」として丁寧に包むことが、摩擦を最小化する。",
    },
  },
  INFJ: {
    bestPartner: {
      type: "ENTP",
      reason: "ENTPの知的な挑発がINFJの内側にある洞察を引き出し、INFJの深みがENTPの思考に着地点を与える。互いの知性が最も鮮明に機能する組み合わせ。",
    },
    hardestMatch: {
      type: "ESTJ",
      advice: "ESTJの「現実・効率・先例」への執着は、INFJの直観的なビジョンを体系的に否定することがある。ESTJが求める具体的な根拠を先に提示してから、概念を展開する順序が、唯一の解決策になる。",
    },
  },
  INFP: {
    bestPartner: {
      type: "ENFJ",
      reason: "ENFJの温かい構造化能力が、INFPの豊かな内面世界を外部に接続させる。INFPが感じていることをENFJが言語化・組織化してくれる感覚は、このタイプにとって稀有な安心感になる。",
    },
    hardestMatch: {
      type: "ESTJ",
      advice: "ESTJの直接的な批評と規則への固執は、INFPの価値観と感性に正面から衝突する。ESTJの「効率化」がINFPの「意味の破壊」に見える構造を理解し、互いの優先軸が異なることを前提に置く必要がある。",
    },
  },
  ENFJ: {
    bestPartner: {
      type: "INFP",
      reason: "INFPの深い内省と感性がENFJに「動かすべき方向」を示し、ENFJの実行力がINFPの理想を現実に着地させる。互いが互いの盲点を照らす、稀有な相互補完関係。",
    },
    hardestMatch: {
      type: "ISTP",
      advice: "ISTJの感情への無関心と即物的なコミュニケーションは、ENFJの関係構築の努力を完全に空振りさせることがある。ISTJを「共感できない人間」ではなく「異なる信頼構築プロトコルを持つ人間」として再定義することが鍵になる。",
    },
  },
  ENFP: {
    bestPartner: {
      type: "INTJ",
      reason: "ENFPの可能性の爆発的な生成力と、INTJの戦略的な絞り込み能力は、互いに欠けているものを精密に補い合う。この組み合わせが最も大きな構造的変化を生む。",
    },
    hardestMatch: {
      type: "ISTJ",
      advice: "ISTJの「前例・手順・安定」への強い愛着は、ENFPの即興的な創造性と真っ向から対立する。ISTJが積み上げてきた経験の価値を尊重する姿勢を見せることが、信頼関係構築の唯一の入口になる。",
    },
  },
  ISTJ: {
    bestPartner: {
      type: "ESFP",
      reason: "ESFPの即興性と人を動かす熱量が、ISTJの堅牢な構造に生命力を与える。ISTJが設計した安全な枠の中でESFPが輝き、ESFPがISTJに現在の楽しさを思い出させる。",
    },
    hardestMatch: {
      type: "ENFP",
      advice: "ENFPの自由奔放なアイデア生成と計画への無頓着さは、ISTJの秩序感覚を体系的に侵食する。ENFPの意図を「破壊」ではなく「未整理の可能性」と見なし、構造化のサポート役に回ることで関係が機能し始める。",
    },
  },
  ISFJ: {
    bestPartner: {
      type: "ESTP",
      reason: "ESTPのエネルギーと行動力が、ISFJの深い配慮と安定性に活力を与える。ISFJがESTPの衝動に安全な着地点を提供し、ESTPがISFJに外の世界を見せる。",
    },
    hardestMatch: {
      type: "ENTP",
      advice: "ENTPの批判的な議論スタイルと既存の仕組みへの解体衝動は、ISFJが守ろうとする安定と伝統に真正面から衝突する。ENTPの挑発を「攻撃」ではなく「知的な実験」と解釈する余裕が、唯一の緩和策になる。",
    },
  },
  ESTJ: {
    bestPartner: {
      type: "ISFP",
      reason: "ISFPの感性と価値観への忠実さが、ESTJの実行中心の世界に人間的な温度を加える。ESTJがISFPに構造と安全を提供し、ISFPがESTJに「数字に見えないもの」の価値を教える。",
    },
    hardestMatch: {
      type: "INFJ",
      advice: "INFJの抽象的な洞察と長期的なビジョンは、ESTJの即物的・現実的な判断軸には証拠不十分に映る。INFJの直観を「根拠のない感情」ではなく「未言語化された深い分析」として扱う転換が、唯一の接点を生む。",
    },
  },
  ESFJ: {
    bestPartner: {
      type: "ISTP",
      reason: "ISTPの冷静な技術力と問題解決能力が、ESFJの対人構築力と融合すると、実効性のある人間関係が生まれる。ESFJがISTPに社会的文脈を提供し、ISTPがESFJに感情に左右されない判断軸を示す。",
    },
    hardestMatch: {
      type: "INTJ",
      advice: "INTJの感情への無関心と独自路線への固執は、ESFJが構築しようとする調和的な場を解体することがある。INTJを「冷たい人間」ではなく「異なる優先軸を持つ戦略家」と再定義することで、過度な期待による消耗を避けられる。",
    },
  },
  ISTP: {
    bestPartner: {
      type: "ESFJ",
      reason: "ESFJの人間関係の知性と温かさが、ISTPの技術的な能力に社会的な文脈を与える。ISTPが問題を解決し、ESFJがその解決を人間関係に翻訳する、という自然な分業が成立する。",
    },
    hardestMatch: {
      type: "ENFJ",
      advice: "ENFJの感情的な関与と承認欲求は、ISTJの独立性と省エネな対人スタイルに重大な負荷をかける。ENFJを「要求が多い人間」ではなく「異なるエネルギー補充方式を持つ存在」と理解することが、関係を持続させる唯一の方法になる。",
    },
  },
  ISFP: {
    bestPartner: {
      type: "ESTJ",
      reason: "ESTJの明確な構造と実行力が、ISFPの感性と創造性に安全な土台を与える。ISFPが美と意味を生み出し、ESTJがそれを世界に届ける形にする。",
    },
    hardestMatch: {
      type: "ENTJ",
      advice: "ENTJの目標至上主義と高速な意思決定は、ISFPの価値観ベースのゆっくりとした処理スタイルを圧迫する。ENTJの「なぜそんなに遅いのか」という問いが、ISFPの自己否定につながる前に、互いの時間軸の違いを明示する必要がある。",
    },
  },
  ESTP: {
    bestPartner: {
      type: "ISFJ",
      reason: "ISFJの深い配慮と安定的な環境構築能力が、ESTPの行動エネルギーに持続的な基盤を与える。ESTPが動き、ISFJがその後方を固める、という自然な補完関係が生まれる。",
    },
    hardestMatch: {
      type: "INFJ",
      advice: "INFJの抽象的な思考と長期的視野は、ESTPの現実直視・即行動のスタイルには非実用的に映る。INFJの「感じ取り」を「役に立たないポエム」ではなく「長期リスクの早期探知」として機能的に再解釈することが、摩擦を最小化する。",
    },
  },
  ESFP: {
    bestPartner: {
      type: "ISTJ",
      reason: "ISTJの堅牢な構造と信頼性が、ESFPのエネルギーと人を動かす力に安定した基盤を提供する。ESFPが人を引きつけ、ISTJがその場を持続可能にする、という組み合わせは強力に機能する。",
    },
    hardestMatch: {
      type: "INTJ",
      advice: "INTJの内省的な戦略思考と感情への距離感は、ESFPの即興的・感情的なコミュニケーションとは根本から噛み合わない。INTJを「つまらない人間」ではなく「表現方法が異なる知性」として捉え直すことが、唯一の接続点になる。",
    },
  },
};
