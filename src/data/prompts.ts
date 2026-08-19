export const DAILY_PROMPTS: string[] = [
  "What made you smile today?",
  "What's one thing you're grateful for about us right now?",
  "If we could teleport anywhere for dinner tonight, where would we go?",
  "What's a small thing I did recently that you appreciated?",
  "What song reminds you of us?",
  "What's your favorite memory from this year together?",
  "What's something new you'd like us to try together?",
  "How are you really feeling today, on a scale of 1-10?",
  "What's a habit of mine you secretly love?",
  "What's one goal you're working on right now?",
  "What's your favorite way for us to spend a lazy Sunday?",
  "What's something you're looking forward to?",
  "What's a food you want us to cook together this week?",
  "What's a place you'd love for us to visit someday?",
  "What's something I do that always makes you laugh?",
  "What's on your mind right now?",
  "What's a compliment you'd give me today?",
  "What was the best part of your day so far?",
  "What's something you learned recently?",
  "If today had a theme song, what would it be?",
  "What's a tiny thing that would make tomorrow better?",
  "What's your love language today — words, touch, time, gifts, or acts?",
  "What's something you're proud of yourself for this week?",
  "What's a childhood memory you haven't told me about yet?",
  "What's one thing you want more of in our relationship?",
  "What's a movie or show we should watch together soon?",
  "What's something that stressed you out today, if anything?",
  "What's your favorite thing about how we handle disagreements?",
  "What's a random fact about you I might not know?",
  "What's something you want to celebrate this week?",
];

export function promptForDate(date = new Date()): string {
  const dayNumber = Math.floor(date.getTime() / 86_400_000);
  const index = ((dayNumber % DAILY_PROMPTS.length) + DAILY_PROMPTS.length) % DAILY_PROMPTS.length;
  return DAILY_PROMPTS[index];
}
