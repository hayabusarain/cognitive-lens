import { Composition, registerRoot } from "remotion";
import { TierListVideo } from "./TierListVideo";
import { Top5RankingVideo } from "./Top5RankingVideo";
import { AestheticPOVVideo } from "./AestheticPOVVideo";
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
          title: "16Type Ranking",
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
      <Composition
        id="AestheticPOVVideo"
        component={AestheticPOVVideo}
        durationInFrames={DEFAULT_DURATION}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={({ props }) => {
          // 120 frames (title) + texts * 105 frames + 150 frames (outro)
          const textCount = props.texts?.length || 0;
          return {
            durationInFrames: 120 + (textCount * 105) + 150
          };
        }}
        defaultProps={{
          mbtiType: "INFP",
          title: "深夜3時、未送信の「500文字のLINE」",
          texts: [
            "嫌いになったわけじゃない。",
            "ただ、どう思われるかシミュレーションを重ねるうちに、",
            "相手の感情を受信しすぎて息ができなくなった。",
            "100の感情を持っていても、",
            "世界に出力できるのはいつも『ごめん、寝てた』の7文字だけだ。"
          ],
          backgroundUrl: undefined
        }}
      />
    </>
  );
};

registerRoot(RemotionRoot);
