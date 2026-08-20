import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I ambiguity

function randomCode(length = 6): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

/** Creates a new couple with `uid` as its first member and returns a shareable invite code. */
export async function createCouple(uid: string): Promise<string> {
  let code = "";
  let coupleRef;

  for (let attempt = 0; attempt < 5; attempt++) {
    code = randomCode();
    const candidateRef = doc(db, "inviteCodes", code);
    const existing = await getDoc(candidateRef);
    if (!existing.exists()) {
      coupleRef = candidateRef;
      break;
    }
  }
  if (!coupleRef) throw new Error("Could not generate a unique invite code, please try again.");

  const newCoupleRef = doc(collection(db, "couples"));
  await setDoc(newCoupleRef, {
    memberIds: [uid],
    inviteCode: code,
    anniversaryDate: null,
    createdAt: serverTimestamp(),
    streak: { count: 0, lastOpenedDates: {}, lastCompletedDate: null },
    playedQuestionIds: [],
  });
  await setDoc(doc(db, "inviteCodes", code), { coupleId: newCoupleRef.id });
  await setDoc(doc(db, "users", uid), { coupleId: newCoupleRef.id }, { merge: true });

  return code;
}

/** Joins the couple identified by `code`, pairing `uid` with the partner who created it. */
export async function joinCouple(uid: string, code: string): Promise<void> {
  const normalizedCode = code.trim().toUpperCase();
  const inviteRef = doc(db, "inviteCodes", normalizedCode);
  const inviteSnap = await getDoc(inviteRef);
  if (!inviteSnap.exists()) {
    throw new Error("That invite code doesn't exist. Double-check it with your partner.");
  }

  const coupleId = inviteSnap.data().coupleId as string;
  const coupleRef = doc(db, "couples", coupleId);

  await runTransaction(db, async (tx) => {
    const coupleSnap = await tx.get(coupleRef);
    if (!coupleSnap.exists()) throw new Error("This couple no longer exists.");
    const memberIds: string[] = coupleSnap.data().memberIds ?? [];
    if (memberIds.includes(uid)) return;
    if (memberIds.length >= 2) {
      throw new Error("This invite code has already been used.");
    }
    tx.update(coupleRef, { memberIds: arrayUnion(uid), inviteCode: null });
    tx.set(doc(db, "users", uid), { coupleId }, { merge: true });
  });

  await deleteDoc(inviteRef);
}
