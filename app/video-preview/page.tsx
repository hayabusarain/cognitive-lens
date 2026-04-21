"use client";

import { Player } from "@remotion/player";
import { MyVideo } from "../../remotion/MyVideo";
import { ScriptWord } from "../../remotion/Subtitles";
import { ConversationVideo } from "../../remotion/ConversationVideo";
import { ConversationScriptWord } from "../../remotion/ConversationSubtitles";
import { TierListVideo, TierListEntry } from "../../remotion/TierListVideo";
import React, { useState } from "react";

// --- 1人用サンプルデータ ---
const DUMMY_SCRIPT_SINGLE: ScriptWord[] = [
  { text: "論破", startFrame: 0, endFrame: 15 },
  { text: "するの", startFrame: 15, endFrame: 30 },
  { text: "楽しす", startFrame: 30, endFrame: 45 },
  { text: "ぎるww", startFrame: 45, endFrame: 70 },
  { text: "でも", startFrame: 70, endFrame: 85 },
  { text: "実は", startFrame: 85, endFrame: 100 },
  { text: "嫌われ", startFrame: 100, endFrame: 115 },
  { text: "たく", startFrame: 115, endFrame: 130 },
  { text: "ない！", startFrame: 130, endFrame: 160 },
];

// --- 2人用サンプルデータ (ENTP vs INFP - ロングバージョン 約43秒) ---
const DUMMY_SCRIPT_CONVO: ConversationScriptWord[] = [
  // 最初の会話
  { text: "ねえ", startFrame: 0, endFrame: 15, speaker: "left" },
  { text: "INFP", startFrame: 15, endFrame: 30, speaker: "left" },
  { text: "ってさ", startFrame: 30, endFrame: 45, speaker: "left" },
  { text: "いつも", startFrame: 45, endFrame: 60, speaker: "left" },
  { text: "何", startFrame: 60, endFrame: 80, speaker: "left" },
  { text: "考えてるの？", startFrame: 80, endFrame: 110, speaker: "left" },
  
  { text: "えっと", startFrame: 120, endFrame: 135, speaker: "right" },
  { text: "宇宙の", startFrame: 135, endFrame: 150, speaker: "right" },
  { text: "果てとか...", startFrame: 150, endFrame: 180, speaker: "right" },
  
  { text: "スケール", startFrame: 190, endFrame: 205, speaker: "left" },
  { text: "バグって", startFrame: 205, endFrame: 220, speaker: "left" },
  { text: "んなww", startFrame: 220, endFrame: 250, speaker: "left" },
  
  // 続きの会話
  { text: "でもさ、", startFrame: 260, endFrame: 280, speaker: "right" },
  { text: "もし", startFrame: 280, endFrame: 295, speaker: "right" },
  { text: "明日", startFrame: 295, endFrame: 310, speaker: "right" },
  { text: "地球が", startFrame: 310, endFrame: 330, speaker: "right" },
  { text: "滅亡", startFrame: 330, endFrame: 350, speaker: "right" },
  { text: "するって", startFrame: 350, endFrame: 370, speaker: "right" },
  { text: "なったら", startFrame: 370, endFrame: 390, speaker: "right" },
  { text: "ENTPは", startFrame: 390, endFrame: 410, speaker: "right" },
  { text: "どうする？", startFrame: 410, endFrame: 440, speaker: "right" },

  { text: "俺？", startFrame: 450, endFrame: 470, speaker: "left" },
  { text: "多分", startFrame: 470, endFrame: 485, speaker: "left" },
  { text: "ギリギリ", startFrame: 485, endFrame: 505, speaker: "left" },
  { text: "まで", startFrame: 505, endFrame: 520, speaker: "left" },
  { text: "シェルター", startFrame: 520, endFrame: 540, speaker: "left" },
  { text: "作って、", startFrame: 540, endFrame: 560, speaker: "left" },
  { text: "最終的に", startFrame: 560, endFrame: 580, speaker: "left" },
  { text: "「やっぱ", startFrame: 580, endFrame: 600, speaker: "left" },
  { text: "無理w」", startFrame: 600, endFrame: 620, speaker: "left" },
  { text: "って", startFrame: 620, endFrame: 635, speaker: "left" },
  { text: "配信", startFrame: 635, endFrame: 655, speaker: "left" },
  { text: "しながら", startFrame: 655, endFrame: 675, speaker: "left" },
  { text: "寝る！！", startFrame: 675, endFrame: 710, speaker: "left" },

  { text: "配信", startFrame: 720, endFrame: 740, speaker: "right" },
  { text: "するんだ...", startFrame: 740, endFrame: 770, speaker: "right" },
  { text: "メンタル", startFrame: 770, endFrame: 790, speaker: "right" },
  { text: "鋼すぎる", startFrame: 790, endFrame: 820, speaker: "right" },

  { text: "インキャな", startFrame: 830, endFrame: 850, speaker: "left" },
  { text: "INFPは", startFrame: 850, endFrame: 870, speaker: "left" },
  { text: "普通に", startFrame: 870, endFrame: 890, speaker: "left" },
  { text: "震えてる", startFrame: 890, endFrame: 910, speaker: "left" },
  { text: "タイプ", startFrame: 910, endFrame: 930, speaker: "left" },
  { text: "でしょ？", startFrame: 930, endFrame: 960, speaker: "left" },

  { text: "ううん、", startFrame: 970, endFrame: 990, speaker: "right" },
  { text: "意外と", startFrame: 990, endFrame: 1010, speaker: "right" },
  { text: "受け入れて、", startFrame: 1010, endFrame: 1040, speaker: "right" },
  { text: "最後に", startFrame: 1040, endFrame: 1060, speaker: "right" },
  { text: "好きな", startFrame: 1060, endFrame: 1080, speaker: "right" },
  { text: "アニメ", startFrame: 1080, endFrame: 1100, speaker: "right" },
  { text: "見返す", startFrame: 1100, endFrame: 1130, speaker: "right" },
  { text: "かな。", startFrame: 1130, endFrame: 1160, speaker: "right" },

  { text: "ブレない", startFrame: 1170, endFrame: 1190, speaker: "left" },
  { text: "な〜", startFrame: 1190, endFrame: 1210, speaker: "left" },
  { text: "そういう", startFrame: 1210, endFrame: 1230, speaker: "left" },
  { text: "とこ", startFrame: 1230, endFrame: 1250, speaker: "left" },
  { text: "好きだわw", startFrame: 1250, endFrame: 1290, speaker: "left" },
];

