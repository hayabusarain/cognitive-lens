import { AbsoluteFill, Audio, Img, spring, useCurrentFrame, useVideoConfig, Sequence, staticFile } from "remotion";
import { Outro } from "./Outro";
import React from "react";

export type Tier = "S" | "A" | "B" | "C" | "D";

export type TierListEntry = {
  mbtiType: string;
  imageUrl: string;
  tier: Tier | string;
  comment: string;
  ttsUrl?: string; // AIによる音声読み上げURL
  webAnswer?: string; // ウェブサイト上で表示する回答の理由
};

export type TierListVideoProps = {
  title: string;
  entries: TierListEntry[];
  audioUrl?: string;
  popDuration: number; // 1キャラあたりの表示時間（フレーム）
  lang?: string;
};

const TIER_COLORS: Record<string, string> = {
  S: "#ff4757", // Red
  A: "#ff7f50", // Coral/Orange
  B: "#eccc68", // Yellow
  C: "#2ed573", // Green
  D: "#1e90ff", // Blue
};

const TIERS: Tier[] = ["S", "A", "B", "C", "D"];

export const TierListVideo: React.FC<TierListVideoProps> = ({
  title,
  entries,
  audioUrl,
  popDuration,
  lang = "ja",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // フック用の尺
  const introDuration = 60;
  // アウトロ（宣伝）用の尺設定
  const outroDuration = 150;
  const outroStart = durationInFrames - outroDuration;

  // 現在フォーカスされているエントリを取得 (フックの60フレーム分を考慮)
  const mainFrame = Math.max(0, frame - introDuration);
  const currentEntryIndex = Math.min(
    Math.floor(mainFrame / popDuration),
    entries.length - 1
  );
  const currentEntry = entries[currentEntryIndex];

  return (
    <AbsoluteFill style={{ backgroundColor: "#111" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap');
      `}</style>

      {/* Background Layer: 緊迫感のあるサイバーなダークグリッド */}
      <AbsoluteFill style={{ overflow: "hidden", opacity: 0.8 }}>
        <div style={{
          position: "absolute", width: "200%", height: "200%",
          background: `
            linear-gradient(rgba(0, 255, 255, 0.1) 2px, transparent 2px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 2px, transparent 2px)
          `,
          backgroundSize: "100px 100px",
          transform: `translateY(${(frame * 2) % 100}px)`,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(circle at center, transparent 30%, #000 100%)"
        }} />
      </AbsoluteFill>

      {/* 最初の2秒間のフック演出 */}
      <Sequence from={0} durationInFrames={introDuration} name="IntroHook">
        <IntroHook title={title} fps={fps} />
      </Sequence>

      {/* メインコンテンツ（フック後に開始） */}
      <Sequence from={introDuration} name="MainContent">
        {/* セーフエリア（TikTok/ShortsのUI被り防止） */}
        <div style={{
          position: "absolute",
          top: "150px",     // 上部のタブ類を避ける
          bottom: "350px",  // 下部のキャプション類を避ける
          left: "20px",
          right: "120px",   // 右側のいいねボタン等を避ける
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 10,
          transform: "scale(0.85)", // 全体がはみ出さないように少し縮小
          transformOrigin: "top center"
        }}>
          {/* Title */}
          <div style={{
            width: "100%", padding: "20px", textAlign: "center", zIndex: 10,
            textShadow: "0 0 20px cyan", borderBottom: "4px solid cyan",
            backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)",
            borderRadius: "20px"
          }}>
            <h1 style={{
              fontFamily: "'M PLUS Rounded 1c', sans-serif", color: "#fff",
              fontSize: "60px", margin: 0, letterSpacing: "2px",
              fontWeight: "bold",
              WebkitTextStroke: "1px #00ffff"
            }}>
              {title}
            </h1>
          </div>

          {/* Tier Board */}
          <div style={{
            display: "flex", flexDirection: "column", gap: "10px",
            padding: "20px", marginTop: "10px", flex: "none", zIndex: 5,
            width: "100%"
          }}>
            {TIERS.map((tier) => (
              <TierRow
                key={tier}
                tier={tier}
                entries={entries.filter((e) => e.tier === tier)}
                frame={mainFrame}
                fps={fps}
                popDuration={popDuration}
                entriesList={entries}
              />
            ))}
          </div>

          {/* サイト宣伝用ウォーターマーク */}
          <div style={{
            display: "flex", justifyContent: "center", width: "100%", zIndex: 10, marginTop: "10px"
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "15px",
              backgroundColor: "rgba(0, 0, 0, 0.65)", backdropFilter: "blur(10px)",
              padding: "20px 40px", borderRadius: "100px",
              border: "3px solid rgba(0, 255, 255, 0.4)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.8)"
            }}>
              <span style={{ fontSize: "50px" }}>🔎</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <span style={{ color: "#fff", fontSize: "28px", fontWeight: "bold", fontFamily: "sans-serif" }}>
                  {lang === "en" ? "For the real 16 Type test," : "無料のガチ16タイプ診断は"}
                </span>
                <span style={{ color: "#00ffff", fontSize: "36px", fontWeight: "900", fontFamily: "sans-serif", textShadow: "0 0 15px rgba(0,255,255,0.6)" }}>
                  {lang === "en" ? "Search 'CognitiveLens'" : "「対人課題解決プラットフォーム」で検索"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Popup Comment */}
        {mainFrame >= 0 && currentEntry && mainFrame < outroStart - introDuration && (
          <CommentPopup entry={currentEntry} frame={mainFrame} popDuration={popDuration} fps={fps} entriesList={entries} lang={lang} />
        )}
      </Sequence>

      {/* Audio Layer - BGM */}
      {audioUrl && <Audio src={audioUrl} />}

      {/* TTS Audio Layer */}
      {entries.map((entry, index) => {
        if (!entry.ttsUrl) return null;
        return (
          <Sequence key={`tts-${index}`} from={introDuration + (index * popDuration)} durationInFrames={popDuration}>
            <Audio src={entry.ttsUrl.startsWith("http") ? entry.ttsUrl : staticFile(entry.ttsUrl)} />
          </Sequence>
        );
      })}
      
      {/* アウトロ宣伝レイヤー */}
      <Sequence from={outroStart} durationInFrames={outroDuration}>
        <Outro lang={lang} />
      </Sequence>
    </AbsoluteFill>
  );
};

// --- Subcomponents ---

// 各ティアの行
const TierRow: React.FC<{
  tier: Tier;
  entries: TierListEntry[];
  frame: number;
  fps: number;
  popDuration: number;
  entriesList: TierListEntry[];
}> = ({ tier, entries, frame, fps, popDuration, entriesList }) => {
  return (
    <div style={{
      display: "flex", width: "100%", minHeight: "180px",
      backgroundColor: "rgba(20,20,20,0.9)", border: "2px solid #333",
      boxShadow: "0 10px 20px rgba(0,0,0,0.5)"
    }}>
      {/* ティアのラベル（S, A, B等） */}
      <div style={{
        width: "140px", flexShrink: 0, backgroundColor: TIER_COLORS[tier],
        display: "flex", justifyContent: "center", alignItems: "center",
        fontSize: "80px", fontWeight: "900", fontFamily: "sans-serif",
        color: "#fff", textShadow: "0px 5px 10px rgba(0,0,0,0.5)",
        borderRight: "4px solid #000"
      }}>
        {tier}
      </div>

      {/* ドロップされたキャラクターのコンテナ */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", flexWrap: "wrap",
        padding: "10px", gap: "15px", overflow: "hidden"
      }}>
        {entries.map((entry) => {
          // グローバルなインデックスを探す
          const globalIdx = entriesList.findIndex(e => e.mbtiType === entry.mbtiType);
          const startFrame = globalIdx * popDuration;
          
          if (frame < startFrame) return null; // まだ出番が来ていない

          // 落下するアニメーション
          const dropSpring = spring({
            frame: frame - startFrame,
            fps,
            config: { damping: 10, mass: 0.8, stiffness: 150 },
          });

          return (
            <div key={entry.mbtiType} style={{
              transform: `scale(${dropSpring})`,
              display: "flex", flexDirection: "column", alignItems: "center",
              width: "140px"
            }}>
              <Img src={entry.imageUrl.startsWith("http") ? entry.imageUrl : staticFile(entry.imageUrl)} style={{ width: "140px", height: "auto", filter: "drop-shadow(0 5px 10px rgba(0,0,0,0.8))" }} />
              <span style={{
                backgroundColor: "black", color: "white", padding: "4px 10px",
                borderRadius: "10px", fontWeight: "bold", border: `2px solid ${TIER_COLORS[tier]}`,
                fontSize: "24px", marginTop: "5px"
              }}>
                {entry.mbtiType}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 下部に表示されるコメントポップアップ
const CommentPopup: React.FC<{
  entry: TierListEntry;
  frame: number;
  popDuration: number;
  fps: number;
  entriesList: TierListEntry[];
  lang?: string;
}> = ({ entry, frame, popDuration, fps, entriesList, lang = "ja" }) => {
  const globalIdx = entriesList.findIndex(e => e.mbtiType === entry.mbtiType);
  const startFrame = globalIdx * popDuration;
  
  const bounce = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 12, stiffness: 200 }
  });

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: "350px", zIndex: 20 }}>
      {/* SE効果のように一瞬輝かせる */}
      <div style={{
        transform: `scale(${bounce})`,
        backgroundColor: "#fff",
        padding: "20px 40px",
        borderRadius: "20px",
        border: `8px solid ${TIER_COLORS[entry.tier]}`,
        boxShadow: `0px 20px 40px rgba(0,0,0,0.8), 0 0 30px ${TIER_COLORS[entry.tier]}`,
        maxWidth: "90%",
        textAlign: "center"
      }}>
        <div style={{ fontSize: "35px", fontWeight: "bold", color: "#666", marginBottom: "15px" }}>
          {entry.mbtiType} {lang === "en" ? `[Tier ${entry.tier}]` : `[${entry.tier}ランク]`}
        </div>
        <div style={{
          fontSize: "45px", 
          fontWeight: 800, // 900から少し見やすく調整
          fontFamily: "'M PLUS Rounded 1c', 'Noto Sans JP', sans-serif", // 可読性の高い角丸ゴシック/標準ゴシックへ変更
          color: "#111", 
          lineHeight: "1.4" // つぶれないように行間を少し空ける
        }}>
          {entry.comment}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 最初の2秒（フック）演出コンポーネント
const IntroHook: React.FC<{ title: string, fps: number }> = ({ title, fps }) => {
  const frame = useCurrentFrame();
  
  // スケールとバウンド
  const scale = spring({ frame, fps, config: { damping: 10, stiffness: 150 } });
  
  // チカチカさせる演出 (5フレームごとに色反転)
  const isFlash = Math.floor(frame / 5) % 2 === 0;

  return (
    <AbsoluteFill style={{
      backgroundColor: isFlash ? "#00ffff" : "#000",
      justifyContent: "center", alignItems: "center"
    }}>
      <h1 style={{
        fontFamily: "'Dela Gothic One', sans-serif",
        color: isFlash ? "#000" : "#fff",
        fontSize: "100px",
        fontWeight: "900",
        textAlign: "center",
        lineHeight: "1.3",
        transform: `scale(${scale})`,
        textShadow: isFlash ? "none" : "0 0 50px #00ffff",
        padding: "50px",
        WebkitTextStroke: isFlash ? "none" : "3px #00ffff"
      }}>
        {title.split(" ").map((word, i) => (
          <React.Fragment key={i}>
            {word}<br/>
          </React.Fragment>
        ))}
      </h1>
    </AbsoluteFill>
  );
};
