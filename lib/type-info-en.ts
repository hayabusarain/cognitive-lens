import { TYPE_INFO, TypeInfo, DEFAULT_TYPE } from "./type-info";

const EN_OVERRIDES: Record<string, { name: string; tagline: string; description: string }> = {
  INTJ: { name: "Architect", tagline: "Strategic Mastermind", description: "Blocks out all surrounding noise to build perfect plans in their own world. Might seem cold because they mute all useless notifications, but their mind is always ten steps ahead. They are the ultimate burner account, only revealed to those who know the passcode." },
  INTP: { name: "Logician", tagline: "Abstract Thinker", description: "A curiosity monster who won't stop searching until they're satisfied. They'll leave real-life texts unread while constantly pondering the truths of the universe in their head. Unbound by common sense, their imagination is seriously on par with a walking Wikipedia." },
  ENTP: { name: "Debater", tagline: "Chaotic Intellectual", description: "An ultra-speed thinker who jumps to the next fun thing before finishing the first. They can be a bit annoying when teasing you, but their unpredictable imagination constantly provides new stimulation (updates) to everyone around them." },
  ENTJ: { name: "Commander", tagline: "Ruthless Leader", description: "A charismatic leader who instantly takes charge in any chaotic situation to achieve their goals. So efficiency-focused that their pressure can be intense, but the security of knowing 'this project will definitely succeed if they're here' is insane." },
  INFJ: { name: "Advocate", tagline: "Mystic Empath", description: "Great at reading others' feelings, but guards their own true thoughts with ultra-strong security. They only open up to people they truly trust, but once they do, they show kindness deeper than the ocean. A truly mystical presence." },
  INFP: { name: "Mediator", tagline: "Poetic Dreamer", description: "Holds countless grand ideals (drafts) in their head that they haven't shown anyone yet. Easily hurt by harsh reality, but their delicate sensibility and ability to capture the world beautifully is an unmatched artistic talent." },
  ENFJ: { name: "Protagonist", tagline: "Charismatic Savior", description: "A ball of pure kindness who instantly senses what others need and supports them with everything they have. Their communication skills that encourage everyone to move forward make them the ultimate influencer, positively updating the lives around them." },
  ENFP: { name: "Campaigner", tagline: "Wild Free Spirit", description: "Acts on ideas instantly! A genius at dragging everyone into launching fun events. They sometimes glitch out and forget promises, but their overwhelming brightness and vibe make them a beloved character who gets forgiven for everything." },
  ISTJ: { name: "Logistician", tagline: "Reliable Guardian", description: "An ultra-serious, reliable type who absolutely follows set rules and schedules. They might not be flashy, but they are the ultimate social infrastructure—so important that the real world (system) would stop running without them." },
  ISFJ: { name: "Defender", tagline: "Loyal Caretaker", description: "The unsung hero who quietly continues doing things for others behind the scenes. They remember everything you like and your casual words, outputting their kindness with god-tier timing." },
  ESTJ: { name: "Executive", tagline: "Bossy Manager", description: "Realistic and hates waste. They plan the shortest route to their goals and forcefully drag everyone along. They can be strict with rules like a nagging mom, but their ability to walk the talk and get results is seriously reliable." },
  ESFJ: { name: "Consul", tagline: "Social Butterfly", description: "The ultimate mood-maker who constantly reads the room and makes sure everyone gets along. They rush to a friend's aid in a second, and just having them around instantly warms up the entire atmosphere." },
  ISTP: { name: "Virtuoso", tagline: "Silent Mechanic", description: "Usually chilling in power-saving mode, but when trouble hits, they calmly and instantly fix it like a true craftsman. They don't talk much but show it through actions, and their dry coolness has endless people obsessing over them." },
  ISFP: { name: "Adventurer", tagline: "Aesthetic Wanderer", description: "A free-spirited artist who values their own pace and senses above all else. Not great with words, but they have a unique perspective and aesthetic. Being with them makes everyday life feel a little more aesthetic and emotional." },
  ESTP: { name: "Entrepreneur", tagline: "Reckless Thrill-Seeker", description: "An ultra-active, mentally tough thrill-seeker who charges forward with 'Let's just try it!' without thinking ahead. Even in a pinch, they somehow survive with their natural reflexes. Being with them turns boring daily life into a rollercoaster." },
  ESFP: { name: "Entertainer", tagline: "Life of the Party", description: "Always at max hype, a genius at making everyone in the room smile. They hate being lonely and always want to connect, but their overwhelming extrovert aura instantly turns any atmosphere into a party." },
};

export const TYPE_INFO_EN: Record<string, TypeInfo> = Object.fromEntries(
  Object.entries(TYPE_INFO).map(([key, info]) => [
    key,
    {
      ...info,
      name: EN_OVERRIDES[key]?.name ?? info.name,
      tagline: EN_OVERRIDES[key]?.tagline ?? info.tagline,
      description: EN_OVERRIDES[key]?.description ?? info.description,
    },
  ])
);

export const DEFAULT_TYPE_EN: TypeInfo = {
  ...DEFAULT_TYPE,
  name: "Analyzing",
  tagline: "Decoding your personality traits",
  description: "Please wait a moment.",
};
