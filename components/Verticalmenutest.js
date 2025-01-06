import React, { useState } from "react";
import { View, Text, StyleSheet, PanResponder, Alert } from "react-native";

const Verticalmenutest = () => {
  const [bpm, setBpm] = useState(120); // Default BPM
  const [transpose, setTranspose] = useState(0); // Default Transpose
  const [volume, setVolume] = useState(50); // Default Volume
  const [activeControl, setActiveControl] = useState(null); // Track the active control

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

  return (
    <View style={styles.container}>
      {/* Vertical Menu */}
      <View style={styles.menu}>
        {/* BPM Slider */}
        <View
          {...bpmResponder.panHandlers}
          style={[
            styles.slider,
            activeControl === "bpm" && styles.activeSlider,
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
            styles.slider,
            activeControl === "transpose" && styles.activeSlider,
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
            styles.slider,
            activeControl === "volume" && styles.activeSlider,
          ]}
          onTouchStart={() => setActiveControl("volume")}
        >
          <Text style={styles.text}>
            {activeControl === "volume" ? `${volume}%` : "Volume"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  menu: {
    width: 150,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 10,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  slider: {
    width: "100%",
    paddingVertical: 10,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  activeSlider: {
    backgroundColor: "#c0c0c0",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Verticalmenutest;
