import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Animated,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { Slider } from "react-native-awesome-slider";
import { Entypo } from "@expo/vector-icons";

const AudioPlayerTest = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // State for showing the menu
  const [scale] = useState(new Animated.Value(1)); // Initial scale value

  const volume = useSharedValue(50); // Shared value for volume
  const bpm = useSharedValue(120); // Shared value for BPM
  const transpose = useSharedValue(0); // Shared value for Transpose

  const animateArrow = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.2, // Slightly increase the size
        duration: 100,
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
        <TouchableOpacity
          style={styles.playerButtons}
          onPress={() => setIsPlaying(!isPlaying)}
        >
          <Text style={styles.buttonText}>{isPlaying ? "Pause" : "Play"}</Text>
        </TouchableOpacity>

        {/* Arrow button */}
        <Animated.View
          style={[styles.touchableArea, { transform: [{ scale }] }]}
        >
          <TouchableOpacity
            onPress={() => {
              setShowMenu(!showMenu);
              animateArrow();
            }}
          >
            <Entypo
              name={showMenu ? "chevron-right" : "chevron-left"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Vertical Menu */}
        {showMenu && (
          <View style={styles.sideMenu}>
            {/* BPM Slider */}
            <View style={styles.menuSlider}>
              <Text style={styles.sliderLabel}>
                BPM: {Math.round(bpm.value)}
              </Text>
              <Slider
                value={bpm}
                min={50}
                max={200}
                onValueChange={(val) => (bpm.value = val)}
                trackStyle={styles.sliderTrack}
                thumbStyle={styles.sliderThumb}
              />
            </View>

            {/* Transpose Slider */}
            <View style={styles.menuSlider}>
              <Text style={styles.sliderLabel}>
                Transpose: {Math.round(transpose.value)}
              </Text>
              <Slider
                value={transpose}
                min={-12}
                max={12}
                onValueChange={(val) => (transpose.value = val)}
                trackStyle={styles.sliderTrack}
                thumbStyle={styles.sliderThumb}
              />
            </View>

            {/* Volume Slider */}
            <View style={styles.menuSlider}>
              <Text style={styles.sliderLabel}>
                Volume: {Math.round(volume.value)}%
              </Text>
              <Slider
                value={volume}
                min={0}
                max={100}
                onValueChange={(val) => (volume.value = val)}
                trackStyle={styles.sliderTrack}
                thumbStyle={styles.sliderThumb}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  audioBox: {
    width: "90%",
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    position: "relative",
  },
  playerButtons: {
    backgroundColor: "green",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  touchableArea: {
    position: "absolute",
    right: 0,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  sideMenu: {
    marginTop: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  menuSlider: {
    marginBottom: 20,
  },
  sliderLabel: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
  },
  sliderTrack: {
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    backgroundColor: "green",
    borderRadius: 10,
  },
});

export default AudioPlayerTest;
