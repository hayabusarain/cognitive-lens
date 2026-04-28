import { COMPATIBILITY } from "./compatibility";
import { TYPE_INFO_EN } from "./type-info-en";

export type RelationshipTone = "synergy" | "growth" | "friction" | "collapse";

export interface TimelineEntry {
  day: string;
  title: string;
  event: string;
  tone: RelationshipTone;
}

function getArchetype(a: string, b: string): "dual" | "synergy" | "neutral" | "friction" | "clash" {
  if (a === b) return "dual";
  const compat = COMPATIBILITY[a as keyof typeof COMPATIBILITY];
  if (compat?.bestPartner.type === b) return "synergy";
  if (compat?.hardestMatch.type === b) return "clash";

  // Count letter matches
  const matches = [...a].filter((c, i) => c === b[i]).length;
  if (matches >= 3) return "neutral";
  return "friction";
}

function typeLabel(t: string): string {
  return `${t} (${TYPE_INFO_EN[t]?.name ?? t})`;
}

export function generateRelationshipTimelineEn(
  typeA: string,
  typeB: string
): TimelineEntry[] {
  const arch = getArchetype(typeA, typeB);
  const a = typeLabel(typeA);
  const b = typeLabel(typeB);

  // Dimension analysis
  const sameEI = typeA[0] === typeB[0];
  const sameSN = typeA[1] === typeB[1];
  const sameTF = typeA[2] === typeB[2];
  const sameJP = typeA[3] === typeB[3];

  const eiNote = sameEI
    ? `You both have the same social battery (${typeA[0] === "E" ? "Extrovert" : "Introvert"}). You naturally sync up on when to go hard at a party and when to rot in bed.`
    : `One of you recharges by being around people, the other by being alone. The "give me attention" vs "give me space" dynamic is going to slowly build up tension.`;

  const snNote = sameSN
    ? `You guys literally speak the same language. You don't have to explain your jokes or your thought process because the other person just *gets* it.`
    : `One of you is asking "so practically, what are we doing?" and the other is yapping about the philosophical meaning of the universe. This mismatch is brutal.`;

  const tfNote = sameTF
    ? `Your decision-making process matches. Whether it's "facts over feelings" or vice versa, you at least argue using the same rulebook.`
    : `One of you uses cold hard logic, the other uses pure emotion. You can look at the exact same situation and see two completely different problems.`;

  const jpNote = sameJP
    ? `Your life structure is similar. Whether you're both planning freaks or chaotic procrastinators, the lack of friction in daily chores is a blessing.`
    : `One of you wants a detailed itinerary, the other wants to "see where the wind takes us." Booking a vacation together will end in tears.`;

  switch (arch) {
    case "dual":
      return [
        {
          day: "Day 1",
          title: "Are We The Same Person?",
          event: `Two ${a}s meeting. You immediately vibe. The humor, the pacing, the exact weird thoughts—it's like looking in a mirror. But honestly, it's a little terrifying knowing someone can read you this well.`,
          tone: "synergy",
        },
        {
          day: "Day 30",
          title: "Seeing Your Own Flaws",
          event: `After a month, the red flags start showing. The worst part? They are YOUR red flags. Everything that annoys you about them is exactly what you hate about yourself. The self-reflection is painful.`,
          tone: "growth",
        },
        {
          day: "Day 100",
          title: "The Endless Echo Chamber",
          event: `You approach problems the exact same way. When you agree, it's powerful. But when you clash, nobody backs down. ${tfNote}. If you can't learn to compromise, this relationship will implode.`,
          tone: "friction",
        },
        {
          day: "Day 365",
          title: "Ride or Die, or Ghosted",
          event: `A year later, you're either an unstoppable power couple, or you've completely cut ties because facing your own flaws every single day became too exhausting.`,
          tone: "growth",
        },
      ];

    case "synergy":
      return [
        {
          day: "Day 1",
          title: "Unspoken Connection",
          event: `${a} meets ${b}. ${eiNote}. On paper you look different, but conversation flows effortlessly. It feels like you've found the missing piece of your brain.`,
          tone: "synergy",
        },
        {
          day: "Day 30",
          title: "Opposites Attract",
          event: `${snNote}. At first, your differences are exciting. One of you naturally covers for the other's weaknesses. But beware: the person who feels like they're doing all the "heavy lifting" might start holding a grudge.`,
          tone: "growth",
        },
        {
          day: "Day 100",
          title: "The Ultimate Duo",
          event: `${tfNote}. Three months in, your differences aren't a problem anymore; they're a weapon. You operate like a perfectly balanced team. You start wondering how you survived before them.`,
          tone: "synergy",
        },
        {
          day: "Day 365",
          title: "Effortless Harmony",
          event: `A year later, you function as one unit. ${jpNote}. There will still be friction, but it only makes the bond stronger. You've learned to accept their quirks instead of trying to change them. This is endgame material.`,
          tone: "synergy",
        },
      ];

    case "clash":
      return [
        {
          day: "Day 1",
          title: "Vibe Check: Failed",
          event: `${a} and ${b}. From the first conversation, something feels off. ${eiNote}. The pacing, the humor, the energy—it's just a fundamental mismatch. Nobody did anything wrong, but the vibes are atrocious.`,
          tone: "friction",
        },
        {
          day: "Day 30",
          title: "The 'Why Don't You Understand' Loop",
          event: `${snNote}. As you get closer, the real problems start. ${tfNote}. You both constantly feel misunderstood. You're trying to solve a puzzle, but you're not even playing the same game. It's mentally exhausting.`,
          tone: "friction",
        },
        {
          day: "Day 100",
          title: "Walking on Eggshells",
          event: `${jpNote}. Three months in, the loud arguments stop. Not because you fixed it, but because you gave up. You've created a minefield of "topics we shouldn't talk about." The silence is deafening.`,
          tone: "collapse",
        },
        {
          day: "Day 365",
          title: "Toxic Attachment",
          event: `If you survived a year, it's because you lowered your expectations to the floor. You will never fully understand each other. At this point, staying together is less about love and more about a stubborn, toxic attachment to the chaos.`,
          tone: "friction",
        },
      ];

    case "friction":
      return [
        {
          day: "Day 1",
          title: "Somethings Not Clicking",
          event: `Meeting of ${a} and ${b}. No instant sparks, but no instant hate either. But as you talk, small weird moments pile up. It's not bad, it's just... 'different.' ${eiNote}.`,
          tone: "growth",
        },
        {
          day: "Day 30",
          title: "Speaking Different Languages",
          event: `${snNote}. A month in, you realize they view the world in a completely alien way. ${tfNote}. It's not about who is right; your definition of "right" is just fundamentally different. Whether you find this interesting or annoying decides everything.`,
          tone: "friction",
        },
        {
          day: "Day 100",
          title: "Acceptance or Giving Up",
          event: `${jpNote}. The crossroads. If you can embrace the differences and find the humor in it, you'll both grow massively. If you stubbornly insist on your way, the relationship will shrink into superficial interactions.`,
          tone: "friction",
        },
        {
          day: "Day 365",
          title: "Perfectly Imperfect",
          event: `A year in, you still don't fully "get" them. But you've chosen to stay anyway. Finding someone who stays through the messy, imperfect lack of understanding is rare. That acceptance is the ultimate form of loyalty.`,
          tone: "growth",
        },
      ];

    default: // neutral
      return [
        {
          day: "Day 1",
          title: "Comfortable Silence",
          event: `Meeting of ${a} and ${b}. No cinematic drama, no red flags. The conversation just flows. The mix of similarities and differences is just right. ${eiNote}. This 'chill' feeling is the foundation of massive trust.`,
          tone: "growth",
        },
        {
          day: "Day 30",
          title: "Learning the Quirks",
          event: `${snNote}. A month in, you start seeing their weird habits. ${tfNote}. You might bicker, but it rarely escalates. It's more of an "oh, so that's how you think" discovery phase. The trust is building quietly.`,
          tone: "growth",
        },
        {
          day: "Day 100",
          title: "Boring but Safe",
          event: `${jpNote}. Three months in, the relationship settles into a groove. No crazy drama, no massive fights. It might feel "boring" to toxic people, but this level of peace is a massive flex. Don't take this stability for granted.`,
          tone: "synergy",
        },
        {
          day: "Day 365",
          title: "The Solid Foundation",
          event: `A year in, the relationship just *works*. There's no dramatic movie plot, but the absolute certainty that "they will always be there" is stronger than any passionate fling. Your strength is your peace.`,
          tone: "synergy",
        },
      ];
  }
}
