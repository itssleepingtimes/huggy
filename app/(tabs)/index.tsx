import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuthStore } from "@/store/useAuthStore";
import { useCoupleStore } from "@/store/useCoupleStore";
import { recordAppOpen } from "@/services/streak";
import { sendPoke, subscribeToIncomingPokes } from "@/services/pokes";
import {
  ensureTodayQuestion,
  submitDailyAnswer,
  subscribeToTodayQuestion,
} from "@/services/dailyQuestion";
import { DdayCounter } from "@/components/DdayCounter";
import { StreakBadge } from "@/components/StreakBadge";
import { RoundCard } from "@/components/RoundCard";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { colors, radius, spacing } from "@/theme";
import { todayKey } from "@/firebase/firestore";
import { alert } from "@/utils/alert";
import type { Round } from "@/types";

export default function Home() {
  const uid = useAuthStore((s) => s.firebaseUser?.uid ?? "");
  const name = useAuthStore((s) => s.profile?.name ?? "");
  const couple = useCoupleStore((s) => s.couple);
  const partner = useCoupleStore((s) => s.partner);
  const router = useRouter();

  const [poking, setPoking] = useState(false);
  const [dailyQuestion, setDailyQuestion] = useState<Round | null>(null);
  const [answering, setAnswering] = useState(false);

  useEffect(() => {
    if (!couple || !uid) return;
    recordAppOpen(couple.id, uid, partner?.uid ?? null).catch(() => {});
    // Re-runs once partner data finishes loading (partner?.uid flips from undefined to a
    // real uid) so the "both opened today" check still completes even if this ran once
    // already with no partner known yet — recordAppOpen is idempotent, safe to call again.
  }, [couple?.id, uid, partner?.uid]);

  useEffect(() => {
    if (!couple) return;
    ensureTodayQuestion(couple.id).catch(() => {});
    return subscribeToTodayQuestion(couple.id, setDailyQuestion);
  }, [couple?.id]);

  useEffect(() => {
    if (!couple || !uid) return;
    return subscribeToIncomingPokes(couple.id, uid, () => {
      alert("💗", `${partner?.name || "Your partner"} is thinking of you`);
    });
  }, [couple?.id, uid, partner?.name]);

  async function handlePoke() {
    if (!couple) return;
    setPoking(true);
    try {
      await sendPoke(couple.id, uid);
    } catch (err: any) {
      alert("Couldn't send", err?.message ?? "Please try again.");
    } finally {
      setPoking(false);
    }
  }

  async function handleDailyAnswer(answer: string) {
    if (!couple || !answer.trim()) return;
    setAnswering(true);
    try {
      await submitDailyAnswer(couple.id, uid, answer.trim());
    } catch (err: any) {
      alert("Couldn't send answer", err?.message ?? "Please try again.");
    } finally {
      setAnswering(false);
    }
  }

  const bothOpenedToday = Boolean(
    couple &&
      partner &&
      couple.streak.lastOpenedDates[uid] === todayKey() &&
      couple.streak.lastOpenedDates[partner.uid] === todayKey()
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi {name || "there"}</Text>
        <Text style={styles.waveEmoji}>👋</Text>
      </View>

      <DdayCounter anniversaryDate={couple?.anniversaryDate ?? null} />

      <StreakBadge count={couple?.streak.count ?? 0} bothOpenedToday={bothOpenedToday} />

      <View>
        <Text style={styles.sectionLabel}>☀️ Today's Question</Text>
        {dailyQuestion ? (
          <RoundCard
            round={dailyQuestion}
            uid={uid}
            myName={name || "You"}
            partner={partner ? { uid: partner.uid, name: partner.name } : null}
            onAnswer={handleDailyAnswer}
            busy={answering}
          />
        ) : (
          <Card>
            <Text style={styles.actionSubtitle}>Loading today's question…</Text>
          </Card>
        )}
      </View>

      <Card style={styles.actionCard}>
        <View style={styles.actionRow}>
          <View style={[styles.iconBubble, { backgroundColor: "#EFEAFE" }]}>
            <Ionicons name="dice" size={22} color={colors.secondary} />
          </View>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Want more?</Text>
            <Text style={styles.actionSubtitle}>
              Quizzes, ratings, this-or-that, deep questions — pick a mode in the Play tab.
            </Text>
          </View>
        </View>
        <Button title="Play now" onPress={() => router.push("/(tabs)/play")} />
      </Card>

      <Card style={styles.actionCard}>
        <View style={styles.actionRow}>
          <View style={[styles.iconBubble, { backgroundColor: "#FFE3EC" }]}>
            <Ionicons name="heart" size={22} color={colors.primary} />
          </View>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Send a little love</Text>
            <Text style={styles.actionSubtitle}>
              {partner
                ? `Let ${partner.name} know you're thinking of them`
                : "Waiting for your partner to join"}
            </Text>
          </View>
        </View>
        <Button title="💗 Thinking of you" onPress={handlePoke} loading={poking} disabled={!partner} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.xs, marginBottom: spacing.xs },
  greeting: { fontSize: 26, fontWeight: "800", color: colors.text },
  waveEmoji: { fontSize: 24 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: spacing.sm,
  },
  actionCard: { gap: spacing.md },
  actionRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: { flex: 1, gap: 2 },
  actionTitle: { fontSize: 16, fontWeight: "700", color: colors.text },
  actionSubtitle: { fontSize: 12.5, color: colors.textMuted, lineHeight: 17 },
});
