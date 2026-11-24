import type { ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type ScreenShellProps = { eyebrow: string; title: string; description: string; children: ReactNode };

export function ScreenShell({ eyebrow, title, description, children }: ScreenShellProps) {
  return (
    <ScrollView style={styles.scroll} contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
      <View style={styles.brandRow}>
        <Text style={styles.wordmark}>PyLearn</Text>
        <Text style={styles.brandCaption}>LEARN · PRACTICE · BUILD</Text>
      </View>
      <View style={styles.heading}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.body}>{children}</View>
      <Text style={styles.footer}>A little progress, every day.</Text>
    </ScrollView>
  );
}

type ContentCardProps = { label?: string; title: string; description: string; tone?: "light" | "dark" | "blue" };

export function ContentCard({ label, title, description, tone = "light" }: ContentCardProps) {
  return (
    <View style={[styles.card, tone === "dark" && styles.darkCard, tone === "blue" && styles.blueCard]}>
      {label ? <Text style={[styles.cardLabel, tone !== "light" && styles.inverseMuted]}>{label}</Text> : null}
      <Text style={[styles.cardTitle, tone !== "light" && styles.inverseText]}>{title}</Text>
      <Text style={[styles.cardDescription, tone !== "light" && styles.inverseMuted]}>{description}</Text>
    </View>
  );
}

export const palette = {
  background: "#F5F7FB", surface: "#FFFFFF", ink: "#172033", muted: "#667287",
  line: "#E3E8F0", blue: "#315FE8", paleBlue: "#EAF0FF", dark: "#17233D",
};

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: palette.background },
  content: { paddingHorizontal: 22, paddingTop: 18, paddingBottom: 34, gap: 24 },
  brandRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  wordmark: { color: palette.ink, fontSize: 24, fontWeight: "900", letterSpacing: -1 },
  brandCaption: { color: palette.muted, fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  heading: { gap: 8 },
  eyebrow: { color: palette.blue, fontSize: 11, fontWeight: "800", letterSpacing: 1.5 },
  title: { color: palette.ink, fontSize: 31, lineHeight: 37, fontWeight: "800", letterSpacing: -0.8 },
  description: { color: palette.muted, fontSize: 15, lineHeight: 23 },
  body: { gap: 14 },
  card: { backgroundColor: palette.surface, borderColor: palette.line, borderWidth: 1, borderRadius: 18, borderCurve: "continuous", padding: 18, gap: 8 },
  darkCard: { backgroundColor: palette.dark, borderColor: palette.dark },
  blueCard: { backgroundColor: palette.paleBlue, borderColor: "#D7E2FF" },
  cardLabel: { color: palette.blue, fontSize: 10, fontWeight: "800", letterSpacing: 1.2 },
  cardTitle: { color: palette.ink, fontSize: 18, lineHeight: 24, fontWeight: "800" },
  cardDescription: { color: palette.muted, fontSize: 14, lineHeight: 21 },
  inverseText: { color: "#FFFFFF" },
  inverseMuted: { color: "#C6D1E7" },
  footer: { color: "#8993A4", fontSize: 11, textAlign: "center", paddingTop: 4 },
});
