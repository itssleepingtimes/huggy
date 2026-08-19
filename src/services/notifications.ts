import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/** Requests notification permission and saves this device's Expo push token to the user's
 * profile so the Cloud Function can relay pokes and place-arrival alerts. No-ops on simulators
 * and on web, where push tokens aren't available. */
export async function registerForPushNotifications(uid: string): Promise<void> {
  if (!Device.isDevice) return;

  const existing = await Notifications.getPermissionsAsync();
  let status = existing.status;
  if (status !== "granted") {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }
  if (status !== "granted") return;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  const projectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID;
  if (!projectId) return;

  try {
    const token = await Notifications.getExpoPushTokenAsync({ projectId });
    await setDoc(doc(db, "users", uid), { expoPushToken: token.data }, { merge: true });
  } catch {
    // Push tokens require a dev/production build — not available in Expo Go on SDK 53+.
  }
}
