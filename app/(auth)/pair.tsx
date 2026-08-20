import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAuthStore } from "@/store/useAuthStore";
import { createCouple, joinCouple } from "@/services/pairing";
import { signOut } from "@/firebase/auth";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { colors, spacing } from "@/theme";
import { alert } from "@/utils/alert";

export default function Pair() {
  const uid = useAuthStore((s) => s.firebaseUser?.uid);
  const [mode, setMode] = useState<"choose" | "join">("choose");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!uid) return;
    setLoading(true);
    try {
      const inviteCode = await createCouple(uid);
      alert(
        "Share this code with your partner",
        `${inviteCode}\n\nThey'll enter this in "Join with a code" to pair with you. You can also find it later in Profile.`
      );
    } catch (err: any) {
      alert("Something went wrong", err?.message ?? "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin() {
    if (!uid || !code.trim()) return;
    setLoading(true);
    try {
      await joinCouple(uid, code);
    } catch (err: any) {
      alert("Couldn't join", err?.message ?? "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>👫</Text>
      <Text style={styles.title}>Pair with your partner</Text>
      <Text style={styles.subtitle}>
        Huggy is just for the two of you — create a private space or join theirs.
      </Text>

      {mode === "choose" ? (
        <View style={styles.form}>
          <Button title="Create a new pair" onPress={handleCreate} loading={loading} />
          <Button title="Join with a code" variant="secondary" onPress={() => setMode("join")} />
        </View>
      ) : (
        <View style={styles.form}>
          <TextField
            placeholder="Enter 6-character code"
            autoCapitalize="characters"
            maxLength={6}
            value={code}
            onChangeText={setCode}
          />
          <Button title="Join" onPress={handleJoin} loading={loading} />
          <Button title="Back" variant="ghost" onPress={() => setMode("choose")} />
        </View>
      )}

      <Button title="Sign out" variant="ghost" onPress={() => signOut()} style={styles.signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: "center",
    gap: spacing.sm,
  },
  emoji: { fontSize: 48, textAlign: "center", marginBottom: spacing.sm },
  title: { fontSize: 26, fontWeight: "800", textAlign: "center", color: colors.text },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: colors.textMuted,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  form: { gap: spacing.sm },
  signOut: { marginTop: spacing.xl },
});
