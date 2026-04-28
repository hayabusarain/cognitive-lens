import { Question } from "./questions";

export const QUESTIONS_EN: Question[] = [
  // ── E / I ────────────────────────────────────────────────────
  {
    id: 1,
    axis: "E / I",
    axisKey: "EI",
    text: "When you see crazy news or a funny meme, what do you do?",
    options: [
      { label: "Instantly share it to my IG story or DM the group chat to discuss.", value: "E", emoji: "🗣️" },
      { label: "Just think 'huh, cool' in my head and keep scrolling.", value: "I", emoji: "🤐" },
    ],
  },
  {
    id: 2,
    axis: "E / I",
    axisKey: "EI",
    text: "What type of conversation gives you the most energy?",
    options: [
      { label: "Fast-paced banter where the topic changes every 5 seconds.", value: "E", emoji: "⚡" },
      { label: "A deep, focused 1-on-1 conversation about a single topic.", value: "I", emoji: "☕" },
    ],
  },
  {
    id: 3,
    axis: "E / I",
    axisKey: "EI",
    text: "After a completely exhausting work week, how do you recover on your day off?",
    options: [
      { label: "Hanging out with people. Being alone makes me feel drained.", value: "E", emoji: "🔋" },
      { label: "Rotting in bed alone. Total isolation is my charger.", value: "I", emoji: "🛌" },
    ],
  },
  {
    id: 4,
    axis: "E / I",
    axisKey: "EI",
    text: "At a party where you only know one person, how do you act?",
    options: [
      { label: "I mingle, introduce myself, and try to hype up the room.", value: "E", emoji: "💃" },
      { label: "I stick to the person I know or quietly observe from the corner.", value: "I", emoji: "👀" },
    ],
  },
  {
    id: 5,
    axis: "E / I",
    axisKey: "EI",
    text: "Your friend texts you 'Wyd? Wanna hang out right now?' Reaction?",
    options: [
      { label: "Say less, I'm on my way. I love spontaneous plans.", value: "E", emoji: "🏃" },
      { label: "Absolutely not. I need at least 24 hours of mental preparation.", value: "I", emoji: "🙅" },
    ],
  },

  // ── S / N ────────────────────────────────────────────────────
  {
    id: 6,
    axis: "S / N",
    axisKey: "SN",
    text: "What do you naturally talk about more?",
    options: [
      { label: "Real stuff: what happened today, who did what, practical things.", value: "S", emoji: "🗣️" },
      { label: "Abstract stuff: 'What if' scenarios, the future, weird concepts.", value: "N", emoji: "💭" },
    ],
  },
  {
    id: 7,
    axis: "S / N",
    axisKey: "SN",
    text: "When buying clothes or items, what is your main deciding factor?",
    options: [
      { label: "Utility and reviews. Is it high quality? Can I use it every day?", value: "S", emoji: "🛒" },
      { label: "The vibe and concept. Is it unique? Does it match my aesthetic?", value: "N", emoji: "✨" },
    ],
  },
  {
    id: 8,
    axis: "S / N",
    axisKey: "SN",
    text: "What kind of photos do you post on social media?",
    options: [
      { label: "Literal, high-quality photos of where I am and who I'm with.", value: "S", emoji: "📸" },
      { label: "Aesthetic, artsy, or slightly blurry 'mood' photos with no context.", value: "N", emoji: "🌌" },
    ],
  },
  {
    id: 9,
    axis: "S / N",
    axisKey: "SN",
    text: "When you explain a story, how do you do it?",
    options: [
      { label: "Chronological order. I give the facts and details as they happened.", value: "S", emoji: "📋" },
      { label: "I use weird metaphors, jump around timelines, and skip to the point.", value: "N", emoji: "🚀" },
    ],
  },
  {
    id: 10,
    axis: "S / N",
    axisKey: "SN",
    text: "When an unexpected problem occurs, what is your first thought?",
    options: [
      { label: "'Okay, what's the immediate practical step I can take to fix this now?'", value: "S", emoji: "🔧" },
      { label: "'Why did this happen in the first place? What's the root cause?'", value: "N", emoji: "🤔" },
    ],
  },

  // ── T / F ────────────────────────────────────────────────────
  {
    id: 11,
    axis: "T / F",
    axisKey: "TF",
    text: "When a friend texts you crying about a problem, what do you do?",
    options: [
      { label: "Give them a logical solution so they can fix the problem.", value: "T", emoji: "💡" },
      { label: "Validate their feelings and say 'that sucks, I'm here for you.'", value: "F", emoji: "🫂" },
    ],
  },
  {
    id: 12,
    axis: "T / F",
    axisKey: "TF",
    text: "When you have a disagreement with someone, how do you handle it?",
    options: [
      { label: "I put feelings aside and try to figure out who is objectively right.", value: "T", emoji: "⚖️" },
      { label: "I hate tension, so I might just agree to keep the peace.", value: "F", emoji: "😮‍💨" },
    ],
  },
  {
    id: 13,
    axis: "T / F",
    axisKey: "TF",
    text: "When you admire someone, what is it usually for?",
    options: [
      { label: "Their competence, intelligence, and how much they achieve.", value: "T", emoji: "📈" },
      { label: "Their kindness, empathy, and how well they treat others.", value: "F", emoji: "🌸" },
    ],
  },
  {
    id: 14,
    axis: "T / F",
    axisKey: "TF",
    text: "When making a final decision, what is your deciding factor?",
    options: [
      { label: "'Does this make logical sense? Is it efficient?'", value: "T", emoji: "💰" },
      { label: "'Does this feel right? Will it make me and others happy?'", value: "F", emoji: "❤️" },
    ],
  },
  {
    id: 15,
    axis: "T / F",
    axisKey: "TF",
    text: "If your best friend is clearly in the wrong in an argument?",
    options: [
      { label: "I will bluntly tell them they are wrong. Truth over comfort.", value: "T", emoji: "🛑" },
      { label: "I will take their side in public and gently talk to them in private.", value: "F", emoji: "🛡️" },
    ],
  },

  // ── J / P ────────────────────────────────────────────────────
  {
    id: 16,
    axis: "J / P",
    axisKey: "JP",
    text: "How do you plan a vacation or a day out?",
    options: [
      { label: "I make an itinerary, book things in advance, and stick to the schedule.", value: "J", emoji: "🗓️" },
      { label: "I book the flight and figure the rest out when I get there. Vibes only.", value: "P", emoji: "🎲" },
    ],
  },
  {
    id: 17,
    axis: "J / P",
    axisKey: "JP",
    text: "How do you handle deadlines for assignments or work?",
    options: [
      { label: "I do it steadily ahead of time. Procrastination gives me anxiety.", value: "J", emoji: "✅" },
      { label: "I do absolutely nothing until the panic monster wakes up 3 hours before.", value: "P", emoji: "🔥" },
    ],
  },
  {
    id: 18,
    axis: "J / P",
    axisKey: "JP",
    text: "What is your texting style?",
    options: [
      { label: "I reply fast. Leaving notifications unread stresses me out.", value: "J", emoji: "⚡" },
      { label: "I reply in my head, forget to actually text back, and reply 3 days later.", value: "P", emoji: "🐢" },
    ],
  },
  {
    id: 19,
    axis: "J / P",
    axisKey: "JP",
    text: "What does your room or desk look like?",
    options: [
      { label: "Organized. Everything has a specific place.", value: "J", emoji: "📐" },
      { label: "A total mess, but it's 'organized chaos' because I know where everything is.", value: "P", emoji: "🌪️" },
    ],
  },
  {
    id: 20,
    axis: "J / P",
    axisKey: "JP",
    text: "How do you feel when plans get suddenly canceled?",
    options: [
      { label: "Annoyed. I already mentally prepared for this specific plan.", value: "J", emoji: "😠" },
      { label: "Relieved or indifferent. 'Nice, I can just do whatever now.'", value: "P", emoji: "🎈" },
    ],
  },
];
