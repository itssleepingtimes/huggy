import { doc, runTransaction } from "firebase/firestore";
import { db } from "@/firebase/config";
import { todayKey } from "@/firebase/firestore";

function yesterdayKey(today: string): string {
  const d = new Date(today);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Records that `myUid` opened the app today. The streak only increments once per day,
 * the moment the *second* partner opens the app on a day that continues yesterday's streak —
 * this stays correct however the two opens are ordered.
 */
export async function recordAppOpen(coupleId: string, myUid: string, partnerUid: string | null) {
  const today = todayKey();
  const coupleRef = doc(db, "couples", coupleId);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(coupleRef);
    if (!snap.exists()) return;
    const data = snap.data();
    const lastOpenedDates: Record<string, string> = { ...(data.streak?.lastOpenedDates ?? {}) };
    let count: number = data.streak?.count ?? 0;
    let lastCompletedDate: string | null = data.streak?.lastCompletedDate ?? null;

    if (lastOpenedDates[myUid] === today) return; // already recorded today
    lastOpenedDates[myUid] = today;

    if (partnerUid && lastOpenedDates[partnerUid] === today) {
      if (lastCompletedDate === today) {
        // no-op, already counted
      } else if (lastCompletedDate === yesterdayKey(today)) {
        count += 1;
        lastCompletedDate = today;
      } else {
        count = 1;
        lastCompletedDate = today;
      }
    }

    tx.update(coupleRef, { streak: { count, lastOpenedDates, lastCompletedDate } });
  });
}
