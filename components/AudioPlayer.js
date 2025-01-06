import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  PanResponder,
  Animated,
  Easing,
  TouchableOpacity,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";
import Entypo from "@expo/vector-icons/Entypo";
import { useSharedValue } from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Svg, { Polyline, Line } from "react-native-svg";
import WaveformSlider from "./WaveformSlider";

const AudioPlayer = () => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showMenu, setShowMenu] = useState(false); // State for showing the menu
  const [scale] = useState(new Animated.Value(1)); // Initial scale value
  const [bpm, setBpm] = useState(120); // Default BPM
  const [transpose, setTranspose] = useState(0); // Default Transpose
  const [volume, setVolume] = useState(50); // Default Volume
  const [activeControl, setActiveControl] = useState(null); // Track the active control
  const [audioImported, setAudioImported] = useState(false); // Check if audio is imported

  const handleImportAudio = async () => {
    try {
      const result = await importAudio(); // Call the importAudio function
      if (result) {
        setAudioImported(true); // Update state to hide the button
      }
    } catch (error) {
      console.error("Audio import failed:", error);
    }
  };

  const createPanResponder = (onChange) =>
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        // Detect vertical dragging and update value
        const change = -gestureState.dy / 3; // Adjust sensitivity
        onChange(change);
      },
      onPanResponderRelease: () => {
        setActiveControl(null); // Reset active control
      },
    });

  const handleBpmChange = (change) => {
    setBpm((prev) => Math.round(Math.max(50, Math.min(200, prev + change))));
  };

  const handleTransposeChange = (change) => {
    setTranspose((prev) =>
      Math.round(Math.max(-12, Math.min(12, prev + change)))
    );
  };

  const handleVolumeChange = (change) => {
    setVolume((prev) => Math.round(Math.max(0, Math.min(100, prev + change))));
  };

  const bpmResponder = createPanResponder(handleBpmChange);
  const transposeResponder = createPanResponder(handleTransposeChange);
  const volumeResponder = createPanResponder(handleVolumeChange);

  const importAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*", // Restrict to audio files
        copyToCacheDirectory: true,
      });

      console.log("DocumentPicker Result:", result); // Log the result for debugging

      // Check if assets array exists and extract the first file
      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0]; // Extract the first file
        console.log("File selected:", file.name, file.uri); // Debug file details
        loadSound(file.uri); // Pass the URI to load the audio
      } else if (result.canceled) {
        Alert.alert("Cancelled", "No file was selected.");
      } else {
        Alert.alert("Error", "Unexpected result from file picker.");
      }
    } catch (error) {
      console.error("Error importing audio:", error);
      Alert.alert("Error", "Failed to import audio file.");
    }
  };

  const loadSound = async (uri) => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      setSound(newSound);

      const status = await newSound.getStatusAsync();
      setDuration(status.durationMillis / 1000);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to load audio file.");
    }
  };

  const togglePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setCurrentTime(status.positionMillis / 1000);
    }
  };

  // PanResponder for swipe gesture
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      // Trigger only for horizontal swipes
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < -20) {
        setShowMenu(true);
        animateArrow(); // Trigger animation
      } else if (gestureState.dx > 20) {
        setShowMenu(false);
        animateArrow(); // Trigger animation
      }
    },
  });

  const animateArrow = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.2, // Slightly increase the size
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1, // Return to original size
        friction: 3,
        tension: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.audioBox}>
        {!audioImported && (
          <TouchableOpacity
            style={styles.playerButtons}
            onPress={handleImportAudio}
          >
            <Entypo name="plus" size={20} color="white" />
          </TouchableOpacity>
        )}
        {sound && (
          <>
            <TouchableOpacity
              style={styles.pressableArea}
              onPress={togglePlayPause} // Handle the press
            >
              <Entypo
                name={isPlaying ? "controller-paus" : "controller-play"}
                size={24} // Icon size
                color="black"
              />
            </TouchableOpacity>
            <WaveformSlider
              currentTime={currentTime}
              duration={duration}
              onScrub={async (value) => {
                if (sound) {
                  await sound.setPositionAsync(value * 1000); // Seek audio to scrubbed position
                }
              }}
            />
            <Text style={styles.time}>
              {Math.floor(currentTime / 60)}:
              {Math.floor(currentTime % 60)
                .toString()
                .padStart(2, "0")}{" "}
              {
                "                                                                          "
              }
              {Math.floor(duration / 60)}:
              {Math.floor(duration % 60)
                .toString()
                .padStart(2, "0")}
            </Text>

            {/* Arrow button */}
            <Animated.View
              {...panResponder.panHandlers}
              style={[styles.touchableArea, { transform: [{ scale }] }]}
            >
              <View style={styles.arrowButton}>
                <Entypo
                  name={showMenu ? "chevron-right" : "chevron-left"}
                  size={24}
                  color="black"
                />
              </View>
            </Animated.View>

            {/* Vertical Menu */}
            {showMenu && (
              <View style={styles.sideMenu}>
                {/* BPM Slider */}
                <View
                  {...bpmResponder.panHandlers}
                  style={[
                    styles.sideMenuSlider,
                    activeControl === "bpm" && styles.sideActiveSlider,
                  ]}
                  onTouchStart={() => setActiveControl("bpm")}
                >
                  <Text style={styles.text}>
                    {activeControl === "bpm" ? bpm : "BPM"}
                  </Text>
                </View>

                {/* Transpose Slider */}
                <View
                  {...transposeResponder.panHandlers}
                  style={[
                    styles.sideMenuSlider,
                    activeControl === "transpose" && styles.sideActiveSlider,
                  ]}
                  onTouchStart={() => setActiveControl("transpose")}
                >
                  <Text style={styles.text}>
                    {activeControl === "transpose" ? transpose : "Transpose"}
                  </Text>
                </View>

                {/* Volume Slider */}
                <View
                  {...volumeResponder.panHandlers}
                  style={[
                    styles.sideMenuSlider,
                    activeControl === "volume" && styles.sideActiveSlider,
                  ]}
                  onTouchStart={() => setActiveControl("volume")}
                >
                  <Text style={styles.text}>
                    {activeControl === "volume" ? `${volume}%` : "Volume"}
                  </Text>
                </View>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 1,
    flex: 0.5,
    //backgroundColor: "blue",
    borderColor: "black",
  },
  playerButtons: {
    backgroundColor: "black", // Button background color
    borderRadius: 8, // Rounded corners
    height: 20, // Vertical padding
    alignItems: "center", // Center the text
    width: 30,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff", // Text color
    fontSize: 16, // Font size
    fontWeight: "bold", // Bold text
  },
  audioBox: {
    width: "90%",
    height: 150,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    position: "relative",
    overflow: "hidden",
  },
  slider: {
    backgroundColor: "transparent",
  },
  time: {
    fontSize: 12,
    textAlign: "center",
  },
  touchableArea: {
    position: "absolute",
    right: 0, // Position on the right side
    top: 40, // Start from the top
    bottom: 30, // Extend to the bottom
    width: 40, // Adjust the width of the touch area
    justifyContent: "center", // Center the arrow button vertically
    backgroundColor: "transparent", // Invisible container
  },
  arrowButton: {
    position: "absolute",
    right: 0,
    //transform: [{ translateY: -12 }],
    width: 20,
    height: 20,
    // zIndex: 1,
  },
  sideMenu: {
    position: "absolute",
    right: 20,
    top: "5%",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
    zIndex: 1,
  },
  sideMenuSlider: {
    width: "100%",
    paddingVertical: 1,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 10,
  },
  sideActiveSlider: {
    backgroundColor: "#c0c0c0",
  },
  pressableArea: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AudioPlayer;
