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
    text: "友達との週末の約束が、直前にキャンセルになった。正直、内心どう思った？",
    options: [
      { label: "「やった、一人の時間ができた」と内心ホッとした", value: "I", emoji: "🛋️" },
      { label: "「え、じゃあ誰か他に誘おう」とすぐ動いた", value: "E", emoji: "📱" },
    ],
  },
  {
    id: 2,
    axis: "E / I",
    axisKey: "EI",
    text: "知らない人だらけのパーティに一人で参加。あなたが最初にすることは？",
    options: [
      { label: "隅の方で様子を見て、話しかけてくれるのを静かに待つ", value: "I", emoji: "🤫" },
      { label: "近くにいる人に自分から話しかけ、どんどん輪を広げる", value: "E", emoji: "🎙️" },
    ],
  },
  {
    id: 3,
    axis: "E / I",
    axisKey: "EI",
    text: "丸1日、誰とも会わず家でゴロゴロした。翌朝の気分は？",
    options: [
      { label: "「最高の休日だった」と完全に充電できた感がある", value: "I", emoji: "🔋" },
      { label: "「何もしなかった…」と焦りや虚無感がじわじわ来る", value: "E", emoji: "😩" },
    ],
  },
  {
    id: 4,
    axis: "E / I",
    axisKey: "EI",
    text: "新しい職場・学校の初日。あなたの本音は？",
    options: [
      { label: "「とりあえず様子見。自分から積極的に話すのは疲れる」", value: "I", emoji: "🫥" },
      { label: "「早く誰かと話したい。知り合い作りたい」とウキウキする", value: "E", emoji: "🤝" },
    ],
  },
  {
    id: 5,
    axis: "E / I",
    axisKey: "EI",
    text: "LINEの未読、どれくらいなら放置できる？",
    options: [
      { label: "気が向いたときにまとめて返す。即レスは求めないでほしい", value: "I", emoji: "🔕" },
      { label: "未読があると気になる。テンポよくやり取りしたい", value: "E", emoji: "⚡" },
    ],
  },

  // ── S / N ────────────────────────────────────────────────────
  {
    id: 6,
    axis: "S / N",
    axisKey: "SN",
    text: "新しいスマホを買った。まず何をする？",
    options: [
      { label: "説明書や設定ガイドをちゃんと読んでから使い始める", value: "S", emoji: "📖" },
      { label: "説明書は無視。とにかく触って自分で感覚をつかむ", value: "N", emoji: "⚡" },
    ],
  },
  {
    id: 7,
    axis: "S / N",
    axisKey: "SN",
    text: "「海」って言葉を聞いて、最初に頭に浮かぶのは？",
    options: [
      { label: "砂浜・波の音・潮の香りなど、具体的な景色やにおい", value: "S", emoji: "🏖️" },
      { label: "生命の始まりとか、世界の果てとか、なんか壮大なイメージ", value: "N", emoji: "🌌" },
    ],
  },
  {
    id: 8,
    axis: "S / N",
    axisKey: "SN",
    text: "友達の話を聞いていて、正直「ちょっとしんどいな」ってなるのは？",
    options: [
      { label: "結論が出てこない、ふわふわした夢とか理想の話", value: "S", emoji: "😤" },
      { label: "細かい事実やデータを延々と並べるだけの話", value: "N", emoji: "🥱" },
    ],
  },
  {
    id: 9,
    axis: "S / N",
    axisKey: "SN",
    text: "カレーを作るとき、あなたはどっち？",
    options: [
      { label: "レシピ通りにきっちり作る。失敗したくない", value: "S", emoji: "⚖️" },
      { label: "なんとなく目分量でアレンジ。毎回ちょっと違う味になる", value: "N", emoji: "🧪" },
    ],
  },
  {
    id: 10,
    axis: "S / N",
    axisKey: "SN",
    text: "5年前の旅行を思い出すとき、最初に浮かぶのは？",
    options: [
      { label: "「あの時、あそこで〇〇を食べた」という具体的な出来事", value: "S", emoji: "🎞️" },
      { label: "「なんか楽しかった」「あの空気感がよかった」という雰囲気や感情", value: "N", emoji: "🌫️" },
    ],
  },

  // ── T / F ────────────────────────────────────────────────────
  {
    id: 11,
    axis: "T / F",
    axisKey: "TF",
    text: "友達が泣きながら「もう仕事辞めたい」と電話してきた。あなたが最初にすることは？",
    options: [
      { label: "「なんでそうなったの？」「次どうするの？」と話を整理し始める", value: "T", emoji: "🧠" },
      { label: "「それはつらかったね」「話してくれてよかった」とまず共感する", value: "F", emoji: "🫶" },
    ],
  },
  {
    id: 12,
    axis: "T / F",
    axisKey: "TF",
    text: "グループ課題で明らかにサボってる人がいる。あなたはどうする？",
    options: [
      { label: "直接「もう少し動いてほしい」と言うか、役割を決め直す", value: "T", emoji: "⚙️" },
      { label: "空気が悪くなるのが嫌だから、黙って自分が代わりにやる", value: "F", emoji: "😮‍💨" },
    ],
  },
  {
    id: 13,
    axis: "T / F",
    axisKey: "TF",
    text: "褒められて一番うれしいのはどっち？",
    options: [
      { label: "「頭いいね」「分析力すごい」など、能力を認められる言葉", value: "T", emoji: "💡" },
      { label: "「優しいね」「そばにいてくれてよかった」など、存在を大切にされる言葉", value: "F", emoji: "🌸" },
    ],
  },
  {
    id: 14,
    axis: "T / F",
    axisKey: "TF",
    text: "映画を観て泣いたことがある？",
    options: [
      { label: "めったにない。ストーリーのつじつまや演出の工夫が気になる", value: "T", emoji: "🤔" },
      { label: "よくある。キャラクターの気持ちに自然と入り込んでしまう", value: "F", emoji: "😭" },
    ],
  },
  {
    id: 15,
    axis: "T / F",
    axisKey: "TF",
    text: "親友と意見がぶつかった。最終的に大事にするのは？",
    options: [
      { label: "「どちらが正しいか」。感情より事実とロジックで決着をつける", value: "T", emoji: "⚖️" },
      { label: "「誰も傷つかないか」。お互いが納得できる落としどころを探す", value: "F", emoji: "🕊️" },
    ],
  },

  // ── J / P ────────────────────────────────────────────────────
  {
    id: 16,
    axis: "J / P",
    axisKey: "JP",
    text: "友達と旅行に行くことになった。あなたが真っ先にしたいのは？",
    options: [
      { label: "どこに行くか、何時に動くか、スケジュールをしっかり決めたい", value: "J", emoji: "🗓️" },
      { label: "「とりあえず行けばなんとかなる」でOK。予定は現地で決めたい", value: "P", emoji: "🌊" },
    ],
  },
  {
    id: 17,
    axis: "J / P",
    axisKey: "JP",
    text: "スマホの通知バッジ（未読の赤い数字）、放置できる？",
    options: [
      { label: "無理。全部読んでゼロにしないと落ち着かない", value: "J", emoji: "🔴" },
      { label: "全然平気。未読が1000件溜まってても気にしない", value: "P", emoji: "😴" },
    ],
  },
  {
    id: 18,
    axis: "J / P",
    axisKey: "JP",
    text: "自分の部屋やデスクの状態は？",
    options: [
      { label: "物の定位置が決まっていて、散らかっていると落ち着かない", value: "J", emoji: "📐" },
      { label: "一見ぐちゃぐちゃだけど、自分ではどこに何があるか把握してる", value: "P", emoji: "🌀" },
    ],
  },
  {
    id: 19,
    axis: "J / P",
    axisKey: "JP",
    text: "待ち合わせの時間、だいたい何分前に着く？",
    options: [
      { label: "5〜10分前には着いてる。遅刻は考えられない", value: "J", emoji: "⏰" },
      { label: "ピッタリか、少し遅れて着くことが多い", value: "P", emoji: "🏃" },
    ],
  },
  {
    id: 20,
    axis: "J / P",
    axisKey: "JP",
    text: "明日締め切りのレポートがある。今夜のあなたは？",
    options: [
      { label: "「早く終わらせてスッキリしたい」と今すぐ取りかかる", value: "J", emoji: "✅" },
      { label: "「明日の朝でもなんとかなる」とギリギリまで引っ張る", value: "P", emoji: "⏳" },
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
