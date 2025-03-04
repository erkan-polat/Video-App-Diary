import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useVideoStore } from "../../hooks/useVideoStore";
import { FontAwesome } from "@expo/vector-icons";
import { Video } from "expo-av"; // 📌 Video oynatma eklendi
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const { videos, getVideos } = useVideoStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      await getVideos();
      setIsLoading(false);
      console.log("Videos Loaded in HomeScreen:", videos); // 📌 Veriyi kontrol et
    };

    fetchVideos();
  }, [videos]); // 🔥 videos değiştiğinde `useEffect` çalışacak

  // 📌 Animasyon için Değerler
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 10 });
  };

  const handlePressOut = (route) => {
    scale.value = withSpring(1, { damping: 10 });
    router.push(route);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎥 Cropped Videos</Text>

      {isLoading ? (
        <Text style={styles.loadingText}>Loading videos...</Text>
      ) : videos.length === 0 ? (
        <Text style={styles.emptyText}>No cropped videos found.</Text>
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.videoItem}
              onPress={() => router.push({ pathname: "/details", params: { id: item.id } })}
            >
              <Video source={{ uri: item.uri }} useNativeControls style={styles.video} />
              <Text style={styles.videoText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* 📌 Butonlar için Animasyon */}
      <Animated.View style={[styles.animatedButton, { transform: [{ scale }] }]}>
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={() => handlePressOut("cropped-videos")}
          style={styles.button}
        >
          <FontAwesome name="video-camera" size={24} color="white" />
          <Text style={styles.buttonText}>View Cropped Videos</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.animatedButton, { transform: [{ scale }] }]}>
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={() => handlePressOut("/crop")}
          style={styles.button}
        >
          <FontAwesome name="plus" size={24} color="white" />
          <Text style={styles.buttonText}>Add New Video</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  loadingText: {
    fontSize: 18,
    color: "#888",
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
    marginTop: 20,
  },
  videoItem: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    width: width * 0.9,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  video: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    backgroundColor: "black",
  },
  videoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  animatedButton: {
    width: "85%",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
