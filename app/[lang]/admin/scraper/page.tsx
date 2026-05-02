"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, Download, Search, Sparkles, Video, FileText, LayoutList } from "lucide-react";

export default function AdminScraperPage() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang || "ja";

  const [keyword, setKeyword] = useState("MBTI");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<any>(null);
  
  const [isRendering, setIsRendering] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleScrape = async () => {
    if (!keyword && !url) return;
    setIsLoading(true);
    setResult(null);
    setVideoUrl(null);
    setStatus("バックグラウンドで動画を取得・解析中... (1〜2分かかります)");

    try {
      const res = await fetch("/api/batch-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, url }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || "スクレイピングに失敗しました");
      }

      const data = await res.json();
      setResult(data);
      setStatus("解析完了！");
    } catch (error: any) {
      console.error(error);
      setStatus(`エラー: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRenderVideo = async () => {
    if (!result?.script) return;
    setIsRendering(true);
    setStatus("動画をレンダリング中... (数分かかります)");

    try {
      const { script } = result;
      // Script has format, mbtiType, title, texts
      
      const renderRes = await fetch("/api/render-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          compositionId: "LocalizedDubVideo",
          presetId: `dub_${result.videoId}`,
          inputProps: {
            videoId: result.videoId,
            title: script.title,
            texts: script.texts,
          }
        })
      });

      if (!renderRes.ok) {
        const errJson = await renderRes.json();
        throw new Error(errJson.error || "動画のレンダリングに失敗しました");
      }
      
      const renderData = await renderRes.json();
      setVideoUrl(renderData.url);
      setStatus("動画の生成が完了しました！");
    } catch (error: any) {
      console.error(error);
      setStatus(`エラー: ${error.message}`);
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-10 text-white font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black mb-3 flex items-center justify-center gap-3">
            <Search className="w-10 h-10 text-rose-500" />
            <span className="bg-gradient-to-r from-rose-400 to-orange-500 bg-clip-text text-transparent">
              Auto Viral Scraper & Localizer
            </span>
          </h1>
          <p className="text-neutral-400">
            海外のバズ動画を自動取得し、音声とテキストを解析してZ世代向けの台本に変換します。
          </p>
        </header>

        <main className="space-y-8">
          {/* 入力セクション */}
          <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-rose-400 mb-2 uppercase tracking-widest">
                  検索キーワード
                </label>
                <input 
                  type="text"
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  placeholder="MBTI"
                  className="w-full bg-black/50 border border-neutral-700 rounded-xl p-4 text-xl focus:border-rose-400 focus:ring-1 focus:ring-rose-400 outline-none transition-all text-white"
                  disabled={isLoading || isRendering}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-rose-400 mb-2 uppercase tracking-widest">
                  または 直接URL指定
                </label>
                <input 
                  type="text"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://youtube.com/shorts/..."
                  className="w-full bg-black/50 border border-neutral-700 rounded-xl p-4 text-xl focus:border-rose-400 focus:ring-1 focus:ring-rose-400 outline-none transition-all text-white"
                  disabled={isLoading || isRendering}
                />
              </div>
            </div>

            <button 
              onClick={handleScrape}
              disabled={isLoading || isRendering || (!keyword && !url)}
              className={`mt-8 w-full py-4 rounded-xl font-black text-lg flex items-center justify-center gap-3 transition-all ${
                isLoading || isRendering || (!keyword && !url)
                  ? "bg-neutral-800 text-neutral-500 cursor-not-allowed" 
                  : "bg-rose-500 hover:bg-rose-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  解析中... お待ちください
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  スクレイピング＆ローカライズ開始
                </>
              )}
            </button>

            {status && (
              <div className="mt-6 text-center font-bold text-rose-300">
                {status}
              </div>
            )}
          </section>

          {/* 結果表示セクション */}
          {result && (
            <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl animate-fade-in-up">
              <h2 className="text-2xl font-bold mb-6 text-rose-400 border-b border-white/10 pb-4">
                取得結果: {result.original_title}
              </h2>

              <div className="flex flex-col gap-8">
                {result.skipped ? (
                  <div className="bg-orange-500/10 border border-orange-500/50 rounded-xl p-6 text-center w-full max-w-2xl mx-auto">
                    <h3 className="font-bold text-orange-400 mb-2 text-xl flex justify-center items-center gap-2">
                      ⚠️ 自動スキップされました
                    </h3>
                    <p className="text-neutral-300">
                      この動画は「特定の人物（アイドルやインフルエンサー）のビジュアルやダンス」に依存しているため、
                      台本化に向かないとAIが判断しました。
                    </p>
                    <p className="text-orange-300 text-sm mt-2">理由: {result.reason}</p>
                  </div>
                ) : (
                  <div className="bg-black/40 rounded-xl p-6 border border-rose-500/30 w-full max-w-2xl mx-auto">
                    <h3 className="font-bold text-rose-400 mb-4 flex items-center gap-2">
                      <FileText size={20} />
                      直訳・吹き替えテキスト
                    </h3>
                  <div className="mb-4">
                    <label className="text-xs text-neutral-500 uppercase">MBTI Type</label>
                    <div className="font-bold text-xl text-yellow-300">{result.script.mbtiType}</div>
                  </div>
                  <div className="mb-4">
                    <label className="text-xs text-neutral-500 uppercase">Title</label>
                    <div className="font-bold text-white">{result.script.title}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-neutral-500 uppercase">Texts (1行ずつ表示)</label>
                    {result.script.texts?.map((t: string, i: number) => (
                      <input 
                        key={i}
                        type="text"
                        value={t}
                        onChange={(e) => {
                          const newTexts = [...result.script.texts];
                          newTexts[i] = e.target.value;
                          setResult({...result, script: {...result.script, texts: newTexts}});
                        }}
                        className="w-full bg-black/60 border border-neutral-700 rounded-lg p-3 text-white text-sm outline-none focus:border-rose-400 transition-colors"
                      />
                    ))}
                  </div>

                  <button 
                    onClick={handleRenderVideo}
                    disabled={isRendering}
                    className="mt-6 w-full py-4 rounded-xl font-black text-white bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 shadow-lg flex items-center justify-center gap-2 transition-all"
                  >
                    {isRendering ? <Loader2 className="animate-spin" /> : <Video />}
                    この台本で動画を生成する
                  </button>
                </div>
                )}
              </div>
            </section>
          )}

          {/* 動画表示セクション */}
          {videoUrl && (
            <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl animate-fade-in-up flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-6 text-green-400">動画が完成しました！</h2>
              <div className="relative w-[300px] h-[533px] rounded-2xl overflow-hidden border-4 border-neutral-800 shadow-2xl mb-6">
                <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
              </div>
              <a 
                href={videoUrl}
                download
                className="bg-green-500 hover:bg-green-400 text-black font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-lg"
              >
                <Download className="w-5 h-5" />
                動画をダウンロード (MP4)
              </a>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
