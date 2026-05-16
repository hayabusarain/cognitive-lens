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
    title: "💜 紫（分析家）の接続要求（脈あり）サイン",
    tiktokCaption: "【紫タイプ】分析家たちの接続要求（脈あり）サイン💜\nあまのじゃくすぎない…？😂\n\n詳しい相性診断は『対人課題解決プラットフォーム CognitiveLens』で検索🔍\n\n#16タイプ #脈ありサイン #INTJ #INTP #ENTJ #ENTP",
    inputProps: {
      theme: "紫（分析家）の接続要求（脈あり）サイン",
      groupColor: "purple",
      items: [
        {
          mbtiType: "INTJ",
          catchphrase: "バックグラウンドで身辺調査",
          description: "対象の基本スペックや行動ログを無意識にスクレイピングし始める。視線は合うが、エラー（照れ）を吐いて即座に通信を切断する。"
        },
        {
          mbtiType: "INTP",
          catchphrase: "不器用なPing送信",
          description: "普段は省エネモードで他人に興味がないのに、対象の前だと自分のニッチな知識データベースを不自然に開示してレスポンスを待つ。"
        },
        {
          mbtiType: "ENTJ",
          catchphrase: "問題解決の強制コンパイル",
          description: "対象の悩み（バグ）を聞き出すと、頼まれてもいないのに最適化された解決策を全力でデプロイする。時間という最大コストを惜しまない。"
        },
        {
          mbtiType: "ENTP",
          catchphrase: "脆弱性（反応）のペネトレーションテスト",
          description: "わざと煽ったりイレギュラーな入力を与えたりして、対象の挙動（知性や反応）をテストする。面白がっている＝通信プロトコル確立の証。"
        }
      ]
    }
  },
  {
    id: "info_crush_green",
    title: "💚 緑（外交官）の接続要求（脈あり）サイン",
    tiktokCaption: "【緑タイプ】外交官たちの接続要求（脈あり）サイン💚\n感情ダダ漏れ？それとも隠す？🥺\n\n詳しい相性診断は『対人課題解決プラットフォーム CognitiveLens』で検索🔍\n\n#16タイプ #脈ありサイン #INFJ #INFP #ENFJ #ENFP",
    inputProps: {
      theme: "緑（外交官）の接続要求（脈あり）サイン",
      groupColor: "green",
      items: [
        {
          mbtiType: "INFJ",
          catchphrase: "対象の環境変数に密かに同期",
          description: "相手が勧めていた音楽や本をこっそりダウンロード（体験）する。深い精神的レイヤーでのセキュアな通信回線を構築しようとする。"
        },
        {
          mbtiType: "INFP",
          catchphrase: "遠隔監視のみ（重症）",
          description: "脳内シミュレータではすでに結婚式場までレンダリング済みなのに、現実ではPingすら打てず、遠くから尊いサーバーとしてただ眺める。"
        },
        {
          mbtiType: "ENFJ",
          catchphrase: "過保護な管理者（Admin）権限発動",
          description: "「大丈夫？手伝おうか？」と対象のタスク管理まで全自動でサポートし始める。特別扱いしているパケットが周囲にもダダ漏れ状態。"
        },
        {
          mbtiType: "ENFP",
          catchphrase: "距離感バグ＆常時アクティブ",
          description: "対象の前だとCPU使用率が異常に跳ね上がり、物理的な距離（UI配置）もバグレベルで近くなる。LINEのレスポンス速度は最速Ping値。"
        }
      ]
    }
  },
  {
    id: "info_crush_blue",
    title: "💙 青（番人）の接続要求（脈あり）サイン",
    tiktokCaption: "【青タイプ】番人たちの接続要求（脈あり）サイン💙\n分かりやすくて誠実すぎる！✨\n\n詳しい相性診断は『対人課題解決プラットフォーム CognitiveLens』で検索🔍\n\n#16タイプ #脈ありサイン #ISTJ #ISFJ #ESTJ #ESFJ",
    inputProps: {
      theme: "青（番人）の接続要求（脈あり）サイン",
      groupColor: "blue",
      items: [
        {
          mbtiType: "ISTJ",
          catchphrase: "実用的なユーティリティ提供",
          description: "甘いUI（言葉）は用意しないが、困っている時に具体的なタスク消化や役立つ情報の共有など、実用的なバックエンド処理で好意を示す。"
        },
        {
          mbtiType: "ISFJ",
          catchphrase: "ささいなログも永久保存",
          description: "「これ好きって言ってたよね」と過去のキャッシュデータを完璧に引き出してくる。対象の微細なUI変更（髪型や体調）の検知速度が異常。"
        },
        {
          mbtiType: "ESTJ",
          catchphrase: "スケジューラーの最優先割り込み",
          description: "超高負荷（多忙）な状態でも、対象のためならどうにかしてリソースを割く。デートの計画を分刻みのバッチ処理で完璧にスケジュールする。"
        },
        {
          mbtiType: "ESFJ",
          catchphrase: "全肯定のオートリプライ機能",
          description: "「すごい！」「わかる！」と対象の出力を全肯定し、自己肯定感を爆上げさせる天才。対象の前では常に「いいね」ボタンが連打状態になる。"
        }
      ]
    }
  },
  {
    id: "info_crush_yellow",
    title: "💛 黄（探検家）の接続要求（脈あり）サイン",
    tiktokCaption: "【黄タイプ】探検家たちの接続要求（脈あり）サイン💛\n直感と行動力で勝負！🔥\n\n詳しい相性診断は『対人課題解決プラットフォーム CognitiveLens』で検索🔍\n\n#16タイプ #脈ありサイン #ISTP #ISFP #ESTP #ESFP",
    inputProps: {
      theme: "黄（探検家）の接続要求（脈あり）サイン",
      groupColor: "yellow",
      items: [
        {
          mbtiType: "ISTP",
          catchphrase: "貴重なローカルリソースを割く",
          description: "スタンドアロン環境（一人の時間）を何より愛する彼らが、無駄な通信（LINE）を続けたり誘いに乗る時点で、それは強烈な接続要求のサイン。"
        },
        {
          mbtiType: "ISFP",
          catchphrase: "視線トラッキングするが、入力はなし",
          description: "やたらとセンサー（視線）は合うのに、いざ接続されるとエラーを吐いてそっけなくなる。好意を言葉という出力以外（絵や音楽）で匂わせがち。"
        },
        {
          mbtiType: "ESTP",
          catchphrase: "P2Pでのダイレクト接続＆物理接触",
          description: "面倒な暗号化（駆け引き）はせず、直接遊びに誘い、会話の中心に相手を据える。レスポンスの速さを活かしてグイグイ物理距離を詰める。"
        },
        {
          mbtiType: "ESFP",
          catchphrase: "全力のエンターテインメント・レンダリング",
          description: "対象の画面を華やかにするため（笑わせるため）にGPUをフル稼働させる。特別な体験（イベント）を共有しようと、常にサプライズ実装を用意。"
        }
      ]
    }
  }
];
