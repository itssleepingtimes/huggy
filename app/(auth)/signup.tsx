import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { signUp } from "@/firebase/auth";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { colors, spacing } from "@/theme";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!name || !email || !password) {
      Alert.alert("Missing info", "Fill in your name, email, and password.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await signUp(name.trim(), email.trim(), password);
    } catch (err: any) {
      Alert.alert("Couldn't create account", err?.message ?? "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.emoji}>💌</Text>
      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.subtitle}>You'll pair with your partner next</Text>

      <View style={styles.form}>
        <TextField placeholder="Your name" value={name} onChangeText={setName} />
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
        <Button title="Create account" onPress={handleSignup} loading={loading} />
      </View>

      <Link href="/(auth)/login" style={[styles.link, styles.linkText]}>
        Already have an account? Sign in
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
