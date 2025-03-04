import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Video } from "expo-av";
import { FontAwesome } from '@expo/vector-icons';
import * as FileSystem from "expo-file-system";

const { width } = Dimensions.get("window");

export default function CropStep3() {
  const { video } = useLocalSearchParams();
  console.log("📌 Gelen Video URI:", video);

  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const videoRef = useRef(null);

  // 📁 Videoları AsyncStorage'e kaydetme fonksiyonu
  const saveVideo = async () => {
    if (!name.trim()) {
      Alert.alert("❌ Error", "Please enter a video name.");
      return;
    }

    try {
      const storedVideos = await AsyncStorage.getItem("croppedVideos");
      const videosArray = storedVideos ? JSON.parse(storedVideos) : [];

      const newVideo = {
        id: Date.now(), // Benzersiz ID oluştur
        uri: video,
        name: name,
        description: description,
      };

      const updatedVideos = [...videosArray, newVideo];
      await AsyncStorage.setItem("croppedVideos", JSON.stringify(updatedVideos));

      console.log("✅ Video kaydedildi:", newVideo);
      Alert.alert("✅ Success", "Video saved successfully!");

      router.push("/"); // Ana sayfaya yönlendir
    } catch (error) {
      console.error("❌ Video kaydetme hatası:", error);
      Alert.alert("❌ Error", "Failed to save the video.");
    }
  };

  return (
    <View style={styles.fullScreenContainer}>
      <Text style={styles.title}>Enter Video Information</Text>

      {/* 🎥 Video Önizleme */}
      <Video
        ref={videoRef}
        source={{ uri: video }}
        useNativeControls
        style={styles.videoPlayer}
        resizeMode="contain"
      />

      {/* 🎬 Video Adı */}
      <Text style={styles.label}>Video Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a name for your video..."
        value={name}
        onChangeText={setName}
      />

      {/* 📝 Açıklama */}
      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        placeholder="Add a short description..."
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* 💾 Kaydet Butonu */}
      <TouchableOpacity style={styles.button} onPress={saveVideo}>
        <FontAwesome name="save" size={24} color="white" />
        <Text style={styles.buttonText}>Save and Return to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  videoPlayer: {
    width: width * 0.9,
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "left",
    width: "80%",
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    marginLeft: 10,
    fontSize: 16,
  },
});

