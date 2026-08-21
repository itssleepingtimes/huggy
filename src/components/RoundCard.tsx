import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { colors, radius, shadow, spacing } from "@/theme";
import type { Round } from "@/types";

const RATING_SCALE = Array.from({ length: 10 }, (_, i) => String(i + 1));

type Props = {
  round: Round;
  uid: string;
  myName: string;
  partner: { uid: string; name: string } | null;
  onAnswer: (answer: string) => void | Promise<void>;
  busy?: boolean;
};

export function RoundCard({ round, uid, myName, partner, onAnswer, busy }: Props) {
  const [draft, setDraft] = useState("");

  useEffect(() => {
    setDraft("");
  }, [round.id]);

  const myAnswer = round.answers[uid];
  const partnerAnswer = partner ? round.answers[partner.uid] : undefined;
  const bothAnswered = Boolean(myAnswer && partner && partnerAnswer);

  return (
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
                onPress={() => onAnswer(draft)}
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
                  onPress={() => onAnswer(option)}
                  disabled={busy}
                />
              ))}
            </View>
          )}

          {round.type === "dare" && (
            <Button title="I did it! ✅" onPress={() => onAnswer("done")} loading={busy} />
          )}

          {round.type === "rating" && (
            <View style={styles.ratingRow}>
              {RATING_SCALE.map((n) => (
                <Button
                  key={n}
                  title={n}
                  variant="secondary"
                  onPress={() => onAnswer(n)}
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
            {round.type === "dare"
              ? `Done on your end — waiting for ${partner?.name || "your partner"}…`
              : `You answered "${myAnswer}" — waiting for ${partner?.name || "your partner"}…`}
          </Text>
        </View>
      )}

      {bothAnswered && round.type === "dare" && (
        <View style={styles.reveal}>
          <Text style={styles.matchText}>🎉 Dare complete — nice work, you two!</Text>
        </View>
      )}

      {bothAnswered && round.type !== "dare" && (
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
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
    ...shadow.card,
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
});
