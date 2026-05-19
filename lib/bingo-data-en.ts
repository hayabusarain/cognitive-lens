export type MBTIType = "INTJ" | "INTP" | "ENTJ" | "ENTP" | "INFJ" | "INFP" | "ENFJ" | "ENFP" | "ISTJ" | "ISFJ" | "ESTJ" | "ESFJ" | "ISTP" | "ISFP" | "ESTP" | "ESFP";

export const BINGO_DATA_EN: Record<MBTIType, string[]> = {
  "INTJ": [
    "Permanent resting bitch face", "Small talk is pure torture", "Saying 'makes sense' (it doesn't)", "Overthinking social interactions forever", "Fundamentally distrusts humanity",
    "Pissed when plans change", "Allergic to emotional logic", "My rules are absolute", "Fake smiling hurts physically", "Aggressively efficient",
    "'What's the point of that?'", "Weekend means 0% human contact", "Give up when misunderstood", "Speaks 2x speed about hyperfixations", "Dies inside if plan fails",
    "Texts like an automated bot", "Ignores unexpected phone calls", "Secretly a hopeless romantic", "Sudden urge to ghost everyone", "My catchphrase is 'whatever'",
    "Pretends not to care", "Takes years to open up", "Incompetence is triggering", "I am always right"
  ],
  "INTP": [
    "Yapping internally 24/7", "'Eh, whatever'", "Takes 3 business days to shower", "100+ browser tabs open", "Instantly forgets boring stuff",
    "Sudden 'Oh, I get it!' at 3am", "NPC responses to small talk", "Explaining is too much work", "Walking encyclopedia of useless facts", "Nocturnal by default",
    "'Probably' / 'idk tho'", "Sudden existential dread", "Forgot to text back (for weeks)", "Random weird objects in room", "Crowds drain HP to 0",
    "Urge to destroy them with facts", "Personal bizarre philosophy", "Emotions are a confusing bug", "'Sounds like too much effort'", "Weirdly specific obsessions",
    "Random unprompted nerd rants", "Can do it (but won't)", "Perfectly fine dying alone", "Logic over feelings"
  ],
  "ENTJ": [
    "'Get to the point'", "Accidental dictator", "Allergic to wasted time", "Becomes leader by default", "'Fine, I'll do it myself'",
    "Dies without a goal", "Pathologically competitive", "Cannot show weakness", "Strict to you, stricter to me", "Cornering people with logic",
    "'That's highly inefficient'", "Works even when told to rest", "Only talks about the grind", "Secretly likes surprises", "If you can complain, you can work",
    "Always planning the next step", "'I could do that better'", "Immune to emotional manipulation", "Aggressive perfectionist", "Unjustified god complex",
    "Sucks at asking for help", "Decides way too fast", "Rare but massive brain farts", "Obsessed with the future"
  ],
  "ENTP": [
    "'Devil's advocate here'", "Gets bored in 5 seconds", "Arguing just to argue", "Debating is my love language", "'Oh, that sounds fun!'",
    "Rules are just suggestions", "Clutches at the absolute last second", "Professional yapper", "Unexplainable rizz", "Random chaotic ideas at 2am",
    "'It'll work itself out'", "Reads the room, deliberately ruins it", "Accidental superiority complex", "Can never finish one project", "Genius or idiot (no in-between)",
    "Stepping on people's triggers", "When serious, scares people", "Multitasks until burnout", "New hyperfixation every day", "'Idk tho' is my safety net",
    "Hates losing an argument", "Runs on pure chaos", "Secretly highly sensitive", "If it's not fun, I'm out"
  ],
  "INFJ": [
    "Always told 'you overthink'", "Absorbs everyone's trauma", "Frequent urge to ghost everyone", "Sudden crippling loneliness", "Who is the 'real me'?",
    "Never drops the full truth", "Scarily accurate intuition", "Group small talk makes me sick", "Impossible ideals", "Messiah complex",
    "'I'm fine' (crying inside)", "Requires 48h isolation to recharge", "Disappears without warning", "Deep talks or no talks", "Secretly stubborn af",
    "Sees right through your bs", "Actually wishes for world peace", "Brutally hard on myself", "Self-destructive perfectionist", "Forgets how to speak",
    "My 'just a feeling' is always right", "Burns out helping others", "Closes the door on you forever", "Wants to be understood, but hides"
  ],
  "INFP": [
    "Professional daydreamer", "'I'm useless haha'", "Delusions going strong", "Would rather lose than fight", "Obsessed with 'aesthetic/vibes'",
    "Motivation nowhere to be found", "Self-esteem buffering...", "Random bursts of manic energy", "Cares too much about opinions", "Reality vs My head = Pain",
    "Types a text, deletes it all", "An entire universe in my head", "Says 'sorry' to inanimate objects", "Alone time is sacred", "Attracted to tragic/artsy things",
    "Random urge to cry", "Stubborn about the weirdest things", "Kept alive by my hyperfixations", "Constant state of 'what do I do'", "Empathy burnout",
    "My inner world > Reality", "Time blindness is real", "Too nice for my own good", "Always searching for 'meaning'"
  ],
  "ENFJ": [
    "'Are you okay?' 24/7", "Chronically meddling", "Can't say no if relied on", "Accidentally takes charge", "'Let's do it together!'",
    "Your happiness = my happiness", "Actually gets hurt super easily", "Forces my ideals on you", "My needs come last", "Reads the room too hard",
    "'Need any help with that?'", "Absorbs emotions like a sponge", "Cult leader energy", "Accidental people-pleaser", "Thrives on validation",
    "Midnight self-reflection guilt", "Told I'm 'too intense'", "Will fight for my friends", "Loves planning surprises", "Values a genuine 'thank you'",
    "Bottles it up until explosion", "Aggressive pacifist", "Relationships are everything", "Tries too hard to meet expectations"
  ],
  "ENFP": [
    "'Omg yes!' *does it immediately*", "Hyper-obsessed then bored tomorrow", "Wait, what were you saying?", "Addicted to new shiny things", "'YOLO!'",
    "Befriends the wall", "Zero planning, pure vibes", "Emotional rollercoaster", "Sudden depressive episode", "'It's gonna be fine!'",
    "Loses keys, phone, wallet, mind", "Chaotic golden retriever rizz", "Hates being tied down", "Instant sleep mode if bored", "100 ideas, 0 execution",
    "'I'll do it tomorrow' (lie)", "Gets away with murder via charm", "Actually thinks very deeply", "'I'm bored, entertain me'", "Needs isolation but gets lonely",
    "Can read the room, just ignores it", "Praise me and I'll do anything", "Self-destructs via multitasking", "Vibes > Logic"
  ],
  "ISTJ": [
    "'Rules are meant to be followed'", "Change of plans = instant rage", "Way too serious", "'Let me double check that'", "Stability over adventure",
    "Aggressively loyal", "Takes jokes literally", "'We've never done it this way'", "Refuses to waste money", "Crushing sense of responsibility",
    "'I did exactly what you asked'", "Facts don't care about feelings", "Brain freezes at sudden improv", "Hates people who skip steps", "Slow and steady wins",
    "Weekends are for staying home", "'Isn't this common sense?'", "Aesthetic organization", "Accidentally funny deadpan", "Cares about public image",
    "Risk management is my passion", "Promises are unbreakable contracts", "Secretly wants to rebel", "Routines keep me sane"
  ],
  "ISFJ": [
    "Constantly asking 'You good?'", "Scanning everyone's mood", "Bottles everything up", "The ultimate background carry", "'I'll just do it for you'",
    "Haunted by a mistake from 5 years ago", "A 'thank you' pays my rent", "Routine is my safe space", "Allergic to new environments", "Literally cannot say 'No'",
    "'Hope I'm not bothering them'", "Exhausted from being too considerate", "Peace at all costs", "Predictability > Surprises", "Surprisingly strict to close ones",
    "Terrifyingly accurate memory", "Remembers your exact coffee order", "Says 'Sorry' when someone bumps into them", "Craves stability", "Secretly judges everyone",
    "The shadow boss", "Obeys the rules", "Struggles to voice own opinions", "Can push limits for someone else"
  ],
  "ESTJ": [
    "'Give me the bottom line'", "Optimizing life is a hobby", "Small talk is a waste of breath", "'Why is this so hard for you?'", "Results matter, period.",
    "Rules are absolute", "Cold to emotional excuses", "'I'm taking over'", "Decides in 0.5 seconds", "Incompetence makes me violent",
    "'That makes zero sense'", "Natural boss energy", "Furious when plans derail", "Does not know how to 'chill'", "Blunt force trauma words",
    "Task management is flawless", "Respects tradition", "Fiercely protective of family", "'If we play, we win'", "Zero tolerance for half-assing",
    "Heavy sense of duty", "Never complains, just works", "Micromanages the details", "The end justifies the means"
  ],
  "ESFJ": [
    "'Let's all do it together!'", "Mom friend energy", "Reads the room until it hurts", "'Are you sure you're okay?'", "Vibes are the top priority",
    "Desperate for appreciation", "Respects rules and common sense", "Cares way too much about optics", "'I'll take care of it'", "Secretly loves gossip",
    "Nice to literally everyone", "Highly empathetic", "Cannot stand people being excluded", "Lives for giving surprises", "Runs on 'thank you's",
    "Cannot stand being alone", "Exhausted from accommodating", "Loves a good manual", "'Isn't it normal to do this?'", "Occasional emotional outbursts",
    "Ultimate hospitality", "Hates people who disrupt harmony", "Tries too hard for others", "Empathy over everything"
  ],
  "ISTP": [
    "'Oh. Cool.'", "Moves at my own pace", "Hates being micromanaged", "'Sounds like a lot of work'", "Needs 10 hours of alone time",
    "Disappears randomly", "Weirdly good with my hands", "'Whatever happens, happens'", "Efficiency > Rules", "Scary focus on hyperfixations",
    "Emotional expression = ERROR 404", "'I don't really care'", "Adrenaline junkie", "Run away if tied down", "Speaks in 3-word sentences",
    "Unfazed by chaos", "Secretly a softie", "Doesn't do small talk", "Acts on pure instinct", "'Just let me do my thing'",
    "Very specific aesthetics", "Clutches in a crisis", "Schedules are a scam", "Living in my own dimension"
  ],
  "ISFP": [
    "'Whatever you guys want'", "Avoids conflict like the plague", "Living in the present moment", "'That's such a vibe'", "Ultimate chill mode",
    "Allergic to restriction", "Deeply emotional inside", "'At my own pace'", "Lowkey incredibly stubborn", "Sucker for pretty things",
    "Random bursts of artistic creation", "Rules kill my vibe", "'If I feel like it'", "Will die without alone time", "Chronically indecisive",
    "Absorbs other people's pain", "Crumbles under pressure", "Actions > Words", "'The vibes are off'", "Trusts my own taste",
    "Would rather run than fight", "Loves being natural", "Zero long-term plans", "Follows the gut feeling"
  ],
  "ESTP": [
    "'Let's just do it and see'", "If it's fun, I'm in", "Lives for the thrill", "'That looks insane, let's go'", "Literally cannot sit still",
    "Rules? You mean challenges?", "'We'll figure it out'", "Action first, think later", "Reads the room and breaks it", "Suffocates if restricted",
    "'Yoooo!'", "Details are for nerds", "Obsessed with the new thing", "Thrives in absolute chaos", "Acts on pure impulse",
    "Boredom is my worst enemy", "Knows everyone, trusts few", "'Now or never'", "Smooth talker", "Improv > Planning",
    "Surprisingly logical", "Always the center of attention", "Boredom equals death", "Vibes are everything"
  ],
  "ESFP": [
    "'Woooooo!'", "Just wants to have a good time", "Needs to be around people 24/7", "'That's so sick!'", "Loves the spotlight",
    "Planning is a myth", "'It'll buff out'", "Emotional highs and lows", "Pure momentum", "Gets cocky when praised",
    "'Let's hang out!'", "Always chasing the next trend", "Doesn't sweat the small stuff", "Hates feeling trapped", "Energy levels constantly at 100",
    "Actually very good at reading rooms", "Loves hyping people up", "'Live in the moment'", "Runs away from serious talks", "Charms their way out of anything",
    "Main character syndrome", "Runs on pure instinct", "Terrified of being bored", "Demands a happy ending"
  ]
};
