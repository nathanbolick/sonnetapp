import TextBox from "./components/TextBox";
import React, { useState } from "react";
import AudioPlayer from "./components/AudioPlayer";
import Entypo from "@expo/vector-icons/Entypo";
import { View, StyleSheet, ScrollView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./screens/Home";
import SessionScreen from "./screens/SessionScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
  const [text, setText] = useState("");
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Set up stack navigation to move between welcome screen and subscribe screen here */}
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="SessionScreen"
          component={SessionScreen}
          options={{ title: "Session" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  playerButtons: {
    backgroundColor: "black", // Button background color
    borderRadius: 8, // Rounded corners
    height: 40, // Vertical padding
    alignItems: "center", // Center the text
    width: 40,
    alignSelf: "center",
  },
});
