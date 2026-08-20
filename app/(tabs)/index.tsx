import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";
import { useCoupleStore } from "@/store/useCoupleStore";
import { recordAppOpen } from "@/services/streak";
import { sendPoke, subscribeToIncomingPokes } from "@/services/pokes";
import { DdayCounter } from "@/components/DdayCounter";
import { StreakBadge } from "@/components/StreakBadge";
import { Button } from "@/components/Button";
import { colors, radius, spacing } from "@/theme";
import { todayKey } from "@/firebase/firestore";
import { alert } from "@/utils/alert";

export default function Home() {
  const uid = useAuthStore((s) => s.firebaseUser?.uid ?? "");
  const name = useAuthStore((s) => s.profile?.name ?? "");
  const couple = useCoupleStore((s) => s.couple);
  const partner = useCoupleStore((s) => s.partner);
  const router = useRouter();

  const [poking, setPoking] = useState(false);

  useEffect(() => {
    if (!couple || !uid) return;
    recordAppOpen(couple.id, uid, partner?.uid ?? null).catch(() => {});
    // Re-runs once partner data finishes loading (partner?.uid flips from undefined to a
    // real uid) so the "both opened today" check still completes even if this ran once
    // already with no partner known yet — recordAppOpen is idempotent, safe to call again.
  }, [couple?.id, uid, partner?.uid]);

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

      <View style={styles.playCard}>
        <Text style={styles.playTitle}>🎲 Question of the moment</Text>
        <Text style={styles.playSubtitle}>
          Quizzes, ratings, this-or-that, deep questions — jump into the Play tab and see how you
          two compare.
        </Text>
        <Button title="Play now" onPress={() => router.push("/(tabs)/play")} />
      </View>

      <View style={styles.pokeCard}>
        <Text style={styles.pokeTitle}>Send a little love</Text>
        <Text style={styles.pokeSubtitle}>
          {partner ? `Let ${partner.name} know you're thinking of them` : "Waiting for your partner to join"}
        </Text>
        <Button title="💗 Thinking of you" onPress={handlePoke} loading={poking} disabled={!partner} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl },
  greeting: { fontSize: 22, fontWeight: "800", color: colors.text },
  playCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  playTitle: { fontSize: 16, fontWeight: "700", color: colors.text },
  playSubtitle: { fontSize: 13, color: colors.textMuted },
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
});
