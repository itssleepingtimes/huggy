import { StyleSheet, Text, View } from "react-native";
import { colors, radius, shadow, spacing } from "@/theme";

type Props = {
  anniversaryDate: string | null;
};

function daysSince(dateStr: string): number {
  const start = new Date(dateStr + "T00:00:00");
  const now = new Date();
  const startUTC = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const nowUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((nowUTC - startUTC) / 86_400_000);
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}

export function DdayCounter({ anniversaryDate }: Props) {
  if (!anniversaryDate) {
    return (
      <View style={styles.card}>
        <Text style={styles.emptyEmoji}>💕</Text>
        <Text style={styles.emptyText}>
          Set your anniversary date in Profile to start your day counter
        </Text>
      </View>
    );
  }

  // Counted inclusively — the anniversary day itself is day 1, matching how these counters are
  // conventionally read (not day 0).
  const diff = daysSince(anniversaryDate) + 1;

  if (diff < 1) {
    const daysUntil = 1 - diff;
    return (
      <View style={styles.card}>
        <Text style={styles.count}>{daysUntil}</Text>
        <Text style={styles.unit}>{daysUntil === 1 ? "day" : "days"} until your anniversary</Text>
        <Text style={styles.since}>{formatDate(anniversaryDate)}</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.count}>{diff.toLocaleString()}</Text>
      <Text style={styles.unit}>{diff === 1 ? "Day Together" : "Days Together"}</Text>
      <Text style={styles.since}>Since {formatDate(anniversaryDate)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    ...shadow.raised,
  },
  count: { fontSize: 52, fontWeight: "800", color: "#fff", letterSpacing: -1 },
  unit: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  since: { fontSize: 13, color: "#FFE3EC", marginTop: spacing.xs },
  emptyEmoji: { fontSize: 32, marginBottom: spacing.xs },
  emptyText: { color: "#fff", textAlign: "center", fontSize: 14, lineHeight: 20 },
});
