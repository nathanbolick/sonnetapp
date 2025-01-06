import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, PanResponder } from "react-native";
import Svg, { Rect } from "react-native-svg";

const WAVEFORM_HEIGHT = 50;
const MIN_BAR_HEIGHT = 10;

// Mock waveform data
const waveformMockData = Array.from({ length: 30 }, () => Math.random());

const WaveformSlider = ({ currentTime, duration, onScrub }) => {
  const containerRef = useRef(null);

  const [audioBoxWidth, setAudioBoxWidth] = useState(0);
  const [layoutX, setLayoutX] = useState(0); // We'll store the absolute X offset here

  // Keep a ref for the scrub position
  const scrubberPosition = useRef(currentTime);

  useEffect(() => {
    // Measure the container in the next tick/frame
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.measureInWindow((x, y, width, height) => {
          // measureInWindow gives absolute screen coords for x, y
          setLayoutX(x);
          setAudioBoxWidth(width);
        });
      }
    }, 0);
  }, []);

  // Calculate how many bars have been played
  const playbackPercentage = duration ? (currentTime / duration) * 100 : 0;
  const playedBars = Math.floor(
    (playbackPercentage / 100) * waveformMockData.length
  );

  const barSpacing = 4;
  // Prevent divide-by-zero if audioBoxWidth hasn't been measured yet
  const safeWidth = audioBoxWidth || 1;
  const barWidth = safeWidth / waveformMockData.length - barSpacing;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderMove: (_, gestureState) => {
        // Convert the absolute moveX to a local position
        const localX = gestureState.moveX - layoutX;

        // Clamp it so it doesn't go below 0 or beyond container width
        const clampedX = Math.max(0, Math.min(localX, audioBoxWidth));

        const newTime = (clampedX / audioBoxWidth) * duration;
        scrubberPosition.current = newTime;

        onScrub(newTime); // Update playback position as user scrubs
      },

      onPanResponderRelease: () => {
        // Finalize
        onScrub(scrubberPosition.current);
      },
    })
  ).current;

  return (
    <View ref={containerRef} style={styles.audioBox}>
      <Svg height={WAVEFORM_HEIGHT} width={audioBoxWidth}>
        {waveformMockData.map((value, index) => {
          const barHeight = Math.max(value * WAVEFORM_HEIGHT, MIN_BAR_HEIGHT);
          const isPlayed = index < playedBars;
          const barColor = isPlayed ? "black" : "grey";

          return (
            <Rect
              key={index}
              x={index * (barWidth + barSpacing)}
              y={(WAVEFORM_HEIGHT - barHeight) / 2}
              width={barWidth}
              height={barHeight}
              fill={barColor}
              rx={barWidth / 2}
              ry={barWidth / 2}
            />
          );
        })}
      </Svg>

      {/* Invisible overlay to capture touch events */}
      <View
        style={StyleSheet.absoluteFillObject}
        {...panResponder.panHandlers}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  audioBox: {
    width: "100%",
    height: WAVEFORM_HEIGHT,
    backgroundColor: "transparent",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
});

export default WaveformSlider;
