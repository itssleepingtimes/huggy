import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/theme";

type Props = {
  count: number;
  bothOpenedToday: boolean;
};

export function StreakBadge({ count, bothOpenedToday }: Props) {
  return (
    <View style={styles.badge}>
      <Text style={styles.flame}>🔥</Text>
      <View>
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
  },
  flame: { fontSize: 28 },
  count: { fontSize: 15, fontWeight: "700", color: colors.text },
  hint: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
});
