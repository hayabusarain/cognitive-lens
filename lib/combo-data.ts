// 会話劇コンボフォーマット用プリセットデータ（10個）

export type ComboPreset = {
  id: string;
  title: string;
  tiktokCaption: string;
  inputProps: {
    theme: string;
    combos: {
      typeA: string;
      typeB: string;
      dialogue: { speaker: string; text: string }[];
    }[];
  };
};

export const COMBO_PRESETS: ComboPreset[] = [
  {
    id: "cb_drive_hell",
    title: "🚗 この2人でドライブ行ったら終わる",
    tiktokCaption: "この2人でドライブ行ったら友情が終わる🚗💨\nMBTIの相性最悪コンボがリアルすぎる…\n\n詳しい診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #ドライブ #性格診断 #mbtiあるある #相性 #会話劇",
    inputProps: {
      theme: "この2人でドライブ行ったら終わる🚗💨",
      combos: [
        {
          typeA: "ESTJ", typeB: "INFP",
          dialogue: [
            { speaker: "ESTJ", text: "よし、10時15分にSAでトイレ休憩、12時に予約した店に着くぞ" },
            { speaker: "INFP", text: "あ！あそこの看板のソフトクリーム美味しそう！寄り道しよーよ！" },
            { speaker: "ESTJ", text: "（無言でカーナビの到着予想時刻を見つめる）" },
            { speaker: "INFP", text: "（機嫌悪くさせたかな…と急に静かになる）" },
          ],
        },
        {
          typeA: "ENFJ", typeB: "ISTP",
          dialogue: [
            { speaker: "ENFJ", text: "ねえねえ！今の曲どう！？テンション上がるでしょ！一緒に歌お！" },
            { speaker: "ISTP", text: "……（無言で窓の外を見ている）" },
            { speaker: "ENFJ", text: "あ、疲れちゃった？何か飲む？エアコン寒くない？大丈夫？" },
            { speaker: "ISTP", text: "……別に。（なんでこんな話しかけてくるんだ…）" },
          ],
        },
        {
          typeA: "ENTP", typeB: "ISFJ",
          dialogue: [
            { speaker: "ENTP", text: "ナビは右って言ってるけど、絶対こっちの細い道の方が早いって！" },
            { speaker: "ISFJ", text: "えっ、でもナビ通りに行った方が安全なんじゃ…（不安）" },
            { speaker: "ENTP", text: "大丈夫大丈夫！冒険しようぜ！あっ、行き止まりだわ笑" },
            { speaker: "ISFJ", text: "（…だから言ったのに……泣）" },
          ],
        },
      ],
    },
  },
  {
    id: "cb_group_project",
    title: "📋 この2人でグループ課題やったら終わる",
    tiktokCaption: "この2人でグループ課題やったら地獄📋🔥\nMBTIの相性最悪コンボで課題が終わらない…\n\n詳しい診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #グループ課題 #性格診断 #mbtiあるある #学生あるある",
    inputProps: {
      theme: "この2人でグループ課題やったら地獄📋🔥",
      combos: [
        {
          typeA: "ENTJ", typeB: "INFP",
          dialogue: [
            { speaker: "ENTJ", text: "締め切り3日前だぞ。お前の担当パート、進捗は？" },
            { speaker: "INFP", text: "あ…その…もうちょっと完璧にしてから出したくて…" },
            { speaker: "ENTJ", text: "完璧じゃなくていいから今すぐ出せ。60点でいいから。" },
            { speaker: "INFP", text: "（泣きそう。でも確かに正論すぎて何も言えない…）" },
          ],
        },
        {
          typeA: "ENTP", typeB: "ISTJ",
          dialogue: [
            { speaker: "ENTP", text: "ここ、もっと斬新な切り口にしない？全部作り直そうよ！" },
            { speaker: "ISTJ", text: "は？もう8割完成してるんだけど。今から変えるの？" },
            { speaker: "ENTP", text: "だってこのままじゃ普通じゃん？面白くないって！" },
            { speaker: "ISTJ", text: "（…もうこいつとは二度と組まない…）" },
          ],
        },
        {
          typeA: "ESFP", typeB: "INTJ",
          dialogue: [
            { speaker: "ESFP", text: "ねー集まりの時間だけど、カフェでやらない？雰囲気いい所！" },
            { speaker: "INTJ", text: "家でオンラインの方が効率的だろ。移動時間が無駄。" },
            { speaker: "ESFP", text: "えー堅いなぁ！たまにはリラックスして〜" },
            { speaker: "INTJ", text: "リラックスは課題が終わってからだ。（溜息）" },
          ],
        },
      ],
    },
  },
  {
    id: "cb_cooking_together",
    title: "🍳 この2人で料理したら終わる",
    tiktokCaption: "この2人で料理したらカオス🍳💥\nMBTIの相性最悪コンボがキッチンを崩壊する…\n\n詳しい診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #料理 #性格診断 #mbtiあるある #相性 #会話劇",
    inputProps: {
      theme: "この2人で料理を作ったらカオス🍳💥",
      combos: [
        {
          typeA: "ESTJ", typeB: "ENFP",
          dialogue: [
            { speaker: "ESTJ", text: "レシピ通りに薄力粉200g。正確に計量しろよ。" },
            { speaker: "ENFP", text: "えー大体でよくない？あっ、このスパイス入れたら美味しそう！" },
            { speaker: "ESTJ", text: "勝手にアレンジするな！！レシピを守れ！！" },
            { speaker: "ENFP", text: "うるさいなぁ、料理は愛だよ愛！（ドバドバ入れる）" },
          ],
        },
        {
          typeA: "INTP", typeB: "ESFJ",
          dialogue: [
            { speaker: "INTP", text: "メイラード反応を考えると、焼き温度は180℃が最適で…" },
            { speaker: "ESFJ", text: "もう理論はいいから早く焼いて！お客さん来ちゃう！" },
            { speaker: "INTP", text: "待って、この化学反応の仕組みを理解してから焼いた方が…" },
            { speaker: "ESFJ", text: "（この人と料理するの二度目はない……）" },
          ],
        },
        {
          typeA: "ESTP", typeB: "ISFJ",
          dialogue: [
            { speaker: "ESTP", text: "包丁めんどくせー！手でちぎればよくね？" },
            { speaker: "ISFJ", text: "えっ…衛生的にちょっと…手は洗った…？" },
            { speaker: "ESTP", text: "細けぇこと気にすんな！あっ、油はねた！あっつ！" },
            { speaker: "ISFJ", text: "だからエプロンしてって言ったのに…（絆創膏を差し出す）" },
          ],
        },
      ],
    },
  },
  {
    id: "cb_horror_house",
    title: "👻 この2人でお化け屋敷に入ったら終わる",
    tiktokCaption: "この2人でお化け屋敷に入ったらカオス👻💀\nMBTIの相性最悪コンボが怖さよりストレス…\n\n詳しい診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #お化け屋敷 #性格診断 #mbtiあるある #ホラー",
    inputProps: {
      theme: "この2人でお化け屋敷に入ったらカオス👻💀",
      combos: [
        {
          typeA: "ESTP", typeB: "INFP",
          dialogue: [
            { speaker: "ESTP", text: "うぉっしゃ行くぞ！ビビんなよ！俺が守ってやるから！" },
            { speaker: "INFP", text: "（入口の時点でもう泣いてる。足が動かない）" },
            { speaker: "ESTP", text: "お化けさんこっちこっち！来いよ！（めっちゃ楽しそう）" },
            { speaker: "INFP", text: "もう無理もう無理もう無理…出口どこ…？（半泣き）" },
          ],
        },
        {
          typeA: "ENTP", typeB: "ISFJ",
          dialogue: [
            { speaker: "ENTP", text: "このお化け、造形甘くない？もうちょっとリアルにしてほしいよね" },
            { speaker: "ISFJ", text: "やめて！！批評しないで！！普通に怖いから！！" },
            { speaker: "ENTP", text: "あーほら来た来た。ねえ中の人に聞きたいんだけど時給いくら？" },
            { speaker: "ISFJ", text: "（この人と二度とお化け屋敷に来ない…）" },
          ],
        },
        {
          typeA: "INTJ", typeB: "ESFP",
          dialogue: [
            { speaker: "INTJ", text: "このルート、左に曲がると必ず驚かしポイントがある。パターンが読めた。" },
            { speaker: "ESFP", text: "ネタバレすんな！！！楽しみ半減じゃん！！！" },
            { speaker: "INTJ", text: "事前に知っておいた方が心拍数の上昇を抑えられるだろ？" },
            { speaker: "ESFP", text: "心拍数とかどうでもいいから！リアクションで楽しむものでしょ！" },
          ],
        },
      ],
    },
  },
  {
    id: "cb_travel_plan",
    title: "✈️ この2人で旅行の計画を立てたら終わる",
    tiktokCaption: "この2人で旅行の計画を立てたら永遠に終わらない✈️😇\nMBTIの相性最悪コンボ…\n\n詳しい診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #旅行 #性格診断 #mbtiあるある #相性 #会話劇",
    inputProps: {
      theme: "この2人で旅行の計画を立てたら永遠に終わらない✈️😇",
      combos: [
        {
          typeA: "ISTJ", typeB: "ENFP",
          dialogue: [
            { speaker: "ISTJ", text: "9:00出発、10:30観光地A、12:00昼食、13:30移動…はい時刻表。" },
            { speaker: "ENFP", text: "えーもっと自由にしようよ！朝起きた気分で決めればよくない？" },
            { speaker: "ISTJ", text: "それだと宿の予約が取れない場合のリスクが…" },
            { speaker: "ENFP", text: "野宿もまた思い出でしょ！（本気で言ってる）" },
          ],
        },
        {
          typeA: "ENTJ", typeB: "ISFP",
          dialogue: [
            { speaker: "ENTJ", text: "効率的に主要観光地を回るために、このルートを組んだ。異論は？" },
            { speaker: "ISFP", text: "…あの…この路地裏の雑貨屋さんにも寄りたいんだけど…" },
            { speaker: "ENTJ", text: "それはスケジュールに含まれていない。時間のロスだ。" },
            { speaker: "ISFP", text: "（…旅行ってこういうものだっけ…？）" },
          ],
        },
        {
          typeA: "INTP", typeB: "ESFJ",
          dialogue: [
            { speaker: "INTP", text: "そもそも旅行に行く理由って何？家でも楽しめるのでは？" },
            { speaker: "ESFJ", text: "みんなとの思い出を作りたいからに決まってるでしょ！" },
            { speaker: "INTP", text: "思い出…それって脳内の電気信号を書き換えるだけの…" },
            { speaker: "ESFJ", text: "もういい！あなた抜きで計画する！！（プンスカ）" },
          ],
        },
      ],
    },
  },
  {
    id: "cb_pet_adoption",
    title: "🐱 この2人でペットを飼ったら終わる",
    tiktokCaption: "この2人でペットを飼い始めたら即カオス🐱🐶\nMBTIの相性最悪コンボ…\n\n詳しい診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #ペット #性格診断 #mbtiあるある #犬 #猫",
    inputProps: {
      theme: "この2人でペットを飼い始めたら即カオス🐱🐶",
      combos: [
        {
          typeA: "ENFP", typeB: "INTJ",
          dialogue: [
            { speaker: "ENFP", text: "見て見て！この子と目が合った！運命だよ！連れて帰ろう！" },
            { speaker: "INTJ", text: "待て。飼育費用の年間試算と住環境の適合性をまず確認する。" },
            { speaker: "ENFP", text: "そんなの後でいいじゃん！この可愛さ見てよ！！" },
            { speaker: "INTJ", text: "感情で生き物の命を預かるな。（でもちょっと可愛い…）" },
          ],
        },
        {
          typeA: "ESFJ", typeB: "ISTP",
          dialogue: [
            { speaker: "ESFJ", text: "この子の名前何にする？ポチ？タマ？可愛い服も買わなきゃ！" },
            { speaker: "ISTP", text: "名前はなんでもいい。服は犬にとってストレスだからやめろ。" },
            { speaker: "ESFJ", text: "えっ…じゃあ何してあげればいいの…？" },
            { speaker: "ISTP", text: "放っておけ。動物は自由が一番だ。（散歩は黙って毎日行く）" },
          ],
        },
        {
          typeA: "ESTP", typeB: "INFJ",
          dialogue: [
            { speaker: "ESTP", text: "犬にフリスビーやらせようぜ！アジリティの大会とか出たくね？" },
            { speaker: "INFJ", text: "この子の気持ち考えてあげて…今日はゆっくりしたいみたいだよ" },
            { speaker: "ESTP", text: "え？犬の気持ちわかるの？笑" },
            { speaker: "INFJ", text: "わかるよ。今この子、あなたに疲れてる。（真顔）" },
          ],
        },
      ],
    },
  },
  {
    id: "cb_movie_choice",
    title: "🎬 この2人で映画選んだら終わる",
    tiktokCaption: "この2人で観る映画を選んだら永遠に決まらない🎬😩\nMBTIの相性最悪コンボ…\n\n詳しい診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #映画 #性格診断 #mbtiあるある #相性",
    inputProps: {
      theme: "この2人で観る映画を選んだら永遠に決まらない🎬😩",
      combos: [
        {
          typeA: "ENTP", typeB: "ISFP",
          dialogue: [
            { speaker: "ENTP", text: "ドキュメンタリーにしようぜ！社会問題系のやつ！議論したい！" },
            { speaker: "ISFP", text: "え…ジブリとかダメ？心が温まるやつがいいんだけど…" },
            { speaker: "ENTP", text: "ジブリなんて何回も見たじゃん！新しいジャンル開拓しようよ！" },
            { speaker: "ISFP", text: "（…一人で観ればよかった…）" },
          ],
        },
        {
          typeA: "ESTJ", typeB: "ENFP",
          dialogue: [
            { speaker: "ESTJ", text: "レビューサイトで評価4.5以上のやつにしよう。効率的だろ。" },
            { speaker: "ENFP", text: "レビューとか関係なくない？ジャケ買いみたいなワクワク感！" },
            { speaker: "ESTJ", text: "2時間を無駄にするリスクを取りたくないんだが…" },
            { speaker: "ENFP", text: "つまんない映画も思い出になるんだよ！（ポップコーン食べ始める）" },
          ],
        },
        {
          typeA: "INFJ", typeB: "ESTP",
          dialogue: [
            { speaker: "INFJ", text: "この映画、人生の意味を考えさせられるって評判だよ…" },
            { speaker: "ESTP", text: "重っ！爆発とカーチェイスがある方にしようぜ！" },
            { speaker: "INFJ", text: "たまには深いテーマの作品も…" },
            { speaker: "ESTP", text: "深いのは映画じゃなくてビールでいいわ（リモコン奪う）" },
          ],
        },
      ],
    },
  },
  {
    id: "cb_ikea_shopping",
    title: "🛋️ この2人でIKEAに行ったら終わる",
    tiktokCaption: "この2人でIKEAに行ったら帰れない🛋️😵\nMBTIの相性最悪コンボ…ミートボールで和解\n\n詳しい診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #IKEA #性格診断 #mbtiあるある #買い物",
    inputProps: {
      theme: "この2人でIKEAに行ったら帰れない🛋️😵",
      combos: [
        {
          typeA: "ENFP", typeB: "ISTJ",
          dialogue: [
            { speaker: "ENFP", text: "わーーこのランプ可愛い！あっこの椅子もいい！全部欲しい！" },
            { speaker: "ISTJ", text: "今日の目的は本棚だけだ。リストにないものは買わない。" },
            { speaker: "ENFP", text: "でもこのクッション見て！部屋に合いそう！セールだし！" },
            { speaker: "ISTJ", text: "セールに釣られるのが一番の無駄遣いだと何度言えば…" },
          ],
        },
        {
          typeA: "INTJ", typeB: "ESFP",
          dialogue: [
            { speaker: "INTJ", text: "事前に間取りを測定してきた。この棚がぴったり収まる。以上。" },
            { speaker: "ESFP", text: "えー！ショールーム全部見ようよ！モデルルームで写真撮りたい！" },
            { speaker: "INTJ", text: "それは購入と関係ない行動だ。時間の無駄だ。" },
            { speaker: "ESFP", text: "IKEAは雰囲気を楽しむ場所なんだよ！！（ミートボール食べに行く）" },
          ],
        },
        {
          typeA: "INTP", typeB: "ESFJ",
          dialogue: [
            { speaker: "ESFJ", text: "このカーテン、お客さん来た時に映えると思わない？" },
            { speaker: "INTP", text: "客が来る前提で家具を選ぶ必要ある？自分が快適ならよくない？" },
            { speaker: "ESFJ", text: "人を招く喜びがわからないの…？" },
            { speaker: "INTP", text: "人を招かなければこの議論も発生しない（正論）" },
          ],
        },
      ],
    },
  },
  {
    id: "cb_diet_together",
    title: "🏋️ この2人でダイエットしたら終わる",
    tiktokCaption: "この2人で一緒にダイエット始めたら破綻する🏋️💀\nMBTIの相性最悪コンボ…\n\n詳しい診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #ダイエット #性格診断 #mbtiあるある #痩せたい",
    inputProps: {
      theme: "この2人で一緒にダイエット始めたら破綻する🏋️💀",
      combos: [
        {
          typeA: "ENTJ", typeB: "ESFP",
          dialogue: [
            { speaker: "ENTJ", text: "今日から糖質制限。お菓子は全部捨てた。異論は認めない。" },
            { speaker: "ESFP", text: "えっ!!?? 私のポテチとチョコ全部！？鬼！！悪魔！！" },
            { speaker: "ENTJ", text: "目標体重まであと5kg。甘えは許さん。" },
            { speaker: "ESFP", text: "（こっそりコンビニに走る準備をしている）" },
          ],
        },
        {
          typeA: "INTJ", typeB: "ENFP",
          dialogue: [
            { speaker: "INTJ", text: "PFCバランスに基づいた食事プランを作成した。厳守しろ。" },
            { speaker: "ENFP", text: "了解！……あっ、友達から焼肉のお誘い来た！行っていい？" },
            { speaker: "INTJ", text: "ダメに決まってるだろ。計画を破壊するな。" },
            { speaker: "ENFP", text: "焼肉はタンパク質だから実質ダイエットだよ！（天才的言い訳）" },
          ],
        },
        {
          typeA: "ISTJ", typeB: "ESTP",
          dialogue: [
            { speaker: "ISTJ", text: "毎日の体重記録と食事日記を共有フォルダに入れてくれ。" },
            { speaker: "ESTP", text: "めんどくせー！体重計乗ったけどメモ忘れた！" },
            { speaker: "ISTJ", text: "記録なくして管理はできない。昨日のメニューは？" },
            { speaker: "ESTP", text: "えーっと…ラーメン、餃子、ビール3杯…（目をそらす）" },
          ],
        },
      ],
    },
  },
  {
    id: "cb_escape_room",
    title: "🔐 この2人で脱出ゲームやったら終わる",
    tiktokCaption: "この2人で脱出ゲームやったら友情が終わる🔐💔\nMBTIの相性最悪コンボがヤバい…\n\n詳しい診断は『対人課題解決プラットフォーム』で検索🔍\n\n#MBTI #16タイプ #脱出ゲーム #性格診断 #mbtiあるある #相性",
    inputProps: {
      theme: "この2人で脱出ゲームやったら友情が終わる🔐💔",
      combos: [
        {
          typeA: "ENTJ", typeB: "INFP",
          dialogue: [
            { speaker: "ENTJ", text: "残り5分！お前はAの謎を解け！俺はBをやる！指示通りに動け！" },
            { speaker: "INFP", text: "えっ…でもこの暗号、もしかして物語の伏線で…考えたい…" },
            { speaker: "ENTJ", text: "物語はいいから答えを出せ！！タイムリミットだぞ！！" },
            { speaker: "INFP", text: "（怒鳴らないで…泣きそう…でも確かに急がなきゃ…）" },
          ],
        },
        {
          typeA: "ENTP", typeB: "ISTJ",
          dialogue: [
            { speaker: "ENTP", text: "この鍵、力づくで壊せば早くない？ルール無視していこうぜ！" },
            { speaker: "ISTJ", text: "ルールを守れ。破壊したら弁償だぞ。正攻法で解くんだ。" },
            { speaker: "ENTP", text: "つまんねー！じゃあこの暗号、逆から読んでみたらどう？（天才的閃き）" },
            { speaker: "ISTJ", text: "……合ってる。お前たまに天才だな。（悔しそう）" },
          ],
        },
        {
          typeA: "ESFP", typeB: "INTJ",
          dialogue: [
            { speaker: "ESFP", text: "キャーー！この部屋怖い！暗い！ムリムリ！" },
            { speaker: "INTJ", text: "騒ぐな。この部屋の配置パターンから出口は北東方向だ。" },
            { speaker: "ESFP", text: "もう出たい！ヒント使おうよ！" },
            { speaker: "INTJ", text: "ヒントに頼る？敗北を認めろと？……却下だ。（プライド）" },
          ],
        },
      ],
    },
  },
];
