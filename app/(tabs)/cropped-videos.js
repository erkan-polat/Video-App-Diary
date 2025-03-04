import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Video } from "expo-av";
import { useIsFocused } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";

const { width } = Dimensions.get("window");

export default function CroppedVideos() {
  const [videos, setVideos] = useState([]);
  const router = useRouter();
  const isFocused = useIsFocused();

  // 📌 Videoları AsyncStorage'den yükleme fonksiyonu
  const loadVideos = async () => {
    try {
      const storedVideos = await AsyncStorage.getItem("croppedVideos");
      console.log("📁 AsyncStorage'taki videolar:", storedVideos);

      if (storedVideos) {
        let parsedVideos = JSON.parse(storedVideos);
        if (Array.isArray(parsedVideos)) {
          const validVideos = [];
          for (const video of parsedVideos) {
            const fileInfo = await FileSystem.getInfoAsync(video.uri);
            if (fileInfo.exists) {
              validVideos.push(video);
            } else {
              console.warn("⚠️ Geçersiz video URI, listeden kaldırılıyor:", video.uri);
            }
          }
          setVideos(validVideos);

          // 🔥 Sadece geçerli videoları kaydet
          await AsyncStorage.setItem("croppedVideos", JSON.stringify(validVideos));
        } else {
          console.error("❌ Beklenmeyen veri formatı:", parsedVideos);
        }
      }
    } catch (error) {
      console.error("❌ AsyncStorage yükleme hatası:", error);
    }
  };

  // 📌 Videoyu silme fonksiyonu
  const deleteVideo = async (id) => {
    Alert.alert("⚠️ Delete Video", "Are you sure you want to delete this video?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const storedVideos = await AsyncStorage.getItem("croppedVideos");
            if (storedVideos) {
              let parsedVideos = JSON.parse(storedVideos);
              parsedVideos = parsedVideos.filter((video) => video.id !== id); // 🔥 Videoyu listeden çıkar

              await AsyncStorage.setItem("croppedVideos", JSON.stringify(parsedVideos));
              setVideos(parsedVideos); // 🔄 Ekranı güncelle
              console.log("✅ Video başarıyla silindi:", id);
            }
          } catch (error) {
            console.error("❌ Video silme hatası:", error);
          }
        },
      },
    ]);
  };

  // 📌 Sayfa açıldığında veya geri gelindiğinde videoları yükle
  useEffect(() => {
    if (isFocused) {
      loadVideos();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎥 Cropped Videos</Text>

      {videos.length === 0 ? (
        <Text style={styles.emptyText}>No cropped videos found.</Text>
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.videoCard}>
              <Video source={{ uri: item.uri }} useNativeControls style={styles.video} />
              <Text style={styles.videoTitle}>{item.name}</Text>
              <Text style={styles.videoDescription}>{item.description}</Text>

              <View style={styles.buttonContainer}>
                {/* 🎯 Edit Butonu */}
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => router.push({ pathname: "/edit", params: { id: item.id } })}
                >
                  <Text style={styles.buttonText}>✏️ Edit</Text>
                </TouchableOpacity>

                {/* 🗑️ Delete Butonu */}
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteVideo(item.id)}>
                  <Text style={styles.buttonText}>🗑️ Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#FFA500",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
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
