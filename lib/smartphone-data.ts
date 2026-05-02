// スマホ画面フォーマット用プリセットデータ（10個）

export type SmartphonePreset = {
  id: string;
  title: string;
  tiktokCaption: string;
  inputProps: {
    theme: string;
    type: "search" | "notification";
    sections: { mbtiType: string; items: string[] }[];
  };
};

export const SMARTPHONE_PRESETS: SmartphonePreset[] = [
  {
    id: "sp_search_history_secret",
    title: "🔍 MBTI別・検索履歴覗いてみた",
    tiktokCaption: "MBTI別の検索履歴覗いてみたらヤバすぎた…😱🔍\nあなたのタイプの検索履歴、当たってる？\n\n詳しい診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #性格診断 #検索履歴 #あるある #mbtiあるある #性格タイプ #INTP #ENFP #INTJ",
    inputProps: {
      theme: "MBTI別・検索履歴覗いてみたらヤバかった…🤫",
      type: "search",
      sections: [
        { mbtiType: "INTP", items: ["人間 なぜ 感情的になるのか", "宇宙の果て どうなってる", "猫 かわいい 理由 科学的根拠"] },
        { mbtiType: "ISFP", items: ["今日 運勢 おひつじ座", "〇〇カフェ 映える 席", "仕事 辞めたい つらい 限界"] },
        { mbtiType: "ENTJ", items: ["不労所得 仕組み化 方法", "CEO 最年少 記録", "効率的な睡眠 3時間で十分"] },
        { mbtiType: "ENFP", items: ["今からハワイ 安い行き方", "面白いバイト 短期 変わった", "運命の人 出会い方 スピリチュアル"] },
        { mbtiType: "ISTJ", items: ["確定申告 やり方 2025", "Excel マクロ 基礎から", "おすすめ 日用品 まとめ買い コスパ"] },
        { mbtiType: "ENTP", items: ["論破 テクニック 最強", "世界 陰謀論 ガチで本当", "ビジネスモデル 斬新 アイデア"] },
        { mbtiType: "ESFP", items: ["最新 トレンド 曲 TikTok", "パリピ パーティー 光るグッズ", "絶対ウケる 一発芸 忘年会"] },
        { mbtiType: "INFJ", items: ["生きる意味 哲学", "HSP 診断 セルフチェック", "誰もいない島 移住 費用"] },
      ],
    },
  },
  {
    id: "sp_date_eve_search",
    title: "🔍 初デート前日の検索履歴",
    tiktokCaption: "初デート前日の検索履歴が性格出すぎてて草🫣💕\nあなたはどのタイプ？\n\n詳しい診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #初デート #恋愛 #検索履歴 #性格診断 #mbtiあるある #デート #恋愛あるある",
    inputProps: {
      theme: "初デート前日のMBTI別・検索履歴🫣💕",
      type: "search",
      sections: [
        { mbtiType: "INFP", items: ["初デート 沈黙 気まずい 対処法", "好きな人 目を見て話せない", "会話 盛り上がる 質問 一覧"] },
        { mbtiType: "ENTJ", items: ["デート 最適ルート 効率", "告白 成功率 上げる方法", "レストラン 個室 予約 高級"] },
        { mbtiType: "ESFJ", items: ["デート コーデ 男ウケ 冬", "相手の好きなもの リサーチ方法", "手作りお菓子 簡単 映える"] },
        { mbtiType: "ISTP", items: ["デート 何話せばいい", "女子 褒め方 わからん", "明日 雨 だったら 中止でいい？"] },
        { mbtiType: "ENFP", items: ["デートスポット 穴場 おしゃれ", "サプライズ 初デート やりすぎ？", "運命の人 見分け方 直感"] },
        { mbtiType: "INTJ", items: ["初デート 統計 成功パターン", "会話 論理的すぎ 引かれる？", "恋愛 攻略法 データ分析"] },
        { mbtiType: "ESFP", items: ["初デート 盛り上がる場所", "ネイル 当日 間に合う サロン", "インスタ映え デート 写真"] },
        { mbtiType: "INFJ", items: ["相手の本音 見抜く方法", "デート 疲れる 内向型", "好きな人の前 自分を出せない"] },
      ],
    },
  },
  {
    id: "sp_horror_movie_search",
    title: "🔍 ホラー映画の後の検索履歴",
    tiktokCaption: "ホラー映画観た後の検索履歴でMBTIバレる件👻💀\n怖がり方にも性格出るんだよ…\n\n詳しい診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #ホラー映画 #検索履歴 #性格診断 #mbtiあるある #怖い #心霊",
    inputProps: {
      theme: "ホラー映画観た後のMBTI別・検索履歴👻",
      type: "search",
      sections: [
        { mbtiType: "INFP", items: ["怖い夢 見ない方法", "一人暮らし 夜 怖い 対策", "ぬいぐるみ 抱いて寝る 大人"] },
        { mbtiType: "ENTP", items: ["ホラー映画 矛盾点 まとめ", "幽霊 科学的に存在しない 証明", "お化け屋敷 バイト 楽しそう"] },
        { mbtiType: "ESTP", items: ["ホラー映画 もっと怖いやつ", "心霊スポット 有名 行ってみた", "ゾンビ 倒し方 リアル"] },
        { mbtiType: "ISFJ", items: ["お清め 塩 やり方", "心霊 お守り 効果ある？", "家族 一緒に寝たい 言い方"] },
        { mbtiType: "INTJ", items: ["ホラー映画 伏線 考察", "殺人鬼の心理 プロファイリング", "サバイバル 生存率 上げる行動"] },
        { mbtiType: "ENFJ", items: ["友達 怖がらせすぎた 謝り方", "一緒に見た人 トラウマ 大丈夫？", "次の映画 ほのぼの系 おすすめ"] },
        { mbtiType: "ESFP", items: ["ホラー映画 リアクション 面白い", "友達と心霊スポット 行きたい", "怖い話 盛り上がる 飲み会"] },
        { mbtiType: "INTP", items: ["幽霊 量子力学 関係あるのか", "ホラー映画 物理法則 無視しすぎ", "死後の世界 科学者 見解"] },
      ],
    },
  },
  {
    id: "sp_exam_eve_search",
    title: "🔍 テスト前日の検索履歴",
    tiktokCaption: "テスト前日の検索履歴がタイプ別に違いすぎる📝💀\n勉強してる？してない？\n\n詳しい診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #テスト #検索履歴 #性格診断 #mbtiあるある #学生あるある #勉強",
    inputProps: {
      theme: "テスト前日のMBTI別・検索履歴📝💀",
      type: "search",
      sections: [
        { mbtiType: "ENFP", items: ["テスト 一夜漬け 効率", "集中力 上げる BGM", "テスト範囲 友達に聞く LINEの送り方"] },
        { mbtiType: "INTJ", items: ["過去問 傾向分析 スプレッドシート", "テスト 満点 戦略 最短", "同級生 答え合わせ 無駄"] },
        { mbtiType: "ESFP", items: ["テスト 明日 やばい 助けて", "カンニング ダメ 絶対", "テスト終わったら カラオケ 予約"] },
        { mbtiType: "ISTJ", items: ["テスト範囲 再確認 チェックリスト", "ノート まとめ 色分け 最適", "睡眠 7時間 確保 重要性"] },
        { mbtiType: "INTP", items: ["テスト範囲外 面白い論文", "数学 証明 美しい やつ", "勉強 飽きた Wikipedia 沼"] },
        { mbtiType: "ESTP", items: ["テスト 5分前 詰め込み テク", "隣の席の人 頭いい 確認", "テスト終わり 打ち上げ 場所"] },
        { mbtiType: "INFJ", items: ["テスト 不安 眠れない", "将来 テストの点 関係ある？", "自分だけ落ちたら どうしよう"] },
        { mbtiType: "ENTJ", items: ["テスト 学年1位 取る方法", "効率的 暗記法 科学的", "ライバル 点数 予想 分析"] },
      ],
    },
  },
  {
    id: "sp_breakup_search",
    title: "🔍 失恋直後の検索履歴",
    tiktokCaption: "失恋直後の検索履歴がMBTI別に闇深すぎた💔😭\n立ち直り方にも性格が出る…\n\n詳しい診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #失恋 #検索履歴 #性格診断 #mbtiあるある #恋愛 #別れ",
    inputProps: {
      theme: "失恋直後のMBTI別・検索履歴💔😭",
      type: "search",
      sections: [
        { mbtiType: "INFP", items: ["失恋 ポエム 書きたい", "元カレ 夢に出てきた 意味", "一人で泣ける 映画 おすすめ"] },
        { mbtiType: "ENTJ", items: ["失恋 立ち直る 最速 方法", "自分磨き 筋トレ メニュー", "元恋人より成功する 計画"] },
        { mbtiType: "ENFP", items: ["失恋 新しい出会い すぐ", "海外旅行 一人旅 癒し", "推し 新しく見つける 方法"] },
        { mbtiType: "ISTP", items: ["別れた 特に何も感じない 普通？", "一人 趣味 没頭 バイク", "元カノ 荷物 返し方 最短"] },
        { mbtiType: "ESFJ", items: ["失恋 友達に相談 迷惑？", "元彼 共通の友達 気まずい", "次の恋 いつ来る 占い"] },
        { mbtiType: "INTJ", items: ["恋愛 失敗 原因分析 フレームワーク", "感情 コントロール できない なぜ", "一人の方が生産性 高い 論文"] },
        { mbtiType: "ESFP", items: ["失恋 飲み会 開催 LINE", "カラオケ 失恋ソング ランキング", "新しい服 買って気分転換"] },
        { mbtiType: "INFJ", items: ["なぜ別れたのか 深層心理", "人を好きになるのが怖い", "一人でいた方が楽 病気？"] },
      ],
    },
  },
  {
    id: "sp_3am_search",
    title: "🔍 深夜3時の検索履歴",
    tiktokCaption: "深夜3時の検索履歴がMBTI別にカオスすぎる🌙👀\nお前ら何検索してんの…？\n\n詳しい診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #深夜 #検索履歴 #性格診断 #mbtiあるある #夜更かし #あるある",
    inputProps: {
      theme: "深夜3時のMBTI別・検索履歴🌙👀",
      type: "search",
      sections: [
        { mbtiType: "INTP", items: ["ブラックホール 情報パラドックス", "時間 本当に存在するのか", "意識 とは何か 哲学"] },
        { mbtiType: "ENFP", items: ["深夜テンション 明日後悔する？", "今から始められる 新しい趣味", "世界一周 費用 リアル"] },
        { mbtiType: "INTJ", items: ["3時間睡眠 パフォーマンス影響", "人生計画 30歳まで 見直し", "成功者 睡眠時間 一覧"] },
        { mbtiType: "ISFP", items: ["エモい 夜景 壁紙", "深夜 散歩 危ない？", "星空 きれい 今日 方角"] },
        { mbtiType: "ESTP", items: ["深夜営業 ラーメン 近く", "朝まで遊べる場所 都内", "二日酔い 防止 最強"] },
        { mbtiType: "INFJ", items: ["自分は何のために生きてるのか", "前世 記憶 思い出す方法", "HSP 夜 考えすぎる 対処"] },
        { mbtiType: "ENTP", items: ["AIに人権 与えるべきか", "陰謀論 ガチなやつ 2025", "起業アイデア 寝る前に思いついた"] },
        { mbtiType: "ISFJ", items: ["明日の天気 持ち物 確認", "お弁当 作り置き レシピ", "家族 体調悪そう 病院 何科"] },
      ],
    },
  },
  {
    id: "sp_job_search",
    title: "🔍 就活中の検索履歴",
    tiktokCaption: "就活中の検索履歴がMBTI別にリアルすぎた👔😰\nお前の志望動機それでいいの…？\n\n詳しい診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #就活 #検索履歴 #性格診断 #mbtiあるある #就職活動 #面接",
    inputProps: {
      theme: "就活中のMBTI別・検索履歴👔😰",
      type: "search",
      sections: [
        { mbtiType: "ENFJ", items: ["面接 好印象 話し方", "チームワーク アピール 例文", "内定 お礼メール テンプレ"] },
        { mbtiType: "INTP", items: ["就活 意味ない 論文", "研究職 年収 リアル", "面接 志望動機 テンプレでいい？"] },
        { mbtiType: "ESTP", items: ["就活 楽な方法 裏技", "営業 インセンティブ 高い 会社", "面接 ハッタリ バレない方法"] },
        { mbtiType: "INFP", items: ["やりたいこと 見つからない 就活", "自分らしく働ける 仕事 診断", "就活 つらい 泣きそう"] },
        { mbtiType: "ENTJ", items: ["年収ランキング 業界別 トップ", "最速 出世 キャリアパス", "外資 コンサル 新卒 年収"] },
        { mbtiType: "ISFJ", items: ["面接 緊張 しない方法", "安定した会社 ランキング", "転勤なし 福利厚生 充実 企業"] },
        { mbtiType: "ENTP", items: ["起業 vs 就職 どっちが得", "面接 逆質問 攻めた質問", "ベンチャー ストックオプション 夢"] },
        { mbtiType: "ISTJ", items: ["SPI 対策 問題集 おすすめ", "エントリーシート 書き方 テンプレ", "公務員 併願 スケジュール管理"] },
      ],
    },
  },
  {
    id: "sp_diet_search",
    title: "🔍 ダイエット中の検索履歴",
    tiktokCaption: "ダイエット中の検索履歴がMBTI別に正直すぎた🏋️‍♀️🍰\n本当に痩せる気ある…？\n\n詳しい診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #ダイエット #検索履歴 #性格診断 #mbtiあるある #痩せたい #筋トレ",
    inputProps: {
      theme: "ダイエット中のMBTI別・検索履歴🏋️‍♀️🍰",
      type: "search",
      sections: [
        { mbtiType: "ENFP", items: ["ダイエット 楽しい方法 飽きない", "チートデイ 毎日 ダメ？", "痩せたら人生変わった 体験談"] },
        { mbtiType: "INTJ", items: ["PFCバランス 最適値 計算", "ダイエット 科学的 最速", "体脂肪率 測定 精度 比較"] },
        { mbtiType: "ESFP", items: ["ダイエット中 食べていいスイーツ", "友達と焼肉 断り方 ない", "痩せる ダンス TikTok 楽しい"] },
        { mbtiType: "ISTJ", items: ["カロリー記録 アプリ 正確", "毎日の体重 グラフ化 エクセル", "ダイエット 計画表 テンプレ"] },
        { mbtiType: "INFP", items: ["痩せたい でも食べたい 葛藤", "自己肯定感 ダイエット 関係", "ありのままの自分 愛す 方法"] },
        { mbtiType: "ESTP", items: ["筋トレ 最短 バキバキ", "プロテイン おすすめ コスパ最強", "腹筋 割れるまで 何日"] },
        { mbtiType: "INFJ", items: ["ダイエット 精神的に疲れる", "食べることへの罪悪感 なくしたい", "健康的に痩せる 心のケア"] },
        { mbtiType: "ENTJ", items: ["ダイエット 目標設定 SMART", "パーソナルトレーナー 費用対効果", "体重管理 KPI ダッシュボード"] },
      ],
    },
  },
  {
    id: "sp_payday_search",
    title: "🔍 給料日直後の検索履歴",
    tiktokCaption: "給料日直後の検索履歴がMBTI別にリアルすぎる💰🤑\n散財する人 vs 即貯金する人\n\n詳しい診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #給料日 #検索履歴 #性格診断 #mbtiあるある #お金 #貯金",
    inputProps: {
      theme: "給料日直後のMBTI別・検索履歴💰🤑",
      type: "search",
      sections: [
        { mbtiType: "ESFP", items: ["今日 飲み放題 おしゃれな店", "ブランド 新作 バッグ 即買い", "旅行 週末 弾丸 温泉"] },
        { mbtiType: "ISTJ", items: ["家計簿 今月 固定費 確認", "貯金 自動振替 設定", "ふるさと納税 残り枠 計算"] },
        { mbtiType: "ENTP", items: ["仮想通貨 今 買い時？", "副業 新しい 稼げる 2025", "投資 レバレッジ リスク 面白い"] },
        { mbtiType: "INFP", items: ["推し グッズ 新作 全部買う", "一人旅 癒し 温泉宿", "画材 高級 いつか買いたかったやつ"] },
        { mbtiType: "ENTJ", items: ["資産運用 ポートフォリオ 最適化", "不動産投資 初心者 利回り", "FIRE 達成 計算シート"] },
        { mbtiType: "ISFJ", items: ["家族 プレゼント 何がいいかな", "貯金 目標額 老後 不安", "ふるさと納税 お米 おすすめ"] },
        { mbtiType: "ESTP", items: ["パチンコ 新台 攻略", "焼肉 高級 一人前 最高の店", "新しいスニーカー 限定 争奪戦"] },
        { mbtiType: "INTJ", items: ["S&P500 積立設定 増額", "節税 合法 テクニック", "資産 複利 シミュレーション"] },
      ],
    },
  },
  {
    id: "sp_vacation_search",
    title: "🔍 夏休み初日の検索履歴",
    tiktokCaption: "夏休み初日の検索履歴がMBTI別に個性爆発🌴☀️\n計画立てる人 vs 何もしない人\n\n詳しい診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #夏休み #検索履歴 #性格診断 #mbtiあるある #夏 #バカンス",
    inputProps: {
      theme: "夏休み初日のMBTI別・検索履歴🌴☀️",
      type: "search",
      sections: [
        { mbtiType: "ENFP", items: ["夏フェス チケット まだ買える？", "海外旅行 弾丸 安い国", "夏 やりたいことリスト 100個"] },
        { mbtiType: "INTJ", items: ["夏休み スキルアップ 計画", "プログラミング 独学 ロードマップ", "読書リスト 夏 厳選10冊"] },
        { mbtiType: "ESFP", items: ["海 ビーチ 映えスポット", "BBQ 大人数 盛り上がるゲーム", "夏祭り 浴衣 着付け 簡単"] },
        { mbtiType: "ISTP", items: ["ソロキャンプ 道具 おすすめ", "バイク ツーリング 穴場 ルート", "DIY 夏休み 工作 大人向け"] },
        { mbtiType: "INFJ", items: ["一人旅 静かな場所 国内", "夏休み 人混み 避ける 方法", "自分と向き合う リトリート"] },
        { mbtiType: "ESTJ", items: ["夏休み 計画表 テンプレート", "家族旅行 コスパ最強 プラン", "宿題 スケジュール管理 子供用"] },
        { mbtiType: "INFP", items: ["夏 エモい 写真 撮り方", "ひまわり畑 一人で行く 変？", "小説 夏が舞台 おすすめ"] },
        { mbtiType: "ENTP", items: ["夏休み 自由研究 大人がガチる", "水鉄砲 最強 改造 方法", "起業 夏休み チャレンジ"] },
      ],
    },
  },
];
