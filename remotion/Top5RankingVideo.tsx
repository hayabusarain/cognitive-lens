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
  lang?: string;
};

export const Top5RankingVideo: React.FC<Top5RankingVideoProps> = ({
  title,
  entries,
  audioUrl,
  popDuration,
  lang = "ja",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // フック（導入）用の尺
  const introDuration = 60;
  // アウトロ用の尺
  const outroDuration = 150;
  const outroStart = durationInFrames - outroDuration;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap');
      `}</style>

      {/* 最初の2秒間のフック演出 */}
      <Sequence from={0} durationInFrames={introDuration} name="IntroHook">
        <IntroHook title={title} fps={fps} />
      </Sequence>

      {/* メインコンテンツ（フック後に開始） */}
      <Sequence from={introDuration} name="MainContent">
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

        {/* ウォーターマーク（セーフエリア上部） */}
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
              {lang === "en" ? "For the real 16 Type test," : "ガチ16タイプ診断は"}
            </span>
            <span style={{ color: "#ff0066", fontSize: "30px", fontWeight: "900", fontFamily: "sans-serif", textShadow: "0 0 15px rgba(255,0,100,0.6)" }}>
              {lang === "en" ? "Search 'CognitiveLens'" : "「対人課題解決プラットフォーム」で検索"}
            </span>
          </div>
        </div>

        {/* セーフエリア（TikTok/ShortsのUI被り防止） */}
        <div style={{
          position: "absolute",
          top: "150px",     // 上部のタブ類を避ける
          bottom: "350px",  // 下部のキャプション類を避ける
          left: "40px",
          right: "120px",   // 右側のいいねボタン等を避ける
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 10,
        }}>
          {/* タイトル */}
          <div style={{ width: "100%", padding: "20px", textAlign: "center", marginBottom: "20px" }}>
            <h1 style={{
              fontFamily: "'M PLUS Rounded 1c', sans-serif", color: "#fff",
              fontSize: "45px", margin: 0, letterSpacing: "2px", fontWeight: "900",
              textShadow: "0px 10px 20px rgba(0,0,0,0.8)",
              WebkitTextStroke: "2px #ff0066",
              lineHeight: "1.3"
            }}>
              {title}
            </h1>
          </div>

          {/* 各ランキングのシーケンス */}
          <div style={{ flex: 1, width: "100%", position: "relative" }}>
            {entries.map((entry, index) => {
              const startFrame = index * popDuration;
              const isLast = index === entries.length - 1;

              return (
                <Sequence key={entry.rank} from={startFrame} durationInFrames={popDuration} name={`Rank-${entry.rank}`}>
                  <RankingSlide entry={entry} isLast={isLast} fps={fps} lang={lang} />
                </Sequence>
              );
            })}
          </div>
        </div>
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

const RankingSlide: React.FC<{ entry: RankingEntry, isLast: boolean, fps: number, lang?: string }> = ({ entry, isLast, fps, lang = "ja" }) => {
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
        fontSize: "100px", fontWeight: "900", color: showCensored ? "#ff0000" : "#fff",
        fontFamily: "'Dela Gothic One', sans-serif",
        textShadow: `0 0 40px ${showCensored ? "#ff0000" : "#fff"}`,
        marginBottom: "10px"
      }}>
        {lang === "en" ? `No.${entry.rank}` : `第${entry.rank}位`}
      </div>

      <div style={{
        position: "relative", width: "350px", height: "350px",
        filter: showCensored ? "brightness(0) drop-shadow(0 0 20px red)" : "drop-shadow(0 10px 30px rgba(0,0,0,0.8))"
      }}>
        <Img src={entry.imageUrl.startsWith("http") ? entry.imageUrl : staticFile(entry.imageUrl)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        {showCensored && (
          <div style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            fontSize: "120px", fontWeight: "900", color: "red", textShadow: "0 0 30px red"
          }}>
            ?
          </div>
        )}
      </div>

      {!showCensored ? (
        <div style={{
          backgroundColor: "#111", color: "white", padding: "10px 20px",
          borderRadius: "20px", fontWeight: "900", border: "4px solid #fff",
          fontSize: "50px", marginTop: "20px", textShadow: "0px 5px 10px rgba(0,0,0,0.8)"
        }}>
          {entry.mbtiType}
        </div>
      ) : (
        <div style={{
          backgroundColor: "#ff0000", color: "white", padding: "10px 20px",
          borderRadius: "20px", fontWeight: "900", border: "4px solid #fff",
          fontSize: "35px", marginTop: "20px", textShadow: "0px 5px 10px rgba(0,0,0,0.8)",
          textAlign: "center"
        }}>
          {lang === "en" ? (
            <>To prevent deletion, full analysis on my site.<br/>Search 'CognitiveLens'</>
          ) : (
            <>削除対策のため自作サイトで公開中<br/>「対人課題解決プラットフォーム」で検索</>
          )}
        </div>
      )}

      <div style={{
        marginTop: "20px", backgroundColor: "rgba(0,0,0,0.8)", padding: "20px",
        borderRadius: "20px", border: showCensored ? "6px solid red" : "4px solid #fff",
        width: "100%", textAlign: "center",
        fontSize: "32px", fontWeight: "bold", color: "#fff", lineHeight: "1.5"
      }}>
        {entry.comment}
      </div>
    </div>
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
      backgroundColor: isFlash ? "#ff0066" : "#000",
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
        textShadow: isFlash ? "none" : "0 0 50px #ff0066",
        padding: "50px",
        WebkitTextStroke: isFlash ? "none" : "3px #ff0066"
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
