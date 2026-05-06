// インフォグラフィックフォーマット用プリセットデータ

export type InfographicPreset = {
  id: string;
  title: string;
  tiktokCaption: string;
  inputProps: {
    theme: string;
    groupColor: "purple" | "green" | "blue" | "yellow";
    items: {
      mbtiType: string;
      catchphrase: string;
      description: string;
    }[];
  };
};

export const INFOGRAPHIC_PRESETS: InfographicPreset[] = [
  {
    id: "info_crush_purple",
    title: "💜 紫タイプ（分析家）の脈ありサイン",
    tiktokCaption: "【紫タイプ】分析家たちの脈ありサイン💜\nあまのじゃくすぎない…？😂\n\n詳しい相性診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #脈ありサイン #INTJ #INTP #ENTJ #ENTP",
    inputProps: {
      theme: "紫タイプ（分析家）の脈ありサイン",
      groupColor: "purple",
      items: [
        {
          mbtiType: "INTJ",
          catchphrase: "質問攻め＆身辺調査",
          description: "相手のことを知るため、気づかれないように脳内で相手のデータを収集・分析し始める。視線は合うがすぐ逸らす。"
        },
        {
          mbtiType: "INTP",
          catchphrase: "不器用な自己アピール",
          description: "普段は他人に興味がないのに、好きな人の前だと自分の知識を語ってしまったり、不自然に近くをうろついたりする。"
        },
        {
          mbtiType: "ENTJ",
          catchphrase: "問題解決のコンサル開始",
          description: "相手の悩みや課題を聞き出し、解決策を全力で提案し始める。時間や労力（コスト）を相手のために惜しみなく使う。"
        },
        {
          mbtiType: "ENTP",
          catchphrase: "わざとからかって反応を見る",
          description: "ちょっかいを出したり、あえて反論したりして相手の知性や反応をテストする。面白がっている＝好意の証。"
        }
      ]
    }
  },
  {
    id: "info_crush_green",
    title: "💚 緑タイプ（外交官）の脈ありサイン",
    tiktokCaption: "【緑タイプ】外交官たちの脈ありサイン💚\n感情ダダ漏れ？それとも隠す？🥺\n\n詳しい相性診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #脈ありサイン #INFJ #INFP #ENFJ #ENFP",
    inputProps: {
      theme: "緑タイプ（外交官）の脈ありサイン",
      groupColor: "green",
      items: [
        {
          mbtiType: "INFJ",
          catchphrase: "相手の色に密かに染まる",
          description: "好きな人が勧めていた音楽や本をこっそりチェックする。深い相談に乗ることで精神的な繋がりを作ろうとする。"
        },
        {
          mbtiType: "INFP",
          catchphrase: "遠くから見つめるだけ（重症）",
          description: "脳内ではすでに結婚まで妄想しているが、現実では目を合わせることもできず、ただ遠くから尊い存在として拝む。"
        },
        {
          mbtiType: "ENFJ",
          catchphrase: "過保護なほど世話を焼く",
          description: "「大丈夫？」「何か手伝おうか？」ととにかく気にかける。相手を特別扱いしているのが周りから見てもバレバレ。"
        },
        {
          mbtiType: "ENFP",
          catchphrase: "距離感バグ＆常に笑顔",
          description: "好きな人の前だとテンションが異常に高くなり、物理的な距離も近くなる。LINEの返信が秒で、スタンプも多め。"
        }
      ]
    }
  },
  {
    id: "info_crush_blue",
    title: "💙 青タイプ（番人）の脈ありサイン",
    tiktokCaption: "【青タイプ】番人たちの脈ありサイン💙\n分かりやすくて誠実すぎる！✨\n\n詳しい相性診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #脈ありサイン #ISTJ #ISFJ #ESTJ #ESFJ",
    inputProps: {
      theme: "青タイプ（番人）の脈ありサイン",
      groupColor: "blue",
      items: [
        {
          mbtiType: "ISTJ",
          catchphrase: "実用的なサポートの提供",
          description: "甘い言葉は言わないが、困っている時に具体的な手助け（仕事を手伝う、役立つ情報を送るなど）で行動を示す。"
        },
        {
          mbtiType: "ISFJ",
          catchphrase: "ささいな事をずっと覚えている",
          description: "「前にこれ好きって言ってたよね」と好物を差し入れたりする。相手の細かい変化（髪型や体調）に誰よりも早く気づく。"
        },
        {
          mbtiType: "ESTJ",
          catchphrase: "スケジュールを相手に合わせる",
          description: "超多忙でも、好きな人のためならどうにかして時間を作る。デートの計画を分刻みで完璧に立ててリードする。"
        },
        {
          mbtiType: "ESFJ",
          catchphrase: "とにかく褒める＆共感する",
          description: "「すごい！」「わかる！」と相手を全肯定し、気分良くさせる天才。好きな人の前では常に笑顔で、世話焼きお母さん化する。"
        }
      ]
    }
  },
  {
    id: "info_crush_yellow",
    title: "💛 黄タイプ（探検家）の脈ありサイン",
    tiktokCaption: "【黄タイプ】探検家たちの脈ありサイン💛\n直感と行動力で勝負！🔥\n\n詳しい相性診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #脈ありサイン #ISTP #ISFP #ESTP #ESFP",
    inputProps: {
      theme: "黄タイプ（探検家）の脈ありサイン",
      groupColor: "yellow",
      items: [
        {
          mbtiType: "ISTP",
          catchphrase: "自分の時間を割いてくれる",
          description: "一人の時間を何より愛する彼らが、LINEを続けたり、遊びの誘いに乗ったりする時点で、それは強烈な脈ありサイン。"
        },
        {
          mbtiType: "ISFP",
          catchphrase: "視線で追うが、話しかけられない",
          description: "よく目が合うのに、話しかけると照れてそっけなくなってしまう。好意を絵や音楽など、言葉以外の方法で匂わせることも。"
        },
        {
          mbtiType: "ESTP",
          catchphrase: "ストレートなアプローチ＆ボディタッチ",
          description: "駆け引きはしない。直接的に遊びに誘い、会話の中心に相手を据える。フットワークの軽さを活かしてグイグイ距離を詰める。"
        },
        {
          mbtiType: "ESFP",
          catchphrase: "エンターテイナーとして楽しませる",
          description: "好きな人を笑わせるために全力を尽くす。特別な体験（新しいカフェやイベント）を共有しようと、常にサプライズを用意する。"
        }
      ]
    }
  }
];
