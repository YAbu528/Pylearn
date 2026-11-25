import { Link, useLocalSearchParams, type Href } from "expo-router";
import { useState, type ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { lessons } from "@/data/lessons";
import { guidedLessons } from "@/data/guided-lessons";
import { palette } from "@/components/screen-shell";

export default function LessonDetailScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const lesson = lessons.find((item) => item.slug === lessonId);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [revealedPractice, setRevealedPractice] = useState<number[]>([]);

  if (!lesson) {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Link href="/learn" style={styles.backLink}>‹  All lessons</Link>
        <Text style={styles.title}>Lesson not found</Text>
        <Text style={styles.body}>This lesson could not be found in the current curriculum.</Text>
      </ScrollView>
    );
  }

  const currentIndex = lessons.findIndex((item) => item.slug === lesson.slug);
  const nextLesson = lessons[currentIndex + 1];
  const guided = guidedLessons[lesson.slug];
  const isCorrect = selectedAnswer === lesson.quiz.answerIndex;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Link href="/learn" style={styles.backLink}>‹  All lessons</Link>
      <View style={styles.heading}>
        <Text style={styles.eyebrow}>LESSON {String(currentIndex + 1).padStart(2, "0")} · {lesson.level}</Text>
        <Text style={styles.title}>{lesson.title}</Text>
        <Text style={styles.body}>{lesson.intro}</Text>
      </View>

      <LessonSection label="THE KEY IDEA" title="Understand the concept">
        <Text style={styles.sectionBody}>{lesson.keyIdea}</Text>
      </LessonSection>

      <LessonSection label="THINK OF IT THIS WAY" title="A simple analogy">
        <Text style={styles.sectionBody}>{lesson.analogy}</Text>
      </LessonSection>

      <LessonSection label="SEE IT IN PYTHON" title="Example code">
        <View style={styles.codeBlock}>
          <Text selectable style={styles.codeText}>{lesson.example}</Text>
        </View>
      </LessonSection>

      <LessonSection label="WHAT YOU WILL LEARN" title="Lesson objectives">
        {lesson.objectives.map((objective, index) => (
          <View key={objective} style={styles.objectiveRow}>
            <Text style={styles.objectiveNumber}>{index + 1}</Text>
            <Text style={styles.objectiveText}>{objective}</Text>
          </View>
        ))}
      </LessonSection>

      {guided ? (
        <>
          <LessonSection label="STEP BY STEP" title="Follow the idea carefully">
            {guided.steps.map((step) => (
              <View key={step.number} style={styles.guidedStep}>
                <View style={styles.guidedNumber}><Text style={styles.guidedNumberText}>{step.number}</Text></View>
                <View style={styles.guidedCopy}>
                  <Text style={styles.guidedTitle}>{step.title}</Text>
                  <Text style={styles.sectionBody}>{step.explanation}</Text>
                </View>
              </View>
            ))}
          </LessonSection>
          <LessonSection label="COMMON MISTAKES" title="Things to watch for">
            {guided.mistakes.map((mistake) => (
              <View key={mistake.title} style={styles.mistake}>
                <Text style={styles.mistakeTitle}>{mistake.title}</Text>
                <Text style={styles.sectionBody}>{mistake.explanation}</Text>
              </View>
            ))}
          </LessonSection>
          <View style={styles.recap}>
            <Text style={styles.recapLabel}>QUICK RECAP</Text>
            <Text style={styles.recapText}>{guided.recap}</Text>
          </View>
          <LessonSection label="OPTIONAL PRACTICE" title="Try it yourself">
            <Text style={styles.practiceIntro}>These extra tasks are ungraded. They do not award XP or change saved progress.</Text>
            {guided.practice.map((task, index) => {
              const revealed = revealedPractice.includes(index);
              return (
                <View key={task.title} style={styles.practiceCard}>
                  <Text style={styles.practiceTitle}>{index + 1}. {task.title}</Text>
                  <Text style={styles.sectionBody}>{task.prompt}</Text>
                  <Text style={styles.practiceLabel}>STARTER CODE</Text>
                  <View style={styles.codeBlock}><Text selectable style={styles.codeText}>{task.starter}</Text></View>
                  <Text style={styles.hintText}>Hint: {task.hint}</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ expanded: revealed }}
                    onPress={() => setRevealedPractice((current) => revealed ? current.filter((item) => item !== index) : [...current, index])}
                    style={({ pressed }) => [styles.solutionButton, pressed && styles.optionPressed]}
                  >
                    <Text style={styles.solutionButtonText}>{revealed ? "Hide solution" : "Show solution"}</Text>
                  </Pressable>
                  {revealed ? (
                    <View style={styles.solutionBlock}>
                      <Text style={styles.practiceLabel}>SAMPLE SOLUTION</Text>
                      <View style={styles.codeBlock}><Text selectable style={styles.codeText}>{task.solution}</Text></View>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </LessonSection>
        </>
      ) : null}

      <LessonSection label="QUICK CHECK" title="Check your understanding">
        <Text style={styles.question}>{lesson.quiz.question}</Text>
        <View style={styles.options}>
          {lesson.quiz.options.map((option, index) => {
            const chosen = selectedAnswer === index;
            const correctOption = selectedAnswer !== null && index === lesson.quiz.answerIndex;
            return (
              <Pressable
                key={option}
                accessibilityRole="button"
                accessibilityState={{ selected: chosen, disabled: selectedAnswer !== null }}
                disabled={selectedAnswer !== null}
                onPress={() => setSelectedAnswer(index)}
                style={({ pressed }) => [
                  styles.option,
                  chosen && (isCorrect ? styles.correctOption : styles.wrongOption),
                  correctOption && styles.correctOption,
                  pressed && selectedAnswer === null && styles.optionPressed,
                ]}
              >
                <Text style={[styles.optionLetter, (chosen || correctOption) && styles.optionEmphasis]}>
                  {String.fromCharCode(65 + index)}
                </Text>
                <Text style={[styles.optionText, (chosen || correctOption) && styles.optionEmphasis]}>{option}</Text>
              </Pressable>
            );
          })}
        </View>
        {selectedAnswer !== null ? (
          <View style={[styles.feedback, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
            <Text style={styles.feedbackTitle}>{isCorrect ? "Correct — nice work!" : "Not quite. Review the answer."}</Text>
            <Text style={styles.feedbackBody}>{lesson.quiz.explanation}</Text>
            {!isCorrect ? <Text style={styles.feedbackBody}>Correct answer: {lesson.quiz.options[lesson.quiz.answerIndex]}</Text> : null}
            <Pressable accessibilityRole="button" onPress={() => setSelectedAnswer(null)} style={styles.retryButton}>
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        ) : null}
      </LessonSection>

      <View style={styles.footerActions}>
        <Text style={styles.footerNote}>This quick check is interactive. Quiz scores and lesson completion are not saved yet.</Text>
        {nextLesson ? (
          <Link href={("/learn/" + nextLesson.slug) as Href} asChild>
            <Pressable accessibilityRole="button" style={({ pressed }) => [styles.nextButton, pressed && styles.nextPressed]}>
              <View style={styles.nextCopy}>
                <Text style={styles.nextLabel}>NEXT LESSON</Text>
                <Text style={styles.nextTitle}>{nextLesson.title}</Text>
              </View>
              <Text style={styles.nextArrow}>›</Text>
            </Pressable>
          </Link>
        ) : (
          <Link href="/learn" asChild>
            <Pressable accessibilityRole="button" style={({ pressed }) => [styles.nextButton, pressed && styles.nextPressed]}>
              <Text style={styles.nextTitle}>Back to all lessons</Text>
              <Text style={styles.nextArrow}>›</Text>
            </Pressable>
          </Link>
        )}
      </View>
    </ScrollView>
  );
}

function LessonSection({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeading}>
        <Text style={styles.sectionLabel}>{label}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: palette.background },
  content: { paddingHorizontal: 22, paddingTop: 18, paddingBottom: 36, gap: 20 },
  backLink: { color: palette.blue, fontSize: 13, fontWeight: "800", paddingVertical: 4 },
  heading: { gap: 8 },
  eyebrow: { color: palette.blue, fontSize: 10, fontWeight: "900", letterSpacing: 1.1 },
  title: { color: palette.ink, fontSize: 28, lineHeight: 34, fontWeight: "900", letterSpacing: -0.6 },
  body: { color: palette.muted, fontSize: 15, lineHeight: 23 },
  section: { backgroundColor: palette.surface, borderColor: palette.line, borderWidth: 1, borderRadius: 17, borderCurve: "continuous", padding: 17, gap: 12 },
  sectionHeading: { gap: 4 },
  sectionLabel: { color: palette.blue, fontSize: 9, fontWeight: "900", letterSpacing: 1 },
  sectionTitle: { color: palette.ink, fontSize: 17, lineHeight: 23, fontWeight: "800" },
  sectionBody: { color: palette.muted, fontSize: 14, lineHeight: 22 },
  codeBlock: { backgroundColor: "#17233D", borderRadius: 12, borderCurve: "continuous", padding: 15 },
  codeText: { color: "#E5EDFF", fontSize: 12, lineHeight: 19, fontFamily: "monospace" },
  objectiveRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  objectiveNumber: { color: palette.blue, fontSize: 12, fontWeight: "900", width: 18 },
  objectiveText: { color: palette.muted, fontSize: 13, lineHeight: 20, flex: 1 },
  guidedStep: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  guidedNumber: { width: 28, height: 28, borderRadius: 10, backgroundColor: palette.paleBlue, alignItems: "center", justifyContent: "center" },
  guidedNumberText: { color: palette.blue, fontSize: 11, fontWeight: "900" },
  guidedCopy: { flex: 1, gap: 5, paddingTop: 2 },
  guidedTitle: { color: palette.ink, fontSize: 14, lineHeight: 19, fontWeight: "800" },
  mistake: { gap: 4, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: palette.line },
  mistakeTitle: { color: palette.ink, fontSize: 13, lineHeight: 18, fontWeight: "800" },
  recap: { backgroundColor: palette.paleBlue, borderColor: "#D7E2FF", borderWidth: 1, borderRadius: 16, borderCurve: "continuous", padding: 16, gap: 7 },
  recapLabel: { color: palette.blue, fontSize: 9, fontWeight: "900", letterSpacing: 1 },
  recapText: { color: palette.ink, fontSize: 14, lineHeight: 22 },
  practiceIntro: { color: palette.muted, fontSize: 12, lineHeight: 18 },
  practiceCard: { borderWidth: 1, borderColor: palette.line, borderRadius: 14, borderCurve: "continuous", padding: 13, gap: 10 },
  practiceTitle: { color: palette.ink, fontSize: 14, lineHeight: 19, fontWeight: "900" },
  practiceLabel: { color: palette.blue, fontSize: 9, fontWeight: "900", letterSpacing: 0.9 },
  hintText: { color: palette.muted, fontSize: 12, lineHeight: 18 },
  solutionButton: { alignSelf: "flex-start", borderWidth: 1, borderColor: palette.blue, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9 },
  solutionButtonText: { color: palette.blue, fontSize: 12, fontWeight: "900" },
  solutionBlock: { gap: 8 },
  question: { color: palette.ink, fontSize: 15, lineHeight: 22, fontWeight: "700" },
  options: { gap: 8 },
  option: { flexDirection: "row", alignItems: "center", gap: 11, borderWidth: 1, borderColor: palette.line, borderRadius: 12, borderCurve: "continuous", padding: 12, minHeight: 48 },
  optionPressed: { borderColor: palette.blue, backgroundColor: palette.paleBlue },
  correctOption: { borderColor: "#23865A", backgroundColor: "#EAF7F0" },
  wrongOption: { borderColor: "#C45151", backgroundColor: "#FFF0F0" },
  optionLetter: { color: palette.muted, fontSize: 11, fontWeight: "900", width: 18 },
  optionText: { color: palette.ink, fontSize: 13, lineHeight: 19, flex: 1 },
  optionEmphasis: { color: palette.ink, fontWeight: "800" },
  feedback: { borderRadius: 12, padding: 13, gap: 6 },
  feedbackCorrect: { backgroundColor: "#EAF7F0" },
  feedbackWrong: { backgroundColor: "#FFF0F0" },
  feedbackTitle: { color: palette.ink, fontSize: 14, fontWeight: "900" },
  feedbackBody: { color: palette.muted, fontSize: 12, lineHeight: 18 },
  retryButton: { alignSelf: "flex-start", paddingVertical: 7, paddingHorizontal: 3 },
  retryText: { color: palette.blue, fontSize: 12, fontWeight: "900" },
  footerActions: { gap: 12 },
  footerNote: { color: palette.muted, fontSize: 11, lineHeight: 17 },
  nextButton: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, backgroundColor: palette.dark, borderRadius: 15, borderCurve: "continuous", padding: 16 },
  nextCopy: { flex: 1, gap: 4 },
  nextLabel: { color: "#9FB7FF", fontSize: 9, fontWeight: "900", letterSpacing: 1 },
  nextTitle: { color: "#FFFFFF", fontSize: 14, lineHeight: 20, fontWeight: "800", flex: 1 },
  nextArrow: { color: "#FFFFFF", fontSize: 25, fontWeight: "600" },
  nextPressed: { opacity: 0.78 },
});
