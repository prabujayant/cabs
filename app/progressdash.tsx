import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  ScrollView, 
  Button 
} from "react-native";
import Slider from "@react-native-community/slider";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function ProgressDash() {
  const { activityDetails, hoursPerWeek } = useLocalSearchParams();
  const router = useRouter();

  // Parse the passed JSON strings into arrays
  const activities = JSON.parse(activityDetails as string) || [];
  const maxValues = JSON.parse(hoursPerWeek as string) || [];

  const [progress, setProgress] = useState<number[]>(
    Array(activities.length).fill(0)
  );

  const handleSliderChange = (index: number, value: number) => {
    const updatedProgress = [...progress];
    updatedProgress[index] = Math.round(value);
    setProgress(updatedProgress);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Activity Progress</Text>

        {activities.map((activity: string, index: number) => (
          <View key={index} style={styles.activityContainer}>
            <Text style={styles.activityTitle}>{activity}</Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={maxValues[index]}
                step={1}
                value={progress[index]}
                onValueChange={(value) => handleSliderChange(index, value)}
                minimumTrackTintColor="#FFC5D3"
                maximumTrackTintColor="#A9A9A9"
                thumbTintColor="#FFC5D3"
              />
              <Text style={styles.sliderValue}>
                {progress[index]} / {maxValues[index]} hrs
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Footer with Back Button */}
      <View style={styles.footer}>
        <Button
          title="Back"
          onPress={() => router.push("/actdetails")}
          color="#A9A9A9"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  activityContainer: {
    marginBottom: 20,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  slider: {
    flex: 1,
    marginRight: 10,
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  footer: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#A9A9A9",
    alignItems: "center",
  },
});
