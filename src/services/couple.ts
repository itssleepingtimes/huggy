import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export async function updateAnniversaryDate(coupleId: string, date: string) {
  await setDoc(doc(db, "couples", coupleId), { anniversaryDate: date }, { merge: true });
}
