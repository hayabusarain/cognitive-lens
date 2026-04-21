import { Composition, registerRoot } from "remotion";
import { TierListVideo } from "./TierListVideo";
import React from "react";

// デフォルトのフレーム数（レンダリング時に inputProps に基づいて動的にオーバーライド可能）
const DEFAULT_DURATION = 1370;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TierListVideo"
        component={TierListVideo}
        durationInFrames={DEFAULT_DURATION}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          title: "MBTI Ranking",
          entries: [],
          popDuration: 80,
        }}
      />
    </>
  );
};

registerRoot(RemotionRoot);
