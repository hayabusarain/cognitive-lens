"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { MBTIType } from "@/lib/bingo-data-ja";
import { getBingoData } from "@/lib/data-provider";
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
    if (lang === "en") {
      if (count === 0) return `[Fraud] Fake ${type}`;
      if (count === 1) return `[Noob] Apprentice ${type}`;
      if (count <= 3) return `[Basic] Average ${type}`;
      if (count <= 5) return `[Hardcore] Certified ${type}`;
      if (count <= 8) return `[100% Pure] Born ${type}`;
      if (count <= 11) return `[Limit Break] Breathing ${type}`;
      return `[God Tier] Walking ${type} Dictionary`;
    }
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
          <h1 className="text-3xl font-black mb-4 tracking-tight">
            {lang === "en" ? "Biased" : "偏見だらけの"}<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400">{lang === "en" ? "MBTI Bingo" : "MBTIビンゴ"}</span>
          </h1>
          <p className="text-slate-400 text-sm">
            {lang === "en" ? "Select your MBTI and see how many stereotypes you match!" : "あなたのMBTIを選択して、どれくらい「あるある」が当てはまるかチェックしよう！"}
          </p>
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

        {/* SEO & Context Article Block (for Google AdSense / Crawlers) */}
        <article className="mt-16 max-w-2xl text-left space-y-8 bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <span className="text-fuchsia-400">#</span>
              {lang === "en" ? "What is the Biased 16 Type Bingo?" : "偏見だらけの16タイプビンゴとは？"}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {lang === "en" ? (
                <>CognitiveLens's "Biased 16 Type Bingo" is an entertainment tool to visualize the stereotypes and relatable behaviors typical of each personality type.<br/>Going beyond standard psychology frameworks, we placed extreme behavioral patterns often talked about in Gen Z internet meme culture across 24 cells. You can quickly and playfully check how strictly you adhere to your type's "basic specs" (or if you carry any exceptional bugs).</>
              ) : (
                <>CognitiveLensが提供する「偏見だらけの16タイプビンゴ」は、各性格タイプにありがちな「ステレオタイプ（偏見）」や「あるある行動」を可視化するためのエンターテインメント・ツールです。<br/>一般的な心理学の枠組みを超え、Z世代やネット上のミーム文化でよく語られる「各タイプの極端な行動パターン」を24個のセルに配置しました。自分がどれだけそのタイプの「基本スペック」に忠実か（あるいは例外的なバグを抱えているか）を、遊び感覚でサクッとチェックできます。</>
              )}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400">#</span>
              {lang === "en" ? "\"Wait, why is this so accurate...?\"" : "「え、なんでこんなに当たるの…？」の理由"}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {lang === "en" ? (
                <>The reason it feels "insanely accurate" isn't just the Forer effect. It's because the combination of Jung's 8 cognitive functions clearly manifests in your daily unconscious choices and stress responses (like your inferior function going out of control). This tool decodes those psychological mechanisms into specific daily behaviors like "replying late," "acting alone," or "obsessing over useless things."</>
              ) : (
                <>このビンゴをやってみて「異常に当たる」と感じる理由は、単なるバーナム効果（誰にでも当てはまることを自分にだけ当てはまると錯覚するアレ）だけではありません。<br/>ユングの心理学的類型論に基づく「8つの認知機能」の組み合わせが、日常の無意識の選択やストレス時の反応パターン（劣等機能の暴走）として如実に表れるためです。本ツールでは、そうした心理的メカニズムを「連絡の遅さ」「単独行動の多さ」「無駄なことへの執着」といった具体的な日常行動に翻訳（デコード）して出題しています。</>
              )}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-violet-400">#</span>
              {lang === "en" ? "How to use the results & Warnings" : "ビンゴ結果の活用法と注意点"}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {lang === "en" ? (
                <>Getting a lot of bingos doesn't mean you're a "superior human." Rather, the bingo items often point out your "social bugs" (weaknesses or communication habits). Use this as a self-analysis tool to objectively realize, "Ah, so this is the unconscious impression I give off."<br/><br/>*The diagnosis/bingo functions provided on this site are entertainment-based reinterpretations of Jung's cognitive function model and are not affiliated with the official MBTI® test.</>
              ) : (
                <>ビンゴがたくさん揃ったからといって「優れた人間」というわけではありません。むしろビンゴの項目は「あなたの社会生活におけるバグ（弱点やコミュニケーションの癖）」を示していることが多いため、「あ、自分って無意識にこういう印象を与えてるんだな」と客観視する自己分析ツールとして活用してみてください。<br/><br/>
                ※当サイトで提供する診断・ビンゴ機能は、ユングの認知機能モデルを独自の解釈でエンタメ化したものであり、公式のMBTI®テストとは一切関係ありません。</>
              )}
            </p>
          </div>
        </article>

      </main>
    );
  }

  const items = getBingoData(lang)[selectedMBTI];
  const gridItems = [
    ...items.slice(0, 12),
    lang === "en" ? `I am 100%\n${selectedMBTI}\n(FREE)` : `私は確実に\n${selectedMBTI}だ\n(FREE)`,
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
            <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
              {lang === "en" ? "Biased" : "偏見だらけの"}<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400">{selectedMBTI}</span>
              {lang === "en" ? " Bingo" : " ビンゴ"}
            </h2>
            <div className="inline-block px-3 py-1 bg-slate-800/80 border border-slate-700 rounded-full">
              <p className="text-xs sm:text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400">
                {lang === "en" ? `Title: ${currentTitle}` : `称号：${currentTitle}`}
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
          {lang === "en" ? "#CognitiveLens #BiasedMBTIBingo" : "#CognitiveLens #偏見だらけのMBTIビンゴ"}
        </div>
      </div>

      <div className="w-full max-w-[400px] mt-8 flex flex-col gap-3">
        {/* X Share Button */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            lang === "en"
              ? `I got ${bingoCount} BINGO on the [Biased ${selectedMBTI} Bingo] and earned the title '${currentTitle}'! 🎯\n\nCheck out your own stereotypes on CognitiveLens, the Gen-Z MBTI analytics platform!\n\n#CognitiveLens #MBTIBingo #${selectedMBTI}\n`
              : `私は【偏見だらけの${selectedMBTI}ビンゴ】で ${bingoCount} BINGO 達成し、称号『${currentTitle}』を獲得しました！🎯\n\nZ世代向けの辛口MBTI診断サイト『CognitiveLens』で、あなたも自分の「あるある」をチェックしてみよう！\n\n#CognitiveLens #MBTI #MBTIビンゴ #${selectedMBTI}\n`
          )}&url=${encodeURIComponent(`https://cognitivelens.com/${lang}/bingo`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 bg-black border border-slate-700 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform hover:bg-slate-900"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
          {lang === "en" ? "Post result on X" : "X (Twitter) で結果をポストする"}
        </a>

        {/* Download Button */}
        <button
          onClick={exportImage}
          disabled={isExporting}
          className="w-full py-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          {isExporting ? (
            <span className="animate-pulse">{lang === "en" ? "Generating image..." : "画像を生成中..."}</span>
          ) : (
            <>
              <Download size={18} /> {lang === "en" ? "Save Bingo Card as Image" : "ビンゴカードを画像で保存する"}
            </>
          )}
        </button>
        <p className="text-[11px] text-slate-500 text-center leading-relaxed">
          {lang === "en" ? (
            <>*Due to X's specifications, images are not attached automatically from the link.<br/>Please download the image using the save button and attach it manually to your post.</>
          ) : (
            <>※Xの仕様上、リンクからの投稿では自動で画像が添付されません。<br/>画像をつけたい場合は保存ボタンからダウンロードし、ポストに手動で貼り付けてください。</>
          )}
        </p>
      </div>

      {/* SEO & Context Article Block (for Google AdSense / Crawlers) */}
      <article className="mt-24 max-w-2xl text-left space-y-8 bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
        <div className="space-y-4">
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <span className="text-fuchsia-400">#</span>
            {lang === "en" ? "What is the Biased 16 Type Bingo?" : "偏見だらけの16タイプビンゴとは？"}
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            {lang === "en" ? (
              <>CognitiveLens's "Biased 16 Type Bingo" is an entertainment tool to visualize the stereotypes and relatable behaviors typical of each personality type.<br/>Going beyond standard psychology frameworks, we placed extreme behavioral patterns often talked about in Gen Z internet meme culture across 24 cells. You can quickly and playfully check how strictly you adhere to your type's "basic specs" (or if you carry any exceptional bugs).</>
            ) : (
              <>CognitiveLensが提供する「偏見だらけの16タイプビンゴ」は、各性格タイプにありがちな「ステレオタイプ（偏見）」や「あるある行動」を可視化するためのエンターテインメント・ツールです。<br/>一般的な心理学の枠組みを超え、Z世代やネット上のミーム文化でよく語られる「各タイプの極端な行動パターン」を24個のセルに配置しました。自分がどれだけそのタイプの「基本スペック」に忠実か（あるいは例外的なバグを抱えているか）を、遊び感覚でサクッとチェックできます。</>
            )}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-cyan-400">#</span>
            {lang === "en" ? "\"Wait, why is this so accurate...?\"" : "「え、なんでこんなに当たるの…？」の理由"}
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            {lang === "en" ? (
              <>The reason it feels "insanely accurate" isn't just the Forer effect. It's because the combination of Jung's 8 cognitive functions clearly manifests in your daily unconscious choices and stress responses (like your inferior function going out of control). This tool decodes those psychological mechanisms into specific daily behaviors like "replying late," "acting alone," or "obsessing over useless things."</>
            ) : (
              <>このビンゴをやってみて「異常に当たる」と感じる理由は、単なるバーナム効果（誰にでも当てはまることを自分にだけ当てはまると錯覚するアレ）だけではありません。<br/>ユングの心理学的類型論に基づく「8つの認知機能」の組み合わせが、日常の無意識の選択やストレス時の反応パターン（劣等機能の暴走）として如実に表れるためです。本ツールでは、そうした心理的メカニズムを「連絡の遅さ」「単独行動の多さ」「無駄なことへの執着」といった具体的な日常行動に翻訳（デコード）して出題しています。</>
            )}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-violet-400">#</span>
            {lang === "en" ? "How to use the results & Warnings" : "ビンゴ結果の活用法と注意点"}
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            {lang === "en" ? (
              <>Getting a lot of bingos doesn't mean you're a "superior human." Rather, the bingo items often point out your "social bugs" (weaknesses or communication habits). Use this as a self-analysis tool to objectively realize, "Ah, so this is the unconscious impression I give off."<br/><br/>*The diagnosis/bingo functions provided on this site are entertainment-based reinterpretations of Jung's cognitive function model and are not affiliated with the official MBTI® test.</>
            ) : (
              <>ビンゴがたくさん揃ったからといって「優れた人間」というわけではありません。むしろビンゴの項目は「あなたの社会生活におけるバグ（弱点やコミュニケーションの癖）」を示していることが多いため、「あ、自分って無意識にこういう印象を与えてるんだな」と客観視する自己分析ツールとして活用してみてください。<br/><br/>※当サイトで提供する診断・ビンゴ機能は、ユングの認知機能モデルを独自の解釈でエンタメ化したものであり、公式のMBTI®テストとは一切関係ありません。</>
            )}
          </p>
        </div>
      </article>
    </main>
  );
}
