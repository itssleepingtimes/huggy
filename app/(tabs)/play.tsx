import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuthStore } from "@/store/useAuthStore";
import { useCoupleStore } from "@/store/useCoupleStore";
import {
  advanceSession,
  exitSession,
  startSession,
  submitRoundAnswer,
  subscribeToPointer,
  subscribeToRound,
} from "@/services/rounds";
import { PLAY_MODES } from "@/data/questions";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { colors, radius, spacing } from "@/theme";
import { alert } from "@/utils/alert";
import type { GamePointer, PlayModeId, Round } from "@/types";

const RATING_SCALE = Array.from({ length: 10 }, (_, i) => String(i + 1));

export default function Play() {
  const uid = useAuthStore((s) => s.firebaseUser?.uid ?? "");
  const myName = useAuthStore((s) => s.profile?.name ?? "You");
  const couple = useCoupleStore((s) => s.couple);
  const partner = useCoupleStore((s) => s.partner);

  const [pointer, setPointer] = useState<GamePointer | null | undefined>(undefined);
  const [round, setRound] = useState<Round | null>(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!couple) return;
    return subscribeToPointer(couple.id, setPointer);
  }, [couple?.id]);

  useEffect(() => {
    if (!couple || !pointer?.currentRoundId) {
      setRound(null);
      return;
    }
    return subscribeToRound(couple.id, pointer.currentRoundId, setRound);
  }, [couple?.id, pointer?.currentRoundId]);

  useEffect(() => {
    setDraft("");
  }, [round?.id]);

  async function handlePickMode(modeId: PlayModeId) {
    if (!couple) return;
    setBusy(true);
    try {
      await startSession(couple.id, couple.playedQuestionIds, modeId);
    } catch (err: any) {
      alert("Couldn't start", err?.message ?? "Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleAdvance() {
    if (!couple || !pointer) return;
    setBusy(true);
    try {
      await advanceSession(couple.id, couple.playedQuestionIds, pointer);
    } catch (err: any) {
      alert("Couldn't continue", err?.message ?? "Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleExit() {
    if (!couple) return;
    await exitSession(couple.id).catch(() => {});
  }

  async function handleAnswer(answer: string) {
    if (!couple || !round || !answer.trim()) return;
    setBusy(true);
    try {
      await submitRoundAnswer(couple.id, round.id, uid, answer.trim());
    } catch (err: any) {
      alert("Couldn't send answer", err?.message ?? "Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (pointer === undefined) return null;

  const sessionFinished = Boolean(pointer?.mode && !pointer.currentRoundId && pointer.sessionTotal);

  // ---- Mode selector (nothing active, never played, or exited) ----
  if (!pointer?.currentRoundId && !sessionFinished) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Pick something to play</Text>
        <Text style={styles.subheading}>
          Quizzes, ratings, this-or-that, deep questions — see how you two compare.
        </Text>
        {PLAY_MODES.map((mode) => (
          <View key={mode.id} style={styles.modeCard}>
            <Text style={styles.modeEmoji}>{mode.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.modeTitle}>{mode.title}</Text>
              <Text style={styles.modeDescription}>{mode.description}</Text>
            </View>
            <Button
              title="Play"
              onPress={() => handlePickMode(mode.id)}
              loading={busy}
              style={styles.modeButton}
            />
          </View>
        ))}
      </ScrollView>
    );
  }

  // ---- Session complete ----
  if (sessionFinished && pointer) {
    const mode = PLAY_MODES.find((m) => m.id === pointer.mode);
    return (
      <View style={styles.centered}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>{mode?.title} complete!</Text>
        <Text style={styles.subtitle}>
          You got through all {pointer.sessionTotal} questions. Want to go again, or try
          something else?
        </Text>
        <Button
          title={`Play ${mode?.title} again`}
          onPress={() => pointer.mode && handlePickMode(pointer.mode)}
          loading={busy}
        />
        <Button title="Choose another mode" variant="secondary" onPress={handleExit} style={styles.secondAction} />
      </View>
    );
  }

  // ---- Active round ----
  if (!round) return null;

  const myAnswer = round.answers[uid];
  const partnerAnswer = partner ? round.answers[partner.uid] : undefined;
  const bothAnswered = Boolean(myAnswer && partner && partnerAnswer);
  const mode = pointer?.mode ? PLAY_MODES.find((m) => m.id === pointer.mode) : null;
  const isLastInSession = Boolean(pointer?.sessionTotal && pointer.sessionIndex >= pointer.sessionTotal);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {mode?.length && (
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>
            {mode.emoji} {mode.title} — {pointer?.sessionIndex} of {pointer?.sessionTotal}
          </Text>
          <Text style={styles.exitLink} onPress={handleExit}>
            Exit
          </Text>
        </View>
      )}

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
        <Button
          title={isLastInSession ? "Finish" : "Next question"}
          onPress={handleAdvance}
          loading={busy}
          style={styles.nextButton}
        />
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
  title: { fontSize: 24, fontWeight: "800", color: colors.text, textAlign: "center" },
  subtitle: { fontSize: 14, color: colors.textMuted, textAlign: "center", marginBottom: spacing.lg },
  secondAction: { marginTop: spacing.sm },
  heading: { fontSize: 22, fontWeight: "800", color: colors.text },
  subheading: { fontSize: 14, color: colors.textMuted, marginBottom: spacing.xs },
  modeCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  modeEmoji: { fontSize: 32 },
  modeTitle: { fontSize: 16, fontWeight: "700", color: colors.text },
  modeDescription: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  modeButton: { paddingHorizontal: spacing.lg },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressText: { fontSize: 13, fontWeight: "700", color: colors.secondary },
  exitLink: { fontSize: 13, color: colors.textMuted, textDecorationLine: "underline" },
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
