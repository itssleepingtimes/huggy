import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "@/store/useAuthStore";
import { useCoupleStore } from "@/store/useCoupleStore";
import { isFirebaseConfigured } from "@/firebase/config";
import { registerForPushNotifications } from "@/services/notifications";
import { colors } from "@/theme";

export default function RootLayout() {
  const initializing = useAuthStore((s) => s.initializing);
  const firebaseUser = useAuthStore((s) => s.firebaseUser);
  const coupleId = useAuthStore((s) => s.profile?.coupleId ?? null);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsubscribe = useAuthStore.getState().init();
    return unsubscribe;
  }, []);

  useEffect(() => {
    useCoupleStore.getState().subscribe(coupleId, firebaseUser?.uid ?? null);
  }, [coupleId, firebaseUser?.uid]);

  useEffect(() => {
    if (firebaseUser) registerForPushNotifications(firebaseUser.uid);
  }, [firebaseUser?.uid]);

  if (!isFirebaseConfigured) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <View style={styles.centered}>
          <Text style={styles.title}>Firebase isn't configured yet</Text>
          <Text style={styles.body}>
            Create a `.env` file from `.env.example` and fill in your Firebase project's config
            values, then restart the app. See README.md for step-by-step setup.
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  if (initializing) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
    backgroundColor: "#fff",
  },
  title: { fontSize: 18, fontWeight: "700", textAlign: "center" },
  body: { fontSize: 14, color: "#666", textAlign: "center", lineHeight: 20 },
});
