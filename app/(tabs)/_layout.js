import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Main Screen" }} />
      <Stack.Screen name="details" options={{ title: "Video Details" }} />
      <Stack.Screen name="crop" options={{ title: "Select Video" }} />
      <Stack.Screen name="crop-step2" options={{ title: "Crop Video" }} />
      <Stack.Screen name="crop-step3" options={{ title: "Add Metadata" }} />
      <Stack.Screen name="crop-video" options={{ title: "Trim Video" }} />
      <Stack.Screen name="cropped-videos" options={{ title: "Cropped Videos" }} />
      <Stack.Screen name="saved-videos" options={{ title: "Add Metadata" }} />

    </Stack>
  );
}
