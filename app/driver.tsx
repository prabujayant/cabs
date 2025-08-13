import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { db } from "./firebaseConfig"; // Import the Firebase configuration
import { collection, query, orderBy, getDocs } from "firebase/firestore";

export default function DriverAssigned() {
  const router = useRouter();
  const [driverDetails, setDriverDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestRatedDriver = async () => {
      try {
        // Query Firestore to get all drivers sorted by rating in descending order
        const driversRef = collection(db, "driver");
        const q = query(driversRef, orderBy("rating", "desc")); // Sort by rating (highest first)
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Get the first document (best-rated driver)
          const bestDriver = querySnapshot.docs[0].data();
          setDriverDetails(bestDriver);
        } else {
          console.log("No drivers found!");
        }
      } catch (error) {
        console.error("Error fetching driver details: ", error);
      } finally {
        setLoading(false); // Stop loading after fetching data
      }
    };

    fetchBestRatedDriver();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>OnlyCabs</Text>
        </View>
        <Text style={styles.headerText}>Ride Assigned</Text>
      </View>
      <View style={styles.container}>
        {loading ? (
          <Text style={styles.message}>Loading driver details...</Text>
        ) : driverDetails ? (
          <View>
            <Text style={styles.message}>Driver has been assigned and will be there anytime soon.</Text>
            <Text style={styles.driverInfo}>Driver Name: {driverDetails.name}</Text>
            <Text style={styles.driverInfo}>Driver Phone: {driverDetails.phone}</Text>
            <Text style={styles.driverInfo}>Driver License: {driverDetails.license}</Text>
            <Text style={styles.driverInfo}>Vehicle Make: {driverDetails.vehicle}</Text>
            <Text style={styles.driverInfo}>Vehicle Model: {driverDetails.model}</Text>
            <Text style={styles.driverInfo}>Vehicle License Plate: {driverDetails.licensePlate}</Text>
            <Text style={styles.driverInfo}>Driver Rating: {driverDetails.rating}</Text>
          </View>
        ) : (
          <Text style={styles.message}>No drivers available at the moment.</Text>
        )}
      </View>
      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => router.push("/")}>
          <Text style={styles.footerButtonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#fff",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.075,
    shadowRadius: 6,
    elevation: 5,
  },
  logoContainer: {
    paddingVertical: 4,
    paddingHorizontal: 3,
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "#000",
    borderRadius: 10,
    marginRight: 30,
    marginLeft: 50,
  },
  logoText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 0,
    marginRight: 150,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  message: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
    textAlign: "center",
  },
  driverInfo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginTop: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 24,
    paddingHorizontal: 24,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  footerButton: {
    backgroundColor: "#ff9c00",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});