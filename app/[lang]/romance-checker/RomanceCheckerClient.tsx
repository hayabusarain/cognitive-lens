"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Heart, Sparkles, BrainCircuit, X, Check } from "lucide-react";
import Link from "next/link";
import { getRomanceData, MBTIType } from "@/lib/romance-data";
import AdSenseUnit from "@/app/components/ads/AdSenseUnit";

const ALL_TYPES: MBTIType[] = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP"
];

export default function RomanceCheckerClient({ lang }: { lang: string }) {
  const [step, setStep] = useState<"SELECT_MBTI" | "QUESTIONS" | "CALCULATING" | "RESULT">("SELECT_MBTI");
  const [targetMBTI, setTargetMBTI] = useState<MBTIType | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [yesCount, setYesCount] = useState(0);
  const [yesQuestions, setYesQuestions] = useState<string[]>([]);
  const [aiResult, setAiResult] = useState<{ feelings: string; nextAction: string; caution: string } | null>(null);

  const ROMANCE_DATA = getRomanceData(lang);

  const t = {
    fallbackNoYes: {
      feelings: lang === "en" ? "Unfortunately, there are no clear signs of affection at this moment. They likely see you purely as a friend or acquaintance." : "残念ながら、現時点では明確な好意のサインは見受けられません。相手はあなたを「普通の知り合い・友達」としてフラットに見ている可能性が高いです。",
      nextAction: lang === "en" ? "Don't rush. Respect their personal space and slowly build a connection through common interests." : "まずは焦らず、相手のパーソナルスペースを尊重しつつ、共通の話題や趣味から少しずつ接点を作っていくのがベストです。",
      caution: lang === "en" ? "Over-appealing or forcing closeness when there's no pulse will cause them to completely withdraw. Avoid this at all costs." : "脈がない状態での過度なアピールや急な距離の詰め方は、完全に引かれてしまう（蛙化される）原因になるため絶対に避けてください。"
    },
    fallbackError: {
      feelings: lang === "en" ? "Unable to get detailed AI analysis due to server load, but there are definite signs of affection based on the actions you selected." : "サーバー混雑により感情の詳細分析が取得できませんでした。しかし、選ばれた行動から確かな好意のサインが出ています。",
      caution: lang === "en" ? "Respect their pace and maintain the current good relationship without rushing." : "相手のペースを尊重し、焦らずに今の良い関係を維持しましょう。"
    },
    calculating: lang === "en" ? "Cross-referencing deep psychology with your actions..." : "深層心理とあなたの行動履歴を照合中...",
    resultTitle: lang === "en" ? "Result" : "判定結果",
    resultDesc: lang === "en" ? "Pulse rate derived from their behavioral patterns" : "あの人の行動パターンから導かれた脈あり度",
    targetPrefix: lang === "en" ? "Target: " : "ターゲット：",
    pulseRate: lang === "en" ? "Pulse Rate" : "脈あり度",
    feelingsTitle: lang === "en" ? "Their True Feelings Towards You" : "あなたに抱いている相手の本音",
    strategyTitle: lang === "en" ? "Next Move / Strategy" : "次の一手・攻略法",
    cautionTitle: lang === "en" ? "Warning / Red Flags" : "要注意・地雷行動",
    readMore: lang === "en" ? "Read deeper romance tendencies →" : "さらに詳しい恋愛傾向を読む →",
    recallActions: lang === "en" ? "Recall their actions" : "あの人の行動を思い出して",
    checkerTitle: lang === "en" ? "Target's Pulse Scanner" : "あの人の「脈あり度」スキャン",
    selectTarget: lang === "en" ? "Select the Target's MBTI" : "ターゲットのMBTIを選んでください",
    selectDesc: lang === "en" ? "Accurately scans their 'pulse rate' towards you through 20 questions tailored to their type." : "相手のタイプに特化した20個の質問から、あなたへの「脈あり度」を正確にスキャンします。",
    dontKnow: lang === "en" ? "Don't know their MBTI?" : "相手のMBTIがわからない？",
    uncoverType: lang === "en" ? "Uncover their 16 type profile →" : "あの人の16タイプを丸裸にする →"
  };

  // ステップ1: MBTI選択
  const handleSelectMBTI = (type: MBTIType) => {
    setTargetMBTI(type);
    setCurrentQIndex(0);
    setYesCount(0);
    setYesQuestions([]);
    setAiResult(null);
    setStep("QUESTIONS");
  };

  // AI分析の取得
  const fetchAiAnalysis = async (lastYes: boolean) => {
    let finalYes = [...yesQuestions];
    if (lastYes && targetMBTI) {
      finalYes.push(ROMANCE_DATA[targetMBTI].questions[currentQIndex]);
    }

    // もしYESが0個だった場合はAPIを呼ばずに専用メッセージをセット
    if (finalYes.length === 0) {
      setTimeout(() => {
        setAiResult(t.fallbackNoYes);
        setStep("RESULT");
      }, 3000);
      return;
    }

    try {
      const [res] = await Promise.all([
        fetch("/api/romance-ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetMBTI,
            yesQuestions: finalYes,
            lang
          })
        }),
        new Promise(resolve => setTimeout(resolve, 3000)) // 演出のタメ（最低3秒）
      ]);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAiResult(data);
    } catch (e) {
      console.error(e);
      // フォールバック
      setAiResult({
        feelings: t.fallbackError.feelings,
        nextAction: ROMANCE_DATA[targetMBTI!].advice,
        caution: t.fallbackError.caution
      });
    } finally {
      setStep("RESULT");
    }
  };

  // ステップ2: 回答
  const handleAnswer = (isYes: boolean) => {
    if (isYes && targetMBTI) {
      setYesCount((prev) => prev + 1);
      setYesQuestions((prev) => [...prev, ROMANCE_DATA[targetMBTI].questions[currentQIndex]]);
    }

    if (currentQIndex < ROMANCE_DATA[targetMBTI].questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      // 終了
      setStep("CALCULATING");
      fetchAiAnalysis(isYes);
    }
  };

  const handleReset = () => {
    setStep("SELECT_MBTI");
    setTargetMBTI(null);
  };

  // ----- UI Renders -----

  if (step === "CALCULATING") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-900/20 via-slate-950 to-slate-950"></div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-fuchsia-500 mb-6 relative z-10"
        >
          <BrainCircuit size={48} />
        </motion.div>
        <p className="text-white font-bold tracking-widest animate-pulse relative z-10 text-sm text-center">
          {targetMBTI}<br/>{t.calculating}
        </p>
      </div>
    );
  }

  if (step === "RESULT" && targetMBTI) {
    const data = ROMANCE_DATA[targetMBTI];
    const matchPercentage = Math.round((yesCount / data.questions.length) * 100);

    return (
      <main className="min-h-screen bg-slate-950 text-white relative pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-900/30 via-slate-950 to-slate-950 pointer-events-none"></div>
        
        <nav className="flex items-center p-6 relative z-10">
          <button onClick={handleReset} className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
        </nav>

        <div className="max-w-md mx-auto px-6 relative z-10 pt-4 animate-fade-in-up">
          <div className="text-center mb-8">
            <p className="text-fuchsia-400 text-xs font-bold tracking-widest mb-2 uppercase">Analysis Complete</p>
            <h1 className="text-3xl font-black mb-2">{t.resultTitle}</h1>
            <p className="text-slate-400 text-sm">{t.resultDesc}</p>
          </div>

          <div className="glass-card rounded-3xl p-8 border border-fuchsia-500/30 bg-slate-900/50 backdrop-blur-xl relative overflow-hidden mb-6">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-fuchsia-500/20 blur-3xl rounded-full"></div>
            
            <div className="text-center relative z-10">
              <p className="text-slate-400 text-sm mb-1 font-bold">{t.targetPrefix}{targetMBTI}</p>

              <div className="relative w-40 h-40 mx-auto my-8">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-slate-800" strokeWidth="8" />
                  <motion.circle 
                    cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-fuchsia-500" strokeWidth="8"
                    strokeDasharray="283"
                    initial={{ strokeDashoffset: 283 }}
                    animate={{ strokeDashoffset: 283 - (283 * matchPercentage) / 100 }}
                    transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, type: "spring" }}
                    className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-500"
                  >
                    {matchPercentage}<span className="text-2xl">%</span>
                  </motion.span>
                  <span className="text-[10px] text-fuchsia-400 font-bold uppercase tracking-wider mt-1">{t.pulseRate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {/* 本音 */}
            <div className="rounded-3xl p-6 bg-slate-900 border border-slate-800">
              <h3 className="font-bold text-pink-400 mb-3 flex items-center gap-2 text-sm">
                <Heart size={16} className="fill-pink-500/20" /> {t.feelingsTitle}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {aiResult?.feelings}
              </p>
            </div>

            {/* 攻略法 */}
            <div className="rounded-3xl p-6 bg-slate-900 border border-slate-800">
              <h3 className="font-bold text-fuchsia-400 mb-3 flex items-center gap-2 text-sm">
                <Sparkles size={16} /> {t.strategyTitle}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {aiResult?.nextAction}
              </p>
            </div>

            {/* 地雷行動 */}
            <div className="rounded-3xl p-6 bg-slate-900 border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl"></div>
              <h3 className="font-bold text-red-400 mb-3 flex items-center gap-2 text-sm relative z-10">
                <X size={16} strokeWidth={3} /> {t.cautionTitle}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed relative z-10">
                {aiResult?.caution}
              </p>
            </div>
          </div>

          {/* AdSense Space */}
          <div className="mb-8 w-full flex items-center justify-center overflow-hidden">
            <AdSenseUnit id="adsense-romance-result" slotId="9999999999" />
          </div>

          <div className="mt-8 text-center">
            <Link 
              href={`/${lang}/article/${targetMBTI}`}
              className="inline-block w-full py-4 rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-bold text-sm shadow-[0_0_20px_rgba(192,132,252,0.4)] active:scale-95 transition-transform"
            >
              {t.readMore}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (step === "QUESTIONS" && targetMBTI) {
    const questions = ROMANCE_DATA[targetMBTI].questions;
    const currentQ = questions[currentQIndex];
    const totalQ = questions.length;
    const progressPercentage = ((currentQIndex) / totalQ) * 100;

    return (
      <main className="min-h-screen bg-slate-50 text-slate-800 relative pb-28 flex flex-col">
        {/* ProgressBar */}
        <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-200 z-50">
          <motion.div 
            className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-500"
            initial={{ width: `${((currentQIndex - 1) / totalQ) * 100}%` }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>

        <nav className="flex items-center justify-between px-6 py-4 pt-6">
          <button onClick={handleReset} className="text-slate-400 hover:text-slate-800 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <span className="text-xs font-bold text-slate-400 tracking-widest">
            {currentQIndex + 1} / {totalQ}
          </span>
        </nav>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full px-6">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 bg-fuchsia-100 text-fuchsia-600 text-[10px] font-bold rounded-full mb-4 tracking-widest">
              TARGET: {targetMBTI}
            </span>
            <p className="text-sm text-slate-500 font-bold mb-2">{t.recallActions}</p>
          </div>

          {/* Question Card with Slide Animation */}
          <div className="relative h-64 w-full">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentQIndex}
                initial={{ opacity: 0, x: 50, rotate: 2 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                exit={{ opacity: 0, x: -50, rotate: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute inset-0 bg-white rounded-3xl shadow-xl border border-slate-100 p-8 flex items-center justify-center text-center"
              >
                <h2 className="text-xl md:text-2xl font-black text-slate-800 leading-relaxed tracking-tight">
                  {currentQ}
                </h2>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-12">
            <button 
              onClick={() => handleAnswer(false)}
              className="flex-1 py-5 rounded-2xl bg-white border-2 border-slate-200 text-slate-400 font-black text-lg shadow-sm active:scale-95 transition-all hover:bg-slate-50 flex items-center justify-center gap-2"
            >
              <X size={20} strokeWidth={3} />
              NO
            </button>
            <button 
              onClick={() => handleAnswer(true)}
              className="flex-1 py-5 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white font-black text-lg shadow-lg shadow-fuchsia-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Check size={20} strokeWidth={3} />
              YES
            </button>
          </div>
        </div>
      </main>
    );
  }

  // default: SELECT_MBTI
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 relative pb-28">
      <nav className="flex items-center px-6 py-4 pt-6">
        <Link href={`/${lang}`} className="text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={20} />
        </Link>
      </nav>

      <div className="max-w-md mx-auto px-6 pt-2">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-fuchsia-600 bg-fuchsia-50 px-3 py-1 rounded-full mb-3 border border-fuchsia-100">
            <Heart size={12} className="fill-fuchsia-500" />
            {t.checkerTitle}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight text-slate-900 leading-tight">
            {lang === "en" ? (
              <>{t.selectTarget}</>
            ) : (
              <>ターゲットのMBTIを<br/>選んでください</>
            )}
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            {t.selectDesc}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-8">
          {ALL_TYPES.map((type) => (
            <motion.button
              key={type}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSelectMBTI(type)}
              className="py-4 bg-white rounded-2xl shadow-sm border border-slate-200 text-sm font-black text-slate-700 hover:border-fuchsia-400 hover:text-fuchsia-600 hover:bg-fuchsia-50 transition-colors"
            >
              {type}
            </motion.button>
          ))}
        </div>

        {/* わからない方向けの導線 */}
        <div className="text-center p-6 bg-slate-100 rounded-3xl border border-slate-200 mb-8">
          <p className="text-xs text-slate-500 font-bold mb-3">{t.dontKnow}</p>
          <Link 
            href={`/${lang}/target-diagnosis`}
            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-800 text-white font-bold text-xs shadow-md transition-transform hover:-translate-y-0.5"
          >
            {t.uncoverType}
          </Link>
        </div>

        {/* AdSense Space */}
        <div className="mb-8 w-full flex items-center justify-center overflow-hidden">
          <AdSenseUnit id="adsense-romance-select" slotId="8888888888" />
        </div>

        {/* SEO & Context Article Block (for Google AdSense / Crawlers) */}
        <article className="mt-12 text-left space-y-8 bg-white/50 p-6 sm:p-8 rounded-3xl border border-slate-200">
          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
              <span className="text-fuchsia-500">♥</span>
              脈あり度（接続希望度）スキャンとは？
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              気になるあの人の16タイプを選択し、最近の「あるある行動」をチェックするだけで、AIがあなたへの「脈あり度（接続希望度）」を精密にスキャンするツールです。<br/>
              世の中に溢れる一般的な恋愛占いとは違い、ユングの認知機能（心理機能）モデルをベースに「なぜそのタイプは、好意を持った時にそんな不器用な行動をとってしまうのか？」という深層ロジックを解析します。
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="text-cyan-500">⚙</span>
              16タイプ別の「好意のバグ」を見抜く
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              恋愛における「好意のサイン」って、実は全人類共通じゃありません。<br/>
              例えば外向的感情（Fe）が強いタイプは分かりやすく世話を焼いてくれますが、内向的思考（Ti）が強いタイプの場合は「あなたのためだけに時間を割いて、超・非効率な論理的議論に付き合ってくれる」ことが最大の好意（接続要求）だったりするんです。<br/>
              本ツールは、そういった「一見するとそっけないけど、実は彼らなりの最大級のアプローチ」を見逃さないための翻訳機（デコーダー）として機能します。
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="text-violet-500">⚠</span>
              スキャン結果の取り扱い注意点
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              本ツールが算出する「接続希望度」は絶対的なものではありません。相手が仕事などで極度なストレス状態（グリップ状態）にある場合、本来の心理機能とは真逆の行動パターンを示すことがあります。あくまで「相手の基本OSの仕様から推測される現状のステータス」として参考にしつつ、実際のリアルな対話を深めるためのエンターテインメントとしてお楽しみください。<br/><br/>
              ※本ツールはユング心理学の概念を応用した独自のエンタメ機能であり、公式のMBTI®テストとは無関係です。
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
