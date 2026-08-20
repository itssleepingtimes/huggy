import { doc, runTransaction } from "firebase/firestore";
import { db } from "@/firebase/config";
import { todayKey } from "@/firebase/firestore";

function yesterdayKey(today: string): string {
  const d = new Date(today);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Records that `myUid` opened the app today. The streak only increments once per day, the
 * moment both partners have opened it — checked on every call (not just the first per day)
 * so it still completes correctly if `partnerUid` wasn't known yet on an earlier call (e.g.
 * their profile hadn't loaded when this ran right after pairing).
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

    const alreadyMarkedToday = lastOpenedDates[myUid] === today;
    lastOpenedDates[myUid] = today;

    const bothOpenToday = Boolean(partnerUid && lastOpenedDates[partnerUid] === today);
    const alreadyCompletedToday = lastCompletedDate === today;

    if (bothOpenToday && !alreadyCompletedToday) {
      count = lastCompletedDate === yesterdayKey(today) ? count + 1 : 1;
      lastCompletedDate = today;
    } else if (alreadyMarkedToday) {
      return; // nothing changed since the last call, skip the write
    }

    tx.update(coupleRef, { streak: { count, lastOpenedDates, lastCompletedDate } });
  });
}
