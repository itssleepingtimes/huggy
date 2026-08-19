import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthLayout() {
  const firebaseUser = useAuthStore((s) => s.firebaseUser);
  const profile = useAuthStore((s) => s.profile);

  if (firebaseUser && profile?.coupleId) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="pair" />
    </Stack>
  );
}
