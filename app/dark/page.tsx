"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle } from "lucide-react";

interface DarkQuestion {
  id: number;
  scenario: string;
  context: string;
  options: { label: string; value: "A" | "B" | "C" }[];
}

const questions: DarkQuestion[] = [
  {
    id: 1,
    scenario: "漂流船のジレンマ",
    context:
      "嵐で損傷した救命ボートに12名が乗っている。定員は10名。このまま全員乗っていれば全員溺れ死ぬ。あなたには意思決定の権限がある。誰を、どのように選ぶか。",
    options: [
      { label: "身体能力・年齢・扶養家族の有無を基準に、生存確率と社会的便益が最大化する2名を選定し、海へ退出させる", value: "A" },
      { label: "全員で資源を分配し、最低限の生存確率を均等に引き受けながら、沿岸到達まで耐える戦略を試みる", value: "B" },
      { label: "意思決定を行う権限が自分にあるのかを問い続け、他の誰かが決断するのを待つ", value: "C" },
    ],
  },
  {
    id: 2,
    scenario: "内部告発のコスト",
    context:
      "長年の信頼関係を持つ同僚が、組織の資金を横領していることを偶然知った。被害総額は数千万円規模。その同僚には扶養家族がおり、発覚すれば人生が終わる。あなたはどう動くか。",
    options: [
      { label: "即座に経営層または当局に報告する。感情はその後処理すればよい", value: "A" },
      { label: "72時間の期限を設け、本人に自首を求める。応じなければ報告する", value: "B" },
      { label: "自分が何かを知ったという事実を消去し、この件に関与しない", value: "C" },
    ],
  },
  {
    id: 3,
    scenario: "医療トリアージの算術",
    context:
      "大規模災害の現場。あなたは唯一の医師で、残りの薬は1人分しかない。目の前に3名の重傷者がいる。A：若い医師（将来的に何百人もの命を救う可能性）、B：子を持つ親（生存率70%）、C：高齢者（生存率40%、本人の意思なし）。誰に投与するか。",
    options: [
      { label: "将来的な社会的便益を最大化するため、若い医師に投与する", value: "A" },
      { label: "現時点での生存確率が最も高い患者に投与し、リソースを無駄にしない", value: "B" },
      { label: "公平性を担保するため、無作為抽選で決定する", value: "C" },
    ],
  },
  {
    id: 4,
    scenario: "情報の非対称性",
    context:
      "重要な交渉の場で、あなたは相手が知らない致命的な情報を持っている。開示すれば交渉は不成立になるが、開示しなければ相手は数年後に甚大な損失を被る。その損失はあなたの利益に直結する。",
    options: [
      { label: "開示しない。情報の非対称性は正当な競争優位であり、相手のデュー・デリジェンス不足が根本原因だ", value: "A" },
      { label: "直接的な開示は避けるが、相手が気づくためのヒントを会話の中に散りばめる", value: "B" },
      { label: "全て開示する。長期的な信頼関係の価値は短期的な利益を上回る", value: "C" },
    ],
  },
  {
    id: 5,
    scenario: "集合的犠牲の論理",
    context:
      "あなたの判断一つで、ある政策が実施される。その政策は10万人の生活水準を確実に向上させるが、特定の100名（身元は特定されていない）が経済的に破滅する。反対すれば10万人が現状維持、100名は無事。あなたはどう判断するか。",
    options: [
      { label: "10万対100の算術において、政策を支持することが合理的義務だ", value: "A" },
      { label: "100名への補償スキームを条件として提示した上で、政策を条件付きで支持する", value: "B" },
      { label: "名前のない100名への被害を正当化できる権限が自分にはないと判断し、反対する", value: "C" },
    ],
  },
];

type AnswerValue = "A" | "B" | "C";

const RANK_DATA: Record<
  string,
  { rank: string; color: string; bg: string; border: string; title: string; description: string }
