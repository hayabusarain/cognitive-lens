import { AbsoluteFill, Audio, Img, Video } from "remotion";
import { Subtitles, ScriptWord } from "./Subtitles";
import React from "react";

export type MyVideoProps = {
  script: ScriptWord[];
  audioUrl?: string; // BGMや音声トラック
  bgVideoUrl?: string;
  mbtiCharacterUrl?: string;
  mbtiType: string;
};

export const MyVideo: React.FC<MyVideoProps> = ({
  script,
  audioUrl,
  bgVideoUrl,
  mbtiCharacterUrl,
  mbtiType,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#111" }}>
      {/* 外部フォント（Dela Gothic One）の読み込み */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap');
      `}</style>

      {/* 下層：背景レイヤー */}
      {bgVideoUrl && (
        <Video
          src={bgVideoUrl}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          loop // 短尺動画向けにループ
          muted // 音声はaudioトラックで流す想定
        />
      )}

      {/* 中層：ハーフ透明のブラックオーバーレイ */}
      <AbsoluteFill style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }} />

      {/* キャラクタレイヤー：画面中央やや下に配置 */}
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: "350px" }}>
        {mbtiCharacterUrl && (
          <div className="relative flex flex-col items-center">
            {/* MBTI バッジ */}
            <div style={{
              backgroundColor: "rgba(0,0,0,0.8)",
              color: "#00ffff",
              padding: "10px 30px",
              borderRadius: "50px",
              border: "2px solid #00ffff",
              fontSize: "40px",
              fontWeight: "bold",
              fontFamily: "sans-serif",
              marginBottom: "30px",
              boxShadow: "0 0 20px rgba(0, 255, 255, 0.5)",
              textShadow: "0 0 10px #00ffff"
            }}>
              {mbtiType}
            </div>
            {/* キャラクター画像 */}
            <Img
              src={mbtiCharacterUrl}
              style={{
                width: "450px",
                height: "auto",
                // レトロ・サイバーパンクな雰囲気を強調するドロップシャドウ
                filter: "drop-shadow(0px 0px 40px rgba(0, 255, 255, 0.5))",
              }}
            />
          </div>
        )}
      </AbsoluteFill>

      {/* 字幕レイヤー（重要） */}
      <Subtitles script={script} />

      {/* 音声レイヤー */}
      {audioUrl && <Audio src={audioUrl} />}
      
    </AbsoluteFill>
  );
};
