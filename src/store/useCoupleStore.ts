import { doc, onSnapshot } from "firebase/firestore";
import { create } from "zustand";
import { db } from "@/firebase/config";
import { toMillis } from "@/firebase/firestore";
import type { Couple, UserProfile } from "@/types";

type CoupleState = {
  couple: Couple | null;
  partner: UserProfile | null;
  loading: boolean;
  subscribe: (coupleId: string | null, myUid: string | null) => void;
};

let coupleUnsubscribe: (() => void) | null = null;
let partnerUnsubscribe: (() => void) | null = null;
let subscribedCoupleId: string | null = null;

function clear(set: (partial: Partial<CoupleState>) => void) {
  coupleUnsubscribe?.();
  partnerUnsubscribe?.();
  coupleUnsubscribe = null;
  partnerUnsubscribe = null;
  subscribedCoupleId = null;
  set({ couple: null, partner: null, loading: false });
}

export const useCoupleStore = create<CoupleState>((set) => ({
  couple: null,
  partner: null,
  loading: false,
  subscribe: (coupleId, myUid) => {
    if (!coupleId || !myUid) {
      clear(set);
      return;
    }
    if (coupleId === subscribedCoupleId) return;

    coupleUnsubscribe?.();
    partnerUnsubscribe?.();
    subscribedCoupleId = coupleId;
    set({ loading: true });

    coupleUnsubscribe = onSnapshot(doc(db, "couples", coupleId), (snap) => {
      const data = snap.data();
      if (!data) {
        set({ couple: null, loading: false });
        return;
      }

      const couple: Couple = {
        id: snap.id,
        memberIds: data.memberIds ?? [],
        inviteCode: data.inviteCode ?? null,
        anniversaryDate: data.anniversaryDate ?? null,
        createdAt: toMillis(data.createdAt),
        streak: data.streak ?? { count: 0, lastOpenedDates: {}, lastCompletedDate: null },
        playedQuestionIds: data.playedQuestionIds ?? [],
      };
      set({ couple, loading: false });

      const partnerUid = couple.memberIds.find((id) => id !== myUid) ?? null;
      partnerUnsubscribe?.();
      if (!partnerUid) {
        partnerUnsubscribe = null;
        set({ partner: null });
        return;
      }
      partnerUnsubscribe = onSnapshot(doc(db, "users", partnerUid), (partnerSnap) => {
        const partnerData = partnerSnap.data();
        set({
          partner: partnerData
            ? {
                uid: partnerUid,
                name: partnerData.name ?? "",
                photoURL: partnerData.photoURL ?? null,
                coupleId: partnerData.coupleId ?? null,
                expoPushToken: partnerData.expoPushToken ?? null,
                createdAt: toMillis(partnerData.createdAt),
              }
            : null,
        });
      });
    });
  },
}));

export function resetCoupleStore() {
  clear(useCoupleStore.setState);
}
