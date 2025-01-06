import React from "react";
import { View, StyleSheet } from "react-native";
import TextBox from "../components/TextBox";
import AudioPlayer from "../components/AudioPlayer";
export default function SessionScreen() {
  return (
    <View style={styles.container}>
      <AudioPlayer />

      <TextBox />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D6EADE", // Light background color
  },
});
