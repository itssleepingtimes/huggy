import { addDoc, collection, limit, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/config";
import { toMillis } from "@/firebase/firestore";
import type { Moment } from "@/types";

export function subscribeToMoments(coupleId: string, callback: (moments: Moment[]) => void) {
  const q = query(
    collection(db, "couples", coupleId, "moments"),
    orderBy("createdAt", "desc"),
    limit(100)
  );
  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => ({
        id: d.id,
        uid: d.data().uid,
        text: d.data().text ?? "",
        createdAt: toMillis(d.data().createdAt),
      }))
    );
  });
}

export async function addMoment(coupleId: string, uid: string, text: string) {
  await addDoc(collection(db, "couples", coupleId, "moments"), {
    uid,
    text: text.trim(),
    createdAt: serverTimestamp(),
  });
}
