import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useAuthStore } from "@/store/useAuthStore";
import { useCoupleStore } from "@/store/useCoupleStore";
import { subscribeToHistory } from "@/services/rounds";
import { colors, radius, spacing } from "@/theme";
import { timeAgo } from "@/utils/time";
import type { Round } from "@/types";

export default function History() {
  const uid = useAuthStore((s) => s.firebaseUser?.uid ?? "");
  const myName = useAuthStore((s) => s.profile?.name ?? "You");
  const couple = useCoupleStore((s) => s.couple);
  const partner = useCoupleStore((s) => s.partner);

  const [rounds, setRounds] = useState<Round[]>([]);

  useEffect(() => {
    if (!couple) return;
    return subscribeToHistory(couple.id, setRounds);
  }, [couple?.id]);

  return (
    <View style={styles.container}>
      <FlatList
        data={rounds}
        keyExtractor={(r) => r.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={<Text style={styles.heading}>Question history</Text>}
        renderItem={({ item }) => {
          const myAnswer = item.answers[uid];
          const partnerAnswer = partner ? item.answers[partner.uid] : undefined;
          const bothAnswered = Boolean(myAnswer && partner && partnerAnswer);
          const matched =
            bothAnswered &&
            item.type !== "prompt" &&
            myAnswer === partnerAnswer;

          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.time}>{timeAgo(item.createdAt)}</Text>
              </View>
              <Text style={styles.question}>{item.text}</Text>
              <View style={styles.answers}>
                <Text style={styles.answerLine}>
                  <Text style={styles.answerLabel}>{myName}: </Text>
                  {myAnswer ?? "Didn't answer"}
                </Text>
                <Text style={styles.answerLine}>
                  <Text style={styles.answerLabel}>{partner?.name ?? "Partner"}: </Text>
                  {partnerAnswer ?? "Didn't answer"}
                </Text>
              </View>
              {matched && <Text style={styles.matchBadge}>🎉 Matched</Text>}
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        ListEmptyComponent={
          <Text style={styles.empty}>No questions played yet — head to the Play tab to start!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  heading: { fontSize: 22, fontWeight: "800", color: colors.text, marginBottom: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  category: { fontSize: 11, fontWeight: "700", color: colors.secondary, textTransform: "uppercase" },
  time: { fontSize: 11, color: colors.textMuted },
  question: { fontSize: 15, fontWeight: "600", color: colors.text, marginTop: 2 },
  answers: { marginTop: spacing.xs, gap: 2 },
  answerLine: { fontSize: 13, color: colors.text },
  answerLabel: { fontWeight: "700", color: colors.textMuted },
  matchBadge: { fontSize: 12, color: colors.primary, fontWeight: "700", marginTop: 2 },
  empty: { textAlign: "center", color: colors.textMuted, marginTop: spacing.xl },
});
