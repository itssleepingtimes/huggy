# Huggy

A private daily-use app for two — couple pairing, a shared text timeline, daily questions, a "thinking of you" poke, and Life360-style live location sharing with arrival/departure alerts for saved places.

Built with Expo (React Native + TypeScript) + Expo Router, and Firebase (Auth, Firestore, Cloud Messaging). Everything runs on Firebase's free Spark plan — the optional push-notification relay (step 2.4 below) is the only piece that needs the paid Blaze plan, and stays free in practice at this app's scale.

## 1. Prerequisites

- Node.js 20+ and npm (already used to scaffold this project)
- A free [Expo account](https://expo.dev/signup) (for EAS builds)
- A free [Firebase account](https://console.firebase.google.com/) — Google account
- Two phones (yours + your partner's) for real end-to-end testing, or one phone + one simulator

## 2. Create your Firebase project

1. Go to the [Firebase console](https://console.firebase.google.com/) → **Add project** → name it (e.g. "huggy") → finish the wizard.
2. **Authentication** → Get started → enable the **Email/Password** sign-in provider.
3. **Firestore Database** → Create database → start in **production mode** → pick a region close to you and your partner.
4. **Project settings** (gear icon) → **Your apps** → click the **Web** icon (`</>`) → register an app (any nickname) → copy the `firebaseConfig` values shown.
5. Optional — **upgrade to the Blaze (pay-as-you-go) plan** — only needed for the Cloud Function that relays push notifications (pokes + place arrival/departure alerts) when the app is closed. Usage for two people stays within Blaze's free-forever quota, but it requires a billing method on file. Skip this if you'd rather not add a card — everything else (auth, pairing, timeline, prompts, streak, live map while the app is open) works on the free Spark plan without it.

## 3. Configure the app

```bash
cp .env.example .env
```

Fill in `.env` with the Firebase web config values from step 2.4, plus:

- `EXPO_PUBLIC_ANDROID_GOOGLE_MAPS_API_KEY` — optional but needed for the map to render on Android. Get one free from [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → Create API key, then enable the "Maps SDK for Android" API for your project. iOS uses Apple Maps and needs no key.
- `EXPO_PUBLIC_EAS_PROJECT_ID` — needed for push notification tokens. You'll get this in step 6 after running `eas init`.

## 4. Install the Firebase CLI and deploy security rules + functions

```bash
npm install -g firebase-tools
firebase login
firebase use --add   # pick the Firebase project you created above
```

Deploy Firestore rules (safe to do anytime, no Blaze plan needed):

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

Deploy the push-notification relay function (requires the Blaze plan from step 2.5 — skip this if you didn't upgrade):

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

## 5. Run it in Expo Go (fastest iteration loop)

```bash
npm install
npm start
```

Scan the QR code with Expo Go on your phone (or press `i`/`a` for a simulator/emulator). Everything works here **except** background/killed-app location tracking and geofencing — those need a dev build (next step). Sign up, create a couple, and open the invite code on a second device/account to pair and test the timeline, daily prompts, streak, and poke.

## 6. Build a dev client for full Life360-style tracking

Background location and geofencing require native modules that Expo Go doesn't include.

```bash
npm install -g eas-cli
eas login
eas init          # links this project to your Expo account, prints an EAS project ID
```

Copy the printed project ID into `EXPO_PUBLIC_EAS_PROJECT_ID` in `.env`, then:

```bash
eas build --profile development --platform android   # or ios
```

Install the resulting build on both phones (the CLI gives you a link/QR code), then run:

```bash
npx expo start --dev-client
```

Open the dev client app on both phones instead of Expo Go. Now the "Always-on sharing" toggle on the Map tab and place arrival/departure push alerts work fully, including when the app is closed.

## Project structure

```
app/                    Expo Router screens
  (auth)/                login, signup, pairing
  (tabs)/                home, map, timeline, profile
src/
  firebase/               Firebase client setup (auth, firestore)
  services/               all Firestore/location/notification read-write logic
  store/                  Zustand stores (auth, couple) backed by Firestore listeners
  components/             shared UI pieces
  data/prompts.ts          bundled daily question list
functions/                Cloud Function: relays pokes + place events to push notifications
firestore.rules           couple-membership-scoped security rules
```

## Notes & limitations

- The shared timeline is text-only by design — Firebase Storage (needed for photo uploads) now requires the paid Blaze plan even for tiny amounts of data, so photos were left out to keep the whole app on the free Spark plan. Add photo support later by re-introducing `firebase/storage` and an image picker once you're OK with Blaze.
- Only two people can join a couple — the invite code is deleted once used.
- Anniversary date is entered as free text (`YYYY-MM-DD`) to avoid pulling in a native date-picker dependency; validated on save.
- The streak counts a day only once **both** partners have opened the app that day.
- Background location polls roughly every 60s / 50m of movement to balance battery life against freshness — tune `timeInterval`/`distanceInterval` in `src/services/location.ts` if you want tighter tracking.
