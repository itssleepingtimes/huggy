import type { PlayMode, PlayModeId, Question, QuestionType } from "@/types";

export const QUESTIONS: Question[] = [
  // ---- Deep Talk (open text) ----
  { id: "prompt-001", type: "prompt", category: "Deep Talk", text: "What made you smile today?" },
  { id: "prompt-002", type: "prompt", category: "Deep Talk", text: "What's one thing you're grateful for about us right now?" },
  { id: "prompt-003", type: "prompt", category: "Deep Talk", text: "What's a small thing I did recently that you appreciated?" },
  { id: "prompt-004", type: "prompt", category: "Deep Talk", text: "What song reminds you of us?" },
  { id: "prompt-005", type: "prompt", category: "Deep Talk", text: "What's your favorite memory from this year together?" },
  { id: "prompt-006", type: "prompt", category: "Deep Talk", text: "What's something new you'd like us to try together?" },
  { id: "prompt-007", type: "prompt", category: "Deep Talk", text: "How are you really feeling today?" },
  { id: "prompt-008", type: "prompt", category: "Deep Talk", text: "What's a habit of mine you secretly love?" },
  { id: "prompt-009", type: "prompt", category: "Deep Talk", text: "What's a compliment you'd give me right now?" },
  { id: "prompt-010", type: "prompt", category: "Deep Talk", text: "What's something you learned about yourself recently?" },
  { id: "prompt-011", type: "prompt", category: "Deep Talk", text: "What's one thing you want more of in our relationship?" },
  { id: "prompt-012", type: "prompt", category: "Deep Talk", text: "What's your favorite thing about how we handle disagreements?" },
  { id: "prompt-013", type: "prompt", category: "Deep Talk", text: "What's a random fact about you I might not know?" },
  { id: "prompt-014", type: "prompt", category: "Deep Talk", text: "What's something you're proud of yourself for this week?" },
  { id: "prompt-015", type: "prompt", category: "Deep Talk", text: "What's a childhood memory you haven't told me about yet?" },
  { id: "prompt-016", type: "prompt", category: "Deep Talk", text: "What's something that stressed you out today, if anything?" },
  { id: "prompt-017", type: "prompt", category: "Deep Talk", text: "What's your love language today — words, touch, time, gifts, or acts?" },
  { id: "prompt-018", type: "prompt", category: "Deep Talk", text: "What's a tiny thing that would make tomorrow better?" },
  { id: "prompt-019", type: "prompt", category: "Deep Talk", text: "What's something I do that always makes you laugh?" },
  { id: "prompt-020", type: "prompt", category: "Deep Talk", text: "What's on your mind right now?" },
  { id: "prompt-021", type: "prompt", category: "Deep Talk", text: "What's something you want to celebrate this week?" },
  { id: "prompt-022", type: "prompt", category: "Deep Talk", text: "If today had a theme song, what would it be?" },
  { id: "prompt-023", type: "prompt", category: "Deep Talk", text: "What's the best part of your day so far?" },
  { id: "prompt-024", type: "prompt", category: "Deep Talk", text: "What's a fear you don't talk about much?" },
  { id: "prompt-025", type: "prompt", category: "Deep Talk", text: "What does feeling loved look like to you this week?" },

  // ---- Future & Dreams (open text) ----
  { id: "future-001", type: "prompt", category: "Future & Dreams", text: "What's a place you'd love for us to visit someday?" },
  { id: "future-002", type: "prompt", category: "Future & Dreams", text: "What's a goal you're working on right now?" },
  { id: "future-003", type: "prompt", category: "Future & Dreams", text: "What does our perfect ordinary Sunday look like?" },
  { id: "future-004", type: "prompt", category: "Future & Dreams", text: "What's something you want to learn together?" },
  { id: "future-005", type: "prompt", category: "Future & Dreams", text: "Where do you picture us in five years?" },
  { id: "future-006", type: "prompt", category: "Future & Dreams", text: "What's a tradition you'd like us to start?" },
  { id: "future-007", type: "prompt", category: "Future & Dreams", text: "What's a big dream you haven't said out loud yet?" },
  { id: "future-008", type: "prompt", category: "Future & Dreams", text: "What's one thing on your bucket list you want to do with me?" },
  { id: "future-009", type: "prompt", category: "Future & Dreams", text: "If we could teleport anywhere for dinner tonight, where would we go?" },
  { id: "future-010", type: "prompt", category: "Future & Dreams", text: "What's a skill you'd love for us to pick up together?" },
  { id: "future-011", type: "prompt", category: "Future & Dreams", text: "What does 'home' mean to you?" },
  { id: "future-012", type: "prompt", category: "Future & Dreams", text: "What's a small adventure we could have this month?" },
  { id: "future-013", type: "prompt", category: "Future & Dreams", text: "What's a movie or show we should watch together soon?" },
  { id: "future-014", type: "prompt", category: "Future & Dreams", text: "What's a food you want us to cook together this week?" },
  { id: "future-015", type: "prompt", category: "Future & Dreams", text: "What's something you're looking forward to?" },

  // ---- This or That ----
  { id: "tot-001", type: "this-or-that", category: "This or That", text: "Morning person or night owl?", options: ["Morning person", "Night owl"] },
  { id: "tot-002", type: "this-or-that", category: "This or That", text: "Beach vacation or mountain cabin?", options: ["Beach", "Mountains"] },
  { id: "tot-003", type: "this-or-that", category: "This or That", text: "Movie night in or dinner out?", options: ["Movie night in", "Dinner out"] },
  { id: "tot-004", type: "this-or-that", category: "This or That", text: "Sweet or savory breakfast?", options: ["Sweet", "Savory"] },
  { id: "tot-005", type: "this-or-that", category: "This or That", text: "Big party or small hangout?", options: ["Big party", "Small hangout"] },
  { id: "tot-006", type: "this-or-that", category: "This or That", text: "Plan every detail or wing it?", options: ["Plan it", "Wing it"] },
  { id: "tot-007", type: "this-or-that", category: "This or That", text: "Texting or calling?", options: ["Texting", "Calling"] },
  { id: "tot-008", type: "this-or-that", category: "This or That", text: "Coffee or tea?", options: ["Coffee", "Tea"] },
  { id: "tot-009", type: "this-or-that", category: "This or That", text: "Save it or spend it?", options: ["Save it", "Spend it"] },
  { id: "tot-010", type: "this-or-that", category: "This or That", text: "Early to bed or up late?", options: ["Early to bed", "Up late"] },
  { id: "tot-011", type: "this-or-that", category: "This or That", text: "Window seat or aisle seat?", options: ["Window", "Aisle"] },
  { id: "tot-012", type: "this-or-that", category: "This or That", text: "Cook at home or order takeout?", options: ["Cook", "Takeout"] },
  { id: "tot-013", type: "this-or-that", category: "This or That", text: "Rewatch a favorite or try something new?", options: ["Rewatch", "Something new"] },
  { id: "tot-014", type: "this-or-that", category: "This or That", text: "City trip or nature trip?", options: ["City", "Nature"] },
  { id: "tot-015", type: "this-or-that", category: "This or That", text: "Dogs or cats?", options: ["Dogs", "Cats"] },
  { id: "tot-016", type: "this-or-that", category: "This or That", text: "Hold hands or arm around shoulder?", options: ["Hold hands", "Arm around shoulder"] },
  { id: "tot-017", type: "this-or-that", category: "This or That", text: "Silly jokes or deep conversations?", options: ["Silly jokes", "Deep conversations"] },
  { id: "tot-018", type: "this-or-that", category: "This or That", text: "Surprise gifts or planned gifts?", options: ["Surprise", "Planned"] },
  { id: "tot-019", type: "this-or-that", category: "This or That", text: "Karaoke or board games?", options: ["Karaoke", "Board games"] },
  { id: "tot-020", type: "this-or-that", category: "This or That", text: "Spicy food or mild food?", options: ["Spicy", "Mild"] },
  { id: "tot-021", type: "this-or-that", category: "This or That", text: "Air conditioning on or off at night?", options: ["On", "Off"] },
  { id: "tot-022", type: "this-or-that", category: "This or That", text: "Road trip or flight?", options: ["Road trip", "Flight"] },
  { id: "tot-023", type: "this-or-that", category: "This or That", text: "Slow mornings or productive mornings?", options: ["Slow", "Productive"] },
  { id: "tot-024", type: "this-or-that", category: "This or That", text: "Give advice or just listen?", options: ["Give advice", "Just listen"] },
  { id: "tot-025", type: "this-or-that", category: "This or That", text: "Handwritten note or voice message?", options: ["Handwritten note", "Voice message"] },

  // ---- Rate It (1-10) ----
  { id: "rating-001", type: "rating", category: "Rate It", text: "How's your energy level right now?" },
  { id: "rating-002", type: "rating", category: "Rate It", text: "How stressed are you feeling today?" },
  { id: "rating-003", type: "rating", category: "Rate It", text: "How excited are you for this weekend?" },
  { id: "rating-004", type: "rating", category: "Rate It", text: "How much do you miss me right now?" },
  { id: "rating-005", type: "rating", category: "Rate It", text: "How well did you sleep last night?" },
  { id: "rating-006", type: "rating", category: "Rate It", text: "How productive was your day?" },
  { id: "rating-007", type: "rating", category: "Rate It", text: "How much do you want takeout tonight?" },
  { id: "rating-008", type: "rating", category: "Rate It", text: "How ready are you for a spontaneous trip?" },
  { id: "rating-009", type: "rating", category: "Rate It", text: "How hungry are you right now?" },
  { id: "rating-010", type: "rating", category: "Rate It", text: "How much patience do you have left today?" },
  { id: "rating-011", type: "rating", category: "Rate It", text: "How good was your last meal?" },
  { id: "rating-012", type: "rating", category: "Rate It", text: "How much are you looking forward to seeing me?" },
  { id: "rating-013", type: "rating", category: "Rate It", text: "How chaotic has today felt?" },
  { id: "rating-014", type: "rating", category: "Rate It", text: "How confident are you feeling this week?" },
  { id: "rating-015", type: "rating", category: "Rate It", text: "How much do you want a hug right now?" },
  { id: "rating-016", type: "rating", category: "Rate It", text: "How good is your mood today?" },
  { id: "rating-017", type: "rating", category: "Rate It", text: "How motivated are you feeling?" },
  { id: "rating-018", type: "rating", category: "Rate It", text: "How much did you think about me today?" },
  { id: "rating-019", type: "rating", category: "Rate It", text: "How relaxed do you feel right now?" },
  { id: "rating-020", type: "rating", category: "Rate It", text: "How ready are you to fall asleep tonight?" },

  // ---- Quiz: About Us ----
  { id: "quiz-001", type: "quiz", category: "About Us", text: "What's my go-to comfort food?", options: ["Something sweet", "Something salty", "Noodles", "I honestly don't know"] },
  { id: "quiz-002", type: "quiz", category: "About Us", text: "What's my ideal way to spend a free evening?", options: ["Out with friends", "Cozy at home", "Doing a hobby", "Sleeping early"] },
  { id: "quiz-003", type: "quiz", category: "About Us", text: "What stresses me out the most?", options: ["Deadlines", "Being late", "Conflict", "Uncertainty"] },
  { id: "quiz-004", type: "quiz", category: "About Us", text: "What's my favorite way to be shown love?", options: ["Words of affirmation", "Physical touch", "Quality time", "Acts of service", "Gifts"] },
  { id: "quiz-005", type: "quiz", category: "About Us", text: "What's my dream vacation spot right now?", options: ["Beach", "Mountains", "A big city", "Somewhere new entirely"] },
  { id: "quiz-006", type: "quiz", category: "About Us", text: "What would I pick as a superpower?", options: ["Flying", "Reading minds", "Time travel", "Teleportation"] },
  { id: "quiz-007", type: "quiz", category: "About Us", text: "What's my biggest pet peeve?", options: ["Being interrupted", "Messiness", "Lateness", "Loud chewing"] },
  { id: "quiz-008", type: "quiz", category: "About Us", text: "How do I like my eggs?", options: ["Scrambled", "Fried", "Boiled", "I don't really eat eggs"] },
  { id: "quiz-009", type: "quiz", category: "About Us", text: "What's the first thing I do when I wake up?", options: ["Check my phone", "Stretch", "Make coffee/tea", "Go back to sleep for 5 more minutes"] },
  { id: "quiz-010", type: "quiz", category: "About Us", text: "What kind of movies do I actually enjoy most?", options: ["Comedy", "Action", "Romance", "Horror", "Documentary"] },
  { id: "quiz-011", type: "quiz", category: "About Us", text: "What would I do with a totally free weekend?", options: ["Travel somewhere", "Stay in and rest", "See friends", "Work on a project"] },
  { id: "quiz-012", type: "quiz", category: "About Us", text: "What's my most-used emoji?", options: ["😂", "❤️", "👍", "😭"] },
  { id: "quiz-013", type: "quiz", category: "About Us", text: "What do I actually want when I say 'I'm fine'?", options: ["To be asked again", "Space", "A hug", "Distraction"] },
  { id: "quiz-014", type: "quiz", category: "About Us", text: "What's my favorite season?", options: ["Spring", "Summer", "Fall", "Winter"] },
  { id: "quiz-015", type: "quiz", category: "About Us", text: "What would I never order at a restaurant?", options: ["Anything too spicy", "Seafood", "Something too weird/exotic", "I'll try almost anything"] },
  { id: "quiz-016", type: "quiz", category: "About Us", text: "What's my go-to karaoke song?", options: ["A ballad", "Something upbeat", "I refuse to do karaoke", "Whatever's on the screen"] },
  { id: "quiz-017", type: "quiz", category: "About Us", text: "How do I handle being wrong?", options: ["Admit it quickly", "Need a minute first", "Get defensive at first", "Depends on my mood"] },
  { id: "quiz-018", type: "quiz", category: "About Us", text: "What's my ideal date night?", options: ["Fancy dinner", "Casual and low-key", "An activity/adventure", "Staying in together"] },
  { id: "quiz-019", type: "quiz", category: "About Us", text: "What would I want as a gift right now?", options: ["Something practical", "Something sentimental", "Experience over object", "Surprise me"] },
  { id: "quiz-020", type: "quiz", category: "About Us", text: "What's the one chore I dislike the most?", options: ["Dishes", "Laundry", "Cleaning the bathroom", "Taking out trash"] },

  // ---- Fun & Random ----
  { id: "fun-001", type: "prompt", category: "Fun & Random", text: "If we were a duo in a heist movie, what would our roles be?" },
  { id: "fun-002", type: "prompt", category: "Fun & Random", text: "What's the most ridiculous thing you'd do for me?" },
  { id: "fun-003", type: "prompt", category: "Fun & Random", text: "What's a weird talent you have?" },
  { id: "fun-004", type: "prompt", category: "Fun & Random", text: "If we started a business together, what would it be?" },
  { id: "fun-005", type: "prompt", category: "Fun & Random", text: "What nickname should I secretly call you?" },
  { id: "fun-006", type: "this-or-that", category: "Fun & Random", text: "Fight one horse-sized duck or a hundred duck-sized horses?", options: ["One horse-sized duck", "A hundred duck-sized horses"] },
  { id: "fun-007", type: "this-or-that", category: "Fun & Random", text: "Read minds or be invisible?", options: ["Read minds", "Be invisible"] },
  { id: "fun-008", type: "prompt", category: "Fun & Random", text: "What's the last thing that made you laugh out loud?" },
  { id: "fun-009", type: "prompt", category: "Fun & Random", text: "If our relationship were a movie genre, what would it be?" },
  { id: "fun-010", type: "this-or-that", category: "Fun & Random", text: "Explore an abandoned mansion or a hidden cave?", options: ["Abandoned mansion", "Hidden cave"] },
  { id: "fun-011", type: "prompt", category: "Fun & Random", text: "What's a food combo you love that sounds gross to others?" },
  { id: "fun-012", type: "prompt", category: "Fun & Random", text: "If you had to describe me in three words, what would they be?" },
  { id: "fun-013", type: "this-or-that", category: "Fun & Random", text: "Be able to talk to animals or speak every human language?", options: ["Talk to animals", "Speak every language"] },
  { id: "fun-014", type: "prompt", category: "Fun & Random", text: "What's the most useless skill you're proud of?" },
  { id: "fun-015", type: "prompt", category: "Fun & Random", text: "What's a trend you just don't get?" },
  { id: "fun-016", type: "this-or-that", category: "Fun & Random", text: "Live without music or live without movies?", options: ["Without music", "Without movies"] },
  { id: "fun-017", type: "prompt", category: "Fun & Random", text: "What would your villain origin story be?" },
  { id: "fun-018", type: "prompt", category: "Fun & Random", text: "What's the weirdest dream you've had recently?" },
  { id: "fun-019", type: "this-or-that", category: "Fun & Random", text: "Only whisper or only shout for a day?", options: ["Only whisper", "Only shout"] },
  { id: "fun-020", type: "prompt", category: "Fun & Random", text: "If we had a theme park, what would the main ride be?" },

  // ---- More This or That (for Would You Rather mode) ----
  { id: "tot-026", type: "this-or-that", category: "This or That", text: "Live without hot showers or without AC?", options: ["No hot showers", "No AC"] },
  { id: "tot-027", type: "this-or-that", category: "This or That", text: "Text throughout the day or one long catch-up call?", options: ["Text all day", "One long call"] },
  { id: "tot-028", type: "this-or-that", category: "This or That", text: "Be famous or be rich?", options: ["Famous", "Rich"] },
  { id: "tot-029", type: "this-or-that", category: "This or That", text: "Always know when someone's lying or always get away with lying?", options: ["Know when lied to", "Get away with lying"] },
  { id: "tot-030", type: "this-or-that", category: "This or That", text: "Relive your favorite day forever or never repeat a day?", options: ["Relive favorite day", "Never repeat a day"] },
  { id: "tot-031", type: "this-or-that", category: "This or That", text: "Lose your phone or lose your wallet?", options: ["Lose phone", "Lose wallet"] },
  { id: "tot-032", type: "this-or-that", category: "This or That", text: "Have unlimited time or unlimited money?", options: ["Unlimited time", "Unlimited money"] },
  { id: "tot-033", type: "this-or-that", category: "This or That", text: "One best friend forever or a big rotating friend group?", options: ["One best friend", "Big friend group"] },
  { id: "tot-034", type: "this-or-that", category: "This or That", text: "Live in a tiny house debt-free or a mansion with a mortgage?", options: ["Tiny house, debt-free", "Mansion, mortgage"] },
  { id: "tot-035", type: "this-or-that", category: "This or That", text: "Give up sweets or give up salty snacks?", options: ["No sweets", "No salty snacks"] },
  { id: "tot-036", type: "this-or-that", category: "This or That", text: "Know exactly how your story ends or be surprised?", options: ["Know the ending", "Be surprised"] },
  { id: "tot-037", type: "this-or-that", category: "This or That", text: "Always be 10 minutes late or always 20 minutes early?", options: ["Always late", "Always early"] },
  { id: "tot-038", type: "this-or-that", category: "This or That", text: "Redo your favorite trip or take a brand new one?", options: ["Redo favorite trip", "Take a new one"] },
  { id: "tot-039", type: "this-or-that", category: "This or That", text: "Fight in front of others or never fight but bottle it up?", options: ["Fight openly", "Bottle it up"] },
  { id: "tot-040", type: "this-or-that", category: "This or That", text: "Live near family or live far with more independence?", options: ["Near family", "Far, independent"] },
  { id: "tot-041", type: "this-or-that", category: "This or That", text: "Wake up as the opposite gender for a day or as an animal?", options: ["Opposite gender", "An animal"] },
  { id: "tot-042", type: "this-or-that", category: "This or That", text: "Never use social media again or never watch another movie?", options: ["No social media", "No movies"] },
  { id: "tot-043", type: "this-or-that", category: "This or That", text: "Be able to skip bad days or replay good ones?", options: ["Skip bad days", "Replay good ones"] },
  { id: "tot-044", type: "this-or-that", category: "This or That", text: "Have a pet dragon or a pet unicorn?", options: ["Pet dragon", "Pet unicorn"] },
  { id: "tot-045", type: "this-or-that", category: "This or That", text: "Only eat one cuisine forever or never repeat a cuisine?", options: ["One cuisine forever", "Never repeat"] },

  // ---- More Rate It (for Rate Us mode) ----
  { id: "rating-021", type: "rating", category: "Rate It", text: "How connected do you feel to me right now?" },
  { id: "rating-022", type: "rating", category: "Rate It", text: "How much do you trust things are going well between us?" },
  { id: "rating-023", type: "rating", category: "Rate It", text: "How good are we at communicating lately?" },
  { id: "rating-024", type: "rating", category: "Rate It", text: "How much fun have we had together this week?" },
  { id: "rating-025", type: "rating", category: "Rate It", text: "How well do you feel understood by me?" },
  { id: "rating-026", type: "rating", category: "Rate It", text: "How much are you looking forward to our next date?" },
  { id: "rating-027", type: "rating", category: "Rate It", text: "How romantic has this week been?" },
  { id: "rating-028", type: "rating", category: "Rate It", text: "How well are we splitting effort at home lately?" },
  { id: "rating-029", type: "rating", category: "Rate It", text: "How adventurous are you feeling this month?" },
  { id: "rating-030", type: "rating", category: "Rate It", text: "How much do you want a weekend getaway right now?" },
  { id: "rating-031", type: "rating", category: "Rate It", text: "How affectionate have we been this week?" },
  { id: "rating-032", type: "rating", category: "Rate It", text: "How proud are you of us as a couple right now?" },
  { id: "rating-033", type: "rating", category: "Rate It", text: "How much do you want to try something new together soon?" },
  { id: "rating-034", type: "rating", category: "Rate It", text: "How supported do you feel in what you're working on right now?" },
  { id: "rating-035", type: "rating", category: "Rate It", text: "How good was our last conversation?" },

  // ---- More About Us quiz (for Quiz Us mode) ----
  { id: "quiz-021", type: "quiz", category: "About Us", text: "What's my love language, really?", options: ["Words of affirmation", "Physical touch", "Quality time", "Acts of service", "Gifts"] },
  { id: "quiz-022", type: "quiz", category: "About Us", text: "What would I choose for our anniversary dinner?", options: ["Somewhere fancy", "Our favorite regular spot", "Cook at home", "Order in and relax"] },
  { id: "quiz-023", type: "quiz", category: "About Us", text: "What's the first thing I'd save in a fire (after you)?", options: ["My phone", "Photos", "A specific keepsake", "I'd just grab you and go"] },
  { id: "quiz-024", type: "quiz", category: "About Us", text: "How do I prefer to apologize?", options: ["Say it directly", "Do something thoughtful", "Give it time then talk", "Write it down"] },
  { id: "quiz-025", type: "quiz", category: "About Us", text: "What's my dream pet (if we could have any)?", options: ["Dog", "Cat", "Something exotic", "No pets, thanks"] },
  { id: "quiz-026", type: "quiz", category: "About Us", text: "What do I actually think about mornings?", options: ["Love them", "Tolerate them", "Hate them", "Depends on sleep"] },
  { id: "quiz-027", type: "quiz", category: "About Us", text: "What's my ideal way to relax after a hard day?", options: ["Talk it out", "Quiet alone time", "Physical comfort/cuddles", "Distraction — a show or game"] },
  { id: "quiz-028", type: "quiz", category: "About Us", text: "What would surprise me most as a gift?", options: ["Tickets to an event", "Something handmade", "A weekend trip", "Time, not stuff"] },
  { id: "quiz-029", type: "quiz", category: "About Us", text: "What's a habit of mine you'd never actually want me to change?", options: ["How I plan things", "How I joke around", "How affectionate I am", "How I take care of you"] },
  { id: "quiz-030", type: "quiz", category: "About Us", text: "What's my honest take on grand gestures?", options: ["Love them", "A little much for me", "Prefer small consistent things", "Depends on the occasion"] },
];

