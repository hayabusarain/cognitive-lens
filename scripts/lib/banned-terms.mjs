// 使わない名称と語の一覧（仕様書 docs/redesign-spec.md 6-1、docs/tone-guide.md 5-1）
// コンテンツの検査（scripts/check-banned-terms.mjs）と、ビルドしたページの検査（scripts/check-site.mjs）の両方が読む。
import fs from "node:fs";

const legacy = JSON.parse(fs.readFileSync(new URL("./legacy-type-names.json", import.meta.url), "utf8"));

export const BANNED = {
  "16Personalities の型名（英語）": ["Architect", "Logician", "Commander", "Debater", "Advocate", "Mediator", "Protagonist", "Campaigner", "Logistician", "Defender", "Executive", "Consul", "Virtuoso", "Adventurer", "Entrepreneur", "Entertainer"],
  "16Personalities の型名（日本語）": ["建築家", "論理学者", "指揮官", "討論者", "提唱者", "仲介者", "主人公", "広報運動家", "管理者", "擁護者", "幹部", "領事", "巨匠", "冒険家", "起業家", "エンターテイナー"],
  "16Personalities のグループ名・軸名": ["Analysts", "Diplomats", "Sentinels", "Explorers", "分析家", "外交官", "番人", "探検家", "Mind", "Energy", "Nature", "Tactics", "Identity"],
  "現行サイトの型名": legacy.names,
  "現行サイトのタグライン": legacy.taglines,
  "現行サイトのグループ名": ["分析系", "理想主義系", "管理系", "探索系", "Idealists"],
  "Keirsey の型名・気質名": ["Mastermind", "Inventor", "Fieldmarshal", "Healer", "Counselor", "Champion", "Teacher", "Inspector", "Protector", "Supervisor", "Provider", "Crafter", "Composer", "Promoter", "Performer", "Rational", "Idealist", "Guardian", "Artisan"],
  "誇張語": ["最強", "天才", "神", "完璧"],
  // トーンガイド（docs/tone-guide.md 5-1）の流行語・若者言葉
  "流行語": ["ヤバい", "ヤバ", "ガチ", "ガチ勢", "マジ", "エモい", "エモ", "沼る", "沼", "蛙化", "ぴえん", "それな", "草", "陰キャ", "陽キャ", "メンヘラ", "無理ゲー", "詰んだ", "秒で", "爆速", "エグい", "ワンチャン", "知らんけど", "神対応", "神機能", "チート", "デフォ", "アプデ", "裏アカ", "量産型", "限界突破"],
};

/** 語が属する分類の名前 */
export const categoryOf = (term) => Object.entries(BANNED).find(([, list]) => list.includes(term))?.[0] ?? "表記";
