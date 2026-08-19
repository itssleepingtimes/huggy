import { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, Switch, Text, View } from "react-native";
import MapView, { Circle, PROVIDER_GOOGLE } from "react-native-maps";
import { useAuthStore } from "@/store/useAuthStore";
import { useCoupleStore } from "@/store/useCoupleStore";
import {
  requestLocationPermissions,
  startBackgroundTracking,
  startForegroundTracking,
  stopBackgroundTracking,
  subscribeToPartnerLocation,
  syncGeofences,
} from "@/services/location";
import { subscribeToPlaces } from "@/services/places";
import { PartnerMarker } from "@/components/PartnerMarker";
import { colors, radius, spacing } from "@/theme";
import { timeAgo } from "@/utils/time";
import type { PartnerLocation, Place } from "@/types";

const FALLBACK_REGION = {
  latitude: 13.7563,
  longitude: 100.5018,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function MapScreen() {
  const uid = useAuthStore((s) => s.firebaseUser?.uid ?? "");
  const couple = useCoupleStore((s) => s.couple);
  const partner = useCoupleStore((s) => s.partner);

  const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [partnerLocation, setPartnerLocation] = useState<PartnerLocation | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [backgroundEnabled, setBackgroundEnabled] = useState(false);
  const [backgroundSupported, setBackgroundSupported] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    if (!couple || !uid) return;
    let stopForeground: (() => void) | undefined;

    requestLocationPermissions().then(({ foreground }) => {
      if (!foreground) {
        setPermissionDenied(true);
        return;
      }
      stopForeground = startForegroundTracking(couple.id, uid);
    });

    return () => stopForeground?.();
  }, [couple?.id, uid]);

  useEffect(() => {
    if (!couple || !partner) return;
    return subscribeToPartnerLocation(couple.id, partner.uid, setPartnerLocation);
  }, [couple?.id, partner?.uid]);

  useEffect(() => {
    if (!couple) return;
    return subscribeToPlaces(couple.id, setPlaces);
  }, [couple?.id]);

  useEffect(() => {
    if (!couple || !uid || places.length === 0) return;
    syncGeofences(couple.id, uid, places);
  }, [couple?.id, uid, places]);

  useEffect(() => {
    if (partnerLocation) {
      mapRef.current?.animateToRegion(
        {
          latitude: partnerLocation.lat,
          longitude: partnerLocation.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        400
      );
    }
  }, [partnerLocation?.lat, partnerLocation?.lng]);

  async function toggleBackground(value: boolean) {
    if (!couple || !uid) return;
    if (value) {
      const { background } = await requestLocationPermissions();
      if (!background) {
        setBackgroundSupported(false);
        setBackgroundEnabled(false);
        return;
      }
      const started = await startBackgroundTracking(couple.id, uid);
      setBackgroundSupported(started);
      setBackgroundEnabled(started);
    } else {
      await stopBackgroundTracking();
      setBackgroundEnabled(false);
    }
  }

  const initialRegion = partnerLocation
    ? { latitude: partnerLocation.lat, longitude: partnerLocation.lng, latitudeDelta: 0.05, longitudeDelta: 0.05 }
    : FALLBACK_REGION;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {partnerLocation && (
          <PartnerMarker
            lat={partnerLocation.lat}
            lng={partnerLocation.lng}
            label={partner?.name ?? "Partner"}
            emoji="💕"
            color={colors.primary}
          />
        )}
        {places.map((place) => (
          <Circle
            key={place.id}
            center={{ latitude: place.lat, longitude: place.lng }}
            radius={place.radius}
            strokeColor={colors.secondary}
            fillColor="rgba(108,92,231,0.15)"
          />
        ))}
      </MapView>

      <View style={styles.overlay}>
        {permissionDenied && (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>
              Location permission denied — enable it in system settings to share your location.
            </Text>
          </View>
        )}

        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>
            {partner?.name ?? "Your partner"}
          </Text>
          <Text style={styles.statusSub}>
            {partnerLocation
              ? `Last seen ${timeAgo(partnerLocation.updatedAt)}${
                  partnerLocation.battery != null ? ` · 🔋${Math.round(partnerLocation.battery * 100)}%` : ""
                }`
              : "No location shared yet"}
          </Text>
        </View>

        <View style={styles.toggleCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleTitle}>Always-on sharing</Text>
            <Text style={styles.toggleSub}>
              {backgroundSupported
                ? "Keep sharing your location when Huggy is closed"
                : "Needs a dev build — not available in Expo Go"}
            </Text>
          </View>
          <Switch value={backgroundEnabled} onValueChange={toggleBackground} disabled={!backgroundSupported} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  map: { flex: 1 },
  overlay: { position: "absolute", top: spacing.lg, left: spacing.md, right: spacing.md, gap: spacing.sm },
  banner: {
    backgroundColor: colors.danger,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  bannerText: { color: "#fff", fontSize: 12, textAlign: "center" },
  statusCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusTitle: { fontWeight: "700", fontSize: 15, color: colors.text },
  statusSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  toggleCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  toggleTitle: { fontWeight: "700", fontSize: 14, color: colors.text },
  toggleSub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
});