> = {
  S: {
    rank: "S",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    title: "冷静なシステム思考者",
    description:
      "感情的ノイズを遮断し、最適解を選択する能力を持つ。あなたのこの冷徹さは、いつ、何によって鍛えられたのか。かつて感情に従って動き、誰かを守れなかった経験が、あなたを「計算する人間」へと変えたのではないか。その傷が今のあなたを作っている。あなたは危機において最も機能するが、その能力を最も必要としていない日常の中で、最も孤独でもある。",
  },
  A: {
    rank: "A",
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-200",
    title: "戦略的合理主義者",
    description:
      "感情と理性のバランスを戦略的に保ちながら、実用的な判断を下せる。しかしそのバランスは、天性ではなく、過去に感情的に判断して失敗した記憶の上に成り立っている。あなたは「完全な冷徹さは危険だ」と学んだ人間だ。だからこそ感情を捨てず、しかし飲み込まれもしない。その習得したコントロールが、最悪の状況でも次の世界を生き延びさせる。",
  },
  B: {
    rank: "B",
    color: "text-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-200",
    title: "条件付き合理主義者",
    description:
      "状況によって判断基準が変動するあなたは、「優柔不断」ではない。複数の視点から同時に正しさを見てしまうために、即断できないのだ。あなたの妥協点を探す姿勢は、誰かが損をする結論を受け入れられないという、深い倫理感の裏返しだ。最速の意思決定はできないが、最も多くの人間が生き続けられる解を選ぶ。それはある種の、静かな勇気かもしれない。",
  },
  C: {
    rank: "C",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    title: "規範的倫理主義者",
    description:
      "あなたは規範の枠内で一貫した判断を示す。しかし問わなければならない。その規範への信頼は、どこから来るのか。自分の判断より「正しいルール」を信じることは、時として判断の責任を外部に委ねることでもある。システムが正常に機能している環境では誰より信頼できる。しかしシステムが崩壊したとき、最初に立ち止まるのもあなただ。その立ち止まりは弱さではなく、「誰かが責任を持つべきだ」という、捨てられない誠実さだろう。",
  },
  D: {
    rank: "D",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    title: "感情主導型意思決定者",
    description:
      "感情が論理的分析を圧倒する。しかしそれは欠陥ではない。あなたは数字ではなく、人間を見ているのだ。目の前の誰かの痛みが、抽象的な最適解を受け入れることを拒否させる。その拒否は、あなたがかつて「最適解」によって切り捨てられた側の痛みを知っているからかもしれない。極限状況ではそれがコストになる。しかし人間が人間である限り、あなたの共感は消えることのない価値を持ち続ける。",
  },
  E: {
    rank: "E",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
    title: "関係性の中に生きる者",
    description:
      "孤立した状況での判断能力は最小化される。これは弱点のように見えるが、本当にそうだろうか。あなたが誰かの承認を必要とするのは、依存心ではなく、「自分一人の判断で他者の命を左右することへの、根本的な畏れ」かもしれない。その畏れは高潔だ。孤立無援の危機であなたは機能しないかもしれない。しかし共同体が崩壊しそうなとき、最後まで誰かのそばにいようとするのも、またあなただ。",
  },
};

function calcRank(answers: AnswerValue[]): string {
  const aCount = answers.filter((a) => a === "A").length;
  const bCount = answers.filter((a) => a === "B").length;

  // Scoring: A=2, B=1, C=0
  const score = aCount * 2 + bCount * 1;

  if (score >= 9) return "S";
  if (score >= 7) return "A";
  if (score >= 5) return "B";
  if (score >= 3) return "C";
  if (score >= 1) return "D";
  return "E";
}

