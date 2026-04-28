import { ARTICLE_DATA } from "./article-data";
import { ARTICLE_DATA_EN } from "./article-data-en";
import { PRESET_TIER_LISTS } from "./tier-list-data";
import { PRESET_TIER_LISTS_EN } from "./tier-list-data-en";
import { TARGET_QUESTIONS } from "./target-questions";
import { TARGET_QUESTIONS_EN } from "./target-questions-en";
import { QUESTIONS } from "./questions";
import { QUESTIONS_EN } from "./questions-en";
import { COMPATIBILITY } from "./compatibility";
import { COMPATIBILITY_EN } from "./compatibility-en";
import { generateRelationshipTimeline } from "./relationship";
import { generateRelationshipTimelineEn } from "./relationship-en";
import { TYPE_INFO } from "./type-info";
import { TYPE_INFO_EN } from "./type-info-en";

export function getArticleData(lang: string) {
  return lang === "en" ? ARTICLE_DATA_EN : ARTICLE_DATA;
}

export function getTierListData(lang: string) {
  return lang === "en" ? PRESET_TIER_LISTS_EN : PRESET_TIER_LISTS;
}

export function getTargetQuestions(lang: string) {
  return lang === "en" ? TARGET_QUESTIONS_EN : TARGET_QUESTIONS;
}

export function getQuestions(lang: string) {
  return lang === "en" ? QUESTIONS_EN : QUESTIONS;
}

export function getCompatibility(lang: string) {
  return lang === "en" ? COMPATIBILITY_EN : COMPATIBILITY;
}

export function getTypeInfo(lang: string) {
  return lang === "en" ? TYPE_INFO_EN : TYPE_INFO;
}

export function getRelationshipTimeline(lang: string, typeA: string, typeB: string) {
  return lang === "en" 
    ? generateRelationshipTimelineEn(typeA, typeB) 
    : generateRelationshipTimeline(typeA, typeB);
}
