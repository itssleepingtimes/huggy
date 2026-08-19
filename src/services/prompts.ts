import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { promptForDate } from "@/data/prompts";
import type { DailyPrompt } from "@/types";

function todayDocRef(coupleId: string) {
  const today = new Date().toISOString().slice(0, 10);
  return doc(db, "couples", coupleId, "dailyPrompts", today);
}

export function subscribeToTodayPrompt(
  coupleId: string,
  callback: (prompt: DailyPrompt) => void
) {
  const ref = todayDocRef(coupleId);
  const date = ref.id;
  return onSnapshot(ref, (snap) => {
    const data = snap.data();
    callback({
      date,
      promptText: data?.promptText ?? promptForDate(),
      answers: data?.answers ?? {},
    });
  });
}

export async function submitPromptAnswer(coupleId: string, uid: string, answer: string) {
  const ref = todayDocRef(coupleId);
  await setDoc(
    ref,
    { promptText: promptForDate(), answers: { [uid]: answer.trim() } },
    { merge: true }
  );
}
