import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import { useAuthStore } from "@/store/useAuthStore";
import { useCoupleStore } from "@/store/useCoupleStore";
import { signOut } from "@/firebase/auth";
import { updateAnniversaryDate } from "@/services/couple";
import { addPlace, removePlace, subscribeToPlaces } from "@/services/places";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { colors, radius, spacing } from "@/theme";
import type { Place } from "@/types";

const ICON_OPTIONS = [
  { icon: "🏠", label: "Home" },
  { icon: "💼", label: "Work" },
  { icon: "🏋️", label: "Gym" },
  { icon: "📍", label: "Other" },
];

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export default function Profile() {
  const uid = useAuthStore((s) => s.firebaseUser?.uid ?? "");
  const name = useAuthStore((s) => s.profile?.name ?? "");
  const couple = useCoupleStore((s) => s.couple);
  const partner = useCoupleStore((s) => s.partner);

  const [dateDraft, setDateDraft] = useState(couple?.anniversaryDate ?? "");
  const [savingDate, setSavingDate] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const [addingPlace, setAddingPlace] = useState(false);
  const [placeName, setPlaceName] = useState("");
  const [placeIcon, setPlaceIcon] = useState(ICON_OPTIONS[0].icon);
  const [placeCoords, setPlaceCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [savingPlace, setSavingPlace] = useState(false);

  useEffect(() => {
    setDateDraft(couple?.anniversaryDate ?? "");
  }, [couple?.anniversaryDate]);

  useEffect(() => {
    if (!couple) return;
    return subscribeToPlaces(couple.id, setPlaces);
  }, [couple?.id]);

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

  async function handleStartAddPlace() {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert("Permission needed", "Allow location access to save this place.");
      return;
    }
    const position = await Location.getCurrentPositionAsync({});
    setPlaceCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
    setAddingPlace(true);
  }

  async function handleSavePlace() {
    if (!couple || !placeCoords || !placeName.trim()) return;
    setSavingPlace(true);
    try {
      await addPlace(couple.id, uid, {
        name: placeName.trim(),
        icon: placeIcon,
        lat: placeCoords.lat,
        lng: placeCoords.lng,
        radius: 150,
      });
      setAddingPlace(false);
      setPlaceName("");
      setPlaceIcon(ICON_OPTIONS[0].icon);
      setPlaceCoords(null);
    } catch (err: any) {
      Alert.alert("Couldn't save place", err?.message ?? "Please try again.");
    } finally {
      setSavingPlace(false);
    }
  }

  function handleRemovePlace(place: Place) {
    if (!couple) return;
    Alert.alert("Remove place?", `Delete "${place.name}"`, [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => removePlace(couple.id, place.id) },
    ]);
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

      <Card>
        <Text style={styles.cardLabel}>Saved places</Text>
        {places.map((place) => (
          <Pressable key={place.id} style={styles.placeRow} onLongPress={() => handleRemovePlace(place)}>
            <Text style={styles.placeIcon}>{place.icon}</Text>
            <Text style={styles.placeName}>{place.name}</Text>
            <Text style={styles.placeHint}>hold to remove</Text>
          </Pressable>
        ))}

        {addingPlace ? (
          <View style={styles.addForm}>
            <View style={styles.iconRow}>
              {ICON_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.icon}
                  onPress={() => setPlaceIcon(opt.icon)}
                  style={[styles.iconChip, placeIcon === opt.icon && styles.iconChipActive]}
                >
                  <Text style={styles.placeIcon}>{opt.icon}</Text>
                </Pressable>
              ))}
            </View>
            <TextField placeholder="Name this place" value={placeName} onChangeText={setPlaceName} />
            <View style={styles.addFormActions}>
              <Button title="Cancel" variant="ghost" onPress={() => setAddingPlace(false)} style={styles.flexButton} />
              <Button
                title="Save place"
                onPress={handleSavePlace}
                loading={savingPlace}
                disabled={!placeName.trim()}
                style={styles.flexButton}
              />
            </View>
          </View>
        ) : (
          <Button title="+ Add current location as a place" variant="secondary" onPress={handleStartAddPlace} />
        )}
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
  placeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  placeIcon: { fontSize: 20 },
  placeName: { flex: 1, fontSize: 15, color: colors.text },
  placeHint: { fontSize: 10, color: colors.textMuted },
  addForm: { gap: spacing.sm },
  iconRow: { flexDirection: "row", gap: spacing.sm },
  iconChip: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconChipActive: { borderColor: colors.primary, backgroundColor: "#FFE3EC" },
  addFormActions: { flexDirection: "row", gap: spacing.sm },
  flexButton: { flex: 1 },
});
