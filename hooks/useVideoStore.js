import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand"; // ✅ Correct import

export const useVideoStore = create((set) => ({
  videos: [],

  getVideos: async () => {
    try {
      const storedVideos = await AsyncStorage.getItem("croppedVideos");
      console.log("📁 AsyncStorage'taki videolar:", storedVideos);

      if (storedVideos) {
        const parsedVideos = JSON.parse(storedVideos);

        // Compare both length and actual content to detect changes
        set((state) => {
          if (JSON.stringify(state.videos) === JSON.stringify(parsedVideos)) {
            console.log("⚠️ Videolar zaten yüklü, tekrar yüklenmiyor.");
            return state; // If no change in videos, don't update state
          }
          return { videos: parsedVideos }; // Update state if videos have changed
        });
      }
    } catch (error) {
      console.error("❌ Video yükleme hatası:", error);
    }
  },

  addVideo: async (newVideo) => {
    try {
      const storedVideos = await AsyncStorage.getItem("croppedVideos");
      const videoList = storedVideos ? JSON.parse(storedVideos) : [];

      // Check if the video already exists
      const videoExists = videoList.some((video) => video.id === newVideo.id || video.uri === newVideo.uri);
      if (videoExists) {
        console.warn("⚠️ Video already exists. Not adding again.");
        return;
      }

      videoList.push(newVideo);
      await AsyncStorage.setItem("croppedVideos", JSON.stringify(videoList));
      set({ videos: videoList }); // Update state

      console.log("✅ Video added:", newVideo); // Debug: Added video
    } catch (error) {
      console.error("❌ Video ekleme hatası:", error);
    }
  },

  updateVideo: async (id, updatedData) => {
    try {
      const storedVideos = await AsyncStorage.getItem("croppedVideos");
      if (storedVideos) {
        let videoList = JSON.parse(storedVideos);

        // Update the video list
        videoList = videoList.map((video) =>
          video.id === id ? { ...video, ...updatedData } : video
        );

        // Save updated list to AsyncStorage and update state
        await AsyncStorage.setItem("croppedVideos", JSON.stringify(videoList));
        set({ videos: videoList }); // Update state

        console.log("✅ Video güncellendi:", updatedData); // Debug: Updated video data
      }
    } catch (error) {
      console.error("❌ Video güncelleme hatası:", error);
    }
  },

  deleteVideo: async (id) => {
    try {
      const storedVideos = await AsyncStorage.getItem("croppedVideos");
      if (storedVideos) {
        let videoList = JSON.parse(storedVideos);
        videoList = videoList.filter((video) => video.id !== id);
        await AsyncStorage.setItem("croppedVideos", JSON.stringify(videoList));
        set({ videos: videoList }); // Update state

        console.log(`✅ Video with id ${id} deleted.`);
      }
    } catch (error) {
      console.error("❌ Video silme hatası:", error);
    }
  },
}));
