"use client";

import React, { useState } from "react";
import { TierListEntry } from "../../remotion/TierListVideo";
import { PRESET_TIER_LISTS } from "../../lib/tier-list-data";
import { Loader2, Download, PlayCircle, Settings2, Sparkles, Video } from "lucide-react";

export default function VideoGeneratorPage() {
  const [selectedPresetId, setSelectedPresetId] = useState(PRESET_TIER_LISTS[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [generatedEntries, setGeneratedEntries] = useState<TierListEntry[] | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [errorMSG, setErrorMSG] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!selectedPresetId) return;
    setIsLoading(true);
    setVideoUrl(null);
    setErrorMSG(null);
    setGeneratedEntries(null);
    setProgress(10);

    try {
      const preset = PRESET_TIER_LISTS.find(p => p.id === selectedPresetId);
      if (!preset) throw new Error("お題が見つかりません");

      setStatus("内部データから台本と画像を組み立て中...");
      
      const mappedEntries = preset.entries.map(e => {
        return {
          ...e,
          imageUrl: `/characters/${e.mbtiType}.png`
        };
      });
      setProgress(40);
      
      // 音声処理スキップのためそのまま渡す
      const entriesWithAudio = mappedEntries as TierListEntry[];
      
      setGeneratedEntries(entriesWithAudio);
      setProgress(60);

      // 3. 動画のレンダリング
      setStatus("動画をバックグラウンドでMP4にレンダリング中... (約20秒かかります)");
      const durationInFrames = entriesWithAudio.length * 80 + 150; // 各80フレーム + アウトロ150
      
      const renderRes = await fetch("/api/render-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputProps: {
            title: preset.title,
            entries: entriesWithAudio,
            popDuration: 80,
            // audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" // BGMを無効化
          }
        })
      });

      if (!renderRes.ok) {
        const errJson = await renderRes.json();
        throw new Error(errJson.error || "動画のレンダリングに失敗しました");
      }
      
      const renderData = await renderRes.json();
      setVideoUrl(renderData.url);
      setProgress(100);
      setStatus("完成しました！");

    } catch (error: any) {
      console.error(error);
      setErrorMSG(error.message);
      setStatus("エラーが発生しました。");
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
              Auto TikTok Generator
            </span>
          </h1>
          <p className="text-neutral-400">お題を入力するだけで、AI台本 + 音声 + ティアリスト動画 を全自動生成</p>
        </header>

        <main className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-cyan-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                Select Theme / お題を選択
              </label>
              <select 
                value={selectedPresetId}
                onChange={(e) => setSelectedPresetId(e.target.value)}
                className="w-full bg-black/50 border border-neutral-700 rounded-xl p-4 text-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all text-white"
                disabled={isLoading}
              >
                {PRESET_TIER_LISTS.map(preset => (
                  <option key={preset.id} value={preset.id}>
                    {preset.title}
                  </option>
                ))}
              </select>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isLoading || !selectedPresetId}
              className={`w-full py-4 rounded-xl font-black text-lg flex items-center justify-center gap-3 transition-all ${
                isLoading || !selectedPresetId
                  ? "bg-neutral-800 text-neutral-500 cursor-not-allowed" 
                  : "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  生成中...お待ちください
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  動画を全自動生成する
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
                <span className="font-bold">⚠️ エラー:</span> {errorMSG}
              </div>
            )}

            {/* 完成した動画の表示 */}
            {videoUrl && !isLoading && (
              <div className="mt-10 pt-10 border-t border-white/10 animate-fade-in-up">
                <h2 className="text-2xl font-bold mb-6 text-center text-green-400 flex items-center justify-center gap-2">
                  <PlayCircle className="w-6 h-6" />
                  動画のレンダリングが完了しました！
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
                      MP4をダウンロード
                    </a>
                    
                    <div className="bg-black/60 rounded-xl p-4 border border-cyan-500/30 text-sm">
                      <p className="font-bold text-cyan-400 mb-2 block flex items-center gap-2">
                        <Sparkles size={16} />
                        TikTok投稿用テキスト（コピペ用）
                      </p>
                      <textarea
                        readOnly
                        value={PRESET_TIER_LISTS.find(p => p.id === selectedPresetId)?.tiktokCaption || ""}
                        className="w-full bg-black/40 border border-neutral-700 rounded-lg p-3 text-white text-xs outline-none resize-none"
                        rows={4}
                        onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                      />
                    </div>

                    <div className="bg-black/40 rounded-xl p-4 border border-white/5 text-sm max-h-[250px] overflow-y-auto">
                      <p className="font-bold text-neutral-400 mb-3 block">生成された台本プレビュー</p>
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
