import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";

export default function HowToUseScreen() {
  const router = useRouter();

  const handleNext = () => {
    // This will navigate to the next screen (replace "next-screen" with your actual route)
    router.push("/next-screen");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>How to Use</Text>

      {/* Image Section */}
      <View style={styles.imageWrapper}>
<Image 
  source={require("../../../assets/images/how-to-use-img.png")} 
  style={styles.image}
/>

      </View>

      {/* Title & Description */}
      <Text style={styles.title}>Add a Task</Text>
      <Text style={styles.description}>
        Tap the '+' button to add a new task to your list.{"\n"}
        Keep it concise and actionable.
      </Text>

      {/* Next Button */}
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginTop: 20,
  },
  imageWrapper: {
    width: "100%",
    alignItems: "center",
    marginVertical: 30,
  },
  image: {
    width: 300,
    height: 400,
    resizeMode: "contain",
    borderRadius: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#2f80ed",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 40,
    width: "90%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
