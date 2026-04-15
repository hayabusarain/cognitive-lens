"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type Axis = "EI" | "SN" | "TF" | "JP";

interface Question {
  id: number;
  axis: string;
  axisKey: Axis;
  text: string;
  options: { label: string; value: string; emoji: string }[];
}

const questions: Question[] = [
  // ── E / I ────────────────────────────────────────────────────
  {
    id: 1,
    axis: "E / I",
    axisKey: "EI",
    text: "ヤバいニュースや面白い投稿を見つけた時、あなたはどうする？",
    options: [
      { label: "すぐ誰かに共有（ストーリー、DM）して語り合いたい", value: "E", emoji: "🗣️" },
      { label: "自分の中で「へー」と納得して完結させる", value: "I", emoji: "🤐" },
    ],
  },
  {
    id: 2,
    axis: "E / I",
    axisKey: "EI",
    text: "誰かと話してて、自分が一番アガる瞬間は？",
    options: [
      { label: "テンポよく話題が飛んで、連想ゲームみたいになる時", value: "E", emoji: "⚡" },
      { label: "一つのテーマについて、腰を据えて深く語り合う時", value: "I", emoji: "☕" },
    ],
  },
  {
    id: 3,
    axis: "E / I",
    axisKey: "EI",
    text: "1週間頑張って疲れた休みの日、どうやって回復する？",
    options: [
      { label: "誰かと会って外の刺激を受けることで回復する", value: "E", emoji: "🔋" },
      { label: "一人で引きこもって自分の世界に浸ることで回復する", value: "I", emoji: "🛌" },
    ],
  },
  {
    id: 4,
    axis: "E / I",
    axisKey: "EI",
    text: "初対面が混じる集まり（オフ会、サークル等）でのあなたは？",
    options: [
      { label: "自分から輪に入り、場の空気を回そうとする", value: "E", emoji: "💃" },
      { label: "周りをじっくり観察して、必要最小限で話す", value: "I", emoji: "👀" },
    ],
  },
  {
    id: 5,
    axis: "E / I",
    axisKey: "EI",
    text: "「今から来れる？」という急な誘いへの反応は？",
    options: [
      { label: "面白そうなら即OK。新しい刺激が欲しい", value: "E", emoji: "🏃" },
      { label: "予定や心の準備がないと、暇でも断りがち", value: "I", emoji: "🙅" },
    ],
  },

  // ── S / N ────────────────────────────────────────────────────
  {
    id: 6,
    axis: "S / N",
    axisKey: "SN",
    text: "自分が喋っていて一番楽しい話題は？",
    options: [
      { label: "最近あったリアルな体験や、具体的な事実の話", value: "S", emoji: "🗣️" },
      { label: "「もしも」の話や、将来のビジョン、抽象的な妄想", value: "N", emoji: "💭" },
    ],
  },
  {
    id: 7,
    axis: "S / N",
    axisKey: "SN",
    text: "服やアイテムを買う時の決め手は？",
    options: [
      { label: "実際のレビューや、機能性、着回し力", value: "S", emoji: "🛒" },
      { label: "そのブランドのコンセプトや、他にはない独特の感性", value: "N", emoji: "✨" },
    ],
  },
  {
    id: 8,
    axis: "S / N",
    axisKey: "SN",
    text: "インスタ等に上げる写真の好みは？",
    options: [
      { label: "その場の空気感がリアルに伝わる、綺麗な記録写真", value: "S", emoji: "📸" },
      { label: "構図が独特だったり、何かメッセージ性のある「エモい」写真", value: "N", emoji: "🌌" },
    ],
  },
  {
    id: 9,
    axis: "S / N",
    axisKey: "SN",
    text: "人に何かを説明する時のあなたのクセは？",
    options: [
      { label: "具体的で細かい。順を追って事実を話す", value: "S", emoji: "📋" },
      { label: "比喩や例え話が多く、結論がいきなり飛ぶことがある", value: "N", emoji: "🚀" },
    ],
  },
  {
    id: 10,
    axis: "S / N",
    axisKey: "SN",
    text: "予想外のハプニングが起きた時の第一反応は？",
    options: [
      { label: "「今できること」を冷静に探し、具体的に動き出す", value: "S", emoji: "🔧" },
      { label: "「そもそも何で起きた？」と根本的な原因を考え出す", value: "N", emoji: "🤔" },
    ],
  },

  // ── T / F ────────────────────────────────────────────────────
  {
    id: 11,
    axis: "T / F",
    axisKey: "TF",
    text: "友達から真剣な悩みを相談されたら？",
    options: [
      { label: "最適な解決策や「こうすれば？」というアドバイスを出す", value: "T", emoji: "💡" },
      { label: "「それは辛かったね」と、まず気持ちに共感する", value: "F", emoji: "🫂" },
    ],
  },
  {
    id: 12,
    axis: "T / F",
    axisKey: "TF",
    text: "意見がぶつかった時のあなたの態度は？",
    options: [
      { label: "感情を置いておき、正論やロジックで白黒つけようとする", value: "T", emoji: "⚖️" },
      { label: "気まずさを避けて、納得いかなくても相手に合わせがち", value: "F", emoji: "😮‍💨" },
    ],
  },
  {
    id: 13,
    axis: "T / F",
    axisKey: "TF",
    text: "他人を褒める時、どこに目が行く？",
    options: [
      { label: "実力やスキルの高さ、仕事の早さなどの「能力」", value: "T", emoji: "📈" },
      { label: "性格の良さや、周りへの気遣いなどの「人柄」", value: "F", emoji: "🌸" },
    ],
  },
  {
    id: 14,
    axis: "T / F",
    axisKey: "TF",
    text: "最終的な決め手の口癖は？",
    options: [
      { label: "「どっちが合理的か」「コスパやメリットがあるか」", value: "T", emoji: "💰" },
      { label: "「どっちが好きか」「自分のテンションが上がるか」", value: "F", emoji: "❤️" },
    ],
  },
  {
    id: 15,
    axis: "T / F",
    axisKey: "TF",
    text: "大事な友達が間違ったことをしていたら？",
    options: [
      { label: "相手のためを思って、ダメなものはダメとはっきり言う", value: "T", emoji: "🛑" },
      { label: "まず相手の事情を聞いて、味方でいようとする", value: "F", emoji: "🛡️" },
    ],
  },

  // ── J / P ────────────────────────────────────────────────────
  {
    id: 16,
    axis: "J / P",
    axisKey: "JP",
    text: "旅行や遊びの計画を立てる時のスタンスは？",
    options: [
      { label: "行き先や時間をガチガチに決め、予約も済ませたい", value: "J", emoji: "🗓️" },
      { label: "その場で決めたいから、予約は最小限でいい", value: "P", emoji: "🎲" },
    ],
  },
  {
    id: 17,
    axis: "J / P",
    axisKey: "JP",
    text: "締め切りがある時のあなたの行動は？",
    options: [
      { label: "余裕を持って終わらせるよう、計画的にコツコツやる", value: "J", emoji: "✅" },
      { label: "ギリギリまで放置して、最後に爆発的な集中力を出す", value: "P", emoji: "🔥" },
    ],
  },
  {
    id: 18,
    axis: "J / P",
    axisKey: "JP",
    text: "普段のメッセージのやり取りの感じは？",
    options: [
      { label: "割とすぐ返す。既読スルーや未読放置はあまりしない", value: "J", emoji: "⚡" },
      { label: "マイペース。頭の中で返信して満足し、忘れがち", value: "P", emoji: "🐢" },
    ],
  },
  {
    id: 19,
    axis: "J / P",
    axisKey: "JP",
    text: "自分の身の回りの整理整頓具合は？",
    options: [
      { label: "定位置が決まっていて、いつ見てもスッキリしている", value: "J", emoji: "📐" },
      { label: "散らかっているが、どこに何があるか自分では把握している", value: "P", emoji: "🌪️" },
    ],
  },
  {
    id: 20,
    axis: "J / P",
    axisKey: "JP",
    text: "急に予定がキャンセルや変更になった時、どう感じる？",
    options: [
      { label: "計画が崩れることを嫌がり、少しイラッとする", value: "J", emoji: "😠" },
      { label: "「まあいっか」で、すぐに別の楽しいことを探し始める", value: "P", emoji: "🎈" },
    ],
  },
];

