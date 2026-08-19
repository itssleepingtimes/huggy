import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { signIn } from "@/firebase/auth";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { colors, spacing } from "@/theme";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Missing info", "Enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (err: any) {
      Alert.alert("Couldn't sign in", err?.message ?? "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.emoji}>💞</Text>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Sign in to see your partner</Text>

      <View style={styles.form}>
        <TextField
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextField
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Sign in" onPress={handleLogin} loading={loading} />
      </View>

      <Link href="/(auth)/signup" style={[styles.link, styles.linkText]}>
        New here? Create an account
      </Link>
    </KeyboardAvoidingView>
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
  },
  form: { gap: spacing.sm },
  link: { marginTop: spacing.lg, alignSelf: "center" },
  linkText: { color: colors.primary, fontWeight: "600" },
});
