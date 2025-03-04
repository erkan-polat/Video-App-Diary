import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Slider from "@react-native-community/slider";
import { Video } from "expo-av";
import { TouchableOpacity } from "react-native";

const { width } = Dimensions.get("window");

export default function CropStep2() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const videoRef = useRef(null);

  // 📌 Ensure the video URI is correctly extracted & decoded
  const video = params.video ? decodeURIComponent(params.video) : null;

  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(5);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    console.log("📌 Received video URI:", video);
  }, [video]);

  // ✅ If no video found, show an error
  if (!video) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>❌ Error: No video found.</Text>
      </View>
    );
  }

  // 📌 Handle video loading and set duration
  const onVideoLoad = (status) => {
    if (status?.durationMillis) {
      const videoDuration = status.durationMillis / 1000; // Convert ms to seconds
      console.log("✅ Video Loaded, Duration:", videoDuration);

      setDuration(videoDuration);
      setStartTime(0);
      setEndTime(Math.min(5, videoDuration));
      setIsVideoLoaded(true);
    }
  };

  // 📌 Handle video loading errors
  const onVideoError = (error) => {
    console.error("❌ Video failed to load:", error);
    Alert.alert("Error", "Failed to load video. Please try again.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎞 Select 5-Second Clip</Text>

      {/* ✅ Show a message if video is still loading */}
      {!isVideoLoaded && <Text style={styles.loadingText}>⏳ Loading video...</Text>}

      {/* 🎥 Video Player */}
      <Video
        ref={videoRef}
        source={{ uri: video }}
        useNativeControls
        resizeMode="contain"
        onLoad={onVideoLoad}
        onError={onVideoError}
        style={styles.video}
      />

      {/* 📌 Scrubber Slider */}
      <Text style={styles.label}>Select Start Time</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={Math.max(0, duration - 5)} // Prevent negative max values
        value={startTime}
        onValueChange={(value) => {
          setStartTime(value);
          setEndTime(Math.min(value + 5, duration)); // Ensure 5-second crop limit
        }}
        minimumTrackTintColor="#4A90E2"
        maximumTrackTintColor="#d3d3d3"
      />

      <Text style={styles.timeText}>
        ⏳ Start: {startTime.toFixed(2)}s - End: {endTime.toFixed(2)}s
      </Text>

      {/* ✅ Prevent navigating if video is not loaded */}
      <TouchableOpacity
        style={[styles.button, !isVideoLoaded && styles.disabledButton]}
        onPress={() =>
          isVideoLoaded &&
          router.push({
            pathname: "/crop-step3",
            params: {
              video: encodeURIComponent(video),
              start: startTime.toString(),
              end: endTime.toString(),
            },
          })
        }
        disabled={!isVideoLoaded}
      >
        <Text style={styles.buttonText}>Next ➡</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
    color: "#777",
    marginBottom: 10,
  },
  video: {
    width: width * 0.95,
    height: 250,
    backgroundColor: "black",
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  slider: {
    width: "90%",
    height: 40,
  },
  timeText: {
    fontSize: 16,
    color: "#333",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    width: "80%",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});
