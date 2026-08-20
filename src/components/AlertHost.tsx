import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAlertStore } from "@/store/useAlertStore";
import { Button } from "@/components/Button";
import { colors, radius, spacing } from "@/theme";

export function AlertHost() {
  const visible = useAlertStore((s) => s.visible);
  const title = useAlertStore((s) => s.title);
  const message = useAlertStore((s) => s.message);
  const hide = useAlertStore((s) => s.hide);

  if (!visible) return null;

  return (
    <View style={styles.backdrop}>
      <Pressable style={StyleSheet.absoluteFill} onPress={hide} />
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <Button title="OK" onPress={hide} style={styles.button} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
    zIndex: 1000,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    width: "100%",
    maxWidth: 360,
    gap: spacing.sm,
  },
  title: { fontSize: 17, fontWeight: "700", color: colors.text },
  message: { fontSize: 14, color: colors.textMuted, lineHeight: 20 },
  button: { marginTop: spacing.xs },
});