function calcType(answers: { axisKey: Axis; value: string }[]): string {
  const counts: Record<Axis, Record<string, number>> = {
    EI: { E: 0, I: 0 },
    SN: { S: 0, N: 0 },
    TF: { T: 0, F: 0 },
    JP: { J: 0, P: 0 },
  };
  for (const { axisKey, value } of answers) {
    counts[axisKey][value] = (counts[axisKey][value] ?? 0) + 1;
  }
  const ei = counts.EI.E >= counts.EI.I ? "E" : "I";
  const sn = counts.SN.S >= counts.SN.N ? "S" : "N";
  const tf = counts.TF.T >= counts.TF.F ? "T" : "F";
  const jp = counts.JP.J >= counts.JP.P ? "J" : "P";
  return `${ei}${sn}${tf}${jp}`;
}

export default function TestPage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ axisKey: Axis; value: string }[]>([]);
  const [visible, setVisible] = useState(true);

  const total = questions.length;
  const progress = ((currentQuestionIndex + 1) / total) * 100;
  const q = questions[currentQuestionIndex];
  const remaining = total - currentQuestionIndex - 1;

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, { axisKey: q.axisKey, value }];
    if (currentQuestionIndex + 1 >= total) {
      setVisible(false);
      setTimeout(() => {
        const type = calcType(newAnswers);
        const rawAnswers = newAnswers.map((a) => a.value).join("");
        router.push(`/result?type=${type}&a=${rawAnswers}`);
      }, 300);
      return;
    }
    setVisible(false);
    setTimeout(() => {
      setAnswers(newAnswers);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setVisible(true);
    }, 220);
  };

  const handleBack = () => {
    if (currentQuestionIndex === 0) return;
    setVisible(false);
    setTimeout(() => {
      setAnswers((prev) => prev.slice(0, -1));
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setVisible(true);
    }, 180);
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="nav-blur flex items-center justify-between px-6 py-4 sticky top-0 z-10">
        <button
          onClick={handleBack}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-1.5 text-xs font-medium disabled:opacity-25 transition-colors"
          
        >
          <ArrowLeft size={14} />
          戻る
        </button>

        <div className="flex gap-1 items-center">
          {questions.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-500"
              style={{
                width: i === currentQuestionIndex ? 12 : i < currentQuestionIndex ? 8 : 4,
                height: i === currentQuestionIndex ? 6 : i < currentQuestionIndex ? 4 : 4,
                background: i < currentQuestionIndex
                  ? "#00e5ff"
                  : i === currentQuestionIndex
                  ? "#1e293b"
                  : "#94a3b8",
              }}
            />
          ))}
        </div>

        <span className="text-xs font-medium tabular-nums" >
          {currentQuestionIndex + 1}
          <span style={{ opacity: 0.4 }}>/{total}</span>
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-[2px] progress-track">
        <div
          className="h-full progress-fill transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question area */}
      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <div
          className="w-full max-w-md transition-all duration-220 ease-in-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(8px)",
          }}
        >
          <div className="flex justify-center mb-5">
            <span
              className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.18em] px-3 py-1 rounded-full badge-dark"
            >
              {q.axis}
            </span>
          </div>

          <div
            className="glass-card rounded-3xl p-7"
          >
            <p className="text-[10px] font-bold mb-3 tracking-[0.2em]" >
              Q{String(q.id).padStart(2, "0")}
            </p>
            <h2
              className="text-lg font-bold mb-7 leading-snug"
              
            >
              {q.text}
            </h2>

            <div className="flex flex-col gap-3">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAnswer(opt.value)}
                  className="group flex items-center gap-4 w-full text-left px-5 py-4 rounded-2xl btn-ghost font-medium text-sm active:scale-[0.98] transition-all duration-150"
                >
                  <span className="text-xl flex-shrink-0">{opt.emoji}</span>
                  <span className="flex-1 leading-snug" >
                    {opt.label}
                  </span>
                  <span
                    className="text-[10px] font-bold flex-shrink-0"
                    
                  >
                    {opt.value}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-xs mt-5" >
            {remaining === 0 ? "最後の設問です。" : `残り ${remaining} 問`}
          </p>
        </div>
      </div>
    </main>
  );
}
