import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter, useGlobalSearchParams } from "expo-router";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000"; // Replace with your FastAPI server URL

export default function NextPage() {
  const { userName, pickUp, dropOff, selectedRide } = useGlobalSearchParams();
  const [fare, setFare] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [surgeMultiplier, setSurgeMultiplier] = useState<number | null>(null);
  const [bmtcInfo, setBmtcInfo] = useState<string | null>(null);
  const [bestRouteInfo, setBestRouteInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Fetch fare, distance, BMTC info, and best route info from the FastAPI backend
  useEffect(() => {
    const fetchData = async () => {
      if (!pickUp || !dropOff || !selectedRide) return;

      setIsLoading(true);
      try {
        // Fetch fare
        const fareResponse = await axios.get(
          `${API_BASE_URL}/fare?pickup=${pickUp}&dropoff=${dropOff}&cab_type=${selectedRide.toLowerCase()}`
        );
        setFare(fareResponse.data.fare);
        setSurgeMultiplier(fareResponse.data.surge_multiplier);

        // Fetch distance
        const distanceResponse = await axios.get(
          `${API_BASE_URL}/distance?pickup=${pickUp}&dropoff=${dropOff}`
        );
        setDistance(distanceResponse.data.distance_km);

        // Fetch BMTC info
        const bmtcResponse = await axios.get(
          `${API_BASE_URL}/bmtc?pickup=${pickUp}`
        );
        setBmtcInfo(bmtcResponse.data.bmtc_info);

        // Fetch best route info
        const bestRouteResponse = await axios.get(
          `${API_BASE_URL}/best-route?pickup=${pickUp}&dropoff=${dropOff}`
        );
        setBestRouteInfo(bestRouteResponse.data.best_route_info);
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "Could not fetch data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pickUp, dropOff, selectedRide]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>OnlyCabs</Text>
        </View>
        <Text style={styles.headerText}>Booking Summary</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.greeting}>Hi {userName}!</Text>

          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>Pick Up: {pickUp}</Text>
            <Text style={styles.summaryText}>Drop Off: {dropOff}</Text>
            <Text style={styles.summaryText}>Selected Ride: {selectedRide}</Text>

            {isLoading ? (
              <ActivityIndicator size="large" color="#ff9c00" />
            ) : (
              <>
                {fare !== null && (
                  <Text style={styles.summaryText}>Approximate Cost: ₹{fare}</Text>
                )}
                {distance !== null && (
                  <Text style={styles.summaryText}>Distance: {distance} km</Text>
                )}
                {surgeMultiplier !== null && (
                  <Text style={styles.summaryText}>Surge: {surgeMultiplier}x</Text>
                )}
                {bmtcInfo !== null && (
                  <View style={styles.bmtcContainer}>
                    <Text style={styles.bmtcTitle}>BMTC Bus Routes:</Text>
                    <Text style={styles.bmtcInfo}>{bmtcInfo}</Text>
                  </View>
                )}
                {bestRouteInfo !== null && (
                  <View style={styles.bestRouteContainer}>
                    <Text style={styles.bestRouteTitle}>Best Cab Routes:</Text>
                    <Text style={styles.bestRouteInfo}>{bestRouteInfo}</Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => router.back()}>
          <Text style={styles.footerButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
  style={styles.footerButton}
  onPress={() => {
    router.push({
      pathname: "/driver",
      params: {
        userName,
        pickUp,
        dropOff,
        selectedRide,
        fare,
        distance,
        surgeMultiplier,
      },
    });
  }}
>
  <Text style={styles.footerButtonText}>Book Now</Text>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  greeting: {
    fontSize: 46,
    fontWeight: "bold",
    color: "orange",
    marginBottom: 24,
  },
  summaryContainer: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  summaryText: {
    fontSize: 18,
    marginBottom: 8,
    color: "#333",
  },
  bmtcContainer: {
    marginTop: 20,
  },
  bmtcTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  bmtcInfo: {
    fontSize: 16,
    color: "#333",
  },
  bestRouteContainer: {
    marginTop: 20,
  },
  bestRouteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  bestRouteInfo: {
    fontSize: 16,
    color: "#333",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
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
    width: "45%",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 50,
    marginTop: 0,
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});