import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { toMillis } from "@/firebase/firestore";
import { getPlayMode, pickNextQuestion } from "@/data/questions";
import type { CompatibilityResult, GamePointer, PlayModeId, Round } from "@/types";

function pointerRef(coupleId: string) {
  return doc(db, "couples", coupleId, "game", "pointer");
}

function roundsCollection(coupleId: string) {
  return collection(db, "couples", coupleId, "rounds");
}

function compatibilityCollection(coupleId: string) {
  return collection(db, "couples", coupleId, "compatibilityResults");
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
    sessionId: data.sessionId ?? undefined,
  };
}

async function createRound(coupleId: string, sessionId: string, playedQuestionIds: string[], categories: string[] | null) {
  const question = pickNextQuestion(playedQuestionIds, categories);
  const roundRef = doc(roundsCollection(coupleId));
  await setDoc(roundRef, {
    questionId: question.id,
    type: question.type,
    category: question.category,
    text: question.text,
    options: question.options ?? null,
    answers: {},
    createdAt: serverTimestamp(),
    sessionId,
  });
  await updateDoc(doc(db, "couples", coupleId), {
    playedQuestionIds: arrayUnion(question.id),
  });
  return roundRef.id;
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
      sessionId: data.sessionId ?? null,
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
  const sessionId = doc(roundsCollection(coupleId)).id;
  const roundId = await createRound(coupleId, sessionId, playedQuestionIds, mode.categories);

  await setDoc(pointerRef(coupleId), {
    currentRoundId: roundId,
    mode: modeId,
    sessionIndex: 1,
    sessionTotal: mode.length,
    sessionId,
  });
}

/** Advances within the current mode session — picks the next question of the same category, or
 * marks the session finished once past its length (quick mode never finishes). */
export async function advanceSession(coupleId: string, playedQuestionIds: string[], pointer: GamePointer) {
  if (!pointer.mode || !pointer.sessionId) return;
  const mode = getPlayMode(pointer.mode);
  const nextIndex = pointer.sessionIndex + 1;

  if (mode.length && nextIndex > mode.length) {
    await setDoc(pointerRef(coupleId), {
      currentRoundId: null,
      mode: pointer.mode,
      sessionIndex: mode.length,
      sessionTotal: mode.length,
      sessionId: pointer.sessionId,
    });
    return;
  }

  const roundId = await createRound(coupleId, pointer.sessionId, playedQuestionIds, mode.categories);
  await setDoc(pointerRef(coupleId), {
    currentRoundId: roundId,
    mode: pointer.mode,
    sessionIndex: nextIndex,
    sessionTotal: mode.length,
    sessionId: pointer.sessionId,
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
    sessionId: null,
  });
}

export function subscribeToHistory(coupleId: string, callback: (rounds: Round[]) => void) {
  const q = query(roundsCollection(coupleId), orderBy("createdAt", "desc"), limit(100));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => parseRound(d.id, d.data())));
  });
}

/** One-off fetch of every round played within a single session — used to score a finished
 * Compatibility Quiz once all its rounds are answered. */
export async function getSessionRounds(coupleId: string, sessionId: string): Promise<Round[]> {
  const q = query(roundsCollection(coupleId), where("sessionId", "==", sessionId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => parseRound(d.id, d.data()));
}

export async function saveCompatibilityResult(
  coupleId: string,
  result: { score: number; matched: number; total: number }
) {
  await addDoc(compatibilityCollection(coupleId), {
    ...result,
    createdAt: serverTimestamp(),
  });
}

export function subscribeToLatestCompatibilityResult(
  coupleId: string,
  callback: (result: CompatibilityResult | null) => void
) {
  const q = query(compatibilityCollection(coupleId), orderBy("createdAt", "desc"), limit(1));
  return onSnapshot(q, (snap) => {
    const d = snap.docs[0];
    if (!d) {
      callback(null);
      return;
    }
    const data = d.data();
    callback({
      id: d.id,
      score: data.score,
      matched: data.matched,
      total: data.total,
      createdAt: toMillis(data.createdAt),
    });
  });
}
