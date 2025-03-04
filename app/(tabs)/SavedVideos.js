import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Video } from "expo-av";

const { width } = Dimensions.get("window");

export default function SavedVideos() {
  const [videos, setVideos] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadVideos = async () => {
      const storedVideos = await AsyncStorage.getItem("croppedVideos");
      if (storedVideos) {
        setVideos(JSON.parse(storedVideos));
      }
    };

    loadVideos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎥 Cropped Videos</Text>

      {videos.length === 0 ? (
        <Text style={styles.emptyText}>No cropped videos found.</Text>
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.videoCard}
              onPress={() => router.push({ pathname: "/details", params: { id: item.id } })}
            >
              <Video source={{ uri: item.uri }} useNativeControls style={styles.video} />
              <Text style={styles.videoTitle}>{item.name}</Text>
              <Text style={styles.videoDescription}>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={() => router.push("/")}>
        <Text style={styles.buttonText}>🏠 Go Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
  },
  videoCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    width: width * 0.9,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  video: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  videoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  videoDescription: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 5,
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
