import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, SafeAreaView, StatusBar, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { db } from './firebaseConfig'; // Firebase config
import { collection, addDoc } from 'firebase/firestore'; // Firestore functions

const DriverRegistrationPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [license, setLicense] = useState<string>("");
  const [licensePlate, setLicensePlate] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [rating, setRating] = useState<string>("");
  const [vehicle, setVehicle] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const router = useRouter();

  // Function to handle form submission and store data in Firestore
  const handleSubmit = async (): Promise<void> => {
    if (name && license && licensePlate && model && phone && rating && vehicle) {
      try {
        // Add driver data to Firestore
        const docRef = await addDoc(collection(db, "driver"), {
          name,
          license,
          licensePlate,
          model,
          phone: Number(phone), // Ensure phone is stored as a number
          rating,
          vehicle,
        });
        console.log("Driver data added with ID: ", docRef.id);

        // Navigate to next page after successful submission
        router.push({
          pathname: "/actdetails",
          params: { driverName: name, driverPhone: phone } // Passing data to the next page
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    } else {
      alert("Please fill in all fields!");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Driver Registration</Text>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>OnlyCabs</Text>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Register as a Driver</Text>
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
          placeholder="License Number"
          placeholderTextColor="black"
          value={license}
          onChangeText={setLicense}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        <TextInput
          style={[styles.input, isFocused && styles.inputFocused]}
          placeholder="License Plate"
          placeholderTextColor="black"
          value={licensePlate}
          onChangeText={setLicensePlate}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        <TextInput
          style={[styles.input, isFocused && styles.inputFocused]}
          placeholder="Vehicle Model"
          placeholderTextColor="black"
          value={model}
          onChangeText={setModel}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        <TextInput
          style={[styles.input, isFocused && styles.inputFocused]}
          placeholder="Phone Number"
          placeholderTextColor="black"
          value={phone}
          onChangeText={setPhone}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType="numeric"
        />

        <TextInput
          style={[styles.input, isFocused && styles.inputFocused]}
          placeholder="Rating"
          placeholderTextColor="black"
          value={rating}
          onChangeText={setRating}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        <TextInput
          style={[styles.input, isFocused && styles.inputFocused]}
          placeholder="Vehicle Make"
          placeholderTextColor="black"
          value={vehicle}
          onChangeText={setVehicle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButtonBack}
          onPress={() => router.push({ pathname: "/" })}>
          <Text style={styles.footerButtonTextBack}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerButtonNext}
          onPress={handleSubmit} // Call handleSubmit on press
        >
          <Text style={styles.footerButtonTextNext}>Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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
    marginBottom: 5
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

export default DriverRegistrationPage;
