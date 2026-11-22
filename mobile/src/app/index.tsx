import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>PYTHON LEARNING, REIMAGINED</Text>
        <Text style={styles.title}>PyLearn</Text>
        <Text style={styles.description}>
          Your learning journey is getting a native home.
        </Text>
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>The foundation is ready to grow.</Text>
          <Text style={styles.statusBody}>
            Lessons, practice, projects, and your learning progress will come
            together here.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F8FA"
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28
  },
  eyebrow: {
    color: "#526174",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
    marginBottom: 12
  },
  title: {
    color: "#172033",
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: -1.5
  },
  description: {
    color: "#526174",
    fontSize: 17,
    lineHeight: 25,
    marginTop: 10
  },
  statusCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E9F0",
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 36,
    padding: 20
  },
  statusTitle: {
    color: "#172033",
    fontSize: 16,
    fontWeight: "700"
  },
  statusBody: {
    color: "#657286",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8
  }
});