// --- ティアリスト用サンプルデータ (実はサイコパスなランキング) ---
const DUMMY_TIER_LIST: TierListEntry[] = [
  // D tier (一番まとも)
  { mbtiType: "ISFJ", imageUrl: "/characters/ISFJ.png", tier: "D", comment: "優しすぎて人を傷つけるなんて絶対に無理" },
  { mbtiType: "ESFJ", imageUrl: "/characters/ESFJ.png", tier: "D", comment: "共感力が高すぎてサイコに全くなりきれない天使" },
  { mbtiType: "INFP", imageUrl: "/characters/INFP.png", tier: "D", comment: "虫を殺すだけでも泣いちゃう平和主義者" },
  // C tier
  { mbtiType: "ISFP", imageUrl: "/characters/ISFP.png", tier: "C", comment: "ただのマイペース。誰かに害を与える気はない" },
  { mbtiType: "ENFP", imageUrl: "/characters/ENFP.png", tier: "C", comment: "明るい狂気はあるが、悪意は1ミリもない" },
  { mbtiType: "ISTJ", imageUrl: "/characters/ISTJ.png", tier: "C", comment: "ルールに厳しすぎるだけで本質はただの常識人" },
  // B tier
  { mbtiType: "INTP", imageUrl: "/characters/INTP.png", tier: "B", comment: "サイコパスというかただの社会不適合な変人" },
  { mbtiType: "ESFP", imageUrl: "/characters/ESFP.png", tier: "B", comment: "空気が読めなくて迷惑かけるだけでサイコではない" },
  { mbtiType: "ESTJ", imageUrl: "/characters/ESTJ.png", tier: "B", comment: "目的達成のためにたまに他人の感情を完全無視する" },
  // A tier
  { mbtiType: "ISTP", imageUrl: "/characters/ISTP.png", tier: "A", comment: "ヤバい状況になるほど無表情で冷静になる一匹狼" },
  { mbtiType: "ENFJ", imageUrl: "/characters/ENFJ.png", tier: "A", comment: "笑顔で裏工作する教祖系サイコパスの素質あり" },
  { mbtiType: "ESTP", imageUrl: "/characters/ESTP.png", tier: "A", comment: "スリルを求めて周りを平気でトラブルに巻き込む" },
  { mbtiType: "ENTJ", imageUrl: "/characters/ENTJ.png", tier: "A", comment: "無能を容赦なく切り捨てる冷徹な独裁者" },
  // S tier (真のサイコパス)
  { mbtiType: "INFJ", imageUrl: "/characters/INFJ.png", tier: "S", comment: "相手の一番痛いところを笑顔でえぐる隠れサイコ" },
  { mbtiType: "INTJ", imageUrl: "/characters/INTJ.png", tier: "S", comment: "効率のためなら他人の感情を一切考慮しない氷の心" },
  { mbtiType: "ENTP", imageUrl: "/characters/ENTP.png", tier: "S", comment: "息をするように嘘をついて論破してくる真性の狂人" },
];

