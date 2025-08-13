import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, SafeAreaView, StatusBar, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Slider from "@react-native-community/slider";
import { db } from "./firebaseConfig"; // Firebase config
import { collection, addDoc } from "firebase/firestore"; // Firestore functions

const LoginPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [age, setAge] = useState<number>(25);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (): Promise<void> => {
    console.log("Form submission started...");
    if (name && username && password && age) {
      try {
        console.log("Attempting to save to Firestore...");
        const docRef = await addDoc(collection(db, "users"), {
          name,
          username,
          password, // ⚠ In real apps, hash passwords before storing
          age: Number(age),
        });
        console.log("✅ User data added with ID:", docRef.id);
      } catch (e) {
        console.error("❌ Error adding document:", e);
      }

      // Always navigate (even if Firestore fails)
      console.log("Navigating to /actdetails...");
      router.push({
        pathname: "/actdetails",
        params: { userName: name, userAge: age },
      });
    } else {
      alert("Please fill in all fields!");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Onboarding</Text>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>OnlyCabs</Text>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>Enter your details to continue</Text>

        <TextInput
          style={[styles.input, isFocused && styles.inputFocused]}
          placeholder="Your Name"
          placeholderTextColor="black"
          value={name}
          onChangeText={setName}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        <TextInput
          style={[styles.input, isFocused && styles.inputFocused]}
          placeholder="Username"
          placeholderTextColor="black"
          value={username}
          onChangeText={setUsername}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        <TextInput
          style={[styles.input, isFocused && styles.inputFocused]}
          placeholder="Password"
          placeholderTextColor="black"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        <Text style={styles.ageLabel}>Select Your Age: {age}</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={100}
          step={1}
          value={age}
          onValueChange={setAge}
          minimumTrackTintColor="black"
          maximumTrackTintColor="black"
          thumbTintColor="black"
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButtonBack}
          onPress={() => router.push({ pathname: "/" })}
        >
          <Text style={styles.footerButtonTextBack}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerButtonNext}
          onPress={handleSubmit}
        >
          <Text style={styles.footerButtonTextNext}>Next Page</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#ffffff",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.075,
    shadowRadius: 6,
    elevation: 5,
  },
  headerText: {
    position: "absolute",
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  logoContainer: {
    paddingVertical: 4,
    paddingHorizontal: 3,
    backgroundColor: "#ffffff",
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 10,
    marginRight: 260,
    marginBottom: 5,
  },
  logoText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 46,
    fontWeight: "bold",
    color: "orange",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 24,
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: "#ffffff",
  },
  inputFocused: {
    borderColor: "black",
  },
  ageLabel: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 8,
  },
  slider: {
    width: "100%",
    height: 40,
    marginBottom: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  footerButtonBack: {
    padding: 12,
    backgroundColor: "transparent",
    borderRadius: 8,
  },
  footerButtonTextBack: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  footerButtonNext: {
    padding: 12,
    backgroundColor: "transparent",
    borderRadius: 8,
  },
  footerButtonTextNext: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
  },
});

export default LoginPage;
