"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TARGET_QUESTIONS } from "@/lib/target-questions";
import { ArrowLeft, Target, Loader2 } from "lucide-react";
import Link from "next/link";

export default function TargetDiagnosisPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({
    E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0
  });
  const [isCalculating, setIsCalculating] = useState(false);

  const handleAnswer = (value: string) => {
    const newScores = { ...scores, [value]: scores[value] + 1 };
    setScores(newScores);

    if (currentStep < 19) {
      // 次の質問へ
      setCurrentStep(curr => curr + 1);
    } else {
      // 計算演出
      setIsCalculating(true);
      const EorI = newScores.E > newScores.I ? "E" : "I";
      const SorN = newScores.S > newScores.N ? "S" : "N";
      const TorF = newScores.T > newScores.F ? "T" : "F";
      const JorP = newScores.J > newScores.P ? "J" : "P";
      const finalType = `${EorI}${SorN}${TorF}${JorP}`;
      
      // 計算中UIを少し見せてから結果ページへ
      setTimeout(() => {
        router.push(`/result?type=${finalType}`);
      }, 2000);
    }
  };

  const progress = (currentStep / TARGET_QUESTIONS.length) * 100;
  const question = TARGET_QUESTIONS[currentStep];

  return (
    <main className="min-h-screen bg-slate-950 relative flex flex-col font-sans overflow-hidden text-slate-100">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full p-4 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={16} />
          トップへ戻る
        </Link>
        <div className="text-xs font-bold text-violet-400 tracking-widest uppercase">
          Target Profiling
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-800 relative z-10">
        <div 
          className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500 ease-out"
          style={{ width: `${isCalculating ? 100 : progress}%` }}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10 w-full max-w-md mx-auto">
        
        {isCalculating ? (
          <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
            <Loader2 className="w-12 h-12 text-fuchsia-400 animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">
              解析中...
            </h2>
            <p className="text-sm text-slate-400 text-center">
              ターゲットの行動パターンから<br/>MBTIプロファイルを抽出しています
            </p>
          </div>
        ) : (
          <div key={question.id} className="w-full flex flex-col animate-in slide-in-from-right-8 fade-in duration-300">
            {/* Question Card */}
            <div className="glass-card bg-slate-900/50 border border-violet-500/20 rounded-3xl p-8 mb-8 text-center shadow-[0_0_40px_rgba(139,92,246,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-500/20 text-violet-400 mb-6 border border-violet-500/30">
                <Target size={24} />
              </div>
              
              <div className="text-xs font-bold text-violet-400 mb-3 tracking-widest">
                QUESTION {currentStep + 1} / 20
              </div>
              
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
                {question.text}
              </h2>
            </div>

            {/* Answer Buttons */}
            <div className="flex flex-col gap-4 w-full">
              <button
                onClick={() => handleAnswer(question.optionA.value)}
                className="w-full text-left p-5 rounded-2xl bg-slate-800/50 border border-slate-700 hover:bg-violet-900/40 hover:border-violet-500/50 transition-all duration-200 group active:scale-[0.98]"
              >
                <div className="text-xs text-slate-400 mb-1 font-bold">A</div>
                <div className="text-[15px] text-slate-200 group-hover:text-white font-medium">
                  {question.optionA.text}
                </div>
              </button>

              <button
                onClick={() => handleAnswer(question.optionB.value)}
                className="w-full text-left p-5 rounded-2xl bg-slate-800/50 border border-slate-700 hover:bg-violet-900/40 hover:border-violet-500/50 transition-all duration-200 group active:scale-[0.98]"
              >
                <div className="text-xs text-slate-400 mb-1 font-bold">B</div>
                <div className="text-[15px] text-slate-200 group-hover:text-white font-medium">
                  {question.optionB.text}
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

    </main>
  );
}
