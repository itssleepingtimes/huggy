import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/theme";
import { timeAgo } from "@/utils/time";
import type { Moment } from "@/types";

type Props = {
  moment: Moment;
  authorName: string;
};

export function MomentCard({ moment, authorName }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>{moment.text}</Text>
      <Text style={styles.meta}>
        {authorName} · {timeAgo(moment.createdAt)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  text: { fontSize: 15, color: colors.text, lineHeight: 21 },
  meta: { fontSize: 11, color: colors.textMuted },
});
