import { TYPE_INFO, TypeInfo } from "./type-info";

const EN_OVERRIDES: Record<string, { name: string; tagline: string }> = {
  INTJ: { name: "Architect", tagline: "Strategic Mastermind" },
  INTP: { name: "Logician", tagline: "Abstract Thinker" },
  ENTP: { name: "Debater", tagline: "Chaotic Intellectual" },
  ENTJ: { name: "Commander", tagline: "Ruthless Leader" },
  INFJ: { name: "Advocate", tagline: "Mystic Empath" },
  INFP: { name: "Mediator", tagline: "Poetic Dreamer" },
  ENFJ: { name: "Protagonist", tagline: "Charismatic Savior" },
  ENFP: { name: "Campaigner", tagline: "Wild Free Spirit" },
  ISTJ: { name: "Logistician", tagline: "Reliable Guardian" },
  ISFJ: { name: "Defender", tagline: "Loyal Caretaker" },
  ESTJ: { name: "Executive", tagline: "Bossy Manager" },
  ESFJ: { name: "Consul", tagline: "Social Butterfly" },
  ISTP: { name: "Virtuoso", tagline: "Silent Mechanic" },
  ISFP: { name: "Adventurer", tagline: "Aesthetic Wanderer" },
  ESTP: { name: "Entrepreneur", tagline: "Reckless Thrill-Seeker" },
  ESFP: { name: "Entertainer", tagline: "Life of the Party" },
};

export const TYPE_INFO_EN: Record<string, TypeInfo> = Object.fromEntries(
  Object.entries(TYPE_INFO).map(([key, info]) => [
    key,
    {
      ...info,
      name: EN_OVERRIDES[key]?.name ?? info.name,
      tagline: EN_OVERRIDES[key]?.tagline ?? info.tagline,
    },
  ])
);
