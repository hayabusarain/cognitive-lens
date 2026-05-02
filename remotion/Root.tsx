import { Composition, registerRoot } from "remotion";
import { TierListVideo } from "./TierListVideo";
import { Top5RankingVideo } from "./Top5RankingVideo";
import { AestheticPOVVideo } from "./AestheticPOVVideo";
import { LocalizedDubVideo } from "./LocalizedDubVideo";
import { SmartphoneScreenVideo } from "./SmartphoneScreenVideo";
import { ReactionPOVVideo } from "./ReactionPOVVideo";
import { PieChartVideo } from "./PieChartVideo";
import { HellishComboVideo } from "./HellishComboVideo";
import React from "react";
import "../app/globals.css";

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
        component={AestheticPOVVideo as any}
        durationInFrames={DEFAULT_DURATION}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={({ props }) => {
          // 120 frames (title) + texts * 105 frames + 150 frames (outro)
          const p = props as any;
          const textCount = p.texts?.length || 0;
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
      <Composition
        id="LocalizedDubVideo"
        component={LocalizedDubVideo as React.FC<any>}
        durationInFrames={1500}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          videoId: "AiGr0VFfZt8",
          title: "Test Viral Video",
          mbtiType: "ENFP",
          texts: ["あのね", "今日は", "本当にやばいことがあったの"],
        }}
      />
      <Composition
        id="SmartphoneScreenVideo"
        component={SmartphoneScreenVideo as React.FC<any>}
        durationInFrames={1500}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={({ props }) => {
          const sectionCount = (props as any).sections?.length || 0;
          return {
            durationInFrames: 150 + sectionCount * 180
          };
        }}
        defaultProps={{
          theme: "MBTI別・検索履歴覗いてみたらヤバかった…🤫",
          type: "search",
          sections: [
            {
              mbtiType: "INTP",
              items: ["人間 なぜ 感情的", "宇宙の果て どうなってる", "猫 かわいい 理由 科学的"]
            },
            {
              mbtiType: "ISFP",
              items: ["今日 運勢", "〇〇カフェ 映え", "仕事 辞めたい 限界"]
            }
          ]
        }}
      />
      <Composition
        id="ReactionPOVVideo"
        component={ReactionPOVVideo as React.FC<any>}
        durationInFrames={1500}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={({ props }) => {
          const reactionCount = (props as any).reactions?.length || 0;
          return {
            durationInFrames: 150 + reactionCount * 210
          };
        }}
        defaultProps={{
          theme: "セルフレジで『ﾋﾟｰｰｰｯ!!』ってなった時のMBTIの反応😇",
          reactions: [
            {
              mbtiType: "ENFP",
              text: "「えっ!? 私なんかしました!?」と焦りまくり、なぜか後ろに並んでる人にペコペコ謝る。"
            },
            {
              mbtiType: "INTJ",
              text: "画面のエラーコードを冷静に読み解き、自分で解決しようとする。（店員を呼ぶのは最終手段）"
            },
            {
              mbtiType: "ESTP",
              text: "迷わず「すいませーん！」と大声で店員を呼び、待ってる間はスマホ見てる。"
            }
          ]
        }}
      />
      <Composition
        id="PieChartVideo"
        component={PieChartVideo as React.FC<any>}
        durationInFrames={1500}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={({ props }) => {
          const chartCount = (props as any).charts?.length || 0;
          return {
            durationInFrames: 150 + chartCount * 240
          };
        }}
        defaultProps={{
          theme: "MBTI別・頭の中身を円グラフにしてみた🧠",
          charts: [
            {
              mbtiType: "ESTP",
              slices: [
                { label: "今夜の予定・遊び", percentage: 40 },
                { label: "スリルと刺激", percentage: 30 },
                { label: "謎の自信", percentage: 20 },
                { label: "本能", percentage: 10 }
              ]
            },
            {
              mbtiType: "ISFJ",
              slices: [
                { label: "あの人、大丈夫かな？", percentage: 40 },
                { label: "波風を立てないための気遣い", percentage: 30 },
                { label: "昔の黒歴史でダメージ", percentage: 20 },
                { label: "自分の本当の欲求", percentage: 10 }
              ]
            }
          ]
        }}
      />
      <Composition
        id="HellishComboVideo"
        component={HellishComboVideo as React.FC<any>}
        durationInFrames={1500}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={({ props }) => {
          const comboCount = (props as any).combos?.length || 0;
          return {
            durationInFrames: 150 + comboCount * 450
          };
        }}
        defaultProps={{
          theme: "この2人でドライブ行ったら終わる🚗💨",
          combos: [
            {
              typeA: "ESTJ",
              typeB: "INFP",
              dialogue: [
                { speaker: "ESTJ", text: "よし、10時15分にSAでトイレ休憩、12時に予約した店に着くぞ" },
                { speaker: "INFP", text: "あ！あそこの看板のソフトクリーム美味しそう！寄り道しよーよ！" },
                { speaker: "ESTJ", text: "（無言でカーナビの到着予想時刻を見つめる）" },
                { speaker: "INFP", text: "（機嫌悪くさせたかな…と急に静かになる）" }
              ]
            },
            {
              typeA: "ENFJ",
              typeB: "ISTP",
              dialogue: [
                { speaker: "ENFJ", text: "一緒に協力して作ろうね！私がネジ探すよ！" },
                { speaker: "ISTP", text: "……（無言で完璧な手際で組み立て始める）" },
                { speaker: "ENFJ", text: "ねえ、私なにかやることある？" },
                { speaker: "ISTP", text: "……（一人でやった方が早いから何もしなくていいと思っている）" }
              ]
            }
          ]
        }}
      />
    </>
  );
};

registerRoot(RemotionRoot);
