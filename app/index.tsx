import React from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import { useRouter } from "expo-router"; // Ensure you import useRouter from expo-router

export default function Page() {
  const router = useRouter(); // Initialize the router

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/cabbb.png")} // Replace with your logo's file name and path in the assets folder
          style={styles.logo}
        />
      </View>

      {/* Main Content */}
      <View style={styles.main}>
        <View style={styles.box}>
          <Text style={styles.title}>OnlyCabs</Text>
        </View>
        <Button
          title="Start Riding"
          onPress={() => router.push("/howmany")} // Navigate to the /howmany page
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start", // Align to the top to make room for the logo
    backgroundColor: "#ffffff",
    paddingTop: 40, // Adds some space to push content down (adjust as needed)
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 10, // Adds space between the logo and the rest of the content
    marginTop: 80,
  },
  logo: {
    width: 200, // Set your logo width
    height: 200, // Set your logo height
    resizeMode: "contain", // Ensures the image fits within the given width and height without distortion
  },
  main: {
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 960,
  },
  box: {
    backgroundColor: "white", // White background for the inside
    padding: 20,
    borderRadius: 30, // Rounded corners
    borderWidth: 8, // Black border
    borderColor: "#000000", // Black border color
    marginBottom: 20, // Space below the box
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center", // Centers text horizontally
  },
  subtitle: {
    fontSize: 36,
    color: "#000000",
    marginBottom: 32,
    textAlign: "center", // Centers text horizontally
  },
});
