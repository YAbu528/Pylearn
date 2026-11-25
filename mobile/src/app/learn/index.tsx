import { Link, type Href } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { lessons } from "@/data/lessons";
import { palette, ScreenShell } from "@/components/screen-shell";

export default function LearnScreen() {
  const beginnerLessons = lessons.filter((lesson) => lesson.level === "BEGINNER");
  const intermediateLessons = lessons.filter((lesson) => lesson.level === "INTERMEDIATE");

  return (
    <ScreenShell
      eyebrow="LEARNING PATH"
      title="Learn Python, one idea at a time."
      description="Start with the foundations, then build toward the tools used in real Python programs."
    >
      <View style={styles.summary}>
        <Text style={styles.summaryNumber}>{lessons.length}</Text>
        <View style={styles.summaryCopy}>
          <Text style={styles.summaryTitle}>Lessons available</Text>
          <Text style={styles.summaryDescription}>The first set of lessons from the existing PyLearn curriculum.</Text>
        </View>
      </View>
      <LessonGroup title="PYTHON FOUNDATIONS" subtitle="Start here · Beginner" items={beginnerLessons} />
      <LessonGroup title="BUILDING YOUR SKILLS" subtitle="Continue learning · Intermediate" items={intermediateLessons} />
      <Text style={styles.note}>Your lesson choices are available offline in this build. Progress and XP are not being saved yet.</Text>
    </ScreenShell>
  );
}

function LessonGroup({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: typeof lessons;
}) {
  return (
    <View style={styles.group}>
      <View style={styles.groupHeading}>
        <Text style={styles.groupTitle}>{title}</Text>
        <Text style={styles.groupSubtitle}>{subtitle}</Text>
      </View>
      {items.map((lesson) => {
        const lessonNumber = lessons.findIndex((item) => item.slug === lesson.slug) + 1;
        return (
          <Link key={lesson.slug} href={("/learn/" + lesson.slug) as Href} asChild>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={"Open lesson " + lessonNumber + ": " + lesson.title}
              style={({ pressed }) => [styles.lessonRow, pressed && styles.lessonPressed]}
            >
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>{String(lessonNumber).padStart(2, "0")}</Text>
              </View>
              <View style={styles.lessonCopy}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonMeta}>{lesson.level} · READ & QUIZ</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  summary: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: palette.dark, borderRadius: 18, borderCurve: "continuous", padding: 18 },
  summaryNumber: { color: "#FFFFFF", fontSize: 34, fontWeight: "900" },
  summaryCopy: { flex: 1, gap: 3 },
  summaryTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  summaryDescription: { color: "#C6D1E7", fontSize: 12, lineHeight: 18 },
  group: { gap: 10 },
  groupHeading: { gap: 3, paddingTop: 4 },
  groupTitle: { color: palette.ink, fontSize: 12, fontWeight: "900", letterSpacing: 1.1 },
  groupSubtitle: { color: palette.muted, fontSize: 12 },
  lessonRow: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: palette.surface, borderColor: palette.line, borderWidth: 1, borderRadius: 15, borderCurve: "continuous", padding: 13, minHeight: 76 },
  lessonPressed: { borderColor: palette.blue, backgroundColor: "#F7F9FF", opacity: 0.88 },
  numberCircle: { width: 38, height: 38, borderRadius: 12, backgroundColor: palette.paleBlue, alignItems: "center", justifyContent: "center" },
  numberText: { color: palette.blue, fontSize: 12, fontWeight: "900" },
  lessonCopy: { flex: 1, gap: 5 },
  lessonTitle: { color: palette.ink, fontSize: 14, lineHeight: 19, fontWeight: "800" },
  lessonMeta: { color: palette.muted, fontSize: 9, fontWeight: "800", letterSpacing: 0.8 },
  arrow: { color: palette.blue, fontSize: 25, fontWeight: "500" },
  note: { color: palette.muted, fontSize: 11, lineHeight: 17, paddingHorizontal: 2 },
});
