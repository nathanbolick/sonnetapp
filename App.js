import config from "./tamagui.config";
import { H1, H2, H3, H4, H5, H6, YStack, Theme } from "tamagui";
import TextBox from "./components/TextBox";
import React, { useState } from "react";
import Home from "./components/Home";
import { Input } from "@tamagui/core";
import { themes } from "@tamagui/config/v3";
import MultilineTextInputExample from "./components/MultilineTextInputExample";
import AudioPlayer from "./components/AudioPlayer";
import Verticalmenutest from "./components/Verticalmenutest";
import AudioPlayerTest from "./components/AudioPlayerTest";
import Entypo from "@expo/vector-icons/Entypo";
import { View, StyleSheet, ScrollView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  const [text, setText] = useState("");
  return (
    <View style={styles.container}>
      <AudioPlayer />
      <Entypo
        name="plus"
        size={40}
        style={styles.playerButtons}
        color="white"
      />
      <TextBox />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0", // Light background color
  },
  playerButtons: {
    backgroundColor: "black", // Button background color
    borderRadius: 8, // Rounded corners
    height: 40, // Vertical padding
    alignItems: "center", // Center the text
    width: 40,
    alignSelf: "center",
  },
});
