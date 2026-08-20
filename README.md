# Huggy

**Live at: https://huggy-afead.web.app**

A private daily-use app for two — couple pairing, a shared text timeline, a "thinking of you" poke, a couple streak, and a Play tab full of quizzes, this-or-that, rating questions, and deep prompts to work through together.

Built with Expo SDK 54 (React Native + TypeScript) + Expo Router, and Firebase (Auth, Firestore, Cloud Messaging, Hosting). Deployed as a web app (PWA) rather than a native install, since that works from any device/network for free with no Apple Developer account needed — open the URL above on both phones, "Add to Home Screen" for an app-like icon, and it just works.

Everything runs on Firebase's free Spark plan — the optional push-notification relay (step 2.5 below) is the only piece that needs the paid Blaze plan, and stays free in practice at this app's scale. Without it, "thinking of you" pokes still show up instantly while the app is open, just not as a background push notification when it's closed.

## Deploying updates

```bash
npm run deploy:web
```

This rebuilds the web bundle and pushes it to Firebase Hosting at the URL above — nothing needs to stay running on your computer between deploys.

## 1. Prerequisites

- Node.js 20+ and npm (already used to scaffold this project)
- A free [Firebase account](https://console.firebase.google.com/) — Google account
- **Expo Go** installed on your phone (from the App Store / Play Store) — check that its "Supported SDK" (Settings tab inside the app) is 54 or newer, since Expo Go only supports the SDK version it currently ships with
- Two phones (yours + your partner's) for real end-to-end testing, or one phone + one simulator

## 2. Create your Firebase project

1. Go to the [Firebase console](https://console.firebase.google.com/) → **Add project** → name it (e.g. "huggy") → finish the wizard.
2. **Authentication** → Get started → enable the **Email/Password** sign-in provider.
3. **Firestore Database** → Create database → start in **production mode** → pick a region close to you and your partner.
4. **Project settings** (gear icon) → **Your apps** → click the **Web** icon (`</>`) → register an app (any nickname) → copy the `firebaseConfig` values shown.
5. Optional — **upgrade to the Blaze (pay-as-you-go) plan** — only needed for the Cloud Function that relays "thinking of you" pokes as push notifications when the app is closed. Usage for two people stays within Blaze's free-forever quota, but it requires a billing method on file. Skip this if you'd rather not add a card — everything else (auth, pairing, timeline, streak, the Play tab) works on the free Spark plan without it; you'll just only see poke alerts while the app is open.

## 3. Configure the app

```bash
cp .env.example .env
```

Fill in `.env` with the Firebase web config values from step 2.4, plus (optional) `EXPO_PUBLIC_EAS_PROJECT_ID` if you want push notification tokens to register — get it by running `npx eas init` once you have an Expo account.

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

## 5. Local development (optional)

```bash
npm install
npm start
```

Scan the QR code with Expo Go on your phone (or press `i`/`a` for a simulator/emulator, or `w` for a local web preview) — useful for quick iteration while making changes. For actual daily use, though, just use the deployed URL at the top of this file; run `npm run deploy:web` whenever you want to push changes live.

## Installing on your phone

1. Open **https://huggy-afead.web.app** in Safari (iPhone) — Chrome works too but Safari gives the best "installed app" feel on iOS.
2. Tap the **Share** button → **Add to Home Screen**.
3. It now behaves like a real app: its own icon, launches full-screen without browser chrome.

## Project structure

```
app/                    Expo Router screens
  (auth)/                login, signup, pairing
  (tabs)/                home, play, timeline, profile
src/
  firebase/               Firebase client setup (auth, firestore)
  services/               all Firestore/notification read-write logic
  store/                  Zustand stores (auth, couple) backed by Firestore listeners
  components/             shared UI pieces
  data/questions.ts        bundled question bank (quizzes, this-or-that, ratings, prompts)
functions/                Cloud Function: relays pokes to push notifications
firestore.rules           couple-membership-scoped security rules
```

## Notes & limitations

- The shared timeline is text-only by design — Firebase Storage (needed for photo uploads) now requires the paid Blaze plan even for tiny amounts of data, so photos were left out to keep the whole app on the free Spark plan.
- Only two people can join a couple — the invite code is deleted once used.
- Anniversary date is entered as free text (`YYYY-MM-DD`) to avoid pulling in a native date-picker dependency; validated on save.
- The streak counts a day only once **both** partners have opened the app that day.
- The Play tab draws from a bundled question bank (`src/data/questions.ts`, ~100 questions across Deep Talk, Future & Dreams, This or That, Rate It, About Us quiz, and Fun & Random categories) and avoids repeats per couple until the whole bank is exhausted, then reshuffles. Add more questions any time by appending to that file — no backend changes needed.
