import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/theme";

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

export function DdayCounter({ anniversaryDate }: Props) {
  if (!anniversaryDate) {
    return (
      <View style={styles.card}>
        <Text style={styles.emptyText}>
          Set your anniversary date in Profile to start your D-day counter 💕
        </Text>
      </View>
    );
  }

  const diff = daysSince(anniversaryDate);
  // Counted inclusively — the anniversary day itself is "D+1", matching how these counters are
  // conventionally read (D+1 is your first day together, not D+0).
  const label = diff >= 0 ? `D+${diff + 1}` : `D${diff}`;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.sub}>together since {anniversaryDate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: "center",
  },
  label: { fontSize: 40, fontWeight: "800", color: "#fff" },
  sub: { fontSize: 13, color: "#FFE3EC", marginTop: spacing.xs },
  emptyText: { color: "#fff", textAlign: "center", fontSize: 14, lineHeight: 20 },
});
