import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useVideoStore } from "../../hooks/useVideoStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { videos, updateVideo } = useVideoStore();
  const video = videos.find((v) => v.id === parseInt(id, 10));

  const [name, setName] = useState(video?.name || "");
  const [description, setDescription] = useState(video?.description || "");


const handleSave = async () => {
  if (!name.trim()) {
    Alert.alert("Error", "Please enter a video name.");
    return;
  }

  try {
    // Update the video in the state
    await updateVideo(id, { name, description });

    // Retrieve the updated videos list and store it back in AsyncStorage
    const updatedVideos = await AsyncStorage.getItem("croppedVideos");
    let videoList = updatedVideos ? JSON.parse(updatedVideos) : [];
    const updatedList = videoList.map((video) =>
      video.id === parseInt(id) ? { ...video, name, description } : video
    );

    // Save the updated list back to AsyncStorage
    await AsyncStorage.setItem("croppedVideos", JSON.stringify(updatedList));

    console.log("📁 Updated videos:", updatedList);

    Alert.alert("Success", "Video updated successfully!");
    router.push("/");
  } catch (error) {
    console.error("❌ Error updating video:", error);
    Alert.alert("Error", "Failed to update video.");
  }
};



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Video</Text>

      <Text style={styles.label}>Video Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter video name..."
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter description..."
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>💾 Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f5",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#666",
    alignSelf: "flex-start",
    marginLeft: "10%",
    marginBottom: 5,
  },
  input: {
    width: "80%",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
