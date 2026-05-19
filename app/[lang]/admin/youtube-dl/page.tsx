"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, Download, Video, Search } from "lucide-react";

export default function YoutubeDownloaderPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [downloadResult, setDownloadResult] = useState<{ url: string; filename: string } | null>(null);

  const handleDownload = async () => {
    if (!url) return;
    setIsLoading(true);
    setStatus("YouTubeから動画を取得して保存中... (動画の長さによって数分かかります)");
    setDownloadResult(null);

    try {
      const res = await fetch("/api/youtube-dl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || "ダウンロードに失敗しました");
      }

      const data = await res.json();
      setDownloadResult({ url: data.downloadUrl, filename: data.filename });
      setStatus("保存完了！");
    } catch (error: any) {
      console.error(error);
      setStatus(`エラー: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-10 text-white font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black mb-3 flex items-center justify-center gap-3">
            <Download className="w-10 h-10 text-cyan-500" />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              YouTube MP4 Saver
            </span>
          </h1>
          <p className="text-neutral-400">
            指定したYouTubeの動画を、PC内の「public/downloads」フォルダにMP4形式で保存します。
          </p>
        </header>

        <main className="space-y-8">
          <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
            <div className="mb-6">
              <label className="block text-sm font-bold text-cyan-400 mb-2 uppercase tracking-widest">
                YouTube 動画URL
              </label>
              <input 
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-black/50 border border-neutral-700 rounded-xl p-4 text-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all text-white"
                disabled={isLoading}
              />
            </div>

            <button 
              onClick={handleDownload}
              disabled={isLoading || !url}
              className={`w-full py-4 rounded-xl font-black text-lg flex items-center justify-center gap-3 transition-all ${
                isLoading || !url
                  ? "bg-neutral-800 text-neutral-500 cursor-not-allowed" 
                  : "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  保存処理中...
                </>
              ) : (
                <>
                  <Download className="w-6 h-6" />
                  動画を保存する
                </>
              )}
            </button>

            {status && (
              <div className="mt-6 text-center font-bold text-cyan-300">
                {status}
              </div>
            )}
          </section>

          {downloadResult && (
            <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl flex flex-col items-center animate-fade-in-up">
              <h2 className="text-2xl font-bold mb-6 text-green-400 flex items-center gap-2">
                <Video /> {downloadResult.filename}
              </h2>
              <div className="relative w-full max-w-lg aspect-video rounded-2xl overflow-hidden border-4 border-neutral-800 shadow-2xl mb-6">
                <video src={`${downloadResult.url}?t=${Date.now()}`} controls className="w-full h-full object-contain bg-black" />
              </div>
              <a 
                href={`${downloadResult.url}?t=${Date.now()}`}
                download
                className="bg-green-500 hover:bg-green-400 text-black font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-lg"
              >
                <Download className="w-5 h-5" />
                ブラウザ経由でダウンロード
              </a>
              <p className="mt-4 text-sm text-neutral-400">
                ※既にPCの「public/downloads」フォルダに保存されています。
              </p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
