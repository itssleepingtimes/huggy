import { arrayUnion, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { toMillis } from "@/firebase/firestore";
import { pickNextQuestion } from "@/data/questions";
import type { Round } from "@/types";

function currentRoundRef(coupleId: string) {
  return doc(db, "couples", coupleId, "game", "current");
}

export function subscribeToCurrentRound(coupleId: string, callback: (round: Round | null) => void) {
  return onSnapshot(currentRoundRef(coupleId), (snap) => {
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
      options: data.options,
      answers: data.answers ?? {},
      createdAt: toMillis(data.createdAt),
    });
  });
}

export async function startNewRound(coupleId: string, playedQuestionIds: string[]) {
  const question = pickNextQuestion(playedQuestionIds);
  await setDoc(currentRoundRef(coupleId), {
    questionId: question.id,
    type: question.type,
    category: question.category,
    text: question.text,
    options: question.options ?? null,
    answers: {},
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, "couples", coupleId), {
    playedQuestionIds: arrayUnion(question.id),
  });
}

export async function submitRoundAnswer(coupleId: string, uid: string, answer: string) {
  await setDoc(currentRoundRef(coupleId), { answers: { [uid]: answer } }, { merge: true });
}
