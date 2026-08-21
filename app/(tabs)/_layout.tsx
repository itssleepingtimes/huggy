import { Redirect, Tabs } from "expo-router";
import { Platform } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/useAuthStore";
import { colors, shadow } from "@/theme";

// iOS's home-indicator swipe bar overlays web content unless space is explicitly reserved for
// it. useSafeAreaInsets() is meant to detect that automatically, but its web implementation
// depends on browser CSS env() support timing that isn't fully reliable in practice — so on
// web we always reserve at least this much room regardless of what it reports.
const MIN_WEB_BOTTOM_INSET = 24;

export default function TabsLayout() {
  const firebaseUser = useAuthStore((s) => s.firebaseUser);
  const profile = useAuthStore((s) => s.profile);
  const insets = useSafeAreaInsets();

  if (!firebaseUser) {
    return <Redirect href="/(auth)/login" />;
  }
  if (!profile?.coupleId) {
    return <Redirect href="/(auth)/pair" />;
  }

  const bottomInset =
    Platform.OS === "web" ? Math.max(insets.bottom, MIN_WEB_BOTTOM_INSET) : insets.bottom;
  const barHeight = 64 + bottomInset;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600", marginTop: 2 },
        tabBarItemStyle: { paddingTop: 6 },
        tabBarStyle: {
          height: barHeight,
          paddingBottom: bottomInset || 10,
          paddingTop: 8,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          ...shadow.card,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "heart" : "heart-outline"} color={color} size={26} />
          ),
        }}
      />
      <Tabs.Screen
        name="play"
        options={{
          title: "Play",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "game-controller" : "game-controller-outline"}
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "time" : "time-outline"} color={color} size={26} />
          ),
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          title: "Timeline",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "images" : "images-outline"} color={color} size={26} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} color={color} size={26} />
          ),
        }}
      />
    </Tabs>
  );
}
