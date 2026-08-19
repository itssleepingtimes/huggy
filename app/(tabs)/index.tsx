import { useEffect, useRef, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuthStore } from "@/store/useAuthStore";
import { useCoupleStore } from "@/store/useCoupleStore";
import { recordAppOpen } from "@/services/streak";
import { subscribeToTodayPrompt, submitPromptAnswer } from "@/services/prompts";
import { sendPoke, subscribeToIncomingPokes } from "@/services/pokes";
import { DdayCounter } from "@/components/DdayCounter";
import { StreakBadge } from "@/components/StreakBadge";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { colors, radius, spacing } from "@/theme";
import { todayKey } from "@/firebase/firestore";
import type { DailyPrompt } from "@/types";

export default function Home() {
  const uid = useAuthStore((s) => s.firebaseUser?.uid ?? "");
  const name = useAuthStore((s) => s.profile?.name ?? "");
  const couple = useCoupleStore((s) => s.couple);
  const partner = useCoupleStore((s) => s.partner);

  const [prompt, setPrompt] = useState<DailyPrompt | null>(null);
  const [answerDraft, setAnswerDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [poking, setPoking] = useState(false);
  const hasRecordedOpen = useRef<string | null>(null);

  useEffect(() => {
    if (!couple || !uid) return;
    if (hasRecordedOpen.current === couple.id) return;
    hasRecordedOpen.current = couple.id;
    recordAppOpen(couple.id, uid, partner?.uid ?? null).catch(() => {});
  }, [couple, uid, partner?.uid]);

  useEffect(() => {
    if (!couple) return;
    return subscribeToTodayPrompt(couple.id, setPrompt);
  }, [couple?.id]);

  useEffect(() => {
    if (!couple || !uid) return;
    return subscribeToIncomingPokes(couple.id, uid, () => {
      Alert.alert("💗", `${partner?.name || "Your partner"} is thinking of you`);
    });
  }, [couple?.id, uid, partner?.name]);

  async function handleSubmitAnswer() {
    if (!couple || !answerDraft.trim()) return;
    setSubmitting(true);
    try {
      await submitPromptAnswer(couple.id, uid, answerDraft);
      setAnswerDraft("");
    } catch (err: any) {
      Alert.alert("Couldn't save your answer", err?.message ?? "Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePoke() {
    if (!couple) return;
    setPoking(true);
    try {
      await sendPoke(couple.id, uid);
    } catch (err: any) {
      Alert.alert("Couldn't send", err?.message ?? "Please try again.");
    } finally {
      setPoking(false);
    }
  }

  const myAnswer = prompt?.answers[uid];
  const partnerAnswer = partner ? prompt?.answers[partner.uid] : undefined;
  const bothOpenedToday = Boolean(
    couple &&
      partner &&
      couple.streak.lastOpenedDates[uid] === todayKey() &&
      couple.streak.lastOpenedDates[partner.uid] === todayKey()
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>Hi {name || "there"} 👋</Text>

      <DdayCounter anniversaryDate={couple?.anniversaryDate ?? null} />

      <StreakBadge count={couple?.streak.count ?? 0} bothOpenedToday={bothOpenedToday} />

      <View style={styles.pokeCard}>
        <Text style={styles.pokeTitle}>Send a little love</Text>
        <Text style={styles.pokeSubtitle}>
          {partner ? `Let ${partner.name} know you're thinking of them` : "Waiting for your partner to join"}
        </Text>
        <Button title="💗 Thinking of you" onPress={handlePoke} loading={poking} disabled={!partner} />
      </View>

      <View style={styles.promptCard}>
        <Text style={styles.promptLabel}>Today's question</Text>
        <Text style={styles.promptText}>{prompt?.promptText ?? "…"}</Text>

        {myAnswer ? (
          <View style={styles.answerBlock}>
            <Text style={styles.answerLabel}>You said</Text>
            <Text style={styles.answerText}>{myAnswer}</Text>
          </View>
        ) : (
          <View style={styles.answerForm}>
            <TextField
              placeholder="Type your answer…"
              value={answerDraft}
              onChangeText={setAnswerDraft}
              multiline
            />
            <Button title="Share answer" onPress={handleSubmitAnswer} loading={submitting} />
          </View>
        )}

        {partner && (
          <View style={styles.answerBlock}>
            <Text style={styles.answerLabel}>{partner.name}</Text>
            <Text style={styles.answerText}>
              {partnerAnswer ?? "Hasn't answered yet"}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl },
  greeting: { fontSize: 22, fontWeight: "800", color: colors.text },
  pokeCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  pokeTitle: { fontSize: 16, fontWeight: "700", color: colors.text },
  pokeSubtitle: { fontSize: 13, color: colors.textMuted },
  promptCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  promptLabel: { fontSize: 12, fontWeight: "700", color: colors.secondary, textTransform: "uppercase" },
  promptText: { fontSize: 17, fontWeight: "600", color: colors.text, marginBottom: spacing.xs },
  answerForm: { gap: spacing.sm },
  answerBlock: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
  },
  answerLabel: { fontSize: 12, fontWeight: "700", color: colors.textMuted, marginBottom: 2 },
  answerText: { fontSize: 15, color: colors.text },
});