const QUESTIONS_BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]));

export function getQuestionById(id: string): Question | undefined {
  return QUESTIONS_BY_ID.get(id);
}

/** Picks a random question (optionally restricted to one type) the couple hasn't played yet,
 * reshuffling within that pool once it's exhausted. */
export function pickNextQuestion(
  playedQuestionIds: string[],
  type?: QuestionType | null
): Question {
  const bank = type ? QUESTIONS.filter((q) => q.type === type) : QUESTIONS;
  const playedSet = new Set(playedQuestionIds);
  const remaining = bank.filter((q) => !playedSet.has(q.id));
  const pool = remaining.length > 0 ? remaining : bank;
  return pool[Math.floor(Math.random() * pool.length)];
}

export const PLAY_MODES: PlayMode[] = [
  {
    id: "quick",
    title: "Quick Mix",
    emoji: "🎲",
    description: "A little bit of everything — endless, no set length.",
    questionType: null,
    length: null,
  },
  {
    id: "rate-us",
    title: "Rate Us",
    emoji: "⭐",
    description: "5 quick rating questions about how you're both feeling.",
    questionType: "rating",
    length: 5,
  },
  {
    id: "would-you-rather",
    title: "Would You Rather",
    emoji: "🤔",
    description: "5 rounds of this-or-that, from cozy to chaotic.",
    questionType: "this-or-that",
    length: 5,
  },
  {
    id: "quiz-us",
    title: "Quiz Us",
    emoji: "🧠",
    description: "5 questions to see how well you know each other.",
    questionType: "quiz",
    length: 5,
  },
  {
    id: "deep-talk",
    title: "Deep Talk",
    emoji: "💭",
    description: "5 open questions for a slower, more thoughtful conversation.",
    questionType: "prompt",
    length: 5,
  },
];

export function getPlayMode(id: PlayModeId): PlayMode {
  const mode = PLAY_MODES.find((m) => m.id === id);
  if (!mode) throw new Error(`Unknown play mode: ${id}`);
  return mode;
}
