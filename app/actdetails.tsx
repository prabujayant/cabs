import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, SafeAreaView, StatusBar, TouchableOpacity, FlatList, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useRouter, useGlobalSearchParams } from "expo-router";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Firebase Firestore configuration import

export default function BookingPage() {
  const { userName, userAge } = useGlobalSearchParams(); // Use useSearchParams to access params
  const [pickUp, setPickUp] = useState<string>(""); // State for pick-up location
  const [dropOff, setDropOff] = useState<string>(""); // State for drop-off location
  const [selectedRide, setSelectedRide] = useState<string>(""); // State to track the selected ride option
  const [filteredPickUpLocations, setFilteredPickUpLocations] = useState<string[]>([]); // Filtered pick-up locations
  const [filteredDropOffLocations, setFilteredDropOffLocations] = useState<string[]>([]); // Filtered drop-off locations
  const router = useRouter();

  // List of places within Bengaluru
const bengaluruLocations = [
  "MG Road", "Koramangala", "Indiranagar", "Whitefield", "Jayanagar",
  "Bannerghatta Road", "Bangalore Palace", "Vidhana Soudha", "Marathahalli", "Hebbal",
  "Electronic City", "Majestic", "Brigade Road", "Commercial Street", "Lalbagh",
  "Cubbon Park", "ISKCON Temple", "Bangalore International Airport", "Yeshwantpur",
  "Rajajinagar", "Malleswaram", "Basavanagudi", "JP Nagar", "BTM Layout",
  "HSR Layout", "Sarjapur Road"
];

  
  // Handle text input for PickUp Location
  const handlePickUpChange = (text: string) => {
    setPickUp(text);
    // Filter locations based on the input text
    const filtered = bengaluruLocations.filter(location =>
      location.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredPickUpLocations(filtered);
  };

  // Handle text input for DropOff Location
  const handleDropOffChange = (text: string) => {
    setDropOff(text);
    // Filter locations based on the input text
    const filtered = bengaluruLocations.filter(location =>
      location.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredDropOffLocations(filtered);
  };

  // Function to handle ride option selection
  const handleRideSelect = (rideType: string) => {
    setSelectedRide(rideType);
  };

  // Function to close the dropdown when tapping outside the input fields
  const closeDropdowns = () => {
    setFilteredPickUpLocations([]);
    setFilteredDropOffLocations([]);
  };

  // Function to save booking details to Firestore
  const saveBookingToFirestore = async () => {
    try {
      const bookingRef = collection(db, "bookings"); // Reference to the "bookings" collection in Firestore
      await addDoc(bookingRef, {
        userName,
        userAge,
        pickUp,
        dropOff,
        selectedRide,
      });
      console.log("Booking saved successfully!");
      // Optionally navigate to another page after successful save
      router.push({ pathname: "/nextPage", params: { userName, userAge, pickUp, dropOff, selectedRide } });
    } catch (error) {
      console.error("Error saving booking:", error);
    }
  };

  // Check if all fields are filled to enable "Next Page" button
  const isFormValid = pickUp !== "" && dropOff !== "" && selectedRide !== "";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>OnlyCabs</Text>
        </View>
        <Text style={styles.headerText}>Booking</Text>
      </View>

      <TouchableWithoutFeedback onPress={closeDropdowns}>
        <View style={styles.container}>
          <Text style={styles.greeting}>Hi {userName}!</Text>

          <View style={styles.locationContainer}>
            <Text style={styles.locationLabel}>Pick Up Location:</Text>
            <TextInput
              style={styles.locationInput}
              placeholder="Enter pick-up location"
              value={pickUp}
              onChangeText={handlePickUpChange}
            />
            {/* Dropdown for filtered pick-up locations */}
            {filteredPickUpLocations.length > 0 && (
              <FlatList
                data={filteredPickUpLocations}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setPickUp(item);
                      setFilteredPickUpLocations([]); // Clear dropdown when a location is selected
                    }}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                )}
                style={styles.dropdownList}
              />
            )}

            <Text style={styles.locationLabel}>Drop Off Location:</Text>
            <TextInput
              style={styles.locationInput}
              placeholder="Enter drop-off location"
              value={dropOff}
              onChangeText={handleDropOffChange}
            />
            {/* Dropdown for filtered drop-off locations */}
            {filteredDropOffLocations.length > 0 && (
              <FlatList
                data={filteredDropOffLocations}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setDropOff(item);
                      setFilteredDropOffLocations([]); // Clear dropdown when a location is selected
                    }}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                )}
                style={styles.dropdownList}
              />
            )}
          </View>

          <View style={styles.rideOptions}>
            {/* Ride Option buttons with dynamic styles based on selection */}
            <TouchableOpacity
              style={[styles.rideOption, selectedRide === "Mini" && styles.selectedRide]}
              onPress={() => handleRideSelect("Mini")}
            >
              <Text style={styles.rideOptionText}>Mini</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.rideOption, selectedRide === "Sedan" && styles.selectedRide]}
              onPress={() => handleRideSelect("Sedan")}
            >
              <Text style={styles.rideOptionText}>Sedan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.rideOption, selectedRide === "SUV" && styles.selectedRide]}
              onPress={() => handleRideSelect("SUV")}
            >
              <Text style={styles.rideOptionText}>SUV</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => router.back()}>
          <Text style={styles.footerButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.footerButton, !isFormValid && styles.disabledButton]} // Disable button when form is invalid
          onPress={isFormValid ? saveBookingToFirestore : undefined} // Only allow navigation if form is valid
          disabled={!isFormValid}
        >
          <Text style={styles.footerButtonText}>Next Page</Text>
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
    marginRight: 9,
    marginLeft: 6,
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
    marginLeft: 53,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  greeting: {
    fontSize: 46,
    fontWeight: "bold",
    color: "orange",
    marginBottom: 24,
  },
  locationContainer: {
    width: "100%",
    alignItems: "flex-start",
  },
  locationLabel: {
    fontSize: 18,
    color: "#333",
    marginBottom: 4,
  },
  locationInput: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingLeft: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  dropdownList: {
    width: "100%",
    maxHeight: 200,
    marginTop: -10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    position: "absolute",
    zIndex: 1,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  rideOptions: {
    flexDirection: "row",
    marginVertical: 20,
  },
  rideOption: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  selectedRide: {
    backgroundColor: "#ff9900",
  },
  rideOptionText: {
    fontSize: 16,
    color: "#333",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  footerButton: {
    backgroundColor: "#ff9900",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  footerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
});