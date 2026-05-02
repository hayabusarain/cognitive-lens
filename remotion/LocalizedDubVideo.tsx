import { AbsoluteFill, Sequence, Video, staticFile, useVideoConfig } from "remotion";
import React from "react";

export interface LocalizedDubVideoProps {
  videoId: string; // The ID of the downloaded YouTube video in public/downloads/
  title: string;
  texts: string[];
}

export const LocalizedDubVideo: React.FC<LocalizedDubVideoProps> = ({
  videoId,
  title,
  texts,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  
  // 1テキストあたりのフレーム数を均等に割り当てる簡易計算
  // (実際にはテキスト長に合わせたりTTSの長さに合わせたりするのが理想)
  const durationPerText = Math.floor(durationInFrames / Math.max(1, texts.length));

  return (
    <AbsoluteFill className="bg-black flex items-center justify-center">
      {/* 1. 背景の元動画（音声をミュートするかどうかは要検討だが、一旦音を出すかミュートか。今回は直訳なのでミュートしてBGMを入れるのがベターだが、簡易的にそのまま流す） */}
      <AbsoluteFill>
        <Video 
          src={`http://localhost:3000/downloads/${videoId}.mp4`} 
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          // muted={true} 
        />
      </AbsoluteFill>

      {/* 2. タイトルテロップ（常に上部に表示） */}
      <AbsoluteFill className="justify-start pt-20 px-8 items-center z-10">
        <div 
          className="bg-black/80 backdrop-blur-md px-6 py-4 rounded-2xl border-2 border-white text-center shadow-2xl"
          style={{ width: "90%" }}
        >
          <h1 className="text-white font-black text-5xl mb-2 leading-tight">
            {title}
          </h1>
          <p className="text-yellow-400 font-bold text-3xl">【日本語 吹き替え版】</p>
        </div>
      </AbsoluteFill>

      {/* 3. 順次表示される直訳テキスト（中央下部） */}
      <AbsoluteFill className="justify-end pb-32 items-center z-10">
        {texts.map((text, index) => {
          const startFrame = index * durationPerText;
          const endFrame = (index === texts.length - 1) ? durationInFrames : startFrame + durationPerText;
          const duration = endFrame - startFrame;

          return (
            <Sequence key={index} from={startFrame} durationInFrames={duration}>
              <AbsoluteFill className="justify-end items-center pb-20">
                <div 
                  className="px-8 py-6 rounded-3xl text-center flex items-center justify-center shadow-2xl"
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.85)",
                    border: "4px solid white",
                    width: "85%",
                    minHeight: "200px"
                  }}
                >
                  <p 
                    className="text-white font-black leading-snug"
                    style={{ fontSize: "50px", textShadow: "0 4px 10px rgba(0,0,0,0.5)" }}
                  >
                    {text}
                  </p>
                </div>
              </AbsoluteFill>
            </Sequence>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
