import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Huggy",
  slug: "Huggy",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  scheme: "huggy",
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.huggy.app",
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        "Huggy uses your location to show it to your partner on the live map.",
      NSLocationAlwaysAndWhenInUseUsageDescription:
        "Huggy uses your location in the background so your partner can see when you arrive or leave saved places, even when the app is closed.",
      UIBackgroundModes: ["location", "fetch", "remote-notification"],
    },
  },
  android: {
    package: "com.huggy.app",
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/android-icon-foreground.png",
      backgroundImage: "./assets/android-icon-background.png",
      monochromeImage: "./assets/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
    permissions: [
      "ACCESS_COARSE_LOCATION",
      "ACCESS_FINE_LOCATION",
      "ACCESS_BACKGROUND_LOCATION",
      "FOREGROUND_SERVICE",
      "FOREGROUND_SERVICE_LOCATION",
      "POST_NOTIFICATIONS",
    ],
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_ANDROID_GOOGLE_MAPS_API_KEY ?? "",
      },
    },
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-status-bar",
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "Huggy uses your location in the background so your partner can see when you arrive or leave saved places, even when the app is closed.",
        locationAlwaysPermission:
          "Huggy uses your location in the background so your partner can see when you arrive or leave saved places, even when the app is closed.",
        locationWhenInUsePermission:
          "Huggy uses your location to show it to your partner on the live map.",
        isAndroidBackgroundLocationEnabled: true,
        isAndroidForegroundServiceEnabled: true,
      },
    ],
    [
      "expo-notifications",
      {
        icon: "./assets/icon.png",
        color: "#FF5C8A",
      },
    ],
  ],
  extra: {
    router: {},
  },
};

export default config;
