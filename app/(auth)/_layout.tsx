import { Redirect, Stack, useSegments } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthLayout() {
  const firebaseUser = useAuthStore((s) => s.firebaseUser);
  const profile = useAuthStore((s) => s.profile);
  const segments = useSegments();
  const current = segments[segments.length - 1];

  if (firebaseUser && profile?.coupleId) {
    return <Redirect href="/(tabs)" />;
  }

  if (firebaseUser && !profile?.coupleId && current !== "pair") {
    return <Redirect href="/(auth)/pair" />;
  }

  if (!firebaseUser && current !== "login" && current !== "signup") {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="pair" />
    </Stack>
  );
}
