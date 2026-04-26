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
    id: "do_not_anger",
    title: "怒らせるとヤバいMBTI",
    tiktokCaption: "絶対に敵に回してはいけない。普段優しいのに怒らせたら人生終わる『隠れサイコパス』なMBTIは？\n第1位はヤバすぎて運営に消されるかもしれないので、自作サイトにまとめました。今すぐ『対人課題解決プラットフォーム』で検索してサイトで確認して。\n\n#MBTI #MBTI診断 #怒らせてはいけない #サイコパス #16タイプ診断 #性格診断",
    videoType: "top5",
    entries: [
      { mbtiType: "INFP", tier: "5", comment: "第5位 INFP。怒っても泣く事しかできず、後で一人で病む無害な羊" },
      { mbtiType: "ESTP", tier: "4", comment: "第4位 ESTP。物理的に手が出るか、一生残るトラウマ級の暴言を吐く" },
      { mbtiType: "ENFJ", tier: "3", comment: "第3位 ENFJ。正義の御旗を掲げ、逃げ場のない正論で社会的に抹殺する" },
      { mbtiType: "ISFJ", tier: "2", comment: "第2位 ISFJ。あなたの罪を一生忘れず、無言の圧力で精神を削り取る" },
      { mbtiType: "INFJ", tier: "1", comment: "第1位は、ヤバすぎて運営に動画を消されるかもしれないので、私の制作したウェブサイトで公開しています。『対人課題解決プラットフォーム』で検索してサイトを確認してください。", webAnswer: "相手の弱点を完璧に見抜き、一番えぐられる言葉で精神を完全に破壊する本物のサイコパスだから。" },
    ],
  },
  {
    id: "psychopath",
    title: "真のサイコパスランキング",
    tiktokCaption: "あなたの周りにも絶対いるヤバい奴…😱 第1位はヤバすぎて運営に消されるかもしれないので、自作サイトにまとめました。今すぐ『対人課題解決プラットフォーム』で検索して確認して！\n\n#MBTI #MBTI診断 #16タイプ診断 #サイコパス #性格診断 #性格テスト",
    videoType: "top5",
    entries: [
      { mbtiType: "INTJ", tier: "5", comment: "第5位 INTJ。脳内で完全犯罪のシミュレーションが既に終わっている" },
      { mbtiType: "ENTJ", tier: "4", comment: "第4位 ENTJ。目的達成のためなら冷酷な決断も一切躊躇しない" },
      { mbtiType: "ESTP", tier: "3", comment: "第3位 ESTP。スリルを求めて倫理観をたまにバグらせる" },
      { mbtiType: "ENTP", tier: "2", comment: "第2位 ENTP。息をするように嘘をつき、楽しそうに論破する" },
      { mbtiType: "INTP", tier: "1", comment: "第1位は、ヤバすぎて運営に動画を消されるかもしれないので、私の制作したウェブサイトで公開しています。『対人課題解決プラットフォーム』で検索してサイトを確認してください。", webAnswer: "倫理観すら「興味深い研究対象」として扱う、同情心ゼロの真性サイコパスだから。" },
    ],
  },
  {
    id: "rich_potential",
    title: "お金持ちになりやすいランキング",
    tiktokCaption: "将来お金持ちになりやすいMBTI一覧💸 第1位の具体的な年収がヤバすぎて自作サイトにまとめました。『対人課題解決プラットフォーム』で検索して確認して！\n\n#MBTI #MBTI診断 #お金持ち #金運 #16タイプ診断 #社長 #性格診断",
    videoType: "top5",
    entries: [
      { mbtiType: "ISTJ", tier: "5", comment: "第5位 ISTJ。超絶堅実な資産運用で絶対に損をしない" },
      { mbtiType: "ESTP", tier: "4", comment: "第4位 ESTP。リスクを恐れない行動力で一攫千金を掴む" },
      { mbtiType: "INTJ", tier: "3", comment: "第3位 INTJ。長期的な完璧な戦略で巨万の富を築く" },
      { mbtiType: "ENTJ", tier: "2", comment: "第2位 ENTJ。圧倒的なカリスマ性と統率力で大企業の社長になる" },
      { mbtiType: "ESTJ", tier: "1", comment: "第1位は、具体的な年収がヤバすぎて運営に動画を消されるかもしれないので、私の制作したウェブサイトで公開しています。『対人課題解決プラットフォーム』で検索してサイトを確認してください。", webAnswer: "感情に流されない圧倒的な現実主義で、お金を生み出す最強のシステムを作り上げるから。" },
    ],
  },
  {
    id: "cheating_tendency",
    title: "浮気しやすいランキング",
    tiktokCaption: "絶対に付き合ってはいけない浮気性MBTI💔 第1位はヤバすぎて運営に消されるかもしれないので、自作サイトにまとめました。今すぐ『対人課題解決プラットフォーム』で検索して確認して！\n\n#MBTI #MBTI診断 #16タイプ診断 #浮気 #恋愛 #性格診断",
    videoType: "top5",
    entries: [
      { mbtiType: "ISTP", tier: "5", comment: "第5位 ISTP。束縛を嫌い、気づいたら別のスリルを求めている" },
      { mbtiType: "ENFJ", tier: "4", comment: "第4位 ENFJ。誰にでも優しすぎるため、勘違いされて断りきれず沼る" },
      { mbtiType: "ENFP", tier: "3", comment: "第3位 ENFP。新しい刺激に弱く、運命の出会いだと錯覚して浮気する" },
      { mbtiType: "ESTP", tier: "2", comment: "第2位 ESTP。息をするように口説き、バレても一切反省しない" },
      { mbtiType: "ESFP", tier: "1", comment: "第1位は、ヤバすぎて運営に動画を消されるかもしれないので、私の制作したウェブサイトで公開しています。『対人課題解決プラットフォーム』で検索してサイトを確認してください。", webAnswer: "誘惑に弱すぎる上に「今が楽しければいい」という本能だけで生きている生粋のパリピだから。" },
    ],
  },
];
