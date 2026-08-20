import { Platform } from "react-native";
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth, initializeAuth, type Auth } from "firebase/auth";
// @ts-expect-error — getReactNativePersistence lives on firebase/auth's React Native entry
// point, which Metro resolves at bundle time but `tsc` (using node resolution) can't see.
import { getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth: Auth;
if (Platform.OS === "web") {
  // Web already persists to localStorage by default via getAuth — no extra setup needed.
  auth = getAuth(app);
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // initializeAuth throws if already called (e.g. fast refresh) — fall back to getAuth.
    auth = getAuth(app);
  }
}

export { app, auth };
export const db = getFirestore(app);
