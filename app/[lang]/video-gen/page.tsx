"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { TierListEntry } from "@/remotion/TierListVideo";
import { PRESET_TIER_LISTS } from "@/lib/tier-list-data";
import { PRESET_TIER_LISTS_EN } from "@/lib/tier-list-data-en";
import { SMARTPHONE_PRESETS } from "@/lib/smartphone-data";
import { SMARTPHONE_PRESETS_EN } from "@/lib/smartphone-data-en";
import { REACTION_PRESETS } from "@/lib/reaction-data";
import { REACTION_PRESETS_EN } from "@/lib/reaction-data-en";
import { PIECHART_PRESETS } from "@/lib/piechart-data";
import { PIECHART_PRESETS_EN } from "@/lib/piechart-data-en";
import { COMBO_PRESETS } from "@/lib/combo-data";
import { COMBO_PRESETS_EN } from "@/lib/combo-data-en";
import { Loader2, Download, PlayCircle, Settings2, Sparkles, Video } from "lucide-react";

export default function VideoGeneratorPage() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang || "ja";
  const PRESETS = lang === "en" ? PRESET_TIER_LISTS_EN : PRESET_TIER_LISTS;
  const smartphonePresets = lang === "en" ? SMARTPHONE_PRESETS_EN : SMARTPHONE_PRESETS;
  const reactionPresets = lang === "en" ? REACTION_PRESETS_EN : REACTION_PRESETS;
  const piechartPresets = lang === "en" ? PIECHART_PRESETS_EN : PIECHART_PRESETS;
  const comboPresets = lang === "en" ? COMBO_PRESETS_EN : COMBO_PRESETS;

  const [selectedPresetId, setSelectedPresetId] = useState(PRESETS[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [generatedEntries, setGeneratedEntries] = useState<TierListEntry[] | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [errorMSG, setErrorMSG] = useState<string | null>(null);

  const [videoFormat, setVideoFormat] = useState<"ranking" | "pov" | "smartphone" | "reaction" | "piechart" | "combo">("ranking");
  const [selectedPovType, setSelectedPovType] = useState("INFP");
  const [selectedSmartphoneId, setSelectedSmartphoneId] = useState(smartphonePresets[0].id);
  const [selectedReactionId, setSelectedReactionId] = useState(reactionPresets[0].id);
  const [selectedPiechartId, setSelectedPiechartId] = useState(piechartPresets[0].id);
  const [selectedComboId, setSelectedComboId] = useState(comboPresets[0].id);
  const [tiktokCaption, setTiktokCaption] = useState<string | null>(null);
  const [captionCopied, setCaptionCopied] = useState(false);
  
  const handleGenerate = async () => {
    if (videoFormat === "ranking" && !selectedPresetId) return;
    setIsLoading(true);
    setVideoUrl(null);
    setErrorMSG(null);
    setGeneratedEntries(null);
    setTiktokCaption(null);
    setCaptionCopied(false);
    setProgress(10);

    try {
      if (videoFormat === "ranking") {
        const preset = PRESETS.find(p => p.id === selectedPresetId);
        if (!preset) throw new Error(lang === "en" ? "Theme not found" : "お題が見つかりません");

        setStatus(lang === "en" ? "Assembling script and images..." : "内部データから台本と画像を組み立て中...");
        
        const isTop5 = preset.videoType === "top5";

        const mappedEntries = preset.entries.map(e => {
          return {
            ...e,
            rank: isTop5 ? parseInt(e.tier, 10) : undefined,
            imageUrl: `/characters/${e.mbtiType}.png`
          };
        });
        setProgress(40);
        
        const entriesWithAudio = mappedEntries as TierListEntry[];
        setGeneratedEntries(entriesWithAudio);
        setProgress(60);

        setStatus(lang === "en" ? "Rendering video to MP4 in the background... (takes ~20s)" : "動画をバックグラウンドでMP4にレンダリング中... (約20秒かかります)");
        
        const popDuration = isTop5 ? 150 : 80;
        
        const renderRes = await fetch("/api/render-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            compositionId: isTop5 ? "Top5RankingVideo" : "TierListVideo",
            presetId: preset.id,
            inputProps: {
              title: preset.title,
              entries: entriesWithAudio,
              popDuration: popDuration,
              lang: lang,
            }
          })
        });

        if (!renderRes.ok) {
          const errJson = await renderRes.json();
          throw new Error(errJson.error || (lang === "en" ? "Video rendering failed" : "動画のレンダリングに失敗しました"));
        }
        
        const renderData = await renderRes.json();
        setVideoUrl(renderData.url);
        setTiktokCaption(preset.tiktokCaption);
      } else if (videoFormat === "pov") {
        // POV
        let povDataObj;
        if (lang === "en") {
          const { POV_DATA_EN } = await import("@/lib/pov-data-en");
          povDataObj = POV_DATA_EN;
        } else {
          const { POV_DATA } = await import("@/lib/pov-data");
          povDataObj = POV_DATA;
        }
        
        const pov = povDataObj[selectedPovType];
        if (!pov) throw new Error("POV data not found");

        setStatus("POVスクリプトを読み込み中...");
        setProgress(40);
        
        // プレビュー用にモックとして1件だけ入れる
        const hashtags = `\n\n#${pov.mbti} #${pov.mbti}あるある #MBTI #性格診断 #恋愛 #pov`;
        setGeneratedEntries([{ mbtiType: pov.mbti, tier: "POV", comment: pov.caption + hashtags } as any]);
        setProgress(60);

        setStatus("POV動画をレンダリング中... (数分かかる場合があります)");
        
        const renderRes = await fetch("/api/render-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            compositionId: "AestheticPOVVideo",
            presetId: `pov_${pov.mbti}`,
            inputProps: {
              mbtiType: pov.mbti,
              title: pov.title,
              texts: pov.texts,
              // backgroundUrl: "" // TODO: 背景URLを指定できるUI
            }
          })
        });

        if (!renderRes.ok) {
          const errJson = await renderRes.json();
          throw new Error(errJson.error || "動画のレンダリングに失敗しました");
        }
        
        const renderData = await renderRes.json();
        setVideoUrl(renderData.url);
      } else {
        // プリセットから台本を読み込んで即レンダリング
        setStatus("プリセットの台本を読み込み中...");
        setProgress(30);

        let compositionId = "";
        let inputProps: any = {};
        let presetId = "";
        let presetTitle = "";
        let caption = "";

        if (videoFormat === "smartphone") {
          compositionId = "SmartphoneScreenVideo";
          const preset = smartphonePresets.find(p => p.id === selectedSmartphoneId);
          if (!preset) throw new Error("プリセットが見つかりません");
          inputProps = preset.inputProps;
          presetId = preset.id;
          presetTitle = preset.title;
          caption = preset.tiktokCaption;
        } else if (videoFormat === "reaction") {
          compositionId = "ReactionPOVVideo";
          const preset = reactionPresets.find(p => p.id === selectedReactionId);
          if (!preset) throw new Error("プリセットが見つかりません");
          inputProps = preset.inputProps;
          presetId = preset.id;
          presetTitle = preset.title;
          caption = preset.tiktokCaption;
        } else if (videoFormat === "piechart") {
          compositionId = "PieChartVideo";
          const preset = piechartPresets.find(p => p.id === selectedPiechartId);
          if (!preset) throw new Error("プリセットが見つかりません");
          inputProps = preset.inputProps;
          presetId = preset.id;
          presetTitle = preset.title;
          caption = preset.tiktokCaption;
        } else if (videoFormat === "combo") {
          compositionId = "HellishComboVideo";
          const preset = comboPresets.find(p => p.id === selectedComboId);
          if (!preset) throw new Error("プリセットが見つかりません");
          inputProps = preset.inputProps;
          presetId = preset.id;
          presetTitle = preset.title;
          caption = preset.tiktokCaption;
        }

        setGeneratedEntries([{ mbtiType: "ALL", tier: videoFormat, comment: `「${presetTitle}」のプリセットで生成中` } as any]);
        setProgress(50);

        setStatus("動画をレンダリング中... (数分かかる場合があります)");
        setProgress(60);

        const renderRes = await fetch("/api/render-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            compositionId,
            presetId,
            inputProps
          })
        });

        if (!renderRes.ok) {
          const errJson = await renderRes.json();
          throw new Error(errJson.error || "動画のレンダリングに失敗しました");
        }
        
        const renderData = await renderRes.json();
        setVideoUrl(renderData.url);
        setTiktokCaption(caption);
      }
      
      setProgress(100);
      setStatus(lang === "en" ? "Completed!" : "完成しました！");

    } catch (error: any) {
      console.error(error);
      setErrorMSG(error.message);
      setStatus(lang === "en" ? "An error occurred." : "エラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-10 text-white font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black mb-3 flex items-center justify-center gap-3">
            <Video className="w-10 h-10 text-cyan-400" />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              {lang === "en" ? "Auto YouTube Shorts Generator" : "Auto TikTok Generator"}
            </span>
          </h1>
          <p className="text-neutral-400">
            {lang === "en" ? "Just select a theme and let AI generate the script + voice + tier list video automatically." : "お題を入力するだけで、AI台本 + 音声 + ティアリスト動画 を全自動生成"}
          </p>
        </header>

        <main className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setVideoFormat("ranking")}
                className={`flex-1 min-w-[120px] py-3 rounded-xl font-bold transition-all text-sm ${
                  videoFormat === "ranking" 
                    ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]" 
                    : "bg-white/5 text-neutral-400 hover:bg-white/10"
                }`}
              >
                ランキング
              </button>
              <button
                onClick={() => setVideoFormat("pov")}
                className={`flex-1 min-w-[120px] py-3 rounded-xl font-bold transition-all text-sm ${
                  videoFormat === "pov" 
                    ? "bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]" 
                    : "bg-white/5 text-neutral-400 hover:bg-white/10"
                }`}
              >
                POV
              </button>
              <button
                onClick={() => setVideoFormat("smartphone")}
                className={`flex-1 min-w-[120px] py-3 rounded-xl font-bold transition-all text-sm ${
                  videoFormat === "smartphone" 
                    ? "bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]" 
                    : "bg-white/5 text-neutral-400 hover:bg-white/10"
                }`}
              >
                スマホ画面
              </button>
              <button
                onClick={() => setVideoFormat("reaction")}
                className={`flex-1 min-w-[120px] py-3 rounded-xl font-bold transition-all text-sm ${
                  videoFormat === "reaction" 
                    ? "bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]" 
                    : "bg-white/5 text-neutral-400 hover:bg-white/10"
                }`}
              >
                シチュエーション
              </button>
              <button
                onClick={() => setVideoFormat("piechart")}
                className={`flex-1 min-w-[120px] py-3 rounded-xl font-bold transition-all text-sm ${
                  videoFormat === "piechart" 
                    ? "bg-fuchsia-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.4)]" 
                    : "bg-white/5 text-neutral-400 hover:bg-white/10"
                }`}
              >
                脳内円グラフ
              </button>
              <button
                onClick={() => setVideoFormat("combo")}
                className={`flex-1 min-w-[120px] py-3 rounded-xl font-bold transition-all text-sm ${
                  videoFormat === "combo" 
                    ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]" 
                    : "bg-white/5 text-neutral-400 hover:bg-white/10"
                }`}
              >
                会話劇コンボ
              </button>
            </div>

            {videoFormat === "ranking" ? (
              <div>
                <label className="block text-sm font-bold text-cyan-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                  <Settings2 className="w-4 h-4" />
                  {lang === "en" ? "Select Theme" : "Select Theme / お題を選択"}
                </label>
              <select 
                value={selectedPresetId}
                onChange={(e) => setSelectedPresetId(e.target.value)}
                className="w-full bg-black/50 border border-neutral-700 rounded-xl p-4 text-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all text-white"
                disabled={isLoading}
              >
                {PRESETS.map(preset => (
                  <option key={preset.id} value={preset.id}>
                    {preset.title}
                  </option>
                ))}
              </select>
            </div>
            ) : videoFormat === "pov" ? (
              <div>
                <label className="block text-sm font-bold text-purple-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                  <Settings2 className="w-4 h-4" />
                  対象のMBTIタイプを選択
                </label>
                <select 
                  value={selectedPovType}
                  onChange={(e) => setSelectedPovType(e.target.value)}
                  className="w-full bg-black/50 border border-neutral-700 rounded-xl p-4 text-xl focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none transition-all text-white"
                  disabled={isLoading}
                >
                  {["INFP", "ENFP", "INFJ", "ISFJ", "ENTP", "ISTP", "INTJ", "ISFP", "INTP", "ENFJ"].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <p className="mt-3 text-xs text-neutral-400">※ 実写背景の適用は今後のアップデートで追加されます（現在は自動ダークグラデーション＋ノイズが適用されます）</p>
              </div>
            ) : videoFormat === "smartphone" ? (
              <div>
                <label className="block text-sm font-bold text-blue-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  お題を選択（スマホ画面）
                </label>
                <select 
                  value={selectedSmartphoneId}
                  onChange={(e) => setSelectedSmartphoneId(e.target.value)}
                  className="w-full bg-black/50 border border-neutral-700 rounded-xl p-4 text-xl focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all text-white"
                  disabled={isLoading}
                >
                  {smartphonePresets.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
            ) : videoFormat === "reaction" ? (
              <div>
                <label className="block text-sm font-bold text-rose-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  お題を選択（シチュエーション）
                </label>
                <select 
                  value={selectedReactionId}
                  onChange={(e) => setSelectedReactionId(e.target.value)}
                  className="w-full bg-black/50 border border-neutral-700 rounded-xl p-4 text-xl focus:border-rose-400 focus:ring-1 focus:ring-rose-400 outline-none transition-all text-white"
                  disabled={isLoading}
                >
                  {reactionPresets.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
            ) : videoFormat === "piechart" ? (
              <div>
                <label className="block text-sm font-bold text-fuchsia-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  お題を選択（脳内円グラフ）
                </label>
                <select 
                  value={selectedPiechartId}
                  onChange={(e) => setSelectedPiechartId(e.target.value)}
                  className="w-full bg-black/50 border border-neutral-700 rounded-xl p-4 text-xl focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400 outline-none transition-all text-white"
                  disabled={isLoading}
                >
                  {piechartPresets.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-bold text-red-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  お題を選択（会話劇コンボ）
                </label>
                <select 
                  value={selectedComboId}
                  onChange={(e) => setSelectedComboId(e.target.value)}
                  className="w-full bg-black/50 border border-neutral-700 rounded-xl p-4 text-xl focus:border-red-400 focus:ring-1 focus:ring-red-400 outline-none transition-all text-white"
                  disabled={isLoading}
                >
                  {comboPresets.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
            )}

            <button 
              onClick={handleGenerate}
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-black text-lg flex items-center justify-center gap-3 transition-all ${
                isLoading
                  ? "bg-neutral-800 text-neutral-500 cursor-not-allowed" 
                  : "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  {lang === "en" ? "Generating... Please wait" : "生成中...お待ちください"}
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  {lang === "en" ? "Generate Auto Video" : "動画を全自動生成する"}
                </>
              )}
            </button>

            {/* ステータスとプログレス */}
            {isLoading && (
              <div className="mt-8 space-y-3">
                <div className="flex justify-between text-sm font-bold text-neutral-300">
                  <span>{status}</span>
                  <span className="text-cyan-400">{progress}%</span>
                </div>
                <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden border border-white/10">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-500 ease-out" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* エラー表示 */}
            {errorMSG && (
              <div className="mt-6 p-4 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 flex items-center gap-3">
                <span className="font-bold">⚠️ {lang === "en" ? "Error" : "エラー"}:</span> {errorMSG}
              </div>
            )}

            {/* 完成した動画の表示 */}
            {videoUrl && !isLoading && (
              <div className="mt-10 pt-10 border-t border-white/10 animate-fade-in-up">
                <h2 className="text-2xl font-bold mb-6 text-center text-green-400 flex items-center justify-center gap-2">
                  <PlayCircle className="w-6 h-6" />
                  {lang === "en" ? "Video rendering successfully completed!" : "動画のレンダリングが完了しました！"}
                </h2>
                
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-center">
                  <div className="relative w-[300px] h-[533px] rounded-2xl overflow-hidden border-4 border-neutral-800 shadow-2xl shrink-0">
                    <video 
                      src={videoUrl} 
                      controls 
                      autoPlay 
                      loop
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 max-w-sm w-full space-y-4">
                    <a 
                      href={videoUrl}
                      download
                      className="w-full bg-purple-500 hover:bg-purple-400 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-lg"
                    >
                      <Download className="w-5 h-5" />
                      {lang === "en" ? "Download MP4" : "MP4をダウンロード"}
                    </a>
                    
                    <div className="bg-black/60 rounded-xl p-4 border border-cyan-500/30 text-sm">
                      <p className="font-bold text-cyan-400 mb-2 block flex items-center gap-2">
                        <Sparkles size={16} />
                        {lang === "en" ? "Post Caption + Hashtags (Ready to copy)" : "📋 投稿用キャプション＋ハッシュタグ"}
                      </p>
                      <textarea
                        readOnly
                        value={tiktokCaption || ""}
                        className="w-full bg-black/40 border border-neutral-700 rounded-lg p-3 text-white text-xs outline-none resize-none"
                        rows={6}
                        onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                      />
                      <button
                        onClick={() => {
                          if (tiktokCaption) {
                            navigator.clipboard.writeText(tiktokCaption);
                            setCaptionCopied(true);
                            setTimeout(() => setCaptionCopied(false), 2000);
                          }
                        }}
                        className={`w-full mt-2 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                          captionCopied 
                            ? "bg-green-500 text-white" 
                            : "bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500/30"
                        }`}
                      >
                        {captionCopied ? "✅ コピーしました！" : "📋 キャプションをコピー"}
                      </button>
                    </div>

                    <div className="bg-black/40 rounded-xl p-4 border border-white/5 text-sm max-h-[250px] overflow-y-auto">
                      <p className="font-bold text-neutral-400 mb-3 block">{lang === "en" ? "Generated Script Preview" : "生成された台本プレビュー"}</p>
                      <div className="space-y-2 text-xs">
                        {generatedEntries?.map((e, idx) => (
                          <div key={idx} className="flex gap-2">
                            <span className="font-bold w-10 shrink-0">{e.mbtiType}</span>
                            <span className="text-neutral-300">{e.comment}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}


          </div>
        </main>
      </div>
    </div>
  );
}
