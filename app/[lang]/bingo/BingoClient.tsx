"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { BINGO_DATA, MBTIType } from "@/lib/bingo-data-ja";
import { toPng } from "html-to-image";

const TYPES: MBTIType[] = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP"
];

const BINGO_LINES = [
  // Rows
  [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
  // Cols
  [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
  // Diagonals
  [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]
];

export default function BingoClient({ lang }: { lang: string }) {
  const [selectedMBTI, setSelectedMBTI] = useState<MBTIType | null>(null);
  const [stamped, setStamped] = useState<boolean[]>(Array(25).fill(false));
  const [bingoCount, setBingoCount] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const bingoRef = useRef<HTMLDivElement>(null);

  // Initialize stamped with FREE space (index 12) true
  useEffect(() => {
    if (selectedMBTI) {
      const newStamped = Array(25).fill(false);
      newStamped[12] = true; // FREE space
      setStamped(newStamped);
    }
  }, [selectedMBTI]);

  useEffect(() => {
    let count = 0;
    for (const line of BINGO_LINES) {
      if (line.every(idx => stamped[idx])) {
        count++;
      }
    }
    setBingoCount(count);
  }, [stamped]);

  const toggleStamp = (index: number) => {
    if (index === 12) return; // FREE is always stamped
    const newStamped = [...stamped];
    newStamped[index] = !newStamped[index];
    setStamped(newStamped);
  };

  const exportImage = async () => {
    if (!bingoRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(bingoRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `mbti-bingo-${selectedMBTI}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert("画像の保存に失敗しました。");
    } finally {
      setIsExporting(false);
    }
  };

  const getBingoTitle = (count: number, type: MBTIType) => {
    if (count === 0) return `【MBTI詐称疑惑】エセ${type}`;
    if (count === 1) return `【見習いレベル】駆け出しの${type}`;
    if (count <= 3) return `【量産型】よくいる${type}`;
    if (count <= 5) return `【ガチ勢】筋金入りの${type}`;
    if (count <= 8) return `【純度100%】生粋の${type}`;
    if (count <= 11) return `【限界突破】息をするように${type}`;
    return `【神の領域】歩く${type}辞典`;
  };

  if (!selectedMBTI) {
    return (
      <main className="min-h-screen pt-12 pb-24 px-6 flex flex-col items-center">
        <nav className="w-full max-w-md flex items-center mb-8">
          <Link href={`/${lang}`} className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </Link>
        </nav>
        
        <div className="max-w-md w-full text-center mb-10">
          <h1 className="text-3xl font-black mb-4 tracking-tight">偏見だらけの<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400">MBTIビンゴ</span></h1>
          <p className="text-slate-400 text-sm">あなたのMBTIを選択して、どれくらい「あるある」が当てはまるかチェックしよう！</p>
        </div>

        <div className="grid grid-cols-4 gap-3 max-w-md w-full">
          {TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedMBTI(type)}
              className="bg-slate-900/50 border border-slate-700/50 hover:bg-slate-800 hover:border-fuchsia-500/50 rounded-xl py-4 text-sm font-bold transition-all active:scale-95"
            >
              {type}
            </button>
          ))}
        </div>
      </main>
    );
  }

  const items = BINGO_DATA[selectedMBTI];
  const gridItems = [
    ...items.slice(0, 12),
    `私は確実に\n${selectedMBTI}だ\n(FREE)`,
    ...items.slice(12, 24)
  ];

  const currentTitle = getBingoTitle(bingoCount, selectedMBTI);

  return (
    <main className="min-h-screen pt-6 pb-24 px-4 flex flex-col items-center">
      <nav className="w-full max-w-md flex items-center justify-between mb-6">
        <button onClick={() => setSelectedMBTI(null)} className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="text-xs font-bold text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          {bingoCount} BINGO
        </div>
      </nav>

      {/* Bingo Card to Export */}
      <div 
        ref={bingoRef}
        className="w-full max-w-[400px] bg-slate-950 p-4 sm:p-6 rounded-3xl border border-slate-800 relative overflow-hidden"
      >
        {/* Background effects for the card */}
        <div className="absolute top-[-50px] right-[-50px] w-[150px] h-[150px] bg-fuchsia-500/20 blur-[50px] pointer-events-none" />
        <div className="absolute bottom-[-50px] left-[-50px] w-[150px] h-[150px] bg-cyan-500/20 blur-[50px] pointer-events-none" />

        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="text-left">
            <p className="text-fuchsia-400 text-[10px] font-bold tracking-widest uppercase mb-1">CognitiveLens BINGO</p>
            <h2 className="text-xl sm:text-2xl font-black text-white mb-2">偏見だらけの<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400">{selectedMBTI}</span> ビンゴ</h2>
            <div className="inline-block px-3 py-1 bg-slate-800/80 border border-slate-700 rounded-full">
              <p className="text-xs sm:text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400">
                称号：{currentTitle}
              </p>
            </div>
          </div>
          <div className="w-20 h-20 sm:w-24 sm:h-24 relative flex-shrink-0 drop-shadow-[0_0_15px_rgba(217,70,239,0.3)]">
            <Image src={`/characters/${selectedMBTI}.png`} alt={selectedMBTI} fill className="object-contain" sizes="96px" priority />
          </div>
        </div>

        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 relative z-10">
          {gridItems.map((text, idx) => {
            const isStamped = stamped[idx];
            const isFree = idx === 12;
            return (
              <motion.button
                key={idx}
                whileTap={isFree ? undefined : { scale: 0.9 }}
                onClick={() => toggleStamp(idx)}
                className={`
                  relative flex items-center justify-center text-center p-1 sm:p-2 rounded-lg sm:rounded-xl aspect-square overflow-hidden
                  transition-colors duration-200
                  ${isStamped 
                    ? "bg-fuchsia-900/40 border border-fuchsia-500/50" 
                    : "bg-slate-900 border border-slate-800 hover:bg-slate-800/80"}
                `}
              >
                <span className={`text-[9px] sm:text-[11px] font-bold leading-tight ${isStamped ? "text-white" : "text-slate-400"}`}>
                  {text.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}
                </span>
                
                {/* Stamp Effect */}
                <AnimatePresence>
                  {isStamped && (
                    <motion.div
                      initial={{ scale: 2, opacity: 0, rotate: -20 }}
                      animate={{ scale: 1, opacity: 1, rotate: -10 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-fuchsia-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(217,70,239,0.5)]">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-fuchsia-500 rounded-full shadow-[0_0_10px_rgba(217,70,239,0.8)]" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        {/* Bingo Overlay Effect */}
        <AnimatePresence>
          {bingoCount > 0 && !isExporting && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 right-4 z-20 pointer-events-none"
            >
              <div className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-4 py-2 rounded-full font-black text-white text-sm shadow-[0_0_20px_rgba(217,70,239,0.6)] rotate-[-5deg]">
                {bingoCount} BINGO!! 🎉
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 text-center text-[10px] text-slate-600 font-medium">
          #CognitiveLens #偏見だらけのMBTIビンゴ
        </div>
      </div>

      <div className="w-full max-w-[400px] mt-8 flex flex-col gap-3">
        {/* X Share Button */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            `私は【偏見だらけの${selectedMBTI}ビンゴ】で ${bingoCount} BINGO 達成し、称号『${currentTitle}』を獲得しました！🎯\n\nZ世代向けの辛口MBTI診断サイト『CognitiveLens』で、あなたも自分の「あるある」をチェックしてみよう！\n\n#CognitiveLens #MBTI #MBTIビンゴ #${selectedMBTI}\n`
          )}&url=${encodeURIComponent(`https://cognitivelens.com/ja/bingo`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 bg-black border border-slate-700 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform hover:bg-slate-900"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
          X (Twitter) で結果をポストする
        </a>

        {/* Download Button */}
        <button
          onClick={exportImage}
          disabled={isExporting}
          className="w-full py-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          {isExporting ? (
            <span className="animate-pulse">画像を生成中...</span>
          ) : (
            <>
              <Download size={18} /> ビンゴカードを画像で保存する
            </>
          )}
        </button>
        <p className="text-[11px] text-slate-500 text-center leading-relaxed">
          ※Xの仕様上、リンクからの投稿では自動で画像が添付されません。<br/>
          画像をつけたい場合は保存ボタンからダウンロードし、ポストに手動で貼り付けてください。
        </p>
      </div>
    </main>
  );
}
