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
      UIBackgroundModes: ["remote-notification"],
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
    permissions: ["POST_NOTIFICATIONS"],
  },
  web: {
    favicon: "./assets/favicon.png",
    output: "static",
    bundler: "metro",
  },
  plugins: [
    "expo-router",
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
