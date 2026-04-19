import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

export type ScriptWord = {
  text: string;
  startFrame: number;
  endFrame: number;
};

export const Subtitles: React.FC<{ script: ScriptWord[] }> = ({ script }) => {
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {script.map((word, i) => (
        <Sequence
          key={i}
          from={word.startFrame}
          // 次の単語が出るまで表示し続けるか、あるいはendFrameで消すか。
          // 短いTikTok動画では次の単語がすぐに出るので、そのまま重ねるか切り替えます。
          durationInFrames={word.endFrame - word.startFrame}
        >
          <WordSubtitle text={word.text} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const WordSubtitle: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // TikTokでよくある「勢いよく飛び出して少し戻る」（バウンドする）アニメーション
  const scale = spring({
    frame,
    fps,
    config: {
      damping: 12, // 低めのdampingでバウンドを増やす
      stiffness: 250, // 飛び出す勢い
      mass: 0.6,
    },
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          transform: `scale(${scale})`,
          fontSize: "120px",
          fontWeight: 900,
          fontFamily: "'Dela Gothic One', 'Impact', sans-serif",
          color: "white",
          // 白文字に太い黒縁と、さらにドロップシャドウで目立たせる
          WebkitTextStroke: "6px black",
          textShadow: "0px 15px 30px rgba(0,0,0,0.8), 0px 0px 10px rgba(0,255,255,0.8)",
          textAlign: "center",
          lineHeight: "1.2",
          // 折り返しを防ぐための設定
          whiteSpace: "pre-wrap",
          padding: "0 40px",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
