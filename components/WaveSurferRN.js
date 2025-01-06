// WaveSurferRN.js
import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { WebView } from "react-native-webview";
import { View, StyleSheet } from "react-native";

// Wavesurfer HTML template
const WAVE_SURFER_HTML = (audioUrl) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>WaveSurfer in RN</title>
      <script src="https://unpkg.com/wavesurfer.js"></script>
      <style>
        * { margin: 0; padding: 0; }
        #waveform { width: 100%; height: 128px; }
        body, html { height: 100%; width: 100%; overflow: hidden; }
      </style>
    </head>
    <body>
      <div id="waveform"></div>
      <script>
        var wavesurfer = WaveSurfer.create({
          container: '#waveform',
          waveColor: '#ccc',
          progressColor: '#555',
          cursorColor: '#333',
          height: 80
        });
  
        wavesurfer.load('${audioUrl}');
  
        // Time updates
        wavesurfer.on('audioprocess', function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'timeupdate',
            currentTime: wavesurfer.getCurrentTime(),
            duration: wavesurfer.getDuration()
          }));
        });
  
        // Seek
        wavesurfer.on('seek', function(progress) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'seek',
            currentTime: wavesurfer.getCurrentTime(),
            duration: wavesurfer.getDuration(),
            progress: progress
          }));
        });
  
        // Ready
        wavesurfer.on('ready', function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'ready',
            duration: wavesurfer.getDuration()
          }));
        });
  
        // Listen for RN messages
        document.addEventListener('message', function(e) {
          try {
            var msg = JSON.parse(e.data);
            switch (msg.type) {
              case 'play':
                wavesurfer.play();
                break;
              case 'pause':
                wavesurfer.pause();
                break;
              case 'seek':
                if (msg.progress !== undefined) {
                  wavesurfer.seekTo(msg.progress);
                }
                break;
              default:
                break;
            }
          } catch (err) {
            console.log('Invalid message from RN:', e.data);
          }
        });
      </script>
    </body>
  </html>
  `;

const WaveSurferRN = forwardRef(function WaveSurferRN(
  { audioUrl, onTimeUpdate, onReady, onSeek, style },
  ref
) {
  const webviewRef = useRef(null);

  // Handle messages from the WebView (WaveSurfer)
  const handleMessage = (event) => {
    let data;
    try {
      data = JSON.parse(event.nativeEvent.data);
    } catch (err) {
      console.log("Invalid JSON from WebView:", event.nativeEvent.data);
      return;
    }

    if (data.type === "timeupdate") {
      onTimeUpdate?.(data.currentTime, data.duration);
    } else if (data.type === "ready") {
      onReady?.(data.duration);
    } else if (data.type === "seek") {
      onSeek?.(data.currentTime, data.duration, data.progress);
    }
  };

  // Expose methods via the ref
  useImperativeHandle(ref, () => ({
    play: () => {
      webviewRef.current?.injectJavaScript(
        `document.dispatchEvent(new MessageEvent('message', {
            data: JSON.stringify({ type: 'play' })
          }));`
      );
    },
    pause: () => {
      webviewRef.current?.injectJavaScript(
        `document.dispatchEvent(new MessageEvent('message', {
            data: JSON.stringify({ type: 'pause' })
          }));`
      );
    },
    seekTo: (progressFraction) => {
      webviewRef.current?.injectJavaScript(
        `document.dispatchEvent(new MessageEvent('message', {
            data: JSON.stringify({
              type: 'seek',
              progress: ${progressFraction}
            })
          }));`
      );
    },
  }));

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webviewRef}
        originWhitelist={["*"]}
        onMessage={handleMessage}
        source={{ html: WAVE_SURFER_HTML(audioUrl) }}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 150,
    backgroundColor: "#fff",
  },
});

export default WaveSurferRN;
