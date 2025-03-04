import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useVideoStore } from "../../hooks/useVideoStore";
import { Video } from "expo-av";

const { width, height } = Dimensions.get("window");

export default function VideoDetails() {
  const params = useLocalSearchParams();
  const videoId = params.id ? params.id.toString() : null; // ✅ `id` string olarak karşılaştırılacak
  const { videos, getVideos } = useVideoStore();
  const [loading, setLoading] = useState(true);
  const [video, setVideo] = useState(null);

useEffect(() => {
    const fetchVideo = async () => {
      if (videos.length === 0) {
        await getVideos(); // ✅ Videolar boşsa AsyncStorage'den çek
      }
    };

    fetchVideo();
  }, []); // ✅ **Boş bağımlılık array** sayesinde sadece **ilk render** çalışır

  useEffect(() => {
    // ✅ Videolar güncellendiğinde sadece **bir kez** setState yap
    const foundVideo = videos.find((vid) => vid.id.toString() === videoId);
    if (foundVideo && !video) { // 🔥 **Eğer video zaten set edilmişse tekrar set etme**
      setVideo(foundVideo);
      setLoading(false);
    }
  }, [videos]); // ✅ **Sadece videos değiştiğinde çalışır**

  if (!videoId) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>⚠️ Invalid video ID.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading video...</Text>
      </View>
    );
  }

  if (!video) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>🚫 Video not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{video.name}</Text>
      <Video source={{ uri: video.uri }} useNativeControls style={styles.video} />
      <Text style={styles.description}>{video.description || "No description available."}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  video: {
    width: width * 0.95,
    height: height * 0.4,
    borderRadius: 12,
    backgroundColor: "black",
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    textAlign: "center",
    color: "#555",
    marginHorizontal: 20,
    paddingHorizontal: 10,
  },
  errorText: {
    fontSize: 20,
    color: "red",
    textAlign: "center",
    fontWeight: "bold",
  },
  loadingText: {
    fontSize: 18,
    color: "#777",
    marginTop: 10,
  },
});
