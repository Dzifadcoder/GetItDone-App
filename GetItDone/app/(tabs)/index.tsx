// app/tabs/index.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* App Title */}
      <Text style={styles.title}>GetItDone</Text>

      {/* Welcome Message */}
      <Text style={styles.welcome}>Welcome to GetItDone</Text>
      <Text style={styles.subtitle}>
        Focus on what matters most. One task at a time.
      </Text>

      {/* Get Started Button */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push("//tabs/app/next")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111", // dark background
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 50,
  },
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 50,
  },
  button: {
    backgroundColor: "#3b82f6", // blue
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    position: "absolute",
    bottom: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
