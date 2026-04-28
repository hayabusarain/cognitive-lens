"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { use } from "react";
import { getQuestions } from "@/lib/data-provider";

type Axis = "EI" | "SN" | "TF" | "JP";

interface Question {
  id: number;
  axis: string;
  axisKey: Axis;
  text: string;
  options: { label: string; value: string; emoji: string }[];
}

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

export default function TestPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  const questions = getQuestions(lang);
  
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
        router.push(`/${lang}/result?type=${type}&a=${rawAnswers}`);
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
          {lang === "en" ? "Back" : "戻る"}
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
            {remaining === 0 
              ? (lang === "en" ? "Last question." : "最後の設問です。") 
              : (lang === "en" ? `${remaining} questions left` : `残り ${remaining} 問`)}
          </p>
        </div>
      </div>
    </main>
  );
}
