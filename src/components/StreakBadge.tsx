import { StyleSheet, Text, View } from "react-native";
import { colors, radius, shadow, spacing } from "@/theme";

type Props = {
  count: number;
  bothOpenedToday: boolean;
};

export function StreakBadge({ count, bothOpenedToday }: Props) {
  return (
    <View style={styles.badge}>
      <View style={styles.flameBubble}>
        <Text style={styles.flame}>🔥</Text>
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.count}>{count}-day streak</Text>
        <Text style={styles.hint}>
          {bothOpenedToday ? "Both of you opened Huggy today" : "Open it together to keep it alive"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  flameBubble: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: "#FFF1E0",
    alignItems: "center",
    justifyContent: "center",
  },
  flame: { fontSize: 22 },
  textBlock: { flex: 1 },
  count: { fontSize: 15, fontWeight: "700", color: colors.text },
  hint: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
});
