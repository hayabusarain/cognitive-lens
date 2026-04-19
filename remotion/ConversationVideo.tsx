import { AbsoluteFill, Audio, Img, Video, useCurrentFrame, useVideoConfig, spring, Sequence } from "remotion";
import { ConversationSubtitles, ConversationScriptWord } from "./ConversationSubtitles";
import { Outro } from "./Outro";
import React from "react";

export type ConversationVideoProps = {
  script: ConversationScriptWord[];
  audioUrl?: string;
  bgVideoUrl?: string;
  
  // Left Character
  mbtiLeftUrl: string;
  mbtiLeftType: string;
  
  // Right Character
  mbtiRightUrl: string;
  mbtiRightType: string;
};

export const ConversationVideo: React.FC<ConversationVideoProps> = ({
  script,
  audioUrl,
  bgVideoUrl,
  mbtiLeftUrl,
  mbtiLeftType,
  mbtiRightUrl,
  mbtiRightType,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Find currently active word
  const activeWord = script.find(w => frame >= w.startFrame && frame < w.endFrame);
  const activeSpeaker = activeWord ? activeWord.speaker : null;

  // 最後の100フレーム（約3.3秒）をアウトロ宣伝尺とする
  const outroDuration = 100;
  const mainDuration = fps * 43; // 43秒（台本分の長さ）をベースにする（または props 等から受ける）
  // 実際には useVideoConfig() の durationInFrames から逆算するアプローチも可能ですが、
  // 今回は player の設定に合わせて固定秒数で発火させます。
  const outroStart = durationInFrames - outroDuration;

  // Calculate bounce animation that retriggers on every new word
  const wordTime = activeWord ? frame - activeWord.startFrame : 0;
  const bounce = spring({
    frame: wordTime,
    fps,
    config: { damping: 10, stiffness: 200 },
  }); // Goes from 0 to 1 with an overshoot

  return (
    <AbsoluteFill style={{ backgroundColor: "#111" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap');
      `}</style>

      {/* Background Layer */}
      {bgVideoUrl && (
        <Video
          src={bgVideoUrl}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          loop
          muted
        />
      )}

      {/* Middle Layer */}
      <AbsoluteFill style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} />

      {/* Speaker Left */}
      <SpeakerAvatar
        imageUrl={mbtiLeftUrl}
        type={mbtiLeftType}
        isActive={activeSpeaker === "left"}
        bounce={bounce}
        position="left"
      />

      {/* Speaker Right */}
      <SpeakerAvatar
        imageUrl={mbtiRightUrl}
        type={mbtiRightType}
        isActive={activeSpeaker === "right"}
        bounce={bounce}
        position="right"
      />

      {/* Subtitles Overlay */}
      <ConversationSubtitles script={script} />

      {/* Audio Layer */}
      {audioUrl && <Audio src={audioUrl} />}
      
      {/* 宣伝用のアウトロ層 */}
      <Sequence from={outroStart} durationInFrames={outroDuration}>
        <Outro />
      </Sequence>
      
    </AbsoluteFill>
  );
};

// --- Helper Component ---
const SpeakerAvatar: React.FC<{
  imageUrl: string;
  type: string;
  isActive: boolean;
  bounce: number;
  position: "left" | "right";
}> = ({ imageUrl, type, isActive, bounce, position }) => {
  // If active, base scale is 1.0 and adds an extra bounce (up to ~1.1 at peak of spring)
  // If inactive, base scale is 0.8.
  const baseScale = isActive ? 0.95 + (bounce * 0.05) : 0.8;
  const targetColor = position === "left" ? "#00ffff" : "#ff66cc";

  return (
    <div
      style={{
        position: "absolute",
        bottom: "150px",
        left: position === "left" ? "20px" : undefined,
        right: position === "right" ? "20px" : undefined,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transition: "opacity 0.2s, transform 0.2s",
        transform: `scale(${baseScale})`,
        opacity: isActive ? 1 : 0.4,
        filter: isActive ? `drop-shadow(0px 0px 30px ${targetColor})` : "none",
        zIndex: isActive ? 10 : 1,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.8)",
          color: targetColor,
          padding: "10px 40px",
          borderRadius: "50px",
          border: `3px solid ${targetColor}`,
          fontSize: "36px",
          fontWeight: "bold",
          fontFamily: "sans-serif",
          marginBottom: "20px",
        }}
      >
        {type}
      </div>
      <Img 
        src={imageUrl} 
        style={{ 
          height: "450px", // 縦動画用に少し大きめ
          width: "auto" 
        }} 
      />
    </div>
  );
};
