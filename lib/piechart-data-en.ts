// PieChart Format Presets (English - 10 presets)

import { PieChartPreset } from "./piechart-data";

export const PIECHART_PRESETS_EN: PieChartPreset[] = [
  {
    id: "pie_en_brain_contents",
    title: "🧠 MBTI Brain Contents",
    tiktokCaption: "Inside the brain of each MBTI type 🧠\nIs your brain like this?\n\nFull analysis → Search 'CognitiveLens' 🔍\n\n#MBTI #16personalities #brain #piechart #relatable #mbtirelatable",
    inputProps: {
      theme: "Inside the Brain of MBTI Types 🧠",
      charts: [
        { mbtiType: "INTP", slices: [{ label: "Random Trivia", percentage: 40 }, { label: "Existential Dread", percentage: 30 }, { label: "Where is my phone", percentage: 20 }, { label: "Actual Work", percentage: 10 }] },
        { mbtiType: "ENFP", slices: [{ label: "New Hobby Ideas", percentage: 40 }, { label: "Daydreaming", percentage: 30 }, { label: "Song Lyrics", percentage: 20 }, { label: "Where did I put my keys", percentage: 10 }] },
        { mbtiType: "ISTJ", slices: [{ label: "To-Do List", percentage: 50 }, { label: "Rules & Procedures", percentage: 25 }, { label: "Annoyance at inefficiency", percentage: 15 }, { label: "Lunch plans", percentage: 10 }] },
        { mbtiType: "ESFP", slices: [{ label: "Vibes", percentage: 40 }, { label: "Outfit Ideas", percentage: 30 }, { label: "Who to text next", percentage: 20 }, { label: "Future consequences (Ignored)", percentage: 10 }] },
        { mbtiType: "INFJ", slices: [{ label: "Psychoanalyzing Friends", percentage: 40 }, { label: "Saving the World", percentage: 30 }, { label: "Social Exhaustion", percentage: 20 }, { label: "What to have for dinner", percentage: 10 }] },
        { mbtiType: "ESTP", slices: [{ label: "Adrenaline", percentage: 40 }, { label: "Living in the moment", percentage: 30 }, { label: "How to win", percentage: 20 }, { label: "Boredom avoidance", percentage: 10 }] },
        { mbtiType: "ISFJ", slices: [{ label: "Worrying about others", percentage: 40 }, { label: "Nostalgic memories", percentage: 30 }, { label: "Chores to do", percentage: 20 }, { label: "Self-care (Maybe tomorrow)", percentage: 10 }] },
      ],
    },
  },
  {
    id: "pie_en_before_date",
    title: "🧠 Brain Before a First Date",
    tiktokCaption: "MBTI brain contents before a first date 💕🧠\nAre you anxious or ready?\n\nSearch 'CognitiveLens' for your analysis 🔍\n\n#MBTI #16personalities #firstdate #dating #brain #relatable #mbtirelatable",
    inputProps: {
      theme: "Inside the Brain Before a First Date 💕🧠",
      charts: [
        { mbtiType: "INTJ", slices: [{ label: "Conversation Strategy", percentage: 40 }, { label: "Risk Assessment", percentage: 30 }, { label: "Exit Plan", percentage: 20 }, { label: "Actual Excitement", percentage: 10 }] },
        { mbtiType: "ESFP", slices: [{ label: "Outfit Choices", percentage: 50 }, { label: "Hype Energy", percentage: 30 }, { label: "Selfie angles", percentage: 15 }, { label: "Their name again?", percentage: 5 }] },
        { mbtiType: "INFP", slices: [{ label: "Romantic Scenarios", percentage: 40 }, { label: "What if they hate me", percentage: 30 }, { label: "Overanalyzing their text", percentage: 20 }, { label: "Wedding planning", percentage: 10 }] },
        { mbtiType: "ENTJ", slices: [{ label: "Evaluating their ROI", percentage: 40 }, { label: "Interview questions", percentage: 30 }, { label: "Time management", percentage: 20 }, { label: "Looking good", percentage: 10 }] },
        { mbtiType: "ISFJ", slices: [{ label: "Did I pick a good place", percentage: 40 }, { label: "Worrying about awkward silence", percentage: 30 }, { label: "Breath check", percentage: 20 }, { label: "Hope they like me", percentage: 10 }] },
        { mbtiType: "ESTP", slices: [{ label: "Confidence", percentage: 60 }, { label: "Charm strategy", percentage: 20 }, { label: "Where to go after", percentage: 15 }, { label: "Anxiety", percentage: 5 }] },
        { mbtiType: "INTP", slices: [{ label: "Why did I agree to this", percentage: 50 }, { label: "Mental escape route", percentage: 25 }, { label: "Fact-checking topics", percentage: 15 }, { label: "Do I look normal", percentage: 10 }] },
      ],
    },
  },
  {
    id: "pie_en_monday_morning",
    title: "🧠 Monday Morning Brain",
    tiktokCaption: "Monday morning brain by MBTI type is so tragic 😩🧠\nWho else wants to stay in bed?\n\nSearch 'CognitiveLens' for your analysis 🔍\n\n#MBTI #16personalities #monday #brain #relatable #mbtirelatable #work",
    inputProps: {
      theme: "Monday Morning Brain by MBTI 😩🧠",
      charts: [
        { mbtiType: "INFP", slices: [{ label: "Don't want to get up", percentage: 50 }, { label: "Existential crisis", percentage: 30 }, { label: "Wishing it was Friday", percentage: 15 }, { label: "Getting ready", percentage: 5 }] },
        { mbtiType: "ENTJ", slices: [{ label: "Weekly Goals", percentage: 40 }, { label: "Email Inbox Attack", percentage: 30 }, { label: "Caffeine requirement", percentage: 20 }, { label: "Crushing the competition", percentage: 10 }] },
        { mbtiType: "ISFP", slices: [{ label: "5 more minutes", percentage: 60 }, { label: "What to wear", percentage: 20 }, { label: "Dread", percentage: 15 }, { label: "Acceptance", percentage: 5 }] },
        { mbtiType: "ISTJ", slices: [{ label: "Schedule review", percentage: 40 }, { label: "Commute optimization", percentage: 30 }, { label: "Coffee", percentage: 20 }, { label: "Duty calls", percentage: 10 }] },
        { mbtiType: "ENFP", slices: [{ label: "Chaos", percentage: 40 }, { label: "Where are my keys", percentage: 30 }, { label: "Late panic", percentage: 20 }, { label: "Optimism", percentage: 10 }] },
        { mbtiType: "INTP", slices: [{ label: "Calculating minimum effort needed", percentage: 40 }, { label: "Mental fog", percentage: 30 }, { label: "Why do we have a 5 day work week", percentage: 20 }, { label: "Coffee", percentage: 10 }] },
        { mbtiType: "ESFJ", slices: [{ label: "Greeting everyone", percentage: 40 }, { label: "Weekend gossip catchup", percentage: 30 }, { label: "To-do list", percentage: 20 }, { label: "Coffee", percentage: 10 }] },
      ],
    },
  },
  {
    id: "pie_en_during_exam",
    title: "🧠 Brain During an Exam",
    tiktokCaption: "Brain during an exam by MBTI is chaotic 📝🧠\nWho's guessing everything?\n\nSearch 'CognitiveLens' for your analysis 🔍\n\n#MBTI #16personalities #exam #student #brain #relatable #mbtirelatable",
    inputProps: {
      theme: "Brain During an Exam by MBTI 📝🧠",
      charts: [
        { mbtiType: "ESFP", slices: [{ label: "Guessing (C looks good)", percentage: 40 }, { label: "Staring at the wall", percentage: 30 }, { label: "What to eat after", percentage: 20 }, { label: "Actual knowledge", percentage: 10 }] },
        { mbtiType: "INTJ", slices: [{ label: "Systematic elimination", percentage: 40 }, { label: "Spotting trick questions", percentage: 30 }, { label: "Judging the professor's wording", percentage: 20 }, { label: "Double checking", percentage: 10 }] },
        { mbtiType: "INFP", slices: [{ label: "Blanking out", percentage: 40 }, { label: "Daydreaming", percentage: 30 }, { label: "Panic", percentage: 20 }, { label: "Remembering one fact", percentage: 10 }] },
        { mbtiType: "ESTJ", slices: [{ label: "Recalling facts", percentage: 50 }, { label: "Time management", percentage: 30 }, { label: "Confidence", percentage: 15 }, { label: "Moving to next question", percentage: 5 }] },
        { mbtiType: "INTP", slices: [{ label: "Overthinking question 1", percentage: 40 }, { label: "Arguing with the premise", percentage: 30 }, { label: "Rush at the end", percentage: 20 }, { label: "Actually knowing it", percentage: 10 }] },
        { mbtiType: "ENFJ", slices: [{ label: "Trying to remember the lecture", percentage: 40 }, { label: "Worrying about grade", percentage: 30 }, { label: "Looking around the room", percentage: 20 }, { label: "Trusting intuition", percentage: 10 }] },
        { mbtiType: "ISTP", slices: [{ label: "Process of elimination", percentage: 40 }, { label: "Logic", percentage: 30 }, { label: "I want to leave", percentage: 20 }, { label: "Done in 10 minutes", percentage: 10 }] },
      ],
    },
  },
  {
    id: "pie_en_pay_day",
    title: "🧠 Brain on Payday",
    tiktokCaption: "Brain on payday by MBTI type is too real 💰🧠\nSpend or save?\n\nSearch 'CognitiveLens' for your analysis 🔍\n\n#MBTI #16personalities #payday #money #brain #relatable #mbtirelatable",
    inputProps: {
      theme: "Brain on Payday by MBTI 💰🧠",
      charts: [
        { mbtiType: "ESFP", slices: [{ label: "TREAT MYSELF", percentage: 60 }, { label: "Dinner plans", percentage: 20 }, { label: "Online shopping cart", percentage: 15 }, { label: "Savings (Oops)", percentage: 5 }] },
        { mbtiType: "ISTJ", slices: [{ label: "Transfer to Savings", percentage: 50 }, { label: "Pay Bills", percentage: 30 }, { label: "Groceries", percentage: 15 }, { label: "Small Treat", percentage: 5 }] },
        { mbtiType: "ENFP", slices: [{ label: "Buy things I don't need", percentage: 40 }, { label: "Gifts for friends", percentage: 30 }, { label: "Impulse trip", percentage: 20 }, { label: "Rent (Hopefully enough)", percentage: 10 }] },
        { mbtiType: "INTJ", slices: [{ label: "Index Funds", percentage: 40 }, { label: "Budget allocation", percentage: 30 }, { label: "Emergency Fund", percentage: 20 }, { label: "Books", percentage: 10 }] },
        { mbtiType: "ISFJ", slices: [{ label: "Pay Bills", percentage: 40 }, { label: "Savings", percentage: 30 }, { label: "Buy something for family", percentage: 20 }, { label: "Guilt about spending", percentage: 10 }] },
        { mbtiType: "ESTP", slices: [{ label: "Drinks are on me!", percentage: 40 }, { label: "New shoes", percentage: 30 }, { label: "Living large", percentage: 20 }, { label: "Savings (What's that)", percentage: 10 }] },
        { mbtiType: "INTP", slices: [{ label: "New tech gadget", percentage: 40 }, { label: "Food delivery budget", percentage: 30 }, { label: "Forget I got paid", percentage: 20 }, { label: "Auto-pay handles bills", percentage: 10 }] },
      ],
    },
  },
  {
    id: "pie_en_crush_nearby",
    title: "🧠 Brain When Your Crush is Nearby",
    tiktokCaption: "Brain when your crush is nearby by MBTI 💕🧠\nSmooth or awkward?\n\nSearch 'CognitiveLens' for your analysis 🔍\n\n#MBTI #16personalities #crush #dating #brain #relatable #mbtirelatable",
    inputProps: {
      theme: "Brain When Crush is Nearby 💕🧠",
      charts: [
        { mbtiType: "INFP", slices: [{ label: "Internal Panic", percentage: 40 }, { label: "Don't look at them", percentage: 30 }, { label: "Imagining our future", percentage: 20 }, { label: "Act natural (Fails)", percentage: 10 }] },
        { mbtiType: "ESTP", slices: [{ label: "Time to show off", percentage: 40 }, { label: "Eye contact", percentage: 30 }, { label: "Smooth talk strategy", percentage: 20 }, { label: "Confidence", percentage: 10 }] },
        { mbtiType: "INTP", slices: [{ label: "Calculate distance", percentage: 40 }, { label: "Analyze their microexpressions", percentage: 30 }, { label: "Forget how to breathe", percentage: 20 }, { label: "Avoid interaction", percentage: 10 }] },
        { mbtiType: "ESFJ", slices: [{ label: "Smile brightly", percentage: 40 }, { label: "Find excuse to talk", percentage: 30 }, { label: "Make sure hair looks good", percentage: 20 }, { label: "Butterflies", percentage: 10 }] },
        { mbtiType: "INTJ", slices: [{ label: "Observation mode", percentage: 40 }, { label: "Data collection", percentage: 30 }, { label: "Strategic positioning", percentage: 20 }, { label: "Conceal emotions", percentage: 10 }] },
        { mbtiType: "ENFP", slices: [{ label: "Over-talk out of nerves", percentage: 40 }, { label: "Make a joke", percentage: 30 }, { label: "Heart racing", percentage: 20 }, { label: "Stare too long", percentage: 10 }] },
        { mbtiType: "ISTJ", slices: [{ label: "Focus on task at hand", percentage: 40 }, { label: "Ignore feelings", percentage: 30 }, { label: "Stiff posture", percentage: 20 }, { label: "Slight blush", percentage: 10 }] },
      ],
    },
  },
  {
    id: "pie_en_hangover",
    title: "🧠 Brain During a Hangover",
    tiktokCaption: "Brain during a hangover by MBTI type is so real 🍺😵\nWho's never drinking again?\n\nSearch 'CognitiveLens' for your analysis 🔍\n\n#MBTI #16personalities #hangover #brain #relatable #mbtirelatable #party",
    inputProps: {
      theme: "Brain During a Hangover by MBTI 🍺😵",
      charts: [
        { mbtiType: "ESFP", slices: [{ label: "I'm never drinking again", percentage: 40 }, { label: "What did I do last night", percentage: 30 }, { label: "Need greasy food", percentage: 20 }, { label: "Let's drink tonight too", percentage: 10 }] },
        { mbtiType: "ISTJ", slices: [{ label: "Regret", percentage: 50 }, { label: "Hydration protocol", percentage: 30 }, { label: "Calculation of money wasted", percentage: 15 }, { label: "Headache", percentage: 5 }] },
        { mbtiType: "ENFP", slices: [{ label: "Checking sent texts in panic", percentage: 40 }, { label: "Who did I talk to", percentage: 30 }, { label: "Nausea", percentage: 20 }, { label: "Craving pizza", percentage: 10 }] },
        { mbtiType: "INTJ", slices: [{ label: "Analyzing the biological poison", percentage: 40 }, { label: "Inefficiency anger", percentage: 30 }, { label: "Silence required", percentage: 20 }, { label: "Water", percentage: 10 }] },
        { mbtiType: "ISFJ", slices: [{ label: "Did I embarrass myself", percentage: 40 }, { label: "Checking on friends", percentage: 30 }, { label: "Pain", percentage: 20 }, { label: "Sleep", percentage: 10 }] },
        { mbtiType: "ESTP", slices: [{ label: "Hair of the dog", percentage: 40 }, { label: "That was epic", percentage: 30 }, { label: "Where are my keys", percentage: 20 }, { label: "Food", percentage: 10 }] },
        { mbtiType: "INFP", slices: [{ label: "Moral hangover", percentage: 40 }, { label: "Why am I like this", percentage: 30 }, { label: "Hiding in blanket", percentage: 20 }, { label: "Water", percentage: 10 }] },
      ],
    },
  },
  {
    id: "pie_en_home_alone",
    title: "🧠 First Day Living Alone",
    tiktokCaption: "First day living alone brain by MBTI 🏠🧠\nFreedom vs Homesick\n\nSearch 'CognitiveLens' for your analysis 🔍\n\n#MBTI #16personalities #livingalone #brain #relatable #mbtirelatable",
    inputProps: {
      theme: "First Day Living Alone Brain 🏠🧠",
      charts: [
        { mbtiType: "ENFP", slices: [{ label: "FREEDOM!!!", percentage: 40 }, { label: "Decorating ideas", percentage: 30 }, { label: "Dance party in underwear", percentage: 20 }, { label: "Wait, how do I cook", percentage: 10 }] },
        { mbtiType: "ISFJ", slices: [{ label: "Homesick already", percentage: 40 }, { label: "Is the door locked?", percentage: 30 }, { label: "Cleaning everything", percentage: 20 }, { label: "Calling Mom", percentage: 10 }] },
        { mbtiType: "INTJ", slices: [{ label: "Total Control", percentage: 40 }, { label: "Peace and quiet", percentage: 30 }, { label: "Organizing systems", percentage: 20 }, { label: "Finally.", percentage: 10 }] },
        { mbtiType: "ESFP", slices: [{ label: "When's the housewarming party", percentage: 40 }, { label: "Selfies in the mirror", percentage: 30 }, { label: "Ordering takeout", percentage: 20 }, { label: "I'm an adult now", percentage: 10 }] },
        { mbtiType: "INTP", slices: [{ label: "I can stay up until 4am", percentage: 40 }, { label: "No pants policy", percentage: 30 }, { label: "Cereal for dinner", percentage: 20 }, { label: "Silence is nice", percentage: 10 }] },
        { mbtiType: "ESTJ", slices: [{ label: "Unpacking schedule", percentage: 40 }, { label: "Budget planning", percentage: 30 }, { label: "Rule setting", percentage: 20 }, { label: "Grocery list", percentage: 10 }] },
        { mbtiType: "INFP", slices: [{ label: "My safe haven", percentage: 40 }, { label: "Aesthetic vibes", percentage: 30 }, { label: "A little lonely", percentage: 20 }, { label: "Listening to music out loud", percentage: 10 }] },
      ],
    },
  },
  {
    id: "pie_en_job_interview",
    title: "🧠 Brain During a Job Interview",
    tiktokCaption: "Brain during a job interview by MBTI 👔🧠\nWho's interviewing the interviewer?\n\nSearch 'CognitiveLens' for your analysis 🔍\n\n#MBTI #16personalities #jobinterview #career #brain #relatable #mbtirelatable",
    inputProps: {
      theme: "Brain During a Job Interview 👔🧠",
      charts: [
        { mbtiType: "INFP", slices: [{ label: "Please like me", percentage: 40 }, { label: "Did I sound stupid?", percentage: 30 }, { label: "Sweating", percentage: 20 }, { label: "Fake smiling", percentage: 10 }] },
        { mbtiType: "ENTJ", slices: [{ label: "I'm interviewing YOU", percentage: 40 }, { label: "Highlighting achievements", percentage: 30 }, { label: "Negotiation strategy", percentage: 20 }, { label: "Total Confidence", percentage: 10 }] },
        { mbtiType: "ESFJ", slices: [{ label: "Building rapport", percentage: 40 }, { label: "Reading the room", percentage: 30 }, { label: "Nodding enthusiastically", percentage: 20 }, { label: "Hoping they're nice", percentage: 10 }] },
        { mbtiType: "INTP", slices: [{ label: "Overanalyzing the question", percentage: 40 }, { label: "Trying to sound normal", percentage: 30 }, { label: "Correcting their logic (internally)", percentage: 20 }, { label: "Eye contact timer", percentage: 10 }] },
        { mbtiType: "ESTP", slices: [{ label: "Charisma overdrive", percentage: 40 }, { label: "Thinking on my feet", percentage: 30 }, { label: "Reading their reactions", percentage: 20 }, { label: "I got this", percentage: 10 }] },
        { mbtiType: "ISTJ", slices: [{ label: "Reciting prepared answers", percentage: 40 }, { label: "Professional posture", percentage: 30 }, { label: "Fact-based responses", percentage: 20 }, { label: "Mental checklist", percentage: 10 }] },
        { mbtiType: "ENFP", slices: [{ label: "Rambling", percentage: 40 }, { label: "Showing passion", percentage: 30 }, { label: "Did I go off topic?", percentage: 20 }, { label: "Hoping we click", percentage: 10 }] },
      ],
    },
  },
  {
    id: "pie_en_sns_posting",
    title: "🧠 Brain When Posting on SNS",
    tiktokCaption: "Brain when posting on social media by MBTI 📱🧠\nOverthinker vs Instant Poster\n\nSearch 'CognitiveLens' for your analysis 🔍\n\n#MBTI #16personalities #socialmedia #brain #relatable #mbtirelatable",
    inputProps: {
      theme: "Brain When Posting on Social Media 📱🧠",
      charts: [
        { mbtiType: "INFJ", slices: [{ label: "Is this too revealing?", percentage: 40 }, { label: "Checking typos 5 times", percentage: 30 }, { label: "Will this offend anyone", percentage: 20 }, { label: "Drafts it and deletes it", percentage: 10 }] },
        { mbtiType: "ESTP", slices: [{ label: "Post it instantly", percentage: 60 }, { label: "Looks cool", percentage: 20 }, { label: "Flexing", percentage: 15 }, { label: "Checking likes", percentage: 5 }] },
        { mbtiType: "INFP", slices: [{ label: "Aesthetic check", percentage: 40 }, { label: "Meaningful caption anxiety", percentage: 30 }, { label: "Vulnerability hangover", percentage: 20 }, { label: "Waiting for that ONE person's like", percentage: 10 }] },
        { mbtiType: "ENTJ", slices: [{ label: "Personal branding", percentage: 40 }, { label: "Engagement optimization", percentage: 30 }, { label: "Strategic timing", percentage: 20 }, { label: "Networking value", percentage: 10 }] },
        { mbtiType: "ESFJ", slices: [{ label: "Tagging everyone", percentage: 40 }, { label: "Making sure everyone looks good", percentage: 30 }, { label: "Emojis!!!", percentage: 20 }, { label: "Replying to comments", percentage: 10 }] },
        { mbtiType: "INTP", slices: [{ label: "Why am I posting this", percentage: 40 }, { label: "Sharing a niche meme", percentage: 30 }, { label: "Does anyone care?", percentage: 20 }, { label: "Irony", percentage: 10 }] },
        { mbtiType: "ISFP", slices: [{ label: "Visual perfection", percentage: 40 }, { label: "Vibe check", percentage: 30 }, { label: "No caption just emojis", percentage: 20 }, { label: "Artistic expression", percentage: 10 }] },
      ],
    },
  },
];
