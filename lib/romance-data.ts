import { ROMANCE_DATA_JA } from "./romance-data-ja";
import { ROMANCE_DATA_EN } from "./romance-data-en";

export type MBTIType = "INTJ" | "INTP" | "ENTJ" | "ENTP" | "INFJ" | "INFP" | "ENFJ" | "ENFP" | "ISTJ" | "ISFJ" | "ESTJ" | "ESFJ" | "ISTP" | "ISFP" | "ESTP" | "ESFP";

export interface RomanceData {
  questions: string[];
  advice: string;
}

export const getRomanceData = (lang: string): Record<MBTIType, RomanceData> => {
  return lang === "en" ? ROMANCE_DATA_EN : ROMANCE_DATA_JA;
};
