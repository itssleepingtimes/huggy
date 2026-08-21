import {
  arrayUnion,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { toMillis } from "@/firebase/firestore";
import { getPlayMode, pickNextQuestion } from "@/data/questions";
import type { GamePointer, PlayModeId, Round } from "@/types";

function pointerRef(coupleId: string) {
  return doc(db, "couples", coupleId, "game", "pointer");
}

function roundsCollection(coupleId: string) {
  return collection(db, "couples", coupleId, "rounds");
}

function parseRound(id: string, data: any): Round {
  return {
    id,
    questionId: data.questionId,
    type: data.type,
    category: data.category,
    text: data.text,
    options: data.options ?? undefined,
    answers: data.answers ?? {},
    createdAt: toMillis(data.createdAt),
  };
}

/** Subscribes to the pointer doc that tracks the active round + mode session. */
export function subscribeToPointer(coupleId: string, callback: (pointer: GamePointer | null) => void) {
  return onSnapshot(pointerRef(coupleId), (snap) => {
    const data = snap.data();
    if (!data) {
      callback(null);
      return;
    }
    callback({
      currentRoundId: data.currentRoundId ?? null,
      mode: data.mode ?? null,
      sessionIndex: data.sessionIndex ?? 1,
      sessionTotal: data.sessionTotal ?? null,
    });
  });
}

export function subscribeToRound(
  coupleId: string,
  roundId: string,
  callback: (round: Round | null) => void
) {
  return onSnapshot(doc(roundsCollection(coupleId), roundId), (snap) => {
    const data = snap.data();
    callback(data ? parseRound(snap.id, data) : null);
  });
}

/** Starts a fresh mode session at question 1. */
export async function startSession(coupleId: string, playedQuestionIds: string[], modeId: PlayModeId) {
  const mode = getPlayMode(modeId);
  const question = pickNextQuestion(playedQuestionIds, mode.questionType);
  const roundRef = doc(roundsCollection(coupleId));

  await setDoc(roundRef, {
    questionId: question.id,
    type: question.type,
    category: question.category,
    text: question.text,
    options: question.options ?? null,
    answers: {},
    createdAt: serverTimestamp(),
  });
  await setDoc(pointerRef(coupleId), {
    currentRoundId: roundRef.id,
    mode: modeId,
    sessionIndex: 1,
    sessionTotal: mode.length,
  });
  await updateDoc(doc(db, "couples", coupleId), {
    playedQuestionIds: arrayUnion(question.id),
  });
}

/** Advances within the current mode session — picks the next question of the same type, or
 * marks the session finished once past its length (quick mode never finishes). */
export async function advanceSession(coupleId: string, playedQuestionIds: string[], pointer: GamePointer) {
  if (!pointer.mode) return;
  const mode = getPlayMode(pointer.mode);
  const nextIndex = pointer.sessionIndex + 1;

  if (mode.length && nextIndex > mode.length) {
    await setDoc(pointerRef(coupleId), {
      currentRoundId: null,
      mode: pointer.mode,
      sessionIndex: mode.length,
      sessionTotal: mode.length,
    });
    return;
  }

  const question = pickNextQuestion(playedQuestionIds, mode.questionType);
  const roundRef = doc(roundsCollection(coupleId));
  await setDoc(roundRef, {
    questionId: question.id,
    type: question.type,
    category: question.category,
    text: question.text,
    options: question.options ?? null,
    answers: {},
    createdAt: serverTimestamp(),
  });
  await setDoc(pointerRef(coupleId), {
    currentRoundId: roundRef.id,
    mode: pointer.mode,
    sessionIndex: nextIndex,
    sessionTotal: mode.length,
  });
  await updateDoc(doc(db, "couples", coupleId), {
    playedQuestionIds: arrayUnion(question.id),
  });
}

export async function submitRoundAnswer(coupleId: string, roundId: string, uid: string, answer: string) {
  await setDoc(doc(roundsCollection(coupleId), roundId), { answers: { [uid]: answer } }, { merge: true });
}

/** Clears the pointer entirely, returning both partners to the mode-selection screen. */
export async function exitSession(coupleId: string) {
  await setDoc(pointerRef(coupleId), {
    currentRoundId: null,
    mode: null,
    sessionIndex: 1,
    sessionTotal: null,
  });
}

export function subscribeToHistory(coupleId: string, callback: (rounds: Round[]) => void) {
  const q = query(roundsCollection(coupleId), orderBy("createdAt", "desc"), limit(100));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => parseRound(d.id, d.data())));
  });
}
