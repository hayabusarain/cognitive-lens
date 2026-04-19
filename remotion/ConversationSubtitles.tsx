import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

export type ConversationScriptWord = {
  text: string;
  startFrame: number;
  endFrame: number;
  speaker: "left" | "right";
};

export const ConversationSubtitles: React.FC<{ script: ConversationScriptWord[] }> = ({ script }) => {
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {script.map((word, i) => (
        <Sequence
          key={i}
          from={word.startFrame}
          durationInFrames={word.endFrame - word.startFrame}
        >
          <ConversationSubtitleWord word={word} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const ConversationSubtitleWord: React.FC<{ word: ConversationScriptWord }> = ({ word }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // バウンドするアニメーション
  const scale = spring({
    frame,
    fps,
    config: {
      damping: 10,
      stiffness: 250,
      mass: 0.6,
    },
  });

  // 話者によって色を変更
  // 左がシアン（ENTPなど）、右がピンク（INFPなど）
  const textColor = word.speaker === "left" ? "#00ffff" : "#ff66cc";
  const shadowColor = word.speaker === "left" ? "rgba(0, 255, 255, 0.8)" : "rgba(255, 102, 204, 0.8)";

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          transform: `scale(${scale})`,
          fontSize: "120px",
          fontWeight: 900,
          fontFamily: "'Dela Gothic One', 'Impact', sans-serif",
          color: "white",
          WebkitTextStroke: `4px ${textColor}`,
          textShadow: `0px 15px 30px rgba(0,0,0,0.8), 0px 0px 20px ${shadowColor}`,
          textAlign: "center",
          lineHeight: "1.2",
          whiteSpace: "pre-wrap",
          padding: "0 40px",
        }}
      >
        {word.text}
      </div>
    </AbsoluteFill>
  );
};
