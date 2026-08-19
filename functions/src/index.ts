import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { logger } from "firebase-functions/v2";

initializeApp();
const db = getFirestore();

async function sendExpoPush(pushToken: string, title: string, body: string) {
  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ to: pushToken, title, body, sound: "default" }),
  });
  if (!response.ok) {
    logger.error("Expo push failed", { status: response.status, body: await response.text() });
  }
}

async function getPartner(coupleId: string, actingUid: string) {
  const coupleSnap = await db.collection("couples").doc(coupleId).get();
  const memberIds: string[] = coupleSnap.data()?.memberIds ?? [];
  const partnerUid = memberIds.find((id) => id !== actingUid);
  if (!partnerUid) return null;

  const [actingSnap, partnerSnap] = await Promise.all([
    db.collection("users").doc(actingUid).get(),
    db.collection("users").doc(partnerUid).get(),
  ]);
  const partnerToken = partnerSnap.data()?.expoPushToken as string | undefined;
  const actingName = (actingSnap.data()?.name as string | undefined) ?? "Your partner";
  if (!partnerToken) return null;

  return { partnerToken, actingName };
}

export const onPokeCreated = onDocumentCreated(
  "couples/{coupleId}/pokes/{pokeId}",
  async (event) => {
    const data = event.data?.data();
    if (!data) return;
    const { coupleId } = event.params;

    const partner = await getPartner(coupleId, data.fromUid);
    if (!partner) return;

    await sendExpoPush(partner.partnerToken, "💗 Thinking of you", `${partner.actingName} is thinking of you`);
  }
);

export const onPlaceEventCreated = onDocumentCreated(
  "couples/{coupleId}/placeEvents/{eventId}",
  async (event) => {
    const data = event.data?.data();
    if (!data) return;
    const { coupleId } = event.params;

    const partner = await getPartner(coupleId, data.uid);
    if (!partner) return;

    const verb = data.type === "arrive" ? "arrived at" : "left";
    await sendExpoPush(
      partner.partnerToken,
      "📍 Location update",
      `${partner.actingName} just ${verb} ${data.placeName}`
    );
  }
);
