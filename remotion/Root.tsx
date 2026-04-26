import { Composition, registerRoot } from "remotion";
import { TierListVideo } from "./TierListVideo";
import { Top5RankingVideo } from "./Top5RankingVideo";
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
        calculateMetadata={({ props }) => {
          const entryCount = props.entries?.length || 0;
          return {
            durationInFrames: Math.max(150, entryCount * (props.popDuration || 80) + 150)
          };
        }}
        defaultProps={{
          title: "MBTI Ranking",
          entries: [],
          popDuration: 80,
        }}
      />
      <Composition
        id="Top5RankingVideo"
        component={Top5RankingVideo}
        durationInFrames={DEFAULT_DURATION}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={({ props }) => {
          const entryCount = props.entries?.length || 0;
          return {
            durationInFrames: Math.max(150, entryCount * (props.popDuration || 150) + 150)
          };
        }}
        defaultProps={{
          title: "Top 5 Ranking",
          entries: [],
          popDuration: 150,
        }}
      />
    </>
  );
};

registerRoot(RemotionRoot);
