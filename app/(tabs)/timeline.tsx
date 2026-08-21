import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useAuthStore } from "@/store/useAuthStore";
import { useCoupleStore } from "@/store/useCoupleStore";
import { addMoment, subscribeToMoments } from "@/services/moments";
import { MomentCard } from "@/components/MomentCard";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { colors, radius, shadow, spacing } from "@/theme";
import { alert } from "@/utils/alert";
import type { Moment } from "@/types";

export default function Timeline() {
  const uid = useAuthStore((s) => s.firebaseUser?.uid ?? "");
  const myName = useAuthStore((s) => s.profile?.name ?? "You");
  const couple = useCoupleStore((s) => s.couple);
  const partner = useCoupleStore((s) => s.partner);

  const [moments, setMoments] = useState<Moment[]>([]);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!couple) return;
    return subscribeToMoments(couple.id, setMoments);
  }, [couple?.id]);

  function authorName(momentUid: string) {
    if (momentUid === uid) return myName;
    if (momentUid === partner?.uid) return partner.name;
    return "Partner";
  }

  async function handlePost() {
    if (!couple || !draft.trim()) return;
    setPosting(true);
    try {
      await addMoment(couple.id, uid, draft);
      setDraft("");
    } catch (err: any) {
      alert("Couldn't share", err?.message ?? "Please try again.");
    } finally {
      setPosting(false);
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={moments}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.composer}>
            <TextField
              placeholder="Share a moment, a thought, something that happened today…"
              value={draft}
              onChangeText={setDraft}
              multiline
            />
            <Button title="Share" onPress={handlePost} loading={posting} disabled={!draft.trim()} />
          </View>
        }
        renderItem={({ item }) => <MomentCard moment={item} authorName={authorName(item.uid)} />}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListEmptyComponent={
          <Text style={styles.empty}>No moments yet — share your first one together 💕</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { padding: spacing.lg, paddingBottom: spacing.xl },
  composer: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    gap: spacing.sm,
    ...shadow.card,
  },
  empty: { textAlign: "center", color: colors.textMuted, marginTop: spacing.xl },
});
