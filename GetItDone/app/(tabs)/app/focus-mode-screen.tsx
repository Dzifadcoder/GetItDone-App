// app/(tabs)/app/focus-mode-screen.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function FocusModeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>GetItDone</Text>

      {/* Pagination Dots */}
      <View style={styles.dotsContainer}>
        <View style={[styles.dot, { backgroundColor: "#6B7280" }]} />
        <View style={[styles.dot, { backgroundColor: "#3B82F6" }]} />
        <View style={[styles.dot, { backgroundColor: "#9CA3AF" }]} />
      </View>

      {/* Main Content */}
      <Text style={styles.title}>Focus Mode</Text>
      <Text style={styles.description}>
        Concentrate on one task at a time with our Focus Mode. Set a timer and
        eliminate distractions to maximize your productivity.
      </Text>

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/home")} //replace with actual home screen route
      >
        <Text style={styles.buttonText}>Start Getting It Done</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1115",
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    position: "absolute",
    top: 60,
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  dotsContainer: {
    flexDirection: "row",
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#D1D5DB",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

