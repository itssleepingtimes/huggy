export type UserProfile = {
  uid: string;
  name: string;
  photoURL: string | null;
  coupleId: string | null;
  expoPushToken: string | null;
  createdAt: number;
};

export type Couple = {
  id: string;
  memberIds: string[];
  inviteCode: string | null; // shown to the creator until their partner joins
  anniversaryDate: string | null; // ISO date, e.g. "2024-02-14"
  createdAt: number;
  streak: {
    count: number;
    lastOpenedDates: Record<string, string>; // uid -> "YYYY-MM-DD"
    lastCompletedDate: string | null; // last date both partners had opened the app
  };
  playedQuestionIds: string[]; // bundled Question ids already played, so rounds don't repeat until exhausted
};

export type Moment = {
  id: string;
  uid: string;
  text: string;
  createdAt: number;
};

export type QuestionType = "prompt" | "this-or-that" | "rating" | "quiz" | "dare";

export type Question = {
  id: string;
  type: QuestionType;
  category: string;
  text: string;
  options?: string[]; // "this-or-that": exactly 2 options; "quiz": multiple options
};

export type Round = {
  id: string;
  questionId: string;
  type: QuestionType;
  category: string;
  text: string;
  options?: string[];
  answers: Record<string, string>; // uid -> answer (option text, rating "1"-"10", "done", or free text)
  createdAt: number;
  sessionId?: string; // groups rounds played together in one mode session
};

export type PlayModeId =
  | "quick"
  | "rate-us"
  | "would-you-rather"
  | "deep-talk"
  | "quiz-us"
  | "truth-or-dare"
  | "never-have-i-ever"
  | "compatibility-quiz";

export type PlayMode = {
  id: PlayModeId;
  title: string;
  emoji: string;
  description: string;
  categories: string[] | null; // null = mixed, any category (quick mode)
  length: number | null; // null = unlimited (quick mode)
  scored?: boolean; // true = ends with a compatibility score instead of a plain completion screen
};

export type GamePointer = {
  currentRoundId: string | null;
  mode: PlayModeId | null;
  sessionIndex: number; // 1-based position within the current mode session
  sessionTotal: number | null; // null = unlimited
  sessionId: string | null;
};

export type CompatibilityResult = {
  id: string;
  score: number; // 0-100
  matched: number;
  total: number;
  createdAt: number;
};

export type Poke = {
  id: string;
  fromUid: string;
  createdAt: number;
};
