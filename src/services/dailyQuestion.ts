import { arrayUnion, doc, onSnapshot, runTransaction, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { toMillis, todayKey } from "@/firebase/firestore";
import { pickNextQuestion } from "@/data/questions";
import type { Round } from "@/types";

function todayRef(coupleId: string) {
  return doc(db, "couples", coupleId, "dailyQuestions", todayKey());
}

/** Creates today's question if it doesn't exist yet — safe to call every time the Home
 * screen mounts, since it no-ops once today's doc is already there. */
export async function ensureTodayQuestion(coupleId: string) {
  const dailyRef = todayRef(coupleId);
  const coupleRef = doc(db, "couples", coupleId);

  await runTransaction(db, async (tx) => {
    const dailySnap = await tx.get(dailyRef);
    if (dailySnap.exists()) return;

    const coupleSnap = await tx.get(coupleRef);
    const playedQuestionIds: string[] = coupleSnap.data()?.playedQuestionIds ?? [];
    const question = pickNextQuestion(playedQuestionIds);

    tx.set(dailyRef, {
      questionId: question.id,
      type: question.type,
      category: question.category,
      text: question.text,
      options: question.options ?? null,
      answers: {},
      createdAt: serverTimestamp(),
    });
    tx.update(coupleRef, { playedQuestionIds: arrayUnion(question.id) });
  });
}

export function subscribeToTodayQuestion(coupleId: string, callback: (round: Round | null) => void) {
  return onSnapshot(todayRef(coupleId), (snap) => {
    const data = snap.data();
    if (!data) {
      callback(null);
      return;
    }
    callback({
      id: snap.id,
      questionId: data.questionId,
      type: data.type,
      category: data.category,
      text: data.text,
      options: data.options ?? undefined,
      answers: data.answers ?? {},
      createdAt: toMillis(data.createdAt),
    });
  });
}

export async function submitDailyAnswer(coupleId: string, uid: string, answer: string) {
  await setDoc(todayRef(coupleId), { answers: { [uid]: answer } }, { merge: true });
}
