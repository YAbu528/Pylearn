import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { palette } from "@/components/screen-shell";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Tabs screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.blue,
        tabBarInactiveTintColor: palette.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700", paddingBottom: 2 },
        tabBarStyle: { backgroundColor: "#FFFFFF", borderTopColor: palette.line, borderTopWidth: 1, height: 62, paddingTop: 7 },
      }}>
        <Tabs.Screen name="index" options={{ title: "Home", tabBarLabel: "Home" }} />
        <Tabs.Screen name="learn" options={{ title: "Learn", tabBarLabel: "Learn" }} />
        <Tabs.Screen name="practice" options={{ title: "Practice", tabBarLabel: "Practice" }} />
        <Tabs.Screen name="projects" options={{ title: "Projects", tabBarLabel: "Projects" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile", tabBarLabel: "Profile" }} />
      </Tabs>
    </>
  );
}
