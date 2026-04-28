import { TierListEntry } from "../remotion/TierListVideo";

export type PresetTierList = {
  id: string;
  title: string;
  tiktokCaption?: string;
  videoType?: "tier-list" | "top5"; // デフォルトはtier-list
  entries: Omit<TierListEntry, "imageUrl" | "ttsUrl">[]; // imageUrlとttsUrlは動的に付与する
};

export const PRESET_TIER_LISTS: PresetTierList[] = [
  {
    id: "toxic_partner",
    title: "メンヘラ製造機ランキング",
    tiktokCaption: "関わったら最後、相手の精神を崩壊させる『メンヘラ製造機』は誰？ 第1位は被害者が多すぎて運営に消されるかもしれないので、自作サイトにまとめました。今すぐ『対人課題解決プラットフォーム』で検索して確認して！ #16タイプ #性格診断 #恋愛 #メンヘラ製造機",
    videoType: "top5",
    entries: [
      { mbtiType: "ISTP", tier: "5", comment: "第5位 ISTP。連絡を急に無視し、相手を不安のどん底に突き落とす" },
      { mbtiType: "INTP", tier: "4", comment: "第4位 INTP。感情を理詰めで論破し、相手の存在価値をバグらせる" },
      { mbtiType: "ENTP", tier: "3", comment: "第3位 ENTP。息を吐くように嘘と冗談を混ぜ、相手を翻弄し続ける" },
      { mbtiType: "ENFJ", tier: "2", comment: "第2位 ENFJ。優しすぎて依存させ、ある日突然見捨てて地獄に落とす" },
      { mbtiType: "ESTP", tier: "1", comment: "第1位は、ヤバすぎて運営に動画を消されるかもしれないので、私の制作したウェブサイトで公開しています。『対人課題解決プラットフォーム』で検索してサイトを確認してください。", webAnswer: "天性の人たらしで相手を本気にさせるが、本人はただのゲーム感覚でしかない冷酷なプレデターだから。" },
    ],
  },
  {
    id: "unintentional_hurt",
    title: "無自覚に人を傷つけるランキング",
    tiktokCaption: "悪気はないのに言葉のナイフで人の心をえぐるタイプは？ 第1位はサイコパスすぎて消されるかもしれないので、自作サイトにまとめました。今すぐ『対人課題解決プラットフォーム』で検索して！ #16タイプ #性格診断 #無自覚 #サイコパス",
    videoType: "top5",
    entries: [
      { mbtiType: "ESTJ", tier: "5", comment: "第5位 ESTJ。正論という名の物理打撃で、相手の心をへし折る" },
      { mbtiType: "ISTJ", tier: "4", comment: "第4位 ISTJ。ルール絶対主義で、相手の感情を1ミリも考慮しない" },
      { mbtiType: "ENTJ", tier: "3", comment: "第3位 ENTJ。効率を求めすぎて、相手の努力を鼻で笑って切り捨てる" },
      { mbtiType: "INTP", tier: "2", comment: "第2位 INTP。悪気なく「それ意味なくない？」と言い放ち、全てを無に帰す" },
      { mbtiType: "INTJ", tier: "1", comment: "第1位は、ヤバすぎて運営に動画を消されるかもしれないので、私の制作したウェブサイトで公開しています。『対人課題解決プラットフォーム』で検索してサイトを確認してください。", webAnswer: "脳内の完璧な論理をそのまま出力するため、相手のメンタルが耐えられないことを計算できていないから。" },
    ],
  },
  {
    id: "zombie_survival",
    title: "ゾンビサバイバル生存率ランキング",
    tiktokCaption: "世界が終わった時、最後まで生き残れる最強のタイプは？ 第1位の生存理由がヤバすぎて運営に消されるかもしれないので、自作サイトにまとめました。『対人課題解決プラットフォーム』で検索してね！ #16タイプ #性格診断 #サバイバル #終末",
    videoType: "top5",
    entries: [
      { mbtiType: "ESTP", tier: "5", comment: "第5位 ESTP。圧倒的な身体能力とスリル狂で、ゾンビの群れに突っ込む" },
      { mbtiType: "INTJ", tier: "4", comment: "第4位 INTJ。他者を囮にする完璧な防衛拠点を構築し、安全圏から見下ろす" },
      { mbtiType: "ENTJ", tier: "3", comment: "第3位 ENTJ。生存者を集めて軍隊を作り、武力で世界を制圧する" },
      { mbtiType: "ISTJ", tier: "2", comment: "第2位 ISTJ。備蓄とルールを完璧に管理し、感情を捨てて生存に特化する" },
      { mbtiType: "ISTP", tier: "1", comment: "第1位は、ヤバすぎて運営に動画を消されるかもしれないので、私の制作したウェブサイトで公開しています。『対人課題解決プラットフォーム』で検索してサイトを確認してください。", webAnswer: "あらゆるガラクタから武器を作り出し、孤高のハンターとしてゾンビ狩りを楽しむ生粋の戦闘狂だから。" },
    ],
  },
  {
    id: "master_manipulator",
    title: "天才的な詐欺師ランキング",
    tiktokCaption: "息をするように人を操る…詐欺師の才能がずば抜けているタイプは？ 第1位の洗脳手法がガチでヤバいので、自作サイトにまとめました。今すぐ『対人課題解決プラットフォーム』で検索！ #16タイプ #性格診断 #天才 #詐欺師",
    videoType: "top5",
    entries: [
      { mbtiType: "ESTP", tier: "5", comment: "第5位 ESTP。持ち前の度胸と話術で、その場のノリで相手を騙し切る" },
      { mbtiType: "ENFJ", tier: "4", comment: "第4位 ENFJ。正義の味方を演じ、信者を作って合法的に搾取する" },
      { mbtiType: "INFJ", tier: "3", comment: "第3位 INFJ。教祖のようなオーラで相手のトラウマに付け込み、洗脳する" },
      { mbtiType: "ENTP", tier: "2", comment: "第2位 ENTP。圧倒的な詭弁で、気づけば相手からお金を差し出させる" },
      { mbtiType: "ENFP", tier: "1", comment: "第1位は、ヤバすぎて運営に動画を消されるかもしれないので、私の制作したウェブサイトで公開しています。『対人課題解決プラットフォーム』で検索してサイトを確認してください。", webAnswer: "本人すら嘘をついている自覚がなく、純粋な瞳で信じ込ませる無自覚な天才ペテン師だから。" },
    ],
  },
  {
    id: "single_forever",
    title: "一生独身かもしれないランキング",
    tiktokCaption: "恋愛不適合者！？一生独身の可能性が一番高いタイプは？ 衝撃の第1位とその理由は、自作サイトにまとめました。今すぐ『対人課題解決プラットフォーム』で検索して！ #16タイプ #性格診断 #独身 #恋愛",
    videoType: "top5",
    entries: [
      { mbtiType: "ISTP", tier: "5", comment: "第5位 ISTP。一人の時間が好きすぎて、他人が介入する余地が1ミリもない" },
      { mbtiType: "INFJ", tier: "4", comment: "第4位 INFJ。理想が高すぎて、現実の人間にすぐ絶望してシャッターを下ろす" },
      { mbtiType: "ENTP", tier: "3", comment: "第3位 ENTP。飽きっぽすぎて、関係が安定した瞬間に全てを壊したくなる" },
      { mbtiType: "INTJ", tier: "2", comment: "第2位 INTJ。恋愛を「非効率なバグ」とみなし、ロマンスの概念を理解しない" },
      { mbtiType: "INTP", tier: "1", comment: "第1位は、ヤバすぎて運営に動画を消されるかもしれないので、私の制作したウェブサイトで公開しています。『対人課題解決プラットフォーム』で検索してサイトを確認してください。", webAnswer: "三次元の恋愛よりも自分の趣味や研究の方が100倍面白いと本気で思っているから。" },
    ],
  },
  {
    id: "demonic_past_life",
    title: "前世が間違いなく悪魔ランキング",
    tiktokCaption: "人間の皮を被った悪魔…一番邪悪な魂を持っているタイプは？ 第1位のサイコパス性がヤバすぎるので、自作サイトにまとめました。今すぐ『対人課題解決プラットフォーム』で検索して！ #16タイプ #性格診断 #悪魔 #サイコパス",
    videoType: "top5",
    entries: [
      { mbtiType: "ESTP", tier: "5", comment: "第5位 ESTP。退屈しのぎに人の関係をクラッシュさせて笑っている" },
      { mbtiType: "ENTP", tier: "4", comment: "第4位 ENTP。相手がキレるギリギリのラインを反復横跳びして楽しむ" },
      { mbtiType: "INTJ", tier: "3", comment: "第3位 INTJ。冷徹なチェスプレイヤーのように、人間をただの駒として扱う" },
      { mbtiType: "ENTJ", tier: "2", comment: "第2位 ENTJ。覇王色の覇気で他人を平伏させ、逆らう者は完膚なきまでに叩き潰す" },
      { mbtiType: "INFJ", tier: "1", comment: "第1位は、ヤバすぎて運営に動画を消されるかもしれないので、私の制作したウェブサイトで公開しています。『対人課題解決プラットフォーム』で検索してサイトを確認してください。", webAnswer: "一番の理解者のフリをして最大の弱点を探り、裏切られた時には最も残酷な復讐を実行するから。" },
    ],
  },
];
