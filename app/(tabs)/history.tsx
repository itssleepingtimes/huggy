import { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useAuthStore } from "@/store/useAuthStore";
import { useCoupleStore } from "@/store/useCoupleStore";
import { subscribeToHistory, subscribeToLatestCompatibilityResult } from "@/services/rounds";
import { colors, radius, shadow, spacing } from "@/theme";
import { timeAgo } from "@/utils/time";
import type { CompatibilityResult, Round } from "@/types";

const COMPARABLE_TYPES = new Set(["this-or-that", "quiz", "rating"]);

export default function History() {
  const uid = useAuthStore((s) => s.firebaseUser?.uid ?? "");
  const myName = useAuthStore((s) => s.profile?.name ?? "You");
  const couple = useCoupleStore((s) => s.couple);
  const partner = useCoupleStore((s) => s.partner);

  const [rounds, setRounds] = useState<Round[]>([]);
  const [latestCompat, setLatestCompat] = useState<CompatibilityResult | null>(null);

  useEffect(() => {
    if (!couple) return;
    return subscribeToHistory(couple.id, setRounds);
  }, [couple?.id]);

  useEffect(() => {
    if (!couple) return;
    return subscribeToLatestCompatibilityResult(couple.id, setLatestCompat);
  }, [couple?.id]);

  const insights = useMemo(() => {
    let matched = 0;
    let comparable = 0;
    const categoryCounts: Record<string, number> = {};

    for (const r of rounds) {
      categoryCounts[r.category] = (categoryCounts[r.category] ?? 0) + 1;
      const mine = r.answers[uid];
      const theirs = partner ? r.answers[partner.uid] : undefined;
      if (mine && theirs && COMPARABLE_TYPES.has(r.type)) {
        comparable += 1;
        if (mine === theirs) matched += 1;
      }
    }

    let topCategory: string | null = null;
    let topCount = 0;
    for (const [category, count] of Object.entries(categoryCounts)) {
      if (count > topCount) {
        topCategory = category;
        topCount = count;
      }
    }

    return {
      totalPlayed: rounds.length,
      matchRate: comparable > 0 ? Math.round((matched / comparable) * 100) : null,
      topCategory,
    };
  }, [rounds, uid, partner]);

  return (
    <View style={styles.container}>
      <FlatList
        data={rounds}
        keyExtractor={(r) => r.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={{ gap: spacing.md, marginBottom: spacing.md }}>
            <Text style={styles.heading}>History</Text>

            <View style={styles.insightsCard}>
              <Text style={styles.insightsTitle}>Relationship Insights</Text>
              <View style={styles.statGrid}>
                <View style={styles.statTile}>
                  <Text style={styles.statValue}>{insights.totalPlayed}</Text>
                  <Text style={styles.statLabel}>Questions played</Text>
                </View>
                <View style={styles.statTile}>
                  <Text style={styles.statValue}>
                    {insights.matchRate !== null ? `${insights.matchRate}%` : "—"}
                  </Text>
                  <Text style={styles.statLabel}>Match rate</Text>
                </View>
                <View style={styles.statTile}>
                  <Text style={styles.statValue}>{couple?.streak.count ?? 0}</Text>
                  <Text style={styles.statLabel}>Day streak</Text>
                </View>
                <View style={styles.statTile}>
                  <Text style={[styles.statValue, styles.statValueSmall]} numberOfLines={1}>
                    {insights.topCategory ?? "—"}
                  </Text>
                  <Text style={styles.statLabel}>Top category</Text>
                </View>
              </View>
              {latestCompat && (
                <View style={styles.compatRow}>
                  <Text style={styles.compatText}>
                    💞 Latest Compatibility Quiz: <Text style={styles.compatScore}>{latestCompat.score}%</Text>{" "}
                    ({latestCompat.matched}/{latestCompat.total} matched)
                  </Text>
                </View>
              )}
            </View>

            <Text style={styles.subheading}>Question history</Text>
          </View>
        }
        renderItem={({ item }) => {
          const myAnswer = item.answers[uid];
          const partnerAnswer = partner ? item.answers[partner.uid] : undefined;
          const bothAnswered = Boolean(myAnswer && partner && partnerAnswer);
          const matched = bothAnswered && COMPARABLE_TYPES.has(item.type) && myAnswer === partnerAnswer;

          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.time}>{timeAgo(item.createdAt)}</Text>
              </View>
              <Text style={styles.question}>{item.text}</Text>
              {item.type === "dare" ? (
                <Text style={styles.answerLine}>{bothAnswered ? "✅ Completed together" : "Not finished yet"}</Text>
              ) : (
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
              )}
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
  heading: { fontSize: 22, fontWeight: "800", color: colors.text },
  subheading: { fontSize: 13, fontWeight: "700", color: colors.textMuted, textTransform: "uppercase" },
  insightsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    ...shadow.card,
  },
  insightsTitle: { fontSize: 15, fontWeight: "700", color: colors.text },
  statGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  statTile: {
    flexBasis: "47%",
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: "center",
  },
  statValue: { fontSize: 22, fontWeight: "800", color: colors.primary },
  statValueSmall: { fontSize: 14 },
  statLabel: { fontSize: 11, color: colors.textMuted, marginTop: 2, textAlign: "center" },
  compatRow: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm },
  compatText: { fontSize: 13, color: colors.text },
  compatScore: { fontWeight: "800", color: colors.primary },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
    ...shadow.card,
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
