import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuthStore } from "@/store/useAuthStore";
import { useCoupleStore } from "@/store/useCoupleStore";
import { startNewRound, submitRoundAnswer, subscribeToCurrentRound } from "@/services/rounds";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { colors, radius, spacing } from "@/theme";
import { alert } from "@/utils/alert";
import type { Round } from "@/types";

const RATING_SCALE = Array.from({ length: 10 }, (_, i) => String(i + 1));

export default function Play() {
  const uid = useAuthStore((s) => s.firebaseUser?.uid ?? "");
  const myName = useAuthStore((s) => s.profile?.name ?? "You");
  const couple = useCoupleStore((s) => s.couple);
  const partner = useCoupleStore((s) => s.partner);

  const [round, setRound] = useState<Round | null | undefined>(undefined);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!couple) return;
    return subscribeToCurrentRound(couple.id, setRound);
  }, [couple?.id]);

  useEffect(() => {
    setDraft("");
  }, [round?.id, round?.questionId]);

  async function handleStart() {
    if (!couple) return;
    setBusy(true);
    try {
      await startNewRound(couple.id, couple.playedQuestionIds);
    } catch (err: any) {
      alert("Couldn't start", err?.message ?? "Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleAnswer(answer: string) {
    if (!couple || !answer.trim()) return;
    setBusy(true);
    try {
      await submitRoundAnswer(couple.id, uid, answer.trim());
    } catch (err: any) {
      alert("Couldn't send answer", err?.message ?? "Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (round === undefined) return null;

  if (!round) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emoji}>🎲</Text>
        <Text style={styles.title}>Ready to play?</Text>
        <Text style={styles.subtitle}>
          Quizzes, ratings, this-or-that, and deep questions — pick one and see how your answers
          compare.
        </Text>
        <Button title="Start playing" onPress={handleStart} loading={busy} />
      </View>
    );
  }

  const myAnswer = round.answers[uid];
  const partnerAnswer = partner ? round.answers[partner.uid] : undefined;
  const bothAnswered = Boolean(myAnswer && partner && partnerAnswer);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.category}>{round.category}</Text>
        <Text style={styles.question}>{round.text}</Text>

        {!myAnswer && (
          <View style={styles.answerZone}>
            {round.type === "prompt" && (
              <View style={{ gap: spacing.sm }}>
                <TextField
                  placeholder="Type your answer…"
                  value={draft}
                  onChangeText={setDraft}
                  multiline
                />
                <Button
                  title="Submit"
                  onPress={() => handleAnswer(draft)}
                  loading={busy}
                  disabled={!draft.trim()}
                />
              </View>
            )}

            {(round.type === "this-or-that" || round.type === "quiz") && (
              <View style={{ gap: spacing.sm }}>
                {round.options?.map((option) => (
                  <Button
                    key={option}
                    title={option}
                    variant="secondary"
                    onPress={() => handleAnswer(option)}
                    disabled={busy}
                  />
                ))}
              </View>
            )}

            {round.type === "rating" && (
              <View style={styles.ratingRow}>
                {RATING_SCALE.map((n) => (
                  <Button
                    key={n}
                    title={n}
                    variant="secondary"
                    onPress={() => handleAnswer(n)}
                    disabled={busy}
                    style={styles.ratingButton}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {myAnswer && !bothAnswered && (
          <View style={styles.waiting}>
            <Text style={styles.waitingText}>
              You answered "{myAnswer}" — waiting for {partner?.name || "your partner"}…
            </Text>
          </View>
        )}

        {bothAnswered && (
          <View style={styles.reveal}>
            <View style={styles.revealRow}>
              <Text style={styles.revealLabel}>{myName}</Text>
              <Text style={styles.revealAnswer}>{myAnswer}</Text>
            </View>
            <View style={styles.revealRow}>
              <Text style={styles.revealLabel}>{partner?.name}</Text>
              <Text style={styles.revealAnswer}>{partnerAnswer}</Text>
            </View>
            {(round.type === "this-or-that" || round.type === "quiz" || round.type === "rating") && (
              <Text style={styles.matchText}>
                {myAnswer === partnerAnswer ? "🎉 You matched!" : "Different answers — talk about it!"}
              </Text>
            )}
          </View>
        )}
      </View>

      {bothAnswered && (
        <Button title="Next question" onPress={handleStart} loading={busy} style={styles.nextButton} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl },
  centered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.sm,
  },
  emoji: { fontSize: 48, marginBottom: spacing.sm },
  title: { fontSize: 24, fontWeight: "800", color: colors.text },
  subtitle: { fontSize: 14, color: colors.textMuted, textAlign: "center", marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  category: { fontSize: 12, fontWeight: "700", color: colors.secondary, textTransform: "uppercase" },
  question: { fontSize: 20, fontWeight: "700", color: colors.text, lineHeight: 27 },
  answerZone: { marginTop: spacing.xs },
  ratingRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  ratingButton: { flexBasis: "17%", paddingHorizontal: 0 },
  waiting: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  waitingText: { fontSize: 14, color: colors.textMuted },
  reveal: { gap: spacing.sm },
  revealRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  revealLabel: { fontSize: 12, fontWeight: "700", color: colors.textMuted },
  revealAnswer: { fontSize: 16, color: colors.text, marginTop: 2 },
  matchText: { fontSize: 14, fontWeight: "600", color: colors.primary, textAlign: "center" },
  nextButton: { marginTop: spacing.sm },
});
