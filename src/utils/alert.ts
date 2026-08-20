import { useAlertStore } from "@/store/useAlertStore";

/** A cross-platform replacement for Alert.alert — react-native-web ships Alert.alert as a
 * silent no-op, and window.alert() blocks the JS thread in a way that doesn't fit a PWA well,
 * so this shows an in-app modal instead, consistently on every platform. */
export function alert(title: string, message?: string) {
  useAlertStore.getState().show(title, message);
}
