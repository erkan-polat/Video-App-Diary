import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Image, StyleSheet, Dimensions } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import * as FileSystem from "expo-file-system";
const { width, height } = Dimensions.get("window");

export default function CropModal() {
  const [video, setVideo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();



const pickVideo = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    allowsEditing: false,
    quality: 1,
  });

  if (!result.canceled) {
    const selectedVideoUri = result.assets[0].uri;

    // 📂 Kalıcı bir dosya yolu belirle
    const newVideoUri = `${FileSystem.documentDirectory}selected_video.mp4`;

    try {
      // 📌 Videoyu geçici bellekten kalıcı dizine taşı
      await FileSystem.moveAsync({
        from: selectedVideoUri,
        to: newVideoUri,
      });

      console.log("✅ Video kalıcı olarak kaydedildi:", newVideoUri);
      setVideo(newVideoUri); // Güncellenmiş URI'yi state'e kaydet
    } catch (error) {
      console.error("❌ Video taşıma hatası:", error);
    }
  } else {
    setModalVisible(true);
  }
};


  return (
    <View style={styles.fullScreenContainer}>
      <Text style={styles.title}>Select a Video</Text>

      <TouchableOpacity style={styles.button} onPress={pickVideo}>
        <FontAwesome name="folder-open" size={24} color="white" />
        <Text style={styles.buttonText}>Choose from Gallery</Text>
      </TouchableOpacity>

      {video && (
        <View style={styles.videoContainer}>
          <Text style={styles.videoText}>Selected Video:</Text>
          <Image source={{ uri: video }} style={styles.videoPreview} />
          <TouchableOpacity style={styles.button} onPress={() => router.push(`/crop-step2?video=${video}`)}>
            <FontAwesome name="arrow-right" size={24} color="white" />
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Custom Modal for No Video Selected */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FontAwesome name="exclamation-circle" size={36} color="#FF6347" style={styles.modalIcon} />
            <Text style={styles.modalTitle}>No Video Selected</Text>
            <Text style={styles.modalText}>Please select a video from the gallery.</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  videoContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  videoText: {
    fontSize: 16,
    color: "gray",
    marginBottom: 10,
  },
  videoPreview: {
    width: width * 0.8,
    height: height * 0.3,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalIcon: {
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  modalText: {
    fontSize: 16,
    color: "gray",
    marginBottom: 15,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
