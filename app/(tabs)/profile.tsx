import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text } from "react-native";
import { useAuthStore } from "@/store/useAuthStore";
import { useCoupleStore } from "@/store/useCoupleStore";
import { signOut } from "@/firebase/auth";
import { updateAnniversaryDate } from "@/services/couple";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { colors, spacing } from "@/theme";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export default function Profile() {
  const name = useAuthStore((s) => s.profile?.name ?? "");
  const couple = useCoupleStore((s) => s.couple);
  const partner = useCoupleStore((s) => s.partner);

  const [dateDraft, setDateDraft] = useState(couple?.anniversaryDate ?? "");
  const [savingDate, setSavingDate] = useState(false);

  useEffect(() => {
    setDateDraft(couple?.anniversaryDate ?? "");
  }, [couple?.anniversaryDate]);

  async function handleSaveDate() {
    if (!couple) return;
    if (!DATE_PATTERN.test(dateDraft)) {
      Alert.alert("Invalid date", "Use the format YYYY-MM-DD, e.g. 2024-02-14.");
      return;
    }
    setSavingDate(true);
    try {
      await updateAnniversaryDate(couple.id, dateDraft);
    } catch (err: any) {
      Alert.alert("Couldn't save", err?.message ?? "Please try again.");
    } finally {
      setSavingDate(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Profile</Text>

      <Card>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.sub}>
          {partner ? `Paired with ${partner.name}` : "Waiting for your partner to join"}
        </Text>
      </Card>

      {couple && !partner && couple.inviteCode && (
        <Card style={styles.inviteCard}>
          <Text style={styles.cardLabel}>Your invite code</Text>
          <Text style={styles.inviteCode}>{couple.inviteCode}</Text>
          <Text style={styles.sub}>Share this with your partner so they can pair with you.</Text>
        </Card>
      )}

      <Card>
        <Text style={styles.cardLabel}>Anniversary date</Text>
        <TextField
          placeholder="YYYY-MM-DD"
          value={dateDraft}
          onChangeText={setDateDraft}
          keyboardType="numbers-and-punctuation"
        />
        <Button title="Save date" onPress={handleSaveDate} loading={savingDate} />
      </Card>

      <Button title="Sign out" variant="ghost" onPress={() => signOut()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl },
  title: { fontSize: 22, fontWeight: "800", color: colors.text },
  name: { fontSize: 17, fontWeight: "700", color: colors.text },
  sub: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  cardLabel: { fontSize: 12, fontWeight: "700", color: colors.secondary, textTransform: "uppercase" },
  inviteCard: { alignItems: "center" },
  inviteCode: { fontSize: 32, fontWeight: "800", letterSpacing: 4, color: colors.primary },
});
