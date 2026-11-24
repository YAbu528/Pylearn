import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ContentCard, palette, ScreenShell } from "@/components/screen-shell";

export default function HomeScreen() {
  return (
    <ScreenShell eyebrow="YOUR PYTHON JOURNEY" title="Learn something. Build something." description="A focused space to learn Python step by step, practise what you know, and turn ideas into projects.">
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>YOUR NEXT STEP</Text>
        <Text style={styles.heroTitle}>Start with the foundations.</Text>
        <Text style={styles.heroBody}>Build confidence with the core ideas before moving on to bigger projects.</Text>
        <Link href="/learn" asChild>
          <Pressable accessibilityRole="button" style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <Text style={styles.primaryButtonText}>Explore learning</Text>
            <Text style={styles.buttonArrow}>›</Text>
          </Pressable>
        </Link>
      </View>
      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Your learning space</Text>
        <Text style={styles.sectionHint}>Choose where to go next</Text>
      </View>
      <View style={styles.grid}>
        <Link href="/learn" asChild><Pressable style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}><Text style={styles.tileIndex}>01</Text><Text style={styles.tileTitle}>Learn</Text><Text style={styles.tileBody}>Lessons and concepts</Text></Pressable></Link>
        <Link href="/practice" asChild><Pressable style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}><Text style={styles.tileIndex}>02</Text><Text style={styles.tileTitle}>Practice</Text><Text style={styles.tileBody}>Try Python exercises</Text></Pressable></Link>
        <Link href="/projects" asChild><Pressable style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}><Text style={styles.tileIndex}>03</Text><Text style={styles.tileTitle}>Projects</Text><Text style={styles.tileBody}>Build real things</Text></Pressable></Link>
        <Link href="/profile" asChild><Pressable style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}><Text style={styles.tileIndex}>04</Text><Text style={styles.tileTitle}>Profile</Text><Text style={styles.tileBody}>Your account and progress</Text></Pressable></Link>
      </View>
      <ContentCard label="COMING TO YOUR DASHBOARD" title="Your progress, in one place." description="Lesson completion, XP, streaks, and achievements will appear here once the learning and account foundations are connected." tone="blue" />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: palette.dark, borderRadius: 22, borderCurve: "continuous", padding: 22, gap: 10 },
  heroLabel: { color: "#9FB7FF", fontSize: 10, fontWeight: "800", letterSpacing: 1.4 },
  heroTitle: { color: "#FFFFFF", fontSize: 25, lineHeight: 31, fontWeight: "800" },
  heroBody: { color: "#CFD8E9", fontSize: 14, lineHeight: 21 },
  primaryButton: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 18, backgroundColor: "#FFFFFF", borderRadius: 12, borderCurve: "continuous", paddingHorizontal: 16, paddingVertical: 12, marginTop: 8 },
  primaryButtonText: { color: palette.ink, fontSize: 13, fontWeight: "800" },
  buttonArrow: { color: palette.blue, fontSize: 22, lineHeight: 22, fontWeight: "700" },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
  sectionHeading: { gap: 4 },
  sectionTitle: { color: palette.ink, fontSize: 19, fontWeight: "800" },
  sectionHint: { color: palette.muted, fontSize: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  tile: { width: "48%", flexGrow: 1, minHeight: 116, backgroundColor: "#FFFFFF", borderColor: palette.line, borderWidth: 1, borderRadius: 16, borderCurve: "continuous", padding: 15, gap: 5 },
  tilePressed: { borderColor: palette.blue, backgroundColor: "#F7F9FF" },
  tileIndex: { color: palette.blue, fontSize: 10, fontWeight: "900", letterSpacing: 1 },
  tileTitle: { color: palette.ink, fontSize: 16, fontWeight: "800" },
  tileBody: { color: palette.muted, fontSize: 11, lineHeight: 16 },
});
