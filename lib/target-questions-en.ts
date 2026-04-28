import { TargetQuestion } from "./target-questions";

export const TARGET_QUESTIONS_EN: TargetQuestion[] = [
  // --- E/I (Extraversion vs Introversion) ---
  {
    id: 1,
    text: "How do they handle weekend plans or group hangouts?",
    optionA: { text: "Always down. They're usually the one texting 'what are we doing tonight?'", value: "E" },
    optionB: { text: "Depends on their social battery. Honestly, they look like they want to go home early.", value: "I" }
  },
  {
    id: 2,
    text: "How do they use their Instagram/Snapchat stories?",
    optionA: { text: "Breathes through their stories. Posts everything and doesn't care who sees.", value: "E" },
    optionB: { text: "Mostly lurks. If they post, it's strictly for the Close Friends list.", value: "I" }
  },
  {
    id: 3,
    text: "How do they act at a new job or a party where they know nobody?",
    optionA: { text: "Zero social anxiety. Walks up to strangers and makes friends instantly.", value: "E" },
    optionB: { text: "Very guarded. Will talk if spoken to, but stays in energy-saving mode.", value: "I" }
  },
  {
    id: 4,
    text: "What does their ideal day off look like?",
    optionA: { text: "Texting 5 different people to find out who's free because they hate being alone.", value: "E" },
    optionB: { text: "Rotting in bed watching Netflix without stepping a foot outside.", value: "I" }
  },
  {
    id: 5,
    text: "How do they talk in real life?",
    optionA: { text: "Zero filter. Talks fast, jumps between topics, thinks out loud.", value: "E" },
    optionB: { text: "Takes a pause before speaking. Processes thoughts before opening their mouth.", value: "I" }
  },

  // --- S/N (Sensing vs Intuition) ---
  {
    id: 6,
    text: "What do you guys usually talk about?",
    optionA: { text: "Real-world drama, what happened today, or who did what.", value: "S" },
    optionB: { text: "Weird hypothetical scenarios like 'what would you do in a zombie apocalypse?'", value: "N" }
  },
  {
    id: 7,
    text: "When a problem comes up, how do they react?",
    optionA: { text: "Handles it practically. 'Okay, let's just do X and fix it.'", value: "S" },
    optionB: { text: "Starts a philosophical debate about the root cause of the problem.", value: "N" }
  },
  {
    id: 8,
    text: "How do they review movies or TV shows?",
    optionA: { text: "'That scene was hilarious' or 'The actors looked so good.' Very literal.", value: "S" },
    optionB: { text: "Analyzes the hidden symbolism, foreshadowing, and character psychology.", value: "N" }
  },
  {
    id: 9,
    text: "How would you describe their texting style?",
    optionA: { text: "Straight to the point. Gives you the facts and leaves.", value: "S" },
    optionB: { text: "A bit poetic or dramatic. Uses weird metaphors or random memes to explain things.", value: "N" }
  },
  {
    id: 10,
    text: "How do they pick a new spot or cafe to visit?",
    optionA: { text: "Based on TikTok hype, solid reviews, or because it looks aesthetically pleasing.", value: "S" },
    optionB: { text: "Because the concept/theme is weird and niche, or just pure gut feeling.", value: "N" }
  },

  // --- T/F (Thinking vs Feeling) ---
  {
    id: 11,
    text: "When you text them crying about a bad day, what do they do?",
    optionA: { text: "Gives you a logical 3-step action plan to fix your life.", value: "T" },
    optionB: { text: "Validates your feelings: 'That's so toxic, I'm so sorry, I'm here for you.'", value: "F" }
  },
  {
    id: 12,
    text: "How do they act during an argument or awkward tension?",
    optionA: { text: "Turns into a lawyer. Tries to logically prove why things went wrong.", value: "T" },
    optionB: { text: "Gets super emotional, cries, or shuts down because they hate conflict.", value: "F" }
  },
  {
    id: 13,
    text: "When they compliment someone, what do they usually praise?",
    optionA: { text: "Their competence, intelligence, or how good they are at their job.", value: "T" },
    optionB: { text: "Their vibe, kindness, or how supportive they are as a friend.", value: "F" }
  },
  {
    id: 14,
    text: "How do they make decisions in a group setting?",
    optionA: { text: "Focuses on efficiency, cost, and what makes the most logical sense.", value: "T" },
    optionB: { text: "Focuses on making sure everyone is happy and included.", value: "F" }
  },
  {
    id: 15,
    text: "What gives them the 'ick' the fastest?",
    optionA: { text: "Incompetence, stupidity, or seeing someone fail at a basic task.", value: "T" },
    optionB: { text: "Being mean to waiters, lacking empathy, or being morally corrupt.", value: "F" }
  },

  // --- J/P (Judging vs Perceiving) ---
  {
    id: 16,
    text: "How do they plan trips or dates?",
    optionA: { text: "Needs an itinerary. 'Meet at 10:00, lunch is booked for 12:30.'", value: "J" },
    optionB: { text: "Vibes only. 'Let's just meet at the station and figure it out!'", value: "P" }
  },
  {
    id: 17,
    text: "How do they handle their messages and notifications?",
    optionA: { text: "Replies fast. Hates having unread notifications or leaving things hanging.", value: "J" },
    optionB: { text: "Leaves you on read for 3 business days and then replies like nothing happened.", value: "P" }
  },
  {
    id: 18,
    text: "How are they with being on time?",
    optionA: { text: "Always 5 minutes early. Gets genuinely annoyed if you are late.", value: "J" },
    optionB: { text: "Chronically late. Running 15 minutes behind is their default state.", value: "P" }
  },
  {
    id: 19,
    text: "What does their room or bag look like?",
    optionA: { text: "Organized. Everything has a specific place.", value: "J" },
    optionB: { text: "An absolute disaster zone. They claim it's 'organized chaos'.", value: "P" }
  },
  {
    id: 20,
    text: "How do they handle deadlines or assignments?",
    optionA: { text: "Starts early and finishes ahead of time. Procrastination gives them anxiety.", value: "J" },
    optionB: { text: "Does it 3 hours before the deadline fueled by Red Bull and pure panic.", value: "P" }
  }
];
