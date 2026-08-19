import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/config";
import type { Place } from "@/types";

export function subscribeToPlaces(coupleId: string, callback: (places: Place[]) => void) {
  const q = query(collection(db, "couples", coupleId, "places"), orderBy("name"));
  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => ({
        id: d.id,
        name: d.data().name,
        icon: d.data().icon,
        lat: d.data().lat,
        lng: d.data().lng,
        radius: d.data().radius,
        createdBy: d.data().createdBy,
      }))
    );
  });
}

export async function addPlace(
  coupleId: string,
  createdBy: string,
  place: { name: string; icon: string; lat: number; lng: number; radius: number }
) {
  await addDoc(collection(db, "couples", coupleId, "places"), { ...place, createdBy });
}

export async function removePlace(coupleId: string, placeId: string) {
  await deleteDoc(doc(db, "couples", coupleId, "places", placeId));
}
