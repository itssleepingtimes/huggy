import { doc, onSnapshot } from "firebase/firestore";
import type { User } from "firebase/auth";
import { create } from "zustand";
import { db } from "@/firebase/config";
import { subscribeToAuthChanges } from "@/firebase/auth";
import { toMillis } from "@/firebase/firestore";
import type { UserProfile } from "@/types";

type AuthState = {
  initializing: boolean;
  firebaseUser: User | null;
  profile: UserProfile | null;
  init: () => () => void;
};

let profileUnsubscribe: (() => void) | null = null;

export const useAuthStore = create<AuthState>((set) => ({
  initializing: true,
  firebaseUser: null,
  profile: null,
  init: () => {
    const unsubscribeAuth = subscribeToAuthChanges((firebaseUser) => {
      profileUnsubscribe?.();
      profileUnsubscribe = null;

      if (!firebaseUser) {
        set({ firebaseUser: null, profile: null, initializing: false });
        return;
      }

      set({ firebaseUser });
      profileUnsubscribe = onSnapshot(doc(db, "users", firebaseUser.uid), (snap) => {
        const data = snap.data();
        set({
          profile: data
            ? {
                uid: firebaseUser.uid,
                name: data.name ?? "",
                photoURL: data.photoURL ?? null,
                coupleId: data.coupleId ?? null,
                expoPushToken: data.expoPushToken ?? null,
                createdAt: toMillis(data.createdAt),
              }
            : null,
          initializing: false,
        });
      });
    });

    return () => {
      unsubscribeAuth();
      profileUnsubscribe?.();
      profileUnsubscribe = null;
    };
  },
}));
