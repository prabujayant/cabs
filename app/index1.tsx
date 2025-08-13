import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, SafeAreaView, StatusBar, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Slider from "@react-native-community/slider";
import { db } from "./firebaseConfig"; 
import { collection, addDoc } from "firebase/firestore";

const LoginPage: React.FC = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState(25);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (name && username && password && age) {
      try {
        console.log("Saving to Firestore...");
        const docRef = await addDoc(collection(db, "users"), {
          name,
          username,
          password,
          age: Number(age),
        });
        console.log("User data added with ID:", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
        alert("Firestore save failed, but continuing...");
      }

      console.log("Navigating to /actdetails...");
      router.push({
        pathname: "/actdetails",
        params: { userName: name, userAge: age.toString() },
      });
    } else {
      alert("Please fill in all fields!");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Onboarding</Text>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>OnlyCabs</Text>
        </View>
      </View>

      {/* Main */}
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

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.footerButtonBack} 
          onPress={() => router.push("/")}>
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
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#fff",
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
    color: "#000",
  },
  logoContainer: {
    paddingVertical: 4,
    paddingHorizontal: 3,
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "#000",
    borderRadius: 10,
    marginRight: 260,
    marginBottom: 5,
  },
  logoText: { fontSize: 12, fontWeight: "bold", color: "#000" },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 46, fontWeight: "bold", color: "orange", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#333", marginBottom: 24 },
  input: {
    height: 50,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  inputFocused: { borderColor: "black" },
  ageLabel: { fontSize: 16, color: "#333", marginBottom: 8 },
  slider: { width: "100%", height: 40, marginBottom: 24 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  footerButtonBack: { padding: 12, backgroundColor: "transparent", borderRadius: 8 },
  footerButtonTextBack: { fontSize: 16, color: "red", textAlign: "center" },
  footerButtonNext: { padding: 12, backgroundColor: "transparent", borderRadius: 8 },
  footerButtonTextNext: { fontSize: 16, color: "black", textAlign: "center" },
});

export default LoginPage;
