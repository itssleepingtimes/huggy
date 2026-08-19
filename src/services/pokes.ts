import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { toMillis } from "@/firebase/firestore";

export async function sendPoke(coupleId: string, fromUid: string) {
  await addDoc(collection(db, "couples", coupleId, "pokes"), {
    fromUid,
    createdAt: serverTimestamp(),
  });
}

/** Notifies `onPoke` whenever a poke newer than the subscription start time arrives from someone else. */
export function subscribeToIncomingPokes(
  coupleId: string,
  myUid: string,
  onPoke: () => void
) {
  const subscribedAt = Date.now();
  const q = query(collection(db, "couples", coupleId, "pokes"), orderBy("createdAt", "desc"), limit(1));

  return onSnapshot(q, (snap) => {
    const latest = snap.docs[0];
    if (!latest) return;
    const data = latest.data();
    if (data.fromUid === myUid) return;
    if (toMillis(data.createdAt) < subscribedAt) return;
    onPoke();
  });
}
