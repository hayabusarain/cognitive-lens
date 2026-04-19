"use client";

import { useState, useRef } from "react";
import { Skull, Loader2, ChevronDown, Zap } from "lucide-react";
import Image from "next/image";

interface Phase {
  name: string;
  period: string;
  event: string;
  inner1: string;
  inner2: string;
}

const ALL_TYPES = [
  "INTJ","INTP","ENTJ","ENTP",
  "INFJ","INFP","ENFJ","ENFP",
  "ISTJ","ISFJ","ESTJ","ESFJ",
  "ISTP","ISFP","ESTP","ESFP",
];

const PHASE_COLORS = [
  { bg: "bg-pink-50", border: "border-pink-200", dot: "bg-pink-400", text: "text-pink-600" },
  { bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-400", text: "text-amber-600" },
  { bg: "bg-orange-50", border: "border-orange-200", dot: "bg-orange-400", text: "text-orange-600" },
  { bg: "bg-red-50", border: "border-red-200", dot: "bg-red-400", text: "text-red-600" },
  { bg: "bg-slate-100", border: "border-slate-300", dot: "bg-slate-500", text: "text-slate-700" },
];

function AdSlot({ id }: { id: string }) {
  return (
    <div
      id={id}
      className="w-full h-24 bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-xs tracking-widest uppercase rounded-xl my-4"
    >
      Sponsored
    </div>
  );
}

export default function DeathGame({ typeKey }: { typeKey: string }) {
  const [selectedType, setSelectedType] = useState("");
  const [open, setOpen] = useState(false);
  const [userGender, setUserGender] = useState("その他/指定しない");
  const [targetGender, setTargetGender] = useState("その他/指定しない");

  // ── Results are stored separately from the dropdown selection ──
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // These hold the *displayed* result — they never change when the dropdown changes
  const [resultType, setResultType] = useState("");   // the type that was analyzed
  const [phases, setPhases] = useState<Phase[]>([]);
  const [epitaph, setEpitaph] = useState("");

  // Track which type was used for the current analysis request
  const analyzeTypeRef = useRef("");

  const generate = async () => {
    const target = selectedType;
    if (!target || target === typeKey) return;

    analyzeTypeRef.current = target;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/deathgame", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type1: typeKey, type2: target, userGender, targetGender }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "失敗しました");
      } else {
        setPhases(data.phases ?? []);
        setEpitaph(data.epitaph ?? "");
        setResultType(target);
      }
    } catch {
      setError("ネットワークエラー");
    }
    setLoading(false);
  };

  const canAnalyze = !!selectedType && selectedType !== typeKey && !loading;

  return (
    <div className="rounded-3xl border overflow-hidden bg-white/60 backdrop-blur-sm border-slate-200">
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors bg-slate-50/80 hover:bg-slate-100/80 border-b border-slate-100"
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-2xl bg-slate-200 text-slate-600 flex-shrink-0">
          <Skull size={16} />
        </span>
        <div className="flex-1">
          <p className="font-semibold text-sm text-slate-800">相性デスゲーム</p>
          <p className="text-xs text-slate-500">相手を選んで「最悪の未来」をシミュレーション</p>
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="px-5 py-5 space-y-4">
          
          {/* Gender Selector */}
          <div className="grid grid-cols-2 gap-3 pb-4 border-b border-slate-100">
            <div>
              <p className="text-[10px] font-bold text-slate-500 mb-1.5 ml-1">あなたの性別</p>
              <select
                value={userGender}
                onChange={(e) => setUserGender(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 text-slate-700 text-xs px-3 py-2 rounded-xl outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%2364748b\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3E%3C/svg%3E")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2rem' }}
              >
                <option value="その他/指定しない">指定しない</option>
                <option value="男性">男性</option>
                <option value="女性">女性</option>
              </select>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 mb-1.5 ml-1">相手の性別</p>
              <select
                value={targetGender}
                onChange={(e) => setTargetGender(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 text-slate-700 text-xs px-3 py-2 rounded-xl outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%2364748b\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3E%3C/svg%3E")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2rem' }}
              >
                <option value="その他/指定しない">指定しない</option>
                <option value="男性">男性</option>
                <option value="女性">女性</option>
              </select>
            </div>
          </div>

          {/* Type selector — changing this does NOT update displayed results */}
          <div>
            <p className="text-[10px] font-bold text-slate-500 mb-2 ml-1">相手のタイプを選択</p>
            <div className="grid grid-cols-4 gap-1.5">
              {ALL_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  disabled={t === typeKey}
                  className={`py-2 rounded-xl text-xs font-bold tracking-wider transition-all duration-150 ${
                    t === typeKey
                      ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                      : selectedType === t
                        ? "bg-slate-800 text-white shadow-md"
                        : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* ── Analyze Button (always visible when a type is selected) ── */}
          {canAnalyze && (
            <button
              onClick={generate}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-white text-sm font-bold transition-all duration-150 active:scale-[0.98] bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black shadow-lg"
            >
              <Zap size={15} />
              {typeKey} × {selectedType} を分析する
            </button>
          )}

          {/* Loading */}
          {loading && (
            <div className="text-center py-8 space-y-2">
              <Loader2 size={24} className="mx-auto text-slate-400 animate-spin" />
              <p className="text-xs text-slate-500">関係の崩壊過程を生成中...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-4">
              <p className="text-xs text-red-500">{error}</p>
              <button onClick={generate} className="mt-2 text-xs underline text-slate-500">再試行</button>
            </div>
          )}

          {/* ── Timeline result (persists until re-analyzed) ── */}
          {phases.length > 0 && !loading && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">
                {typeKey} × {resultType} — 破局のタイムライン
              </p>

              <div className="relative pl-4 space-y-3">
                {/* Vertical line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-pink-300 via-red-300 to-slate-400" />

                {phases.map((phase, i) => {
                  const style = PHASE_COLORS[i] ?? PHASE_COLORS[4];
                  return (
                    <div key={i} className={`relative pl-6 rounded-2xl ${style.bg} border ${style.border} p-4`}>
                      <div className={`absolute left-0 top-5 w-3.5 h-3.5 rounded-full ${style.dot} ring-2 ring-white -translate-x-[calc(50%+9px)]`} />

                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] font-bold tracking-wider ${style.text}`}>{phase.period}</span>
                        <span className="text-xs font-extrabold text-slate-800">{phase.name}</span>
                      </div>

                      <p className="text-xs leading-relaxed text-slate-700 mb-2">
                        {phase.event}
                      </p>

                      <div className="flex flex-col gap-4 mt-4 mb-2 text-xs">
                        {/* Player 1 Chat Bubble */}
                        <div className="flex gap-2.5 items-start">
                          <div className="w-9 h-9 relative flex-shrink-0 bg-white rounded-full shadow-sm border border-slate-200 overflow-hidden">
                            <Image src={`/characters/${typeKey}.png`} alt={typeKey} fill className="object-cover" />
                          </div>
                          <div className="flex-1 bg-blue-50/80 border border-blue-100/50 rounded-2xl p-3 rounded-tl-sm text-slate-700 shadow-sm relative">
                            <p className="text-[10px] font-bold text-blue-500 mb-0.5">{typeKey}</p>
                            「{phase.inner1}」
                          </div>
                        </div>

                        {/* Player 2 Chat Bubble */}
                        <div className="flex gap-2.5 items-start flex-row-reverse">
                          <div className="w-9 h-9 relative flex-shrink-0 bg-white rounded-full shadow-sm border border-slate-200 overflow-hidden">
                            <Image src={`/characters/${resultType}.png`} alt={resultType} fill className="object-cover" />
                          </div>
                          <div className="flex-1 bg-rose-50/80 border border-rose-100/50 rounded-2xl p-3 rounded-tr-sm text-slate-700 shadow-sm relative text-right">
                            <p className="text-[10px] font-bold text-rose-500 mb-0.5">{resultType}</p>
                            「{phase.inner2}」
                          </div>
                        </div>
                      </div>

                      {/* Ad slot after phase 2 */}
                      {i === 1 && <AdSlot id="adsense-deathgame-mid" />}
                    </div>
                  );
                })}
              </div>

              {/* Epitaph */}
              {epitaph && (
                <div className="rounded-2xl bg-slate-800 text-white px-5 py-4 text-center">
                  <p className="text-[10px] text-slate-400 tracking-widest uppercase mb-1">EPITAPH</p>
                  <p className="text-sm font-medium leading-relaxed italic">
                    「{epitaph}」
                  </p>
                </div>
              )}

              {/* Ad slot after epitaph */}
              <AdSlot id="adsense-deathgame-bottom" />

              {/* Regenerate */}
              <button
                onClick={generate}
                className="w-full text-xs text-slate-500 underline underline-offset-2 py-1"
              >
                別パターンを生成
              </button>
            </div>
          )}

          {!selectedType && phases.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-2">
              相手のタイプを選択してから「分析する」を押してください
            </p>
          )}
        </div>
      )}
    </div>
  );
}
