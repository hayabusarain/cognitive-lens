import { AbsoluteFill, Audio, Img, spring, useCurrentFrame, useVideoConfig, Sequence, staticFile } from "remotion";
import React from "react";
import { Outro } from "./Outro";

export type RankingEntry = {
  mbtiType: string;
  imageUrl: string;
  rank: number;
  comment: string;
  ttsUrl?: string;
};

export type Top5RankingVideoProps = {
  title: string;
  entries: RankingEntry[];
  audioUrl?: string;
  popDuration: number; 
};

export const Top5RankingVideo: React.FC<Top5RankingVideoProps> = ({
  title,
  entries,
  audioUrl,
  popDuration,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // アウトロ用の尺
  const outroDuration = 150;
  const outroStart = durationInFrames - outroDuration;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap');
      `}</style>

      {/* 緊迫感のあるダークグリッド背景 */}
      <AbsoluteFill style={{ overflow: "hidden", opacity: 0.8 }}>
        <div style={{
          position: "absolute", width: "200%", height: "200%",
          background: `
            linear-gradient(rgba(255, 0, 50, 0.1) 2px, transparent 2px),
            linear-gradient(90deg, rgba(255, 0, 50, 0.1) 2px, transparent 2px)
          `,
          backgroundSize: "80px 80px",
          transform: `translateY(${(frame * 2) % 80}px)`,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(circle at center, transparent 30%, #000 100%)"
        }} />
      </AbsoluteFill>

      {/* ウォーターマーク */}
      <div style={{
        position: "absolute", top: "40px", left: "40px", zIndex: 100,
        display: "flex", alignItems: "center", gap: "15px",
        backgroundColor: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(10px)",
        padding: "15px 25px", borderRadius: "20px",
        border: "3px solid rgba(255, 0, 100, 0.4)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.8)"
      }}>
        <span style={{ fontSize: "40px" }}>🔎</span>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ color: "#fff", fontSize: "24px", fontWeight: "bold", fontFamily: "sans-serif" }}>
            ガチMBTI診断は
          </span>
          <span style={{ color: "#ff0066", fontSize: "30px", fontWeight: "900", fontFamily: "sans-serif", textShadow: "0 0 15px rgba(255,0,100,0.6)" }}>
            「対人課題解決プラットフォーム」で検索
          </span>
        </div>
      </div>

      {/* タイトル */}
      <div style={{
        width: "100%", padding: "40px", marginTop: "140px", textAlign: "center", zIndex: 10,
      }}>
        <h1 style={{
          fontFamily: "'M PLUS Rounded 1c', sans-serif", color: "#fff",
          fontSize: "55px", margin: 0, letterSpacing: "2px", fontWeight: "900",
          textShadow: "0px 10px 20px rgba(0,0,0,0.8)",
          WebkitTextStroke: "2px #ff0066"
        }}>
          {title}
        </h1>
      </div>

      {/* 各ランキングのシーケンス */}
      {entries.map((entry, index) => {
        const startFrame = index * popDuration;
        const isLast = index === entries.length - 1;

        return (
          <Sequence key={entry.rank} from={startFrame} durationInFrames={popDuration} name={`Rank-${entry.rank}`}>
            <RankingSlide entry={entry} isLast={isLast} fps={fps} />
          </Sequence>
        );
      })}

      {/* Audio Layer - BGM */}
      {audioUrl && <Audio src={audioUrl} />}

      {/* TTS Audio Layer */}
      {entries.map((entry, index) => {
        if (!entry.ttsUrl) return null;
        return (
          <Sequence key={`tts-${index}`} from={index * popDuration} durationInFrames={popDuration}>
            <Audio src={entry.ttsUrl.startsWith("http") ? entry.ttsUrl : staticFile(entry.ttsUrl)} />
          </Sequence>
        );
      })}
      
      {/* アウトロ宣伝レイヤー */}
      <Sequence from={outroStart} durationInFrames={outroDuration}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};

const RankingSlide: React.FC<{ entry: RankingEntry, isLast: boolean, fps: number }> = ({ entry, isLast, fps }) => {
  const frame = useCurrentFrame();
  
  const scale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 150 }
  });

  // 1位は焦らす演出
  const showCensored = isLast;

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      width: "100%", height: "100%", zIndex: 20, transform: `scale(${scale})`
    }}>
      <div style={{
        fontSize: "120px", fontWeight: "900", color: showCensored ? "#ff0000" : "#fff",
        fontFamily: "'Dela Gothic One', sans-serif",
        textShadow: `0 0 40px ${showCensored ? "#ff0000" : "#fff"}`,
        marginBottom: "20px"
      }}>
        第{entry.rank}位
      </div>

      <div style={{
        position: "relative", width: "400px", height: "400px",
        filter: showCensored ? "brightness(0) drop-shadow(0 0 20px red)" : "drop-shadow(0 10px 30px rgba(0,0,0,0.8))"
      }}>
        <Img src={entry.imageUrl.startsWith("http") ? entry.imageUrl : staticFile(entry.imageUrl)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        {showCensored && (
          <div style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            fontSize: "150px", fontWeight: "900", color: "red", textShadow: "0 0 30px red"
          }}>
            ?
          </div>
        )}
      </div>

      {!showCensored ? (
        <div style={{
          backgroundColor: "#111", color: "white", padding: "10px 30px",
          borderRadius: "20px", fontWeight: "900", border: "4px solid #fff",
          fontSize: "60px", marginTop: "30px", textShadow: "0px 5px 10px rgba(0,0,0,0.8)"
        }}>
          {entry.mbtiType}
        </div>
      ) : (
        <div style={{
          backgroundColor: "#ff0000", color: "white", padding: "10px 30px",
          borderRadius: "20px", fontWeight: "900", border: "4px solid #fff",
          fontSize: "50px", marginTop: "30px", textShadow: "0px 5px 10px rgba(0,0,0,0.8)",
          textAlign: "center"
        }}>
          圧倒的1位は<br/>プロフのリンクへ
        </div>
      )}

      <div style={{
        marginTop: "40px", backgroundColor: "rgba(0,0,0,0.8)", padding: "30px",
        borderRadius: "30px", border: showCensored ? "6px solid red" : "4px solid #fff",
        maxWidth: "80%", textAlign: "center",
        fontSize: "40px", fontWeight: "bold", color: "#fff", lineHeight: "1.5"
      }}>
        {entry.comment}
      </div>
    </div>
  );
};