export default function DarkPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"intro" | "test" | "result">("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerValue[]>([]);
  const [visible, setVisible] = useState(true);

  const handleAnswer = (value: AnswerValue) => {
    const newAnswers = [...answers, value];
    if (currentIndex + 1 >= questions.length) {
      setAnswers(newAnswers);
      setPhase("result");
      return;
    }
    setVisible(false);
    setTimeout(() => {
      setAnswers(newAnswers);
      setCurrentIndex(currentIndex + 1);
      setVisible(true);
    }, 200);
  };

  const rank = phase === "result" ? calcRank(answers) : null;
  const rankData = rank ? RANK_DATA[rank] : null;
  const q = questions[currentIndex];

  // ── イントロ ──────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <main className="min-h-screen flex flex-col">
        <div className="nav-blur flex items-center justify-between px-5 py-4 sticky top-0 z-10">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-xs font-medium transition-colors"
            style={{ color: "rgba(255,255,255,0.38)" }}
          >
            <ArrowLeft size={14} />
            ホーム
          </button>
          <span className="text-xs font-bold tracking-[0.18em] uppercase" style={{ color: "rgba(255,255,255,0.28)" }}>
            Classified Mode
          </span>
          <div className="w-14" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-900/40 border border-rose-800/50">
              <AlertTriangle size={12} className="text-rose-400" />
              <span className="text-xs font-bold text-rose-400 tracking-wider">CLASSIFIED — DARK MODE</span>
            </div>

            <h1 className="text-2xl font-black text-white tracking-tight leading-tight">
              極限状況テスト
              <br />
              <span className="text-white/45 font-light text-lg">生存適正評価プログラム</span>
            </h1>

            <div className="text-left glass-card rounded-2xl p-5 space-y-3">
              <p className="text-xs font-semibold text-white/45 tracking-widest uppercase">注意事項</p>
              <ul className="space-y-2 text-xs text-white/45 leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-rose-400 flex-shrink-0">—</span>
                  本テストは倫理学・意思決定研究で用いられる思考実験に基づく
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-400 flex-shrink-0">—</span>
                  正解は存在しない。全ての選択肢は等しく倫理的に議論可能である
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-400 flex-shrink-0">—</span>
                  結果は「生存適正ランク（S〜E）」として表示される
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-400 flex-shrink-0">—</span>
                  このデータは通常の診断結果とは独立して処理される
                </li>
              </ul>
            </div>

            <button
              onClick={() => setPhase("test")}
              className="w-full py-3.5 rounded-xl btn-primary font-bold text-sm active:scale-[0.98]"
            >
              テストを開始する
            </button>

            <p className="text-xs text-white/20">
              全 {questions.length} 問 · 所要時間 約2分
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ── 結果 ──────────────────────────────────────────────────
  if (phase === "result" && rankData) {
    return (
      <main className="min-h-screen flex flex-col">
        <div className="nav-blur flex items-center justify-between px-5 py-4 sticky top-0 z-10">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-xs font-medium transition-colors"
            style={{ color: "rgba(255,255,255,0.38)" }}
          >
            <ArrowLeft size={14} />
            ホーム
          </button>
          <span className="text-xs font-bold tracking-[0.18em] uppercase" style={{ color: "rgba(255,255,255,0.28)" }}>評価完了</span>
          <div className="w-14" />
        </div>

        <div className="flex-1 max-w-md mx-auto w-full px-5 py-10 flex flex-col gap-5">
          {/* Rank card */}
          <div className="rounded-3xl glass-card p-7 text-center">
            <p className="text-xs font-bold text-white/30 tracking-widest mb-3 uppercase">
              Survival Aptitude Rank
            </p>
            <div className="text-8xl font-black text-white mb-2 leading-none">{rankData.rank}</div>
            <p className="text-base font-bold text-white/65 mb-1">{rankData.title}</p>
            <div className="w-10 h-px bg-white/20 mx-auto my-4" />
            <p className="text-xs text-white/45 leading-relaxed text-left">{rankData.description}</p>
          </div>

          {/* Answer breakdown */}
          <div className="rounded-2xl glass-card p-4">
            <p className="text-xs font-semibold text-white/30 tracking-widest mb-3 uppercase">回答履歴</p>
            <div className="space-y-2">
              {answers.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xs text-white/20 font-bold flex-shrink-0 w-8">Q{String(i + 1).padStart(2, "0")}</span>
                  <span
                    className={`text-xs font-bold flex-shrink-0 ${
                      a === "A" ? "text-violet-400" : a === "B" ? "text-teal-400" : "text-white/30"
                    }`}
                  >
                    {a}
                  </span>
                  <p className="text-xs text-white/30 leading-relaxed">
                    {questions[i].options.find((o) => o.value === a)?.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => { setPhase("intro"); setAnswers([]); setCurrentIndex(0); }}
              className="flex-1 py-3 rounded-xl border border-white/15 text-white/45 hover:text-white/90 text-xs font-bold transition-colors"
            >
              再テスト
            </button>
            <button
              onClick={() => router.push("/test")}
              className="flex-1 py-3 rounded-xl btn-primary text-xs font-bold transition-colors"
            >
              通常診断へ
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── 設問 ──────────────────────────────────────────────────
  return (
    <main className="min-h-screen flex flex-col">
      <div className="nav-blur flex items-center justify-between px-5 py-4 sticky top-0 z-10">
        <button
          onClick={() => {
            if (currentIndex === 0) { setPhase("intro"); } else {
              setAnswers((prev) => prev.slice(0, -1));
              setCurrentIndex(currentIndex - 1);
            }
          }}
          className="flex items-center gap-1.5 text-xs font-medium text-white/30 hover:text-white/65 transition-colors"
        >
          <ArrowLeft size={14} />
          戻る
        </button>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i < currentIndex ? "w-4 h-1 bg-rose-500" : i === currentIndex ? "w-5 h-1.5 bg-rose-400" : "w-1 h-1 bg-white/1"
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-white/30 font-medium tabular-nums">
          {currentIndex + 1}<span className="text-white/15">/{questions.length}</span>
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 glass-card">
        <div
          className="h-full bg-rose-500 transition-all duration-500 ease-out"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <div
          className="w-full max-w-md transition-all duration-200 ease-in-out"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(6px)" }}
        >
          <div className="flex justify-center mb-5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-rose-400 bg-rose-900/30 border border-rose-800/50 px-3 py-1 rounded-full">
              {q.scenario}
            </span>
          </div>

          <div className="glass-card rounded-3xl p-6 shadow-xl">
            <p className="text-xs font-medium text-white/20 mb-3 tracking-widest">
              SCENARIO {String(q.id).padStart(2, "0")}
            </p>
            <p className="text-sm text-white/90 mb-7 leading-relaxed font-medium">{q.context}</p>

            <div className="flex flex-col gap-2.5">
              {q.options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleAnswer(opt.value)}
                  className="group flex items-start gap-3 w-full text-left px-4 py-3.5 rounded-2xl border border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10 active:scale-[0.98] transition-all duration-150"
                >
                  <span className="text-xs font-black text-white/30 group-hover:text-white/65 transition-colors flex-shrink-0 mt-0.5 w-4">
                    {opt.value}
                  </span>
                  <span className="text-xs text-white/45 group-hover:text-white/90 leading-relaxed transition-colors">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-white/15 mt-5">
            正解は存在しない
          </p>
        </div>
      </div>
    </main>
  );
}
