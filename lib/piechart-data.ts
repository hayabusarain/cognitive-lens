// 脳内円グラフフォーマット用プリセットデータ（10個）

export type PieChartPreset = {
  id: string;
  title: string;
  tiktokCaption: string;
  inputProps: {
    theme: string;
    charts: {
      mbtiType: string;
      slices: { label: string; percentage: number }[];
    }[];
  };
};

export const PIECHART_PRESETS: PieChartPreset[] = [
  {
    id: "pie_brain_contents",
    title: "🧠 MBTI別・頭の中身",
    tiktokCaption: "MBTI別の頭の中身を円グラフにしたら差がエグい🧠\nあなたの脳内、当たってる？\n\n詳しい診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #性格診断 #脳内 #円グラフ #mbtiあるある #あるある #性格タイプ",
    inputProps: {
      theme: "MBTI別・頭の中身を円グラフにしてみた🧠",
      charts: [
        { mbtiType: "ESTP", slices: [{ label: "今夜の予定・遊び", percentage: 40 }, { label: "スリルと刺激", percentage: 30 }, { label: "謎の自信", percentage: 20 }, { label: "本能", percentage: 10 }] },
        { mbtiType: "ISFJ", slices: [{ label: "あの人、大丈夫かな？", percentage: 40 }, { label: "波風を立てない気遣い", percentage: 30 }, { label: "昔の黒歴史の記憶", percentage: 20 }, { label: "自分の本当の欲求", percentage: 10 }] },
        { mbtiType: "ENTP", slices: [{ label: "面白そうなアイデア", percentage: 40 }, { label: "誰かを論破したい欲", percentage: 30 }, { label: "飽き", percentage: 20 }, { label: "常識", percentage: 10 }] },
        { mbtiType: "INFP", slices: [{ label: "妄想・空想の世界", percentage: 40 }, { label: "推しへの愛", percentage: 30 }, { label: "人間関係の疲れ", percentage: 20 }, { label: "現実", percentage: 10 }] },
        { mbtiType: "ESTJ", slices: [{ label: "タスク・To-Doリスト", percentage: 40 }, { label: "効率化", percentage: 30 }, { label: "ルールと規律", percentage: 20 }, { label: "他人への苛立ち", percentage: 10 }] },
        { mbtiType: "INFJ", slices: [{ label: "人類の未来について", percentage: 40 }, { label: "他人の感情スポンジ", percentage: 30 }, { label: "完璧主義", percentage: 20 }, { label: "一人の時間が欲しい", percentage: 10 }] },
        { mbtiType: "ESFP", slices: [{ label: "楽しいこと！", percentage: 40 }, { label: "今の気分", percentage: 30 }, { label: "みんなでワイワイ", percentage: 20 }, { label: "ノリと勢い", percentage: 10 }] },
      ],
    },
  },
  {
    id: "pie_before_date",
    title: "🧠 初デート前の脳内",
    tiktokCaption: "初デート前の脳内がMBTI別に差がありすぎる💕🧠\nドキドキ vs 作戦会議\n\n詳しい診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #初デート #脳内 #恋愛 #性格診断 #mbtiあるある",
    inputProps: {
      theme: "初デート前のMBTI別・脳内円グラフ💕🧠",
      charts: [
        { mbtiType: "INFP", slices: [{ label: "妄想（結婚式の演出）", percentage: 45 }, { label: "服 これでいい？不安", percentage: 25 }, { label: "会話シミュレーション", percentage: 20 }, { label: "逃げたい", percentage: 10 }] },
        { mbtiType: "ENTJ", slices: [{ label: "デートプランの最終確認", percentage: 40 }, { label: "相手の弱点分析", percentage: 25 }, { label: "勝利（告白成功）の戦略", percentage: 25 }, { label: "ドキドキ", percentage: 10 }] },
        { mbtiType: "ESFP", slices: [{ label: "何着ていこう！？", percentage: 35 }, { label: "テンション MAX", percentage: 30 }, { label: "映え写真撮りたい", percentage: 25 }, { label: "遅刻しそう", percentage: 10 }] },
        { mbtiType: "INTJ", slices: [{ label: "会話の展開パターン分析", percentage: 40 }, { label: "感情の制御システム", percentage: 25 }, { label: "成功確率の計算", percentage: 25 }, { label: "楽しみ（認めたくない）", percentage: 10 }] },
        { mbtiType: "ENFP", slices: [{ label: "ワクワクが止まらない!", percentage: 40 }, { label: "サプライズ何しよう", percentage: 25 }, { label: "でも緊張してきた", percentage: 20 }, { label: "他の予定もある", percentage: 15 }] },
        { mbtiType: "ISFJ", slices: [{ label: "相手は楽しんでくれるかな", percentage: 40 }, { label: "手作りお菓子の仕上げ", percentage: 25 }, { label: "天気予報の確認", percentage: 20 }, { label: "自分も楽しみたい", percentage: 15 }] },
        { mbtiType: "ISTP", slices: [{ label: "特に何も考えてない", percentage: 40 }, { label: "何食べよう", percentage: 30 }, { label: "服これでいいか", percentage: 20 }, { label: "面倒くさい（でも行く）", percentage: 10 }] },
      ],
    },
  },
  {
    id: "pie_monday_morning",
    title: "🧠 月曜朝の脳内",
    tiktokCaption: "月曜日の朝の脳内がMBTI別に絶望的😩🧠\n「布団から出たくない」が50%のタイプいる…\n\n詳しい診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #月曜日 #脳内 #性格診断 #mbtiあるある #社会人あるある",
    inputProps: {
      theme: "月曜日の朝のMBTI別・脳内円グラフ😩🧠",
      charts: [
        { mbtiType: "INFP", slices: [{ label: "布団から出たくない", percentage: 50 }, { label: "週末の余韻", percentage: 25 }, { label: "存在意義の問い", percentage: 15 }, { label: "仕方ない、行くか", percentage: 10 }] },
        { mbtiType: "ESTJ", slices: [{ label: "今週のToDoリスト", percentage: 45 }, { label: "部下の進捗確認", percentage: 25 }, { label: "効率的な通勤ルート", percentage: 20 }, { label: "コーヒー飲みたい", percentage: 10 }] },
        { mbtiType: "ENFP", slices: [{ label: "今週楽しいこと探し", percentage: 40 }, { label: "新しいランチの店", percentage: 25 }, { label: "金曜まであと5日…", percentage: 25 }, { label: "遅刻しそう", percentage: 10 }] },
        { mbtiType: "ISTP", slices: [{ label: "無", percentage: 50 }, { label: "眠い", percentage: 25 }, { label: "帰りたい", percentage: 15 }, { label: "趣味のこと", percentage: 10 }] },
        { mbtiType: "ESFJ", slices: [{ label: "みんな元気かな", percentage: 35 }, { label: "今週のランチ会計画", percentage: 30 }, { label: "職場のお土産選び", percentage: 20 }, { label: "自分の体調", percentage: 15 }] },
        { mbtiType: "INTJ", slices: [{ label: "今週の戦略立案", percentage: 45 }, { label: "無駄な会議を減らす方法", percentage: 25 }, { label: "人と話したくない", percentage: 20 }, { label: "睡眠の質が悪い", percentage: 10 }] },
        { mbtiType: "ESTP", slices: [{ label: "週末の飲みの記憶", percentage: 35 }, { label: "今日サボれないかな", percentage: 30 }, { label: "腹減った", percentage: 25 }, { label: "仕事", percentage: 10 }] },
      ],
    },
  },
  {
    id: "pie_during_exam",
    title: "🧠 テスト中の脳内",
    tiktokCaption: "テスト中の脳内がMBTI別にカオス📝🧠\n「勘」が40%のタイプいて草\n\n詳しい診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #テスト #脳内 #性格診断 #mbtiあるある #学生あるある",
    inputProps: {
      theme: "テスト中のMBTI別・脳内円グラフ📝🧠",
      charts: [
        { mbtiType: "INTP", slices: [{ label: "この問題の本質とは…", percentage: 40 }, { label: "時間配分ミスった", percentage: 25 }, { label: "別の解法を思いついた", percentage: 25 }, { label: "お腹空いた", percentage: 10 }] },
        { mbtiType: "ESFP", slices: [{ label: "終わったら何しよう", percentage: 40 }, { label: "隣の人もう終わってる!?", percentage: 25 }, { label: "勘でいこう", percentage: 25 }, { label: "問題文を読む", percentage: 10 }] },
        { mbtiType: "ISTJ", slices: [{ label: "計画通りに解答中", percentage: 45 }, { label: "見直し時間の確保", percentage: 25 }, { label: "名前書いたか確認", percentage: 20 }, { label: "焦らない焦らない", percentage: 10 }] },
        { mbtiType: "ENFP", slices: [{ label: "この問題面白い！", percentage: 30 }, { label: "でも他の問題忘れた", percentage: 30 }, { label: "テスト後の予定", percentage: 25 }, { label: "解答欄ずれてない？", percentage: 15 }] },
        { mbtiType: "INTJ", slices: [{ label: "効率的な解答順序", percentage: 40 }, { label: "出題者の意図分析", percentage: 30 }, { label: "この問題、出題ミスでは？", percentage: 20 }, { label: "余裕", percentage: 10 }] },
        { mbtiType: "INFJ", slices: [{ label: "完璧に書きたい欲", percentage: 35 }, { label: "周りのペンの音が気になる", percentage: 25 }, { label: "この答えで合ってる…？", percentage: 25 }, { label: "早く一人になりたい", percentage: 15 }] },
        { mbtiType: "ESTP", slices: [{ label: "勘", percentage: 40 }, { label: "隣の答え見え…ない", percentage: 25 }, { label: "早く終わらせたい", percentage: 25 }, { label: "マジで勉強してない", percentage: 10 }] },
      ],
    },
  },
  {
    id: "pie_pay_day",
    title: "🧠 給料日の脳内",
    tiktokCaption: "給料日の脳内がMBTI別にリアルすぎ💰🧠\n散財勢 vs 即貯金勢\n\n詳しい診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #給料日 #脳内 #性格診断 #mbtiあるある #お金",
    inputProps: {
      theme: "給料日のMBTI別・脳内円グラフ💰🧠",
      charts: [
        { mbtiType: "ESFP", slices: [{ label: "今日何買おう！", percentage: 45 }, { label: "飲みに行こう！", percentage: 30 }, { label: "来月までもつ？", percentage: 15 }, { label: "貯金…？", percentage: 10 }] },
        { mbtiType: "INTJ", slices: [{ label: "投資に回す額の計算", percentage: 40 }, { label: "固定費の最適化", percentage: 30 }, { label: "FIRE計画の進捗", percentage: 20 }, { label: "ご褒美（書籍1冊）", percentage: 10 }] },
        { mbtiType: "ENFP", slices: [{ label: "旅行の計画！", percentage: 40 }, { label: "推しのグッズ新作！", percentage: 30 }, { label: "友達にプレゼント", percentage: 20 }, { label: "生活費…あれ？", percentage: 10 }] },
        { mbtiType: "ISTJ", slices: [{ label: "家計簿の記入", percentage: 40 }, { label: "先取り貯金の確認", percentage: 30 }, { label: "今月の予算配分", percentage: 20 }, { label: "ちょっとだけ贅沢", percentage: 10 }] },
        { mbtiType: "ESTP", slices: [{ label: "遊び！", percentage: 45 }, { label: "新しいガジェット", percentage: 25 }, { label: "友達に奢る", percentage: 20 }, { label: "来月の家賃…", percentage: 10 }] },
        { mbtiType: "INFJ", slices: [{ label: "将来の不安", percentage: 35 }, { label: "寄付しようかな", percentage: 25 }, { label: "本を買いたい", percentage: 25 }, { label: "自分へのご褒美", percentage: 15 }] },
        { mbtiType: "ENTJ", slices: [{ label: "資産運用ポートフォリオ", percentage: 40 }, { label: "自己投資（セミナー）", percentage: 30 }, { label: "部下との会食費用", percentage: 20 }, { label: "達成感", percentage: 10 }] },
      ],
    },
  },
  {
    id: "pie_crush_nearby",
    title: "🧠 好きな人が近くにいる時の脳内",
    tiktokCaption: "好きな人がすぐ近くにいる時の脳内がMBTI別に尺い💕🧠\n話しかける？固まる？\n\n詳しい診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #恋愛 #脳内 #性格診断 #mbtiあるある #片思い",
    inputProps: {
      theme: "好きな人がすぐ近くにいる時のMBTI別・脳内円グラフ💕🧠",
      charts: [
        { mbtiType: "INFP", slices: [{ label: "ドキドキが止まらない", percentage: 40 }, { label: "話しかけたい…無理", percentage: 30 }, { label: "妄想（二人の未来）", percentage: 20 }, { label: "息の仕方忘れた", percentage: 10 }] },
        { mbtiType: "ESTP", slices: [{ label: "話しかけるチャンス", percentage: 40 }, { label: "何かカッコいいこと言う", percentage: 30 }, { label: "ライバルチェック", percentage: 20 }, { label: "緊張（してない風）", percentage: 10 }] },
        { mbtiType: "ENFJ", slices: [{ label: "相手を笑わせたい", percentage: 35 }, { label: "自然に話しかける方法", percentage: 30 }, { label: "周りの空気づくり", percentage: 25 }, { label: "自分の気持ちの整理", percentage: 10 }] },
        { mbtiType: "INTP", slices: [{ label: "心拍数が異常…バグ？", percentage: 35 }, { label: "話しかける確率計算", percentage: 30 }, { label: "何を話せばいいのか", percentage: 25 }, { label: "この感情の正体は？", percentage: 10 }] },
        { mbtiType: "ESFJ", slices: [{ label: "さりげなく近づく作戦", percentage: 35 }, { label: "差し入れ渡すチャンス！", percentage: 30 }, { label: "髪型大丈夫かな", percentage: 25 }, { label: "友達にバレてない？", percentage: 10 }] },
        { mbtiType: "INTJ", slices: [{ label: "冷静を装うシステム稼働", percentage: 40 }, { label: "視線の管理", percentage: 25 }, { label: "感情？エラーだろ", percentage: 25 }, { label: "でも…気になる", percentage: 10 }] },
        { mbtiType: "ISFP", slices: [{ label: "横顔きれい…", percentage: 40 }, { label: "目が合ったら死ぬ", percentage: 25 }, { label: "近くにいるだけで幸せ", percentage: 25 }, { label: "帰りたい（嘘）", percentage: 10 }] },
      ],
    },
  },
  {
    id: "pie_hangover",
    title: "🧠 二日酔いの朝の脳内",
    tiktokCaption: "二日酔いの朝の脳内がMBTI別にガチ🍺😵🧠\n反省する人 vs また飲みに行く人\n\n詳しい診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #二日酔い #脳内 #性格診断 #mbtiあるある #飲み会",
    inputProps: {
      theme: "二日酔いの朝のMBTI別・脳内円グラフ🍺😵🧠",
      charts: [
        { mbtiType: "ESTP", slices: [{ label: "昨日めっちゃ楽しかった", percentage: 35 }, { label: "頭痛い…水…", percentage: 30 }, { label: "今日も飲みに行く？", percentage: 25 }, { label: "反省（3秒）", percentage: 10 }] },
        { mbtiType: "INFJ", slices: [{ label: "昨日変なこと言ってない？", percentage: 40 }, { label: "もう二度と飲まない", percentage: 30 }, { label: "自己嫌悪", percentage: 20 }, { label: "布団から出れない", percentage: 10 }] },
        { mbtiType: "ENFP", slices: [{ label: "昨日の楽しかった記憶", percentage: 35 }, { label: "LINEの誤爆チェック", percentage: 30 }, { label: "迎え酒…？", percentage: 20 }, { label: "あ、約束忘れてた", percentage: 15 }] },
        { mbtiType: "ISTJ", slices: [{ label: "予定通りに起きれなかった", percentage: 40 }, { label: "自己管理の失敗", percentage: 30 }, { label: "今日のスケジュール再調整", percentage: 20 }, { label: "もう飲み会は断る", percentage: 10 }] },
        { mbtiType: "ENTJ", slices: [{ label: "生産性が落ちる怒り", percentage: 40 }, { label: "二日酔い 最速回復法", percentage: 30 }, { label: "昨日の人脈は有効か", percentage: 20 }, { label: "自分への失望", percentage: 10 }] },
        { mbtiType: "ESFP", slices: [{ label: "最高の夜だった！", percentage: 40 }, { label: "でも頭が割れそう", percentage: 25 }, { label: "写真チェック（映え）", percentage: 25 }, { label: "ラーメン食べたい", percentage: 10 }] },
        { mbtiType: "INTP", slices: [{ label: "アルコール分解速度の考察", percentage: 35 }, { label: "昨日のシラフに戻れない発言", percentage: 30 }, { label: "水分補給の最適解", percentage: 25 }, { label: "社会 向いてない", percentage: 10 }] },
      ],
    },
  },
  {
    id: "pie_home_alone",
    title: "🧠 一人暮らし初日の脳内",
    tiktokCaption: "一人暮らし初日の脳内がMBTI別に差がありすぎる🏠🧠\n自由を満喫する人 vs 即ホームシックな人\n\n詳しい診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #一人暮らし #脳内 #性格診断 #mbtiあるある",
    inputProps: {
      theme: "一人暮らし初日のMBTI別・脳内円グラフ🏠🧠",
      charts: [
        { mbtiType: "INFP", slices: [{ label: "自由だ…！！", percentage: 40 }, { label: "でも寂しい…", percentage: 25 }, { label: "部屋の雰囲気づくり", percentage: 25 }, { label: "ゴキブリ出たらどうしよう", percentage: 10 }] },
        { mbtiType: "ENTJ", slices: [{ label: "生活効率の最適化", percentage: 40 }, { label: "家具の配置計画", percentage: 30 }, { label: "生活費シミュレーション", percentage: 20 }, { label: "やっと一人", percentage: 10 }] },
        { mbtiType: "ESFP", slices: [{ label: "友達呼んでパーティー！", percentage: 40 }, { label: "インテリア映え！", percentage: 25 }, { label: "料理…できるかな", percentage: 20 }, { label: "Wi-Fi繋がらない！", percentage: 15 }] },
        { mbtiType: "ISFJ", slices: [{ label: "親に電話しなきゃ", percentage: 35 }, { label: "近所への挨拶回り", percentage: 30 }, { label: "防犯対策の確認", percentage: 25 }, { label: "もうホームシック", percentage: 10 }] },
        { mbtiType: "ENTP", slices: [{ label: "改造計画（大家に怒られる）", percentage: 40 }, { label: "夜中まで好きなことし放題", percentage: 30 }, { label: "自炊?コンビニでいい", percentage: 20 }, { label: "結局1日YouTubeで終わった", percentage: 10 }] },
        { mbtiType: "INTJ", slices: [{ label: "最適な生活ルーティン設計", percentage: 40 }, { label: "無駄のないストレージ設計", percentage: 30 }, { label: "誰にも邪魔されない至福", percentage: 20 }, { label: "食事が面倒", percentage: 10 }] },
        { mbtiType: "ESFJ", slices: [{ label: "誰かに見せたい部屋！", percentage: 35 }, { label: "手料理の練習開始", percentage: 30 }, { label: "隣の人どんな人かな", percentage: 25 }, { label: "一人は…ちょっと不安", percentage: 10 }] },
      ],
    },
  },
  {
    id: "pie_job_interview",
    title: "🧠 面接中の脳内",
    tiktokCaption: "面接中の脳内がMBTI別にヤバすぎ👔🧠\n逆に面接官を面接してるタイプいる…\n\n詳しい診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #面接 #脳内 #性格診断 #mbtiあるある #就活",
    inputProps: {
      theme: "就活の面接中のMBTI別・脳内円グラフ👔🧠",
      charts: [
        { mbtiType: "ENFJ", slices: [{ label: "面接官の求める答え分析", percentage: 40 }, { label: "笑顔キープ", percentage: 25 }, { label: "相手を褒めるタイミング", percentage: 25 }, { label: "手汗がヤバい", percentage: 10 }] },
        { mbtiType: "INTP", slices: [{ label: "質問の本質を考えすぎ", percentage: 40 }, { label: "志望動機…なんだっけ", percentage: 25 }, { label: "沈黙が長い…まずい", percentage: 25 }, { label: "早く帰りたい", percentage: 10 }] },
        { mbtiType: "ESTP", slices: [{ label: "アドリブで乗り切る", percentage: 40 }, { label: "自信満々の演技", percentage: 30 }, { label: "面接官のネクタイ曲がってる", percentage: 20 }, { label: "昼飯何食べよう", percentage: 10 }] },
        { mbtiType: "INFP", slices: [{ label: "本当の自分を出せない苦痛", percentage: 40 }, { label: "涙をこらえる", percentage: 25 }, { label: "この会社で自分らしくいれる？", percentage: 25 }, { label: "もう帰りたい", percentage: 10 }] },
        { mbtiType: "ENTJ", slices: [{ label: "逆に面接官を面接してる", percentage: 40 }, { label: "この会社の市場分析", percentage: 30 }, { label: "年収交渉のタイミング", percentage: 20 }, { label: "もう受かった気でいる", percentage: 10 }] },
        { mbtiType: "ISFJ", slices: [{ label: "準備した回答を思い出す", percentage: 40 }, { label: "失礼がないか確認", percentage: 25 }, { label: "声震えてない？大丈夫？", percentage: 25 }, { label: "親に報告したい", percentage: 10 }] },
        { mbtiType: "ENTP", slices: [{ label: "面接官にツッコミ入れたい", percentage: 35 }, { label: "型破りな回答を思いつく", percentage: 30 }, { label: "この質問、意味ある？", percentage: 25 }, { label: "我慢…我慢…", percentage: 10 }] },
      ],
    },
  },
  {
    id: "pie_sns_posting",
    title: "🧠 SNS投稿する時の脳内",
    tiktokCaption: "SNSに投稿する時の脳内がMBTI別にリアル📱🧠\n30分推敲する人 vs 5秒で投稿する人\n\n詳しい診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #SNS #脳内 #性格診断 #mbtiあるある #インスタ",
    inputProps: {
      theme: "SNSに投稿する時のMBTI別・脳内円グラフ📱🧠",
      charts: [
        { mbtiType: "ENFP", slices: [{ label: "これ絶対バズる！", percentage: 40 }, { label: "ハッシュタグ選び", percentage: 25 }, { label: "フィルターどれにしよう", percentage: 25 }, { label: "5秒後に消すかも", percentage: 10 }] },
        { mbtiType: "INTJ", slices: [{ label: "そもそも投稿する意味は", percentage: 40 }, { label: "承認欲求とは何か", percentage: 30 }, { label: "閲覧するだけでいい", percentage: 20 }, { label: "…でも見て欲しい", percentage: 10 }] },
        { mbtiType: "ESFP", slices: [{ label: "映え！これ最高！", percentage: 45 }, { label: "リアルタイムで共有！", percentage: 25 }, { label: "いいね数チェック", percentage: 20 }, { label: "文章は適当でいい", percentage: 10 }] },
        { mbtiType: "INFP", slices: [{ label: "これ載せて引かれない？", percentage: 40 }, { label: "キャプション30分推敲", percentage: 25 }, { label: "やっぱ消そうかな…", percentage: 25 }, { label: "ポエム書きたい", percentage: 10 }] },
        { mbtiType: "ESTJ", slices: [{ label: "有益な情報のみ発信", percentage: 40 }, { label: "誤字脱字チェック3回", percentage: 30 }, { label: "投稿時間の最適化", percentage: 20 }, { label: "プライベートは出さない", percentage: 10 }] },
        { mbtiType: "ISFP", slices: [{ label: "この写真の色味が好き", percentage: 40 }, { label: "世界観を統一したい", percentage: 30 }, { label: "誰にも見せたくないけど見て", percentage: 20 }, { label: "コメント返すの苦手", percentage: 10 }] },
        { mbtiType: "ENTP", slices: [{ label: "炎上ギリギリの投稿", percentage: 35 }, { label: "議論を巻き起こしたい", percentage: 30 }, { label: "バズる法則の実験", percentage: 25 }, { label: "フォロワー増えたかな", percentage: 10 }] },
      ],
    },
  },
];
