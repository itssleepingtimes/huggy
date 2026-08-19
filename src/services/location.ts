import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Battery from "expo-battery";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { addDoc, collection, doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { toMillis } from "@/firebase/firestore";
import type { PartnerLocation, Place, PlaceEvent } from "@/types";

const TASK_LOCATION = "huggy-background-location";
const TASK_GEOFENCE = "huggy-geofence";
const CONTEXT_KEY = "huggy:trackingContext";

type TrackingContext = { uid: string; coupleId: string; places: Place[] };

async function getContext(): Promise<TrackingContext | null> {
  const raw = await AsyncStorage.getItem(CONTEXT_KEY);
  return raw ? JSON.parse(raw) : null;
}

async function setContext(ctx: TrackingContext) {
  await AsyncStorage.setItem(CONTEXT_KEY, JSON.stringify(ctx));
}

async function writeLocation(coupleId: string, uid: string, coords: Location.LocationObjectCoords) {
  let battery: number | null = null;
  try {
    battery = await Battery.getBatteryLevelAsync();
  } catch {
    battery = null;
  }
  await setDoc(
    doc(db, "couples", coupleId, "locations", uid),
    {
      lat: coords.latitude,
      lng: coords.longitude,
      heading: coords.heading ?? null,
      speed: coords.speed ?? null,
      battery,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

async function recordPlaceEvent(
  coupleId: string,
  uid: string,
  placeId: string,
  placeName: string,
  type: "arrive" | "leave"
) {
  await addDoc(collection(db, "couples", coupleId, "placeEvents"), {
    uid,
    placeId,
    placeName,
    type,
    timestamp: serverTimestamp(),
  });
}

if (!TaskManager.isTaskDefined(TASK_LOCATION)) {
  TaskManager.defineTask(TASK_LOCATION, async ({ data, error }) => {
    if (error) return;
    const ctx = await getContext();
    if (!ctx) return;
    const { locations } = (data as { locations: Location.LocationObject[] }) ?? { locations: [] };
    const latest = locations?.[locations.length - 1];
    if (!latest) return;
    await writeLocation(ctx.coupleId, ctx.uid, latest.coords).catch(() => {});
  });
}

if (!TaskManager.isTaskDefined(TASK_GEOFENCE)) {
  TaskManager.defineTask(TASK_GEOFENCE, async ({ data, error }) => {
    if (error) return;
    const ctx = await getContext();
    if (!ctx) return;
    const { eventType, region } = (data as {
      eventType: Location.GeofencingEventType;
      region: Location.LocationRegion;
    }) ?? {};
    const place = ctx.places.find((p) => p.id === region?.identifier);
    if (!place) return;
    const type = eventType === Location.GeofencingEventType.Enter ? "arrive" : "leave";
    await recordPlaceEvent(ctx.coupleId, ctx.uid, place.id, place.name, type).catch(() => {});
  });
}

export async function requestLocationPermissions(): Promise<{
  foreground: boolean;
  background: boolean;
}> {
  const fg = await Location.requestForegroundPermissionsAsync();
  if (fg.status !== "granted") return { foreground: false, background: false };
  try {
    const bg = await Location.requestBackgroundPermissionsAsync();
    return { foreground: true, background: bg.status === "granted" };
  } catch {
    // Background permission isn't available in Expo Go — foreground-only tracking still works.
    return { foreground: true, background: false };
  }
}

/** Foreground tracking: updates the live location doc while the app is open. Call the returned
 * function to stop. Works in Expo Go. */
export function startForegroundTracking(coupleId: string, uid: string) {
  let subscription: Location.LocationSubscription | null = null;

  Location.watchPositionAsync(
    { accuracy: Location.Accuracy.Balanced, timeInterval: 15_000, distanceInterval: 25 },
    (location) => {
      writeLocation(coupleId, uid, location.coords).catch(() => {});
    }
  ).then((sub) => {
    subscription = sub;
  });

  return () => subscription?.remove();
}

/** Background tracking: keeps updating the live location doc even when the app is backgrounded
 * or killed. Requires a custom dev/production build — not available in Expo Go. */
export async function startBackgroundTracking(coupleId: string, uid: string): Promise<boolean> {
  try {
    const existing = await getContext();
    await setContext({ uid, coupleId, places: existing?.places ?? [] });
    const alreadyRunning = await Location.hasStartedLocationUpdatesAsync(TASK_LOCATION);
    if (alreadyRunning) return true;
    await Location.startLocationUpdatesAsync(TASK_LOCATION, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 60_000,
      distanceInterval: 50,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "Huggy is sharing your location",
        notificationBody: "Your partner can see where you are.",
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function stopBackgroundTracking() {
  try {
    const running = await Location.hasStartedLocationUpdatesAsync(TASK_LOCATION);
    if (running) await Location.stopLocationUpdatesAsync(TASK_LOCATION);
  } catch {
    // no-op — background tracking wasn't available (e.g. Expo Go)
  }
}

/** Registers geofences for the couple's saved places so arrive/leave events get recorded even
 * when the app is closed. Requires a custom dev/production build. */
export async function syncGeofences(coupleId: string, uid: string, places: Place[]): Promise<boolean> {
  await setContext({ uid, coupleId, places });
  if (places.length === 0) {
    await stopGeofencing();
    return true;
  }
  try {
    await Location.startGeofencingAsync(
      TASK_GEOFENCE,
      places.map((p) => ({
        identifier: p.id,
        latitude: p.lat,
        longitude: p.lng,
        radius: p.radius,
        notifyOnEnter: true,
        notifyOnExit: true,
      }))
    );
    return true;
  } catch {
    return false;
  }
}

export async function stopGeofencing() {
  try {
    const running = await Location.hasStartedGeofencingAsync(TASK_GEOFENCE);
    if (running) await Location.stopGeofencingAsync(TASK_GEOFENCE);
  } catch {
    // no-op
  }
}

export function subscribeToPartnerLocation(
  coupleId: string,
  partnerUid: string,
  callback: (location: PartnerLocation | null) => void
) {
  return onSnapshot(doc(db, "couples", coupleId, "locations", partnerUid), (snap) => {
    const data = snap.data();
    if (!data) {
      callback(null);
      return;
    }
    callback({
      uid: partnerUid,
      lat: data.lat,
      lng: data.lng,
      heading: data.heading ?? null,
      speed: data.speed ?? null,
      battery: data.battery ?? null,
      updatedAt: toMillis(data.updatedAt),
    });
  });
}

export type { PlaceEvent };