export default function VideoPreviewPage() {
  const [tab, setTab] = useState<"single" | "convo" | "tier">("tier");

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center py-10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-neutral-950 to-neutral-950 pointer-events-none" />

      <h1 className="text-3xl font-bold text-white mb-6 border-b-4 border-cyan-400 pb-2 relative z-10 text-shadow-glow">
        TikTok / Shorts 動画生成プレビュー
      </h1>
      
      {/* タブ切り替え */}
      <div className="flex gap-4 mb-8 relative z-10">
        <button
          onClick={() => setTab("single")}
          className={`px-6 py-2 rounded-full font-bold transition-all ${
            tab === "single"
              ? "bg-cyan-500 text-white shadow-[0_0_15px_rgba(0,255,255,0.5)]"
              : "bg-white/10 text-neutral-400 hover:bg-white/20"
          }`}
        >
          1人モード
        </button>
        <button
          onClick={() => setTab("convo")}
          className={`px-6 py-2 rounded-full font-bold transition-all ${
            tab === "convo"
              ? "bg-pink-500 text-white shadow-[0_0_15px_rgba(255,102,204,0.5)]"
              : "bg-white/10 text-neutral-400 hover:bg-white/20"
          }`}
        >
          2人雑談モード (BGM＆長尺)
        </button>
        <button
          onClick={() => setTab("tier")}
          className={`px-6 py-2 rounded-full font-bold transition-all ${
            tab === "tier"
              ? "bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]"
              : "bg-white/10 text-neutral-400 hover:bg-white/20"
          }`}
        >
          ティアリストモード
        </button>
      </div>

      <div className="relative z-10 w-[300px] md:w-[400px] h-[533px] md:h-[711px] shadow-[0_0_50px_rgba(0,255,255,0.15)] rounded-2xl overflow-hidden border border-white/10 bg-black">
        {tab === "single" ? (
          <Player
            component={MyVideo}
            durationInFrames={180}
            compositionWidth={1080}
            compositionHeight={1920}
            fps={30}
            controls
            style={{ width: "100%", height: "100%" }}
            inputProps={{
              script: DUMMY_SCRIPT_SINGLE,
              bgVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
              mbtiCharacterUrl: "/characters/ENTP.png",
              mbtiType: "ENTP",
            }}
          />
        ) : tab === "convo" ? (
          <Player
            component={ConversationVideo}
            durationInFrames={1390} // 1290（台本） + 100（アウトロ）
            compositionWidth={1080}
            compositionHeight={1920}
            fps={30}
            controls
            style={{ width: "100%", height: "100%" }}
            inputProps={{
              script: DUMMY_SCRIPT_CONVO,
              bgVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
              // BGM音声トラックの追加（ダミーのオープン楽曲MP3 - よりアップテンポなポップ曲）
              audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
              // Left: ENTP (Cyan)
              mbtiLeftUrl: "/characters/ENTP.png",
              mbtiLeftType: "ENTP",
              // Right: INFP (Pink)
              mbtiRightUrl: "/characters/INFP.png",
              mbtiRightType: "INFP",
            }}
          />
        ) : (
          <Player
            component={TierListVideo}
            durationInFrames={DUMMY_TIER_LIST.length * 80 + 150} // 各キャラの秒数 + アウトロ宣伝150フレーム(5秒)
            compositionWidth={1080}
            compositionHeight={1920}
            fps={30}
            controls
            style={{ width: "100%", height: "100%" }}
            inputProps={{
              title: "実はサイコパス Ranking",
              entries: DUMMY_TIER_LIST,
              popDuration: 80, // 約2.6秒ごとに次のキャラが落ちてくる
              audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
            }}
          />
        )}
      </div>
      
      <div className="mt-8 text-neutral-400 text-sm max-w-lg text-center relative z-10 p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
        <p className="font-semibold text-cyan-400 mb-2">💡 プレビュー情報</p>
        <p>
          {tab === "single" && "1人のキャラクターがメインで話すスタイルです。"}
          {tab === "convo" && "動画の長さを約43秒に拡張し、BGM音声トラック（サンプルMp3音源）を追加しています。対話のテンポに合わせて延々と会話が展開されます。"}
          {tab === "tier" && "SランクからDランクまでの階級表（Tier List）に、キャラクターが順次落下してくるTikTokで大人気のランキング形式です。"}
        </p>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .text-shadow-glow {
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.3);
          }
        `
      }} />
    </div>
  );
}
