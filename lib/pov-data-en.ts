export interface POVScript {
  mbti: string;
  title: string;
  texts: string[];
  musicQuery: string;
  caption: string;
}

export const POV_DATA_EN: Record<string, POVScript> = {
  INFP: {
    mbti: "INFP",
    title: "Late Night Unsent Text Loop",
    texts: [
      "typing 'sorry I was asleep'",
      "(no, that sounds too cold) *deletes*",
      "typing 'omg so sorry for the late reply!'",
      "(is this energy weird at 3am?) *deletes again*",
      "after simulating this in my head 50 times,",
      "the window to reply has completely closed.",
      "it's not that I don't care. I care way too much.",
      "I overthink how they'll perceive it until I can't breathe,",
      "and once again, I leave them on delivered.",
      "why do I always isolate myself like this."
    ],
    musicQuery: "Slowed + Reverb / Dark Indie Pop",
    caption: "is anyone else like this every single night? 🙃 the overthinking paralysis is actually ruining my life... drop a 🥲 if u relate."
  },
  ENFP: {
    mbti: "ENFP",
    title: "The Hallway After the Party",
    texts: [
      "'omg today was so fun! bye guys!'\n*waves, closes apartment door*",
      "the moment the door shuts, my facial muscles drop.",
      "it's like someone literally unplugged my power source.",
      "I know exactly how to light up a room for everyone else,",
      "but I have no idea how to fill my own cup.",
      "every time someone says 'you're always so energetic',",
      "I feel like the real me fades a little more into transparency.",
      "who is supposed to recharge me?"
    ],
    musicQuery: "Upbeat but melancholic indie pop (Sped up)",
    caption: "ENFP sudden battery drain is so real 💀 if u get tired of wearing the golden retriever mask watch this 🫠"
  },
  ISTP: {
    mbti: "ISTP",
    title: "Sudden Social Reset",
    texts: [
      "(*screen lights up: 'u free today?'*)",
      "I don't even dislike them. I know it would be fun if I went.",
      "but the second I see that notification from my bed,",
      "every cell in my body screams 'no.'",
      "I hate having my peace disrupted more than anything.",
      "*swipes to clear notification*",
      "sorry, but no one is allowed in my territory right now.",
      "let me just log out of society for the day."
    ],
    musicQuery: "Phonk / Dark trap beat with heavy bass",
    caption: "ISTP social battery hitting 0% out of nowhere 🚪 suddenly everyone is exhausting. anyone else?"
  },
  INFJ: {
    mbti: "INFJ",
    title: "The Door Slam",
    texts: [
      "'ah. I can't do this person anymore.'",
      "it's not anger. it's not sadness. it's just a cold, quiet acceptance.",
      "I gave so many signs.",
      "I swallowed my feelings and forgave you so many times.",
      "but today, with that one sentence,",
      "my internal tolerance card quietly reached its limit.",
      "I'll smile and talk to you normally tomorrow,",
      "but in my universe, you no longer exist.",
      "call it cruel if you want, but if I don't do this, I'll break."
    ],
    musicQuery: "Cinematic / Sad piano solo",
    caption: "INFJ door slam is literally so accurate 🫠 it's not even anger, we just go numb... drop a 💬 if u know the feeling."
  },
  ISFJ: {
    mbti: "ISFJ",
    title: "The People Pleasing Paralysis",
    texts: [
      "'oh, I can do that for you!'",
      "I sigh internally the second those words leave my mouth.",
      "I'm literally exhausted today.",
      "but if me suffering means no one else is upset, I'll just do it.",
      "that's how I've survived my entire life.",
      "hearing 'thank you as always' is supposed to make me happy,",
      "but walking home, I want to cry thinking 'whose messes am I cleaning up with my life?'",
      "just for once, can someone please take the burden from me."
    ],
    musicQuery: "Acoustic guitar / Melancholic indie",
    caption: "saying 'yes' on autopilot is ruining my life 🥲 ISFJs who always end up with the short end of the stick wya..."
  },
  INTJ: {
    mbti: "INTJ",
    title: "The Romance Glitch",
    texts: [
      "human relationships are basically just a calculation of cost and return.",
      "shutting out messy emotions and staying alone is objectively the most efficient.",
      "so why is one stupid text from you",
      "taking up 90% of my brain's processing power?",
      "my flawless internal system",
      "has been infected by a fatal bug named after you.",
      "how do I even begin to debug this irrational error?"
    ],
    musicQuery: "Dark ambient instrumental / Cyberpunk vibes",
    caption: "INTJ brain completely short-circuiting when they catch feelings 💀 who else's system crashes like this?"
  },
  ENTP: {
    mbti: "ENTP",
    title: "The Winner's Void",
    texts: [
      "pointed out their contradictions. completely destroyed their argument.",
      "seeing them speechless gave me a definite rush of superiority.",
      "yet, walking home alone...",
      "why does this massive void always hit me?",
      "every time I stab someone with the knife of 'pure logic',",
      "a part of me despairs, thinking 'ah, nobody understood the real me again.'",
      "when all I actually wanted",
      "was someone who could see past my annoying debates and just laugh at me."
    ],
    musicQuery: "Alternative rock / Grunge (Slowed)",
    caption: "winning every argument but feeling empty inside 🙃 ENTPs just looking for someone who gets it... drop a 💬"
  },
  ISFP: {
    mbti: "ISFP",
    title: "Too High Resolution",
    texts: [
      "I'm pretty good at reading the room.",
      "choosing my words, faking a smile so no one gets hurt.",
      "but the truth is, I see way too much.",
      "the slight shift in someone's gaze, the tiny change in their tone of voice.",
      "because I see the world in 4K resolution,",
      "people's hidden malice and lies stab me like shards of glass every single day.",
      "I just pretend to feel nothing,",
      "so nobody notices my heart is already bleeding out."
    ],
    musicQuery: "Chill Lo-Fi / Nighttime beach vibes",
    caption: "seeing through everyone's fake energy is so exhausting 🫠 ISFPs who feel too much for this world..."
  },
  INTP: {
    mbti: "INTP",
    title: "Galactic Dissociation",
    texts: [
      "when someone is right in front of me getting super emotional and angry.",
      "my brain has completely escaped to another dimension.",
      "'human emotions are literally just a hormonal imbalance bug.'",
      "'well, the earth is gonna be swallowed by the sun in 5 billion years anyway.'",
      "if I don't shift my perspective to a galactic scale,",
      "I can't handle the raw friction of human feelings.",
      "'are you even listening?!' they yell. I nod with a straight face.",
      "sorry, my mind is currently somewhere in the Andromeda galaxy."
    ],
    musicQuery: "Chiptune / Glitchy electronica",
    caption: "dissociating when people get too emotional is a default state 🤖 human feelings are too complicated fr."
  },
  ENFJ: {
    mbti: "ENFJ",
    title: "The Savior's Unsaved Night",
    texts: [
      "that suffocating silence in the group chat when no one replies.",
      "I literally can't stand it,",
      "so I forced myself to send an upbeat follow-up text again.",
      "I create a safe space for everyone else.",
      "'but wait, where is my safe space?'",
      "I can only prove my worth by being needed by someone.",
      "this curse-like kindness is honestly what's killing me the most."
    ],
    musicQuery: "Cinematic strings / Epic but dark soundtrack",
    caption: "ENFJs literally dying inside while trying to save everyone else 😭 where is my safe space..."
  }
};
