import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { FFmpegKit, ReturnCode } from "ffmpeg-kit-react-native";
import * as FileSystem from "expo-file-system";
import { useMutation } from "@tanstack/react-query";

export default function CropVideoScreen({ route }) {
  const { videoUri, startTime, endTime } = route.params;
  const router = useRouter();

  // ✅ Videoyu kalıcı olarak kaydetme fonksiyonu
  const saveVideoPermanently = async (originalUri) => {
    const newUri = `${FileSystem.documentDirectory}video_${Date.now()}.mp4`;
    try {
      await FileSystem.moveAsync({
        from: originalUri,
        to: newUri,
      });
      console.log("✅ Video kalıcı olarak kaydedildi:", newUri);
      return newUri;
    } catch (error) {
      console.error("❌ Video taşıma hatası:", error);
      return originalUri;
    }
  };

  // 🚀 Video kırpma işlemi
const cropVideoMutation = useMutation(async () => {
  if (!videoUri || startTime === undefined || endTime === undefined) {
    throw new Error("⚠️ Missing video details!");
  }

  // 📁 Videonun doğrudan kalıcı olarak kaydedileceği URI
  const outputUri = `${FileSystem.documentDirectory}cropped_${Date.now()}.mp4`;

  // ✅ FFmpeg komutu güncellendi (kalıcı kaydetme)
  const command = `-i ${videoUri} -ss ${startTime} -t 5 -c:v libx264 -preset ultrafast -crf 28 -c:a copy ${outputUri}`;

  console.log("🎬 Executing FFmpeg command:", command);

  try {
    const session = await FFmpegKit.execute(command);
    const returnCode = await session.getReturnCode();

    if (!ReturnCode.isSuccess(returnCode)) {
      throw new Error("❌ FFmpeg processing failed!");
    }

    console.log("✅ FFmpeg processing completed successfully!");

    // 📁 Dosyanın gerçekten oluştuğunu kontrol et
    const fileInfo = await FileSystem.getInfoAsync(outputUri);
    if (!fileInfo.exists) {
      throw new Error("❌ Cropped video file not found!");
    }

    // 🎥 Video'yu AsyncStorage'a kaydetme
    try {
      const storedVideos = await AsyncStorage.getItem("croppedVideos");
      const videoList = storedVideos ? JSON.parse(storedVideos) : [];

      const newVideo = {
        id: Date.now().toString(),
        uri: outputUri,
        name: `Cropped Video ${videoList.length + 1}`,
        description: "5-second cropped segment",
      };

      videoList.push(newVideo);
      await AsyncStorage.setItem("croppedVideos", JSON.stringify(videoList));
      console.log("✅ Video saved to AsyncStorage:", newVideo);

      return outputUri;
    } catch (storageError) {
      throw new Error("⚠️ Failed to save video to storage.");
    }
  } catch (error) {
    console.error("❌ FFmpeg Error:", error);
    throw new Error("🚨 Video cropping failed. Please try again.");
  }
});


  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎬 Crop Video</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          cropVideoMutation.mutate(undefined, {
            onSuccess: () => {
              Alert.alert("✅ Success", "Video cropped successfully!");
              router.push("/");
            },
            onError: (error) => {
              Alert.alert("❌ Error", error.message);
            },
          })
        }
        disabled={cropVideoMutation.isLoading}
      >
        <Text style={styles.buttonText}>
          {cropVideoMutation.isLoading ? "⏳ Processing..." : "✂️ Crop Video"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// 🌟 Stil Dosyası
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
